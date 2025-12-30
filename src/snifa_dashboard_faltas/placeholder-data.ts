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
    'Región del Libertador General Bernardo OHiggins',
    'Región de Antofagasta',
    'Región de Coquimbo',
    'Región de Ñuble',
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

  const subcategoriasEconomicas = [
    'Planta de celulosa y fabricación de papel',
    'Producción agrícola / cultivos',
    'Matadero / frigorífico',
    'Centro de comercialización de combustible',
    'Producción pecuaria',
    'Planta elaboradora de productos del mar',
    'Centro de cultivo de salmones',
    'Planta de tratamiento de aguas servidas',
    'Extracción de minerales metálicos',
    'Parque eólico',
    'Central hidroeléctrica',
    'Relleno sanitario',
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
    null, // Some can be null
  ];

  const subcomponentes = [
    'Ruido',
    'Residuos Liquidos',
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
    'Olores',
  ];

  const instrumentos = [
    'RCA',
    'PPDA',
    'NE:90/2000',
    'DIA',
    'EIA',
    'Otro',
    null, // Some can be null
  ];

  const tiposProceso = [
    'Fiscalización',
    'Denuncia',
    'Autodenuncia',
    'Inspección',
  ];

  const etiquetasTema = [
    'general',
    'ambiental',
    'sanitaria',
    null, // Some can be null
  ];

  const gravedades: Array<'Leves' | 'Graves' | 'Gravísimas'> = ['Leves', 'Graves', 'Gravísimas'];

  const data: FaltaDataRow[] = [];

  // Generate data with varying cantidad_casos
  for (let i = 0; i < 200; i++) {
    const regionIdx = Math.floor(Math.random() * regions.length);
    const catIdx = Math.floor(Math.random() * categoriasEconomicas.length);
    const subcatIdx = Math.floor(Math.random() * subcategoriasEconomicas.length);
    const subtipoIdx = Math.floor(Math.random() * subtiposCompromiso.length);
    const subcompIdx = Math.floor(Math.random() * subcomponentes.length);
    const gravedadIdx = Math.floor(Math.random() * gravedades.length);
    const instrumentoIdx = Math.floor(Math.random() * instrumentos.length);
    const tipoProcesoIdx = Math.floor(Math.random() * tiposProceso.length);
    const etiquetaIdx = Math.floor(Math.random() * etiquetasTema.length);

    // Random cantidad_casos between 1 and 10, with most being 1-3
    const cantidadCasos = Math.random() < 0.7 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 8) + 3;

    data.push({
      clasificacion_gravedad: gravedades[gravedadIdx],
      instrumento_infringido_norm: instrumentos[instrumentoIdx],
      etiqueta_tema_falta: etiquetasTema[etiquetaIdx],
      subcomponente: subcomponentes[subcompIdx],
      subtipo_compromiso: subtiposCompromiso[subtipoIdx],
      region: regions[regionIdx],
      tipo_proceso_sancion: tiposProceso[tipoProcesoIdx],
      categoria_economica: categoriasEconomicas[catIdx],
      subcategoria_economica: subcategoriasEconomicas[subcatIdx],
      cantidad_casos: cantidadCasos,
    });
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
    } else if (value === null) {
      values.add('Sin Información');
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
      region: getUniqueValues(data, 'region'),
      categoria_economica: getUniqueValues(data, 'categoria_economica'),
      subcategoria_economica: getUniqueValues(data, 'subcategoria_economica'),
    },
  };
};

// Export default placeholder data
export const PLACEHOLDER_DATA = generatePlaceholderOutput();
