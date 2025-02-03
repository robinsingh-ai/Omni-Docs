import { supabase } from "../SupabaseClient";
import { AuthService } from "./AuthInterface";

class SupabaseAuthService implements AuthService {
    private static instance: SupabaseAuthService;

    private constructor() {} // Private constructor to prevent direct instantiation

    static getInstance(): SupabaseAuthService {
        if (!SupabaseAuthService.instance) {
            SupabaseAuthService.instance = new SupabaseAuthService();
        }
        return SupabaseAuthService.instance;
    }

    async signUp(email: string, password: string) {
        return await supabase.auth.signUp({ email, password });
    }

    async signIn(email: string, password: string) {
        return await supabase.auth.signInWithPassword({ email, password });
    }

    async signInWithGoogle() {
        return await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'profile',
                redirectTo: 'http://chat.localhost:3000',
            },
        });
    }

    async signOut() {
        return await supabase.auth.signOut();
    }
}

export default SupabaseAuthService;