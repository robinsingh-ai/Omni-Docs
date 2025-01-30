import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addUserMessage, streamResponse } from '../redux/reducers/chatSlice';
import { Send } from 'lucide-react';
import { AppDispatch, RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { LLM_Provider } from '../services/ResponseProvider';
import { items } from '../pages/chat/ChatScreen';

interface ChatInputProps {
    className?: string;
    onSend(val: string): void
}

const ChatInput: React.FC<ChatInputProps> = ({ className, onSend }) => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const loading = useSelector((state: RootState) => state.chat.loading);
    const dataSource = useSelector((state: RootState) => state.data.dataSource.valueOf());
    const dataKey = Object.keys(items).find(key => items[key] === dataSource);
    const [rows, setRows] = useState<number>(1);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const sendMessage = async () => {
        if (query.trim()) {
            dispatch(addUserMessage(query));
            dispatch(streamResponse({ provider_name: LLM_Provider.local_llm, message: query, dataSource: dataSource }));
            setQuery('');
            setRows(1);
        }
        if (onSend != null) {
            onSend(query.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // ignore add new line
        if ((e.key === 'Enter' && e.shiftKey) || loading) {
            return;
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
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
                    onClick={sendMessage}>
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