import { useDispatch, useSelector } from "react-redux";
import IconButton from "./IconButton";
import { FiSidebar } from "react-icons/fi";
import { AppDispatch, RootState } from "../redux/store";
import { toggleSidebar } from "../redux/reducers/sidebarSlice";
import { SupabaseFactory } from "../services/db/SupabaseFactory";
import { setAuth, setLoading } from "../redux/reducers/authSlice";
import { LogOut } from "lucide-react";
interface SidebarProps {

}
const Sidebar: React.FC<SidebarProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const sidebar = useSelector((state: RootState) => state.sidebar);
    const auth = useSelector((state: RootState) => state.auth as any);
    const authService = SupabaseFactory.authService;
    const handleLogOut = async () => {
        try {
            dispatch(setLoading(true));
            const response = await authService.signOut();
            console.log("Logout response:", response);
            if (response.error) {
                console.error("Error logging out:", response.error);
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
            <div>
                <IconButton
                    ariaLabel="Sidebar"
                    onClick={() =>
                        dispatch(toggleSidebar())
                    }>
                    <FiSidebar className="w-6 h-6 m-2 text-black" />
                </IconButton>
            </div>
            {/* Content */}
            <div className="flex-grow overflow-y-auto">
                {/* List of Items */}
                {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="p-4 border-b border-slate-400">
                        Item {i}
                    </div>
                ))}
            </div>
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