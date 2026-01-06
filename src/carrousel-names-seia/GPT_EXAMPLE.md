# GPT Example for SEIA Projects Carousel

## How to Use from GPT

This widget is designed to display SEIA projects with similarity scores. From GPT, you would call a tool that returns data in the following format:

### Example Tool Call

```json
{
  "data": [
    {
      "expediente_seia": 2160211381,
      "nombre_proyecto": "Línea de Transmisión Eléctrica HVDC Kimal - Lo Aguirre",
      "inversion": 1480.0,
      "region": "Interregional",
      "cosine_similarity": 0.6665445168885888,
      "estado_proyecto": "Aprobado"
    },
    {
      "expediente_seia": 6124,
      "nombre_proyecto": "Linea 2 (110 KV) Cardones- Los Lirios",
      "inversion": 0.26,
      "region": "Región de Atacama",
      "cosine_similarity": 0.6654693483235876,
      "estado_proyecto": "En Calificación"
    },
    {
      "expediente_seia": 3257,
      "nombre_proyecto": "Línea de Transmisión Tap El Llano - Los Quilos",
      "inversion": 8.0,
      "region": "Interregional",
      "cosine_similarity": 0.6634976663290075,
      "estado_proyecto": "Aprobado"
    },
    {
      "expediente_seia": 2904232,
      "nombre_proyecto": "LÍNEA DE TRANSMISIÓN 2X220 KV GUACOLDA - MAITENCILLO (e-seia)",
      "inversion": 11.0,
      "region": "Región de Atacama",
      "cosine_similarity": 0.6605195999145508,
      "estado_proyecto": "Desistido"
    },
    {
      "expediente_seia": 184,
      "nombre_proyecto": "Línea A.T. 66 KV  Coronel-Corcovado-Ecuadron",
      "inversion": 0.36,
      "region": "Región del Biobío",
      "cosine_similarity": 0.6596277153270087,
      "estado_proyecto": "En Evaluación"
    }
  ]
}
```

## Field Descriptions

| Field | Type | Description | Display |
|-------|------|-------------|---------|
| `expediente_seia` | number | SEIA file number | Shown in upper-right chip as "Expediente SEIA : {value}" |
| `nombre_proyecto` | string | Project name | Displayed as card title |
| `inversion` | number | Investment in millions USD | Shown as "Inversión MMU$ : {value}" with locale formatting |
| `region` | string | Geographic region | Displayed with location icon 📍 |
| `cosine_similarity` | number | Similarity score (0-1) | Prominently displayed as percentage in purple badge |
| `estado_proyecto` | string | Project state/status | Shown as chip next to similarity badge (value only) |

## Example Use Cases

### 1. Finding Similar Projects

When a user asks about similar projects to a specific SEIA project, the tool would:
1. Perform similarity search using embeddings
2. Return top N similar projects
3. Display them in the carousel widget

### 2. Project Recommendations

When recommending projects based on criteria:
1. Filter projects by region, investment, or type
2. Calculate similarity to user's interest
3. Display ranked results

## Data Validation

The widget includes data validation in `gpt-adapter.ts`:
- Handles missing fields with defaults
- Validates data structure
- Gracefully handles errors

## Visual Preview

Each card shows:
```
┌─────────────────────────────────────┐
│                 [Expediente: 123456]│
│  [Similitud: 66.7%] [Aprobado]      │
│                                     │
│  Proyecto Name Here                 │
│  Can span multiple lines            │
│                                     │
│  ─────────────────────────────────  │
│  💰 Inversión MMU$ : 1,480.00       │
│  📍 Interregional                   │
└─────────────────────────────────────┘
```

## Integration Notes

- Widget ID: `carrousel-names-seia-root`
- Data source: `window.openai.toolOutput`
- Theme: Supports light/dark mode
- Responsive: Adapts to container size
