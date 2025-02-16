import { supabase } from "../SupabaseClient";
import { AuthService } from "./AuthInterface";

class SupabaseAuthService implements AuthService {
    private static instance: SupabaseAuthService;

    private constructor() { } // Private constructor to prevent direct instantiation

    static getInstance(): SupabaseAuthService {
        if (!SupabaseAuthService.instance) {
            SupabaseAuthService.instance = new SupabaseAuthService();
        }
        return SupabaseAuthService.instance;
    }

    async signUp(email: string, password: string) {
        const username = email.split('@')[0];
        return await supabase.auth.signUp({
            email, password,
            options: {
                data: {
                    username,
                },
                emailRedirectTo: `${process.env.REACT_APP_SUBDOMAIN}/sign_in`,
            }
        });
    }

    async signIn(email: string, password: string) {
        try {
            const response = await supabase.auth.signInWithPassword({ email, password });
            if (response.error) {
                console.error("Error signing in:", response.error);
                return response;
            }
            return response;
        } catch (error) {
            console.error("Error signing in:", error);
            return error;
        }
    }

    // add proper function with return type
    async signInWithGoogle() {
        return await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'profile',
                redirectTo: process.env.REACT_APP_SUBDOMAIN
            },
        });
    }

    async signOut() {
        return await supabase.auth.signOut();
    }
}

export default SupabaseAuthService;