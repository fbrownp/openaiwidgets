# ChatGPT Dashboard Integration

This dashboard has been converted to work as a ChatGPT app, where data can be dynamically provided by GPT and displayed in real-time.

## 📋 Overview

The barplot dashboard now accepts data from ChatGPT through a structured interface. The dashboard displays:
- **Widget Cards**: Showing totals, sums, and top sectors
- **Time Series Chart**: Yearly trends (two-way barplot)
- **Regional Chart**: Horizontal barplot by region
- **Candlestick Chart**: Volatility analysis

## 🚀 Quick Start

### 1. Include the Dashboard in HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>ChatGPT Dashboard</title>
</head>
<body>
    <div id="barplot-root"></div>
    <script src="chatgpt-entry.js"></script>
</body>
</html>
```

### 2. GPT Provides Data

ChatGPT can provide data in two ways:

**Method 1: Set global data object**
```javascript
window.__GPT_DASHBOARD_DATA__ = {
    view: 'proyectos',
    totalProjects: 24246,
    sumInvestment: "MMU$1.041.944",
    topSector: "Industria",
    topSectorPercentage: "22.7",
    // ... more data
};
```

**Method 2: Call render function directly**
```javascript
window.renderDashboard({
    view: 'proyectos',
    totalProjects: 24246,
    // ... data
});
```

## 📊 Data Format

### Widget Values

As mentioned in your requirements, GPT provides values in this format:

```javascript
{
    view: 'proyectos',  // or 'empleo'

    // Numeric values - passed from GPT output
    totalProjects: 24246,
    totalJobs: 15830,
    sumInvestment: "MMU$1.041.944",  // Format for proyectos
    sumJobs: "156.420",               // Format for empleo
    topSector: "Industria",
    topSectorPercentage: "22.7"
}
```

The dashboard automatically switches between `proyectos` and `empleo` values based on the `view` property.

### Filter Values

Filters are provided as arrays of selected values:

```javascript
{
    // Tipo de Ingreso
    tipo_ingreso_seia: ["DIA", "EIA"],

    // Tipología
    tipologia: ["a1", "ñ7", "i5"],

    // Letra de tipología
    tipologia_letra: ["k", "b", "t"],

    // Región
    region: ["Región Metropolitana de Santiago", "Región de Valparaíso"],

    // Estado
    estado_proyecto: ["Aprobado", "En Calificación"],

    // Nivel de Inversión
    etiqueta_inversion: ["Grandes (≥ 100)", "Medianos (≥ 10 - 100)"],

    // Año de Presentación
    ano_presentacion: ["2020", "2021", "2022", "2023", "2024"]
}
```

### Chart Data

**Time Series Data** (for yearly trends):
```javascript
timeSeriesData: [
    {
        period: "2024",              // Display label
        year: 2024,                  // Numeric year
        region: "Nacional",          // Region name
        // Optional filter fields (enable filtering when included)
        tipo_ingreso_seia: "DIA",
        tipologia: "a1",
        tipologia_letra: "a",
        estado_proyecto: "Aprobado",
        etiqueta_inversion: "Grandes (≥ 100)",
        ano_presentacion: 2024,
        // Metric fields
        cantidad_proyectos: 450,     // Count of projects
        inversion_total: 1200        // Total investment amount
    },
    // ... more data points
]
```

**Filter Behavior**:
- When filter fields are included in chart data, filters will automatically apply to charts
- Empty filter selections (no values selected) show all data
- Multiple active filters use AND logic (data must match ALL selected filters)
- Filters apply to both time series and region charts

**Region Data** (for horizontal bar chart):
```javascript
regionData: [
    {
        period: "Metropolitana",     // Region label
        year: 2024,
        region: "Metropolitana",
        cantidad_proyectos: 1450,    // Count of projects
        inversion_total: 4200        // Total investment amount
    },
    // ... more regions
]
```

**Candlestick Data** (for volatility):
```javascript
candlestickData: [
    {
        period: "2024",
        year: 2024,
        open: 420,
        high: 450,
        low: 350,
        close: 380
    },
    // ... more data points
]
```

## 🎯 Example GPT Interactions

### Example 1: Initial Load

**User**: "Show me the projects dashboard"

**GPT Output**:
```javascript
window.renderDashboard({
    view: 'proyectos',
    totalProjects: 24246,
    sumInvestment: "MMU$1.041.944",
    topSector: "Industria",
    topSectorPercentage: "22.7",

    timeSeriesData: [
        { period: "2020", year: 2020, region: "Nacional", cantidad_proyectos: 230, inversion_total: 680 },
        { period: "2022", year: 2022, region: "Nacional", cantidad_proyectos: 140, inversion_total: 420 },
        { period: "2024", year: 2024, region: "Nacional", cantidad_proyectos: 125, inversion_total: 380 }
    ],

    regionData: [
        { period: "Metropolitana", year: 2024, region: "Metropolitana", cantidad_proyectos: 1450, inversion_total: 4200 },
        { period: "Valparaíso", year: 2024, region: "Valparaíso", cantidad_proyectos: 915, inversion_total: 2680 }
    ]
});
```

### Example 2: Filter Update

**User**: "Show only 'Aprobado' and 'En Calificación' projects"

**GPT Output**:
```javascript
window.updateDashboard({
    estado_proyecto: ["Aprobado", "En Calificación"],
    totalProjects: 8420,
    sumInvestment: "MMU$350.500"
});
```

### Example 3: Switch to Employment View

**User**: "Switch to employment view"

**GPT Output**:
```javascript
window.updateDashboard({
    view: 'empleo'
});
```

## 🔧 Technical Details

### Files Structure

```
src/barplot/
├── DashBoard.tsx          # Main dashboard component (modified to accept GPT data)
├── gpt-types.ts           # TypeScript types for GPT data
├── gpt-adapter.ts         # Parser/adapter functions
├── chatgpt-entry.tsx      # ChatGPT entry point
├── chatgpt-example.html   # Interactive example
├── GPT_EXAMPLE.md         # Detailed GPT integration guide
└── CHATGPT_README.md      # This file
```

### Key Components

1. **Dashboard Component** (`DashBoard.tsx`)
   - Now accepts optional `gptData` prop
   - Maintains backward compatibility (works without GPT data)
   - Automatically updates when GPT data changes

2. **GPT Types** (`gpt-types.ts`)
   - `GPTRawOutput`: Format GPT outputs
   - `GPTDashboardData`: Parsed format used by dashboard

3. **GPT Adapter** (`gpt-adapter.ts`)
   - `parseGPTOutput()`: Converts GPT output to dashboard format
   - `buildFilterConfigs()`: Builds filter configurations
   - `parseSimpleGPTString()`: Parses simple comma-separated format

4. **ChatGPT Entry Point** (`chatgpt-entry.tsx`)
   - `window.renderDashboard()`: Render with new data
   - `window.updateDashboard()`: Update with partial data
   - Auto-initialization on page load

### API Functions

#### `window.renderDashboard(gptData)`
Renders the dashboard with provided GPT data. Replaces existing dashboard.

```javascript
window.renderDashboard({
    view: 'proyectos',
    totalProjects: 24246,
    // ... full data
});
```

#### `window.updateDashboard(partialData)`
Updates existing dashboard with partial data. Merges with current data.

```javascript
window.updateDashboard({
    totalProjects: 30000,
    topSector: "Tecnología"
});
```

## 📝 Filter Value Reference

### Tipo de Ingreso (tipo_ingreso_seia)
| Value | Label |
|-------|-------|
| `"DIA"` | DIA |
| `"EIA"` | EIA |

### Tipología (tipologia)
Codes like: `"a1"`, `"ñ7"`, `"i5"`, `"m4"`, `"k1"`, `"f3"`, `"e6"`, `"j1"`, `"h1"`, etc.
See full list in DEFAULT_FILTER_OPTIONS in gpt-adapter.ts

### Letra de tipología (tipologia_letra)
| Value | Label |
|-------|-------|
| `"k"`, `"b"`, `"t"`, `"l"`, `"s"`, `"u"`, `"ñ"`, `"a"`, `"h"`, `"j"`, `"n"`, `"p"`, `"f"`, `"c"`, `"e"`, `"i"`, `"g"`, `"d"`, `"r"`, `"m"`, `"o"` | Same as value |

### Región (region)
| Value | Label |
|-------|-------|
| `"Región Metropolitana de Santiago"` | Región Metropolitana de Santiago |
| `"Región de Valparaíso"` | Región de Valparaíso |
| `"Región del Biobío"` | Región del Biobío |
| And other Chilean regions | See full list in DEFAULT_FILTER_OPTIONS |

### Estado (estado_proyecto)
| Value | Label |
|-------|-------|
| `"Aprobado"` | Aprobado |
| `"En Calificación"` | En Calificación |
| `"En Admisión"` | En Admisión |
| `"Rechazado"` | Rechazado |
| `"Desistido"` | Desistido |
| `"Abandonado"` | Abandonado |
| `"Caducado"` | Caducado |
| `"Revocado"` | Revocado |
| `"Renuncia RCA"` | Renuncia RCA |
| `"No Admitido a Tramitación"` | No Admitido a Tramitación |
| `"No calificado"` | No calificado |

### Nivel de Inversión (etiqueta_inversion)
| Value | Label |
|-------|-------|
| `"Grandes (≥ 100)"` | Grandes (≥ 100) |
| `"Medianos (≥ 10 - 100)"` | Medianos (≥ 10 - 100) |
| `"Pequeños (0 - 10)"` | Pequeños (0 - 10) |

### Año de Presentación (ano_presentacion)
| Value | Label |
|-------|-------|
| `"2014"` | 2014 |
| `"2015"` | 2015 |
| `"2016"` | 2016 |
| `"2017"` | 2017 |
| `"2018"` | 2018 |
| `"2019"` | 2019 |
| `"2020"` | 2020 |
| `"2021"` | 2021 |
| `"2022"` | 2022 |
| `"2023"` | 2023 |
| `"2024"` | 2024 |
| `"2025"` | 2025 |

## 🧪 Testing

Use the included `chatgpt-example.html` file to test the integration:

```bash
# Open the example file in a browser
open src/barplot/chatgpt-example.html
```

The example includes buttons to:
- Load Proyectos view
- Load Empleo view
- Update filters
- Load custom data
- Test with custom JSON input

## 💡 Best Practices

1. **Always provide complete data**: Include all required fields to avoid missing data
2. **Maintain data format consistency**: Keep the same structure for all data points
3. **Use correct value formats**: Follow the format specs for numeric values
4. **Update incrementally**: Use `updateDashboard()` for partial updates
5. **Test with example file**: Use `chatgpt-example.html` to verify data structure

## 🔍 Debugging

Check the browser console for:
- Parsed data structure
- Rendering confirmation messages
- Any data validation errors

```javascript
// Enable detailed logging
console.log(window.__GPT_DASHBOARD_DATA__);
```

## 📚 Additional Resources

- See `GPT_EXAMPLE.md` for comprehensive examples
- See `chatgpt-example.html` for interactive testing
- Check `gpt-types.ts` for complete type definitions

## ✅ Summary

The dashboard is now ready to receive data from ChatGPT in the format:

```javascript
activeView === 'proyectos'
    ? "MMU$1.041.944"  // sumInvestment
    : "156.420"         // sumJobs
```

All numeric values, filters, and chart data follow the same pattern - GPT outputs the data, and the dashboard automatically parses and displays it.
