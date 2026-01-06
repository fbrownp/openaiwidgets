/**
 * SNIFA Dashboard Faltas - Main Dashboard Component
 * Displays attendance/violations data with multiple views and filters
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    ThemeColors,
    DashboardState,
    FilterConfig,
    FaltaDataRow,
    AggregatedData,
    ClasificacionGravedad,
    GRAVEDAD_ORDER,
    DashboardData
} from './types';
import { parseGPTOutput } from './gpt-adapter';
import { DropdownFilter } from './DropdownFilter';
import { WidgetCard } from './WidgetCard';
import { HorizontalStackedBarplot } from './HorizontalStackedBarplot';

// Import hooks from parent directory
import { useOpenAiGlobal } from '../use-openai-global';
import { useWidgetState } from '../use-widget-state';

// Create default dashboard state
const createDefaultDashboardState = (): DashboardData => ({
    totalFaltas: 0,
    data: [],
    availableFilters: {
        region: [],
        categoria_economica: [],
        subcategoria_economica: []
    }
});

// Theme color definitions
const getThemeColors = (theme: 'light' | 'dark'): ThemeColors => {
    if (theme === 'dark') {
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
            dropdownBorder: '#404040',
            dropdownHover: '#404040',
            dropdownSelected: '#4a4a4a'
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
                totalFaltas: incomingData.totalFaltas,
                data: incomingData.data.length > 0 ? incomingData.data : baseState.data,
                availableFilters: {
                    region: incomingData.availableFilters.region.length > 0
                        ? incomingData.availableFilters.region
                        : baseState.availableFilters.region,
                    categoria_economica: incomingData.availableFilters.categoria_economica.length > 0
                        ? incomingData.availableFilters.categoria_economica
                        : baseState.availableFilters.categoria_economica,
                    subcategoria_economica: incomingData.availableFilters.subcategoria_economica.length > 0
                        ? incomingData.availableFilters.subcategoria_economica
                        : baseState.availableFilters.subcategoria_economica
                }
            };

            console.log('Updating dashboard state:', nextState);
            setDashboardState(nextState);
        } catch (error) {
            console.error('Error processing toolOutput:', error);
        }
    }, [toolOutput, toolResponseMetadata, widgetStateFromGlobal]);

    const dashboardData = dashboardState ?? createDefaultDashboardState();
    const themeColors = useMemo(() => getThemeColors(theme), [theme]);

    // Apply filters to data
    const filteredData = useMemo(() => {
        const filtered = dashboardData.data.filter(row => {
            // Check each filter category
            for (const [key, selectedValues] of Object.entries(filterState)) {
                if (selectedValues.length > 0) {
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
        const total = filteredData.reduce((sum, row) => sum + row.cantidad_casos, 0);
        console.log('Total casos calculated:', {
            filteredRows: filteredData.length,
            totalCasos: total,
            sampleCasos: filteredData.slice(0, 3).map(r => r.cantidad_casos)
        });
        return total;
    }, [filteredData]);
    const mostAffectedSubcomponente = useMemo(() => {
        if (aggregateBySubcomponente.length === 0) return 'N/A';
        return aggregateBySubcomponente[0].category;
    }, [aggregateBySubcomponente]);

    const mostAffectedSubtipo = useMemo(() => {
        if (aggregateBySubtipoCompromiso.length === 0) return 'N/A';
        return aggregateBySubtipoCompromiso[0].category;
    }, [aggregateBySubtipoCompromiso]);

    // Build filter configurations with dynamic options based on current selections
    const buildFilterConfigs = (): FilterConfig[] => {
        const configs: FilterConfig[] = [];

        // Helper function to get unique values from filtered data
        const getUniqueValuesFromData = (data: FaltaDataRow[], field: keyof FaltaDataRow): string[] => {
            const values = new Set<string>();
            data.forEach(row => {
                const value = row[field];
                if (typeof value === 'string') {
                    values.add(value);
                } else if (value === null) {
                    values.add('Sin Información');
                }
            });
            return Array.from(values).sort();
        };

        // Region filter - always shows all regions
        configs.push({
            label: 'region',
            options: dashboardData.availableFilters.region,
            selectedValues: filterState.region,
            multiSelect: true
        });

        // Categoria economica filter - filtered by region if selected
        let dataForCategoriaEconomica = dashboardData.data;
        if (filterState.region.length > 0) {
            dataForCategoriaEconomica = dashboardData.data.filter(row => {
                const regionValue = row.region || 'Sin Información';
                return filterState.region.includes(regionValue);
            });
        }
        const categoriaEconomicaOptions = getUniqueValuesFromData(dataForCategoriaEconomica, 'categoria_economica');

        configs.push({
            label: 'categoria_economica',
            options: categoriaEconomicaOptions,
            selectedValues: filterState.categoria_economica,
            multiSelect: true
        });

        // Subcategoria economica filter - filtered by region AND categoria_economica if selected
        let dataForSubcategoriaEconomica = dashboardData.data;
        if (filterState.region.length > 0) {
            dataForSubcategoriaEconomica = dataForSubcategoriaEconomica.filter(row => {
                const regionValue = row.region || 'Sin Información';
                return filterState.region.includes(regionValue);
            });
        }
        if (filterState.categoria_economica.length > 0) {
            dataForSubcategoriaEconomica = dataForSubcategoriaEconomica.filter(row => {
                const categoriaValue = row.categoria_economica || 'Sin Información';
                return filterState.categoria_economica.includes(categoriaValue);
            });
        }
        const subcategoriaEconomicaOptions = getUniqueValuesFromData(dataForSubcategoriaEconomica, 'subcategoria_economica');

        configs.push({
            label: 'subcategoria_economica',
            options: subcategoriaEconomicaOptions,
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
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
                            margin: 0,
                            marginBottom: 12
                        }}>
                            Sistema de seguimiento de faltas y clasificación de gravedad
                        </p>
                    </div>

                    {/* Theme Toggle - Below title on left */}
                    <div style={{
                        display: 'flex',
                        gap: 6,
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
                                backgroundColor: theme === 'light'
                                    ? themeColors.buttonActiveBg
                                    : 'transparent',
                                color: theme === 'light'
                                    ? themeColors.buttonActiveText
                                    : themeColors.buttonText,
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: 500,
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
                                backgroundColor: theme === 'dark'
                                    ? themeColors.buttonActiveBg
                                    : 'transparent',
                                color: theme === 'dark'
                                    ? themeColors.buttonActiveText
                                    : themeColors.buttonText,
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            Oscuro
                        </button>
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
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 20,
                    width: '100%'
                }}>
                    <HorizontalStackedBarplot
                        title="Cantidad de Casos por Instrumento Infringido"
                        data={aggregateByInstrumento}
                        themeColors={themeColors}
                        height={300}
                    />

                    <HorizontalStackedBarplot
                        title="Cantidad de Casos por Subtipo de Compromiso"
                        data={aggregateBySubtipoCompromiso}
                        themeColors={themeColors}
                        height={300}
                    />

                    <HorizontalStackedBarplot
                        title="Cantidad de Casos por Subcomponente"
                        data={aggregateBySubcomponente}
                        themeColors={themeColors}
                        height={300}
                    />

                    <HorizontalStackedBarplot
                        title="Cantidad de Casos por Tipo de Proceso Sanción"
                        data={aggregateByTipoProceso}
                        themeColors={themeColors}
                        height={300}
                    />
                </div>
            </div>
        </div>
    );
};
