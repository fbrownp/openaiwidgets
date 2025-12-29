import React, { useEffect, useMemo, useRef } from 'react';
import { DropdownFilter } from './DropdownFilter';
import { EnhancedBarplot } from './EnhancedBarplot';
import { buildFilterConfigs, parseGPTOutput } from './gpt-adapter';
import { GPTDashboardData, GPTRawOutput } from './gpt-types';
import { HorizontalBarplot } from './HorizontalBarplot';
import { FilterConfig, MetricOption, DataRow, ThemeColors } from './types';
import { WidgetCard } from './WidgetCard';

// Import hooks from parent directory
import { useOpenAiGlobal } from '../use-openai-global';
import { useWidgetState } from '../use-widget-state';

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
            background: '#0f172a',
            cardBackground: '#1e293b',
            cardBorder: '#334155',
            text: '#f1f5f9',
            textSecondary: '#94a3b8',
            buttonText: '#cbd5e1',
            buttonBackground: 'transparent',
            buttonHover: '#334155',
            buttonActiveBg: '#7c3aed',
            buttonActiveText: 'white',
            purple: '#8b5cf6',
            purpleDark: '#7c3aed',
            purpleLight: '#4c1d95',
            border: '#334155',
            borderLight: '#475569',
            gridLine: '#334155',
            dropdownBg: '#1e293b',
            dropdownBorder: '#475569',
            dropdownHover: '#334155',
            dropdownSelected: '#4c1d95'
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

    const [activeView, setActiveView] = React.useState<'proyectos' | 'inversion'>(
        data.activeView
    );
    const [selectedMetric, setSelectedMetric] = React.useState<string>(
        activeView === 'proyectos' ? 'cantidad_proyectos' : 'inversion_total'
    );

    // Update view when data changes
    useEffect(() => {
        setActiveView(data.activeView);
        setSelectedMetric(data.activeView === 'proyectos' ? 'cantidad_proyectos' : 'inversion_total');
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
            padding: '24px'
        }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    marginBottom: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                        <div>
                            <h1 style={{
                                margin: 0,
                                fontSize: 28,
                                fontWeight: 700,
                                color: themeColors.text
                            }}>
                                Dashboard de Proyectos y Empleo
                            </h1>
                            <p style={{
                                margin: '4px 0 0 0',
                                fontSize: 14,
                                color: themeColors.textSecondary
                            }}>
                                Sistema de Evaluación de Impacto Ambiental
                            </p>
                        </div>

                        {/* Theme Toggle */}
                        <div style={{
                            display: 'flex',
                            gap: 8,
                            backgroundColor: themeColors.cardBackground,
                            padding: 4,
                            borderRadius: 8,
                            border: `1px solid ${themeColors.border}`
                        }}>
                            <button
                                onClick={() => setTheme('light')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: theme === 'light' ? themeColors.buttonActiveBg : themeColors.buttonBackground,
                                    color: theme === 'light' ? themeColors.buttonActiveText : themeColors.buttonText,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Blanco
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: theme === 'dark' ? themeColors.buttonActiveBg : themeColors.buttonBackground,
                                    color: theme === 'dark' ? themeColors.buttonActiveText : themeColors.buttonText,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Oscuro
                            </button>
                        </div>
                    </div>

                    {/* View Toggle */}
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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 16,
                    marginTop: 24,
                    marginBottom: 24
                }}>
                    <WidgetCard
                        title="Total de proyectos"
                        value={calculatedWidgets.totalProjects}
                        icon="📊"
                        themeColors={themeColors}
                    />
                    <WidgetCard
                        title="Suma de inversión"
                        value={calculatedWidgets.totalInvestment}
                        icon="💰"
                        themeColors={themeColors}
                    />
                    <WidgetCard
                        title="Tipología principal"
                        value={calculatedWidgets.topTipology}
                        subtitle={`${calculatedWidgets.topTipologyPercentage}% del total`}
                        icon="🏭"
                        themeColors={themeColors}
                    />
                </div>

                {/* Charts */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: 24
                }}>
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
                            twoWayPlot={true}
                            showYAxis={true}
                            height={300}
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
                            height={400}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;