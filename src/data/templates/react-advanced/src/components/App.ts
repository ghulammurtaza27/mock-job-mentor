export const App = `// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { Layout } from './components/Layout';
import { ThemeProvider } from './components/ThemeProvider';

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