// Types for the SEIA Projects Carousel Widget

/**
 * SEIA Project Model
 * Represents a single SEIA project from GPT output
 */
export interface SeiaProject {
    expediente_seia: number;
    nombre_proyecto: string;
    inversion: number;
    region: string;
    cosine_similarity: number;
}

/**
 * SEIA Projects Collection
 * Contains the list of SEIA projects
 */
export interface SeiaProjects {
    data: SeiaProject[];
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
    purple: string;
    purpleDark: string;
    buttonHover: string;
    citeBorder: string;
    citeBackground: string;
};

/**
 * Props for SeiaProjectCard component
 */
export interface SeiaProjectCardProps {
    project: SeiaProject;
    themeColors: ThemeColors;
}

/**
 * Props for SeiaProjectCarousel component
 */
export interface SeiaProjectCarouselProps {
    projects: SeiaProject[];
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
