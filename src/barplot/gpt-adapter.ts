import { GPTRawOutput, GPTDashboardData } from './gpt-types';
import { FilterConfig, FilterOption } from './types';

/**
 * Default filter options for all categories
 */
const DEFAULT_FILTER_OPTIONS = {
    nivelInversion: [
        { label: "Alto (>$1M)", value: "alto" },
        { label: "Medio ($100K-$1M)", value: "medio" },
        { label: "Bajo (<$100K)", value: "bajo" }
    ],
    estado: [
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
    sectorProductivo: [
        { label: "Industria", value: "industria" },
        { label: "Comercio", value: "comercio" },
        { label: "Servicios", value: "servicios" },
        { label: "Minería", value: "mineria" },
        { label: "Agricultura", value: "agricultura" },
        { label: "Construcción", value: "construccion" },
        { label: "Tecnología", value: "tecnologia" }
    ],
    formasPresentacion: [
        { label: "Proyecto", value: "proyecto" },
        { label: "Empleo", value: "empleo" }
    ]
};

/**
 * Converts GPT raw output into the format expected by Dashboard
 */
export function parseGPTOutput(gptOutput: GPTRawOutput): GPTDashboardData {
    // Parse widgets data
    const widgets = {
        totalProjects: gptOutput.totalProjects || 0,
        totalJobs: gptOutput.totalJobs || 0,
        sumInvestment: gptOutput.sumInvestment || "MMU$0",
        sumJobs: gptOutput.sumJobs || "0",
        topSector: gptOutput.topSector || "N/A",
        topSectorPercentage: gptOutput.topSectorPercentage || "0"
    };

    // Parse filter values
    const filters = {
        nivelInversion: gptOutput.nivelInversion || ["alto", "medio", "bajo"],
        estado: gptOutput.estado || ["ejecucion", "aprobado", "evaluacion"],
        sectorProductivo: gptOutput.sectorProductivo || ["industria", "comercio", "servicios"],
        formasPresentacion: gptOutput.formasPresentacion || ["proyecto", "empleo"],
        regiones: gptOutput.regiones || []
    };

    // Parse chart data
    const charts = {
        timeSeriesData: gptOutput.timeSeriesData || [],
        regionData: gptOutput.regionData || [],
        candlestickData: gptOutput.candlestickData || []
    };

    return {
        activeView: gptOutput.view || 'proyectos',
        widgets,
        filters,
        charts
    };
}

/**
 * Converts GPT dashboard data into FilterConfig array
 */
export function buildFilterConfigs(gptData: GPTDashboardData): FilterConfig[] {
    const filters: FilterConfig[] = [];

    // Forma de presentación filter
    filters.push({
        label: "Forma de presentación",
        options: DEFAULT_FILTER_OPTIONS.formasPresentacion,
        selectedValues: gptData.filters.formasPresentacion,
        multiSelect: true
    });

    // Sector productivo filter
    filters.push({
        label: "Sector productivo",
        options: DEFAULT_FILTER_OPTIONS.sectorProductivo,
        selectedValues: gptData.filters.sectorProductivo,
        multiSelect: true
    });

    // Nivel de inversión filter
    filters.push({
        label: "Nivel de inversión",
        options: DEFAULT_FILTER_OPTIONS.nivelInversion,
        selectedValues: gptData.filters.nivelInversion,
        multiSelect: true
    });

    // Estado filter
    filters.push({
        label: "Estado",
        options: DEFAULT_FILTER_OPTIONS.estado,
        selectedValues: gptData.filters.estado,
        multiSelect: true
    });

    // Región filter - dynamically build from region data
    if (gptData.charts.regionData.length > 0) {
        const regionOptions: FilterOption[] = gptData.charts.regionData.map(r => ({
            label: r.period,
            value: r.region
        }));

        filters.push({
            label: "Región",
            options: regionOptions,
            selectedValues: gptData.filters.regiones.length > 0
                ? gptData.filters.regiones
                : gptData.charts.regionData.map(r => r.region),
            multiSelect: true
        });
    }

    return filters;
}

/**
 * Example: Parse a simple string format from GPT
 * GPT could output: "proyectos,24246,156420,MMU$1.041.944,Industria,22.7"
 */
export function parseSimpleGPTString(input: string): Partial<GPTRawOutput> {
    const parts = input.split(',');

    if (parts.length < 6) {
        throw new Error('Invalid GPT output format. Expected at least 6 comma-separated values.');
    }

    return {
        view: parts[0].trim() as 'proyectos' | 'empleo',
        totalProjects: parseInt(parts[1].trim(), 10),
        totalJobs: parseInt(parts[2].trim(), 10),
        sumInvestment: parts[3].trim(),
        topSector: parts[4].trim(),
        topSectorPercentage: parts[5].trim()
    };
}
