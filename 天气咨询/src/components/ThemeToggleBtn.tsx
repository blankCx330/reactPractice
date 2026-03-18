import { useThemeStore } from "../hooks/useThemeStore";

export default function ThemeToggleBtn() {
    const theme = useThemeStore(state => state.theme)
    const toggleTheme = useThemeStore(state => state.toggleTheme)

    return (
        <div className="theme-toggle-btn">
            <button
                onClick={toggleTheme}
                className="
                    rounded-full text-2xl w-20 h-12 border border-2 border-white/50
                    text-black/80 dark:text-white/80
                    hover:bg-gray-300 dark:hover:bg-gray-600
                    transition-colors duration-200
                "
                aria-label={theme === 'light' ? '切换到夜间模式' : '切换到日间模式'}
            >
                {theme === 'light' ? (
                    <i className="qi-100"></i>
                ) : (
                    <i className="qi-150"></i>
                )}
            </button>
        </div>
    )
}