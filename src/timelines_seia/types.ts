/**
 * Type definitions for Timelines SEIA component
 */

export interface TimelineDataRow {
    tipo_ingreso_seia: string;
    region: string;
    tipologia: string;
    etiqueta_inversion: string;
    expediente_presentacion: string | Date;
    tiempo_entre_icsara_adenda: number;
}

export interface BoxPlotDataPoint {
    year: number;
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    outliers?: number[];
}

export interface DashboardData {
    data: TimelineDataRow[];
    availableFilters: {
        tipo_ingreso_seia: string[];
        region: string[];
        tipologia: string[];
        etiqueta_inversion: string[];
    };
}

export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterConfig {
    label: string;
    options: FilterOption[];
    selectedValues: string[];
    multiSelect: boolean;
}

export interface DropdownFilterProps {
    filters: FilterConfig[];
    onFilterChange: (filterLabel: string, selectedValues: string[]) => void;
    themeColors: any;
}
