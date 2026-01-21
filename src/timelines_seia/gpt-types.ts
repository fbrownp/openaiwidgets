/**
 * Type definitions for GPT data integration
 */

export interface GPTDataRow {
    tipo_ingreso_seia: string;
    region: string;
    tipologia_letra: string;
    tipologia: string;
    etiqueta_inversion: string;
    expediente_presentacion: string | Date;
    // Entre Eventos fields
    tiempo_entre_presentacion_icsara: number | null;
    tiempo_entre_icsara_adenda: number | null;
    tiempo_entre_adenda_icsara_complementario: number | null;
    tiempo_entre_icsara_complementario_adenda_complementaria: number | null;
    tiempo_entre_adenda_complementaria_ice: number | null;
    tiempo_entre_ice_rca: number | null;
    // Total (Hasta) fields
    tiempo_hasta_presentacion_icsara: number | null;
    tiempo_hasta_icsara_adenda: number | null;
    tiempo_hasta_adenda_icsara_complementario: number | null;
    tiempo_hasta_icsara_complementario_adenda_complementaria: number | null;
    tiempo_hasta_adenda_complementaria_ice: number | null;
    tiempo_hasta_ice_rca: number | null;
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
        tipologia: string[];
        etiqueta_inversion: string[];
    };
}
