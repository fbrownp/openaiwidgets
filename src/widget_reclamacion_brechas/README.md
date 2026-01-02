# Widget Reclamación Brechas

A legal gap analysis widget for displaying potential voids in legal arguments, defense strategies, and counter-arguments.

## Features

- **Multi-screen Navigation**: Switch between different views (Overview, Defense, Allegation, References)
- **Card-based UI**: Clean, modern interface with cards for each brecha
- **Dark Theme by Default**: Follows barplot color scheme
- **Reference Citations**: Displays legal references with clickable URLs
- **Responsive Design**: Works on different screen sizes
- **Law Comparison Theme**: Designed specifically for legal analysis visualization

## Data Schema

The widget expects data in the following format:

```typescript
{
  "analisis_brechas": [
    {
      "potencial_brecha": string,
      "tipo_brecha": string,
      "justificacion_brecha": string,
      "solucion_titular": string,
      "resumen_considerado_titular": string,
      "potenciales_vacios": string,
      "potenciales_aristas_titular": string,
      "potenciales_aristas_alegato": string,
      "aplica": string,
      "referencias": [
        {
          "original_name": string,
          "first_level_trace": string,
          "pages": number[],
          "sentence_reference": string[],
          "urls": string[]
        }
      ]
    }
  ]
}
```

## Screens

1. **Overview**: Shows the general information about the brecha including potential gap, justification, and proposed solutions
2. **Defense**: Displays defense arguments (aristas del titular) and potential voids
3. **Allegation**: Shows counter-arguments (aristas del alegato) and potential voids
4. **References**: Lists all legal references with citations and clickable links

## Theme

The widget uses the barplot color scheme with dark mode as default:
- Background: `#212121`
- Card Background: `#2d2d2d`
- Primary Purple: `#8b5cf6` / `#a78bfa`
- Accent Colors:
  - Defense (Green): `#10b981`
  - Allegation (Red): `#f87171`
  - Voids (Orange): `#fb923c`

## Usage

The widget integrates with OpenAI's widget system and automatically processes incoming data through the GPT adapter.

```tsx
import { Dashboard } from './widget_reclamacion_brechas';

<Dashboard />
```
