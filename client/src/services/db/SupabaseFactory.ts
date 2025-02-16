import SupabaseAuthService from "./SupabaseAuthService";
import SupabaseChatService from "./SupabaseChatService";

export const SupabaseFactory = {
    authService: SupabaseAuthService.getInstance(),
    chatService: SupabaseChatService.getInstance(),
};