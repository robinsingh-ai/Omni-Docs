import { ReactNode } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
interface PSDropdownProps {
    options: string[];
    onSelect: (value: string, event: React.MouseEvent) => void;
    children: ReactNode;
    className?: string;
    dropdownOpen?: boolean;
    onDropdownToggle?: (isOpen: boolean) => void;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
}

const AIDropdown: React.FC<PSDropdownProps> = ({ options, onSelect, children, dropdownOpen, className, placement, onDropdownToggle }) => {
    return (
        <DropdownMenu
            open={dropdownOpen}
            onOpenChange={onDropdownToggle}>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className="w-28">
                {options.map((option, index) => (
                    <DropdownMenuItem
                        key={index}
                        // onSelect={onSelect}
                        onClick={(e) => onSelect(option, e)}
                    >
                        {option}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AIDropdown;
