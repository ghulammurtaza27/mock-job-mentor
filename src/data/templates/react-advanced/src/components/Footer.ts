export const Footer = `// Footer.tsx
import React from 'react';

export function Footer() {
  return React.createElement(
    'footer',
    { className: 'bg-background border-t py-6' },
    React.createElement(
      'div',
      { className: 'container mx-auto px-4 text-center text-muted-foreground' },
      '© 2024 Your App. All rights reserved.'
    )
  );
}`; 