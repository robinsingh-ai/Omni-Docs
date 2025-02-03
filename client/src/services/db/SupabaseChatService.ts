import { supabase } from "../SupabaseClient";
import { ChatService } from "./ChatInterface";

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

    async createChat(userId: string, chatName: string) {
        return await supabase
            .from('chats')
            .insert({ user_id: userId, name: chatName });
    }
}

export default SupabaseChatService;