/**
 * SNIFA Dashboard Faltas - Main Dashboard Component
 * Displays attendance/violations data with multiple views and filters
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
    ThemeColors,
    DashboardState,
    FilterConfig,
    FaltaDataRow,
    AggregatedData,
    TimeSeriesData,
    ClasificacionGravedad,
    GRAVEDAD_ORDER
} from './types';
import { getInitialData } from './gpt-adapter';
import { DropdownFilter } from './DropdownFilter';
import { WidgetCard } from './WidgetCard';
import { HorizontalStackedBarplot } from './HorizontalStackedBarplot';
import { LineChart } from './LineChart';

// Theme color definitions
const getThemeColors = (theme: 'light' | 'dark'): ThemeColors => {
    if (theme === 'dark') {
        return {
            background: '#1a1625',
            cardBackground: '#241b2f',
            cardBorder: '#2d2439',
            text: '#e8e6ed',
            textSecondary: '#afa9ba',
            buttonText: '#e8e6ed',
            buttonBackground: '#2d2439',
            buttonHover: '#3a2f47',
            buttonActiveBg: '#8b5cf6',
            buttonActiveText: '#ffffff',
            purple: '#a78bfa',
            purpleDark: '#7c3aed',
            purpleLight: '#c4b5fd',
            border: '#3a2f47',
            borderLight: '#4a3f57',
            gridLine: '#4a3f57',
            dropdownBg: '#2d2439',
            dropdownBorder: '#3a2f47',
            dropdownHover: '#3a2f47',
            dropdownSelected: '#4a3f57'
        };
    }

    return {
        background: '#f8f9fa',
        cardBackground: '#ffffff',
        cardBorder: '#e9ecef',
        text: '#212529',
        textSecondary: '#6c757d',
        buttonText: '#495057',
        buttonBackground: '#f8f9fa',
        buttonHover: '#e9ecef',
        buttonActiveBg: '#8b5cf6',
        buttonActiveText: '#ffffff',
        purple: '#8b5cf6',
        purpleDark: '#7c3aed',
        purpleLight: '#c4b5fd',
        border: '#dee2e6',
        borderLight: '#e9ecef',
        gridLine: '#dee2e6',
        dropdownBg: '#ffffff',
        dropdownBorder: '#dee2e6',
        dropdownHover: '#f8f9fa',
        dropdownSelected: '#e9ecef'
    };
};

export const Dashboard: React.FC = () => {
    // State management
    const [activeView, setActiveView] = useState<'faltas' | 'detalle'>('faltas');
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [filterState, setFilterState] = useState<DashboardState['filters']>({
        instrumento_infringido_norm: [],
        subtipo_compromiso: [],
        categoria_economica: [],
        subcategoria_economica: [],
        region: [],
        subcomponente: [],
        etiqueta_legal: []
    });

    // Load initial data
    const dashboardData = useMemo(() => getInitialData(), []);
    const themeColors = useMemo(() => getThemeColors(theme), [theme]);

    // Apply filters to data
    const filteredData = useMemo(() => {
        return dashboardData.data.filter(row => {
            // Check each filter category
            for (const [key, selectedValues] of Object.entries(filterState)) {
                if (selectedValues.length > 0 && !selectedValues.includes('Todas')) {
                    const fieldValue = row[key as keyof FaltaDataRow];
                    if (!selectedValues.includes(fieldValue as string)) {
                        return false;
                    }
                }
            }
            return true;
        });
    }, [dashboardData.data, filterState]);

    // Aggregate data by region
    const aggregateByRegion = useMemo((): AggregatedData[] => {
        const regionMap = new Map<string, AggregatedData>();

        filteredData.forEach(row => {
            if (!regionMap.has(row.region)) {
                regionMap.set(row.region, {
                    category: row.region,
                    count: 0,
                    byGravedad: {}
                });
            }

            const regionData = regionMap.get(row.region)!;
            regionData.count++;

            const gravedad = row.clasificacion_gravedad;
            regionData.byGravedad[gravedad] = (regionData.byGravedad[gravedad] || 0) + 1;
        });

        return Array.from(regionMap.values()).sort((a, b) => b.count - a.count);
    }, [filteredData]);

    // Aggregate data by economic category
    const aggregateByEconomicCategory = useMemo((): AggregatedData[] => {
        const categoryMap = new Map<string, AggregatedData>();

        filteredData.forEach(row => {
            if (!categoryMap.has(row.categoria_economica)) {
                categoryMap.set(row.categoria_economica, {
                    category: row.categoria_economica,
                    count: 0,
                    byGravedad: {}
                });
            }

            const categoryData = categoryMap.get(row.categoria_economica)!;
            categoryData.count++;

            const gravedad = row.clasificacion_gravedad;
            categoryData.byGravedad[gravedad] = (categoryData.byGravedad[gravedad] || 0) + 1;
        });

        return Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);
    }, [filteredData]);

    // Aggregate data by subtipo_compromiso
    const aggregateBySubtipoCompromiso = useMemo((): AggregatedData[] => {
        const subtipoMap = new Map<string, AggregatedData>();

        filteredData.forEach(row => {
            if (!subtipoMap.has(row.subtipo_compromiso)) {
                subtipoMap.set(row.subtipo_compromiso, {
                    category: row.subtipo_compromiso,
                    count: 0,
                    byGravedad: {}
                });
            }

            const subtipoData = subtipoMap.get(row.subtipo_compromiso)!;
            subtipoData.count++;

            const gravedad = row.clasificacion_gravedad;
            subtipoData.byGravedad[gravedad] = (subtipoData.byGravedad[gravedad] || 0) + 1;
        });

        return Array.from(subtipoMap.values()).sort((a, b) => b.count - a.count);
    }, [filteredData]);

    // Aggregate data by subcomponente
    const aggregateBySubcomponente = useMemo((): AggregatedData[] => {
        const subcomponenteMap = new Map<string, AggregatedData>();

        filteredData.forEach(row => {
            if (!subcomponenteMap.has(row.subcomponente)) {
                subcomponenteMap.set(row.subcomponente, {
                    category: row.subcomponente,
                    count: 0,
                    byGravedad: {}
                });
            }

            const subcomponenteData = subcomponenteMap.get(row.subcomponente)!;
            subcomponenteData.count++;

            const gravedad = row.clasificacion_gravedad;
            subcomponenteData.byGravedad[gravedad] = (subcomponenteData.byGravedad[gravedad] || 0) + 1;
        });

        return Array.from(subcomponenteMap.values()).sort((a, b) => b.count - a.count);
    }, [filteredData]);

    // Aggregate time series data
    const aggregateTimeSeries = useMemo((): TimeSeriesData[] => {
        const yearMap = new Map<number, TimeSeriesData>();

        filteredData.forEach(row => {
            if (!yearMap.has(row.ano)) {
                yearMap.set(row.ano, {
                    year: row.ano,
                    byGravedad: {}
                });
            }

            const yearData = yearMap.get(row.ano)!;
            const gravedad = row.clasificacion_gravedad;
            yearData.byGravedad[gravedad] = (yearData.byGravedad[gravedad] || 0) + 1;
        });

        return Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
    }, [filteredData]);

    // Calculate widget values
    const totalFaltas = filteredData.length;
    const mostCommonGravedad = useMemo(() => {
        const gravedadCounts: Record<string, number> = {};
        filteredData.forEach(row => {
            gravedadCounts[row.clasificacion_gravedad] =
                (gravedadCounts[row.clasificacion_gravedad] || 0) + 1;
        });

        let maxCount = 0;
        let mostCommon = 'N/A';
        for (const [gravedad, count] of Object.entries(gravedadCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostCommon = gravedad;
            }
        }
        return mostCommon;
    }, [filteredData]);

    const mostCommonRegion = useMemo(() => {
        const regionCounts: Record<string, number> = {};
        filteredData.forEach(row => {
            regionCounts[row.region] = (regionCounts[row.region] || 0) + 1;
        });

        let maxCount = 0;
        let mostCommon = 'N/A';
        for (const [region, count] of Object.entries(regionCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostCommon = region;
            }
        }
        return mostCommon;
    }, [filteredData]);

    // Build filter configurations
    const buildFilterConfigs = (): FilterConfig[] => {
        const configs: FilterConfig[] = [];

        // Only show filters relevant to the active view
        if (activeView === 'detalle') {
            configs.push({
                label: 'instrumento_infringido_norm',
                options: dashboardData.availableFilters.instrumento_infringido_norm,
                selectedValues: filterState.instrumento_infringido_norm,
                multiSelect: true
            });

            configs.push({
                label: 'subtipo_compromiso',
                options: dashboardData.availableFilters.subtipo_compromiso,
                selectedValues: filterState.subtipo_compromiso,
                multiSelect: true
            });

            configs.push({
                label: 'categoria_economica',
                options: dashboardData.availableFilters.categoria_economica,
                selectedValues: filterState.categoria_economica,
                multiSelect: true
            });

            configs.push({
                label: 'subcategoria_economica',
                options: dashboardData.availableFilters.subcategoria_economica,
                selectedValues: filterState.subcategoria_economica,
                multiSelect: true
            });

            configs.push({
                label: 'region',
                options: dashboardData.availableFilters.region,
                selectedValues: filterState.region,
                multiSelect: true
            });

            configs.push({
                label: 'subcomponente',
                options: dashboardData.availableFilters.subcomponente,
                selectedValues: filterState.subcomponente,
                multiSelect: true
            });

            configs.push({
                label: 'etiqueta_legal',
                options: dashboardData.availableFilters.etiqueta_legal,
                selectedValues: filterState.etiqueta_legal,
                multiSelect: true
            });
        }

        return configs;
    };

    const handleFilterChange = (filterLabel: string, newValues: string[]) => {
        setFilterState(prev => ({
            ...prev,
            [filterLabel]: newValues
        }));
    };

    return (
        <div style={{
            backgroundColor: themeColors.background,
            minHeight: '100vh',
            padding: 20,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 20
                }}>
                    <div>
                        <h1 style={{
                            fontSize: 28,
                            fontWeight: 700,
                            color: themeColors.text,
                            margin: 0,
                            marginBottom: 4
                        }}>
                            Dashboard SNIFA - Faltas
                        </h1>
                        <p style={{
                            fontSize: 14,
                            color: themeColors.textSecondary,
                            margin: 0
                        }}>
                            Sistema de seguimiento de faltas y clasificación de gravedad
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {/* View Toggle */}
                        <div style={{
                            display: 'flex',
                            gap: 8,
                            backgroundColor: themeColors.buttonBackground,
                            padding: 4,
                            borderRadius: 8,
                            border: `1px solid ${themeColors.border}`
                        }}>
                            <button
                                onClick={() => setActiveView('faltas')}
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: activeView === 'faltas'
                                        ? themeColors.buttonActiveBg
                                        : 'transparent',
                                    color: activeView === 'faltas'
                                        ? themeColors.buttonActiveText
                                        : themeColors.buttonText,
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    transition: 'all 0.2s'
                                }}
                            >
                                Faltas
                            </button>
                            <button
                                onClick={() => setActiveView('detalle')}
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: activeView === 'detalle'
                                        ? themeColors.buttonActiveBg
                                        : 'transparent',
                                    color: activeView === 'detalle'
                                        ? themeColors.buttonActiveText
                                        : themeColors.buttonText,
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    transition: 'all 0.2s'
                                }}
                            >
                                Detalle
                            </button>
                        </div>

                        {/* Theme Toggle */}
                        <div style={{
                            display: 'flex',
                            gap: 6,
                            backgroundColor: themeColors.buttonBackground,
                            padding: 4,
                            borderRadius: 8,
                            border: `1px solid ${themeColors.border}`
                        }}>
                            <button
                                onClick={() => setTheme('light')}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: theme === 'light'
                                        ? themeColors.buttonActiveBg
                                        : 'transparent',
                                    color: theme === 'light'
                                        ? themeColors.buttonActiveText
                                        : themeColors.buttonText,
                                    cursor: 'pointer',
                                    fontSize: 16,
                                    transition: 'all 0.2s'
                                }}
                                title="Light mode"
                            >
                                ☀️
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: theme === 'dark'
                                        ? themeColors.buttonActiveBg
                                        : 'transparent',
                                    color: theme === 'dark'
                                        ? themeColors.buttonActiveText
                                        : themeColors.buttonText,
                                    cursor: 'pointer',
                                    fontSize: 16,
                                    transition: 'all 0.2s'
                                }}
                                title="Dark mode"
                            >
                                🌙
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters (only for Detalle view) */}
                {activeView === 'detalle' && (
                    <DropdownFilter
                        filters={buildFilterConfigs()}
                        onFilterChange={handleFilterChange}
                        themeColors={themeColors}
                    />
                )}

                {/* Widget Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                    marginTop: 20,
                    marginBottom: 20
                }}>
                    <WidgetCard
                        title="Total de Faltas"
                        value={totalFaltas}
                        icon="⚠️"
                        themeColors={themeColors}
                    />
                    <WidgetCard
                        title="Clasificación Más Común"
                        value={mostCommonGravedad}
                        icon="📊"
                        themeColors={themeColors}
                    />
                    <WidgetCard
                        title="Región Principal"
                        value={mostCommonRegion.length > 20
                            ? mostCommonRegion.substring(0, 20) + '...'
                            : mostCommonRegion}
                        icon="🗺️"
                        themeColors={themeColors}
                    />
                </div>

                {/* Charts - Faltas View */}
                {activeView === 'faltas' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <HorizontalStackedBarplot
                            title="Recuento de id_fdc por región y clasificación_gravedad"
                            data={aggregateByRegion}
                            themeColors={themeColors}
                        />

                        <HorizontalStackedBarplot
                            title="Recuento de id_fdc por categoría_economica y clasificación_gravedad"
                            data={aggregateByEconomicCategory}
                            themeColors={themeColors}
                        />

                        <LineChart
                            title="Recuento de clasificacion_gravedad por Año y clasificacion_gravedad"
                            data={aggregateTimeSeries}
                            themeColors={themeColors}
                        />
                    </div>
                )}

                {/* Charts - Detalle View */}
                {activeView === 'detalle' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <HorizontalStackedBarplot
                            title="Recuento de subtipo_compromiso por subtipo_compromiso y clasificación_gravedad"
                            data={aggregateBySubtipoCompromiso}
                            themeColors={themeColors}
                        />

                        <HorizontalStackedBarplot
                            title="Recuento de subcomponente por subcomponente y clasificación_gravedad"
                            data={aggregateBySubcomponente}
                            themeColors={themeColors}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
