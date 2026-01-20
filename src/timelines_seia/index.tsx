import React from 'react';
import { createRoot } from 'react-dom/client';
import { Dashboard } from './Dashboard';

const rootElement = document.getElementById('component-root');

if (!rootElement) {
    throw new Error('Root element not found');
}

createRoot(rootElement).render(<Dashboard />);
