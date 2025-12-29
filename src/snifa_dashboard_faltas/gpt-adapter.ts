/**
 * GPT Adapter for SNIFA Dashboard Faltas
 * Handles parsing and transforming GPT output into dashboard data
 * For now, uses placeholder data but maintains structure for future GPT integration
 */

import { GPTFaltasOutput, DashboardData, FaltaDataRow } from './types';
import { PLACEHOLDER_DATA } from './placeholder-data';

/**
 * Parse GPT output and convert to dashboard data
 * Currently returns placeholder data but structure is ready for GPT integration
 */
export const parseGPTOutput = (rawOutput: any): DashboardData => {
  try {
    // TODO: In the future, this will parse actual GPT output
    // For now, we use placeholder data regardless of input
    const gptData: GPTFaltasOutput = PLACEHOLDER_DATA;

    return {
      totalFaltas: gptData.totalFaltas,
      data: gptData.data,
      availableFilters: gptData.filters,
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
export const validateGPTOutput = (output: any): output is GPTFaltasOutput => {
  if (!output || typeof output !== 'object') return false;

  // Check required fields
  if (!output.view || !['faltas', 'detalle'].includes(output.view)) return false;
  if (typeof output.totalFaltas !== 'number') return false;
  if (!Array.isArray(output.data)) return false;
  if (!output.filters || typeof output.filters !== 'object') return false;

  return true;
};

/**
 * Get initial dashboard data
 * This function will be called when the dashboard first loads
 */
export const getInitialData = (toolOutput?: any): DashboardData => {
  // In the future, check toolOutput for GPT data
  // For now, always return placeholder data
  return parseGPTOutput(toolOutput);
};
