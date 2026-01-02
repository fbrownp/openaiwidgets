import React from 'react';
import { createRoot } from 'react-dom/client';
import { Dashboard } from './Dashboard';
import './widget.css';

const rootElement = document.getElementById('widget_reclamacion_brechas-root');

if (!rootElement) {
    throw new Error('Missing widget_reclamacion_brechas-root element');
}

console.log('Mounting Brechas Analysis Widget Dashboard...');
createRoot(rootElement).render(
    <React.StrictMode>
        <Dashboard />
    </React.StrictMode>
);

export { Dashboard };
export { BrechaCard } from './BrechaCard';
export { BrechaSelector } from './BrechaSelector';
export * from './types';
export * from './gpt-types';
export * from './gpt-adapter';
