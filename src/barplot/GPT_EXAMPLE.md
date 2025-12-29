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

  // Time series data for yearly chart
  timeSeriesData: [
    { period: "1992", year: 1992, region: "Metropolitana", revenue: 50, units: 20, profit: 15 },
    { period: "1994", year: 1994, region: "O'Higgins", revenue: 120, units: 45, profit: 35 },
    { period: "1996", year: 1996, region: "Biobío", revenue: 280, units: 95, profit: 85 }
    // ... more data points
  ],

  // Regional data for horizontal bar chart
  regionData: [
    { period: "Metropolitana", year: 2024, region: "Metropolitana", revenue: 4200, units: 1450, profit: 1260 },
    { period: "Los Lagos", year: 2024, region: "Los Lagos", revenue: 3800, units: 1300, profit: 1140 }
    // ... more regions
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
  timeSeriesData: [
    { period: "2024", year: 2024, region: "Nacional", revenue: 1200, units: 450, profit: 380 }
  ],
  regionData: [
    { period: "Metropolitana", year: 2024, region: "Metropolitana", revenue: 4200, units: 1450, profit: 1260 },
    { period: "Valparaíso", year: 2024, region: "Valparaíso", revenue: 2680, units: 915, profit: 804 }
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

## Chart Data Structure

### Time Series Data (DataRow)
Required fields:
- `period`: string (display label, e.g., "1992")
- `year`: number (e.g., 1992)
- `region`: string (e.g., "Metropolitana")
- `revenue`: number (used for 'proyectos' view)
- `units`: number (used for 'empleo' view)
- `profit`: number (optional)

### Region Data (DataRow)
Same structure as time series data, but typically one row per region.

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

  timeSeriesData: [
    { period: "2020", year: 2020, region: "Nacional", revenue: 680, units: 230, profit: 205 },
    { period: "2022", year: 2022, region: "Nacional", revenue: 420, units: 140, profit: 125 },
    { period: "2024", year: 2024, region: "Nacional", revenue: 380, units: 125, profit: 115 }
  ],

  regionData: [
    { period: "Metropolitana", year: 2024, region: "Metropolitana", revenue: 4200, units: 1450, profit: 1260 },
    { period: "Los Lagos", year: 2024, region: "Los Lagos", revenue: 3800, units: 1300, profit: 1140 },
    { period: "Valparaíso", year: 2024, region: "Valparaíso", revenue: 2680, units: 915, profit: 804 }
  ],

  candlestickData: [
    { period: "2020", year: 2020, open: 580, high: 720, low: 560, close: 680 },
    { period: "2022", year: 2022, open: 680, high: 700, low: 380, close: 420 },
    { period: "2024", year: 2024, open: 420, high: 450, low: 350, close: 380 }
  ]
};

// Render dashboard
window.renderDashboard(window.__GPT_DASHBOARD_DATA__);
```
