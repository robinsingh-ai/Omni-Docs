import { motion } from "framer-motion";
import ChatInput from "../../components/ChatInput";
import React from "react";
import { useDispatch } from "react-redux";
import { addUserMessage, sendMessage, setNewChat, streamResponse } from "../../redux/reducers/chatSlice";
import { useLocation, useNavigate } from "react-router";
import { AppDispatch, RootState } from "src/redux/store";
import { createChat } from "src/redux/reducers/userChatsSlice";
import { useSelector } from "react-redux";
import { setAgent, setChatId } from "src/redux/reducers/appSlice";
import { LLM_Provider } from "src/services/ResponseProvider";
import { Navbar } from "@nextui-org/react";
import IconButton from "src/components/IconButton";
import Menu from "src/components/Menu";
import { FiSidebar } from "react-icons/fi";
import Constants, { Agent } from "src/utils/Constants";
import { toggleSidebar } from "src/redux/reducers/sidebarSlice";
interface NewChatProps { }

const NewChat: React.FC<NewChatProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const app = useSelector((state: RootState) => state.app);
    const auth = useSelector((state: RootState) => state.auth)
    const agent = useSelector((state: RootState) => state.app.agent.valueOf());
    const sidebar = useSelector((state: RootState) => state.sidebar);
    const location = useLocation(); //
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
                    const newChat = resultAction.payload;
                    dispatch(setChatId(newChat.id!));
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
        // update state
        dispatch(addUserMessage({
            chat_id: chatId!,
            message: message,
            sender: "user",
        }));

        try {
            await dispatch(sendMessage({
                chat_id: chatId!,
                message: message,
                sender: "user",
            }));
            dispatch(streamResponse({
                provider_name: LLM_Provider.local_llm,
                message: message,
                agent: agent
            })).unwrap()
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleMenuChange = (value: string) => {
        const selectedAgent: Agent = Constants.items[value];
        dispatch(setAgent(selectedAgent));
    };


    return (
        <div className="flex flex-col">
            <div className="flex-none sticky top-0 z-10 w-full">
                <Navbar className="w-full">
                    <div className="flex items-center justify-between w-full">
                        {!sidebar.isOpen && location.pathname === '/' ? (
                            <IconButton
                                ariaLabel="Sidebar"
                                onClick={() => dispatch(toggleSidebar())}
                            >
                                <FiSidebar className="w-4 h-4 text-black" />
                            </IconButton>
                        ) : (
                            <div />
                        )}
                        <Menu
                            onChange={handleMenuChange}
                            options={Object.keys(Constants.items).map((key) => ({ value: key, label: key }))}
                            placeholder="Next.js"
                        />
                    </div>
                </Navbar>
            </div>
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
        </div>
    );
};

export default NewChat;