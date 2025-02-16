import { useDispatch, useSelector } from 'react-redux';
import { signIn, signUp } from '../redux/actions/authActions';
import { AppDispatch, RootState } from '../redux/store';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.auth);

    const handleSignUp = (email: string, password: string) => {
        dispatch(signUp(email, password));
    };

    const handleSignIn = (email: string, password: string) => {
        dispatch(signIn(email, password));
    };

    return { auth, handleSignUp, handleSignIn };
};
