import React, { useEffect, useMemo, useRef } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { DropdownFilter } from './DropdownFilter';
import { EnhancedBarplot } from './EnhancedBarplot';
import { buildFilterConfigs, parseGPTOutput } from './gpt-adapter';
import { GPTDashboardData, GPTRawOutput } from './gpt-types';
import { HorizontalBarplot } from './HorizontalBarplot';
import { DataRow, FilterConfig, MetricOption, ThemeColors } from './types';
import { WidgetCard } from './WidgetCard';

// Import hooks from parent directory
import { useOpenAiGlobal } from '../use-openai-global';
import { useWidgetState } from '../use-widget-state';

// Icon components - stylish black and white
const BarChartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);

const MoneyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 18V6" />
    </svg>
);

const BuildingIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" />
        <path d="M16 6h.01" />
        <path d="M12 6h.01" />
        <path d="M12 10h.01" />
        <path d="M12 14h.01" />
        <path d="M16 10h.01" />
        <path d="M16 14h.01" />
        <path d="M8 10h.01" />
        <path d="M8 14h.01" />
    </svg>
);

const createDefaultDashboardState = (): GPTDashboardData => ({
    activeView: 'proyectos',
    widgets: {
        totalProjects: 0,
        totalJobs: 0,
        sumInvestment: "MMU$0",
        sumJobs: "0",
        topSector: "N/A",
        topSectorPercentage: "0"
    },
    filters: {
        tipo_ingreso_seia: ["DIA", "EIA"],
        tipologia: [],
        tipologia_letra: [],
        region: [],
        estado_proyecto: [],
        etiqueta_inversion: [],
        ano_presentacion: []
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
                activeView: incomingData.activeView || baseState.activeView,
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

    const [activeView, setActiveView] = React.useState<'proyectos' | 'inversion' | 'paginas'>(
        data.activeView as 'proyectos' | 'inversion' | 'paginas'
    );
    const [selectedMetric, setSelectedMetric] = React.useState<string>(
        activeView === 'proyectos' ? 'cantidad_proyectos' : 'inversion_total'
    );

    // Update view when data changes
    useEffect(() => {
        const newView = data.activeView as 'proyectos' | 'inversion' | 'paginas';
        setActiveView(newView);
        if (newView !== 'paginas') {
            setSelectedMetric(newView === 'proyectos' ? 'cantidad_proyectos' : 'inversion_total');
        }
    }, [data.activeView]);

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
    const applyFilters = (rows: DataRow[]): DataRow[] => {
        return rows.filter(row => {
            // Map filter labels to data fields
            const filterMapping: Record<string, keyof DataRow> = {
                "Tipo de Ingreso": "tipo_ingreso_seia",
                "Letra de tipología": "tipologia_letra",
                "Región": "region",
                "Estado": "estado_proyecto",
                "Nivel de Inversión": "etiqueta_inversion",
                "Año de Presentación": "ano_presentacion"
            };

            // Check all filters
            for (const filter of filters) {
                const fieldName = filterMapping[filter.label];
                if (!fieldName) continue;

                // If filter has selections, check if row matches
                if (filter.selectedValues.length > 0) {
                    const rowValue = row[fieldName];

                    // Convert to string for comparison (handles both string and number fields)
                    const rowValueStr = rowValue?.toString();

                    if (!rowValueStr || !filter.selectedValues.includes(rowValueStr)) {
                        return false; // Row doesn't match this filter
                    }
                }
            }

            return true; // Row matches all filters
        });
    };

    // Aggregate data by year for time series chart
    const aggregateByYear = (rows: DataRow[]): DataRow[] => {
        const yearMap = new Map<number, { cantidad_proyectos: number; inversion_total: number; row: DataRow }>();

        rows.forEach(row => {
            const year = row.ano_presentacion || row.year;
            if (!year) return;

            const existing = yearMap.get(year);
            if (existing) {
                existing.cantidad_proyectos += (row.cantidad_proyectos || 0);
                existing.inversion_total += (row.inversion_total || 0);
            } else {
                yearMap.set(year, {
                    cantidad_proyectos: row.cantidad_proyectos || 0,
                    inversion_total: row.inversion_total || 0,
                    row: { ...row, year, period: year.toString() }
                });
            }
        });

        return Array.from(yearMap.values())
            .map(({ cantidad_proyectos, inversion_total, row }) => ({
                ...row,
                cantidad_proyectos,
                inversion_total
            }))
            .sort((a, b) => (a.year || 0) - (b.year || 0));
    };

    // Aggregate data by region for region chart
    const aggregateByRegion = (rows: DataRow[]): DataRow[] => {
        const regionMap = new Map<string, { cantidad_proyectos: number; inversion_total: number; row: DataRow }>();

        rows.forEach(row => {
            const region = row.region;
            if (!region) return;

            const existing = regionMap.get(region);
            if (existing) {
                existing.cantidad_proyectos += (row.cantidad_proyectos || 0);
                existing.inversion_total += (row.inversion_total || 0);
            } else {
                regionMap.set(region, {
                    cantidad_proyectos: row.cantidad_proyectos || 0,
                    inversion_total: row.inversion_total || 0,
                    row: { ...row, period: region }
                });
            }
        });

        return Array.from(regionMap.values())
            .map(({ cantidad_proyectos, inversion_total, row }) => ({
                ...row,
                cantidad_proyectos,
                inversion_total
            }))
            .sort((a, b) => (b.inversion_total || 0) - (a.inversion_total || 0));
    };

    // Box plot data calculation for Paginas
    type BoxPlotDataPoint = {
        year: number;
        min: number;
        q1: number;
        median: number;
        q3: number;
        max: number;
        outliers?: number[];
    };

    const calculateBoxPlotData = (rows: DataRow[]): BoxPlotDataPoint[] => {
        // Group data by year
        const dataByYear: Record<number, number[]> = {};

        rows.forEach(row => {
            const year = row.ano_presentacion || row.year;
            const paginas = (row as any).paginas;

            // Only include rows with valid year and paginas values
            if (year != null && paginas != null && !isNaN(paginas)) {
                if (!dataByYear[year]) {
                    dataByYear[year] = [];
                }
                dataByYear[year].push(paginas);
            }
        });

        // Calculate quantiles for each year
        const calculateQuantiles = (values: number[]): Omit<BoxPlotDataPoint, 'year'> => {
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
    };

    // Apply filters and transform data for each chart
    const filteredData = useMemo(
        () => applyFilters(data.data),
        [data.data, filters]
    );

    const filteredTimeSeriesData = useMemo(
        () => aggregateByYear(filteredData),
        [filteredData]
    );

    const filteredRegionData = useMemo(
        () => aggregateByRegion(filteredData),
        [filteredData]
    );

    const boxPlotData = useMemo(
        () => calculateBoxPlotData(filteredData),
        [filteredData]
    );

    // Calculate widget values from filtered data
    const calculatedWidgets = useMemo(() => {
        if (!filteredData || filteredData.length === 0) {
            return {
                totalProjects: 0,
                totalInvestment: "MMU$0",
                topTipology: "N/A",
                topTipologyPercentage: "0"
            };
        }

        // Calculate total investment
        const totalInvestment = filteredData.reduce((sum, row) =>
            sum + (row.inversion_total || 0), 0
        );

        // Calculate total projects
        const totalProjects = filteredData.reduce((sum, row) =>
            sum + (row.cantidad_proyectos || 0), 0
        );

        // Calculate top tipology (by cantidad_proyectos)
        const tipologyMap = new Map<string, number>();
        filteredData.forEach(row => {
            const tipologia = row.tipologia_letra || 'N/A';
            const cantidad = row.cantidad_proyectos || 0;
            tipologyMap.set(
                tipologia,
                (tipologyMap.get(tipologia) || 0) + cantidad
            );
        });

        let topTipology = 'N/A';
        let topTipologyAmount = 0;
        tipologyMap.forEach((amount, tipologia) => {
            if (amount > topTipologyAmount) {
                topTipologyAmount = amount;
                topTipology = tipologia;
            }
        });

        // Calculate percentage
        const topTipologyPercentage = totalProjects > 0
            ? ((topTipologyAmount / totalProjects) * 100).toFixed(1)
            : "0";

        // Format investment (in millions)
        const formattedInvestment = totalInvestment >= 1000000
            ? `MMU$${(totalInvestment / 1000000).toFixed(3)}`
            : totalInvestment >= 1000
                ? `MU$${(totalInvestment / 1000).toFixed(1)}`
                : `U$${totalInvestment.toFixed(0)}`;

        return {
            totalProjects,
            totalInvestment: formattedInvestment,
            topTipology,
            topTipologyPercentage
        };
    }, [filteredData]);

    const metricOptions: MetricOption[] = activeView === 'proyectos'
        ? [
            { label: "Inversión Total", value: "inversion_total" },
            { label: "Cantidad de Proyectos", value: "cantidad_proyectos" }
        ]
        : [
            { label: "Cantidad de Proyectos", value: "cantidad_proyectos" },
            { label: "Inversión Total", value: "inversion_total" }
        ];

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
                                Dashboard de Proyectos e Inversión
                            </h1>
                            <p style={{
                                margin: '4px 0 0 0',
                                fontSize: 14,
                                color: themeColors.textSecondary
                            }}>
                                Sistema de Evaluación de Impacto Ambiental
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
                                onClick={() => {
                                    setActiveView('proyectos');
                                    setSelectedMetric('cantidad_proyectos');
                                }}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: activeView === 'proyectos' ? themeColors.buttonActiveBg : themeColors.buttonBackground,
                                    color: activeView === 'proyectos' ? themeColors.buttonActiveText : themeColors.buttonText,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Proyectos
                            </button>
                            <button
                                onClick={() => {
                                    setActiveView('inversion');
                                    setSelectedMetric('inversion_total');
                                }}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: activeView === 'inversion' ? themeColors.buttonActiveBg : themeColors.buttonBackground,
                                    color: activeView === 'inversion' ? themeColors.buttonActiveText : themeColors.buttonText,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Inversión
                            </button>
                            <button
                                onClick={() => {
                                    setActiveView('paginas');
                                }}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: activeView === 'paginas' ? themeColors.buttonActiveBg : themeColors.buttonBackground,
                                    color: activeView === 'paginas' ? themeColors.buttonActiveText : themeColors.buttonText,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Paginas
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
                        title="Total de proyectos"
                        value={calculatedWidgets.totalProjects}
                        icon={<BarChartIcon />}
                        themeColors={themeColors}
                    />
                    <WidgetCard
                        title="Suma de inversión"
                        value={calculatedWidgets.totalInvestment}
                        icon={<MoneyIcon />}
                        themeColors={themeColors}
                    />
                    <WidgetCard
                        title="Tipología principal"
                        value={calculatedWidgets.topTipology}
                        subtitle={`${calculatedWidgets.topTipologyPercentage}% del total`}
                        icon={<BuildingIcon />}
                        themeColors={themeColors}
                    />
                </div>

                {/* Charts */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: 20
                }}>
                    {activeView === 'paginas' ? (
                        // Box-plot for Paginas tab
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
                                    options={{
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
                                                text: 'Año',
                                                style: {
                                                    color: themeColors.text,
                                                    fontSize: '14px',
                                                    fontWeight: 600
                                                }
                                            }
                                        },
                                        yaxis: {
                                            title: {
                                                text: 'Páginas',
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
                                                formatter: (val) => `${val.toFixed(0)} páginas`
                                            }
                                        },
                                        colors: [themeColors.purple]
                                    } as ApexOptions}
                                    series={[{
                                        name: 'Páginas',
                                        type: 'boxPlot' as const,
                                        data: boxPlotData.map(d => ({
                                            x: d.year.toString(),
                                            y: [d.min, d.q1, d.median, d.q3, d.max]
                                        }))
                                    }]}
                                    type="boxPlot"
                                    height={500}
                                />
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: 60,
                                    color: themeColors.textSecondary
                                }}>
                                    <div style={{ fontSize: 16, fontWeight: 500 }}>
                                        No hay datos de páginas disponibles
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            {filteredTimeSeriesData.length > 0 && (
                                <EnhancedBarplot
                                    title={activeView === 'proyectos'
                                        ? "Evolución de Proyectos por Año"
                                        : "Evolución de Inversión por Año"
                                    }
                                    metricOptions={metricOptions}
                                    selectedMetric={selectedMetric}
                                    rows={filteredTimeSeriesData}
                                    onMetricChange={setSelectedMetric}
                                    twoWayPlot={false}
                                    showYAxis={true}
                                    height={280}
                                    themeColors={themeColors}
                                />
                            )}

                            {filteredRegionData.length > 0 && (
                                <HorizontalBarplot
                                    title={activeView === 'proyectos'
                                        ? "Distribución por Región - Proyectos"
                                        : "Distribución por Región - Inversión"
                                    }
                                    metricOptions={metricOptions}
                                    selectedMetric={selectedMetric}
                                    rows={filteredRegionData}
                                    onMetricChange={setSelectedMetric}
                                    height={280}
                                    themeColors={themeColors}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;