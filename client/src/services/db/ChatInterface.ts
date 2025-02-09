import { Chat } from "src/redux/reducers/userChatsSlice";

export interface ChatService {
    fetchChatsByUserId(userId: string): Promise<any>;
    createChat(userId: string, chat: Chat): Promise<any>;
    fetchChatById(chatId: string): Promise<any>;
}