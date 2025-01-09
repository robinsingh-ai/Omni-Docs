import React from 'react';
import ChatInput from './components/ChatInput';
import ChatWindow from './components/ChatWindow';
import ServiceStatus from './components/ServiceStatus';

const App: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4">
        <div className="flex-grow overflow-y-auto">
          <div className='flex justify-end p-2'>
            <ServiceStatus />
          </div>
          <ChatWindow />
        </div>
        <ChatInput />
      </div>
    </div>
  );
}

export default App;
