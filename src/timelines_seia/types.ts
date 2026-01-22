/**
 * Type definitions for Timelines SEIA component
 */

export interface TimelineDataRow {
    tipo_ingreso_seia: string;
    region: string;
    tipologia_letra: string;
    tipologia: string;
    etiqueta_inversion: string;
    expediente_presentacion: string | Date;
    // Entre Eventos fields
    tiempo_entre_presentacion_icsara: number | null;
    tiempo_entre_icsara_adenda: number | null;
    tiempo_entre_adenda_icsara_complementario: number | null;
    tiempo_entre_icsara_complementario_adenda_complementaria: number | null;
    tiempo_entre_adenda_complementaria_ice: number | null;
    tiempo_entre_ice_rca: number | null;
    // Total (Hasta) fields
    tiempo_hasta_presentacion_icsara: number | null;
    tiempo_hasta_icsara_adenda: number | null;
    tiempo_hasta_adenda_icsara_complementario: number | null;
    tiempo_hasta_icsara_complementario_adenda_complementaria: number | null;
    tiempo_hasta_adenda_complementaria_ice: number | null;
    tiempo_hasta_ice_rca: number | null;
    [key: string]: string | Date | number | null; // Allow dynamic episode fields
}

export interface Episode {
    id: string;
    label: string;
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
    episodes: Episode[];
    availableFilters: {
        tipo_ingreso_seia: string[];
        region: string[];
        tipologia_letra: string[];
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

export interface TimelineSelectorProps {
    episodes: Episode[];
    selectedEpisode: string;
    onEpisodeChange: (episodeId: string) => void;
    themeColors: any;
}
