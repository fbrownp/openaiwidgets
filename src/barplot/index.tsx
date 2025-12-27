import React from 'react';
import { createRoot } from 'react-dom/client';
import { Dashboard } from './Dashboard';

const rootElement = document.getElementById('barplot-root');

if (!rootElement) {
    throw new Error('Missing barplot-root element');
}

console.log('Mounting Dashboard...');
createRoot(rootElement).render(
    <React.StrictMode>
        <Dashboard />
    </React.StrictMode>
);

export { Dashboard };
