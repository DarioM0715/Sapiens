import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/shared/theme/ThemeProvider";

export const ToggleTheme = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-full p-2 transition-colors duration-200 hover:bg-surface-2 dark:hover:bg-surface"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
};
