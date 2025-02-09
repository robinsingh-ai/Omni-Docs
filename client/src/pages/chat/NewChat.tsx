import { motion } from "framer-motion";
import ChatInput from "../../components/ChatInput";
import React from "react";
import { useDispatch } from "react-redux";
import { addUserMessage, sendMessage, setNewChat } from "../../redux/reducers/chatSlice";
import { useNavigate } from "react-router";
import { AppDispatch, RootState } from "src/redux/store";
import { createChat } from "src/redux/reducers/userChatsSlice";
import { useSelector } from "react-redux";
interface NewChatProps { }

const NewChat: React.FC<NewChatProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const app = useSelector((state: RootState) => state.app);
    const auth = useSelector((state: RootState) => state.auth)

    const handleCreateChat = async (query: string) => {
        if (auth.user) {
            console.log("Creating new chat...");
            const userId = auth.user ? (auth.user as any).id : null;
            dispatch(setNewChat(false));
            const chat = {
                userId: userId,
                chat: {
                    name: query.length > 20 ? query.substring(0, 20) : query,
                    agent: app.agent,
                    model: app.model,
                }
            };

            try {
                const resultAction = await dispatch(createChat(chat));
                if (createChat.fulfilled.match(resultAction)) {
                    console.log("Chat created:", resultAction.payload);
                    console.log("Navigating to chat...");
                    const newChat = resultAction.payload;
                    handleSend(query, newChat.id!);
                    navigate(`/chat/${newChat.id}`);
                } else {
                    console.error("Chat creation failed:", resultAction.payload);
                }
            } catch (error) {
                console.error("Error creating chat:", error);
            }
        } else {
            console.log("User not logged in.");
        }
    }
    const handleSend = async (message: string, chatId: string) => {
        console.log("Sending:", message);
        if (!app.chatId) {
            return;
        }
        // update state
        dispatch(addUserMessage({
            chat_id: app.chatId!,
            message: message,
            sender: "user",
        }));

        try {
            await dispatch(sendMessage({
                chat_id: app.chatId!,
                message: message,
                sender: "user",
            }));
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <motion.div
            className="flex justify-center items-center h-screen overflow-hidden"
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
                    onSend={handleSend}
                    onNewChatCreate={handleCreateChat}
                />
            </div>
        </motion.div>
    );
};

export default NewChat;