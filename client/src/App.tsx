import React from 'react';
import ChatInput from './components/ChatInput';
import ChatWindow from './components/ChatWindow';
import ServiceStatus from './components/ServiceStatus';
import Menu from './components/Menu';
import { useDispatch } from 'react-redux';
import { DataSource, setDataSource } from './redux/reducers/dataSlice';
import Navbar from './components/Navbar';

export const items: Record<string, DataSource> = {
  'Crust-Data': 'crust_data',
  'Next.js': 'nextjs',
  'Flutter': 'flutter',
};

const App: React.FC = () => {

  const dispatch = useDispatch();

  const handleMenuChange = (value: string) => {
    const selectedDataSource: DataSource = items[value];
    dispatch(setDataSource(selectedDataSource));
  };

  return (
    <div className="flex flex-col h-screen"
      style={{
        background: `var(--chat-background)`
      }}>
      <div className="flex-none sticky top-0 z-10">
        <Navbar>
          <div className="flex items-center justify-between px-4">
            <Menu
              onChange={handleMenuChange}
              options={Object.keys(items).map((key) => ({ value: key, label: key }))}
              placeholder="Next.js"
            />
            {/* <ServiceStatus /> */}
          </div>
        </Navbar>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto pb-16">
          <div className="flex justify-center min-h-full pb-16">
            <ChatWindow className="px-4 w-full max-w-3xl" />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0">
          <div className="flex justify-center px-4 py-2 max-w-3xl mx-auto">
            <ChatInput
              className="w-full"
              onSend={() => { }}
            />
          </div>
        </div>
      </div>
    </div >
  );
};

export default App;