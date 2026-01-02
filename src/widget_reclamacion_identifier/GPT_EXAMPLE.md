# GPT Integration Example

This document shows how ChatGPT should structure its output for the Observation Identifier Widget.

## Expected Output Format

ChatGPT should output a JSON object following the standard schema format `data: List[Dict]`:

```json
{
  "data": [
    {
      "identifier": "Usuario_Consulta_001",
      "first_level_trace": "EIA_Proyecto_Minero_2023.pdf",
      "original_name": "/evaluaciones/2023/mineria/EIA_Proyecto_Minero_2023.pdf",
      "cita_encontrada": "Se observa contaminación potencial de napas subterráneas debido a infiltraciones desde el tranque de relaves ubicado en zona de alta pluviosidad.",
      "similitud": "Identica",
      "instancia_observacion": "PAC_1",
      "tipificacion_materia": "contaminación napa infiltraciones"
    },
    {
      "identifier": "Usuario_Consulta_045",
      "first_level_trace": "Observaciones_Comunidad_Sur.pdf",
      "original_name": "/consultas/comunidades/2023/Observaciones_Comunidad_Sur.pdf",
      "cita_encontrada": "La comunidad manifiesta preocupación por posibles infiltraciones que podrían afectar las fuentes de agua subterránea utilizadas para consumo.",
      "similitud": "Similar",
      "instancia_observacion": "PCPI",
      "tipificacion_materia": "riesgo salud agua"
    },
    {
      "identifier": "Usuario_Consulta_078",
      "first_level_trace": "DIA_Planta_Industrial_2024.pdf",
      "original_name": "/evaluaciones/2024/industria/DIA_Planta_Industrial_2024.pdf",
      "cita_encontrada": "Se requiere evaluación de riesgo a la salud de receptores sensibles ubicados a 500m de la planta debido a material particulado.",
      "similitud": "Similar",
      "instancia_observacion": "PAC_2",
      "tipificacion_materia": "riesgo salud MP"
    },
    {
      "identifier": "Usuario_Consulta_112",
      "first_level_trace": "EIA_Linea_Transmision_2022.pdf",
      "original_name": "/evaluaciones/2022/energia/EIA_Linea_Transmision_2022.pdf",
      "cita_encontrada": "Comunidad ubicada a 2 km de la línea de transmisión expresa preocupación por emisiones electromagnéticas y sus efectos en la salud.",
      "similitud": "Identica",
      "instancia_observacion": "PAC_1",
      "tipificacion_materia": "emisiones electromagnéticas comunidad"
    },
    {
      "identifier": "Usuario_Consulta_203",
      "first_level_trace": "Observaciones_Sanitarias_2023.pdf",
      "original_name": "/consultas/sanitarias/Observaciones_Sanitarias_2023.pdf",
      "cita_encontrada": "Se solicita estudio de línea base de ruido considerando receptores sensibles como escuela y centro de salud en área de influencia.",
      "similitud": "Similar",
      "instancia_observacion": "PCPI",
      "tipificacion_materia": "contaminación acústica receptores"
    }
  ]
}
```

## Field Descriptions

### `identifier`
- **Type**: string
- **Description**: Unique identifier of the user or query that made a similar observation
- **Example**: "Usuario_Consulta_001", "Comunidad_Norte_2023"

### `first_level_trace`
- **Type**: string
- **Description**: Name of the file where the observation was found
- **Example**: "EIA_Proyecto_Minero_2023.pdf"

### `original_name`
- **Type**: string
- **Description**: Full path/trace to the file where the observation was found
- **Example**: "/evaluaciones/2023/mineria/EIA_Proyecto_Minero_2023.pdf"

### `cita_encontrada`
- **Type**: string
- **Description**: Direct quote/citation of the similar or identical observation found
- **Example**: "Se observa contaminación potencial de napas subterráneas..."

### `similitud`
- **Type**: Literal['Similar', 'Identica']
- **Description**: Indicates if the observation is Similar or Identical
- **Values**:
  - "Similar": Observation has similar content but not exact match
  - "Identica": Observation is an exact or nearly exact match

### `instancia_observacion`
- **Type**: Literal['PAC_1', 'PAC_2', 'PCPI']
- **Description**: Instance where the observation was generated
- **Values**:
  - "PAC_1": Primera instancia de Participación Ciudadana
  - "PAC_2": Segunda instancia de Participación Ciudadana
  - "PCPI": Proceso de Consulta a Pueblos Indígenas

### `tipificacion_materia`
- **Type**: string
- **Description**: Short description (3 words) of the subject matter
- **Examples**:
  - "contaminación napa infiltraciones"
  - "riesgo salud MP"
  - "emisiones electromagnéticas comunidad"
  - "contaminación acústica receptores"

## Common Subject Matter Types

Here are examples of typical `tipificacion_materia` values:

- "contaminación napa infiltraciones"
- "riesgo salud MP" (Material Particulado)
- "emisiones electromagnéticas comunidad"
- "contaminación acústica receptores"
- "impacto visual paisaje"
- "pérdida biodiversidad fauna"
- "calidad aire emisiones"
- "recursos hídricos disponibilidad"
- "impacto flora nativa"
- "riesgo comunidades cercanas"

## Empty Result

If no similar observations are found:

```json
{
  "data": []
}
```

## Response Structure in ChatGPT

When ChatGPT responds with this widget, it should:

1. Analyze the user's query about observations
2. Search for similar or identical observations in the database/context
3. Structure the results using the standard schema format: `data: List[Dict]`
4. Return the JSON with all required fields in each dictionary

## Example ChatGPT Response

```
I found 5 observations that are similar or identical to your query about groundwater contamination concerns. Here are the results:

<observation_widget>
{
  "data": [
    {
      "identifier": "Usuario_Consulta_001",
      "first_level_trace": "EIA_Proyecto_Minero_2023.pdf",
      "original_name": "/evaluaciones/2023/mineria/EIA_Proyecto_Minero_2023.pdf",
      "cita_encontrada": "Se observa contaminación potencial de napas subterráneas debido a infiltraciones desde el tranque de relaves ubicado en zona de alta pluviosidad.",
      "similitud": "Identica",
      "instancia_observacion": "PAC_1",
      "tipificacion_materia": "contaminación napa infiltraciones"
    },
    ...
  ]
}
</observation_widget>

The widget above shows 2 identical observations and 3 similar observations across different environmental impact assessment processes.
```
