import React from 'react';
import { useSelector } from 'react-redux';
import ChatBubble from './ChatBubble';
import { RootState } from '../redux/store';

interface ChatWindowProps {
    className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ className }) => {
    const messages = useSelector((state: RootState) => state.chat.messages);
    return (
        <div className={`${className}`}>
            {messages.map((msg: Object, idx: number) => (
                <div
                    key={idx}
                    className='flex-col'>
                    <ChatBubble key={idx} message={msg} index={idx} length={messages.length} />
                </div>
            ))}
        </div>
    );
};

export default ChatWindow;