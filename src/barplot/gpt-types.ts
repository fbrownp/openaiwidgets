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
        nivelInversion: string[];    // e.g., ["alto", "medio", "bajo"]
        estado: string[];             // e.g., ["ejecucion", "aprobado", "evaluacion"]
        sectorProductivo: string[];   // e.g., ["industria", "comercio"]
        formasPresentacion: string[]; // e.g., ["proyecto", "empleo"]
        regiones: string[];           // e.g., ["Metropolitana", "O'Higgins"]
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
    nivelInversion?: string[];
    estado?: string[];
    sectorProductivo?: string[];
    formasPresentacion?: string[];
    regiones?: string[];

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
