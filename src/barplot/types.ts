// Existing types...
export type MetricOption = {
    label: string;
    value: string;
};

export type DataRow = {
    period: string;
    year: number;
    region: string;
    [key: string]: number | string;
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
};

export type WidgetCardProps = {
    title: string;
    value: string | number;
    icon?: string;
    subtitle?: string;
};

export type DropdownFilterProps = {
    filters: FilterConfig[];
    onFilterChange: (filterLabel: string, selectedValues: string[]) => void;
};

export type CandlestickDataRow = {
    period: string;
    year: number;
    open: number;
    high: number;
    low: number;
    close: number;
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