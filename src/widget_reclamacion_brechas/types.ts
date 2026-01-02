// Types for the Brechas Widget

/**
 * Reference Model
 * Represents a legal reference with source information
 */
export interface Referencia {
    original_name: string;
    first_level_trace: string;
    pages: number[];
    sentence_reference: string[];
    urls: string[];
}

/**
 * Analysis Brecha Model
 * Represents a potential gap in legal analysis
 */
export interface AnalisisBrecha {
    potencial_brecha: string;
    tipo_brecha: string;
    justificacion_brecha: string;
    solucion_titular: string;
    resumen_considerado_titular: string;
    potenciales_vacios: string;
    potenciales_aristas_titular: string;
    potenciales_aristas_alegato: string;
    aplica: string;
    referencias: Referencia[];
}

/**
 * Analysis Brechas Payload Model
 * Contains the list of analysis brechas
 */
export interface AnalisisBrechasPayload {
    analisis_brechas: AnalisisBrecha[];
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
    chipRespuestaInsuficienteBg: string;
    chipOmisionBg: string;
    chipContradiccionBg: string;
    chipAplicaBg: string;
    chipNoAplicaBg: string;
    citeBorder: string;
    citeBackground: string;
    purple: string;
    purpleDark: string;
    purpleLight: string;
    accentDefense: string;    // For defense points
    accentAllegation: string;  // For allegation points
    accentVoids: string;       // For voids/gaps
    border: string;
    buttonText: string;
    buttonBackground: string;
    buttonHover: string;
    buttonActiveBg: string;
    buttonActiveText: string;
};

/**
 * Props for BrechaCard component
 */
export interface BrechaCardProps {
    brecha: AnalisisBrecha;
    themeColors: ThemeColors;
}

/**
 * Props for BrechaSelector component
 */
export interface BrechaSelectorProps {
    brechas: AnalisisBrecha[];
    selectedIndex: number;
    onSelectBrecha: (index: number) => void;
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
