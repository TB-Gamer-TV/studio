
'use client'

import { useLocalStorage } from "@/hooks/use-local-storage";
import { createContext, useContext, useEffect } from "react";

type ThemeState = {
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    font: string;
    setFont: (font: string) => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

const fonts: Record<string, { name: string, family: string }> = {
    'Literata': { name: 'Literata', family: 'serif' },
    'Merriweather': { name: 'Merriweather', family: 'serif' },
    'Roboto': { name: 'Roboto', family: 'sans-serif' },
    'Source Code Pro': { name: 'Source Code Pro', family: 'monospace' },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [primaryColor, setPrimaryColor] = useLocalStorage('theme-primary-color', '28 30% 50%');
    const [font, setFont] = useLocalStorage('theme-font', 'Literata');

    useEffect(() => {
        document.documentElement.style.setProperty('--primary', primaryColor);
    }, [primaryColor]);
    
    useEffect(() => {
        if (fonts[font]) {
            document.documentElement.style.setProperty('--font-body', `${fonts[font].name}, ${fonts[font].family}`);
            document.documentElement.style.setProperty('--font-headline', `${fonts[font].name}, ${fonts[font].family}`);
        }
    }, [font]);


    return (
        <ThemeContext.Provider value={{ primaryColor, setPrimaryColor, font, setFont }}>
            <>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href={`https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,700;1,7..72,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Roboto:wght@400;700&family=Source+Code+Pro:wght@400;700&display=swap`}
                    rel="stylesheet"
                />
                {children}
            </>
        </ThemeContext.Provider>
    );
}

