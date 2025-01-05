import React from 'react';

interface Props {
    sender: 'user' | 'bot';
    text: string;
}

const ChatBubble: React.FC<Props> = ({ sender, text }) => (
    <div className={`my-2 ${sender === 'user' ? 'text-right' : 'text-left'}`}>
        <div
            className={`inline-block px-4 py-2 rounded-lg ${sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}>
            {text}
        </div>
    </div>
);

export default ChatBubble;
