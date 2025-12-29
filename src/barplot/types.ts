// Existing types...
export type MetricOption = {
    label: string;
    value: string;
};

export type DataRow = {
    period: string;
    year: number;
    region: string;
    // Filter fields from schema
    tipo_ingreso_seia?: string;
    tipologia?: string;
    tipologia_letra?: string;
    estado_proyecto?: string;
    etiqueta_inversion?: string;
    ano_presentacion?: number;
    // Metric fields
    cantidad_proyectos?: number;
    inversion_total?: number;
    [key: string]: number | string | undefined;
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

export type ChartSeries = {
    type: 'bar' | 'line';
    dataKey: string;
    color: string;
    name?: string;
};

export type BarplotProps = {
    title: string;
    metricOptions: MetricOption[];
    selectedMetric: string;
    rows: DataRow[];
    onMetricChange?: (value: string) => void;
    twoWayPlot?: boolean;
    showYAxis?: boolean;
    height?: number;
    themeColors?: ThemeColors;
};

export type WidgetCardProps = {
    title: string;
    value: string | number;
    icon?: string;
    subtitle?: string;
    themeColors: ThemeColors;
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

export type DropdownFilterProps = {
    filters: FilterConfig[];
    onFilterChange: (filterLabel: string, selectedValues: string[]) => void;
    themeColors: ThemeColors;
};

export type CandlestickDataRow = {
    period: string;
    year: number;
    open: number;
    high: number;
    low: number;
    close: number;
};

export type BoxPlotDataRow = {
    period: string;
    year: number;
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    outliers?: number[];
};

export type BoxPlotProps = {
    title: string;
    rows: BoxPlotDataRow[];
    height?: number;
};

// ADD THESE NEW TYPES FOR OPENAI INTEGRATION
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