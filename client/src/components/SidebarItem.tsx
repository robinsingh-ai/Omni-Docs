import { IoMdClose } from "react-icons/io";
import { RootState } from "../redux/store";
import React, { useState } from "react";
import AIDropdown from "./Dropdown";
import { EllipsisIcon } from "lucide-react";
import { useSelector } from "react-redux";
interface SidebarItemProps {
    chat: any;
    active: boolean;
    index: number;
    onClick: (chatId: string) => void;
    onChatDelete: (chatId: string) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ chat, active, onClick, index, onChatDelete }) => {
    const chatName = chat.name.length > 30 ? chat.name.substring(0, 30) : chat.name;
    const chatId = useSelector((state: RootState) => state.app.chatId);
    const isSelected = chat.id === chatId;
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const ref = React.useRef<HTMLDivElement>(null);

    function MoreOptions() {
        const options = ['Share', 'Delete', 'Rename'];
        return (
            <AIDropdown
                dropdownOpen={isDropdownOpen}
                options={options}
                onDropdownToggle={setIsDropdownOpen}
                onSelect={(event: string, e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleonAction(event);
                    setIsDropdownOpen(false);
                }}>
                <EllipsisIcon
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen(true);
                    }}
                    className="w-5 h-5 text-gray-600"
                />
            </AIDropdown>
        );
    }

    async function handleonAction(key: string) {
        switch (key) {
            case 'Delete':
                onChatDelete(chat.id);
                setIsHovered(false);
                setIsDropdownOpen(false);
                break;
            case 'Share':
                break;
            case 'Rename':
                break;
            default:
                break;
        }
    }

    return (
        <div
            ref={ref}
            key={index}
            className={`flex justify-between items-center px-2 py-2 mx-2 my-1 rounded-md cursor-pointer ${isSelected ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
            onMouseEnter={() => setIsHovered(true)} // Set hovered on mouse enter
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onClick(chat.id)}
        >
            <p className="text-sm">{chatName}</p>
            {(isSelected || isDropdownOpen || isHovered) && <MoreOptions />} {/* Include isHovered in the condition */}
        </div>
    );
};

export default SidebarItem;