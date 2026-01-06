import React, { useEffect, useMemo, useRef } from 'react';
import { DropdownFilter } from './DropdownFilter';
import { IndexBarplot } from './IndexBarplot';
import { buildFilterConfigs, parseGPTOutput } from './gpt-adapter';
import { GPTDashboardData, GPTRawOutput } from './gpt-types';
import { FilterConfig, IndexStatus, ThemeColors } from './types';
import { WidgetCard } from './WidgetCard';

// Import hooks from parent directory
import { useOpenAiGlobal } from '../use-openai-global';
import { useWidgetState } from '../use-widget-state';

const createDefaultDashboardState = (): GPTDashboardData => ({
    widgets: {
        totalIndexado: 0,
        documentosProcesados: 0,
        documentosIndexados: 0
    },
    filters: {
        index_name: ['seia'] // Default to SEIA filter
    },
    data: []
});

// Theme configuration
type Theme = 'light' | 'dark';

const getThemeColors = (theme: Theme): ThemeColors => {
    if (theme === 'light') {
        return {
            background: '#f9fafb',
            cardBackground: 'white',
            cardBorder: '#f0f0f0',
            text: '#111827',
            textSecondary: '#6b7280',
            buttonText: '#374151',
            buttonBackground: 'transparent',
            buttonHover: '#f3f4f6',
            buttonActiveBg: '#7c3aed',
            buttonActiveText: 'white',
            purple: '#8b5cf6',
            purpleDark: '#7c3aed',
            purpleLight: '#f0f0ff',
            border: '#e5e7eb',
            borderLight: '#f0f0f0',
            gridLine: '#f0f0f0',
            dropdownBg: 'white',
            dropdownBorder: '#d1d5db',
            dropdownHover: '#f9fafb',
            dropdownSelected: '#f0f0ff'
        };
    } else {
        return {
            background: '#212121',
            cardBackground: '#2d2d2d',
            cardBorder: '#404040',
            text: '#ffffff',
            textSecondary: '#b0b0b0',
            buttonText: '#e0e0e0',
            buttonBackground: 'transparent',
            buttonHover: '#404040',
            buttonActiveBg: '#8b5cf6',
            buttonActiveText: 'white',
            purple: '#a78bfa',
            purpleDark: '#8b5cf6',
            purpleLight: '#6d28d9',
            border: '#404040',
            borderLight: '#4a4a4a',
            gridLine: '#404040',
            dropdownBg: '#2d2d2d',
            dropdownBorder: '#4a4a4a',
            dropdownHover: '#404040',
            dropdownSelected: '#4c1d95'
        };
    }
};

export function Dashboard() {
    // Theme state - start in dark mode
    const [theme, setTheme] = React.useState<Theme>('dark');
    const themeColors = getThemeColors(theme);

    // Handler for expand button - toggle between fullscreen and inline
    const handleExpand = async () => {
        try {
            if (typeof window !== 'undefined' && window.openai?.requestDisplayMode) {
                const currentMode = window.openai.displayMode;
                const newMode = currentMode === 'fullscreen' ? 'inline' : 'fullscreen';
                const result = await window.openai.requestDisplayMode({ mode: newMode });
                console.log('Display mode changed to:', result.mode);
            }
        } catch (error) {
            console.error('Failed to request fullscreen mode:', error);
        }
    };

    // Hook into OpenAI global state using existing hooks
    const toolOutput = useOpenAiGlobal('toolOutput') as GPTRawOutput | null;
    const toolResponseMetadata = useOpenAiGlobal('toolResponseMetadata');
    const widgetStateFromGlobal = useOpenAiGlobal('widgetState') as GPTDashboardData | null;

    // Local widget state management using existing hook
    const [dashboardState, setDashboardState] = useWidgetState<GPTDashboardData>(
        createDefaultDashboardState
    );

    const lastToolOutputRef = useRef<string>("__tool_output_unset__");

    // Merge toolOutput into dashboardState whenever it changes
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
            const baseState = widgetStateFromGlobal ?? dashboardState ?? createDefaultDashboardState();

            // Create next state by merging
            const nextState: GPTDashboardData = {
                widgets: {
                    ...baseState.widgets,
                    ...incomingData.widgets
                },
                filters: {
                    ...baseState.filters,
                    ...incomingData.filters
                },
                data: incomingData.data.length > 0
                    ? incomingData.data
                    : baseState.data
            };

            console.log('Updating dashboard state:', nextState);
            setDashboardState(nextState);
        } catch (error) {
            console.error('Error processing toolOutput:', error);
        }
    }, [toolOutput, toolResponseMetadata, widgetStateFromGlobal]);

    const data = dashboardState ?? createDefaultDashboardState();

    // Build filter configurations
    const filterConfigs = useMemo(() => buildFilterConfigs(data), [data]);
    const [filters, setFilters] = React.useState<FilterConfig[]>(filterConfigs);

    useEffect(() => {
        setFilters(buildFilterConfigs(data));
    }, [data]);

    const handleFilterChange = (filterLabel: string, selectedValues: string[]) => {
        setFilters(prevFilters =>
            prevFilters.map(filter =>
                filter.label === filterLabel
                    ? { ...filter, selectedValues }
                    : filter
            )
        );
    };

    // Filter data based on selected filters
    const applyFilters = (rows: IndexStatus[]): IndexStatus[] => {
        return rows.filter(row => {
            // Check index_name filter
            const indexFilter = filters.find(f => f.label === "Index Name");
            // If no filter selected or empty, default to SEIA
            const selectedValues = indexFilter?.selectedValues.length
                ? indexFilter.selectedValues
                : ['seia'];

            if (!selectedValues.includes(row.index_name)) {
                return false;
            }
            return true;
        });
    };

    // Apply filters to data
    const filteredData = useMemo(
        () => applyFilters(data.data),
        [data.data, filters]
    );

    // Calculate widget values
    // - totalIndexado: FROM FILTERED DATA
    // - documentosProcesados: FROM ALL DATA (no filters)
    // - documentosIndexados: FROM ALL DATA (no filters)
    const calculatedWidgets = useMemo(() => {
        const allData = data.data || [];

        // Documentos Específicos Indexados - WITH filters
        const totalIndexado = filteredData.reduce((sum, row) =>
            sum + (row.indexado || 0), 0
        );

        // Documentos Procesados - WITHOUT filters (all data)
        const documentosProcesados = allData.reduce((sum, row) =>
            sum + (row.pdf_validado || 0), 0
        );

        // Documentos Indexados - WITHOUT filters (all data)
        const documentosIndexados = allData.reduce((sum, row) =>
            sum + (row.indexado || 0), 0
        );

        return {
            totalIndexado,
            documentosProcesados,
            documentosIndexados
        };
    }, [filteredData, data.data]);

    return (
        <div style={{
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundColor: themeColors.background,
            minHeight: '100vh',
            padding: '24px',
            position: 'relative'
        }}>
            {/* Expand Button - Fixed top-right corner */}
            <button
                onClick={handleExpand}
                style={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    padding: '10px',
                    borderRadius: 8,
                    border: `1px solid ${themeColors.border}`,
                    backgroundColor: themeColors.cardBackground,
                    color: themeColors.textSecondary,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = themeColors.buttonHover || '#f3f4f6';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = themeColors.cardBackground;
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
                title="Expand to fullscreen"
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M2 2L6 2M6 2L6 6M6 2L2 6M14 2L10 2M10 2L10 6M10 2L14 6M2 14L6 14M6 14L6 10M6 14L2 10M14 14L10 14M10 14L10 10M10 14L14 10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    marginBottom: 16
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
                                Document Indexing Dashboard
                            </h1>
                            <p style={{
                                margin: '4px 0 0 0',
                                fontSize: 14,
                                color: themeColors.textSecondary
                            }}>
                                Document indexing status by index
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
                        border: `1px solid ${themeColors.border}`,
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
                            Light
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
                            Dark
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <DropdownFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    themeColors={themeColors}
                />

                {/* Widget Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                    marginTop: 24,
                    marginBottom: 24
                }}>
                    <WidgetCard
                        title="Documentos Específicos Indexados"
                        value={calculatedWidgets.totalIndexado}
                        icon="✅"
                        themeColors={themeColors}
                    />
                    <WidgetCard
                        title="Documentos Procesados"
                        value={calculatedWidgets.documentosProcesados}
                        icon="📄"
                        themeColors={themeColors}
                    />
                    <WidgetCard
                        title="Documentos Indexados"
                        value={calculatedWidgets.documentosIndexados}
                        icon="📊"
                        themeColors={themeColors}
                    />
                </div>

                {/* Chart */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: 20
                }}>
                    {filteredData.length > 0 && (
                        <IndexBarplot
                            title="Document Status by Index"
                            data={filteredData}
                            height={Math.max(300, filteredData.length * 50 + 100)}
                            themeColors={themeColors}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
