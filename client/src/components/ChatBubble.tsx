import React from 'react';
import MDPreview from './MDPreview';

interface ChatProps {
    message: any
    index: number
    length: number
}

const ChatBubble: React.FC<ChatProps> = ({ message, index, length }) => {
    const { text, timestamp } = message;

    return (
        <div className={`my-2 pt-2}`}>
            <MDPreview
                style={{
                    borderRadius: '0.8rem',
                    // boxShadow: '0 0 0 1px var(--chat-bubble-border)',
                    backgroundColor: 'var(--chat-bubble-surface)'
                }}
                className={`inline-block px-4 py-2 rounded-lgtext-white`}
                value={text} />
            <div className='flex justify-between px-2 pt-1'>
                {/* {loading && index === length - 1 ? <Spinner /> : <div />} */}
                <div className="text-xs text-gray-500 ">{new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        </div >
    );
};

export default ChatBubble;
