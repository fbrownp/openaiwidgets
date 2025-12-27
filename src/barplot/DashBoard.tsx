import React, { useEffect, useMemo, useRef } from 'react';
import { CandlestickChart } from './CandlestickChart';
import { DropdownFilter } from './DropdownFilter';
import { EnhancedBarplot } from './EnhancedBarplot';
import { buildFilterConfigs, parseGPTOutput } from './gpt-adapter';
import { GPTDashboardData, GPTRawOutput } from './gpt-types';
import { HorizontalBarplot } from './HorizontalBarplot';
import { FilterConfig, MetricOption } from './types';
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
        nivelInversion: ["alto", "medio", "bajo"],
        estado: ["ejecucion", "aprobado", "evaluacion"],
        sectorProductivo: ["industria", "comercio", "servicios"],
        formasPresentacion: ["proyecto", "empleo"],
        regiones: []
    },
    charts: {
        timeSeriesData: [],
        regionData: [],
        candlestickData: []
    }
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
                charts: {
                    timeSeriesData: incomingData.charts.timeSeriesData.length > 0
                        ? incomingData.charts.timeSeriesData
                        : baseState.charts.timeSeriesData,
                    regionData: incomingData.charts.regionData.length > 0
                        ? incomingData.charts.regionData
                        : baseState.charts.regionData,
                    candlestickData: incomingData.charts.candlestickData.length > 0
                        ? incomingData.charts.candlestickData
                        : baseState.charts.candlestickData,
                }
            };

            console.log('Updating dashboard state:', nextState);
            setDashboardState(nextState);
        } catch (error) {
            console.error('Error processing toolOutput:', error);
        }
    }, [toolOutput, toolResponseMetadata, widgetStateFromGlobal]);

    const data = dashboardState ?? createDefaultDashboardState();

    const [activeView, setActiveView] = React.useState<'proyectos' | 'empleo'>(
        data.activeView
    );
    const [selectedMetric, setSelectedMetric] = React.useState<string>(
        activeView === 'proyectos' ? 'revenue' : 'units'
    );

    // Update view when data changes
    useEffect(() => {
        setActiveView(data.activeView);
        setSelectedMetric(data.activeView === 'proyectos' ? 'revenue' : 'units');
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

    const metricOptions: MetricOption[] = activeView === 'proyectos'
        ? [
            { label: "Inversión", value: "revenue" },
            { label: "Empleos", value: "units" },
            { label: "Beneficio", value: "profit" }
        ]
        : [
            { label: "Empleos", value: "units" },
            { label: "Inversión", value: "revenue" },
            { label: "Beneficio", value: "profit" }
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
                                setSelectedMetric('revenue');
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
                                setActiveView('empleo');
                                setSelectedMetric('units');
                            }}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 6,
                                border: 'none',
                                backgroundColor: activeView === 'empleo' ? '#6366f1' : 'transparent',
                                color: activeView === 'empleo' ? 'white' : '#374151',
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Empleo
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
                        title="Total de empleos"
                        value={data.widgets.totalJobs}
                        icon="👥"
                    />
                    <WidgetCard
                        title={activeView === 'proyectos' ? "Suma de inversión" : "Suma de empleos"}
                        value={activeView === 'proyectos'
                            ? data.widgets.sumInvestment
                            : data.widgets.sumJobs
                        }
                        icon={activeView === 'proyectos' ? "💰" : "🏢"}
                    />
                    <WidgetCard
                        title="Sector productivo principal"
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
                    {data.charts.timeSeriesData.length > 0 && (
                        <EnhancedBarplot
                            title={activeView === 'proyectos'
                                ? "Evolución de Proyectos por Año"
                                : "Evolución de Empleo por Año"
                            }
                            metricOptions={metricOptions}
                            selectedMetric={selectedMetric}
                            rows={data.charts.timeSeriesData}
                            onMetricChange={setSelectedMetric}
                            twoWayPlot={true}
                            showYAxis={true}
                            height={300}
                        />
                    )}

                    {data.charts.regionData.length > 0 && (
                        <HorizontalBarplot
                            title={activeView === 'proyectos'
                                ? "Distribución por Región - Inversión"
                                : "Distribución por Región - Empleo"
                            }
                            metricOptions={metricOptions}
                            selectedMetric={selectedMetric}
                            rows={data.charts.regionData}
                            onMetricChange={setSelectedMetric}
                            height={400}
                        />
                    )}

                    {data.charts.candlestickData.length > 0 && (
                        <CandlestickChart
                            title="Análisis de Volatilidad de Proyectos"
                            rows={data.charts.candlestickData}
                            height={400}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;