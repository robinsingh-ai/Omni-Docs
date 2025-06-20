// src/_components/PSContent.tsx
import { Tooltip } from "@nextui-org/react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from 'react-markdown';
import CodeBlock from "./CodeHighlight";

interface MDPreviewProps {
    value?: string;
    className?: string;
    style?: React.CSSProperties;
}

const MDPreview = ({ value, className, style }: MDPreviewProps) => {
    const customClass = `px-2 py-2 rounded-b-lg border-surface focus:ring-secondary focus:outline-none focus:ring-2 resize-y w-full reactMarkDown ${className}`;


    return <div
        id='preview'
        style={style}
    >
        <ReactMarkdown
            className={`${customClass}`}
            components={{
                a: LinkRenderer,
                code(props) {
                    const { children, className, node, ref, ...rest } = props
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                        <CodeBlock language={match[1]} {...props}>
                            {String(children).replace(/\n$/, '')}
                        </CodeBlock>
                    ) : (
                        <code {...rest} className={className}>
                            {children}
                        </code>
                    )
                }
            }}
            remarkPlugins={[remarkGfm]}
            // rehypePlugins={[rehypeHighlight]}
            // eslint-disable-next-line react/no-children-prop
            children={value}
        />
    </div>
}

export function LinkRenderer(props: any) {
    return (
        <Tooltip
            className="cursor-pointer bg-gray-950 rounded-md px-4 text-white"
            onClick={(e) => window.open(props.href.length === 0 ? null : props.href, '_blank')}
            content={props.href.length > 50 ? props.href.substring(0, 50) + '...' : props.href.length > 0 ? props.href : '#'}
            placement='top-start'>
            <a href={props.href}
                style={{
                    color: 'blue',
                    textDecoration: 'underline'

                }}
                target="_blank" rel="noreferrer">
                {props.children}
            </a>
        </Tooltip>
    );
}

export default MDPreview;

