import { IoMdClose } from "react-icons/io";
interface SidebarItemProps {
    chat: any,
    active: boolean,
    index: number,
    onClick: () => void
    onChatDelete: (chatId: string) => void
}

const SidebarItem: React.FC<SidebarItemProps> = ({ chat, active, onClick, index, onChatDelete }) => {
    const chatName = chat.name.length > 30 ? chat.name.substring(0, 30) : chat.name;
    return (
        <div
            key={index}
            className={`flex justify-between items-center px-2 py-1 mx-2 my-1 rounded-md cursor-pointer hover:bg-slate-200 ${active ? 'bg-slate-200' : ''}`}
            onClick={onClick}>
            {chatName}
            <IoMdClose
                onClick={() => onChatDelete(chat.id)}
                className="text-md" />
        </div>
    );
}

export default SidebarItem;