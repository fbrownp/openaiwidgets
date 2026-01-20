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
        'tipologia' in row &&
        'etiqueta_inversion' in row &&
        'expediente_presentacion' in row &&
        'tiempo_entre_icsara_adenda' in row
    );
}

/**
 * Parse raw GPT output into dashboard data structure
 */
export function parseGPTOutput(gptOutput: any): GPTDashboardData {
    try {
        let rawData: GPTDataRow[] = [];

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

        // Filter out invalid rows
        const validData = rawData.filter(isValidDataRow);

        if (validData.length === 0) {
            console.warn('No valid data rows found, using placeholder data');
            return parseGPTOutput(placeholderData);
        }

        // Extract filter values from data
        const filters = {
            tipo_ingreso_seia: extractUniqueValues(validData, 'tipo_ingreso_seia'),
            region: extractUniqueValues(validData, 'region'),
            tipologia: extractUniqueValues(validData, 'tipologia'),
            etiqueta_inversion: extractUniqueValues(validData, 'etiqueta_inversion')
        };

        return {
            data: validData,
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
