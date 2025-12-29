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
export type ClasificacionGravedad = 'En blanco' | 'Graves' | 'Gravísimas' | 'Leves';

// Data row structure for faltas
export interface FaltaDataRow {
  id_fdc: string;
  region: string;
  categoria_economica: string;
  subcategoria_economica: string;
  clasificacion_gravedad: ClasificacionGravedad;
  ano: number;
  subtipo_compromiso: string;
  subcomponente: string;
  instrumento_infringido_norm: string;
  etiqueta_legal: string;
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
    instrumento_infringido_norm: string[];
    subtipo_compromiso: string[];
    categoria_economica: string[];
    subcategoria_economica: string[];
    region: string[];
    subcomponente: string[];
    etiqueta_legal: string[];
  };
}

// GPT integration types
export interface GPTFaltasOutput {
  view: 'faltas' | 'detalle';
  totalFaltas: number;
  data: FaltaDataRow[];
  filters: {
    instrumento_infringido_norm: string[];
    subtipo_compromiso: string[];
    categoria_economica: string[];
    subcategoria_economica: string[];
    region: string[];
    subcomponente: string[];
    etiqueta_legal: string[];
  };
}

// Parsed dashboard data
export interface DashboardData {
  totalFaltas: number;
  data: FaltaDataRow[];
  availableFilters: DashboardState['filters'];
}

// Severity colors matching the charts
export const GRAVEDAD_COLORS: Record<ClasificacionGravedad, string> = {
  'En blanco': '#6B9BD1',  // Blue
  'Graves': '#E74C3C',      // Red
  'Gravísimas': '#8B4789',  // Purple
  'Leves': '#27AE60',       // Green
};

// Severity order for stacking
export const GRAVEDAD_ORDER: ClasificacionGravedad[] = [
  'En blanco',
  'Graves',
  'Gravísimas',
  'Leves'
];
