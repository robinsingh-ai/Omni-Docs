import { useDispatch, useSelector } from "react-redux";
import IconButton from "./IconButton";
import { FiSidebar } from "react-icons/fi";
import { AppDispatch, RootState } from "../redux/store";
import { toggleSidebar } from "../redux/reducers/sidebarSlice";
interface NavbarProps {
    className?: string;
    sideBarIcon?: boolean;
    onToggleSidebar?: () => void;
    children?: React.ReactNode;
}
const Navbar: React.FC<NavbarProps> = ({ sideBarIcon, className, children }) => {
    const sidebar = useSelector((state: RootState) => state.sidebar);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className={`sticky top-0 z-50 min-w-full h-14 flex justify-between items-center ${className}`}>
            {!sidebar.isOpen && (
                <IconButton
                    ariaLabel="Sidebar"
                    onClick={() =>
                        dispatch(toggleSidebar())
                    }>
                    <FiSidebar className="w-6 h-6 m-2 text-black" />
                </IconButton>
            )}
            <div className='grow'>
                {children}
            </div>
        </div>
    )
}
export default Navbar;