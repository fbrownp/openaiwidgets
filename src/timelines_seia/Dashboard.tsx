import React, { useState, useEffect, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { DropdownFilter } from './DropdownFilter';
import { parseGPTOutput, buildFilterConfigs } from './gpt-adapter';
import { placeholderData } from './placeholder-data';
import { getThemeColors, DEFAULT_THEME, Theme } from '../widget_styles/theme';
import { TimelineDataRow, BoxPlotDataPoint, FilterConfig } from './types';
import { useOpenAiGlobal } from '../use-openai-global';
import { useWidgetState } from '../use-widget-state';

export const Dashboard: React.FC = () => {
    // Get theme from OpenAI globals
    const openai = useOpenAiGlobal();
    const theme = (openai?.theme || DEFAULT_THEME) as Theme;
    const themeColors = getThemeColors(theme);

    // Initialize with placeholder data
    const [gptData] = useWidgetState(parseGPTOutput(placeholderData));
    const [filters, setFilters] = useState<FilterConfig[]>([]);
    const [filteredData, setFilteredData] = useState<TimelineDataRow[]>([]);

    // Initialize filters from GPT data
    useEffect(() => {
        if (gptData) {
            const filterConfigs = buildFilterConfigs(gptData);
            setFilters(filterConfigs);
        }
    }, [gptData]);

    // Apply filters to data
    useEffect(() => {
        if (!gptData?.data) {
            setFilteredData([]);
            return;
        }

        let result = [...gptData.data];

        filters.forEach(filter => {
            if (filter.selectedValues.length > 0) {
                const filterKey = {
                    'Tipo Ingreso SEIA': 'tipo_ingreso_seia',
                    'Región': 'region',
                    'Tipología': 'tipologia',
                    'Etiqueta Inversión': 'etiqueta_inversion'
                }[filter.label] as keyof TimelineDataRow;

                if (filterKey) {
                    result = result.filter(row =>
                        filter.selectedValues.includes(String(row[filterKey]))
                    );
                }
            }
        });

        setFilteredData(result);
    }, [gptData, filters]);

    // Handle filter changes
    const handleFilterChange = (filterLabel: string, selectedValues: string[]) => {
        setFilters(prevFilters =>
            prevFilters.map(f =>
                f.label === filterLabel
                    ? { ...f, selectedValues }
                    : f
            )
        );
    };

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
                {filters.length > 0 && (
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
                                Ajusta los filtros para ver los resultados
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
