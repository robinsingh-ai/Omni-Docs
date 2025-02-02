import { supabase } from "../SupabaseClient";

export const SupabaseChatService = {
    fetchChatsByUserId: async (userId: string) => {
        return await supabase
            .from('chats')
            .select('*')
            .eq('user_id', userId);
    },
    createChat: async (userId: string, chatName: string) => {
        return await supabase
            .from('chats')
            .insert({ user_id: userId, name: chatName });
    },
};
