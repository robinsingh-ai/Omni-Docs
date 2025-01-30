import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const SupabaseService = {
    signUp: async (email: string, password: string) => {
        return await supabase.auth.signUp({ email, password });
    },
    signIn: async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({ email, password });
    },
    fetchChats: async (userId: string) => {
        return await supabase
            .from('chats')
            .select('*')
            .eq('user_id', userId);
    },
};
