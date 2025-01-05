import React from 'react';
import { useSelector } from 'react-redux';
import ChatBubble from './ChatBubble';
import { RootState } from '../redux/store';
import Message from '../models/Message';

const ChatWindow: React.FC = () => {
    const messages = useSelector((state: RootState) => state.messages);

    return (
        <div className="h-[70vh] overflow-y-auto border p-4">
            {messages.map((msg: Message, idx: number) => (
                <ChatBubble key={idx} sender={msg.sender} text={msg.text} />
            ))}
        </div>
    );
};

export default ChatWindow;