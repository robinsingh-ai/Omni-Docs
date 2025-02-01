// routes.tsx
import { Route, Routes, Navigate } from 'react-router';
import ChatScreen from './pages/chat/ChatScreen';
import NewChat from './pages/chat/NewChat';
import LandingPage from './pages/landing/LandingPage';
import NotFound from './pages/NotFound';
import App from './App';
import LoginPage from './pages/auth/Login';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './redux/store';
import { supabase } from './services/db/SupabaseService';
import { setUser } from './redux/reducers/authSlice';
import SignUp from './pages/auth/SignUp';

const AppRoutes = () => {
    const isChatSubdomain = window.location.host.startsWith('chat.');
    const dispatch = useDispatch<AppDispatch>();
    const { auth } = useAuth();
    useEffect(() => {
        const session = supabase.auth.getSession();
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            dispatch(setUser(session?.user ?? null));
        });
        return () => {
            // authListener.unsubscribe();
        };
    }, []);

    return (
        <Routes>
            {isChatSubdomain ? (
                // Routes for the chat subdomain
                auth.user ? (
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
                    <Route path="/sign_in" element={<LoginPage />} />
                    <Route path="/sign_up" element={<SignUp />} />
                    <Route path="*" element={<NotFound />} />
                </>
            )}
        </Routes>
    );
};

export default AppRoutes;
