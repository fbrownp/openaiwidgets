/**
 * Type definitions for GPT data integration
 */

export interface GPTDataRow {
    tipo_ingreso_seia: string;
    region: string;
    tipologia: string;
    etiqueta_inversion: string;
    expediente_presentacion: string | Date;
    tiempo_entre_icsara_adenda: number;
}

export interface GPTRawOutput {
    data?: GPTDataRow[];
    text?: string;
}

export interface GPTDashboardData {
    data: GPTDataRow[];
    filters: {
        tipo_ingreso_seia: string[];
        region: string[];
        tipologia: string[];
        etiqueta_inversion: string[];
    };
}
