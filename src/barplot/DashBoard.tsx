import React, { useEffect, useMemo, useRef } from 'react';
import { DropdownFilter } from './DropdownFilter';
import { EnhancedBarplot } from './EnhancedBarplot';
import { buildFilterConfigs, parseGPTOutput } from './gpt-adapter';
import { GPTDashboardData, GPTRawOutput } from './gpt-types';
import { HorizontalBarplot } from './HorizontalBarplot';
import { FilterConfig, MetricOption, DataRow } from './types';
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

export function Dashboard() {
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
                "Tipología": "tipologia",
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
            backgroundColor: '#f9fafb',
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
                    <div>
                        <h1 style={{
                            margin: 0,
                            fontSize: 28,
                            fontWeight: 700,
                            color: '#111827'
                        }}>
                            Dashboard de Proyectos y Empleo
                        </h1>
                        <p style={{
                            margin: '4px 0 0 0',
                            fontSize: 14,
                            color: '#6b7280'
                        }}>
                            Sistema de Evaluación de Impacto Ambiental
                        </p>
                    </div>

                    {/* View Toggle */}
                    <div style={{
                        display: 'flex',
                        gap: 8,
                        backgroundColor: 'white',
                        padding: 4,
                        borderRadius: 8,
                        border: '1px solid #e5e7eb'
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
                                backgroundColor: activeView === 'proyectos' ? '#6366f1' : 'transparent',
                                color: activeView === 'proyectos' ? 'white' : '#374151',
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
                                backgroundColor: activeView === 'inversion' ? '#6366f1' : 'transparent',
                                color: activeView === 'inversion' ? 'white' : '#374151',
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
                        value={data.widgets.totalProjects}
                        icon="📊"
                    />
                    <WidgetCard
                        title="Suma de inversión"
                        value={data.widgets.sumInvestment}
                        icon="💰"
                    />
                    <WidgetCard
                        title="Tipología principal"
                        value={data.widgets.topSector}
                        subtitle={`${data.widgets.topSectorPercentage}% del total`}
                        icon="🏭"
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