import { createContext, useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.style.setProperty('--bg-primary', '#0f172a');
      document.documentElement.style.setProperty('--bg-secondary', '#1e293b');
      document.documentElement.style.setProperty('--bg-tertiary', '#334155');
      document.documentElement.style.setProperty('--text-primary', '#f8fafc');
      document.documentElement.style.setProperty('--text-secondary', '#e2e8f0');
      document.documentElement.style.setProperty('--text-tertiary', '#cbd5e1');
      document.documentElement.style.setProperty('--border-color', '#475569');
      document.documentElement.style.setProperty('--accent-primary', '#14b8a6');
      document.documentElement.style.setProperty('--accent-secondary', '#14b8a6');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.style.setProperty('--bg-primary', '#ffffff');
      document.documentElement.style.setProperty('--bg-secondary', '#f9fafb');
      document.documentElement.style.setProperty('--bg-tertiary', '#f3f4f6');
      document.documentElement.style.setProperty('--text-primary', '#111827');
      document.documentElement.style.setProperty('--text-secondary', '#374151');
      document.documentElement.style.setProperty('--text-tertiary', '#6b7280');
      document.documentElement.style.setProperty('--border-color', '#d1d5db');
      document.documentElement.style.setProperty('--accent-primary', '#14b8a6');
      document.documentElement.style.setProperty('--accent-secondary', '#14b8a6');
    }
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    theme: isDarkMode ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 