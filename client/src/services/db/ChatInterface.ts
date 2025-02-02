export interface ChatService {
    fetchChatsByUserId(userId: string): Promise<any>;
    createChat(userId: string, chatName: string): Promise<any>;
}