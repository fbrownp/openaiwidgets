import { ObservationIdentifier, ObservationsIdentifier, Similitud, InstanciaObservacion } from './types';

/**
 * Interface for data received from ChatGPT
 * This matches the Pydantic model format from the backend
 */
export interface GPTObservationsData {
    observations_reference: ObservationIdentifier[];
}

/**
 * Raw GPT output format (as it comes from GPT)
 * GPT will output based on the Pydantic BaseModel structure
 */
export interface GPTRawOutput {
    observations_reference?: Array<{
        identifier: string;
        first_level_trace: string;
        original_name: string;
        cita_encontrada: string;
        similitud: Similitud;
        instancia_observacion: InstanciaObservacion;
        tipificacion_materia: string;
    }>;
}
