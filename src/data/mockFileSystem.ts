export type FileType = {
  type: 'file' | 'directory';
  name: string;
  content?: string;
  children?: Record<string, FileType>;
}

export const mockFileSystem: Record<string, FileType> = {
  "package.json": {
    type: "file",
    name: "package.json",
    content: `{
  "name": "react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-icons": "^1.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}`
  },
  "tsconfig.json": {
    type: "file",
    name: "tsconfig.json",
    content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
  },
  "vite.config.ts": {
    type: "file",
    name: "vite.config.ts",
    content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})`
  },
  "src": {
    type: "directory",
    name: "src",
    children: {
      "components": {
        type: "directory",
        name: "components",
        children: {
          "common": {
            type: "directory",
            name: "common",
            children: {
              "Button.tsx": {
                type: "file",
                name: "Button.tsx",
                content: `// A basic button implementation with performance issues
import { useState, useEffect } from 'react';

export const Button = ({ children, onClick }) => {
  // TODO: Fix prop types
  // TODO: Add loading state
  // TODO: Add proper event handling
  const [isHovered, setIsHovered] = useState(false);

  // Inefficient effect
  useEffect(() => {
    console.log('Button rendered');
  });

  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};`
              },
              "Input.tsx": {
                type: "file",
                name: "Input.tsx",
                content: `// Input component with validation issues
export const Input = ({ value, onChange }) => {
  // TODO: Add proper validation
  // TODO: Add error handling
  // TODO: Add accessibility features
  return (
    <input 
      value={value}
      onChange={onChange}
    />
  );
};`
              }
            }
          },
          "features": {
            type: "directory",
            name: "features",
            children: {
              "auth": {
                type: "directory",
                name: "auth",
                children: {
                  "AuthContext.tsx": {
                    type: "file",
                    name: "AuthContext.tsx",
                    content: `// Basic auth context with no error handling or persistence
import { createContext, useState } from 'react';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // TODO: Add proper auth state management
  // TODO: Add persistence
  // TODO: Add error handling
  // TODO: Add loading states

  const login = async (credentials) => {
    // Direct API call in component
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};`
                  }
                }
              }
            }
          }
        }
      },
      "services": {
        type: "directory",
        name: "services",
        children: {
          "api.ts": {
            type: "file",
            name: "api.ts",
            content: `// Basic API service with no error handling or interceptors
const api = {
  get: (url) => fetch(url).then(res => res.json()),
  post: (url, data) => fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json())
};

export default api;`
          }
        }
      },
      "App.tsx": {
        type: "file",
        name: "App.tsx",
        content: `// Root component with performance issues
import { useState, useEffect } from 'react';
import { AuthProvider } from './components/features/auth/AuthContext';

function App() {
  // Inefficient state management
  const [data, setData] = useState([]);

  useEffect(() => {
    // Direct API call
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <AuthProvider>
      <div>
        {/* Unoptimized rendering */}
        {data.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </AuthProvider>
  );
}`
      }
    }
  }
}; 