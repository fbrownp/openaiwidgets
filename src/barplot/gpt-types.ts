import { DataRow, CandlestickDataRow, FilterConfig } from './types';

/**
 * Interface for data received from ChatGPT
 * This matches the format that GPT will output
 */
export interface GPTDashboardData {
    // Active view - determines if we're showing projects or employment data
    activeView: 'proyectos' | 'empleo';

    // Widget card data
    widgets: {
        totalProjects: number;      // Total de proyectos
        totalJobs: number;           // Total de empleos
        sumInvestment: string;       // e.g., "MMU$1.041.944"
        sumJobs: string;             // e.g., "156.420"
        topSector: string;           // e.g., "Industria"
        topSectorPercentage: string; // e.g., "22.7"
    };

    // Filter configurations
    filters: {
        tipo_ingreso_seia: string[];    // e.g., ["DIA", "EIA"]
        tipologia: string[];             // e.g., ["a1", "ñ7", "i5"]
        tipologia_letra: string[];       // e.g., ["k", "b", "t"]
        region: string[];                // e.g., ["Región Metropolitana de Santiago", "Región de Valparaíso"]
        estado_proyecto: string[];       // e.g., ["Aprobado", "En Calificación"]
        etiqueta_inversion: string[];    // e.g., ["Grandes (≥ 100)", "Medianos (≥ 10 - 100)"]
        ano_presentacion: string[];      // e.g., ["2014", "2015", "2016"]
    };

    // Chart data
    charts: {
        timeSeriesData: DataRow[];        // For yearly bar chart
        regionData: DataRow[];             // For regional horizontal bar chart
        candlestickData: CandlestickDataRow[]; // For volatility chart
    };
}

/**
 * Raw GPT output format (as it comes from GPT)
 * GPT will output a simpler format that we'll parse
 */
export interface GPTRawOutput {
    view: 'proyectos' | 'empleo';

    // Simple numeric values
    totalProjects?: number;
    totalJobs?: number;
    sumInvestment?: string;
    sumJobs?: string;
    topSector?: string;
    topSectorPercentage?: string;

    // Filter values
    tipo_ingreso_seia?: string[];
    tipologia?: string[];
    tipologia_letra?: string[];
    region?: string[];
    estado_proyecto?: string[];
    etiqueta_inversion?: string[];
    ano_presentacion?: string[];

    // Chart data arrays
    timeSeriesData?: Array<{
        period: string;
        year: number;
        region: string;
        revenue?: number;
        units?: number;
        profit?: number;
    }>;

    regionData?: Array<{
        period: string;
        year: number;
        region: string;
        revenue?: number;
        units?: number;
        profit?: number;
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
