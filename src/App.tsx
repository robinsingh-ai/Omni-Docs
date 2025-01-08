import React, { useState } from 'react';
import ChatInput from './components/ChatInput';
import ChatWindow from './components/ChatWindow';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4">
        {/* Chat Window */}
        <div className="flex-grow overflow-y-auto">
          <ChatWindow />
        </div>
        <ChatInput />
      </div>
    </div>
  );
}

export default App;
