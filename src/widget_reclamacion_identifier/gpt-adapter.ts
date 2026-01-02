import { GPTObservationsData, GPTRawOutput } from './gpt-types';
import { ObservationIdentifier } from './types';

/**
 * Converts GPT raw output into the format expected by Dashboard
 */
export function parseGPTOutput(gptOutput: GPTRawOutput): GPTObservationsData {
    console.log('Parsing GPT output:', gptOutput);

    // Parse observations array
    const observations_reference: ObservationIdentifier[] =
        gptOutput.observations_reference?.map(obs => ({
            identifier: obs.identifier || 'Unknown',
            first_level_trace: obs.first_level_trace || '',
            original_name: obs.original_name || '',
            cita_encontrada: obs.cita_encontrada || '',
            similitud: obs.similitud || 'Similar',
            instancia_observacion: obs.instancia_observacion || 'PAC_1',
            tipificacion_materia: obs.tipificacion_materia || ''
        })) || [];

    const result: GPTObservationsData = {
        observations_reference
    };

    console.log('Parsed observations data:', result);

    return result;
}

/**
 * Create default/empty observations data
 */
export function createDefaultObservationsData(): GPTObservationsData {
    return {
        observations_reference: []
    };
}
