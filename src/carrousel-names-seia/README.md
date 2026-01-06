# SEIA Projects Carousel Widget

A carousel widget that displays SEIA (Sistema de Evaluación de Impacto Ambiental) projects with similarity scores.

## Overview

This widget displays a scrollable carousel of project cards, showing relevant SEIA projects with their similarity scores based on cosine similarity calculations.

## Features

- **Responsive Carousel**: Horizontally scrollable cards with navigation arrows
- **Dark/Light Theme**: Toggle between light and dark themes
- **Similarity Highlighting**: Prominently displays cosine similarity percentage
- **Project Details**: Shows expediente, investment, and region information
- **Smooth Animations**: Card hover effects and smooth scrolling

## Data Structure

The widget expects data in the following format:

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
    }
  ]
}
```

### Fields

- **expediente_seia** (number): SEIA file number
- **nombre_proyecto** (string): Project name
- **inversion** (number): Investment amount in millions of USD
- **region** (string): Geographic region
- **cosine_similarity** (number): Similarity score (0-1 range)
- **estado_proyecto** (string): Project state/status

## Card Layout

Each project card displays:

1. **Upper Right**: Expediente SEIA chip
2. **Top Section**:
   - Similarity percentage (prominent purple badge)
   - Estado Proyecto chip (project status)
3. **Title**: Project name
4. **Bottom Section**:
   - Investment amount (Inversión MMU$)
   - Region

## Components

### SeiaProjectCard
Individual card component displaying a single SEIA project.

### SeiaProjectCarousel
Carousel container with navigation arrows and scroll functionality.

### Dashboard
Main component that integrates theme switching and data parsing.

## Usage

The widget is mounted on a DOM element with id `carrousel-names-seia-root`.

```html
<div id="carrousel-names-seia-root"></div>
```

## Theming

Uses the unified theme system from `widget_styles/theme.ts`:
- Default theme: Dark
- Supports light/dark mode toggle
- Consistent colors across all widgets

## Build

Included in the build configuration (`build-all.mts`) as `carrousel-names-seia`.

```bash
pnpm build
```

## Files

- `index.tsx`: Entry point
- `Dashboard.tsx`: Main dashboard component
- `SeiaProjectCard.tsx`: Individual card component
- `SeiaProjectCarousel.tsx`: Carousel container
- `types.ts`: TypeScript type definitions
- `gpt-types.ts`: GPT output types
- `gpt-adapter.ts`: Data parsing and validation
- `widget.css`: Widget-specific styles
