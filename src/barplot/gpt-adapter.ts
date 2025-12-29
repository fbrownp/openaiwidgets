import { GPTDashboardData, GPTRawOutput } from './gpt-types';
import { FilterConfig, FilterOption } from './types';

/**
 * Default filter options for all categories
 */
const DEFAULT_FILTER_OPTIONS = {
    tipo_ingreso_seia: [
        { label: "DIA", value: "DIA" },
        { label: "EIA", value: "EIA" }
    ],
    tipologia: [
        { label: "a1", value: "a1" },
        { label: "ñ7", value: "ñ7" },
        { label: "i5", value: "i5" },
        { label: "m4", value: "m4" },
        { label: "ñ2", value: "ñ2" },
        { label: "k1", value: "k1" },
        { label: "f3", value: "f3" },
        { label: "e6", value: "e6" },
        { label: "j1", value: "j1" },
        { label: "h1", value: "h1" },
        { label: "n7", value: "n7" },
        { label: "f1", value: "f1" },
        { label: "ñ5", value: "ñ5" },
        { label: "e5", value: "e5" },
        { label: "i2", value: "i2" },
        { label: "d", value: "d" },
        { label: "n5", value: "n5" },
        { label: "h2", value: "h2" },
        { label: "e7", value: "e7" },
        { label: "e8", value: "e8" },
        { label: "m1", value: "m1" },
        { label: "j3", value: "j3" },
        { label: "o8", value: "o8" },
        { label: "g3", value: "g3" },
        { label: "a2", value: "a2" },
        { label: "h4", value: "h4" },
        { label: "l1", value: "l1" },
        { label: "i", value: "i" },
        { label: "g2", value: "g2" },
        { label: "g4", value: "g4" },
        { label: "a4", value: "a4" },
        { label: "n2", value: "n2" },
        { label: "u", value: "u" },
        { label: "b2", value: "b2" },
        { label: "s", value: "s" },
        { label: "o2", value: "o2" },
        { label: "ñ3", value: "ñ3" },
        { label: "e3", value: "e3" },
        { label: "p", value: "p" },
        { label: "a6", value: "a6" },
        { label: "e2", value: "e2" },
        { label: "o5", value: "o5" },
        { label: "j2", value: "j2" },
        { label: "o11", value: "o11" },
        { label: "l2", value: "l2" },
        { label: "e4", value: "e4" },
        { label: "l", value: "l" },
        { label: "a7", value: "a7" },
        { label: "h3", value: "h3" },
        { label: "o10", value: "o10" },
        { label: "i1", value: "i1" },
        { label: "n1", value: "n1" },
        { label: "g", value: "g" },
        { label: "e1", value: "e1" },
        { label: "m3", value: "m3" },
        { label: "i3", value: "i3" },
        { label: "l5", value: "l5" },
        { label: "n6", value: "n6" },
        { label: "f4", value: "f4" },
        { label: "m2", value: "m2" },
        { label: "b1", value: "b1" },
        { label: "k2", value: "k2" },
        { label: "i4", value: "i4" },
        { label: "g1", value: "g1" },
        { label: "h5", value: "h5" },
        { label: "ñ4", value: "ñ4" },
        { label: "l4", value: "l4" },
        { label: "h6", value: "h6" },
        { label: "o1", value: "o1" },
        { label: "ñ6", value: "ñ6" },
        { label: "a5", value: "a5" },
        { label: "o4", value: "o4" },
        { label: "n4", value: "n4" },
        { label: "ñ1", value: "ñ1" },
        { label: "l3", value: "l3" },
        { label: "t", value: "t" },
        { label: "o3", value: "o3" },
        { label: "o6", value: "o6" },
        { label: "o7", value: "o7" },
        { label: "n3", value: "n3" },
        { label: "o9", value: "o9" },
        { label: "j4", value: "j4" },
        { label: "a3", value: "a3" },
        { label: "r", value: "r" },
        { label: "c", value: "c" },
        { label: "f", value: "f" }
    ],
    tipologia_letra: [
        { label: "k", value: "k" },
        { label: "b", value: "b" },
        { label: "t", value: "t" },
        { label: "l", value: "l" },
        { label: "s", value: "s" },
        { label: "u", value: "u" },
        { label: "ñ", value: "ñ" },
        { label: "a", value: "a" },
        { label: "h", value: "h" },
        { label: "j", value: "j" },
        { label: "n", value: "n" },
        { label: "p", value: "p" },
        { label: "f", value: "f" },
        { label: "c", value: "c" },
        { label: "e", value: "e" },
        { label: "i", value: "i" },
        { label: "g", value: "g" },
        { label: "d", value: "d" },
        { label: "r", value: "r" },
        { label: "m", value: "m" },
        { label: "o", value: "o" }
    ],
    region: [
        { label: "Región de Aysén", value: "Región de Aysén" },
        { label: "Región de Magallanes y Antártica Chilena", value: "Región de Magallanes y Antártica Chilena" },
        { label: "Región de Ñuble", value: "Región de Ñuble" },
        { label: "Región de La Araucanía", value: "Región de La Araucanía" },
        { label: "Región del Maule", value: "Región del Maule" },
        { label: "Región del Biobío", value: "Región del Biobío" },
        { label: "Región de Coquimbo", value: "Región de Coquimbo" },
        { label: "Región Metropolitana de Santiago", value: "Región Metropolitana de Santiago" },
        { label: "Región de Tarapacá", value: "Región de Tarapacá" },
        { label: "Región de Atacama", value: "Región de Atacama" },
        { label: "Región de Valparaíso", value: "Región de Valparaíso" },
        { label: "Región de Los Ríos", value: "Región de Los Ríos" },
        { label: "Región de Arica y Parinacota", value: "Región de Arica y Parinacota" },
        { label: "Interregional", value: "Interregional" },
        { label: "Región del Libertador General Bernardo OHiggins", value: "Región del Libertador General Bernardo OHiggins" },
        { label: "Región de Antofagasta", value: "Región de Antofagasta" },
        { label: "Región de Los Lagos", value: "Región de Los Lagos" }
    ],
    estado_proyecto: [
        { label: "No Admitido a Tramitación", value: "No Admitido a Tramitación" },
        { label: "Renuncia RCA", value: "Renuncia RCA" },
        { label: "No calificado", value: "No calificado" },
        { label: "Abandonado", value: "Abandonado" },
        { label: "En Admisión", value: "En Admisión" },
        { label: "Revocado", value: "Revocado" },
        { label: "Rechazado", value: "Rechazado" },
        { label: "Caducado", value: "Caducado" },
        { label: "Desistido", value: "Desistido" },
        { label: "En Calificación", value: "En Calificación" },
        { label: "Aprobado", value: "Aprobado" }
    ],
    etiqueta_inversion: [
        { label: "Grandes (≥ 100)", value: "Grandes (≥ 100)" },
        { label: "Medianos (≥ 10 - 100)", value: "Medianos (≥ 10 - 100)" },
        { label: "Pequeños (0 - 10)", value: "Pequeños (0 - 10)" }
    ],
    ano_presentacion: [
        { label: "2014", value: "2014" },
        { label: "2015", value: "2015" },
        { label: "2016", value: "2016" },
        { label: "2017", value: "2017" },
        { label: "2018", value: "2018" },
        { label: "2019", value: "2019" },
        { label: "2020", value: "2020" },
        { label: "2021", value: "2021" },
        { label: "2022", value: "2022" },
        { label: "2023", value: "2023" },
        { label: "2024", value: "2024" },
        { label: "2025", value: "2025" }
    ]
};

/**
 * Converts GPT raw output into the format expected by Dashboard
 */
export function parseGPTOutput(gptOutput: GPTRawOutput): GPTDashboardData {
    console.log('Parsing GPT output:', gptOutput);

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
        tipo_ingreso_seia: gptOutput.tipo_ingreso_seia || ["DIA", "EIA"],
        tipologia: gptOutput.tipologia || [],
        tipologia_letra: gptOutput.tipologia_letra || [],
        region: gptOutput.region || [],
        estado_proyecto: gptOutput.estado_proyecto || [],
        etiqueta_inversion: gptOutput.etiqueta_inversion || [],
        ano_presentacion: gptOutput.ano_presentacion || []
    };

    // Parse chart data
    const charts = {
        timeSeriesData: gptOutput.timeSeriesData || [],
        regionData: gptOutput.regionData || [],
        candlestickData: gptOutput.candlestickData || []
    };

    const result: GPTDashboardData = {
        activeView: gptOutput.view || 'proyectos',
        widgets,
        filters,
        charts
    };

    console.log('Parsed dashboard data:', result);

    return result;
}

/**
 * Converts GPT dashboard data into FilterConfig array
 */
export function buildFilterConfigs(gptData: GPTDashboardData): FilterConfig[] {
    const filters: FilterConfig[] = [];

    // Tipo de Ingreso filter
    filters.push({
        label: "Tipo de Ingreso",
        options: DEFAULT_FILTER_OPTIONS.tipo_ingreso_seia,
        selectedValues: gptData.filters.tipo_ingreso_seia,
        multiSelect: true
    });

    // Tipología filter
    filters.push({
        label: "Tipología",
        options: DEFAULT_FILTER_OPTIONS.tipologia,
        selectedValues: gptData.filters.tipologia,
        multiSelect: true
    });

    // Letra de tipología filter
    filters.push({
        label: "Letra de tipología",
        options: DEFAULT_FILTER_OPTIONS.tipologia_letra,
        selectedValues: gptData.filters.tipologia_letra,
        multiSelect: true
    });

    // Región filter
    filters.push({
        label: "Región",
        options: DEFAULT_FILTER_OPTIONS.region,
        selectedValues: gptData.filters.region,
        multiSelect: true
    });

    // Estado filter
    filters.push({
        label: "Estado",
        options: DEFAULT_FILTER_OPTIONS.estado_proyecto,
        selectedValues: gptData.filters.estado_proyecto,
        multiSelect: true
    });

    // Nivel de Inversión filter
    filters.push({
        label: "Nivel de Inversión",
        options: DEFAULT_FILTER_OPTIONS.etiqueta_inversion,
        selectedValues: gptData.filters.etiqueta_inversion,
        multiSelect: true
    });

    // Año de Presentación filter
    filters.push({
        label: "Año de Presentación",
        options: DEFAULT_FILTER_OPTIONS.ano_presentacion,
        selectedValues: gptData.filters.ano_presentacion,
        multiSelect: true
    });

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