import { Check, Copy } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import CopyIcon from "./CopyIcon"
import SourcesList from "./SourcesComponent"
import { TypewriterText } from "./TypewriterText"
import ThreeDotLoader from "./ThreeDotLoader"

interface BotBubbleProps {
    message: any
    index: number
    length: number
}

const BotBubble: React.FC<BotBubbleProps> = ({ message, index, length }) => {
    const { status, text, sources, timestamp } = message;
    const success = status === 'success';
    const loading = useSelector((state: RootState) => state.chat.loading);
    const animating = useSelector((state: RootState) => state.chat.animating);
    const messageIndex = Math.floor(Math.random() * 4);
    const emptyText = ['Hang on a sec...', 'Just a moment...', 'One sec...', 'Hold on...'];
    const isLastMessage: boolean = (index === length - 1);
    return (
        <div className={`my-2 pt-2}`}>
            <TypewriterText text={!text ? emptyText[messageIndex] : text} speed={5} success={success} />
            {isLastMessage && loading && !animating && <div className="flex p-2">
                <ThreeDotLoader
                    size={6}
                    animation='typing' />
            </div>}
            {!loading && !animating && <SourcesList sources={sources} />}
            <div className='flex justify-between items-center px-2'>
                <div className="text-xs text-gray-500 ">{new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                {!loading && <CopyIcon
                    id='copy-content'
                    message='Copied!'
                    tooltip='Copy'
                    data={`${text}`}
                    copiedIcon={<Check color='green' />}
                    icon={<Copy className='size-5 text-black dark:text-white' />}
                />
                }
            </div>
        </div>
    )
}
export default BotBubble