import React from 'react';
import ChatInput from './components/ChatInput';
import ChatWindow from './components/ChatWindow';
import ServiceStatus from './components/ServiceStatus';
import Menu from './components/Menu';
import { useDispatch } from 'react-redux';
import { DataSource, setDataSource } from './redux/reducers/dataSlice';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const items: Record<string, DataSource> = {
    'Crust-Data': { dataSource: 'crust-data' },
    'Next.js': { dataSource: 'nextjs-sitemap' },
    'Flutter': { dataSource: 'flutter-sitemap' },
  };

  const dispatch = useDispatch();

  const handleMenuChange = (value: string) => {
    console.log(value);
    const selectedDataSource = items[value];
    dispatch(setDataSource(selectedDataSource));
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-none">
        <Navbar>
          <div className="flex items-center justify-between px-8">
            <Menu
              onChange={handleMenuChange}
              options={Object.keys(items).map((key) => ({ value: key, label: key }))}
              placeholder="Next.js"
            />
            <ServiceStatus />
          </div>
        </Navbar>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto mb-28">
          <div className="flex justify-center h-full">
            <ChatWindow className="px-4 w-full max-w-3xl" />
          </div>
        </div>

        <div className="flex justify-center">
          <ChatInput className='absolute bottom-2 w-full max-w-3xl' />
        </div>
      </div>
    </div>
  );
};

export default App;