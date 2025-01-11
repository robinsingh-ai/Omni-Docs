import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Message from '../../models/Message';
import { ResponseProviderFactory } from '../../services/ResponseProviderFactory';
import { LLM_Provider } from '@/src/services/ResponseProvider';

export const fetchResponse = createAsyncThunk<
    Message,
    { provider_name: LLM_Provider; message: string; dataSource: string },
    { rejectValue: string }
>(
    'chat/fetchResponse',
    async ({ provider_name, message, dataSource }, { rejectWithValue }) => {
        try {
            const provider = ResponseProviderFactory.getProvider(provider_name);
            const response = await provider.generateResponse(message, dataSource);
            console.log('Response:', response);
            const responseText = response.content;
            if (responseText) {
                return new Message('bot', responseText);
            }

            return rejectWithValue('Empty response from provider.');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch response from provider.');
        }
    }
);

const initialState = {
    messages: [] as Message[],
    loading: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addUserMessage: (state, action) => {
            const message = new Message('user', action.payload);
            state.messages.push(message);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchResponse.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchResponse.fulfilled, (state, action) => {
            state.loading = false;
            console.log('Received response:', action.payload);
            const message = new Message('bot', action.payload.text);
            state.messages.push(message);
        });
        builder.addCase(fetchResponse.rejected, (state, action) => {
            state.loading = false;
            const message = new Message('bot', action.payload || 'Failed to fetch response from provider.');
            state.messages.push(message);
        });
    },
});

export const { addUserMessage } = chatSlice.actions;
export default chatSlice.reducer;