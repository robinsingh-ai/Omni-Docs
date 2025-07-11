import { useEffect, useState } from "react";
import MDPreview from "./MDPreview";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setAnimating } from "../redux/reducers/chatSlice";

interface TypewriterTextProps {
    text: string;
    speed?: number;
    success: boolean;
    animate?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 30, success, animate }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        if (text.length > displayedText.length) {
            setCurrentIndex(displayedText.length);
        }
    }, [text]);

    useEffect(() => {
        if (!animate) {
            // If animation is disabled, show full text immediately
            setDisplayedText(text);
            dispatch(setAnimating(false));
            return;
        }
        if (currentIndex < text.length) {
            dispatch(setAnimating(true));
            const timer = setTimeout(() => {
                setDisplayedText(text.slice(0, currentIndex + 1));
                setCurrentIndex(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timer);
        } else {
            dispatch(setAnimating(false));
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