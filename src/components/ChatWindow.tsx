import React from 'react';
import { useSelector } from 'react-redux';
import ChatBubble from './ChatBubble';
import { RootState } from '../redux/store';
import Message from '../models/Message';

const ChatWindow: React.FC = () => {
    const messages = useSelector((state: RootState) => state.chat.messages);
    return (
        <div className="h-[80vh] border p-4">
            {messages.map((msg: Message, idx: number) => (
                <div className='flex-col'>
                    <ChatBubble key={idx} message={msg} index={idx} length={messages.length} />
                </div>
            ))}
        </div>
    );
};

export default ChatWindow;