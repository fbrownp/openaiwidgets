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
    } else if (value === null) {
      values.add('Sin Información');
    }
  });
  return ['Todas', ...Array.from(values).sort()];
};

/**
 * Parse GPT output and convert to dashboard data
 * Accepts input in format: {data: [{...}, {...}, ...]}
 */
export const parseGPTOutput = (rawOutput: any): DashboardData => {
  try {
    // Check if rawOutput has data array
    if (rawOutput && Array.isArray(rawOutput.data) && rawOutput.data.length > 0) {
      const data: FaltaDataRow[] = rawOutput.data;

      // Calculate total casos from data
      const totalFaltas = data.reduce((sum, row) => sum + (row.cantidad_casos || 0), 0);

      // Generate filters dynamically from the data
      const availableFilters = {
        region: getUniqueValues(data, 'region'),
        categoria_economica: getUniqueValues(data, 'categoria_economica'),
        subcategoria_economica: getUniqueValues(data, 'subcategoria_economica'),
      };

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
 */
export const validateGPTOutput = (output: any): boolean => {
  if (!output || typeof output !== 'object') return false;

  // Check if data array exists and is valid
  if (!Array.isArray(output.data) || output.data.length === 0) return false;

  // Validate first data row has required fields
  const firstRow = output.data[0];
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
