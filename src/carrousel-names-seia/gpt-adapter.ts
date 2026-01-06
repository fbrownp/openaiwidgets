// GPT Data Adapter for SEIA Projects Carousel Widget

import { GPTSeiaProjectsOutput } from './gpt-types';
import { SeiaProject } from './types';

/**
 * Parse and validate GPT output
 * @param rawOutput - Raw output from GPT tool
 * @returns Validated array of SEIA projects
 */
export const parseGPTOutput = (rawOutput: unknown): SeiaProject[] => {
    try {
        const output = rawOutput as GPTSeiaProjectsOutput;

        if (!output || !Array.isArray(output.data)) {
            console.warn('Invalid GPT output structure, expected { data: [...] }');
            return [];
        }

        return output.data.map((project, index) => ({
            expediente_seia: project.expediente_seia ?? 0,
            nombre_proyecto: project.nombre_proyecto ?? `Proyecto ${index + 1}`,
            inversion: project.inversion ?? 0,
            region: project.region ?? 'No especificada',
            cosine_similarity: project.cosine_similarity ?? 0
        }));
    } catch (error) {
        console.error('Error parsing GPT output:', error);
        return [];
    }
};
