import React, { useState, useEffect } from 'react';
import { CandlestickChart } from './CandlestickChart';
import { DropdownFilter } from './DropdownFilter';
import { EnhancedBarplot } from './EnhancedBarplot';
import { HorizontalBarplot } from './HorizontalBarplot';
import { CandlestickDataRow, DataRow, FilterConfig } from './types';
import { WidgetCard } from './WidgetCard';
import { GPTDashboardData } from './gpt-types';
import { buildFilterConfigs } from './gpt-adapter';

// Sample data with extended fields
const sampleData: DataRow[] = [
    { period: "1992", year: 1992, region: "Metropolitana", revenue: 50, units: 20, profit: 15 },
    { period: "1994", year: 1994, region: "O'Higgins", revenue: 120, units: 45, profit: 35 },
    { period: "1996", year: 1996, region: "Biobío", revenue: 280, units: 95, profit: 85 },
    { period: "1998", year: 1998, region: "Los Lagos", revenue: 720, units: 240, profit: 215 },
    { period: "2000", year: 2000, region: "Metropolitana", revenue: 850, units: 290, profit: 255 },
    { period: "2002", year: 2002, region: "Valparaíso", revenue: 920, units: 315, profit: 275 },
    { period: "2004", year: 2004, region: "Metropolitana", revenue: 980, units: 335, profit: 295 },
    { period: "2006", year: 2006, region: "Araucanía", revenue: 1250, units: 425, profit: 375 },
    { period: "2008", year: 2008, region: "Metropolitana", revenue: 1350, units: 460, profit: 405 },
    { period: "2010", year: 2010, region: "O'Higgins", revenue: 1280, units: 435, profit: 385 },
    { period: "2012", year: 2012, region: "Biobío", revenue: 1420, units: 485, profit: 425 },
    { period: "2014", year: 2014, region: "Los Lagos", revenue: 1180, units: 400, profit: 355 },
    { period: "2016", year: 2016, region: "Metropolitana", revenue: 520, units: 175, profit: 155 },
    { period: "2018", year: 2018, region: "Valparaíso", revenue: 580, units: 195, profit: 175 },
    { period: "2020", year: 2020, region: "Araucanía", revenue: 680, units: 230, profit: 205 },
    { period: "2022", year: 2022, region: "Metropolitana", revenue: 420, units: 140, profit: 125 },
    { period: "2024", year: 2024, region: "O'Higgins", revenue: 380, units: 125, profit: 115 },
];

const regionData: DataRow[] = [
    { period: "Metropolitana", year: 2024, region: "Metropolitana", revenue: 4200, units: 1450, profit: 1260 },
    { period: "Los Lagos", year: 2024, region: "Los Lagos", revenue: 3800, units: 1300, profit: 1140 },
    { period: "O'Higgins", year: 2024, region: "O'Higgins", revenue: 2950, units: 1010, profit: 885 },
    { period: "Biobío", year: 2024, region: "Biobío", revenue: 2850, units: 975, profit: 855 },
    { period: "Valparaíso", year: 2024, region: "Valparaíso", revenue: 2680, units: 915, profit: 804 },
    { period: "Araucanía", year: 2024, region: "Araucanía", revenue: 2450, units: 835, profit: 735 },
    { period: "Maule", year: 2024, region: "Maule", revenue: 2280, units: 780, profit: 684 },
    { period: "Coquimbo", year: 2024, region: "Coquimbo", revenue: 2150, units: 735, profit: 645 },
    { period: "Atacama", year: 2024, region: "Atacama", revenue: 1980, units: 675, profit: 594 },
    { period: "Ñuble", year: 2024, region: "Ñuble", revenue: 1850, units: 630, profit: 555 },
    { period: "Arica y P.", year: 2024, region: "Arica y Parinacota", revenue: 1720, units: 585, profit: 516 },
    { period: "Tarapacá", year: 2024, region: "Tarapacá", revenue: 1650, units: 560, profit: 495 },
    { period: "Antofagasta", year: 2024, region: "Antofagasta", revenue: 1580, units: 540, profit: 474 },
    { period: "La Araucanía", year: 2024, region: "La Araucanía", revenue: 1420, units: 485, profit: 426 },
    { period: "Los Ríos", year: 2024, region: "Los Ríos", revenue: 1320, units: 450, profit: 396 },
    { period: "Aysén", year: 2024, region: "Aysén", revenue: 1180, units: 400, profit: 354 },
    { period: "Magallanes", year: 2024, region: "Magallanes", revenue: 980, units: 335, profit: 294 },
];

const candlestickData: CandlestickDataRow[] = [
    { period: "1992", year: 1992, open: 40, high: 65, low: 35, close: 50 },
    { period: "1994", year: 1994, open: 50, high: 140, low: 48, close: 120 },
    { period: "1996", year: 1996, open: 120, high: 300, low: 115, close: 280 },
    { period: "1998", year: 1998, open: 280, high: 750, low: 270, close: 720 },
    { period: "2000", year: 2000, open: 720, high: 880, low: 700, close: 850 },
    { period: "2002", year: 2002, open: 850, high: 950, low: 830, close: 920 },
    { period: "2004", year: 2004, open: 920, high: 1020, low: 900, close: 980 },
    { period: "2006", year: 2006, open: 980, high: 1300, low: 960, close: 1250 },
    { period: "2008", year: 2008, open: 1250, high: 1400, low: 1200, close: 1350 },
    { period: "2010", year: 2010, open: 1350, high: 1380, low: 1200, close: 1280 },
    { period: "2012", year: 2012, open: 1280, high: 1480, low: 1250, close: 1420 },
    { period: "2014", year: 2014, open: 1420, high: 1450, low: 1100, close: 1180 },
    { period: "2016", year: 2016, open: 1180, high: 1200, low: 480, close: 520 },
    { period: "2018", year: 2018, open: 520, high: 620, low: 500, close: 580 },
    { period: "2020", year: 2020, open: 580, high: 720, low: 560, close: 680 },
    { period: "2022", year: 2022, open: 680, high: 700, low: 380, close: 420 },
    { period: "2024", year: 2024, open: 420, high: 450, low: 350, close: 380 },
];

interface DashboardProps {
    gptData?: GPTDashboardData;
}

export const Dashboard: React.FC<DashboardProps> = ({ gptData }) => {
    const [activeView, setActiveView] = useState<'proyectos' | 'empleo'>(
        gptData?.activeView || 'proyectos'
    );

    // Automatically set metric based on active view
    const selectedMetric = activeView === 'proyectos' ? 'revenue' : 'units';

    const handleViewChange = (view: 'proyectos' | 'empleo') => {
        setActiveView(view);
    };

    // Initialize filters from GPT data or use defaults
    const getInitialFilters = (): FilterConfig[] => {
        if (gptData) {
            return buildFilterConfigs(gptData);
        }

        // Default filters when no GPT data
        return [
            {
                label: "Forma de presentación",
                options: [
                    { label: "Proyecto", value: "proyecto" },
                    { label: "Empleo", value: "empleo" }
                ],
                selectedValues: ["proyecto", "empleo"],
                multiSelect: true
            },
            {
                label: "Sector productivo",
                options: [
                    { label: "Industria", value: "industria" },
                    { label: "Comercio", value: "comercio" },
                    { label: "Servicios", value: "servicios" },
                    { label: "Minería", value: "mineria" },
                    { label: "Agricultura", value: "agricultura" },
                    { label: "Construcción", value: "construccion" },
                    { label: "Tecnología", value: "tecnologia" }
                ],
                selectedValues: ["industria", "comercio", "servicios", "mineria", "agricultura", "construccion", "tecnologia"],
                multiSelect: true
            },
            {
                label: "Nivel de inversión",
                options: [
                    { label: "Alto (>$1M)", value: "alto" },
                    { label: "Medio ($100K-$1M)", value: "medio" },
                    { label: "Bajo (<$100K)", value: "bajo" }
                ],
                selectedValues: ["alto", "medio", "bajo"],
                multiSelect: true
            },
            {
                label: "Estado",
                options: [
                    { label: "En ejecución", value: "ejecucion" },
                    { label: "Aprobado", value: "aprobado" },
                    { label: "En evaluación", value: "evaluacion" },
                    { label: "Finalizado", value: "finalizado" },
                    { label: "Suspendido", value: "suspendido" },
                    { label: "Rechazado", value: "rechazado" },
                    { label: "En construcción", value: "construccion" },
                    { label: "Operativo", value: "operativo" },
                    { label: "Paralizado", value: "paralizado" },
                    { label: "Postergado", value: "postergado" }
                ],
                selectedValues: ["ejecucion", "aprobado", "evaluacion", "finalizado", "suspendido", "rechazado", "construccion", "operativo", "paralizado", "postergado"],
                multiSelect: true
            },
            {
                label: "Región",
                options: regionData.map(r => ({ label: r.period, value: r.region })),
                selectedValues: regionData.map(r => r.region),
                multiSelect: true
            }
        ];
    };

    const [filters, setFilters] = useState<FilterConfig[]>(getInitialFilters());

    const handleFilterChange = (filterLabel: string, selectedValues: string[]) => {
        setFilters(filters.map(f =>
            f.label === filterLabel
                ? { ...f, selectedValues }
                : f
        ));
    };

    // Update filters when GPT data changes
    useEffect(() => {
        if (gptData) {
            setFilters(buildFilterConfigs(gptData));
            setActiveView(gptData.activeView);
        }
    }, [gptData]);

    // Get widget values from GPT data or use defaults
    const widgetValues = {
        totalProjects: gptData?.widgets.totalProjects ?? 24246,
        totalJobs: gptData?.widgets.totalJobs ?? 15830,
        sumInvestment: gptData?.widgets.sumInvestment ?? "MMU$1.041.944",
        sumJobs: gptData?.widgets.sumJobs ?? "156.420",
        topSector: gptData?.widgets.topSector ?? "Industria",
        topSectorPercentage: gptData?.widgets.topSectorPercentage ?? "22.7"
    };

    // Get chart data from GPT data or use defaults
    const chartData = {
        timeSeries: gptData?.charts.timeSeriesData ?? sampleData,
        region: gptData?.charts.regionData ?? regionData,
        candlestick: gptData?.charts.candlestickData ?? candlestickData
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            padding: '32px 16px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{ maxWidth: 1600, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{
                        display: 'flex',
                        gap: 16,
                        marginBottom: 16
                    }}>
                        <button
                            onClick={() => handleViewChange('proyectos')}
                            style={{
                                padding: '10px 24px',
                                borderRadius: 8,
                                border: 'none',
                                backgroundColor: activeView === 'proyectos' ? 'white' : 'transparent',
                                cursor: 'pointer',
                                fontSize: 14,
                                fontWeight: activeView === 'proyectos' ? 600 : 500,
                                borderBottom: activeView === 'proyectos' ? '3px solid #6366f1' : 'none',
                                color: activeView === 'proyectos' ? '#6366f1' : '#6b7280'
                            }}
                        >
                            Proyectos
                        </button>
                        <button
                            onClick={() => handleViewChange('empleo')}
                            style={{
                                padding: '10px 24px',
                                borderRadius: 8,
                                border: 'none',
                                backgroundColor: activeView === 'empleo' ? 'white' : 'transparent',
                                cursor: 'pointer',
                                fontSize: 14,
                                fontWeight: activeView === 'empleo' ? 600 : 500,
                                borderBottom: activeView === 'empleo' ? '3px solid #6366f1' : 'none',
                                color: activeView === 'empleo' ? '#6366f1' : '#6b7280'
                            }}
                        >
                            Empleo
                        </button>
                    </div>

                    <DropdownFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                {/* Summary Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 20,
                    marginBottom: 24
                }}>
                    <WidgetCard
                        title={activeView === 'proyectos' ? "Total de proyectos" : "Total de empleos"}
                        value={activeView === 'proyectos' ? widgetValues.totalProjects : widgetValues.totalJobs}
                        icon="🏢"
                    />
                    <WidgetCard
                        title={activeView === 'proyectos' ? "Suma de inversión" : "Suma de empleos generados"}
                        value={activeView === 'proyectos' ? widgetValues.sumInvestment : widgetValues.sumJobs}
                        icon="💰"
                    />
                    <WidgetCard
                        title="Sector mayoritario"
                        value={widgetValues.topSector}
                        subtitle={`${widgetValues.topSectorPercentage}% del total`}
                        icon="📊"
                    />
                </div>

                {/* Charts Grid - Responsive */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: 20
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 600px), 1fr))',
                        gap: 20
                    }}>
                        {/* Revenue per Year - Two Way Plot */}
                        <EnhancedBarplot
                            title={activeView === 'proyectos'
                                ? "Número de proyectos presentados por año"
                                : "Empleos generados por año"}
                            metricOptions={[
                                { label: activeView === 'proyectos' ? "Revenue" : "Units", value: selectedMetric }
                            ]}
                            selectedMetric={selectedMetric}
                            rows={chartData.timeSeries}
                            onMetricChange={() => { }}
                            twoWayPlot={true}
                            height={350}
                        />

                        {/* Revenue per Region - Horizontal Bar Plot */}
                        <HorizontalBarplot
                            title={activeView === 'proyectos'
                                ? "Distribución por región"
                                : "Empleos por región"}
                            metricOptions={[
                                { label: activeView === 'proyectos' ? "Revenue" : "Units", value: selectedMetric }
                            ]}
                            selectedMetric={selectedMetric}
                            rows={chartData.region}
                            onMetricChange={() => { }}
                            height={500}
                        />
                    </div>

                    {/* Candlestick Chart - Full Width */}
                    <CandlestickChart
                        title="Análisis de volatilidad por año"
                        rows={chartData.candlestick}
                        height={400}
                    />
                </div>
            </div>
        </div>
    );
};