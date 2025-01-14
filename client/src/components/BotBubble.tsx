import React from "react"
import MDPreview from "./MDPreview"

interface BotBubbleProps {
    message: any
    index: number
    length: number
}

const BotBubble: React.FC<BotBubbleProps> = ({ message, index, length }) => {
    const { status, text, sources, timestamp } = message;
    const success = status === 'success';
    return (
        <div className={`my-2 pt-2}`}>
            <MDPreview
                className={`inline-block px-4 py-2 rounded-lg ${!success ? 'bg-red-400 text-white' : 'bg-gray-200'
                    }`}
                value={text} />
            {sources.length > 0 && <p className='text-lg'>Sources</p>}
            <div className='flex justify-center mb-2'>
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
            <div className='flex justify-between'>
                {/* {loading && index === length - 1 ? <Spinner /> : <div />} */}
                <div className="text-xs text-gray-500 ">{new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        </div>
    )
}

export default BotBubble