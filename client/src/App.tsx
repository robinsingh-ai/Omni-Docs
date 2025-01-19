import { useEffect } from "react";
import ChatScreen from "./ChatScreen";
import Sidebar from "./components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { toggleSidebar } from "./redux/reducers/sidebarSlice";

export default function App() {
    const dispatch = useDispatch<AppDispatch>();
    const sidebar = useSelector((state: RootState) => state.sidebar);
    const checkWindowSize = async () => {
        if (typeof window !== 'undefined') {
            if (sidebar.isOpen && window.innerWidth <= 768) {
                dispatch(toggleSidebar());
            }
        }
    };

    useEffect(() => {
        window.addEventListener('resize', checkWindowSize);
        return () => window.removeEventListener('resize', checkWindowSize);
    }, [sidebar.isOpen, dispatch]);

    return (
        <div className="flex">
            <Sidebar />
            <div
                className={`
                flex-grow relative
                transition-transform duration-300 ease-in-out
                md:translate-x-0
                ${sidebar.isOpen ? 'translate-x-32' : 'translate-x-0'}
            `}>
                <ChatScreen />
            </div>
        </div>
    )
}