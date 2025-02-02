// routes.tsx
import { Route, Routes, Navigate } from 'react-router';
import ChatScreen from './pages/chat/ChatScreen';
import NewChat from './pages/chat/NewChat';
import LandingPage from './pages/landing/LandingPage';
import NotFound from './pages/NotFound';
import App from './App';
import LoginPage from './pages/auth/Login';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './redux/store';
import { setAuth } from './redux/reducers/authSlice';
import SignUp from './pages/auth/SignUp';
import { supabase } from './services/SupabaseClient';
import { setLoading } from './redux/reducers/chatSlice';

const AppRoutes = () => {
    const isChatSubdomain = window.location.host.startsWith('chat.');
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.auth);
    const isLocalhost = window.location.hostname === "localhost";
    const secureFlag = isLocalhost ? "" : "secure";

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            dispatch(setLoading(true));
            if (event === 'SIGNED_OUT') {
                dispatch(setAuth({
                    user: null,
                    isAuthenticated: false,
                    provider: null
                }));

            } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
                dispatch(setAuth({
                    user: session.user,
                    isAuthenticated: true,
                    provider: 'google'
                }));

            }
            data.subscription.unsubscribe();
        });
        dispatch(setLoading(false));
    }, [auth, dispatch]);

    console.log('isLoggedIn:', auth.user && auth.isAuthenticated);
    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Routes>
            {isChatSubdomain ? (
                // Routes for the chat subdomain
                auth.user && auth.isAuthenticated ? (
                    <Route path="/" element={<App />}>
                        <Route index element={<NewChat />} />
                        <Route path="chat" element={<ChatScreen />} />
                    </Route>
                ) : (
                    <>
                        <Route path="/sign_in" element={<LoginPage />} />
                        <Route path="/sign_up" element={<SignUp />} />
                        <Route path="*" element={<Navigate to="/sign_in" />} />
                    </>
                )
            ) : (
                // Routes for the main domain
                <>
                    <Route path="/" element={<LandingPage />} />
                    {/* <Route path="/sign_in" element={<LoginPage />} />
                    <Route path="/sign_up" element={<SignUp />} /> */}
                    <Route path="*" element={<NotFound />} />
                </>
            )}
        </Routes>
    );
};

export default AppRoutes;
