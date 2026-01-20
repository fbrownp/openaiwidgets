/**
 * Type definitions for GPT data integration
 */

export interface GPTDataRow {
    tipo_ingreso_seia: string;
    region: string;
    tipologia_letra: string;
    etiqueta_inversion: string;
    expediente_presentacion: string | Date;
    tiempo_entre_icsara_adenda: number | null;
    tiempo_entre_icsara_complementario_adenda_complementaria?: number | null;
    [key: string]: string | Date | number | null | undefined; // Allow dynamic episode fields
}

export interface GPTRawOutput {
    data?: GPTDataRow[];
    episodes?: string[];
    text?: string;
}

export interface GPTDashboardData {
    data: GPTDataRow[];
    episodes: string[];
    filters: {
        tipo_ingreso_seia: string[];
        region: string[];
        tipologia_letra: string[];
        etiqueta_inversion: string[];
    };
}
