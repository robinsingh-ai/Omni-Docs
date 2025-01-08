import React from 'react';
import { useSelector } from 'react-redux';
import ChatBubble from './ChatBubble';
import { RootState } from '../redux/store';
import Message from '../models/Message';
import Spinner from './Spinner';

const ChatWindow: React.FC = () => {
    const messages = useSelector((state: RootState) => state.messages);
    return (
        <div className="h-[80vh] overflow-y-auto border p-4">
            {messages.map((msg: Message, idx: number) => (
                <div className='flex-col'>
                    <ChatBubble key={idx} message={msg} />
                </div>
            ))}
        </div>
    );
};

export default ChatWindow;