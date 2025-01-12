import React from 'react';
import { useSelector } from 'react-redux';
import ChatBubble from './ChatBubble';
import { RootState } from '../redux/store';
import Message from '../models/Message';


interface ChatWindowProps {
    className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ className }) => {
    const messages = useSelector((state: RootState) => state.chat.messages);
    return (
        <div className={`${className}`}>
            {messages.map((msg: Message, idx: number) => (
                <div className='flex-col'>
                    <ChatBubble key={idx} message={msg} index={idx} length={messages.length} />
                </div>
            ))}
        </div>
    );
};

export default ChatWindow;