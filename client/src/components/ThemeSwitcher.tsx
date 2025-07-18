import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "../hooks/useTheme";
import { Button } from "./ui/button";

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const { theme, toggleDarkMode } = useTheme();
    const darkMode = theme.mode === 'dark';

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null
    var iconClass = '';
    if (darkMode) {
        iconClass = 'text-white size-8'
    } else {
        iconClass = 'size-8 text-black'
    }

    return (
        <div className="px-2">
            <Button aria-label="Light Mode" className='h-18 w-18 bg-transparent hover:bg-transparent border-none rounded-full p-4 hover:shadow-md'
                onClick={toggleDarkMode}>
                {darkMode ? <SunIcon className={iconClass} /> : <MoonIcon className={iconClass} />}
            </Button>
        </div>
    )
};