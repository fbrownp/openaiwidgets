import { GPTDashboardData, GPTRawOutput } from './gpt-types';
import { FilterConfig, FilterOption } from './types';

/**
 * Default filter options for index names
 */
const DEFAULT_INDEX_OPTIONS: FilterOption[] = [
    { label: "leyes", value: "leyes" },
    { label: "cmf-memorias", value: "cmf-memorias" },
    { label: "seia", value: "seia" },
    { label: "seia-consulta-indigena", value: "seia-consulta-indigena" },
    { label: "pertinencia", value: "pertinencia" },
    { label: "guias", value: "guias" },
    { label: "snifa", value: "snifa" },
    { label: "denuncias-archivadas", value: "denuncias-archivadas" },
    { label: "snifa-requerimientos", value: "snifa-requerimientos" },
    { label: "snifa-fiscalizaciones", value: "snifa-fiscalizaciones" },
    { label: "sentencia", value: "sentencia" },
    { label: "seia-recursos", value: "seia-recursos" },
    { label: "snifa-medidas-provisionales", value: "snifa-medidas-provisionales" }
];

/**
 * Converts GPT raw output into the format expected by Dashboard
 * Now accepts a 'data' field directly from GPT
 */
export function parseGPTOutput(gptOutput: GPTRawOutput): GPTDashboardData {
    console.log('Parsing GPT output:', gptOutput);

    // Extract data array
    const data = gptOutput.data || [];

    // Calculate total indexado from data if not provided
    const totalIndexado = gptOutput.totalIndexado !== undefined
        ? gptOutput.totalIndexado
        : data.reduce((sum, item) => sum + (item.indexado || 0), 0);

    // Parse widgets data
    const widgets = {
        totalIndexado
    };

    // Parse filter values
    const filters = {
        index_name: gptOutput.index_name || []
    };

    const result: GPTDashboardData = {
        widgets,
        filters,
        data
    };

    console.log('Parsed dashboard data:', result);

    return result;
}

/**
 * Extract unique index names from data
 */
function extractUniqueIndexNames(data: Array<any>): FilterOption[] {
    const uniqueValues = new Set<string>();

    data.forEach(row => {
        const value = row.index_name;
        if (value !== undefined && value !== null && value !== '') {
            uniqueValues.add(String(value));
        }
    });

    // Convert to FilterOption array and sort alphabetically
    return Array.from(uniqueValues)
        .sort((a, b) => a.localeCompare(b))
        .map(value => ({ label: value, value }));
}

/**
 * Converts GPT dashboard data into FilterConfig array
 * Dynamically builds filters based on actual data values or uses defaults
 */
export function buildFilterConfigs(gptData: GPTDashboardData): FilterConfig[] {
    const filters: FilterConfig[] = [];
    const data = gptData.data || [];

    // Extract options from data or use defaults
    let options: FilterOption[];
    if (data.length > 0) {
        options = extractUniqueIndexNames(data);
    } else {
        options = DEFAULT_INDEX_OPTIONS;
    }

    // Only add filter if there are options available
    if (options.length > 0) {
        filters.push({
            label: "Index Name",
            options,
            selectedValues: gptData.filters.index_name.filter(v =>
                options.some(opt => opt.value === v)
            ),
            multiSelect: true
        });
    }

    return filters;
}
