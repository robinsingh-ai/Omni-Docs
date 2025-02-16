import { Chat } from "@/src/redux/reducers/userChatsSlice";
import { supabase } from "../SupabaseClient";
import { ChatService } from "./ChatInterface";
import { UserType } from "@/src/utils/Constants";

class SupabaseChatService implements ChatService {
    private static instance: SupabaseChatService;

    private constructor() { }

    static getInstance(): SupabaseChatService {
        if (!SupabaseChatService.instance) {
            SupabaseChatService.instance = new SupabaseChatService();
        }
        return SupabaseChatService.instance;
    }

    async fetchChatsByUserId(userId: string) {
        return await supabase
            .from('chats')
            .select('*')
            .eq('user_id', userId);
    }

    async createChat(userId: string, chat: Chat) {
        const resp = await supabase
            .from('chats')
            .insert(
                {
                    user_id: userId,
                    name: chat.name,
                    agent: chat.agent,
                    model: chat.model,
                }
            ).select();
        return resp;
    }

    async sendMessage(chatId: string, message: string, sender: UserType) {
        return await supabase
            .from('messages')
            .insert(
                {
                    chat_id: chatId,
                    message: message,
                    sender: sender,
                }
            ).select();
    }

    async fetchChatById(chatId: string) {
        return await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId);
    }

    async deleteChatById(chatId: string) {
        try {
            const resp1 = await supabase
                .from('messages')
                .delete()
                .eq('chat_id', chatId)
                .select();
            const resp2 = await supabase
                .from('chats')
                .delete()
                .eq('id', chatId)
                .select();
            return [resp1, resp2];
        } catch (e) {
            console.error(e);
        }
    }

    async deleteMessageById(messageId: string, chatId: string) {
        return await supabase
            .from('messages')
            .delete()
            .eq('id', messageId)
            .eq('chat_id', chatId)
            .select();
    }

    async deleteMessages(messages: { id: string; chat_id: string }[]) {
        const messageIds = messages.map((msg) => msg.id);
        return await supabase
            .from('messages')
            .delete()
            .in('id', messageIds)
            .eq('chat_id', messages[0].chat_id)
            .select();
    }
}
export default SupabaseChatService;