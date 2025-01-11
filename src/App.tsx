import React from 'react';
import ChatInput from './components/ChatInput';
import ChatWindow from './components/ChatWindow';
import ServiceStatus from './components/ServiceStatus';
import Menu from './components/Menu';
import { useDispatch } from 'react-redux';
import { DataSource, setDataSource } from './redux/reducers/dataSlice';

const App: React.FC = () => {

  const items: Record<string, DataSource> = {
    'Crust-Data': { dataSource: 'crust-data' },
    'Next.js': { dataSource: 'nextjs-sitemap' },
    'Flutter': { dataSource: 'flutter-sitemap' },
  }

  const dispatch = useDispatch();

  const handleMenuChange = (value: string) => {
    console.log(value);
    const selectedDataSource = items[value];
    dispatch(setDataSource(selectedDataSource));
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br relative">
      <div className="w-full max-w-2xl p-6 flex flex-col space-y-4 ">
        <div className='top-6 right-10 absolute'>
          <ServiceStatus />
        </div>
        <div className="top-0 left-10 absolute">
          <Menu
            onChange={handleMenuChange}
            options={Object.keys(items).map((key) => ({ value: key, label: key }))} placeholder='Select a service' />
        </div>
        <div className="flex-grow overflow-y-auto">
          <ChatWindow />
        </div>
        <ChatInput />
      </div>
    </div>
  );
}

export default App;
