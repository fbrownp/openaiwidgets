# ChatGPT Integration Guide

This document explains how to use the barplot dashboard as a ChatGPT app.

## How It Works

The dashboard is now designed to accept data from ChatGPT through a structured interface. When GPT outputs data in the correct format, it will be automatically parsed and displayed in the dashboard.

## Data Format

ChatGPT should output data in JSON format matching the `GPTRawOutput` interface:

```javascript
window.__GPT_DASHBOARD_DATA__ = {
  // Which view to show: 'proyectos' or 'empleo'
  view: 'proyectos',

  // Widget card values
  totalProjects: 24246,
  totalJobs: 15830,
  sumInvestment: "MMU$1.041.944",
  sumJobs: "156.420",
  topSector: "Industria",
  topSectorPercentage: "22.7",

  // Filter selections (all optional)
  tipo_ingreso_seia: ["DIA", "EIA"],
  tipologia: ["a1", "ñ7", "i5"],
  tipologia_letra: ["k", "b", "t"],
  region: ["Región Metropolitana de Santiago", "Región de Valparaíso"],
  estado_proyecto: ["Aprobado", "En Calificación"],
  etiqueta_inversion: ["Grandes (≥ 100)", "Medianos (≥ 10 - 100)"],
  ano_presentacion: ["2020", "2021", "2022", "2023", "2024"],

  // Unified data array - single source for all three charts
  // Each row matches the schema: ano_presentacion, tipo_ingreso_seia, tipologia_letra, region, estado_proyecto, cantidad_proyectos, inversion_total
  data: [
    {
      ano_presentacion: 2022,
      tipo_ingreso_seia: "EIA",
      tipologia_letra: "c",
      region: "Región del Biobío",
      estado_proyecto: "No calificado",
      cantidad_proyectos: 1,
      inversion_total: 420.0,
      // Optional fields
      tipologia: "c1",
      etiqueta_inversion: "Pequeños (0 - 10)"
    },
    {
      ano_presentacion: 2023,
      tipo_ingreso_seia: "DIA",
      tipologia_letra: "a",
      region: "Región Metropolitana de Santiago",
      estado_proyecto: "Aprobado",
      cantidad_proyectos: 5,
      inversion_total: 1500.0,
      tipologia: "a1",
      etiqueta_inversion: "Medianos (≥ 10 - 100)"
    }
    // ... more data points
  ],

  // Candlestick data for volatility chart
  candlestickData: [
    { period: "1992", year: 1992, open: 40, high: 65, low: 35, close: 50 },
    { period: "1994", year: 1994, open: 50, high: 140, low: 48, close: 120 }
    // ... more data points
  ]
};
```

## Example ChatGPT Prompts

### Example 1: Simple Update

**User**: "Show me projects data for 2024"

**GPT Response**:
```javascript
window.renderDashboard({
  view: 'proyectos',
  totalProjects: 24246,
  sumInvestment: "MMU$1.041.944",
  topSector: "Industria",
  topSectorPercentage: "22.7",
  data: [
    { ano_presentacion: 2024, tipo_ingreso_seia: "DIA", tipologia_letra: "a", region: "Región Metropolitana de Santiago", estado_proyecto: "Aprobado", cantidad_proyectos: 450, inversion_total: 1200 },
    { ano_presentacion: 2024, tipo_ingreso_seia: "EIA", tipologia_letra: "c", region: "Región de Valparaíso", estado_proyecto: "En Calificación", cantidad_proyectos: 350, inversion_total: 980 }
  ]
});
```

### Example 2: Filter by Estado

**User**: "Show only projects that are 'Aprobado' or 'En Calificación'"

**GPT Response**:
```javascript
window.updateDashboard({
  estado_proyecto: ["Aprobado", "En Calificación"],
  totalProjects: 8420,
  sumInvestment: "MMU$350.500"
});
```

### Example 3: Employment View

**User**: "Switch to employment view"

**GPT Response**:
```javascript
window.updateDashboard({
  view: 'empleo',
  totalJobs: 15830,
  sumJobs: "156.420"
});
```

## Widget Values Format

When GPT outputs numeric values for widgets, use these exact formats:

- **Total Projects/Jobs**: Simple number (e.g., `24246`)
- **Sum of Investment**: String with format `"MMU$X.XXX.XXX"` (e.g., `"MMU$1.041.944"`)
- **Sum of Jobs**: String with format `"XXX.XXX"` (e.g., `"156.420"`)
- **Top Sector**: String (e.g., `"Industria"`)
- **Top Sector Percentage**: String without % sign (e.g., `"22.7"`)

## Filter Values

### Tipo de Ingreso (tipo_ingreso_seia)
- `"DIA"`: DIA
- `"EIA"`: EIA

### Tipología (tipologia)
- Codes like: `"a1"`, `"ñ7"`, `"i5"`, `"m4"`, `"k1"`, etc.
- See full list in DEFAULT_FILTER_OPTIONS

### Letra de tipología (tipologia_letra)
- Letters: `"k"`, `"b"`, `"t"`, `"l"`, `"s"`, `"u"`, `"ñ"`, `"a"`, `"h"`, `"j"`, `"n"`, `"p"`, `"f"`, `"c"`, `"e"`, `"i"`, `"g"`, `"d"`, `"r"`, `"m"`, `"o"`

### Región (region)
- `"Región Metropolitana de Santiago"`
- `"Región de Valparaíso"`
- `"Región del Biobío"`
- `"Región de La Araucanía"`
- And other Chilean regions

### Estado (estado_proyecto)
- `"Aprobado"`: Aprobado
- `"En Calificación"`: En Calificación
- `"En Admisión"`: En Admisión
- `"Rechazado"`: Rechazado
- `"Desistido"`: Desistido
- `"Abandonado"`: Abandonado
- `"Caducado"`: Caducado
- `"Revocado"`: Revocado
- `"Renuncia RCA"`: Renuncia RCA
- `"No Admitido a Tramitación"`: No Admitido a Tramitación
- `"No calificado"`: No calificado

### Nivel de Inversión (etiqueta_inversion)
- `"Grandes (≥ 100)"`: Grandes (≥ 100)
- `"Medianos (≥ 10 - 100)"`: Medianos (≥ 10 - 100)
- `"Pequeños (0 - 10)"`: Pequeños (0 - 10)

### Año de Presentación (ano_presentacion)
- `"2014"`: 2014
- `"2015"`: 2015
- `"2016"`: 2016
- `"2017"`: 2017
- `"2018"`: 2018
- `"2019"`: 2019
- `"2020"`: 2020
- `"2021"`: 2021
- `"2022"`: 2022
- `"2023"`: 2023
- `"2024"`: 2024
- `"2025"`: 2025

## Data Structure

### Unified Data Array
The dashboard now uses a single unified data array that feeds all three charts (time series, region, and candlestick). This matches your database schema:

Required fields:
- `ano_presentacion`: number (year of presentation, e.g., 2022)
- `tipo_ingreso_seia`: string (type of SEIA entry: "DIA" or "EIA")
- `tipologia_letra`: string (typology letter, e.g., "a", "c", "ñ")
- `region`: string (Chilean region, e.g., "Región del Biobío")
- `estado_proyecto`: string (project state, e.g., "Aprobado", "No calificado")
- `cantidad_proyectos`: number (count of projects, unsigned integer)
- `inversion_total`: number (total investment, float)

Optional fields:
- `tipologia`: string (full typology code, e.g., "a1", "c1")
- `etiqueta_inversion`: string (investment label: "Grandes (≥ 100)", "Medianos (≥ 10 - 100)", "Pequeños (0 - 10)")

### How Charts are Generated

The dashboard automatically transforms the unified data array into three different views:

1. **Time Series Chart**: Aggregates data by `ano_presentacion` (year), summing `cantidad_proyectos` and `inversion_total`
2. **Region Chart**: Aggregates data by `region`, summing `cantidad_proyectos` and `inversion_total`
3. **Candlestick Chart**: Groups by year and calculates OHLC (Open/High/Low/Close) from `inversion_total` values

**Filtering**: All charts show filtered data based on user filter selections. Filters use AND logic.

### Candlestick Data (CandlestickDataRow)
Required fields:
- `period`: string (e.g., "1992")
- `year`: number (e.g., 1992)
- `open`: number
- `high`: number
- `low`: number
- `close`: number

## JavaScript API

The following functions are available globally:

### `window.renderDashboard(gptData)`
Renders the dashboard with the provided GPT data. Replaces any existing dashboard.

```javascript
window.renderDashboard({
  view: 'proyectos',
  totalProjects: 24246,
  // ... other fields
});
```

### `window.updateDashboard(partialData)`
Updates the existing dashboard with partial data. Merges with existing data.

```javascript
window.updateDashboard({
  totalProjects: 30000,
  topSector: "Tecnología"
});
```

## Integration Steps

1. Include the ChatGPT entry point script in your HTML:
   ```html
   <div id="barplot-root"></div>
   <script src="chatgpt-entry.js"></script>
   ```

2. GPT outputs data by setting `window.__GPT_DASHBOARD_DATA__` or calling `window.renderDashboard()`

3. Dashboard automatically updates when new data is provided

## Example Complete GPT Output

```javascript
// Set data globally
window.__GPT_DASHBOARD_DATA__ = {
  view: 'proyectos',
  totalProjects: 24246,
  totalJobs: 15830,
  sumInvestment: "MMU$1.041.944",
  sumJobs: "156.420",
  topSector: "Industria",
  topSectorPercentage: "22.7",

  tipo_ingreso_seia: ["DIA", "EIA"],
  estado_proyecto: ["Aprobado", "En Calificación"],
  ano_presentacion: ["2020", "2021", "2022", "2023", "2024"],

  data: [
    { ano_presentacion: 2020, tipo_ingreso_seia: "DIA", tipologia_letra: "a", region: "Región Metropolitana de Santiago", estado_proyecto: "Aprobado", cantidad_proyectos: 230, inversion_total: 680 },
    { ano_presentacion: 2020, tipo_ingreso_seia: "EIA", tipologia_letra: "c", region: "Región de Valparaíso", estado_proyecto: "En Calificación", cantidad_proyectos: 150, inversion_total: 420 },
    { ano_presentacion: 2022, tipo_ingreso_seia: "DIA", tipologia_letra: "b", region: "Región del Biobío", estado_proyecto: "Aprobado", cantidad_proyectos: 140, inversion_total: 380 },
    { ano_presentacion: 2024, tipo_ingreso_seia: "EIA", tipologia_letra: "a", region: "Región de Los Lagos", estado_proyecto: "Aprobado", cantidad_proyectos: 125, inversion_total: 350 }
  ]
};

// Render dashboard
window.renderDashboard(window.__GPT_DASHBOARD_DATA__);
```
