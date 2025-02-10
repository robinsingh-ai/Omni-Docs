import React from 'react';
import { useSelector } from 'react-redux';
import ChatBubble from './ChatBubble';
import { RootState } from '../redux/store';
import BotBubble from './BotBubble';

interface ChatWindowProps {
    className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ className }) => {
    const messages = useSelector((state: RootState) => state.chat.messages);
    return (
        <div className={`${className}`}>
            {messages.map((msg: any, idx: number) => {
                const { message_type } = msg;
                if (message_type === 'bot') {
                    return (
                        <BotBubble key={idx} chat={msg} index={idx} length={messages.length} />
                    );
                }
                return (
                    <ChatBubble key={idx} chat={msg} index={idx} length={messages.length} />
                );
            })}
        </div>
    );
};

export default ChatWindow;