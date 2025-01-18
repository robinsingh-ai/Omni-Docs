import React, { useEffect, useRef } from 'react';
import ChatInput from './components/ChatInput';
import ChatWindow from './components/ChatWindow';
import Menu from './components/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { DataSource, setDataSource } from './redux/reducers/dataSlice';
import Navbar from './components/Navbar';
import { ArrowDownCircleIcon } from 'lucide-react';
import { RootState } from './redux/store';
import { updateScroll } from './redux/reducers/scrollSlice';

export const items: Record<string, DataSource> = {
  'Crust-Data': 'crust_data',
  'Next.js': 'nextjs',
  'Flutter': 'flutter',
};

const App: React.FC = () => {

  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottom = useSelector((state: RootState) => state.scroll.isAtBottom);

  const handleMenuChange = (value: string) => {
    const selectedDataSource: DataSource = items[value];
    dispatch(setDataSource(selectedDataSource));
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;

    if (!scrollElement) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      dispatch(updateScroll({ scrollTop, scrollHeight, clientHeight }));
    };

    scrollElement.addEventListener('scroll', onScroll);
    return () => {
      scrollElement.removeEventListener('scroll', onScroll);
    };
  }, [dispatch]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
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
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto pb-24">
          <div className="flex justify-center min-h-full pb-16">
            <ChatWindow className="px-4 w-full max-w-3xl" />
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0">
          {/* blur layer */}
          <div
            className="absolute inset-0 mx-auto max-w-3xl"
            style={{
              background: `linear-gradient(to top, hsl(var(--chat-background)) 75%, rgba(0, 0, 0, 0) 100%)`,
            }}
          />
          <ArrowDownCircleIcon
            className={`size-8 mx-auto cursor-pointer transition-transform duration-300 ${isAtBottom ? 'scale-0' : 'scale-100'
              }`}
            onClick={scrollToBottom}
          />
          <div className="relative flex justify-center px-4 pb-2 pt-8 max-w-3xl mx-auto">
            <ChatInput
              className="w-full"
              onSend={() => {
                setTimeout(() => {
                  scrollToBottom();
                }, 300);
              }}
            />
          </div>
          <div className="relative flex justify-center pb-2 max-w-3xl mx-auto">
            <p className='text-xs underline'>Powered by Llama 3</p>
          </div>
        </div>
      </div>
    </div >
  );
};

export default App;