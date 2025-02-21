import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addUserMessage, sendMessage, stopStreaming, streamResponse } from '../redux/reducers/chatSlice';
import { Send, Square } from 'lucide-react';
import { AppDispatch, RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { LLM_Provider } from '../services/ResponseProvider';
import Constants from '../utils/Constants';

interface ChatInputProps {
    className?: string;
    onSend(query: string, chatId: string): void
    onNewChatCreate?(val: string): void;
    value?: string;
    overrideSend?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ className, value, onSend, onNewChatCreate, overrideSend = false }) => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const respLoading = useSelector((state: RootState) => state.chat.respLoading);
    const agent = useSelector((state: RootState) => state.app.agent.valueOf());
    const dataKey = Object.keys(Constants.items).find(key => Constants.items[key] === agent);
    const app = useSelector((state: RootState) => state.app);
    const [rows, setRows] = useState<number>(1);
    const maxRows = 8;

    useEffect(() => {
        if (value) {
            setQuery(value);
            const lines = value.split('\n').length;
            setRows(Math.min(maxRows, Math.max(2, lines)));
        }
    }, [value]);

    const handleInterrupt = () => {
        dispatch(stopStreaming({ provider_name: LLM_Provider.local_llm, })); // or any other provider
    };

    const sendQuery = async () => {
        try {
            if (query.trim() === '' || respLoading) {
                return;
            }
            if (overrideSend) {
                onSend?.(query, app.chatId!);
                return;
            }
            if (app.chatId != null) {
                await dispatch(addUserMessage({
                    chat_id: app.chatId,
                    message: query,
                    sender: "user"
                }));
                const q = query;
                setQuery('');
                setRows(1);
                onSend?.(query, app.chatId);
                await Promise.all([
                    dispatch(sendMessage({
                        chat_id: app.chatId,
                        message: q,
                        sender: "user"
                    })).unwrap(),
                    dispatch(streamResponse({
                        provider_name: LLM_Provider.local_llm,
                        message: q,
                        agent: agent
                    })).unwrap()
                ]);
            } else {
                console.error("Chat ID is null, creating new chat...");
                await onNewChatCreate?.(query);
            }
        } catch (_) {
            console.error("Error in sendQuery:", _);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // ignore add new line
        if (respLoading || query.trim() === '') {
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
        setRows(Math.min(maxRows, Math.max(2, lineCount)));
    };

    return (
        <div className={`flex flex-col bg-slate-50 p-2 mx-2 rounded-2xl shadow-lg ${className}`}>
            <div className={`flex items-center gap-2`}>
                <textarea
                    className="flex-grow bg-slate-50 p-2 rounded-2xl resize-none text-sm duration-200 outline-none focus:outline-none"
                    value={query}
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
                    {!respLoading ? <Send size={22} /> :
                        <Square size={22}
                            onClick={handleInterrupt}
                            className="bg-gray-800 rounded-sm cursor-pointer" />
                    }
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