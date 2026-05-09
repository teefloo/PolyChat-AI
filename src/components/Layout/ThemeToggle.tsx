import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useSettings();

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`polychat-btn-modern theme-toggle-btn ${isDark ? 'dark-theme' : 'light-theme'}`}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default ThemeToggle;
