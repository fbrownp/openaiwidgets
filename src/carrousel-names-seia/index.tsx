import React from 'react';
import { createRoot } from 'react-dom/client';
import { Dashboard } from './Dashboard';
import './widget.css';

const rootElement = document.getElementById('carrousel-names-seia-root');

if (!rootElement) {
    throw new Error('Missing carrousel-names-seia-root element');
}

console.log('Mounting SEIA Projects Carousel Widget...');
createRoot(rootElement).render(
    <React.StrictMode>
        <Dashboard />
    </React.StrictMode>
);

export { Dashboard };
export { SeiaProjectCard } from './SeiaProjectCard';
export { SeiaProjectCarousel } from './SeiaProjectCarousel';
export * from './types';
export * from './gpt-types';
export * from './gpt-adapter';
