import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ variant = "default" }: { variant?: "default" | "onDark" }) {
  const { theme, toggleTheme } = useTheme();

  const styles =
    variant === "onDark"
      ? "text-slate-300 hover:bg-white/10"
      : "text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${styles}`}
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}