/**
 * TypeScript types for SNIFA Dashboard Faltas
 * Defines data structures for attendance/violations tracking
 */

// Theme colors for light and dark modes
export interface ThemeColors {
  background: string;
  cardBackground: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  buttonText: string;
  buttonBackground: string;
  buttonHover: string;
  buttonActiveBg: string;
  buttonActiveText: string;
  purple: string;
  purpleDark: string;
  purpleLight: string;
  border: string;
  borderLight: string;
  gridLine: string;
  dropdownBg: string;
  dropdownBorder: string;
  dropdownHover: string;
  dropdownSelected: string;
}

// Classification severity levels
export type ClasificacionGravedad = 'Leves' | 'Graves' | 'Gravísimas';

// Data row structure for faltas
export interface FaltaDataRow {
  clasificacion_gravedad: ClasificacionGravedad;
  instrumento_infringido_norm: string | null;
  etiqueta_tema_falta: string | null;
  subcomponente: string | null;
  subtipo_compromiso: string | null;
  region: string | null;
  tipo_proceso_sancion: string | null;
  categoria_economica: string | null;
  subcategoria_economica: string | null;
  cantidad_casos: number;
}

// Aggregated data for charts
export interface AggregatedData {
  category: string;
  count: number;
  byGravedad: {
    [key in ClasificacionGravedad]?: number;
  };
}

// Time series data point
export interface TimeSeriesData {
  year: number;
  byGravedad: {
    [key in ClasificacionGravedad]?: number;
  };
}

// Filter configuration
export interface FilterConfig {
  label: string;
  options: string[];
  selectedValues: string[];
  multiSelect: boolean;
}

// Dashboard state
export interface DashboardState {
  activeView: 'faltas' | 'detalle';
  theme: 'light' | 'dark';
  filters: {
    region: string[];
    categoria_economica: string[];
    subcategoria_economica: string[];
  };
}

// GPT integration types
export interface GPTFaltasOutput {
  view: 'faltas' | 'detalle';
  totalFaltas: number;
  data: FaltaDataRow[];
  filters: {
    region: string[];
    categoria_economica: string[];
    subcategoria_economica: string[];
  };
}

// Parsed dashboard data
export interface DashboardData {
  totalFaltas: number;
  data: FaltaDataRow[];
  availableFilters: DashboardState['filters'];
}

// Severity colors matching the charts - White-pink to Pink to Purple-white gradient
export const GRAVEDAD_COLORS: Record<ClasificacionGravedad, string> = {
  'Leves': '#FFE5F0',       // White-pink (very light pink)
  'Graves': '#FF69B4',      // Hot pink
  'Gravísimas': '#D8BFD8',  // Thistle (purple-white)
};

// Severity order for stacking (light to dark)
export const GRAVEDAD_ORDER: ClasificacionGravedad[] = [
  'Leves',
  'Graves',
  'Gravísimas'
];
