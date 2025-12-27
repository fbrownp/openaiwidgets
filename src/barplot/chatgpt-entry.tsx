import React from 'react';
import ReactDOM from 'react-dom/client';
import { Dashboard } from './Dashboard';
import { GPTRawOutput } from './gpt-types';
import { parseGPTOutput } from './gpt-adapter';

/**
 * ChatGPT Entry Point
 * This file provides the interface for ChatGPT to render the dashboard
 *
 * Usage from ChatGPT:
 * 1. GPT outputs data in GPTRawOutput format (see example below)
 * 2. This script parses the data and renders the dashboard
 * 3. The dashboard updates automatically when GPT provides new data
 */

declare global {
    interface Window {
        __GPT_DASHBOARD_DATA__?: GPTRawOutput;
        renderDashboard?: (gptData: GPTRawOutput) => void;
        updateDashboard?: (gptData: Partial<GPTRawOutput>) => void;
    }
}

/**
 * Main render function that ChatGPT will call
 */
export function renderDashboard(gptRawData: GPTRawOutput) {
    const rootId = 'barplot-root';
    let rootElement = document.getElementById(rootId);

    // Create root element if it doesn't exist
    if (!rootElement) {
        rootElement = document.createElement('div');
        rootElement.id = rootId;
        document.body.appendChild(rootElement);
    }

    // Parse GPT output into dashboard format
    const parsedData = parseGPTOutput(gptRawData);

    // Render dashboard
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <Dashboard gptData={parsedData} />
        </React.StrictMode>
    );

    console.log('Dashboard rendered with GPT data:', parsedData);
}

/**
 * Update existing dashboard with new data
 */
export function updateDashboard(partialData: Partial<GPTRawOutput>) {
    const currentData = window.__GPT_DASHBOARD_DATA__ || {};
    const updatedData = { ...currentData, ...partialData } as GPTRawOutput;
    window.__GPT_DASHBOARD_DATA__ = updatedData;
    renderDashboard(updatedData);
}

// Auto-mount when script loads
const initDashboard = () => {
    // Check if GPT data exists in window
    if (window.__GPT_DASHBOARD_DATA__) {
        renderDashboard(window.__GPT_DASHBOARD_DATA__);
    } else {
        // If no GPT data, render with default data (empty props)
        const rootId = 'barplot-root';
        const rootElement = document.getElementById(rootId);

        if (rootElement) {
            ReactDOM.createRoot(rootElement).render(
                <React.StrictMode>
                    <Dashboard />
                </React.StrictMode>
            );
            console.log('Dashboard rendered with default data');
        }
    }

    // Expose functions globally for ChatGPT to call
    window.renderDashboard = renderDashboard;
    window.updateDashboard = updateDashboard;
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}

export default Dashboard;
