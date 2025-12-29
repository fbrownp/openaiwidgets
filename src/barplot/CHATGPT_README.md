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

### Unified Data Array

**NEW FORMAT**: The dashboard now uses a single unified data array that feeds all three charts:

```javascript
data: [
    {
        // Required fields (matches schema)
        ano_presentacion: 2022,          // Year of presentation
        tipo_ingreso_seia: "EIA",        // Type: "DIA" or "EIA"
        tipologia_letra: "c",            // Typology letter
        region: "Región del Biobío",     // Chilean region
        estado_proyecto: "No calificado",// Project state
        cantidad_proyectos: 1,           // Count of projects
        inversion_total: 420.0,          // Total investment
        // Optional fields
        tipologia: "c1",                 // Full typology code
        etiqueta_inversion: "Pequeños (0 - 10)"  // Investment category
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
]
```

**How it Works**:
- Single data array contains raw data matching your database schema
- Dashboard automatically generates 3 charts from this data:
  1. **Time Series**: Aggregates by year (ano_presentacion)
  2. **Region Chart**: Aggregates by region
  3. **Candlestick**: Calculates OHLC from inversion_total by year
- Filters apply to the base data before chart generation
- Empty filter selections show all data
- Multiple filters use AND logic

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

    data: [
        { ano_presentacion: 2020, tipo_ingreso_seia: "DIA", tipologia_letra: "a", region: "Región Metropolitana de Santiago", estado_proyecto: "Aprobado", cantidad_proyectos: 230, inversion_total: 680 },
        { ano_presentacion: 2022, tipo_ingreso_seia: "EIA", tipologia_letra: "c", region: "Región de Valparaíso", estado_proyecto: "En Calificación", cantidad_proyectos: 140, inversion_total: 420 },
        { ano_presentacion: 2024, tipo_ingreso_seia: "DIA", tipologia_letra: "b", region: "Región del Biobío", estado_proyecto: "Aprobado", cantidad_proyectos: 125, inversion_total: 380 }
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
