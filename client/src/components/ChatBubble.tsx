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
                className={`inline-block px-4 py-2 rounded-lg bg-blue-500 text-white`}
                value={text} />
            <div className='flex justify-between'>
                {/* {loading && index === length - 1 ? <Spinner /> : <div />} */}
                <div className="text-xs text-gray-500 ">{new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        </div >
    );
};

export default ChatBubble;
