import '../index.css';
import { motion } from 'framer-motion';

interface SpinnerProps {
    className?: string;
    size?: number;
    color?: string;
    borderWidth?: number;
    loadingText?: string;
}

export default function Spinner({
    className = '',
    size = 40,
    color = 'blue-500',
    borderWidth = 4,
    loadingText,
}: SpinnerProps) {
    const spinnerStyles = {
        height: `${size}px`,
        width: `${size}px`,
        borderWidth: `${borderWidth}px`,
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`flex flex-col items-center justify-center ${className}`}
            role="status"
            aria-label="Loading..."
        >
            <div
                className={`animate-spin rounded-full border-t-transparent border-${color}`}
                style={spinnerStyles}
            />
            {loadingText && (
                <p className="mt-2 text-sm text-gray-600">{loadingText}</p>
            )}
        </motion.div>
    );
}
