export const ThemeProvider = `// ThemeProvider.tsx
import React from 'react';
import { useSelector } from 'react-redux';

export function ThemeProvider({ children }) {
  const theme = useSelector((state) => state.ui.theme);
  
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return React.createElement(
    'div',
    { className: theme },
    children
  );
}`; 