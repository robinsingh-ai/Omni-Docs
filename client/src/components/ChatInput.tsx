import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addUserMessage, sendMessage, streamResponse } from '../redux/reducers/chatSlice';
import { Send } from 'lucide-react';
import { AppDispatch, RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { LLM_Provider } from '../services/ResponseProvider';
import Constants from '../utils/Constants';

interface ChatInputProps {
    className?: string;
    onSend(query: string, chatId: string): void
    onNewChatCreate?(val: string): void;
}

const ChatInput: React.FC<ChatInputProps> = ({ className, onSend, onNewChatCreate }) => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const isSendingMessage = useSelector((state: RootState) => state.chat.isSendingMessage);
    const agent = useSelector((state: RootState) => state.app.agent.valueOf());
    const dataKey = Object.keys(Constants.items).find(key => Constants.items[key] === agent);
    const app = useSelector((state: RootState) => state.app);
    const [rows, setRows] = useState<number>(1);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const sendQuery = async () => {
        if (app.chatId != null) {
            console.log("Sending in chatId:", app.chatId);
            await dispatch(addUserMessage({
                chat_id: app.chatId,
                message: query,
                sender: "user"
            }));

            // Start parallel operations
            await Promise.all([
                dispatch(sendMessage({
                    chat_id: app.chatId,
                    message: query,
                    sender: "user"
                })).unwrap(),
                dispatch(streamResponse({
                    provider_name: LLM_Provider.local_llm,
                    message: query,
                    agent: agent
                })).unwrap()
            ]);
            setQuery('');
            setRows(1);
            onSend?.(query, app.chatId);
        } else {
            await onNewChatCreate?.(query);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // ignore add new line
        console.log("sending:", isSendingMessage, app.chatId);
        if (isSendingMessage || app.chatId == null || query === '') {
            return;
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            sendQuery();
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setQuery(value);
        const lineCount = value.split('\n').length;
        const maxRows = 8;
        setRows(Math.min(maxRows, Math.max(2, lineCount)));
    };

    return (
        <div className={`flex flex-col bg-slate-50 p-2 mx-2 rounded-2xl shadow-lg ${className}`}>
            <div className={`flex items-center gap-2`}>
                <textarea
                    className="flex-grow bg-slate-50 p-2 rounded-2xl resize-none text-sm duration-200 outline-none focus:outline-none"
                    value={query}
                    ref={textAreaRef}
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                    placeholder={`Ask me about ${dataKey}`}
                    rows={rows}
                />
                <motion.button
                    className="flex items-center justify-center p-3 text-black font-semibold hover:scale-105 active:scale-95 focus:outline-none focus:ring focus:ring-blue-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendQuery}>
                    {<Send size={22} />}
                </motion.button>
            </div>
            {/* Media Options */}
            <div className='h-5'>
                {/* <ImageIcon size={24} /> */}
            </div>
        </div>
    );
};

export default ChatInput;