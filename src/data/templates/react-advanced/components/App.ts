export const appComponent = `// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '../store';
import { Layout } from './Layout';
import { ThemeProvider } from './ThemeProvider';

const queryClient = new QueryClient();

export function App() {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(
      Provider,
      { store },
      React.createElement(
        ThemeProvider,
        null,
        React.createElement(Layout)
      )
    )
  );
}`; 