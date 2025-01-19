import { useEffect, useState } from "react";
import ChatScreen from "./ChatScreen";
import Sidebar from "./components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { toggleSidebar } from "./redux/reducers/sidebarSlice";
import ChatInput from "./components/ChatInput";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
    const dispatch = useDispatch<AppDispatch>();
    const sidebar = useSelector((state: RootState) => state.sidebar);
    const [isNewChat, setIsNewChat] = useState<boolean>(true);

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

    const handleInputSend = () => {
        setIsNewChat(false);
    };

    const NewChat = () => {
        return (
            <motion.div
                className="flex justify-center items-center min-h-screen"
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 100, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 100,
                    duration: 0.8,
                }}
            >
                <div className="max-w-3xl w-full">
                    <ChatInput
                        className="w-full z-20 mb-8"
                        onSend={handleInputSend}
                    />
                </div>
            </motion.div>
        );
    };

    return (
        <div className="flex">
            <Sidebar />
            <div
                className={`
                    flex-grow relative
                    transition-transform duration-300 ease-in-out
                    md:translate-x-0
                    ${sidebar.isOpen ? 'translate-x-32' : 'translate-x-0'}
                `}>
                <AnimatePresence mode="wait">
                    {isNewChat ? (
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
                            <ChatScreen />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}