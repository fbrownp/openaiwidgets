# SNIFA Dashboard Faltas - Data Format

## How to Pass Data to the Dashboard

The dashboard expects data to be set on the window object **before the widget loads**.

### Option 1: Object format (recommended)
```javascript
window.__SNIFA_DASHBOARD_DATA__ = {
  data: [
    {
      clasificacion_gravedad: "Leves",
      instrumento_infringido_norm: "RCA",
      etiqueta_tema_falta: "general",
      subcomponente: "Caracteristicas y/o Equipamiento del Proyecto o Actividad",
      subtipo_compromiso: "Descripcion del Proyecto",
      region: "Región de Aysén",
      tipo_proceso_sancion: "Denuncia",
      categoria_economica: "Minería",
      subcategoria_economica: "Minera no metálica",
      cantidad_casos: 1
    },
    // ... more records
  ]
};
```

### Option 2: Polars DataFrame format (Python)
```javascript
window.__SNIFA_DASHBOARD_DATA__ = {
  text: "Ask the user to explore the data.",
  data: [
    // Array from df.to_dicts()
    {
      clasificacion_gravedad: "Leves",
      instrumento_infringido_norm: "RCA",
      // ... other fields
    },
    // ... more records
  ]
};
```

In Python with Polars:
```python
import polars as pl

# Your DataFrame
df = pl.DataFrame(...)

# Pass to widget
widget_data = {
    'text': "Ask the user to explore the data.",
    'data': df.to_dicts(),
}
```

### Option 3: Direct array format
```javascript
window.__SNIFA_DASHBOARD_DATA__ = [
  {
    clasificacion_gravedad: "Leves",
    instrumento_infringido_norm: "RCA",
    // ... other fields
  },
  // ... more records
];
```

## Data Schema

Each record in the `data` array should have these fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `clasificacion_gravedad` | string | Yes | One of: "Leves", "Graves", "Gravísimas" |
| `instrumento_infringido_norm` | string \| null | Yes | Infringed instrument norm |
| `etiqueta_tema_falta` | string \| null | Yes | Fault theme label |
| `subcomponente` | string \| null | Yes | Environmental subcomponent |
| `subtipo_compromiso` | string \| null | Yes | Commitment subtype |
| `region` | string \| null | Yes | Chilean region |
| `tipo_proceso_sancion` | string \| null | Yes | Sanction process type |
| `categoria_economica` | string \| null | Yes | Economic category |
| `subcategoria_economica` | string \| null | Yes | Economic subcategory |
| `cantidad_casos` | number | Yes | Number of cases (count) |

## Dynamic Features

The dashboard automatically:

1. **Calculates total casos**: Sums all `cantidad_casos` values
2. **Generates filters**: Extracts unique values from `region`, `categoria_economica`, `subcategoria_economica`
3. **Handles null values**: Displays as "Sin Información"
4. **Updates widgets**: All widgets (totals, most affected) update based on filtered data

## Example Usage

```html
<script>
  // Set data before loading the widget
  window.__SNIFA_DASHBOARD_DATA__ = {
    data: yourDataArray
  };
</script>
<script src="path/to/snifa_dashboard_faltas.js"></script>
<div id="snifa_dashboard_faltas-root"></div>
```

## Debugging

Open the browser console to see detailed logging:
- Data reception from endpoint
- Filter generation
- Total casos calculation
- Filtered data counts

Example console output:
```
Received data from endpoint: { dataRows: 500, sample: {...} }
Parsing GPT output: { totalRows: 500, firstRow: {...}, ... }
Generated filters: { regions: 13, categorias: 11, subcategorias: 12, totalCalculated: 6824 }
Total casos calculated: { filteredRows: 500, totalCasos: 6824, ... }
```
