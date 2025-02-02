import { AuthService } from './AuthInterface';
import { ChatService } from './ChatInterface';
import { SupabaseAuthService } from './SupabaseAuthService';
import { SupabaseChatService } from './SupabaseChatService';

export const SupabaseFactory = {
    authService: SupabaseAuthService as AuthService,
    chatService: SupabaseChatService as ChatService,
};