import { useContext } from "react";
import { ThemeContext } from "../services/AppThemeProvider";

const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within an AppThemeProvider");
    }
    return context;
};

export { useTheme };

