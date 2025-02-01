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
        await provider.streamResponse(message, dataSource, (chunk: any) => {
            if (chunk.type === 'sources') {
                dispatch(addStreamedMessage({
                    sender: 'bot',
                    text: "",
                    type: chunk.type,
                    status: 'success',
                    sources: chunk.content,
                }));
            }
            else if (chunk.type === 'markdown') {
                dispatch(addStreamedMessage({
                    type: 'markdown',
                    sender: 'bot', text: chunk.content,
                    status: 'success',
                }));
            } else if (chunk.type === 'error') {
                dispatch(addStreamedMessage({
                    type: 'error',
                    sender: 'bot', text: 'Streaming failed. Please try again.', status: 'error',
                }));
            } else {
                console.log("No chunk type found");
            }
        });
    }
);

const initialState = {
    isNewChat: true,
    messages: [] as any[],
    loading: false,
    animating: false,
    error: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setNewChat: (state, action) => {
            state.isNewChat = action.payload;
            if (action.payload) {
                state.messages = [];
            }
        },
        setAnimating: (state, action) => {
            state.animating = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        addUserMessage: (state, action) => {
            state.messages.push({
                sender: 'user',
                status: 'success',
                text: action.payload,
                timestamp: new Date().toISOString(),
            });
            console.log("added to queue:", state.messages);
        },
        addStreamedMessage: (state, action) => {
            // Invoked when a chunk of streamed response is received
            const { sender, status, type, text, sources } = action.payload;
            const lastMessageIndex = state.messages.length - 1;
            const lastMessage = state.messages[lastMessageIndex];
            if (lastMessage?.sender === 'bot') {
                state.messages[lastMessageIndex] = {
                    ...lastMessage,
                    text: lastMessage.text + text,
                }
            } else {
                // start of bot message
                state.messages.push({
                    sender,
                    status,
                    type,
                    text,
                    sources: sources || [],
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

export const { addUserMessage, addStreamedMessage, setAnimating, setLoading, setNewChat } = chatSlice.actions;
export default chatSlice.reducer;