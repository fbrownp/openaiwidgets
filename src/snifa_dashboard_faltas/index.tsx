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

// Get initial data from window object if available
// This is set by the GPT endpoint
const initialData = (window as any).__SNIFA_DASHBOARD_DATA__ || null;

if (initialData) {
    console.log('Received data from endpoint:', {
        dataRows: initialData.data?.length,
        sample: initialData.data?.[0]
    });
} else {
    console.log('No data from endpoint, will use placeholder data');
}

console.log('Mounting SNIFA Dashboard...');
createRoot(rootElement).render(
    <React.StrictMode>
        <Dashboard initialData={initialData} />
    </React.StrictMode>
);

export { Dashboard };
