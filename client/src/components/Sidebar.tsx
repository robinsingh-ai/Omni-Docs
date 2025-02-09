import { useDispatch, useSelector } from "react-redux";
import IconButton from "./IconButton";
import { FiEdit, FiSidebar } from "react-icons/fi";
import { AppDispatch, RootState } from "../redux/store";
import { toggleSidebar } from "../redux/reducers/sidebarSlice";
import { SupabaseFactory } from "../services/db/SupabaseFactory";
import { setAuth, setLoading } from "../redux/reducers/authSlice";
import { LoaderCircle, LogOut } from "lucide-react";
import { useEffect } from "react";
import { fetchChats } from "../redux/reducers/userChatsSlice";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router";
import { deleteChatById, fetchChatById, setNewChat } from "../redux/reducers/chatSlice";
import { setChatId } from "../redux/reducers/appSlice";
interface SidebarProps {

}
const Sidebar: React.FC<SidebarProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const sidebar = useSelector((state: RootState) => state.sidebar);
    const auth = useSelector((state: RootState) => state.auth as any);
    const app = useSelector((state: RootState) => state.app);
    const navigate = useNavigate();
    const userChats = useSelector((state: RootState) => state.userChats);
    const authService = SupabaseFactory.authService;
    const chatsLoading = userChats.chatsLoading;

    const handleLogOut = async () => {
        try {
            dispatch(setLoading(true));
            const response = await authService.signOut();
            if (response.error) {
                return;
            }
            dispatch(setAuth({
                isAuthenticated: false,
                user: null,
                provider: null,
                session: null,
                isLoading: false,
            }));


        }
        catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleChatClick = (chat: any) => {
        dispatch(setChatId(chat.id));
        dispatch(fetchChatById(chat.id));
        navigate(`/chat/${chat.id}`);
    };

    const handleDeleteChat = async (chatId: string) => {
        await dispatch(deleteChatById(chatId));
        await fecthChats();
        dispatch(setChatId(null));
        navigate('/');
    }

    const fecthChats = async () => {
        dispatch(fetchChats(auth.user.id));
    }

    useEffect(() => {
        if (auth.user) {
            fecthChats();
        }
    }, [auth.user]);

    return (
        <div className={`
            fixed 
            top-0 
            left-0 
            h-full 
            ${sidebar.isOpen ? 'w-64' : '-translate-x-full'} 
            flex 
            flex-col 
            justify-start 
            z-50 
            transition-all 
            duration-300 
            bg-slate-300 
            shadow-lg
        `}
        >
            <div className="flex justify-between">
                <IconButton
                    ariaLabel="Sidebar"
                    onClick={() =>
                        dispatch(toggleSidebar())
                    }>
                    <FiSidebar className="w-6 h-6 m-2 text-black" />
                </IconButton>
                <IconButton
                    ariaLabel="New Chat"
                    onClick={() => {
                        navigate('/');
                        dispatch(setNewChat(true))
                        dispatch(setChatId(null));
                    }}>
                    <FiEdit className="w-6 h-6 m-2 text-black" />
                </IconButton>
            </div>
            {chatsLoading ? (
                <div className="flex items-center justify-center flex-grow">
                    <LoaderCircle className="w-10 h-10 text-black animate-spin" />
                </div>
            ) : (
                <div className="flex-grow overflow-y-auto">
                    {userChats.chats.map((chat: any, index) => (
                        <SidebarItem
                            key={index}
                            active={app.chatId === chat.id}
                            index={index}
                            onClick={() => handleChatClick(chat)}
                            onChatDelete={handleDeleteChat}
                            chat={chat}
                        />
                    ))}
                </div>
            )}
            <div className="">
                {/* Profile in Sidebar with a logout button */}
                <div className="flex items-center p-4 gap-1">
                    <div className="w-10 h-10 bg-slate-400 rounded-full"></div>
                    <div className="text-sm font-semibold text-black">{auth.user.email}</div>
                    <div className="text-xs text-slate-500">
                        <LogOut
                            onClick={handleLogOut}
                            className="p-2 size-10 cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;