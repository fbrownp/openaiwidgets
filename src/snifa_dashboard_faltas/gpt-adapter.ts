/**
 * GPT Adapter for SNIFA Dashboard Faltas
 * Handles parsing and transforming GPT output into dashboard data
 * Accepts data in format: {data: [{...}, {...}, ...]}
 */

import { GPTFaltasOutput, DashboardData, FaltaDataRow } from './types';
import { PLACEHOLDER_DATA } from './placeholder-data';

/**
 * Extract unique values from data for a specific field
 */
const getUniqueValues = (data: FaltaDataRow[], field: keyof FaltaDataRow): string[] => {
  const values = new Set<string>();
  data.forEach(row => {
    const value = row[field];
    if (typeof value === 'string') {
      values.add(value);
    } else if (typeof value === 'number') {
      values.add(String(value));
    } else if (value === null) {
      values.add('Sin Información');
    }
  });
  return Array.from(values).sort();
};

/**
 * Parse GPT output and convert to dashboard data
 * Accepts input in formats:
 * - {text: "...", data: [{...}]} (Polars DataFrame format)
 * - {data: [{...}]}
 * - [{...}]
 */
export const parseGPTOutput = (rawOutput: any): DashboardData => {
  try {
    let data: FaltaDataRow[] = [];

    console.log('Raw output received:', {
      type: typeof rawOutput,
      isArray: Array.isArray(rawOutput),
      hasData: rawOutput?.data !== undefined,
      hasText: rawOutput?.text !== undefined,
      keys: rawOutput ? Object.keys(rawOutput) : []
    });

    // Handle multiple input formats
    if (Array.isArray(rawOutput)) {
      // Direct array format: [{...}, {...}]
      data = rawOutput;
      console.log('Detected direct array format');
    } else if (rawOutput && Array.isArray(rawOutput.data)) {
      // Object with data property: {data: [...]} or {text: "...", data: [...]}
      data = rawOutput.data;
      console.log('Detected object format with data property');
      if (rawOutput.text) {
        console.log('Text message:', rawOutput.text);
      }
    }

    if (data.length > 0) {
      console.log('Parsing GPT output:', {
        totalRows: data.length,
        firstRow: data[0],
        sampleCantidadCasos: data.slice(0, 5).map(r => r.cantidad_casos)
      });

      // Calculate total casos from data
      const totalFaltas = data.reduce((sum, row) => sum + (row.cantidad_casos || 0), 0);

      // Generate filters dynamically from the data
      const availableFilters = {
        region: getUniqueValues(data, 'region'),
        categoria_economica: getUniqueValues(data, 'categoria_economica'),
        subcategoria_economica: getUniqueValues(data, 'subcategoria_economica'),
        ano_inicio: getUniqueValues(data, 'ano_inicio'),
      };

      console.log('Generated filters:', {
        regions: availableFilters.region.length,
        categorias: availableFilters.categoria_economica.length,
        subcategorias: availableFilters.subcategoria_economica.length,
        anosInicio: availableFilters.ano_inicio.length,
        totalCalculated: totalFaltas
      });

      return {
        totalFaltas,
        data,
        availableFilters,
      };
    }

    // Fallback to placeholder data if input is invalid
    console.log('Invalid or empty data, using placeholder data');
    return {
      totalFaltas: PLACEHOLDER_DATA.totalFaltas,
      data: PLACEHOLDER_DATA.data,
      availableFilters: PLACEHOLDER_DATA.filters,
    };
  } catch (error) {
    console.error('Error parsing GPT output:', error);
    // Fallback to placeholder data on error
    return {
      totalFaltas: PLACEHOLDER_DATA.totalFaltas,
      data: PLACEHOLDER_DATA.data,
      availableFilters: PLACEHOLDER_DATA.filters,
    };
  }
};

/**
 * Validate GPT output structure
 * This will be used when integrating with actual GPT apps
 * Accepts both {data: [...]} and [...] formats
 */
export const validateGPTOutput = (output: any): boolean => {
  if (!output) return false;

  let dataArray: any[] = [];

  // Handle both array and object formats
  if (Array.isArray(output)) {
    dataArray = output;
  } else if (typeof output === 'object' && Array.isArray(output.data)) {
    dataArray = output.data;
  }

  // Check if data array exists and is valid
  if (dataArray.length === 0) return false;

  // Validate first data row has required fields
  const firstRow = dataArray[0];
  if (!firstRow.clasificacion_gravedad || typeof firstRow.cantidad_casos !== 'number') {
    return false;
  }

  return true;
};

/**
 * Get initial dashboard data
 * This function will be called when the dashboard first loads
 */
export const getInitialData = (toolOutput?: any): DashboardData => {
  // Check if toolOutput is provided and valid
  if (toolOutput && validateGPTOutput(toolOutput)) {
    return parseGPTOutput(toolOutput);
  }

  // Otherwise return placeholder data
  return parseGPTOutput(null);
};
