/**
 * Entry point for SNIFA Dashboard Faltas
 * Mounts the Dashboard component to the DOM
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './Dashboard';

const container = document.getElementById('snifa-dashboard-faltas-root');

if (!container) {
    console.error('Could not find root element with id "snifa-dashboard-faltas-root"');
} else {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <Dashboard />
        </React.StrictMode>
    );
}
