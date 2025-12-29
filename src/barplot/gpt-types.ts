import { DataRow, CandlestickDataRow, FilterConfig } from './types';

/**
 * Interface for data received from ChatGPT
 * This matches the format that GPT will output
 */
export interface GPTDashboardData {
    // Active view - determines if we're showing projects or investment data
    activeView: 'proyectos' | 'inversion';

    // Widget card data
    widgets: {
        totalProjects: number;      // Total de proyectos
        totalJobs: number;           // Total de empleos
        sumInvestment: string;       // e.g., "MMU$1.041.944"
        sumJobs: string;             // e.g., "156.420"
        topSector: string;           // e.g., "Industria"
        topSectorPercentage: string; // e.g., "22.7"
    };

    // Filter configurations (selected values)
    filters: {
        tipo_ingreso_seia: string[];    // e.g., ["DIA", "EIA"]
        tipologia: string[];             // e.g., ["a1", "ñ7", "i5"]
        tipologia_letra: string[];       // e.g., ["k", "b", "t"]
        region: string[];                // e.g., ["Región Metropolitana de Santiago", "Región de Valparaíso"]
        estado_proyecto: string[];       // e.g., ["Aprobado", "En Calificación"]
        etiqueta_inversion: string[];    // e.g., ["Grandes (≥ 100)", "Medianos (≥ 10 - 100)"]
        ano_presentacion: string[];      // e.g., ["2014", "2015", "2016"]
    };

    // Unified data array - single source for all charts
    data: DataRow[];  // Each row contains all filter fields + metrics

    // Optional: Filter options can be provided directly
    // If not provided, will be extracted from data
    filterOptions?: {
        tipo_ingreso_seia?: Array<{ label: string; value: string }>;
        tipologia_letra?: Array<{ label: string; value: string }>;
        region?: Array<{ label: string; value: string }>;
        estado_proyecto?: Array<{ label: string; value: string }>;
        etiqueta_inversion?: Array<{ label: string; value: string }>;
        ano_presentacion?: Array<{ label: string; value: string }>;
    };
}

/**
 * Raw GPT output format (as it comes from GPT)
 * GPT will output a simpler format that we'll parse
 */
export interface GPTRawOutput {
    view: 'proyectos' | 'inversion';

    // Simple numeric values
    totalProjects?: number;
    totalJobs?: number;
    sumInvestment?: string;
    sumJobs?: string;
    topSector?: string;
    topSectorPercentage?: string;

    // Filter values (selected values)
    tipo_ingreso_seia?: string[];
    tipologia?: string[];
    tipologia_letra?: string[];
    region?: string[];
    estado_proyecto?: string[];
    etiqueta_inversion?: string[];
    ano_presentacion?: string[];

    // Optional: Filter options can be passed directly from GPT
    // If not provided, will be extracted from data
    filterOptions?: {
        tipo_ingreso_seia?: Array<{ label: string; value: string }>;
        tipologia_letra?: Array<{ label: string; value: string }>;
        region?: Array<{ label: string; value: string }>;
        estado_proyecto?: Array<{ label: string; value: string }>;
        etiqueta_inversion?: Array<{ label: string; value: string }>;
        ano_presentacion?: Array<{ label: string; value: string }>;
    };

    // Unified data array - each row contains filter fields + metrics
    // Matches schema: ano_presentacion, tipo_ingreso_seia, tipologia_letra, region, estado_proyecto, cantidad_proyectos, inversion_total
    data?: Array<{
        ano_presentacion: number;        // Year of presentation
        tipo_ingreso_seia: string;       // Type of SEIA entry
        tipologia_letra: string;         // Typology letter
        region: string;                  // Region
        estado_proyecto: string;         // Project state
        cantidad_proyectos: number;      // Count of projects
        inversion_total: number;         // Total investment
        // Optional fields
        tipologia?: string;              // Full typology code
        etiqueta_inversion?: string;     // Investment label
    }>;

    // Legacy support - will be deprecated
    timeSeriesData?: Array<{
        period: string;
        year: number;
        region: string;
        tipo_ingreso_seia?: string;
        tipologia?: string;
        tipologia_letra?: string;
        estado_proyecto?: string;
        etiqueta_inversion?: string;
        ano_presentacion?: number;
        cantidad_proyectos?: number;
        inversion_total?: number;
    }>;

    regionData?: Array<{
        period: string;
        year: number;
        region: string;
        tipo_ingreso_seia?: string;
        tipologia?: string;
        tipologia_letra?: string;
        estado_proyecto?: string;
        etiqueta_inversion?: string;
        ano_presentacion?: number;
        cantidad_proyectos?: number;
        inversion_total?: number;
    }>;

    candlestickData?: Array<{
        period: string;
        year: number;
        open: number;
        high: number;
        low: number;
        close: number;
    }>;
}
