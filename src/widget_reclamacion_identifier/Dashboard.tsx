import React, { useEffect, useRef } from 'react';
import { createDefaultObservationsData, parseGPTOutput } from './gpt-adapter';
import { GPTObservationsData, GPTRawOutput } from './gpt-types';
import { ObservationCarousel } from './ObservationCarousel';
import { ThemeColors } from './types';

// Import hooks from parent directory
import { useOpenAiGlobal } from '../use-openai-global';
import { useWidgetState } from '../use-widget-state';

// Theme configuration
type Theme = 'light' | 'dark';

const getThemeColors = (theme: Theme): ThemeColors => {
    if (theme === 'light') {
        return {
            background: '#f9fafb',
            cardBackground: 'white',
            cardBorder: '#e5e7eb',
            text: '#111827',
            textSecondary: '#6b7280',
            chipBackground: '#f3f4f6',
            chipText: '#374151',
            chipSimilarBg: '#3b82f6',      // Blue for Similar
            chipIdenticalBg: '#10b981',     // Green for Identical
            chipPAC1Bg: '#8b5cf6',          // Purple for PAC_1
            chipPAC2Bg: '#f59e0b',          // Orange for PAC_2
            chipPCPIBg: '#ef4444',          // Red for PCPI
            chipTipificacionBg: '#6366f1',  // Indigo for tipificacion
            citeBorder: '#8b5cf6',
            citeBackground: '#f9fafb'
        };
    } else {
        return {
            background: '#212121',
            cardBackground: '#2d2d2d',
            cardBorder: '#404040',
            text: '#ffffff',
            textSecondary: '#b0b0b0',
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
};

export function Dashboard() {
    // Theme state
    const [theme, setTheme] = React.useState<Theme>('light');
    const themeColors = getThemeColors(theme);

    // Hook into OpenAI global state using existing hooks
    const toolOutput = useOpenAiGlobal('toolOutput') as GPTRawOutput | null;
    const toolResponseMetadata = useOpenAiGlobal('toolResponseMetadata');
    const widgetStateFromGlobal = useOpenAiGlobal('widgetState') as GPTObservationsData | null;

    // Local widget state management using existing hook
    const [observationsState, setObservationsState] = useWidgetState<GPTObservationsData>(
        createDefaultObservationsData
    );

    const lastToolOutputRef = useRef<string>("__tool_output_unset__");

    // Merge toolOutput into observationsState whenever it changes
    useEffect(() => {
        if (toolOutput == null) {
            console.log('No toolOutput available');
            return;
        }

        // Serialize to check if actually changed
        const serializedToolOutput = (() => {
            try {
                return JSON.stringify({ toolOutput, toolResponseMetadata });
            } catch (error) {
                console.warn("Unable to serialize toolOutput", error);
                return "__tool_output_error__";
            }
        })();

        if (serializedToolOutput === lastToolOutputRef.current) {
            console.log('toolOutput unchanged, skipping update');
            return;
        }
        lastToolOutputRef.current = serializedToolOutput;

        console.log('Processing new toolOutput:', toolOutput);

        try {
            // Parse the MCP tool output
            const incomingData = parseGPTOutput(toolOutput);

            // Merge with existing widgetState (from previous turn)
            const baseState = widgetStateFromGlobal ?? observationsState ?? createDefaultObservationsData();

            // Create next state by merging
            const nextState: GPTObservationsData = {
                observations_reference: incomingData.observations_reference.length > 0
                    ? incomingData.observations_reference
                    : baseState.observations_reference
            };

            console.log('Updating observations state:', nextState);
            setObservationsState(nextState);
        } catch (error) {
            console.error('Error processing toolOutput:', error);
        }
    }, [toolOutput, toolResponseMetadata, widgetStateFromGlobal]);

    const data = observationsState ?? createDefaultObservationsData();

    return (
        <div style={{
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundColor: themeColors.background,
            minHeight: '100vh',
            padding: '24px'
        }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    marginBottom: 24
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 16,
                        marginBottom: 12
                    }}>
                        <div>
                            <h1 style={{
                                margin: 0,
                                fontSize: 28,
                                fontWeight: 700,
                                color: themeColors.text
                            }}>
                                Identificador de Observaciones Similares
                            </h1>
                            <p style={{
                                margin: '4px 0 0 0',
                                fontSize: 14,
                                color: themeColors.textSecondary
                            }}>
                                Búsqueda de observaciones idénticas o similares en el sistema
                            </p>
                        </div>
                    </div>

                    {/* Theme Toggle */}
                    <div style={{
                        display: 'flex',
                        gap: 8,
                        backgroundColor: themeColors.cardBackground,
                        padding: 4,
                        borderRadius: 8,
                        border: `1px solid ${themeColors.cardBorder}`,
                        width: 'fit-content'
                    }}>
                        <button
                            onClick={() => setTheme('light')}
                            style={{
                                padding: '6px 14px',
                                borderRadius: 6,
                                border: 'none',
                                backgroundColor: theme === 'light' ? '#8b5cf6' : 'transparent',
                                color: theme === 'light' ? 'white' : themeColors.text,
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Claro
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            style={{
                                padding: '6px 14px',
                                borderRadius: 6,
                                border: 'none',
                                backgroundColor: theme === 'dark' ? '#8b5cf6' : 'transparent',
                                color: theme === 'dark' ? 'white' : themeColors.text,
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Oscuro
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                {data.observations_reference.length > 0 && (
                    <div style={{
                        backgroundColor: themeColors.cardBackground,
                        borderRadius: 8,
                        padding: '16px 20px',
                        marginBottom: 24,
                        border: `1px solid ${themeColors.cardBorder}`,
                        display: 'flex',
                        gap: 24,
                        flexWrap: 'wrap'
                    }}>
                        <div>
                            <div style={{
                                fontSize: 12,
                                color: themeColors.textSecondary,
                                marginBottom: 4
                            }}>
                                Total de observaciones encontradas
                            </div>
                            <div style={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: themeColors.text
                            }}>
                                {data.observations_reference.length}
                            </div>
                        </div>

                        <div style={{
                            width: 1,
                            backgroundColor: themeColors.cardBorder
                        }} />

                        <div>
                            <div style={{
                                fontSize: 12,
                                color: themeColors.textSecondary,
                                marginBottom: 4
                            }}>
                                Observaciones idénticas
                            </div>
                            <div style={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: '#10b981'
                            }}>
                                {data.observations_reference.filter(obs => obs.similitud === 'Identica').length}
                            </div>
                        </div>

                        <div style={{
                            width: 1,
                            backgroundColor: themeColors.cardBorder
                        }} />

                        <div>
                            <div style={{
                                fontSize: 12,
                                color: themeColors.textSecondary,
                                marginBottom: 4
                            }}>
                                Observaciones similares
                            </div>
                            <div style={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: '#3b82f6'
                            }}>
                                {data.observations_reference.filter(obs => obs.similitud === 'Similar').length}
                            </div>
                        </div>
                    </div>
                )}

                {/* Carousel */}
                <div style={{
                    backgroundColor: themeColors.cardBackground,
                    borderRadius: 12,
                    padding: '32px',
                    border: `1px solid ${themeColors.cardBorder}`,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                    <ObservationCarousel
                        observations={data.observations_reference}
                        themeColors={themeColors}
                    />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
