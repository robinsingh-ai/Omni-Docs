import React from 'react';
import Message from '../models/Message';
import Spinner from './Spinner';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface ChatProps {
    message: Message
}

const ChatBubble: React.FC<ChatProps> = ({ message }) => {
    const { sender, text, timestamp } = message;
    const loading = useSelector((state: RootState) => state.loading);
    return (
        <div className={`my-2 ${sender === 'user' ? 'text-right' : 'text-left'}`}>
            <div
                className={`inline-block px-4 py-2 rounded-lg ${sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}>
                {text}
            </div>
            <div className='flex justify-between'>
                {loading ? <Spinner /> : <div />}
                <div className="text-xs text-gray-500 mt-1">{timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        </div >
    );
};

export default ChatBubble;
