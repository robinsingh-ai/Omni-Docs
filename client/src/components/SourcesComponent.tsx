import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { LinkRenderer } from "./MDPreview";
import { motion } from "framer-motion";

interface SourcesProps {
    sources: any;
}

const SourcesList: React.FC<SourcesProps> = ({ sources }) => {
    const loading = useSelector((state: RootState) => state.chat.loading);
    if (loading || !sources || sources.length === 0) {
        return <div />
    }
    return (<motion.div
        animate={{
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        className='flex flex-col'>
        <h4 className='text-md'>Sources</h4>
        <div className='flex justify-center'>
            {sources && sources.map((source: any, idx: number) => (
                <div className='flex flex-col bg-gray-200 rounded-md px-2 py-2 mr-2'>
                    <LinkRenderer href={source.url}>
                        {source.title}
                    </LinkRenderer>
                    <p className='text-xs'>{source.content_preview.substring(0, 50)}</p>
                </div>
            ))}
        </div>
    </motion.div>
    )
}

export default SourcesList