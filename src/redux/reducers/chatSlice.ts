import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Message from '../../models/Message';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const fetchResponse = createAsyncThunk(
    'chat/fetchResponse',
    async (message: string, { rejectWithValue }) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            // Generate content using the Gemini API
            const result = await model.generateContent(message);
            const response = await result.response;

            // Get the text from the response
            const text = response.text();

            if (text) {
                return new Message('bot', text);
            }

            return rejectWithValue('Empty response from Gemini API.');
        } catch (error: any) {
            // Handle specific Gemini API errors
            if (error.response?.error) {
                return rejectWithValue(error.response.error.message);
            }

            // Generic error handling
            return rejectWithValue(
                error.message || 'Failed to fetch response from Gemini.'
            );
        }
    }
);

const initialState = {
    messages: [] as Message[]
};

const chatSlice = createSlice({
    name: 'chat',
    initialState: initialState,
    reducers: {
        addUserMessage: (state, action) => {
            const message = new Message('user', action.payload);
            state.messages.push(message);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchResponse.fulfilled, (state, action) => {
            const message = new Message('bot', action.payload.text);
            state.messages.push(message);
        });
    },
});

export const { addUserMessage } = chatSlice.actions;
export default chatSlice.reducer;
