import { SupabaseFactory } from 'src/services/db/SupabaseFactory';

export const SIGN_UP = 'SIGN_UP';
export const SIGN_IN = 'SIGN_IN';
export const GOOGLE_SIGN_IN = 'GOOGLE_SIGN_IN';

const authService = SupabaseFactory.authService;

export const signUp = (email: string, password: string) => async (dispatch: any) => {
    const response = await authService.signUp(email, password);
    dispatch({ type: SIGN_UP, payload: response });
};

export const signIn = (email: string, password: string) => async (dispatch: any) => {
    const response = await authService.signIn(email, password);
    dispatch({ type: SIGN_IN, payload: response });
};
