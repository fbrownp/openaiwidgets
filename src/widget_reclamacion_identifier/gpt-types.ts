import { ObservationIdentifier, Similitud, InstanciaObservacion } from './types';

/**
 * Interface for data received from ChatGPT
 * This matches the standard schema format: data: List[Dict]
 */
export interface GPTObservationsData {
    data: ObservationIdentifier[];
}

/**
 * Raw GPT output format (as it comes from GPT)
 * GPT will output based on the standard schema: data: List[Dict]
 */
export interface GPTRawOutput {
    data?: Array<{
        identifier: string;
        first_level_trace: string;
        original_name: string;
        cita_encontrada: string;
        similitud: Similitud;
        instancia_observacion: InstanciaObservacion;
        tipificacion_materia: string;
        url: string;
    }>;
}
