/**
 * Placeholder data for SNIFA Dashboard Faltas
 * This data simulates the structure that will come from GPT apps
 */

import { FaltaDataRow, GPTFaltasOutput } from './types';

// Generate placeholder data rows
const generatePlaceholderData = (): FaltaDataRow[] => {
  const regions = [
    'Región Metropolitana de Santiago',
    'Región de Los Lagos',
    'Región de Aysén',
    'Región de Valparaíso',
    'Región de La Araucanía',
    'Región del Maule',
    'Región de Atacama',
    'Región del Biobío',
    'Región de Magallanes',
    'Región del Libertador',
    'Región de Antofagasta',
    'Región de Coquimbo',
  ];

  const categoriasEconomicas = [
    'Equipamiento',
    'Agroindustrias',
    'Pesca y Acuicultura',
    'Minería',
    'Saneamiento Ambiental',
    'Vivienda e Inmobiliaria',
    'Instalación fabril',
    'Energía',
    'Forestal',
    'Infraestructura Portuaria',
    'Infraestructura de Transporte',
  ];

  const subtiposCompromiso = [
    'Seguimiento',
    'Descripción del Proyecto',
    'Mitigacion',
    'Otra Normativa Aplicable',
    'Contingencias y emergencias',
    'Compensacion',
    'PAS',
    'Provisional',
    'Cierre',
  ];

  const subcomponentes = [
    'Ruido',
    'Residuos Líquidos',
    'Calidad del Aire',
    'Aguas Superficiales',
    'Medidas Generales',
    'Características y/o Elementos del Medio Ambiente',
    'Residuos Sólidos',
    'Flora y Vegetación',
    'Aguas Subterraneas',
    'Residuos Agroalimentarios',
    'Residuos Acuícolas',
    'Residuos Peligrosos',
  ];

  const gravedades = ['Leves', 'Graves', 'Gravísimas', 'En blanco'];

  const data: FaltaDataRow[] = [];
  let idCounter = 1;

  // Generate data for years 2013-2024
  for (let year = 2013; year <= 2024; year++) {
    const numRecords = year < 2021 ? 300 + Math.random() * 200 : 150 + Math.random() * 100;

    for (let i = 0; i < numRecords; i++) {
      data.push({
        id_fdc: `FDC-${idCounter++}`,
        region: regions[Math.floor(Math.random() * regions.length)],
        categoria_economica: categoriasEconomicas[Math.floor(Math.random() * categoriasEconomicas.length)],
        subcategoria_economica: `Sub-${Math.floor(Math.random() * 20)}`,
        clasificacion_gravedad: gravedades[Math.floor(Math.random() * gravedades.length)] as any,
        ano: year,
        subtipo_compromiso: subtiposCompromiso[Math.floor(Math.random() * subtiposCompromiso.length)],
        subcomponente: subcomponentes[Math.floor(Math.random() * subcomponentes.length)],
        instrumento_infringido_norm: ['Todas', 'Tipo A', 'Tipo B', 'Tipo C'][Math.floor(Math.random() * 4)],
        etiqueta_legal: ['Todas', 'Legal A', 'Legal B'][Math.floor(Math.random() * 3)],
      });
    }
  }

  return data;
};

// Get unique values for filters
const getUniqueValues = (data: FaltaDataRow[], field: keyof FaltaDataRow): string[] => {
  const values = new Set<string>();
  data.forEach(row => {
    const value = row[field];
    if (typeof value === 'string') {
      values.add(value);
    }
  });
  return ['Todas', ...Array.from(values).sort()];
};

// Generate complete placeholder output
export const generatePlaceholderOutput = (): GPTFaltasOutput => {
  const data = generatePlaceholderData();

  return {
    view: 'faltas',
    totalFaltas: data.length,
    data,
    filters: {
      instrumento_infringido_norm: getUniqueValues(data, 'instrumento_infringido_norm'),
      subtipo_compromiso: getUniqueValues(data, 'subtipo_compromiso'),
      categoria_economica: getUniqueValues(data, 'categoria_economica'),
      subcategoria_economica: getUniqueValues(data, 'subcategoria_economica'),
      region: getUniqueValues(data, 'region'),
      subcomponente: getUniqueValues(data, 'subcomponente'),
      etiqueta_legal: getUniqueValues(data, 'etiqueta_legal'),
    },
  };
};

// Export default placeholder data
export const PLACEHOLDER_DATA = generatePlaceholderOutput();
