// Types for the Observation Identifier Widget

export type Similitud = 'Similar' | 'Identica';
export type InstanciaObservacion = 'PAC_1' | 'PAC_2' | 'PCPI';

/**
 * Observation Identifier Model
 * Represents a single observation reference
 */
export interface ObservationIdentifier {
    identifier: string;
    first_level_trace: string;
    original_name: string;
    cita_encontrada: string;
    similitud: Similitud;
    instancia_observacion: InstanciaObservacion;
    tipificacion_materia: string;
}

/**
 * Observations Identifier collection
 * Contains the list of observation references
 */
export interface ObservationsIdentifier {
    observations_reference: ObservationIdentifier[];
}

/**
 * Theme colors for the widget
 */
export type ThemeColors = {
    background: string;
    cardBackground: string;
    cardBorder: string;
    text: string;
    textSecondary: string;
    chipBackground: string;
    chipText: string;
    chipSimilarBg: string;
    chipIdenticalBg: string;
    chipPAC1Bg: string;
    chipPAC2Bg: string;
    chipPCPIBg: string;
    chipTipificacionBg: string;
    citeBorder: string;
    citeBackground: string;
};

/**
 * Props for ObservationCard component
 */
export interface ObservationCardProps {
    observation: ObservationIdentifier;
    themeColors: ThemeColors;
}

/**
 * Props for ObservationCarousel component
 */
export interface ObservationCarouselProps {
    observations: ObservationIdentifier[];
    themeColors: ThemeColors;
}

// OpenAI Integration types
export type UnknownObject = Record<string, unknown>;
export type DisplayMode = 'compact' | 'expanded' | 'full';

export const SET_GLOBALS_EVENT_TYPE = 'openai:setGlobals' as const;

export type SetGlobalsEvent = CustomEvent<{
    globals: Partial<OpenAiGlobals>;
}>;

export type OpenAiGlobals = {
    toolOutput: unknown;
    toolResponseMetadata: unknown;
    widgetState: unknown;
    maxHeight: number | null;
    displayMode: DisplayMode | null;
};

declare global {
    interface Window {
        openai?: {
            toolOutput?: unknown;
            toolResponseMetadata?: unknown;
            widgetState?: unknown;
            maxHeight?: number | null;
            displayMode?: DisplayMode | null;
            setWidgetState?: (state: UnknownObject) => Promise<void>;
        };
    }

    interface WindowEventMap {
        [SET_GLOBALS_EVENT_TYPE]: SetGlobalsEvent;
    }
}
