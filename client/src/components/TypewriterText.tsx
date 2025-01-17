import { useEffect, useState } from "react";
import MDPreview from "./MDPreview";

interface TypewriterTextProps {
    text: string;
    speed?: number;
    success: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 30, success }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (text.length > displayedText.length) {
            setCurrentIndex(displayedText.length);
        }
    }, [text]);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setDisplayedText(text.slice(0, currentIndex + 1));
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timer);
        }
    }, [currentIndex, text, speed]);

    return (
        <MDPreview
            className={`inline-block px-4 py-2 rounded-lg ${!success ? 'bg-red-400 text-white' : 'bg-gray-200'
                }`}
            value={displayedText}
        />
    );
};

export default TypewriterText;