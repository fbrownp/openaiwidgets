import { IndexStatus, FilterConfig } from './types';

/**
 * Interface for data received from ChatGPT
 * This matches the format that GPT will output
 */
export interface GPTDashboardData {
    // Widget data - counts for indexado
    widgets: {
        totalIndexado: number;
    };

    // Filter configurations (selected values)
    filters: {
        index_name: string[];
    };

    // Unified data array - single source for all charts and widgets
    data: IndexStatus[];
}

/**
 * Raw GPT output format (as it comes from GPT)
 */
export interface GPTRawOutput {
    // Widget values
    totalIndexado?: number;

    // Filter values (selected values)
    index_name?: string[];

    // Main data array with the schema provided
    data?: IndexStatus[];
}
