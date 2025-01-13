import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ResponseProviderFactory } from '../../services/ResponseProviderFactory';
import { LLM_Provider } from '@/src/services/ResponseProvider';

export const fetchResponse = createAsyncThunk<
    any,
    { provider_name: LLM_Provider; message: string; dataSource: string },
    { rejectValue: string }
>(
    'chat/fetchResponse',
    async ({ provider_name, message, dataSource }, { rejectWithValue }) => {
        try {
            console.log('Fetching response from provider:', provider_name, message, dataSource.toString());
            const provider = ResponseProviderFactory.getProvider(provider_name);
            const response = await provider.generateResponse(message, dataSource);
            console.log('Response:', response);
            const responseText = response.content;
            if (responseText) {
                return {
                    sender: 'bot',
                    text: responseText,
                    timestamp: new Date().toISOString(),
                }
            }

            return rejectWithValue('Empty response from provider.');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch response from provider.');
        }
    }
);

const initialState = {
    messages: [] as any[],
    loading: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addUserMessage: (state, action) => {
            state.messages.push({
                sender: 'user',
                text: action.payload,
                timestamp: new Date().toISOString(),
            });
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchResponse.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchResponse.fulfilled, (state, action) => {
            state.loading = false;
            console.log('Received response:', action.payload);
            state.messages.push(action.payload);
        });
        builder.addCase(fetchResponse.rejected, (state, action) => {
            state.loading = false;
            state.messages.push({
                sender: 'bot',
                text: action.payload || 'Failed to fetch response from provider.',
                timestamp: new Date().toISOString(),
            });
        });
    },
});

export const { addUserMessage } = chatSlice.actions;
export default chatSlice.reducer;