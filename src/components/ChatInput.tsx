import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addUserMessage, fetchResponse } from '../redux/reducers/chatSlice';
import { Send } from 'lucide-react';
import { AppDispatch, RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { LLM_Provider } from '../services/ResponseProvider';
import Spinner from './Spinner';

interface ChatInputProps {
    className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ className }) => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const loading = useSelector((state: RootState) => state.chat.loading);
    const datSource = useSelector((state: RootState) => state.data.dataSource);
    const sendMessage = async () => {
        if (query.trim()) {
            dispatch(addUserMessage(query));
            dispatch(fetchResponse({ provider_name: LLM_Provider.local_llm, message: query, dataSource: datSource }));
            setQuery('');
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

    return (
        <div className={`flex items-center bg-gradient-to-r gap-2 from-gray-100 to-gray-200 p-2 rounded-lg shadow-lg ${className}`}>
            <textarea
                className="flex-grow bg-white p-3 rounded-l-lg resize-none text-sm border-none focus:outline-none  duration-200"
                value={query}
                onKeyDown={handleKeyDown}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask Me About NextJS..."
                rows={2}
            />
            <motion.button
                className="flex items-center justify-center p-3 text-black font-semibold hover:scale-105 active:scale-95 focus:outline-none focus:ring focus:ring-blue-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
            >
                {loading ? <Spinner /> : <Send size={24} />}
            </motion.button>
        </div>
    );
};

export default ChatInput;
