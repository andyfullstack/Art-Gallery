import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Sync initial state with current document theme
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDark(isDark);
  }, []);

  const toggle = () => {
    setDark(d => {
      const next = !d;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  return (
    <button
      onClick={toggle}
      className="relative inline-flex items-center justify-center rounded-full transition-colors duration-300 hover:opacity-70"
      aria-label="Toggle theme"
    >
      {/* Animated icon */}
      {dark ? (
        <Moon className="w-5 h-5 text-slate-200 transition-transform duration-300 rotate-12" />
      ) : (
        <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 -rotate-12" />
      )}
    </button>
  );
}

export default ThemeToggle;
