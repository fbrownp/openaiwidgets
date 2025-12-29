/**
 * Entry point for SNIFA Dashboard Faltas
 * Mounts the Dashboard component to the DOM
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './Dashboard';

console.log('SNIFA Dashboard Faltas - index.tsx loaded');

const container = document.getElementById('snifa_dashboard_faltas-root');

if (!container) {
    console.error('Could not find root element with id "snifa_dashboard_faltas-root"');
    console.error('Available elements:', document.body.innerHTML);
} else {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <Dashboard />
        </React.StrictMode>
    );
}
