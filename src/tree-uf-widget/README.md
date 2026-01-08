# Tree UF Widget

A hierarchical visualization widget for displaying relationships between different types of expedientes (files/documents) associated with a specific UF (Unidad Fiscalizable).

## Overview

This widget visualizes the connections between various document types in a hierarchical structure, making it easy to understand the relationships between:

- ID UF (Unidad Fiscalizable)
- Expediente SEIA
- Expediente SNIFA
- Expediente Fiscalización
- Expediente Medida
- Instrumentos Aplicables

## Features

- **Interactive Visualization**: Click on any document to highlight its connections
- **Connection Lines**: Visual lines are drawn between connected documents
- **Theme Support**: Light and dark theme toggle
- **Summary Statistics**: Overview of document counts and connections
- **Hierarchical Organization**: Documents organized by type in collapsible cards

## Data Format

The widget expects an array of edge data objects with the following structure:

```typescript
{
  src_name: string;        // Source document type
  src_id: string;          // Source document ID
  dst_name: string;        // Destination document type
  dst_id: string;          // Destination document ID
  src_hierarchy_level: number;  // Hierarchy level of source
  dst_hierarchy_level: number;  // Hierarchy level of destination
}
```

### Example Data

```json
[
  {
    "src_name": "id_uf",
    "src_id": "2456",
    "dst_name": "expediente_snifa",
    "dst_id": "F-034-2016",
    "src_hierarchy_level": 1,
    "dst_hierarchy_level": 5
  },
  {
    "src_name": "expediente_seia",
    "src_id": "2718775-2456",
    "dst_name": "expediente_snifa",
    "dst_id": "F-034-2016",
    "src_hierarchy_level": 2,
    "dst_hierarchy_level": 5
  }
]
```

## Hierarchy Levels

The widget recognizes the following hierarchy:

1. **Level 1**: `id_uf` - Root level representing the Unidad Fiscalizable
2. **Level 2**: `expediente_seia` - SEIA expedientes
3. **Level 4**: `expediente_fiscalizacion` - Fiscalización expedientes
4. **Level 5**: `expediente_snifa` - SNIFA expedientes
5. **Other**: `expediente_medida`, `instrumento_aplicable` - Other document types

## Usage

### Interacting with the Widget

1. **View Connections**: Click on any document to see all its connected documents highlighted
2. **Clear Selection**: Click the same document again to deselect and clear highlights
3. **Switch Themes**: Use the theme toggle at the top to switch between light and dark modes
4. **View Statistics**: Check the summary section at the bottom for overall counts

### Integration

The widget integrates with OpenAI's Apps SDK and expects data to be provided through the `toolOutput` global:

```typescript
window.openai.toolOutput = [
  // Array of edge data objects
];
```

## Components

- **Dashboard**: Main container component
- **TreeCard**: Displays a group of documents by type
- **ConnectionLines**: SVG overlay for drawing connection lines
- **gpt-adapter**: Data processing logic
- **types**: TypeScript type definitions

## Styling

The widget follows the project's style guidelines and uses the shared theme system defined in `src/widget_styles/theme.ts`.

## Development

To work on this widget:

1. Edit files in `src/tree-uf-widget/`
2. Build with `pnpm run build`
3. Serve with `pnpm run serve`
4. Access at `http://localhost:4444/tree-uf-widget.html`
