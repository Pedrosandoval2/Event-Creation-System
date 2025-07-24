// theme-context.tsx
import { ThemeContext, type Theme } from "@/context/themeProvider"
import { useEffect, useMemo, useState } from "react"

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem("theme") as Theme) || "light"
    })

    useEffect(() => {
        document.documentElement.className = theme
        localStorage.setItem("theme", theme)
    }, [theme])

    const value = useMemo(() => ({
        theme, setTheme
    }), [theme, setTheme])

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}
