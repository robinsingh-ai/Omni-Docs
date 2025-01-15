import React, { useState } from "react";
import IconButton from './IconButton';

interface CopyIconProps {
    className?: string
    icon?: React.ReactNode
    copiedIcon?: React.ReactNode
    onClick?: () => void
    tooltip?: string
    message: string
    data: string
    id: string
}
export default function CopyIcon({ id, className, icon, message, copiedIcon, onClick, data, tooltip }: CopyIconProps) {
    const [copied, setCopied] = useState<boolean>(false);


    function handleIconClick() {
        onClick && onClick();
        navigator.clipboard.writeText(data)
            .then(() => {
                setCopied(true);
            })
            .catch(() => {
                setCopied(false);
            });
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    function CopiedUI() {
        return (<div className='flex items-center gap-1'>
            {copiedIcon}
            {/* <span className='text-xs text-green-500'>{message}</span> */}
        </div>)
    }

    return (
        <IconButton
            ariaLabel={tooltip}
            onClick={handleIconClick} className={className}>
            {!copied ? icon : <CopiedUI />}
        </IconButton>
    )

}