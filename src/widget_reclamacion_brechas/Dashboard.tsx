import React, { useEffect, useRef } from 'react';
import { createDefaultBrechasData, parseGPTOutput } from './gpt-adapter';
import { GPTBrechasData, GPTRawOutput } from './gpt-types';
import { BrechaCard } from './BrechaCard';
import { BrechaSelector } from './BrechaSelector';
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
            chipRespuestaInsuficienteBg: '#f59e0b',      // Orange
            chipOmisionBg: '#ef4444',                     // Red
            chipContradiccionBg: '#8b5cf6',               // Purple
            chipAplicaBg: '#10b981',                      // Green
            chipNoAplicaBg: '#6b7280',                    // Gray
            citeBorder: '#8b5cf6',
            citeBackground: '#f9fafb',
            purple: '#8b5cf6',
            purpleDark: '#7c3aed',
            purpleLight: '#f0f0ff',
            accentDefense: '#10b981',      // Green for defense
            accentAllegation: '#ef4444',   // Red for allegation
            accentVoids: '#f59e0b',        // Orange for voids
            border: '#e5e7eb',
            buttonText: '#374151',
            buttonBackground: 'transparent',
            buttonHover: '#f3f4f6',
            buttonActiveBg: '#8b5cf6',
            buttonActiveText: 'white'
        };
    } else {
        // Dark theme - following barplot color scheme
        return {
            background: '#212121',
            cardBackground: '#2d2d2d',
            cardBorder: '#404040',
            text: '#ffffff',
            textSecondary: '#b0b0b0',
            chipBackground: '#404040',
            chipText: '#e0e0e0',
            chipRespuestaInsuficienteBg: '#fb923c',      // Orange
            chipOmisionBg: '#f87171',                     // Red
            chipContradiccionBg: '#a78bfa',               // Purple
            chipAplicaBg: '#10b981',                      // Green
            chipNoAplicaBg: '#6b7280',                    // Gray
            citeBorder: '#a78bfa',
            citeBackground: '#1f1f1f',
            purple: '#a78bfa',
            purpleDark: '#8b5cf6',
            purpleLight: '#6d28d9',
            accentDefense: '#10b981',      // Green for defense
            accentAllegation: '#f87171',   // Red for allegation
            accentVoids: '#fb923c',        // Orange for voids
            border: '#404040',
            buttonText: '#e0e0e0',
            buttonBackground: 'transparent',
            buttonHover: '#404040',
            buttonActiveBg: '#8b5cf6',
            buttonActiveText: 'white'
        };
    }
};

export function Dashboard() {
    // Theme state - starts in dark mode
    const [theme, setTheme] = React.useState<Theme>('dark');
    const themeColors = getThemeColors(theme);

    // Selected brecha index
    const [selectedBrechaIndex, setSelectedBrechaIndex] = React.useState<number>(0);

    // Hook into OpenAI global state using existing hooks
    const toolOutput = useOpenAiGlobal('toolOutput') as GPTRawOutput | null;
    const toolResponseMetadata = useOpenAiGlobal('toolResponseMetadata');
    const widgetStateFromGlobal = useOpenAiGlobal('widgetState') as GPTBrechasData | null;

    // Local widget state management using existing hook
    const [brechasState, setBrechasState] = useWidgetState<GPTBrechasData>(
        createDefaultBrechasData
    );

    const lastToolOutputRef = useRef<string>("__tool_output_unset__");

    // Merge toolOutput into brechasState whenever it changes
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
            const baseState = widgetStateFromGlobal ?? brechasState ?? createDefaultBrechasData();

            // Create next state by merging
            const nextState: GPTBrechasData = {
                data: {
                    analisis_brechas: incomingData.data.analisis_brechas.length > 0
                        ? incomingData.data.analisis_brechas
                        : baseState.data.analisis_brechas
                }
            };

            console.log('Updating brechas state:', nextState);
            setBrechasState(nextState);
        } catch (error) {
            console.error('Error processing toolOutput:', error);
        }
    }, [toolOutput, toolResponseMetadata, widgetStateFromGlobal]);

    const data = brechasState ?? createDefaultBrechasData();

    // Development mode: Load sample data if no data is available
    const isDevelopment = import.meta.env.DEV;
    React.useEffect(() => {
        if (isDevelopment && (!data.data.analisis_brechas || data.data.analisis_brechas.length === 0)) {
            // Load sample data for development
            const sampleData: GPTBrechasData = {
                data: {
                    analisis_brechas: [
                        {
                            potencial_brecha: "Delimitación y justificación del área de influencia de medio humano para Variante Elqui: controversia por omisión de El Almendral y su efecto en la caracterización.",
                            tipo_brecha: "respuesta_insuficiente",
                            justificacion_brecha: "En el expediente aparece una tensión explícita: el observante afirma que la variante Elqui fue incorporada recién en Adenda y que se omitió el grupo humano de El Almendral del área de influencia.",
                            solucion_titular: "El titular plantea que El Almendral fue tratado como entidad rural 'Planta Almendral' dentro de El Maitén y que se encontraría fuera del área de influencia por distancia aproximada de 1,5 km.",
                            resumen_considerado_titular: "El titular fundamenta que las variantes se incorporan en Adenda por modificaciones sustantivas y que se caracterizaron los componentes ambientales pertinentes en anexos específicos.",
                            potenciales_vacios: "1) Persistencia de ambigüedad en reconocer al grupo humano. 2) Criterio de distancia para excluir AI de medio humano carece de robustez. 3) Riesgo de subcaracterización socioeconómica.",
                            potenciales_aristas_titular: "1) Reforzar trazabilidad metodológica con cartografía y evidencias. 2) Aportar descripción explícita del grupo humano. 3) Estandarizar métrica de distancias.",
                            potenciales_aristas_alegato: "1) Insistir en que denominación censal no agota obligación de identificar grupos humanos. 2) Explotar discrepancia de distancias. 3) Cuestionar delimitación de AI.",
                            aplica: "Aplica",
                            referencias: [
                                {
                                    original_name: "/anexo_11-01_anexo_pac_tomo2.zip/93 Observante_PAC.pdf",
                                    first_level_trace: "anexo_11-01_anexo_pac_tomo2.zip",
                                    pages: [6, 25, 34, 35],
                                    sentence_reference: [
                                        "...en adenda se incorporan... una nueva variante elqui... omitido en el area de influencia...",
                                        "...respuesta: ... el sector denominado el almendral se ubica aproximadamente a 1,5 kilometros..."
                                    ],
                                    urls: [
                                        "https://c2c88ce94b9e.ngrok-free.app/custom/pdf_docs/1/244b61a2.pdf?page=6",
                                        "https://c2c88ce94b9e.ngrok-free.app/custom/pdf_docs/1/244b61a2.pdf?page=25"
                                    ]
                                }
                            ]
                        },
                        {
                            potencial_brecha: "Ejemplo de segunda brecha identificada en el análisis legal.",
                            tipo_brecha: "omision",
                            justificacion_brecha: "Ejemplo de justificación para demostración del widget.",
                            solucion_titular: "Ejemplo de solución propuesta por el titular.",
                            resumen_considerado_titular: "Ejemplo de resumen considerado.",
                            potenciales_vacios: "Ejemplo de vacíos potenciales identificados.",
                            potenciales_aristas_titular: "Ejemplo de aristas para la defensa.",
                            potenciales_aristas_alegato: "Ejemplo de aristas para el alegato.",
                            aplica: "No Aplica",
                            referencias: []
                        }
                    ]
                }
            };
            setBrechasState(sampleData);
        }
    }, [isDevelopment]);

    // Reset selected index if it's out of bounds
    useEffect(() => {
        if (selectedBrechaIndex >= data.data.analisis_brechas.length && data.data.analisis_brechas.length > 0) {
            setSelectedBrechaIndex(0);
        }
    }, [data.data.analisis_brechas.length, selectedBrechaIndex]);

    return (
        <div style={{
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundColor: themeColors.background,
            minHeight: '100vh',
            padding: '24px'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
                                Análisis de Brechas Legales
                            </h1>
                            <p style={{
                                margin: '4px 0 0 0',
                                fontSize: 14,
                                color: themeColors.textSecondary
                            }}>
                                Identificación de vacíos, argumentos de defensa y contra-argumentos
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
                                backgroundColor: theme === 'light' ? themeColors.buttonActiveBg : themeColors.buttonBackground,
                                color: theme === 'light' ? themeColors.buttonActiveText : themeColors.buttonText,
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
                                backgroundColor: theme === 'dark' ? themeColors.buttonActiveBg : themeColors.buttonBackground,
                                color: theme === 'dark' ? themeColors.buttonActiveText : themeColors.buttonText,
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
                {data.data.analisis_brechas.length > 0 && (
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
                                Total de Brechas
                            </div>
                            <div style={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: themeColors.text
                            }}>
                                {data.data.analisis_brechas.length}
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
                                Brechas Aplicables
                            </div>
                            <div style={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: themeColors.chipAplicaBg
                            }}>
                                {data.data.analisis_brechas.filter(b => b.aplica.toLowerCase().includes('aplica') && !b.aplica.toLowerCase().includes('no')).length}
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
                                Referencias Totales
                            </div>
                            <div style={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: themeColors.purple
                            }}>
                                {data.data.analisis_brechas.reduce((sum, b) => sum + b.referencias.length, 0)}
                            </div>
                        </div>
                    </div>
                )}

                {/* Brecha Selector */}
                {data.data.analisis_brechas.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                        <BrechaSelector
                            brechas={data.data.analisis_brechas}
                            selectedIndex={selectedBrechaIndex}
                            onSelectBrecha={setSelectedBrechaIndex}
                            themeColors={themeColors}
                        />
                    </div>
                )}

                {/* Brecha Card */}
                {data.data.analisis_brechas.length > 0 ? (
                    <BrechaCard
                        brecha={data.data.analisis_brechas[selectedBrechaIndex]}
                        themeColors={themeColors}
                    />
                ) : (
                    <div style={{
                        backgroundColor: themeColors.cardBackground,
                        borderRadius: 12,
                        padding: '60px 32px',
                        border: `1px solid ${themeColors.cardBorder}`,
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: 48,
                            marginBottom: 16
                        }}>
                            📋
                        </div>
                        <h3 style={{
                            margin: '0 0 8px 0',
                            fontSize: 18,
                            fontWeight: 600,
                            color: themeColors.text
                        }}>
                            No hay brechas para mostrar
                        </h3>
                        <p style={{
                            margin: 0,
                            fontSize: 14,
                            color: themeColors.textSecondary
                        }}>
                            Los datos de análisis de brechas aparecerán aquí cuando estén disponibles
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
