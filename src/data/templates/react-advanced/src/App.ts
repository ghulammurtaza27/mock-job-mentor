import React from 'react';
import { Layout } from './components/Layout';
import { ThemeProvider } from './components/ThemeProvider';

export function App() {
  return React.createElement(
    ThemeProvider,
    null,
    React.createElement(Layout)
  );
} 