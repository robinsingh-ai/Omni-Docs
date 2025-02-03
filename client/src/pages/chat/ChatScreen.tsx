import React, { use, useEffect, useRef } from 'react';
import ChatInput from '../../components/ChatInput';
import ChatWindow from '../../components/ChatWindow';
import Menu from '../../components/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { DataSource, setDataSource } from '../../redux/reducers/dataSlice';
import Navbar from '../../components/Navbar';
import { ArrowDownCircleIcon } from 'lucide-react';
import { updateScroll } from '../../redux/reducers/scrollSlice';
import IconButton from '../../components/IconButton';
import { FiSidebar } from 'react-icons/fi';
import { toggleSidebar } from '../../redux/reducers/sidebarSlice';
import { useLocation } from 'react-router';
import Constants from 'src/utils/Constants';
import { AppDispatch, RootState } from 'src/redux/store';

const ChatScreen: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottom = useSelector((state: RootState) => state.scroll.isAtBottom);
  const sidebar = useSelector((state: RootState) => state.sidebar);
  const location = useLocation(); //
  const handleMenuChange = (value: string) => {
    const selectedDataSource: DataSource = Constants.items[value];
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
            {!sidebar.isOpen && location.pathname === '/' ? <IconButton
              ariaLabel="Sidebar"
              onClick={() =>
                dispatch(toggleSidebar())
              }>
              <FiSidebar className="w-6 h-6 text-black" />
            </IconButton> : <div />}
            <Menu
              onChange={handleMenuChange}
              options={Object.keys(Constants.items).map((key) => ({ value: key, label: key }))}
              placeholder="Next.js"
            />
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
        <div className="absolute bottom-0 left-0 right-0">
          <ArrowDownCircleIcon
            className={`relative size-8 mx-auto cursor-pointer transition-transform duration-300 z-20 ${isAtBottom ? 'scale-0' : 'scale-100'
              }`}
            onClick={scrollToBottom}
          />
          <div className="flex px-4 pb-2 pt-4 max-w-3xl mx-auto z-10">
            {/* blur layer */}
            <div
              className="absolute inset-0 mx-auto max-w-3xl z-10"
              style={{
                background: `linear-gradient(to top, hsl(var(--chat-background)) 75%, rgba(0, 0, 0, 0) 100%)`,
              }}
            >
              <div className="absolute bottom-2 left-0 right-0 flex justify-center max-w-3xl mx-auto">
                <p className='text-xs underline'>Powered by {process.env.REACT_APP_MODEL_NAME}</p>
              </div>
            </div>
            <ChatInput
              className="w-full z-20 mb-8"
              onSend={() => {
                setTimeout(() => {
                  scrollToBottom();
                }, 300);
              }}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;