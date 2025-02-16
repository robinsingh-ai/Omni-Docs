// routes.tsx
import { Route, Routes, Navigate } from 'react-router';
import ChatScreen from './pages/chat/ChatScreen';
import NewChat from './pages/chat/NewChat';
import LandingPage from './pages/landing/LandingPage';
import NotFound from './pages/NotFound';
import App from './App';
import LoginPage from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import ForgotPassword from './pages/auth/ForgotPassword';
import NewPassword from './pages/auth/NewPassword';
// import { supabase } from './services/SupabaseClient';

const AppRoutes = () => {
    const isChatSubdomain = window.location.host.startsWith('chat.');
    const auth = useSelector((state: RootState) => state.auth);
    // supabase.auth.onAuthStateChange((event, session) => {
    //     console.log('event', event);
    //     console.log('session', session);
    // });
    return (
        <Routes>
            {isChatSubdomain ? (
                // Routes for the chat subdomain
                auth.user && auth.isAuthenticated ? (
                    <Route path="/" element={<App />}>
                        <Route index element={<NewChat />} />
                        <Route path="chat/:chatId" element={<ChatScreen />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                ) : (
                    <>
                        <Route path="/reset_password" element={<NewPassword />} />
                        <Route path="/sign_in" element={<LoginPage />} />
                        <Route path="/sign_up" element={<SignUp />} />
                        <Route path='/forgot_password' element={<ForgotPassword />} />
                        <Route path="*" element={<Navigate to="/sign_in" />} />
                    </>
                )
            ) : (
                // Routes for the main domain
                <>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/terms-of-service" element={<LandingPage />} />
                    <Route path="/privacy" element={<LandingPage />} />
                    {/* <Route path="/sign_in" element={<LoginPage />} />
                    <Route path="/sign_up" element={<SignUp />} /> */}
                    <Route path="*" element={<NotFound />} />
                </>
            )}
        </Routes>
    );
};

export default AppRoutes;
