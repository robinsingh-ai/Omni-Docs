import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUserMessage, fetchResponse } from '../redux/reducers/chatSlice';

const ChatInput: React.FC = () => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();

    const sendMessage = async () => {
        if (query.trim()) {
            dispatch(addUserMessage(query));
            // const response = await fetchResponse(query)
            setQuery('');
        }
    };

    return (
        <div className="flex items-center">
            <input
                className="flex-grow p-2 border rounded-l"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about Crustdata API..."
            />
            <button
                className="p-2 bg-blue-500 text-white rounded-r"
                onClick={sendMessage}
            >
                Send
            </button>
        </div>
    );
};

export default ChatInput;
