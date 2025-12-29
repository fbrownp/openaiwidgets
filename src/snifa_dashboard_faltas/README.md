# SNIFA Dashboard Faltas

Dashboard component for visualizing attendance violations (faltas) data with severity classification.

## Overview

This dashboard provides two main views:
- **Faltas**: Overview of violations by region, economic category, and time series
- **Detalle**: Detailed breakdown by commitment subtype and subcomponents with filtering capabilities

## Features

### Views

#### Faltas View
- Horizontal stacked bar chart by region
- Horizontal stacked bar chart by economic category
- Time series line chart showing trends over years
- All charts show breakdown by severity classification (clasificacion_gravedad)

#### Detalle View
- Horizontal stacked bar chart by commitment subtype (subtipo_compromiso)
- Horizontal stacked bar chart by subcomponent (subcomponente)
- Advanced filtering capabilities for all data dimensions

### Filters (Detalle View)

The following filters are available in the Detalle view:
- `instrumento_infringido_norm`: Violated instrument type
- `subtipo_compromiso`: Commitment subtype
- `categoria_economica`: Economic category
- `subcategoria_economica`: Economic subcategory
- `region`: Geographic region
- `subcomponente`: Subcomponent
- `etiqueta_legal`: Legal label

### Widgets

Three summary widgets display:
1. **Total de Faltas**: Total count of violations
2. **Clasificación Más Común**: Most common severity classification
3. **Región Principal**: Region with most violations

### Severity Classifications

Data is classified by `clasificacion_gravedad` with three levels using a pink-to-purple color gradient:
- **Leves** (Minor) - Light pink (#FFB3D9)
- **Graves** (Serious) - Darker pink (#E63C77)
- **Gravísimas** (Very Serious) - Purple (#8B4789)

### Theme Support

- Light and dark themes
- Automatic theme-aware color adjustments
- Purple accent color scheme matching GPT app branding

## Structure

### Files

```
src/snifa_dashboard_faltas/
├── index.tsx                      # Entry point
├── Dashboard.tsx                  # Main dashboard component
├── types.ts                       # TypeScript type definitions
├── placeholder-data.ts            # Placeholder data generator
├── gpt-adapter.ts                 # GPT data parsing (ready for integration)
├── DropdownFilter.tsx            # Multi-select filter component
├── WidgetCard.tsx                # Summary widget component
├── HorizontalStackedBarplot.tsx  # Stacked bar chart component
├── LineChart.tsx                 # Time series line chart
└── README.md                     # This file
```

### Data Structure

The dashboard expects data in the following format:

```typescript
interface FaltaDataRow {
  id_fdc: string;
  region: string;
  categoria_economica: string;
  subcategoria_economica: string;
  clasificacion_gravedad: 'En blanco' | 'Graves' | 'Gravísimas' | 'Leves';
  ano: number;
  subtipo_compromiso: string;
  subcomponente: string;
  instrumento_infringido_norm: string;
  etiqueta_legal: string;
}
```

## GPT Integration (Future)

The component is structured to integrate with GPT apps:

1. **Current**: Uses placeholder data from `placeholder-data.ts`
2. **Future**: Will parse GPT output via `gpt-adapter.ts`

The `parseGPTOutput` function in `gpt-adapter.ts` is ready to handle real GPT data when available.

### Expected GPT Output Format

```typescript
{
  view: 'faltas' | 'detalle',
  totalFaltas: number,
  data: FaltaDataRow[],
  filters: {
    instrumento_infringido_norm: string[],
    subtipo_compromiso: string[],
    categoria_economica: string[],
    subcategoria_economica: string[],
    region: string[],
    subcomponente: string[],
    etiqueta_legal: string[]
  }
}
```

## Usage

### Development

```bash
npm run dev
```

Access the dashboard at: `http://localhost:4444/snifa_dashboard_faltas.html`

### Production Build

```bash
npm run build
```

The built assets will be in the `assets/` directory.

## Customization

### Adding New Charts

1. Create a new chart component in the component folder
2. Import and add to the appropriate view in `Dashboard.tsx`
3. Create aggregation logic in the `useMemo` hooks

### Adding New Filters

1. Add the field to `DashboardState['filters']` in `types.ts`
2. Add the filter configuration in `buildFilterConfigs()` in `Dashboard.tsx`
3. The `filteredData` logic will automatically apply the new filter

### Changing Theme Colors

Modify the `getThemeColors()` function in `Dashboard.tsx` to adjust colors for light and dark themes.

## Notes

- Currently uses placeholder data for demonstration
- Structure preserves compatibility with GPT apps integration
- All filters use "Todas" (All) as the default/unfiltered option
- Charts automatically scale based on data ranges
- Interactive tooltips on all chart elements
