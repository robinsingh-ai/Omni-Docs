import { supabase } from "../SupabaseClient";

export const SupabaseAuthService = {
    signUp: async (email: string, password: string) => {
        return await supabase.auth.signUp({ email, password });
    },
    signIn: async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({ email, password });
    },
    signInWithGoogle: async () => {
        // const redirectTo = `${window.location.protocol}//chat.${window.location.hostname}:${window.location.port}/`;
        return await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'profile',
                redirectTo: 'http://chat.localhost:3000'
            },
        });
    },
    signOut: async () => {
        return await supabase.auth.signOut();
    },
};
