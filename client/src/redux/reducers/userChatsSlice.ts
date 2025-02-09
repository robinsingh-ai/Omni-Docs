import { SupabaseFactory } from 'src/services/db/SupabaseFactory';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Chat {
    id?: string;
    name: string;
    agent: string;
    model: string;
    created_at?: string;
}

interface ChatsState {
    chats: Chat[];
    chatsLoading: boolean;
    error: string | null;
}

const initialState: ChatsState = {
    chats: [],
    chatsLoading: false,
    error: null,
};

// Fetch list of chats for a user
export const fetchChats = createAsyncThunk<Chat[], string, { rejectValue: string }>(
    'chats/fetchChats',
    async (userId, { rejectWithValue }) => {
        try {
            const { data, error } = await SupabaseFactory.chatService.fetchChatsByUserId(userId);
            if (error) throw new Error(error.message);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch chats');
        }
    }
);

export const createChat = createAsyncThunk<Chat, { userId: string; chat: Chat }, { rejectValue: string }>(
    'chats/createChat',
    async ({ userId, chat }, { rejectWithValue }) => {
        try {
            const { data, error } = await SupabaseFactory.chatService.createChat(userId, chat);
            if (error || !data) throw new Error(error!.message);
            return data[0];
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create chat');
        }
    }
);

const userChatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchChats.pending, (state) => {
                state.chatsLoading = true;
                state.error = null;
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.chatsLoading = false;
                state.chats = action.payload;
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.chatsLoading = false;
                state.error = action.payload || 'An error occurred';
            })
            .addCase(createChat.pending, (state) => {
                state.chatsLoading = true;
                state.error = null;
            })
            .addCase(createChat.fulfilled, (state, action) => {
                state.chatsLoading = false;
                state.chats.unshift(action.payload);
            })
            .addCase(createChat.rejected, (state, action) => {
                state.chatsLoading = false;
                state.error = action.payload || 'An error occurred';
            });
    },
});

export default userChatsSlice.reducer;
