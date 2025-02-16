export interface AuthService {
    signUp(email: string, password: string): Promise<any>;
    signIn(email: string, password: string): Promise<any>;
    signInWithGoogle(): Promise<any>;
    signOut(): Promise<any>;
}