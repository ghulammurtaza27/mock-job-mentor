export const Navbar = `// Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../features/ui/uiSlice';

export function Navbar() {
  const dispatch = useDispatch();

  return React.createElement(
    'nav',
    { className: 'bg-background border-b' },
    React.createElement(
      'div',
      { className: 'container mx-auto px-4 py-3 flex items-center justify-between' },
      React.createElement(
        Link,
        { to: '/', className: 'text-xl font-bold' },
        'App'
      ),
      React.createElement(
        'button',
        {
          onClick: () => dispatch(toggleTheme()),
          className: 'p-2 rounded-md hover:bg-muted'
        },
        'Toggle Theme'
      )
    )
  );
}`; 