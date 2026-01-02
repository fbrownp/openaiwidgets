// GPT Integration Types for Brechas Widget

import { AnalisisBrechasPayload } from './types';

/**
 * Raw output from GPT/OpenAI tool
 */
export type GPTRawOutput = {
    data?: unknown;
    [key: string]: unknown;
};

/**
 * Structured data for Brechas Widget
 */
export interface GPTBrechasData {
    data: AnalisisBrechasPayload;
}
