/**
 * Types for the Tree UF Widget
 * Represents hierarchical relationships between different expediente types
 */

/**
 * Edge data representing a connection between two nodes
 */
export interface EdgeData {
    src_name: string;
    src_id: string;
    dst_name: string;
    dst_id: string;
    src_hierarchy_level: number;
    dst_hierarchy_level: number;
}

/**
 * Node data representing a single document/entity
 */
export interface NodeData {
    name: string; // Type of node (id_uf, expediente_seia, etc.)
    id: string;   // Unique identifier
    hierarchy_level: number;
    connections: string[]; // IDs of connected nodes
}

/**
 * Processed tree data for rendering
 */
export interface TreeData {
    id_uf: string;
    nodes: Map<string, NodeData[]>; // Grouped by node type
    edges: EdgeData[];
}

/**
 * Props for the TreeCard component
 */
export interface TreeCardProps {
    title: string;
    items: NodeData[];
    themeColors: ThemeColors;
    onItemClick: (item: NodeData) => void;
    selectedItem: NodeData | null;
    highlightedItems: Set<string>;
}

/**
 * Theme colors for the widget
 */
export interface ThemeColors {
    background: string;
    cardBackground: string;
    cardBorder: string;
    text: string;
    textSecondary: string;
    chipBackground?: string;
    chipText?: string;
    purple: string;
    purpleDark: string;
    buttonHover: string;
    citeBorder?: string;
    citeBackground?: string;
    buttonText: string;
    buttonBackground: string;
    buttonActiveBg: string;
    buttonActiveText: string;
}

/**
 * Display mode for the widget
 */
export type DisplayMode = 'compact' | 'expanded' | 'full';

/**
 * OpenAI Globals type
 */
export type UnknownObject = Record<string, unknown>;

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
