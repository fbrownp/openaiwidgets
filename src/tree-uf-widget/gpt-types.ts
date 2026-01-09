/**
 * GPT Integration Types for Tree UF Widget
 * Defines the expected structure of data from GPT output
 */

import { EdgeData } from './types';

/**
 * GPT Output format - array of edge data
 */
export type GPTOutput = EdgeData[];

/**
 * GPT Raw Output format - object with data field
 * This is the format received from GPT
 */
export interface GPTRawOutput {
    data: EdgeData[];
}
