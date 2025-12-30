# Indexing Dashboard

A dashboard component for displaying document indexing status across multiple indices.

## Features

- **Document Status Tracking**: Displays counts for various document statuses:
  - `indexado` (Indexed)
  - `listo_para_indexar` (Ready to index)
  - `corrompido` (Corrupted)
  - `en_cola` (In queue)
  - `falta_ocr` (Missing OCR)
  - `pdf_validado` (PDF validated)
  - `no_descargado` (Not downloaded)

- **Interactive Filters**: Filter by index name with multi-select dropdown
- **Count Widget**: Displays total count of indexed documents
- **Visual Barplot**: Horizontal grouped barplot showing all statuses per index
- **Theme Support**: Light and dark theme toggle

## Data Schema

The dashboard expects data in the following format:

```typescript
{
  data: [
    {
      index_name: string;
      tipo_documento: string;
      listo_para_indexar: number;
      corrompido: number;
      en_cola: number;
      indexado: number;
      falta_ocr: number;
      pdf_validado: number;
      no_descargado: number;
    },
    // ... more indices
  ]
}
```

## GPT Integration

The dashboard integrates with ChatGPT through the `data` field in the GPT output:

```typescript
{
  // Optional: Pre-calculated total (otherwise calculated from data)
  totalIndexado?: number;

  // Optional: Pre-selected filter values
  index_name?: string[];

  // Main data array with the schema
  data: IndexStatus[];
}
```

## Available Index Names

Default filter options include:
- leyes
- cmf-memorias
- seia
- seia-consulta-indigena
- pertinencia
- guias
- snifa
- denuncias-archivadas
- snifa-requerimientos
- snifa-fiscalizaciones
- sentencia
- seia-recursos
- snifa-medidas-provisionales

## Example Data

```javascript
{
  data: [
    {
      'index_name': 'cmf-memorias',
      'tipo_documento': 'memoria_cmf',
      'listo_para_indexar': 0,
      'corrompido': 0,
      'en_cola': 0,
      'indexado': 595,
      'falta_ocr': 0,
      'pdf_validado': 595,
      'no_descargado': 0
    },
    {
      'index_name': 'denuncias-archivadas',
      'tipo_documento': 'denuncias_archivadas',
      'listo_para_indexar': 0,
      'corrompido': 0,
      'en_cola': 0,
      'indexado': 1642,
      'falta_ocr': 0,
      'pdf_validado': 1642,
      'no_descargado': 0
    }
  ]
}
```

## Usage

The dashboard will automatically parse the `data` field from the GPT tool output and display:
1. A count widget showing total indexed documents
2. Filters for selecting specific indices
3. A grouped horizontal barplot showing all status counts per index

The barplot uses color coding to distinguish different statuses and supports hover tooltips for detailed information.
