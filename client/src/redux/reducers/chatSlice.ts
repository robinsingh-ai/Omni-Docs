import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ResponseProviderFactory } from '../../services/ResponseProviderFactory';
import { LLM_Provider } from 'src/services/ResponseProvider';
import { UserType } from 'src/utils/Constants';
import { SupabaseFactory } from 'src/services/db/SupabaseFactory';
import { RootState } from '../store';
import { LocalLLMProvider } from 'src/services/LocalLLMProvider';

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
                    animate: true,
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
    {
        provider_name: LLM_Provider;
        message: string;
        agent: string
    },
    {
        rejectValue: Object;
        state: RootState;
    }
>(
    'chat/streamResponse',
    async ({ provider_name, message, agent }, { dispatch, rejectWithValue, getState }) => {
        const provider = ResponseProviderFactory.getProvider(provider_name);
        let collectedResponse = '';
        try {
            await provider.streamResponse(message, agent, (chunk: any) => {
                switch (chunk.type) {
                    case 'sources':
                        dispatch(addStreamedMessage({
                            sender: 'bot',
                            message: "",
                            type: chunk.type,
                            animate: true,
                            status: 'success',
                            sources: chunk.sources,
                        }));
                        break;

                    case 'markdown':
                        if (chunk.content) {
                            dispatch(addStreamedMessage({
                                type: 'markdown',
                                sender: 'bot',
                                animate: true,
                                message: chunk.content,
                                status: 'success',
                            }));
                            collectedResponse += chunk.content;
                        }
                        break;

                    case 'end':
                        dispatch(setAnimating(false));
                        const state = getState();
                        const chatId = state.app.chatId;
                        if (chatId && collectedResponse) {
                            dispatch(sendMessage({
                                chat_id: chatId,
                                message: collectedResponse,
                                sender: 'bot'
                            }));
                        }
                        break;
                    case 'error':
                        throw new Error(chunk.message);

                    default:
                        if (chunk.toString().includes('TypeError') || chunk instanceof TypeError) {
                            throw new Error(chunk.message);
                        }
                }
            });
        } catch (error) {
            return rejectWithValue({
                sender: 'bot',
                message: error instanceof Error ? error.message : 'Streaming failed. Please try again.',
                status: 'error',
                timestamp: new Date().toISOString(),
            });
        }
    }
);

export const stopStreaming = createAsyncThunk<void, { provider_name: LLM_Provider }>(
    'chat/stopStreaming',
    async ({ provider_name }) => {
        console.log("Stopping streaming...");
        const provider = ResponseProviderFactory.getProvider(provider_name);
        if (provider instanceof LocalLLMProvider) {
            provider.stopStreaming();
        }
    }
);

export const fetchChatById = createAsyncThunk<Object, string, { rejectValue: Object }>(
    'chats/fetchChatById',
    async (chat_id, { rejectWithValue }) => {
        try {
            const { data, error } = await SupabaseFactory.chatService.fetchChatById(chat_id);
            if (error) throw new Error(error.message);
            return data;
        }
        catch (error: any) {
            return rejectWithValue({
                sender: 'bot',
                message: 'Failed to fetch chat',
                status: 'error',
                timestamp: new Date().toISOString(),
            });
        }
    }
);

export const deleteChatById = createAsyncThunk<Object, string, { rejectValue: Object }>(
    'chats/deleteChatById',
    async (chat_id, { rejectWithValue }) => {
        try {
            const responses = await SupabaseFactory.chatService.deleteChatById(chat_id) as any[];
            if (responses[0].status !== 200 && responses[1].status !== 200) {
                throw new Error('Failed to delete chat');
            }
        }
        catch (error: any) {
            return rejectWithValue({
                sender: 'bot',
                message: 'Failed to delete chat',
                status: 'error',
                timestamp: new Date().toISOString(),
            });
        }
    }
);

export const sendMessage = createAsyncThunk<Object, { chat_id: string, message: string, sender: UserType }, { rejectValue: Object }>(
    'chats/sendMessage',
    async ({ chat_id, message, sender }, { rejectWithValue }) => {
        try {
            const { data, error } = await SupabaseFactory.chatService.sendMessage(chat_id, message, sender);
            if (error) throw new Error(error.message);
            return data;
        } catch (error: any) {
            return rejectWithValue({
                sender: 'bot',
                message: 'Failed to send message',
                status: 'error',
                timestamp: new Date().toISOString(),
            });
        }
    }
);

export const deleteMessagesById = createAsyncThunk<Object, string, { rejectValue: Object }>(
    'chats/deleteMessages',
    async (messages: any, { rejectWithValue }) => {
        try {
            const { data, error } = await SupabaseFactory.chatService.deleteMessages(messages);
            if (error) throw new Error(error.message);
            return data;
        } catch (error: any) {
            return rejectWithValue({
                sender: 'bot',
                message: 'Failed to delete messages',
                status: 'error',
                timestamp: new Date().toISOString(),
            });
        }
    }
);

const initialState = {
    isNewChat: true,
    messages: [] as any[],
    isFetchingChat: false,
    respLoading: false,
    messageSending: false,
    animating: false,
    error: null,
};

const chatReducer = createSlice({
    name: 'chatResponse',
    initialState,
    reducers: {
        setNewChat: (state, action) => {
            state.isNewChat = action.payload;
            if (action.payload) {
                state.messages = [];
            }
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setAnimating: (state, action) => {
            state.animating = action.payload;
        },
        setSendingMessage: (state, action) => {
            state.messageSending = action.payload;
        },
        setFetchingChat: (state, action) => {
            state.isFetchingChat = action.payload;
        },
        addUserMessage: (state, action) => {
            state.messages.push({
                sender: 'user',
                status: 'success',
                message: action.payload.message,
                chatId: action.payload.chat_id,
                timestamp: new Date().toISOString(),
            });
        },
        addStreamedMessage: (state, action) => {
            // Invoked when a chunk of streamed response is received
            // state.respLoading = false;
            const { sender, status, type, message, sources } = action.payload;
            const lastMessageIndex = state.messages.length - 1;
            const lastMessage = state.messages[lastMessageIndex];
            if (lastMessage?.sender === 'bot') {
                state.messages[lastMessageIndex] = {
                    ...lastMessage,
                    animate: true,
                    message: lastMessage.message + message,
                }
            } else {
                // start of bot message
                console.log("Start of bot message...");
                state.messages.push({
                    sender,
                    status,
                    type,
                    message,
                    animate: true,
                    sources: sources || [],
                    timestamp: new Date().toISOString(),
                });
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchResponse.pending, (state) => {
            state.respLoading = true;
        });
        builder.addCase(fetchResponse.fulfilled, (state, action) => {
            state.respLoading = false;
            state.messages.push(action.payload);
        });
        builder.addCase(fetchResponse.rejected, (state, action) => {
            state.respLoading = false;
            if (action.payload) {
                state.messages.push(action.payload);
            } else {
                state.messages.push({
                    sender: 'bot',
                    message: 'Failed to fetch response from provider.',
                    sources: [],
                    timestamp: new Date().toISOString(),
                });
            }
        });

        builder.addCase(streamResponse.pending, (state) => {
            state.respLoading = true;
        });
        builder.addCase(streamResponse.fulfilled, (state) => {
            state.respLoading = false;
        });
        builder.addCase(streamResponse.rejected, (state) => {
            state.respLoading = false;
            state.messages.push({
                sender: 'bot',
                message: 'Streaming failed. Please try again.',
                status: 'error',
                timestamp: new Date().toISOString(),
            });
        });
        builder.addCase(fetchChatById.pending, (state) => {
            state.isFetchingChat = true;
        });
        builder.addCase(fetchChatById.fulfilled, (state, action) => {
            state.isFetchingChat = false;
            // add success = true for each bot message
            const msgs = action.payload! as any[];
            msgs.forEach((msg: any) => {
                if (msg.sender === 'bot') {
                    msg.status = 'success';
                    msg.animate = false;
                }
            });
            state.messages = msgs;
        });

        builder.addCase(sendMessage.pending, (state) => {
            state.messageSending = true;
        });
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            state.messageSending = false;
        });
        builder.addCase(deleteChatById.pending, (state) => {
            state.isFetchingChat = true;
        });
        builder.addCase(deleteChatById.fulfilled, (state) => {
            state.isFetchingChat = false;
            state.isNewChat = true;
            state.messages = [];
        });
        builder.addCase(stopStreaming.fulfilled, (state) => {
            state.respLoading = false;
            state.animating = false;
            state.messageSending = false;
        });
    },
});

export const { addUserMessage, addStreamedMessage, setAnimating, setFetchingChat, setSendingMessage, setNewChat, setMessages } = chatReducer.actions;
export default chatReducer.reducer;