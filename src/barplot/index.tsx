import React from 'react';
import ReactDOM from 'react-dom/client';
import { Dashboard } from './Dashboard';

// Auto-mount when the script loads
const rootId = 'barplot-root';
const rootElement = document.getElementById(rootId);

if (rootElement) {
    console.log(`Mounting dashboard to #${rootId}`);
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <Dashboard />
        </React.StrictMode>
    );
} else {
    console.error(`Root element #${rootId} not found!`);
}

// Export for programmatic usage
export default Dashboard;