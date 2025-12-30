import React from 'react';
import { createRoot } from 'react-dom/client';
import { Dashboard } from './Dashboard';

const rootElement = document.getElementById('indexing_dashboard-root');

if (!rootElement) {
    throw new Error('Missing indexing_dashboard-root element');
}

console.log('Mounting Indexing Dashboard...');
createRoot(rootElement).render(
    <React.StrictMode>
        <Dashboard />
    </React.StrictMode>
);

export { Dashboard };
export type { IndexStatus, FilterConfig, ThemeColors } from './types';
export type { GPTDashboardData, GPTRawOutput } from './gpt-types';
