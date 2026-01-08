# GPT Integration Example - Tree UF Widget

This document provides examples of how to use this widget with GPT/ChatGPT.

## Widget Purpose

The Tree UF Widget visualizes hierarchical relationships between different types of expedientes (documents) associated with a specific Unidad Fiscalizable (UF).

## Data Format

The widget expects an array of edge objects representing connections between documents:

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

## Example Full Dataset

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
  },
  {
    "src_name": "expediente_seia",
    "src_id": "6336-2456",
    "dst_name": "expediente_snifa",
    "dst_id": "F-034-2016",
    "src_hierarchy_level": 2,
    "dst_hierarchy_level": 5
  },
  {
    "src_name": "expediente_fiscalizacion",
    "src_id": "DFZ-2017-5452-IX-PC-EI",
    "dst_name": "expediente_seia",
    "dst_id": "2718775",
    "src_hierarchy_level": 4,
    "dst_hierarchy_level": 2
  },
  {
    "src_name": "expediente_fiscalizacion",
    "src_id": "DFZ-2017-5452-IX-PC-EI",
    "dst_name": "expediente_seia",
    "dst_id": "6336",
    "src_hierarchy_level": 4,
    "dst_hierarchy_level": 2
  },
  {
    "src_name": "id_uf",
    "src_id": "2456",
    "dst_name": "expediente_seia",
    "dst_id": "6336",
    "src_hierarchy_level": 1,
    "dst_hierarchy_level": 2
  },
  {
    "src_name": "id_uf",
    "src_id": "2456",
    "dst_name": "expediente_seia",
    "dst_id": "2718775",
    "src_hierarchy_level": 1,
    "dst_hierarchy_level": 2
  },
  {
    "src_name": "NE:46/2002",
    "src_id": "NE:46/2002-2456",
    "dst_name": "expediente_snifa",
    "dst_id": "F-034-2023",
    "src_hierarchy_level": 2,
    "dst_hierarchy_level": 5
  },
  {
    "src_name": "id_uf",
    "src_id": "2456",
    "dst_name": "expediente_snifa",
    "dst_id": "F-034-2023",
    "src_hierarchy_level": 1,
    "dst_hierarchy_level": 5
  },
  {
    "src_name": "expediente_fiscalizacion",
    "src_id": "DFZ-2017-5452-IX-PC-EI",
    "dst_name": "expediente_snifa",
    "dst_id": "F-034-2016",
    "src_hierarchy_level": 4,
    "dst_hierarchy_level": 5
  }
]
```

## GPT Prompt Examples

### Example 1: Query for UF Relationships

**User**: "Show me all the relationships for UF 2456"

**GPT Response**: "Here's a visualization of all document relationships for UF 2456:"

```json
[
  {
    "src_name": "id_uf",
    "src_id": "2456",
    "dst_name": "expediente_seia",
    "dst_id": "2718775",
    "src_hierarchy_level": 1,
    "dst_hierarchy_level": 2
  },
  {
    "src_name": "expediente_seia",
    "src_id": "2718775",
    "dst_name": "expediente_fiscalizacion",
    "dst_id": "DFZ-2017-5452-IX-PC-EI",
    "src_hierarchy_level": 2,
    "dst_hierarchy_level": 4
  }
]
```

### Example 2: Specific Document Query

**User**: "What documents are connected to expediente SEIA 2718775-2456?"

**GPT Response**: "Here are the connections for expediente SEIA 2718775-2456:"

```json
[
  {
    "src_name": "id_uf",
    "src_id": "2456",
    "dst_name": "expediente_seia",
    "dst_id": "2718775-2456",
    "src_hierarchy_level": 1,
    "dst_hierarchy_level": 2
  },
  {
    "src_name": "expediente_seia",
    "src_id": "2718775-2456",
    "dst_name": "expediente_snifa",
    "dst_id": "F-034-2016",
    "src_hierarchy_level": 2,
    "dst_hierarchy_level": 5
  },
  {
    "src_name": "expediente_fiscalizacion",
    "src_id": "DFZ-2017-5452-IX-PC-EI",
    "dst_name": "expediente_seia",
    "dst_id": "2718775",
    "src_hierarchy_level": 4,
    "dst_hierarchy_level": 2
  }
]
```

## Document Type Mappings

The widget recognizes these document types:

- `id_uf` → ID UF (Root level)
- `expediente_seia` → Expediente SEIA
- `expediente_snifa` → Expediente SNIFA
- `expediente_fiscalizacion` → Expediente Fiscalización
- `expediente_medida` → Expediente Medida
- Any other type → Instrumento Aplicable

## Hierarchy Levels

- **Level 1**: Root (ID UF)
- **Level 2**: SEIA documents
- **Level 4**: Fiscalización documents
- **Level 5**: SNIFA documents

## Interactive Features

When viewing the widget:
1. Click any document to see its connections highlighted
2. Connected documents will show colored borders and connecting lines
3. Click again to deselect and reset the view
4. Use the theme toggle to switch between light and dark modes

## Integration Notes

- The widget automatically processes the edge data to build a node graph
- Bidirectional connections are automatically established
- The widget groups documents by type for easy browsing
- Statistics are automatically calculated and displayed
