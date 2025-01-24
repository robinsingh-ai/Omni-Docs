import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { toggleSidebar } from "./redux/reducers/sidebarSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router";
import NewChat from "./pages/chat/NewChat";

export default function App() {
    const dispatch = useDispatch<AppDispatch>();
    const sidebar = useSelector((state: RootState) => state.sidebar);
    const isNewChat = useSelector((state: RootState) => state.chat.isNewChat);
    const location = useLocation(); //

    const checkWindowSize = () => {
        if (typeof window !== 'undefined') {
            if (sidebar.isOpen && window.innerWidth <= 768) {
                dispatch(toggleSidebar());
            }
        }
    };

    useEffect(() => {
        window.addEventListener('resize', checkWindowSize);
        return () => window.removeEventListener('resize', checkWindowSize);
    }, [sidebar.isOpen, dispatch]);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div
                className={` flex-grow relative transition-transform duration-300 ease-in-out
                    md:translate-x-0
                    ${sidebar.isOpen ? 'translate-x-32' : 'translate-x-0'}
                `}>
                <AnimatePresence mode="wait">
                    {isNewChat && location.pathname === '/' ? (
                        <motion.div
                            key="new-chat"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <NewChat />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat-screen"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Outlet />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}