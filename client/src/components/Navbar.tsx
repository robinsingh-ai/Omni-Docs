interface NavbarProps {
    className?: string;
    sideBarIcon?: boolean;
    onToggleSidebar?: () => void;
    children?: React.ReactNode;
}
const Navbar: React.FC<NavbarProps> = ({ sideBarIcon, className, children }) => {
    return (
        <div className={`sticky top-0 z-50 min-w-full h-14 flex justify-between items-center ${className}`}>
            <div className='grow'>
                {children}
            </div>
        </div>
    )
}
export default Navbar;