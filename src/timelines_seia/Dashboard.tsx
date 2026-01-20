import React, { useState, useEffect, useMemo, useRef } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { DropdownFilter } from './DropdownFilter';
import { parseGPTOutput } from './gpt-adapter';
import { getThemeColors, DEFAULT_THEME, Theme } from '../widget_styles/theme';
import { TimelineDataRow, BoxPlotDataPoint, FilterConfig, DashboardData } from './types';
import { useOpenAiGlobal } from '../use-openai-global';
import { useWidgetState } from '../use-widget-state';

// Create default dashboard state
const createDefaultDashboardState = (): DashboardData => ({
    data: [],
    availableFilters: {
        tipo_ingreso_seia: [],
        region: [],
        tipologia: [],
        etiqueta_inversion: []
    }
});

export const Dashboard: React.FC = () => {
    console.log('Timelines SEIA Dashboard rendering...');

    // Get theme from OpenAI globals
    const openai = useOpenAiGlobal();
    const theme = (openai?.theme || DEFAULT_THEME) as Theme;
    const themeColors = getThemeColors(theme);

    // Filter state management
    const [filterState, setFilterState] = useState<{
        tipo_ingreso_seia: string[];
        region: string[];
        tipologia: string[];
        etiqueta_inversion: string[];
    }>({
        tipo_ingreso_seia: [],
        region: [],
        tipologia: [],
        etiqueta_inversion: []
    });

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
                availableFilters: {
                    tipo_ingreso_seia: incomingData.filters.tipo_ingreso_seia.length > 0
                        ? incomingData.filters.tipo_ingreso_seia
                        : baseState.availableFilters.tipo_ingreso_seia,
                    region: incomingData.filters.region.length > 0
                        ? incomingData.filters.region
                        : baseState.availableFilters.region,
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

            if (!dataByYear[year]) {
                dataByYear[year] = [];
            }
            dataByYear[year].push(row.tiempo_entre_icsara_adenda);
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
    }, [filteredData]);

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
                text: 'Tiempo entre ICSARA y Adenda (días)',
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
        name: 'Tiempo ICSARA-Adenda',
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
            padding: 24
        }}>
            <div style={{
                maxWidth: 1400,
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{
                    marginBottom: 32
                }}>
                    <h1 style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: themeColors.text,
                        marginBottom: 8
                    }}>
                        Timelines SEIA
                    </h1>
                    <p style={{
                        fontSize: 14,
                        color: themeColors.textSecondary
                    }}>
                        Análisis de tiempos entre ICSARA y Adenda por año
                    </p>
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

                {/* Box Plot Chart */}
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
                            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                            <div style={{ fontSize: 16, fontWeight: 500 }}>
                                No hay datos disponibles
                            </div>
                            <div style={{ fontSize: 14, marginTop: 8 }}>
                                {dashboardData.data.length === 0
                                    ? 'Esperando datos de GPT...'
                                    : 'Ajusta los filtros para ver los resultados'}
                            </div>
                        </div>
                    )}
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
                                {(filteredData.reduce((sum, row) => sum + row.tiempo_entre_icsara_adenda, 0) / filteredData.length).toFixed(0)}
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
