# Widget Reclamacion Identifier

A carousel widget component for displaying observation identifiers with similar or identical references.

## Overview

This widget displays observation identifiers in a carousel format with cards. Each card shows detailed information about observations that are similar or identical to a query, including file traces, citations, and categorization.

## Data Model

The widget expects data based on the following Pydantic model:

```python
from typing import List, Literal
from pydantic import BaseModel, Field

class ObservationIdentifier(BaseModel):
    """Observation Identifier Model."""

    identifier: str = Field(
        description="Identificador del usuario que realizó una consulta similar"
    )
    first_level_trace: str = Field(
        description="Nombre del archivo donde se encontró. (Variable `first_level_trace`)"
    )
    original_name: str = Field(
        description="Variable `original_name` con la traza hasta el nombre del archivo donde se encontró"
    )
    cita_encontrada: str = "Cita de la observación similar o idéntica encontrada."
    similitud: Literal['Similar', 'Identica'] = Field(
        description="Literal entre Similar o Idéntica dependiendo de la similitud de la observación."
    )
    instancia_observacion: Literal['PAC_1', 'PAC_2', 'PCPI'] = Field(
        description="Instancia donde se generó la observación."
    )
    tipificacion_materia: str = "Descripción del tema al cual hace referencia la observación en una frase corta de 3 palabras"

class ObservationsIdentifier(BaseModel):
    """Observations references."""
    observations_reference: List[ObservationIdentifier]
```

## Card Layout

Each observation card displays:

- **identifier**: Title at the top of the card
- **first_level_trace**: Chip showing the file where it was found
- **original_name**: Chip below first_level_trace showing the full path
- **cita_encontrada**: Italic text citation at the bottom of the card
- **similitud**: Chip indicating if observation is 'Similar' (blue) or 'Identica' (green)
- **instancia_observacion**: Chip in upper right corner (PAC_1=purple, PAC_2=orange, PCPI=red)
- **tipificacion_materia**: Chip in upper right corner below instancia_observacion

## Usage

### Integration with OpenAI/GPT

The widget automatically integrates with OpenAI's global state through hooks:

```typescript
import { useOpenAiGlobal } from '../use-openai-global';
import { useWidgetState } from '../use-widget-state';
```

### Expected GPT Output Format

```json
{
  "observations_reference": [
    {
      "identifier": "Usuario_123",
      "first_level_trace": "archivo_consulta.pdf",
      "original_name": "/path/to/archivo_consulta.pdf",
      "cita_encontrada": "Esta es la cita textual de la observación encontrada en el documento.",
      "similitud": "Identica",
      "instancia_observacion": "PAC_1",
      "tipificacion_materia": "contaminación de napa"
    },
    {
      "identifier": "Usuario_456",
      "first_level_trace": "observacion_2024.pdf",
      "original_name": "/documentos/2024/observacion_2024.pdf",
      "cita_encontrada": "Texto similar pero no idéntico a la consulta original.",
      "similitud": "Similar",
      "instancia_observacion": "PCPI",
      "tipificacion_materia": "emisiones electromagnéticas comunidad"
    }
  ]
}
```

## Features

- **Carousel Navigation**: Horizontal scrolling with navigation arrows
- **Responsive Cards**: Cards adapt to content and have hover effects
- **Theme Support**: Light and dark theme toggle
- **Statistics Dashboard**: Shows count of total, identical, and similar observations
- **Color-coded Chips**: Different colors for different categories
- **Smooth Animations**: Card hover effects and carousel scrolling

## Components

### Dashboard
Main component that manages state and layout.

### ObservationCarousel
Container component that manages the carousel behavior and navigation.

### ObservationCard
Individual card component that displays a single observation.

## Styling

The widget uses inline styles with theme support and includes a CSS file for additional styling like animations and scrollbar hiding.

### Color Scheme

**Light Theme:**
- Similar: Blue (#3b82f6)
- Identical: Green (#10b981)
- PAC_1: Purple (#8b5cf6)
- PAC_2: Orange (#f59e0b)
- PCPI: Red (#ef4444)
- Tipificacion: Indigo (#6366f1)

**Dark Theme:**
- Adapted colors for dark backgrounds

## File Structure

```
widget_reclamacion_identifier/
├── Dashboard.tsx           # Main dashboard component
├── ObservationCarousel.tsx # Carousel container
├── ObservationCard.tsx     # Individual card
├── gpt-adapter.ts          # GPT output parsing
├── gpt-types.ts            # GPT-specific types
├── types.ts                # TypeScript types
├── widget.css              # Styles
├── index.tsx               # Entry point
└── README.md               # This file
```

## Development

To use this widget in your application:

1. Ensure you have a div with id `widget-reclamacion-identifier-root` in your HTML
2. Import and mount the widget
3. Provide data through OpenAI's global state or pass directly to components

## Example HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>Observation Identifier Widget</title>
</head>
<body>
    <div id="widget-reclamacion-identifier-root"></div>
    <script src="./index.tsx"></script>
</body>
</html>
```
