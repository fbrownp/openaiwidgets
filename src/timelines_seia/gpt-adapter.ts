/**
 * GPT Adapter for Timelines SEIA Component
 * Parses and transforms GPT output into the expected dashboard data structure
 */

import { GPTRawOutput, GPTDashboardData, GPTDataRow } from './gpt-types';
import { placeholderData } from './placeholder-data';

/**
 * Extract unique values from data array for a specific field
 */
function extractUniqueValues(data: GPTDataRow[], field: keyof GPTDataRow): string[] {
    const uniqueSet = new Set<string>();
    data.forEach(row => {
        const value = row[field];
        if (value !== null && value !== undefined) {
            uniqueSet.add(String(value));
        }
    });
    return Array.from(uniqueSet).sort();
}

/**
 * Validate GPT data row structure
 */
function isValidDataRow(row: any): row is GPTDataRow {
    return (
        row &&
        typeof row === 'object' &&
        'tipo_ingreso_seia' in row &&
        'region' in row &&
        'tipologia_letra' in row &&
        'etiqueta_inversion' in row &&
        'expediente_presentacion' in row
    );
}

/**
 * Normalize a data row (convert date strings to Date objects, ensure numbers)
 */
function normalizeDataRow(row: any): GPTDataRow {
    const normalized: GPTDataRow = {
        tipo_ingreso_seia: String(row.tipo_ingreso_seia || ''),
        region: String(row.region || ''),
        tipologia_letra: String(row.tipologia_letra || ''),
        tipologia: String(row.tipologia || ''),
        etiqueta_inversion: String(row.etiqueta_inversion || ''),
        expediente_presentacion: typeof row.expediente_presentacion === 'string'
            ? row.expediente_presentacion
            : row.expediente_presentacion instanceof Date
                ? row.expediente_presentacion.toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0],
        // Entre Eventos fields
        tiempo_entre_presentacion_icsara: row.tiempo_entre_presentacion_icsara != null
            ? Number(row.tiempo_entre_presentacion_icsara)
            : null,
        tiempo_entre_icsara_adenda: row.tiempo_entre_icsara_adenda != null
            ? Number(row.tiempo_entre_icsara_adenda)
            : null,
        tiempo_entre_adenda_icsara_complementario: row.tiempo_entre_adenda_icsara_complementario != null
            ? Number(row.tiempo_entre_adenda_icsara_complementario)
            : null,
        tiempo_entre_icsara_complementario_adenda_complementaria: row.tiempo_entre_icsara_complementario_adenda_complementaria != null
            ? Number(row.tiempo_entre_icsara_complementario_adenda_complementaria)
            : null,
        tiempo_entre_adenda_complementaria_ice: row.tiempo_entre_adenda_complementaria_ice != null
            ? Number(row.tiempo_entre_adenda_complementaria_ice)
            : null,
        tiempo_entre_ice_rca: row.tiempo_entre_ice_rca != null
            ? Number(row.tiempo_entre_ice_rca)
            : null,
        // Total (Hasta) fields
        tiempo_hasta_presentacion_icsara: row.tiempo_hasta_presentacion_icsara != null
            ? Number(row.tiempo_hasta_presentacion_icsara)
            : null,
        tiempo_hasta_icsara_adenda: row.tiempo_hasta_icsara_adenda != null
            ? Number(row.tiempo_hasta_icsara_adenda)
            : null,
        tiempo_hasta_adenda_icsara_complementario: row.tiempo_hasta_adenda_icsara_complementario != null
            ? Number(row.tiempo_hasta_adenda_icsara_complementario)
            : null,
        tiempo_hasta_icsara_complementario_adenda_complementaria: row.tiempo_hasta_icsara_complementario_adenda_complementaria != null
            ? Number(row.tiempo_hasta_icsara_complementario_adenda_complementaria)
            : null,
        tiempo_hasta_adenda_complementaria_ice: row.tiempo_hasta_adenda_complementaria_ice != null
            ? Number(row.tiempo_hasta_adenda_complementaria_ice)
            : null,
        tiempo_hasta_ice_rca: row.tiempo_hasta_ice_rca != null
            ? Number(row.tiempo_hasta_ice_rca)
            : null
    };

    // Copy any additional episode fields
    Object.keys(row).forEach(key => {
        if (key.startsWith('tiempo_') && !(key in normalized)) {
            normalized[key] = row[key] != null ? Number(row[key]) : null;
        }
    });

    return normalized;
}

/**
 * Detect episodes from data by looking for tiempo_* fields
 */
function detectEpisodesFromData(data: GPTDataRow[]): string[] {
    const episodeFields = new Set<string>();

    data.forEach(row => {
        Object.keys(row).forEach(key => {
            if (key.startsWith('tiempo_') && typeof row[key] === 'number') {
                episodeFields.add(key);
            }
        });
    });

    return Array.from(episodeFields).sort();
}

/**
 * Parse raw GPT output into dashboard data structure
 */
export function parseGPTOutput(gptOutput: any): GPTDashboardData {
    try {
        let rawData: any[] = [];

        // Handle different input formats
        if (Array.isArray(gptOutput)) {
            // Format 1: Direct array
            rawData = gptOutput;
        } else if (gptOutput && typeof gptOutput === 'object') {
            if (Array.isArray(gptOutput.data)) {
                // Format 2: Object with data property
                rawData = gptOutput.data;
            } else if (gptOutput.tipo_ingreso_seia) {
                // Format 3: Single data row
                rawData = [gptOutput];
            }
        }

        // Validate data
        if (!Array.isArray(rawData) || rawData.length === 0) {
            console.warn('No valid data found in GPT output, using placeholder data');
            return parseGPTOutput(placeholderData);
        }

        // Filter out invalid rows and normalize them
        const validData = rawData
            .filter(isValidDataRow)
            .map(normalizeDataRow);

        if (validData.length === 0) {
            console.warn('No valid data rows found, using placeholder data');
            return parseGPTOutput(placeholderData);
        }

        console.log(`Parsed ${validData.length} valid data rows`);

        // Get episodes from GPT output or detect from data
        let episodes: string[] = [];
        if (gptOutput && typeof gptOutput === 'object' && Array.isArray(gptOutput.episodes)) {
            episodes = gptOutput.episodes;
            console.log('Using episodes from GPT output:', episodes);
        } else {
            episodes = detectEpisodesFromData(validData);
            console.log('Auto-detected episodes from data:', episodes);
        }

        // Ensure at least the default episode exists
        if (episodes.length === 0) {
            episodes = ['tiempo_entre_icsara_adenda'];
        }

        // Extract filter values from data
        const filters = {
            tipo_ingreso_seia: extractUniqueValues(validData, 'tipo_ingreso_seia'),
            region: extractUniqueValues(validData, 'region'),
            tipologia_letra: extractUniqueValues(validData, 'tipologia_letra'),
            tipologia: extractUniqueValues(validData, 'tipologia'),
            etiqueta_inversion: extractUniqueValues(validData, 'etiqueta_inversion')
        };

        return {
            data: validData,
            episodes,
            filters
        };
    } catch (error) {
        console.error('Error parsing GPT output:', error);
        return parseGPTOutput(placeholderData);
    }
}

/**
 * Build filter configurations from dashboard data
 */
export function buildFilterConfigs(gptData: GPTDashboardData): any[] {
    const filterLabels = {
        tipo_ingreso_seia: 'Tipo Ingreso SEIA',
        region: 'Región',
        tipologia_letra: 'Letra de Tipología',
        tipologia: 'Tipología',
        etiqueta_inversion: 'Etiqueta Inversión'
    };

    return Object.entries(gptData.filters).map(([key, values]) => ({
        label: filterLabels[key as keyof typeof filterLabels] || key,
        options: values.map(value => ({
            label: value,
            value: value
        })),
        selectedValues: [],
        multiSelect: true
    }));
}
