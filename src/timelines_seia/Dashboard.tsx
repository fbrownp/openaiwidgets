import React, { useState, useEffect, useMemo, useRef } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { DropdownFilter } from './DropdownFilter';
import { TimelineSelector } from './TimelineSelector';
import { parseGPTOutput } from './gpt-adapter';
import { getThemeColors, DEFAULT_THEME, Theme } from '../widget_styles/theme';
import { TimelineDataRow, BoxPlotDataPoint, FilterConfig, DashboardData, Episode } from './types';
import { useOpenAiGlobal } from '../use-openai-global';
import { useWidgetState } from '../use-widget-state';

// Icon component - stylish black and white search/data icon
const SearchDataIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <path d="M11 8v6" />
        <path d="M8 11h6" />
    </svg>
);

/**
 * Format episode ID into human-readable label
 */
function formatEpisodeLabel(episodeId: string): string {
    return episodeId
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Convert episode string IDs to Episode objects
 */
function convertToEpisodes(episodeIds: string[]): Episode[] {
    return episodeIds.map(id => ({
        id,
        label: formatEpisodeLabel(id)
    }));
}

// Episode definitions with hierarchies and labels
const EPISODE_DEFINITIONS = {
    entre_eventos: [
        { id: 'tiempo_entre_presentacion_icsara', label: 'Presentación → ICSARA' },
        { id: 'tiempo_entre_icsara_adenda', label: 'ICSARA → Adenda' },
        { id: 'tiempo_entre_adenda_icsara_complementario', label: 'Adenda → ICSARA Complementario' },
        { id: 'tiempo_entre_icsara_complementario_adenda_complementaria', label: 'ICSARA Complementario → Adenda Complementaria' },
        { id: 'tiempo_entre_adenda_complementaria_ice', label: 'Adenda Complementaria → ICE' },
        { id: 'tiempo_entre_ice_rca', label: 'ICE → RCA' }
    ],
    total: [
        { id: 'tiempo_hasta_presentacion_icsara', label: 'Hasta ICSARA' },
        { id: 'tiempo_hasta_icsara_adenda', label: 'Hasta Adenda' },
        { id: 'tiempo_hasta_adenda_icsara_complementario', label: 'Hasta ICSARA Complementario' },
        { id: 'tiempo_hasta_icsara_complementario_adenda_complementaria', label: 'Hasta Adenda Complementaria' },
        { id: 'tiempo_hasta_adenda_complementaria_ice', label: 'Hasta ICE' },
        { id: 'tiempo_hasta_ice_rca', label: 'Hasta RCA' }
    ]
};

// Create default dashboard state
const createDefaultDashboardState = (): DashboardData => ({
    data: [],
    episodes: [],
    availableFilters: {
        tipo_ingreso_seia: [],
        region: [],
        tipologia_letra: [],
        tipologia: [],
        etiqueta_inversion: []
    }
});

export const Dashboard: React.FC = () => {
    console.log('Timelines SEIA Dashboard rendering...');

    // Theme state - start in dark mode
    const [theme, setTheme] = useState<Theme>('dark');
    const themeColors = getThemeColors(theme);

    // View state - Entre Eventos or Total
    const [activeView, setActiveView] = useState<'entre_eventos' | 'total'>('entre_eventos');

    // Filter state management
    const [filterState, setFilterState] = useState<{
        tipo_ingreso_seia: string[];
        region: string[];
        tipologia_letra: string[];
        tipologia: string[];
        etiqueta_inversion: string[];
    }>({
        tipo_ingreso_seia: [],
        region: [],
        tipologia_letra: [],
        tipologia: [],
        etiqueta_inversion: []
    });

    // Selected episode state
    const [selectedEpisode, setSelectedEpisode] = useState<string>('tiempo_entre_presentacion_icsara');

    // Hook into OpenAI global state
    const toolOutput = useOpenAiGlobal('toolOutput') as any;
    const toolResponseMetadata = useOpenAiGlobal('toolResponseMetadata');
    const widgetStateFromGlobal = useOpenAiGlobal('widgetState') as DashboardData | null;

    // Local widget state management
    const [dashboardState, setDashboardState] = useWidgetState<DashboardData>(
        createDefaultDashboardState
    );

    const lastToolOutputRef = useRef<string>("__tool_output_unset__");

    // Process toolOutput whenever it changes
    useEffect(() => {
        if (toolOutput == null) {
            console.log('No toolOutput available, using default state');
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
            // Parse the tool output
            const incomingData = parseGPTOutput(toolOutput);

            // Merge with existing widgetState (from previous turn)
            const baseState = widgetStateFromGlobal ?? dashboardState ?? createDefaultDashboardState();

            // Create next state by merging
            const nextState: DashboardData = {
                data: incomingData.data.length > 0 ? incomingData.data : baseState.data,
                episodes: incomingData.episodes.length > 0 ? incomingData.episodes : baseState.episodes,
                availableFilters: {
                    tipo_ingreso_seia: incomingData.filters.tipo_ingreso_seia.length > 0
                        ? incomingData.filters.tipo_ingreso_seia
                        : baseState.availableFilters.tipo_ingreso_seia,
                    region: incomingData.filters.region.length > 0
                        ? incomingData.filters.region
                        : baseState.availableFilters.region,
                    tipologia_letra: incomingData.filters.tipologia_letra.length > 0
                        ? incomingData.filters.tipologia_letra
                        : baseState.availableFilters.tipologia_letra,
                    tipologia: incomingData.filters.tipologia.length > 0
                        ? incomingData.filters.tipologia
                        : baseState.availableFilters.tipologia,
                    etiqueta_inversion: incomingData.filters.etiqueta_inversion.length > 0
                        ? incomingData.filters.etiqueta_inversion
                        : baseState.availableFilters.etiqueta_inversion
                }
            };

            console.log('Updating dashboard state:', nextState);
            setDashboardState(nextState);
        } catch (error) {
            console.error('Error processing toolOutput:', error);
        }
    }, [toolOutput, toolResponseMetadata, widgetStateFromGlobal]);

    const dashboardData = dashboardState ?? createDefaultDashboardState();

    // Get episodes for the current view
    const availableEpisodes = useMemo(() => {
        return EPISODE_DEFINITIONS[activeView];
    }, [activeView]);

    // Update selected episode when view changes
    useEffect(() => {
        const firstEpisode = availableEpisodes[0];
        if (firstEpisode && selectedEpisode !== firstEpisode.id) {
            setSelectedEpisode(firstEpisode.id);
        }
    }, [activeView]);

    // Handler for expand button - toggle between fullscreen and inline
    const handleExpand = async () => {
        try {
            if (typeof window !== 'undefined' && (window as any).openai?.requestDisplayMode) {
                const currentMode = (window as any).openai.displayMode;
                const newMode = currentMode === 'fullscreen' ? 'inline' : 'fullscreen';
                const result = await (window as any).openai.requestDisplayMode({ mode: newMode });
                console.log('Display mode changed to:', result.mode);
            }
        } catch (error) {
            console.error('Failed to request fullscreen mode:', error);
        }
    };

    // Build filter configurations
    const buildFilterConfigs = (): FilterConfig[] => {
        const configs: FilterConfig[] = [];

        // Tipo Ingreso SEIA filter
        configs.push({
            label: 'Tipo Ingreso SEIA',
            options: dashboardData.availableFilters.tipo_ingreso_seia.map(value => ({
                label: value,
                value: value
            })),
            selectedValues: filterState.tipo_ingreso_seia,
            multiSelect: true
        });

        // Region filter
        configs.push({
            label: 'Región',
            options: dashboardData.availableFilters.region.map(value => ({
                label: value,
                value: value
            })),
            selectedValues: filterState.region,
            multiSelect: true
        });

        // Letra de Tipologia filter
        configs.push({
            label: 'Letra de Tipología',
            options: dashboardData.availableFilters.tipologia_letra.map(value => ({
                label: value,
                value: value
            })),
            selectedValues: filterState.tipologia_letra,
            multiSelect: true
        });

        // Tipologia filter
        configs.push({
            label: 'Tipología',
            options: dashboardData.availableFilters.tipologia.map(value => ({
                label: value,
                value: value
            })),
            selectedValues: filterState.tipologia,
            multiSelect: true
        });

        // Etiqueta Inversion filter
        configs.push({
            label: 'Etiqueta Inversión',
            options: dashboardData.availableFilters.etiqueta_inversion.map(value => ({
                label: value,
                value: value
            })),
            selectedValues: filterState.etiqueta_inversion,
            multiSelect: true
        });

        return configs;
    };

    // Handle filter changes
    const handleFilterChange = (filterLabel: string, selectedValues: string[]) => {
        const filterKey = {
            'Tipo Ingreso SEIA': 'tipo_ingreso_seia',
            'Región': 'region',
            'Letra de Tipología': 'tipologia_letra',
            'Tipología': 'tipologia',
            'Etiqueta Inversión': 'etiqueta_inversion'
        }[filterLabel] as keyof typeof filterState;

        if (filterKey) {
            setFilterState(prevState => ({
                ...prevState,
                [filterKey]: selectedValues
            }));
        }
    };

    // Apply filters to data
    const filteredData = useMemo(() => {
        let result = [...dashboardData.data];

        // Apply tipo_ingreso_seia filter
        if (filterState.tipo_ingreso_seia.length > 0) {
            result = result.filter(row =>
                filterState.tipo_ingreso_seia.includes(row.tipo_ingreso_seia)
            );
        }

        // Apply region filter
        if (filterState.region.length > 0) {
            result = result.filter(row =>
                filterState.region.includes(row.region)
            );
        }

        // Apply tipologia_letra filter
        if (filterState.tipologia_letra.length > 0) {
            result = result.filter(row =>
                filterState.tipologia_letra.includes(row.tipologia_letra)
            );
        }

        // Apply tipologia filter
        if (filterState.tipologia.length > 0) {
            result = result.filter(row =>
                filterState.tipologia.includes(row.tipologia)
            );
        }

        // Apply etiqueta_inversion filter
        if (filterState.etiqueta_inversion.length > 0) {
            result = result.filter(row =>
                filterState.etiqueta_inversion.includes(row.etiqueta_inversion)
            );
        }

        console.log(`Filtered data: ${result.length} records`);
        return result;
    }, [dashboardData.data, filterState]);

    // Transform data into box plot format grouped by year
    const boxPlotData = useMemo(() => {
        if (filteredData.length === 0) return [];

        // Group data by year
        const dataByYear: Record<number, number[]> = {};

        filteredData.forEach(row => {
            const date = typeof row.expediente_presentacion === 'string'
                ? new Date(row.expediente_presentacion)
                : row.expediente_presentacion;

            const year = date.getFullYear();

            // Get the value for the selected episode
            const episodeValue = row[selectedEpisode] as number | null;

            // Only include non-null values
            if (episodeValue != null && !isNaN(episodeValue)) {
                if (!dataByYear[year]) {
                    dataByYear[year] = [];
                }
                dataByYear[year].push(episodeValue);
            }
        });

        // Calculate quantiles for each year
        const calculateQuantiles = (values: number[]): BoxPlotDataPoint => {
            const sorted = [...values].sort((a, b) => a - b);
            const n = sorted.length;

            const getPercentile = (p: number) => {
                const index = (p / 100) * (n - 1);
                const lower = Math.floor(index);
                const upper = Math.ceil(index);
                const weight = index - lower;
                return sorted[lower] * (1 - weight) + sorted[upper] * weight;
            };

            const q1 = getPercentile(25);
            const median = getPercentile(50);
            const q3 = getPercentile(75);
            const iqr = q3 - q1;

            // Calculate outliers using IQR method
            const lowerFence = q1 - 1.5 * iqr;
            const upperFence = q3 + 1.5 * iqr;

            const outliers = sorted.filter(v => v < lowerFence || v > upperFence);
            const nonOutliers = sorted.filter(v => v >= lowerFence && v <= upperFence);

            const min = nonOutliers.length > 0 ? Math.min(...nonOutliers) : sorted[0];
            const max = nonOutliers.length > 0 ? Math.max(...nonOutliers) : sorted[n - 1];

            return {
                year: 0, // Will be set below
                min,
                q1,
                median,
                q3,
                max,
                outliers: outliers.length > 0 ? outliers : undefined
            };
        };

        // Convert to box plot data points
        const years = Object.keys(dataByYear).map(Number).sort((a, b) => a - b);
        return years.map(year => ({
            ...calculateQuantiles(dataByYear[year]),
            year
        }));
    }, [filteredData, selectedEpisode]);

    // ApexCharts configuration
    const chartOptions: ApexOptions = {
        chart: {
            type: 'boxPlot',
            background: 'transparent',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false
                }
            },
            animations: {
                enabled: true
            }
        },
        theme: {
            mode: theme
        },
        plotOptions: {
            boxPlot: {
                colors: {
                    upper: themeColors.purple,
                    lower: themeColors.purpleLight
                }
            }
        },
        stroke: {
            colors: [theme === 'dark' ? '#ffffff' : '#000000'],
            width: 2
        },
        xaxis: {
            type: 'category',
            categories: boxPlotData.map(d => d.year.toString()),
            labels: {
                style: {
                    colors: themeColors.text,
                    fontSize: '12px'
                }
            },
            title: {
                text: 'Año de Presentación',
                style: {
                    color: themeColors.text,
                    fontSize: '14px',
                    fontWeight: 600
                }
            }
        },
        yaxis: {
            title: {
                text: `${formatEpisodeLabel(selectedEpisode)} (días)`,
                style: {
                    color: themeColors.text,
                    fontSize: '14px',
                    fontWeight: 600
                }
            },
            labels: {
                style: {
                    colors: themeColors.text,
                    fontSize: '12px'
                }
            }
        },
        grid: {
            borderColor: themeColors.gridLine,
            strokeDashArray: 4
        },
        tooltip: {
            theme: theme,
            y: {
                formatter: (val) => `${val.toFixed(0)} días`
            }
        },
        colors: [themeColors.purple]
    };

    const series = [{
        name: formatEpisodeLabel(selectedEpisode),
        type: 'boxPlot',
        data: boxPlotData.map(d => ({
            x: d.year.toString(),
            y: [d.min, d.q1, d.median, d.q3, d.max]
        }))
    }];

    const filters = buildFilterConfigs();

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: themeColors.background,
            padding: 24,
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
                    e.currentTarget.style.backgroundColor = themeColors.buttonHover || themeColors.dropdownHover;
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

            <div style={{
                maxWidth: 1400,
                margin: '0 auto'
            }}>
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
                                Timelines SEIA
                            </h1>
                            <p style={{
                                margin: '4px 0 0 0',
                                fontSize: 14,
                                color: themeColors.textSecondary
                            }}>
                                Análisis de tiempos entre eventos del proceso SEIA
                            </p>
                        </div>

                        {/* View Toggle - Right side */}
                        <div style={{
                            display: 'flex',
                            gap: 8,
                            backgroundColor: themeColors.cardBackground,
                            padding: 4,
                            borderRadius: 8,
                            border: `1px solid ${themeColors.border}`
                        }}>
                            <button
                                onClick={() => setActiveView('entre_eventos')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: activeView === 'entre_eventos' ? themeColors.buttonActiveBg : themeColors.buttonBackground,
                                    color: activeView === 'entre_eventos' ? themeColors.buttonActiveText : themeColors.buttonText,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Entre Eventos
                            </button>
                            <button
                                onClick={() => setActiveView('total')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: activeView === 'total' ? themeColors.buttonActiveBg : themeColors.buttonBackground,
                                    color: activeView === 'total' ? themeColors.buttonActiveText : themeColors.buttonText,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Total
                            </button>
                        </div>
                    </div>

                    {/* Theme Toggle - Below title on left */}
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

                {/* Filters */}
                {filters.length > 0 && filters.some(f => f.options.length > 0) && (
                    <div style={{
                        backgroundColor: themeColors.cardBackground,
                        borderRadius: 12,
                        padding: '0 24px',
                        marginBottom: 24,
                        border: `1px solid ${themeColors.cardBorder}`
                    }}>
                        <DropdownFilter
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            themeColors={themeColors}
                        />
                    </div>
                )}

                {/* Timeline Selector - Full width, above box plot */}
                {availableEpisodes.length > 0 && (
                    <div style={{
                        marginBottom: 24
                    }}>
                        <TimelineSelector
                            episodes={availableEpisodes}
                            selectedEpisode={selectedEpisode}
                            onEpisodeChange={setSelectedEpisode}
                            themeColors={themeColors}
                        />
                    </div>
                )}

                {/* Box Plot Chart - Full width */}
                <div style={{
                    marginBottom: 24
                }}>
                    <div style={{
                        backgroundColor: themeColors.cardBackground,
                        borderRadius: 12,
                        padding: 24,
                        border: `1px solid ${themeColors.cardBorder}`,
                        boxShadow: theme === 'dark'
                            ? '0 1px 3px rgba(0, 0, 0, 0.3)'
                            : '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                        {boxPlotData.length > 0 ? (
                            <Chart
                                options={chartOptions}
                                series={series}
                                type="boxPlot"
                                height={500}
                            />
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: 60,
                                color: themeColors.textSecondary
                            }}>
                                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                                    <SearchDataIcon />
                                </div>
                                <div style={{ fontSize: 16, fontWeight: 500 }}>
                                    Buscando datos disponibles en PIA
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Data Summary */}
                {filteredData.length > 0 && (
                    <div style={{
                        marginTop: 24,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 16
                    }}>
                        <div style={{
                            backgroundColor: themeColors.cardBackground,
                            borderRadius: 12,
                            padding: 20,
                            border: `1px solid ${themeColors.cardBorder}`
                        }}>
                            <div style={{
                                fontSize: 12,
                                color: themeColors.textSecondary,
                                marginBottom: 8,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5
                            }}>
                                Total Registros
                            </div>
                            <div style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: themeColors.purple
                            }}>
                                {filteredData.length}
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: themeColors.cardBackground,
                            borderRadius: 12,
                            padding: 20,
                            border: `1px solid ${themeColors.cardBorder}`
                        }}>
                            <div style={{
                                fontSize: 12,
                                color: themeColors.textSecondary,
                                marginBottom: 8,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5
                            }}>
                                Promedio Días
                            </div>
                            <div style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: themeColors.purple
                            }}>
                                {(() => {
                                    const validValues = filteredData
                                        .map(row => row[selectedEpisode] as number | null)
                                        .filter(val => val != null && !isNaN(val)) as number[];
                                    return validValues.length > 0
                                        ? (validValues.reduce((sum, val) => sum + val, 0) / validValues.length).toFixed(0)
                                        : '0';
                                })()}
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: themeColors.cardBackground,
                            borderRadius: 12,
                            padding: 20,
                            border: `1px solid ${themeColors.cardBorder}`
                        }}>
                            <div style={{
                                fontSize: 12,
                                color: themeColors.textSecondary,
                                marginBottom: 8,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5
                            }}>
                                Años Analizados
                            </div>
                            <div style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: themeColors.purple
                            }}>
                                {boxPlotData.length}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
