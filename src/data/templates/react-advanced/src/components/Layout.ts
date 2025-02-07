export const Layout = `// Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout() {
  return React.createElement(
    'div',
    { className: 'min-h-screen flex flex-col' },
    React.createElement(Navbar),
    React.createElement(
      'main',
      { className: 'flex-1' },
      React.createElement(Outlet)
    ),
    React.createElement(Footer)
  );
}`; 