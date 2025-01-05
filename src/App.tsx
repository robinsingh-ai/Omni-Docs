import React from 'react';
import ChatInput from './components/ChatInput';
import ChatWindow from './components/ChatWindow';

const App: React.FC = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
    <div className="w-full max-w-md bg-white rounded shadow-lg p-4">
      <ChatWindow />
      <ChatInput />
    </div>
  </div>
);

export default App;