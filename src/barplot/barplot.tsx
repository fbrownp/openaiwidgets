import './barplot.css';
import React, { useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Button, Card, Chart as SimpleChart, Row, Select, Text } from './CustomComponents';
import { getThemeColors, DEFAULT_THEME, Theme } from '../widget_styles/theme';

type MetricOption = {
    label: string;
    value: string;
};

type RowData = {
    period: string;
    year?: number;
    paginas?: number;
    [key: string]: number | string | undefined;
};

type Props = {
    title: string;
    metricOptions: MetricOption[];
    selectedMetric: string;
    rows: RowData[];
    onMetricChange?: (value: string) => void;
};

type TabType = 'proyectos' | 'inversion' | 'paginas';

type BoxPlotDataPoint = {
    year: number;
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    outliers?: number[];
};

export default function BarplotWidget({
    title,
    metricOptions,
    selectedMetric,
    rows,
    onMetricChange,
}: Props) {
    console.log('BarplotWidget rendering:', { title, selectedMetric, rowCount: rows.length });

    // Tab state
    const [activeTab, setActiveTab] = useState<TabType>('proyectos');

    // Theme state - default to dark like timelines_seia
    const [theme] = useState<Theme>(DEFAULT_THEME);
    const themeColors = getThemeColors(theme);

    // Handler for expand button
    const handleExpand = async () => {
        try {
            if (typeof window !== 'undefined' && window.openai?.requestDisplayMode) {
                const result = await window.openai.requestDisplayMode({ mode: 'fullscreen' });
                console.log('Display mode changed to:', result.mode);
            }
        } catch (error) {
            console.error('Failed to request fullscreen mode:', error);
        }
    };

    // Transform data into box plot format grouped by year for Paginas
    const boxPlotData = useMemo(() => {
        if (activeTab !== 'paginas' || !rows || rows.length === 0) return [];

        // Group data by year
        const dataByYear: Record<number, number[]> = {};

        rows.forEach(row => {
            const year = row.year;
            const paginas = row.paginas;

            // Only include rows with valid year and paginas values
            if (year != null && paginas != null && !isNaN(paginas)) {
                if (!dataByYear[year]) {
                    dataByYear[year] = [];
                }
                dataByYear[year].push(paginas);
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
    }, [rows, activeTab]);

    // ApexCharts configuration for box-plot (same as timelines_seia)
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
    };

    const series = [{
        name: 'Páginas',
        type: 'boxPlot' as const,
        data: boxPlotData.map(d => ({
            x: d.year.toString(),
            y: [d.min, d.q1, d.median, d.q3, d.max]
        }))
    }];

    // Safety check for empty data
    if (!rows || rows.length === 0) {
        return (
            <div className="barplot-widget">
                <div className="barplot-card">
                    <div className="barplot-empty">
                        No data available
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="barplot-widget">
            <Card size="md">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <Row align="center">
                        <Text weight="semibold">{title}</Text>
                        <div style={{ flex: 1 }} />

                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: 4,
                            backgroundColor: themeColors.cardBackground,
                            padding: 4,
                            borderRadius: 8,
                            border: `1px solid ${themeColors.border}`
                        }}>
                            <button
                                onClick={() => setActiveTab('proyectos')}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: activeTab === 'proyectos' ? themeColors.buttonActiveBg : themeColors.buttonBackground,
                                    color: activeTab === 'proyectos' ? themeColors.buttonActiveText : themeColors.buttonText,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Proyectos
                            </button>
                            <button
                                onClick={() => setActiveTab('inversion')}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: activeTab === 'inversion' ? themeColors.buttonActiveBg : themeColors.buttonBackground,
                                    color: activeTab === 'inversion' ? themeColors.buttonActiveText : themeColors.buttonText,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Inversion
                            </button>
                            <button
                                onClick={() => setActiveTab('paginas')}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: activeTab === 'paginas' ? themeColors.buttonActiveBg : themeColors.buttonBackground,
                                    color: activeTab === 'paginas' ? themeColors.buttonActiveText : themeColors.buttonText,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Paginas
                            </button>
                        </div>

                        {/* Metric selector - only show for Proyectos and Inversion tabs */}
                        {activeTab !== 'paginas' && (
                            <Select
                                name="dashboard.metric"
                                options={metricOptions}
                                value={selectedMetric}
                                clearable={false}
                                onChange={onMetricChange}
                            />
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleExpand}
                        >
                            <svg
                                width="16"
                                height="16"
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
                        </Button>
                    </Row>

                    {/* Chart Content */}
                    {activeTab === 'paginas' ? (
                        // Box-plot for Paginas
                        boxPlotData.length > 0 ? (
                            <div style={{ marginTop: 8 }}>
                                <Chart
                                    options={chartOptions}
                                    series={series}
                                    type="boxPlot"
                                    height={350}
                                />
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: 40,
                                color: themeColors.textSecondary
                            }}>
                                No hay datos de páginas disponibles
                            </div>
                        )
                    ) : (
                        // Bar chart for Proyectos and Inversion
                        <SimpleChart
                            data={rows}
                            series={[
                                {
                                    type: "bar",
                                    dataKey: selectedMetric,
                                    color: "blue",
                                },
                            ]}
                            xAxis={{ dataKey: "period" }}
                            showYAxis
                            height={180}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
}