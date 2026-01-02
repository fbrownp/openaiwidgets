// GPT Adapter for Brechas Widget
// Handles parsing and transforming GPT output into widget data

import { GPTBrechasData, GPTRawOutput } from './gpt-types';
import { AnalisisBrechasPayload } from './types';

/**
 * Create default/empty brechas data
 */
export function createDefaultBrechasData(): GPTBrechasData {
    return {
        data: {
            analisis_brechas: []
        }
    };
}

/**
 * Parse GPT output into structured brechas data
 */
export function parseGPTOutput(toolOutput: GPTRawOutput): GPTBrechasData {
    try {
        // Handle different possible structures
        if (toolOutput.data) {
            // If data is a string, try to parse it
            if (typeof toolOutput.data === 'string') {
                try {
                    const parsed = JSON.parse(toolOutput.data);
                    return validateAndNormalize(parsed);
                } catch {
                    console.warn('Failed to parse toolOutput.data as JSON');
                    return createDefaultBrechasData();
                }
            }
            // If data is already an object, validate and normalize
            return validateAndNormalize(toolOutput.data);
        }

        // If toolOutput itself looks like the payload
        if ('analisis_brechas' in toolOutput) {
            return validateAndNormalize(toolOutput);
        }

        console.warn('Unrecognized toolOutput structure:', toolOutput);
        return createDefaultBrechasData();
    } catch (error) {
        console.error('Error parsing GPT output:', error);
        return createDefaultBrechasData();
    }
}

/**
 * Validate and normalize the data structure
 */
function validateAndNormalize(data: unknown): GPTBrechasData {
    const defaultData = createDefaultBrechasData();

    if (!data || typeof data !== 'object') {
        return defaultData;
    }

    const obj = data as Record<string, unknown>;

    // Check if it's wrapped in a 'data' field
    if (obj.data && typeof obj.data === 'object') {
        return validateAndNormalize(obj.data);
    }

    // Check for analisis_brechas array
    if (Array.isArray(obj.analisis_brechas)) {
        const payload: AnalisisBrechasPayload = {
            analisis_brechas: obj.analisis_brechas.map(brecha => ({
                potencial_brecha: String(brecha?.potencial_brecha || ''),
                tipo_brecha: String(brecha?.tipo_brecha || ''),
                justificacion_brecha: String(brecha?.justificacion_brecha || ''),
                solucion_titular: String(brecha?.solucion_titular || ''),
                resumen_considerado_titular: String(brecha?.resumen_considerado_titular || ''),
                potenciales_vacios: String(brecha?.potenciales_vacios || ''),
                potenciales_aristas_titular: String(brecha?.potenciales_aristas_titular || ''),
                potenciales_aristas_alegato: String(brecha?.potenciales_aristas_alegato || ''),
                aplica: String(brecha?.aplica || ''),
                referencias: Array.isArray(brecha?.referencias)
                    ? brecha.referencias.map(ref => ({
                        original_name: String(ref?.original_name || ''),
                        first_level_trace: String(ref?.first_level_trace || ''),
                        pages: Array.isArray(ref?.pages) ? ref.pages : [],
                        sentence_reference: Array.isArray(ref?.sentence_reference) ? ref.sentence_reference : [],
                        urls: Array.isArray(ref?.urls) ? ref.urls : []
                    }))
                    : []
            }))
        };

        return { data: payload };
    }

    return defaultData;
}
