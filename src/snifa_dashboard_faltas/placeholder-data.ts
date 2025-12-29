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

  const gravedades: Array<'Leves' | 'Graves' | 'Gravísimas' | 'En blanco'> = ['Leves', 'Graves', 'Gravísimas', 'En blanco'];

  const data: FaltaDataRow[] = [];
  let idCounter = 1;

  // Generate data for years 2013-2024
  for (let year = 2013; year <= 2024; year++) {
    // More records in earlier years, fewer in recent years (matching the trend in the image)
    const numRecords = Math.floor(year < 2021 ? 400 : 200);

    for (let i = 0; i < numRecords; i++) {
      const regionIdx = Math.floor(Math.random() * regions.length);
      const catIdx = Math.floor(Math.random() * categoriasEconomicas.length);
      const subtipoIdx = Math.floor(Math.random() * subtiposCompromiso.length);
      const subcompIdx = Math.floor(Math.random() * subcomponentes.length);
      const gravedadIdx = Math.floor(Math.random() * gravedades.length);

      data.push({
        id_fdc: `FDC-${String(idCounter).padStart(6, '0')}`,
        region: regions[regionIdx],
        categoria_economica: categoriasEconomicas[catIdx],
        subcategoria_economica: `Subcategoría ${Math.floor(Math.random() * 20) + 1}`,
        clasificacion_gravedad: gravedades[gravedadIdx],
        ano: year,
        subtipo_compromiso: subtiposCompromiso[subtipoIdx],
        subcomponente: subcomponentes[subcompIdx],
        instrumento_infringido_norm: ['RCA', 'DIA', 'EIA', 'Normativa Sectorial'][Math.floor(Math.random() * 4)],
        etiqueta_legal: ['Ambiental', 'Sanitaria', 'Territorial'][Math.floor(Math.random() * 3)],
      });

      idCounter++;
    }
  }

  console.log(`Generated ${data.length} placeholder records`);
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
