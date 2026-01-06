/**
 * Unified Theme Configuration for OpenAI Widgets
 *
 * This file defines the standard theme colors and styles used across all widgets.
 * All widgets should import and use these theme definitions to ensure consistency.
 */

export type Theme = 'light' | 'dark';

export interface ThemeColors {
    // Background colors
    background: string;
    cardBackground: string;
    cardBorder: string;

    // Text colors
    text: string;
    textSecondary: string;

    // Button colors
    buttonText: string;
    buttonBackground: string;
    buttonHover: string;
    buttonActiveBg: string;
    buttonActiveText: string;

    // Accent colors
    purple: string;
    purpleDark: string;
    purpleLight: string;

    // Border and grid colors
    border: string;
    borderLight: string;
    gridLine: string;

    // Dropdown colors
    dropdownBg: string;
    dropdownBorder: string;
    dropdownHover: string;
    dropdownSelected: string;

    // Optional chip colors (for observation widget)
    chipBackground?: string;
    chipText?: string;
    chipSimilarBg?: string;
    chipIdenticalBg?: string;
    chipPAC1Bg?: string;
    chipPAC2Bg?: string;
    chipPCPIBg?: string;
    chipTipificacionBg?: string;
    citeBorder?: string;
    citeBackground?: string;
}

/**
 * Get theme colors based on the current theme
 * @param theme - The theme mode ('light' or 'dark')
 * @returns ThemeColors object with all color definitions
 */
export const getThemeColors = (theme: Theme): ThemeColors => {
    if (theme === 'dark') {
        return {
            // Dark mode background colors
            background: '#212121',
            cardBackground: '#2d2d2d',
            cardBorder: '#404040',

            // Dark mode text colors
            text: '#ffffff',
            textSecondary: '#b0b0b0',

            // Dark mode button colors
            buttonText: '#e0e0e0',
            buttonBackground: 'transparent',
            buttonHover: '#404040',
            buttonActiveBg: '#8b5cf6',
            buttonActiveText: 'white',

            // Dark mode accent colors
            purple: '#a78bfa',
            purpleDark: '#8b5cf6',
            purpleLight: '#6d28d9',

            // Dark mode borders and grid
            border: '#404040',
            borderLight: '#4a4a4a',
            gridLine: '#404040',

            // Dark mode dropdown colors
            dropdownBg: '#2d2d2d',
            dropdownBorder: '#4a4a4a',
            dropdownHover: '#404040',
            dropdownSelected: '#4c1d95',

            // Dark mode chip colors
            chipBackground: '#404040',
            chipText: '#e0e0e0',
            chipSimilarBg: '#3b82f6',
            chipIdenticalBg: '#10b981',
            chipPAC1Bg: '#a78bfa',
            chipPAC2Bg: '#fb923c',
            chipPCPIBg: '#f87171',
            chipTipificacionBg: '#818cf8',
            citeBorder: '#8b5cf6',
            citeBackground: '#1f1f1f'
        };
    }

    // Light mode
    return {
        // Light mode background colors
        background: '#f9fafb',
        cardBackground: 'white',
        cardBorder: '#f0f0f0',

        // Light mode text colors
        text: '#111827',
        textSecondary: '#6b7280',

        // Light mode button colors
        buttonText: '#374151',
        buttonBackground: 'transparent',
        buttonHover: '#f3f4f6',
        buttonActiveBg: '#7c3aed',
        buttonActiveText: 'white',

        // Light mode accent colors
        purple: '#8b5cf6',
        purpleDark: '#7c3aed',
        purpleLight: '#f0f0ff',

        // Light mode borders and grid
        border: '#e5e7eb',
        borderLight: '#f0f0f0',
        gridLine: '#f0f0f0',

        // Light mode dropdown colors
        dropdownBg: 'white',
        dropdownBorder: '#d1d5db',
        dropdownHover: '#f9fafb',
        dropdownSelected: '#f0f0ff',

        // Light mode chip colors
        chipBackground: '#f3f4f6',
        chipText: '#374151',
        chipSimilarBg: '#3b82f6',
        chipIdenticalBg: '#10b981',
        chipPAC1Bg: '#8b5cf6',
        chipPAC2Bg: '#f59e0b',
        chipPCPIBg: '#ef4444',
        chipTipificacionBg: '#6366f1',
        citeBorder: '#8b5cf6',
        citeBackground: '#f9fafb'
    };
};

/**
 * Default theme for all widgets
 */
export const DEFAULT_THEME: Theme = 'dark';
