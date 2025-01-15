import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ResponseProviderFactory } from '../../services/ResponseProviderFactory';
import { LLM_Provider } from '@/src/services/ResponseProvider';

export const fetchResponse = createAsyncThunk<
    any,
    { provider_name: LLM_Provider; message: string; dataSource: string },
    { rejectValue: Object }
>(
    'chat/fetchResponse',
    async ({ provider_name, message, dataSource }, { rejectWithValue }) => {
        try {
            const provider = ResponseProviderFactory.getProvider(provider_name);
            const response = await provider.generateResponse(message, dataSource);
            const responseText = response.answer;
            if (responseText) {
                return {
                    sender: 'bot',
                    text: responseText,
                    status: 'success',
                    sources: response.source_documents,
                    timestamp: new Date().toISOString(),
                }
            }

            return rejectWithValue({
                sender: 'bot',
                text: 'Something went wrong. Please try again.',
                sources: [],
                status: 'error',
                timestamp: new Date().toISOString(),
            });
        } catch (error: any) {
            return rejectWithValue({
                sender: 'bot',
                text: 'Something went wrong. Please try again.',
                sources: [],
                status: 'error',
                timestamp: new Date().toISOString(),
            });
        }
    }
);

export const streamResponse = createAsyncThunk<
    void,
    { provider_name: LLM_Provider; message: string; dataSource: string },
    { rejectValue: Object }
>(
    'chat/streamResponse',
    async ({ provider_name, message, dataSource }, { dispatch }) => {
        const provider = ResponseProviderFactory.getProvider(provider_name);
        await provider.streamResponse(message, dataSource, (chunk: string) => {
            dispatch(addStreamedMessage({ sender: 'bot', text: chunk }));
        });
    }
);

const initialState = {
    messages: [] as any[],
    loading: false,
    error: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addUserMessage: (state, action) => {
            state.messages.push({
                sender: 'user',
                status: 'success',
                text: action.payload,
                timestamp: new Date().toISOString(),
            });
        },
        addStreamedMessage: (state, action) => {
            const lastMessage = state.messages[state.messages.length - 1];
            if (lastMessage && lastMessage.sender === 'bot') {
                lastMessage.text += action.payload.text;
            } else {
                state.messages.push({
                    sender: 'bot',
                    status: 'success',
                    text: action.payload.text,
                    timestamp: new Date().toISOString(),
                });
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchResponse.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchResponse.fulfilled, (state, action) => {
            state.loading = false;
            state.messages.push(action.payload);
        });
        builder.addCase(fetchResponse.rejected, (state, action) => {
            state.loading = false;
            if (action.payload) {
                state.messages.push(action.payload);
            } else {
                state.messages.push({
                    sender: 'bot',
                    text: 'Failed to fetch response from provider.',
                    sources: [],
                    timestamp: new Date().toISOString(),
                });
            }
        });

        builder.addCase(streamResponse.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(streamResponse.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(streamResponse.rejected, (state) => {
            state.loading = false;
            state.messages.push({
                sender: 'bot',
                text: 'Streaming failed. Please try again.',
                status: 'error',
                timestamp: new Date().toISOString(),
            });
        });
    },
});

export const { addUserMessage, addStreamedMessage } = chatSlice.actions;
export default chatSlice.reducer;