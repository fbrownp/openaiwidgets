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
    // Nivel de Inversión
    nivelInversion: ["alto", "medio", "bajo"],

    // Estado
    estado: ["ejecucion", "aprobado", "evaluacion", "finalizado"],

    // Sector Productivo
    sectorProductivo: ["industria", "comercio", "servicios"],

    // Formas de Presentación
    formasPresentacion: ["proyecto", "empleo"],

    // Regiones
    regiones: ["Metropolitana", "O'Higgins", "Biobío"]
}
```

### Chart Data

**Time Series Data** (for yearly trends):
```javascript
timeSeriesData: [
    {
        period: "2024",        // Display label
        year: 2024,            // Numeric year
        region: "Nacional",    // Region name
        revenue: 1200,         // Used for 'proyectos' view
        units: 450,            // Used for 'empleo' view
        profit: 380            // Optional
    },
    // ... more data points
]
```

**Region Data** (for horizontal bar chart):
```javascript
regionData: [
    {
        period: "Metropolitana",  // Region label
        year: 2024,
        region: "Metropolitana",
        revenue: 4200,            // Used for 'proyectos'
        units: 1450,              // Used for 'empleo'
        profit: 1260
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
        { period: "2020", year: 2020, region: "Nacional", revenue: 680, units: 230, profit: 205 },
        { period: "2022", year: 2022, region: "Nacional", revenue: 420, units: 140, profit: 125 },
        { period: "2024", year: 2024, region: "Nacional", revenue: 380, units: 125, profit: 115 }
    ],

    regionData: [
        { period: "Metropolitana", year: 2024, region: "Metropolitana", revenue: 4200, units: 1450, profit: 1260 },
        { period: "Valparaíso", year: 2024, region: "Valparaíso", revenue: 2680, units: 915, profit: 804 }
    ]
});
```

### Example 2: Filter Update

**User**: "Show only 'En ejecución' and 'Aprobado' projects"

**GPT Output**:
```javascript
window.updateDashboard({
    estado: ["ejecucion", "aprobado"],
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

### Nivel de Inversión
| Value | Label |
|-------|-------|
| `"alto"` | Alto (>$1M) |
| `"medio"` | Medio ($100K-$1M) |
| `"bajo"` | Bajo (<$100K) |

### Estado
| Value | Label |
|-------|-------|
| `"ejecucion"` | En ejecución |
| `"aprobado"` | Aprobado |
| `"evaluacion"` | En evaluación |
| `"finalizado"` | Finalizado |
| `"suspendido"` | Suspendido |
| `"rechazado"` | Rechazado |
| `"construccion"` | En construcción |
| `"operativo"` | Operativo |
| `"paralizado"` | Paralizado |
| `"postergado"` | Postergado |

### Sector Productivo
| Value | Label |
|-------|-------|
| `"industria"` | Industria |
| `"comercio"` | Comercio |
| `"servicios"` | Servicios |
| `"mineria"` | Minería |
| `"agricultura"` | Agricultura |
| `"construccion"` | Construcción |
| `"tecnologia"` | Tecnología |

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
