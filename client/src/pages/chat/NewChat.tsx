import { motion } from "framer-motion";
import ChatInput from "../../components/ChatInput";
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { setNewChat } from "../../redux/reducers/chatSlice";
import { useNavigate } from "react-router";
interface NewChatProps { }

const NewChat: React.FC<NewChatProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    return (
        <motion.div
            className="flex justify-center items-center min-h-screen"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 50, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
                type: "spring",
                damping: 20,
                stiffness: 100,
                duration: 0.8,
            }}
        >
            <div className="max-w-3xl w-full">
                <div className="flex justify-center">
                    <p className="text-xl my-4">AI Chatbot</p>
                </div>
                <ChatInput
                    className="w-full z-20 mb-8"
                    onSend={() => {
                        dispatch(setNewChat(false));
                        navigate("/chat");
                    }}
                />
            </div>
        </motion.div>
    );
};

export default NewChat;