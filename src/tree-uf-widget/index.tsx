import React from 'react';
import { createRoot } from 'react-dom/client';
import { Dashboard } from './Dashboard';
import './widget.css';

const rootElement = document.getElementById('tree-uf-widget-root');

if (!rootElement) {
    throw new Error('Missing tree-uf-widget-root element');
}

console.log('Mounting Tree UF Widget...');
createRoot(rootElement).render(
    <React.StrictMode>
        <Dashboard />
    </React.StrictMode>
);

export { Dashboard };
export { TreeCard } from './TreeCard';
export { ConnectionLines } from './ConnectionLines';
export * from './types';
export * from './gpt-types';
export * from './gpt-adapter';
