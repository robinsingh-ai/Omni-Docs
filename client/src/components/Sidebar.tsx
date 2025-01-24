import { useDispatch, useSelector } from "react-redux";
import IconButton from "./IconButton";
import { FiSidebar } from "react-icons/fi";
import { AppDispatch, RootState } from "../redux/store";
import { toggleSidebar } from "../redux/reducers/sidebarSlice";
interface SidebarProps {

}
const Sidebar: React.FC<SidebarProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const sidebar = useSelector((state: RootState) => state.sidebar);
    return (
        <div className={`${sidebar.isOpen ? 'w-64' : 'w-0'} flex flex-col justify-start z-50 transition-all duration-300 bg-slate-300`}>
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
        </div>
    )
}

export default Sidebar;