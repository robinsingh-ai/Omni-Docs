import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import IconButton from './IconButton';
import { useTheme } from '../hooks/useTheme';
import { Check, Copy } from 'lucide-react';
import CopyIcon from './CopyIcon';
interface CodeBlockProps {
    language: string; // The programming language of the code block (e.g., 'javascript', 'python')
    children: string; // The code to be highlighted
}
/**
 *
 *
 * @param {*} { language, children, ...rest }
 * @return {*} 
 */
const CodeBlock: React.FC<CodeBlockProps> = ({ language, children, ...rest }) => {
    const { theme } = useTheme();
    const dark = theme.mode === 'dark';
    return (
        <div className='relative'>
            <CopyIcon
                id='copy-content'
                message='Copied!'
                tooltip='Copy'
                className='absolute top-[-12px] right-[-12px]'
                data={`${children}`}
                copiedIcon={<Check color='green' />}
                icon={<Copy className='size-5 text-black dark:text-white' />}
            />
            <SyntaxHighlighter
                customStyle={{
                    padding: '0.5em',
                    backgroundColor: 'var(--color-code-surface)',
                }}
                lineProps={{
                    style: {
                        wordBreak: 'break-all', whiteSpace: 'pre-wrap', paddingBottom: 1
                    }
                }}
                // wrapLines={true}
                {...rest}
                PreTag={'div'}
                showLineNumbers={true}
                language={language} style={dark ? a11yDark : docco}>
                {children}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;