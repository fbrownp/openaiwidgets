# Timelines SEIA Widget

A box-plot visualization component for analyzing SEIA timeline data, showing the distribution of time between ICSARA and Adenda across different years.

## Features

- **Box Plot Visualization**: Statistical box plots using ApexCharts showing quartiles, median, and outliers
- **Multi-Filter Support**: Filter data by:
  - Tipo Ingreso SEIA (DIA, EIA)
  - Región
  - Tipología
  - Etiqueta Inversión
- **Interactive Charts**: Zoom, pan, and download capabilities
- **Dark/Light Theme**: Automatic theme detection from OpenAI environment
- **Responsive Design**: Adapts to different screen sizes
- **Data Summary Cards**: Quick overview of total records, average days, and years analyzed

## Data Schema

The component expects data in the following format:

```typescript
{
  data: [
    {
      tipo_ingreso_seia: 'DIA',
      region: 'Interregional',
      tipologia: 'c',
      etiqueta_inversion: 'Grandes (≥ 100)',
      expediente_presentacion: '2013-01-01',  // Date string or Date object
      tiempo_entre_icsara_adenda: 384.0       // Number (days)
    },
    // ... more records
  ]
}
```

## How It Works

1. **Data Processing**:
   - Groups data by year from `expediente_presentacion`
   - Calculates statistical measures (min, Q1, median, Q3, max) for `tiempo_entre_icsara_adenda`
   - Identifies outliers using IQR method (1.5 × IQR)

2. **Filtering**:
   - Applies selected filters dynamically
   - Updates box plot based on filtered data
   - Recalculates statistics for each year

3. **Visualization**:
   - X-axis: Year from expediente_presentacion
   - Y-axis: tiempo_entre_icsara_adenda (days)
   - Box plot shows distribution with whiskers, box (Q1-Q3), and median line
   - Outliers displayed as individual points

## GPT Integration

The component includes a GPT adapter (`gpt-adapter.ts`) that:
- Parses multiple GPT output formats
- Validates data structure
- Extracts filter options dynamically from data
- Falls back to placeholder data if parsing fails

## Theme Integration

Follows the unified theme system from `widget_styles/theme.ts`:
- Purple color scheme for primary elements
- Automatic dark/light mode support
- Consistent styling across all components

## Files

- `Dashboard.tsx` - Main component with chart and filters
- `DropdownFilter.tsx` - Multi-select filter component
- `gpt-adapter.ts` - GPT data parsing and transformation
- `types.ts` - TypeScript type definitions
- `gpt-types.ts` - GPT-specific type definitions
- `placeholder-data.ts` - Sample data for testing
- `index.tsx` - Entry point

## Dependencies

- `react-apexcharts` - Chart library
- `apexcharts` - Core charting library
- `react` - UI framework
- `react-dom` - DOM rendering

## Usage Example

```typescript
// GPT provides data in this format:
{
  data: [
    {
      tipo_ingreso_seia: 'DIA',
      region: 'Metropolitana',
      tipologia: 'a',
      etiqueta_inversion: 'Medianos (10 - 100)',
      expediente_presentacion: '2020-01-01',
      tiempo_entre_icsara_adenda: 250
    }
    // ... more records
  ]
}

// Component automatically:
// 1. Parses the data
// 2. Builds filter options
// 3. Displays box plot by year
// 4. Allows filtering by available dimensions
```

## Color Scheme

The component uses the purple gradient from the barplot elements:
- Primary: `#8b5cf6`
- Dark: `#7c3aed`
- Light: `#a78bfa`

This ensures visual consistency across all SEIA widgets.
