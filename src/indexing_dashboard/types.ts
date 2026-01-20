// Types for Indexing Dashboard

export type IndexStatus = {
    index_name: string;
    tipo_documento: string;
    listo_para_indexar: number;
    corrompido: number;
    en_cola: number;
    indexado: number;
    falta_ocr: number;
    pdf_validado: number;
    no_descargado: number;
};

export type FilterOption = {
    label: string;
    value: string;
};

export type FilterConfig = {
    label: string;
    options: FilterOption[];
    selectedValues: string[];
    multiSelect?: boolean;
};

export type ThemeColors = {
    background: string;
    cardBackground: string;
    cardBorder: string;
    text: string;
    textSecondary: string;
    buttonText: string;
    buttonBackground: string;
    buttonHover: string;
    buttonActiveBg: string;
    buttonActiveText: string;
    purple: string;
    purpleDark: string;
    purpleLight: string;
    border: string;
    borderLight: string;
    gridLine: string;
    dropdownBg: string;
    dropdownBorder: string;
    dropdownHover: string;
    dropdownSelected: string;
};

export type WidgetCardProps = {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    subtitle?: string;
    themeColors: ThemeColors;
};

export type DropdownFilterProps = {
    filters: FilterConfig[];
    onFilterChange: (filterLabel: string, selectedValues: string[]) => void;
    themeColors: ThemeColors;
};

// OpenAI integration types
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
