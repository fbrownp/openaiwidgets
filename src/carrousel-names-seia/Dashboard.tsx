import React, { useMemo } from 'react';
import { parseGPTOutput } from './gpt-adapter';
import { ThemeColors } from './types';
import { SeiaProjectCarousel } from './SeiaProjectCarousel';

// Import hooks from parent directory
import { useOpenAiGlobal } from '../use-openai-global';

// Import shared theme
import { getThemeColors, DEFAULT_THEME, Theme } from '../../widget_styles/theme';

export function Dashboard() {
    // Theme state - start with default theme
    const [theme, setTheme] = React.useState<Theme>(DEFAULT_THEME);
    const themeColors = getThemeColors(theme) as ThemeColors;

    // Get tool output from OpenAI
    const { toolOutput } = useOpenAiGlobal();

    // Parse GPT output into projects
    const projects = useMemo(() => {
        return parseGPTOutput(toolOutput);
    }, [toolOutput]);

    return (
        <div style={{
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundColor: themeColors.background,
            minHeight: '100vh',
            padding: 24,
            position: 'relative'
        }}>
            {/* Theme Toggle */}
            <div style={{
                display: 'flex',
                gap: 6,
                padding: 4,
                borderRadius: 8,
                width: 'fit-content',
                marginBottom: 20,
                backgroundColor: themeColors.cardBackground,
                border: `1px solid ${themeColors.cardBorder}`
            }}>
                <button
                    onClick={() => setTheme('light')}
                    style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 500,
                        transition: 'all 0.2s',
                        backgroundColor: theme === 'light' ? themeColors.purple : 'transparent',
                        color: theme === 'light' ? 'white' : themeColors.textSecondary
                    }}
                >
                    Claro
                </button>
                <button
                    onClick={() => setTheme('dark')}
                    style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 500,
                        transition: 'all 0.2s',
                        backgroundColor: theme === 'dark' ? themeColors.purple : 'transparent',
                        color: theme === 'dark' ? 'white' : themeColors.textSecondary
                    }}
                >
                    Oscuro
                </button>
            </div>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{
                    margin: 0,
                    fontSize: 28,
                    fontWeight: 700,
                    color: themeColors.text,
                    marginBottom: 4
                }}>
                    Proyectos SEIA Similares
                </h1>
                <p style={{
                    margin: 0,
                    fontSize: 14,
                    color: themeColors.textSecondary
                }}>
                    {projects.length} {projects.length === 1 ? 'proyecto encontrado' : 'proyectos encontrados'}
                </p>
            </div>

            {/* Carousel */}
            <SeiaProjectCarousel projects={projects} themeColors={themeColors} />
        </div>
    );
}
