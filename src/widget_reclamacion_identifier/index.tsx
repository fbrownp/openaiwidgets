import React from 'react';
import { createRoot } from 'react-dom/client';
import { Dashboard } from './Dashboard';
import './widget.css';

const rootElement = document.getElementById('widget-reclamacion-identifier-root');

if (!rootElement) {
    throw new Error('Missing widget-reclamacion-identifier-root element');
}

console.log('Mounting Observation Identifier Widget Dashboard...');
createRoot(rootElement).render(
    <React.StrictMode>
        <Dashboard />
    </React.StrictMode>
);

export { Dashboard };
export { ObservationCard } from './ObservationCard';
export { ObservationCarousel } from './ObservationCarousel';
export * from './types';
export * from './gpt-types';
export * from './gpt-adapter';
