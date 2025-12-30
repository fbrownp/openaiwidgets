/**
 * Entry point for SNIFA Dashboard Faltas
 * Mounts the Dashboard component to the DOM
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Dashboard } from './Dashboard';

console.log('SNIFA Dashboard Faltas - index.tsx loaded');

const rootElement = document.getElementById('snifa_dashboard_faltas-root');

if (!rootElement) {
    console.error('Could not find root element with id "snifa_dashboard_faltas-root"');
    console.error('Available body content:', document.body.innerHTML);
    throw new Error('Missing snifa_dashboard_faltas-root element');
}

console.log('Mounting SNIFA Dashboard...');
createRoot(rootElement).render(
    <React.StrictMode>
        <Dashboard />
    </React.StrictMode>
);

export { Dashboard };
