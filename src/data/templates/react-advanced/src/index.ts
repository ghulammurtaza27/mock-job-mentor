import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(App)
  )
);

export const indexTs = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(App)
  )
);`; 