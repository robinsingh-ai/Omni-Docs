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

const AppRoutes = () => {
    const isChatSubdomain = window.location.host.startsWith('chat.');
    const auth = useSelector((state: RootState) => state.auth);
    console.log('auth', auth)
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
