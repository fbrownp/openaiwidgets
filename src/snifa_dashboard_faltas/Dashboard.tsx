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
    ClasificacionGravedad,
    GRAVEDAD_ORDER
} from './types';
import { getInitialData } from './gpt-adapter';
import { DropdownFilter } from './DropdownFilter';
import { WidgetCard } from './WidgetCard';
import { HorizontalStackedBarplot } from './HorizontalStackedBarplot';

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
    console.log('SNIFA Dashboard Faltas rendering...');

    // State management
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [filterState, setFilterState] = useState<DashboardState['filters']>({
        region: [],
        categoria_economica: [],
        subcategoria_economica: []
    });

    // Load initial data
    const dashboardData = useMemo(() => {
        const data = getInitialData();
        console.log('Dashboard data loaded:', {
            totalFaltas: data.totalFaltas,
            dataRows: data.data.length,
            availableFilters: Object.keys(data.availableFilters)
        });
        return data;
    }, []);
    const themeColors = useMemo(() => getThemeColors(theme), [theme]);

    // Apply filters to data
    const filteredData = useMemo(() => {
        const filtered = dashboardData.data.filter(row => {
            // Check each filter category
            for (const [key, selectedValues] of Object.entries(filterState)) {
                if (selectedValues.length > 0 && !selectedValues.includes('Todas')) {
                    const fieldValue = row[key as keyof FaltaDataRow] || 'Sin Información';
                    if (!selectedValues.includes(fieldValue as string)) {
                        return false;
                    }
                }
            }
            return true;
        });
        console.log(`Filtered data: ${filtered.length} records`);
        return filtered;
    }, [dashboardData.data, filterState]);

    // Aggregate data by instrumento_infringido_norm
    const aggregateByInstrumento = useMemo((): AggregatedData[] => {
        const instrumentoMap = new Map<string, AggregatedData>();

        filteredData.forEach(row => {
            const key = row.instrumento_infringido_norm || 'Sin Información';

            if (!instrumentoMap.has(key)) {
                instrumentoMap.set(key, {
                    category: key,
                    count: 0,
                    byGravedad: {}
                });
            }

            const instrumentoData = instrumentoMap.get(key)!;
            instrumentoData.count += row.cantidad_casos;

            const gravedad = row.clasificacion_gravedad;
            instrumentoData.byGravedad[gravedad] = (instrumentoData.byGravedad[gravedad] || 0) + row.cantidad_casos;
        });

        return Array.from(instrumentoMap.values()).sort((a, b) => b.count - a.count);
    }, [filteredData]);

    // Aggregate data by subtipo_compromiso
    const aggregateBySubtipoCompromiso = useMemo((): AggregatedData[] => {
        const subtipoMap = new Map<string, AggregatedData>();

        filteredData.forEach(row => {
            const key = row.subtipo_compromiso || 'Sin Información';

            if (!subtipoMap.has(key)) {
                subtipoMap.set(key, {
                    category: key,
                    count: 0,
                    byGravedad: {}
                });
            }

            const subtipoData = subtipoMap.get(key)!;
            subtipoData.count += row.cantidad_casos;

            const gravedad = row.clasificacion_gravedad;
            subtipoData.byGravedad[gravedad] = (subtipoData.byGravedad[gravedad] || 0) + row.cantidad_casos;
        });

        return Array.from(subtipoMap.values()).sort((a, b) => b.count - a.count);
    }, [filteredData]);

    // Aggregate data by subcomponente
    const aggregateBySubcomponente = useMemo((): AggregatedData[] => {
        const subcomponenteMap = new Map<string, AggregatedData>();

        filteredData.forEach(row => {
            const key = row.subcomponente || 'Sin Información';

            if (!subcomponenteMap.has(key)) {
                subcomponenteMap.set(key, {
                    category: key,
                    count: 0,
                    byGravedad: {}
                });
            }

            const subcomponenteData = subcomponenteMap.get(key)!;
            subcomponenteData.count += row.cantidad_casos;

            const gravedad = row.clasificacion_gravedad;
            subcomponenteData.byGravedad[gravedad] = (subcomponenteData.byGravedad[gravedad] || 0) + row.cantidad_casos;
        });

        return Array.from(subcomponenteMap.values()).sort((a, b) => b.count - a.count);
    }, [filteredData]);

    // Aggregate data by tipo_proceso_sancion
    const aggregateByTipoProceso = useMemo((): AggregatedData[] => {
        const tipoProcesoMap = new Map<string, AggregatedData>();

        filteredData.forEach(row => {
            const key = row.tipo_proceso_sancion || 'Sin Información';

            if (!tipoProcesoMap.has(key)) {
                tipoProcesoMap.set(key, {
                    category: key,
                    count: 0,
                    byGravedad: {}
                });
            }

            const tipoProcesoData = tipoProcesoMap.get(key)!;
            tipoProcesoData.count += row.cantidad_casos;

            const gravedad = row.clasificacion_gravedad;
            tipoProcesoData.byGravedad[gravedad] = (tipoProcesoData.byGravedad[gravedad] || 0) + row.cantidad_casos;
        });

        return Array.from(tipoProcesoMap.values()).sort((a, b) => b.count - a.count);
    }, [filteredData]);

    // Calculate widget values
    const totalCasos = useMemo(() => {
        return filteredData.reduce((sum, row) => sum + row.cantidad_casos, 0);
    }, [filteredData]);
    const mostAffectedSubcomponente = useMemo(() => {
        if (aggregateBySubcomponente.length === 0) return 'N/A';
        return aggregateBySubcomponente[0].category;
    }, [aggregateBySubcomponente]);

    const mostAffectedSubtipo = useMemo(() => {
        if (aggregateBySubtipoCompromiso.length === 0) return 'N/A';
        return aggregateBySubtipoCompromiso[0].category;
    }, [aggregateBySubtipoCompromiso]);

    // Build filter configurations
    const buildFilterConfigs = (): FilterConfig[] => {
        const configs: FilterConfig[] = [];

        configs.push({
            label: 'region',
            options: dashboardData.availableFilters.region,
            selectedValues: filterState.region,
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

                {/* Filters */}
                <DropdownFilter
                    filters={buildFilterConfigs()}
                    onFilterChange={handleFilterChange}
                    themeColors={themeColors}
                />

                {/* Widget Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                    marginTop: 20,
                    marginBottom: 20
                }}>
                    <WidgetCard
                        title="Cantidad de Casos Totales"
                        value={totalCasos}
                        icon="⚠️"
                        themeColors={themeColors}
                    />
                    <WidgetCard
                        title="Subcomponente Más Afectado"
                        value={mostAffectedSubcomponente.length > 25
                            ? mostAffectedSubcomponente.substring(0, 25) + '...'
                            : mostAffectedSubcomponente}
                        icon="📊"
                        themeColors={themeColors}
                    />
                    <WidgetCard
                        title="Subtipo Compromiso Más Afectado"
                        value={mostAffectedSubtipo.length > 25
                            ? mostAffectedSubtipo.substring(0, 25) + '...'
                            : mostAffectedSubtipo}
                        icon="🎯"
                        themeColors={themeColors}
                    />
                </div>

                {/* Charts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <HorizontalStackedBarplot
                        title="Cantidad de Casos por Instrumento Infringido"
                        data={aggregateByInstrumento}
                        themeColors={themeColors}
                    />

                    <HorizontalStackedBarplot
                        title="Cantidad de Casos por Subtipo de Compromiso"
                        data={aggregateBySubtipoCompromiso}
                        themeColors={themeColors}
                    />

                    <HorizontalStackedBarplot
                        title="Cantidad de Casos por Subcomponente"
                        data={aggregateBySubcomponente}
                        themeColors={themeColors}
                    />

                    <HorizontalStackedBarplot
                        title="Cantidad de Casos por Tipo de Proceso Sanción"
                        data={aggregateByTipoProceso}
                        themeColors={themeColors}
                    />
                </div>
            </div>
        </div>
    );
};
