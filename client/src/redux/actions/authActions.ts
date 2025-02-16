import { SupabaseFactory } from 'src/services/db/SupabaseFactory';

export const SIGN_UP = 'SIGN_UP';
export const SIGN_IN = 'SIGN_IN';
export const GOOGLE_SIGN_IN = 'GOOGLE_SIGN_IN';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';  // Add a new action type for forgot password

const authService = SupabaseFactory.authService;

export const signUp = (email: string, password: string) => async (dispatch: any) => {
    const response = await authService.signUp(email, password);
    dispatch({ type: SIGN_UP, payload: response });
};

export const signIn = (email: string, password: string) => async (dispatch: any) => {
    const response = await authService.signIn(email, password);
    dispatch({ type: SIGN_IN, payload: response });
};

// Define the forgotPassword function
export const forgotPassword = (email: string) => async (dispatch: any) => {
    const response = await authService.resetPasswordForEmail(email);  // This function name might vary based on your authService implementation
    dispatch({ type: FORGOT_PASSWORD, payload: response });
};
