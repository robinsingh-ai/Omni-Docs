export interface DatabaseService {
    signUp(email: string, password: string): Promise<any>;
    signIn(email: string, password: string): Promise<any>;
    fetchChats(userId: string): Promise<any>;
}
