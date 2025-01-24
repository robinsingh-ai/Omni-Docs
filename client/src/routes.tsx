// routes.tsx
import { Route, Routes } from 'react-router';
import ChatScreen from './pages/chat/ChatScreen';
import NewChat from './pages/chat/NewChat';
import LandingPage from './pages/landing/LandingPage';
import NotFound from './pages/NotFound';
import App from './App';

const AppRoutes = () => {
    const isChatSubdomain = window.location.host.startsWith('chat.');
    return (
        <Routes>
            {isChatSubdomain ? (
                // Routes for the chat subdomain
                <>
                    <Route path="/" element={<App />}>
                        <Route index element={<NewChat />} />
                        <Route path="chat" element={<ChatScreen />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </>
            ) : (
                // Routes for the main domain
                <>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="*" element={<NotFound />} />
                </>
            )}
        </Routes>
    );
};

export default AppRoutes;