import React from "react"
import MDPreview from "./MDPreview"
import { Check, Copy } from "lucide-react"
import CopyIcon from "./CopyIcon"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"

interface BotBubbleProps {
    message: any
    index: number
    length: number
}

const BotBubble: React.FC<BotBubbleProps> = ({ message }) => {
    const { status, text, sources, timestamp } = message;
    const success = status === 'success';
    const loading = useSelector((state: RootState) => state.chat.loading);
    return (
        <div className={`my-2 pt-2}`}>
            <MDPreview
                className={`inline-block px-4 py-2 rounded-lg ${!success ? 'bg-red-400 text-white' : 'bg-gray-200'
                    }`}
                value={text} />
            <div className='flex justify-center'>
                {sources && sources.map((source: any, idx: number) => (
                    <div className='flex flex-col bg-gray-200 rounded-md px-2 py-2 mr-2'>
                        <a
                            key={idx}
                            href={source.url}
                            target='_blank'
                            rel='noreferrer'
                            className='text-xs text-blue-500 underline'
                        >
                            {source.title}
                        </a>
                        <p className='text-xs'>{source.content_preview.substring(0, 50)}</p>
                    </div>
                ))}
            </div>
            <div className='flex justify-between items-center'>
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