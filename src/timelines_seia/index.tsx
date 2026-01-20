import React from 'react';
import { createRoot } from 'react-dom/client';
import { Dashboard } from './Dashboard';

const rootElement = document.getElementById('timelines_seia-root');

if (!rootElement) {
    throw new Error('Missing timelines_seia-root element');
}

console.log('Mounting Timelines SEIA Dashboard...');
createRoot(rootElement).render(
    <React.StrictMode>
        <Dashboard />
    </React.StrictMode>
);

export { Dashboard };
