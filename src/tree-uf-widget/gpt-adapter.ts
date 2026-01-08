/**
 * GPT Adapter for Tree UF Widget
 * Processes GPT output into a format suitable for the widget
 */

import { EdgeData, NodeData, TreeData } from './types';
import { GPTOutput } from './gpt-types';

/**
 * Dummy data for demonstration when no GPT output is available
 */
const DUMMY_DATA: GPTOutput = [
    {
        src_name: 'id_uf',
        src_id: '2456',
        dst_name: 'expediente_snifa',
        dst_id: 'F-034-2016',
        src_hierarchy_level: 1,
        dst_hierarchy_level: 5
    },
    {
        src_name: 'expediente_seia',
        src_id: '2718775-2456',
        dst_name: 'expediente_snifa',
        dst_id: 'F-034-2016',
        src_hierarchy_level: 2,
        dst_hierarchy_level: 5
    },
    {
        src_name: 'expediente_seia',
        src_id: '6336-2456',
        dst_name: 'expediente_snifa',
        dst_id: 'F-034-2016',
        src_hierarchy_level: 2,
        dst_hierarchy_level: 5
    },
    {
        src_name: 'expediente_fiscalizacion',
        src_id: 'DFZ-2017-5452-IX-PC-EI',
        dst_name: 'expediente_seia',
        dst_id: '2718775',
        src_hierarchy_level: 4,
        dst_hierarchy_level: 2
    },
    {
        src_name: 'expediente_fiscalizacion',
        src_id: 'DFZ-2017-5452-IX-PC-EI',
        dst_name: 'expediente_seia',
        dst_id: '6336',
        src_hierarchy_level: 4,
        dst_hierarchy_level: 2
    },
    {
        src_name: 'id_uf',
        src_id: '2456',
        dst_name: 'expediente_seia',
        dst_id: '6336',
        src_hierarchy_level: 1,
        dst_hierarchy_level: 2
    },
    {
        src_name: 'id_uf',
        src_id: '2456',
        dst_name: 'expediente_seia',
        dst_id: '2718775',
        src_hierarchy_level: 1,
        dst_hierarchy_level: 2
    },
    {
        src_name: 'NE:46/2002',
        src_id: 'NE:46/2002-2456',
        dst_name: 'expediente_snifa',
        dst_id: 'F-034-2023',
        src_hierarchy_level: 2,
        dst_hierarchy_level: 5
    },
    {
        src_name: 'id_uf',
        src_id: '2456',
        dst_name: 'expediente_snifa',
        dst_id: 'F-034-2023',
        src_hierarchy_level: 1,
        dst_hierarchy_level: 5
    },
    {
        src_name: 'expediente_fiscalizacion',
        src_id: 'DFZ-2017-5452-IX-PC-EI',
        dst_name: 'expediente_snifa',
        dst_id: 'F-034-2016',
        src_hierarchy_level: 4,
        dst_hierarchy_level: 5
    }
];

/**
 * Normalize node type names according to hierarchy rules
 */
function normalizeNodeType(name: string): string {
    const knownTypes = [
        'id_uf',
        'expediente_seia',
        'expediente_snifa',
        'expediente_medida',
        'expediente_fiscalizacion'
    ];

    if (knownTypes.includes(name)) {
        return name;
    }

    return 'instrumento_aplicable';
}

/**
 * Get display name for node type
 */
export function getNodeTypeDisplayName(type: string): string {
    const displayNames: Record<string, string> = {
        'id_uf': 'ID UF',
        'expediente_seia': 'Expediente SEIA',
        'expediente_snifa': 'Expediente SNIFA',
        'expediente_medida': 'Expediente Medida',
        'expediente_fiscalizacion': 'Expediente Fiscalización',
        'instrumento_aplicable': 'Instrumento Aplicable'
    };

    return displayNames[type] || type;
}

/**
 * Parse GPT output and build tree data structure
 */
export function parseGPTOutput(toolOutput: unknown): TreeData {
    // Use dummy data if no valid tool output is provided
    let edges: GPTOutput;

    if (!toolOutput || !Array.isArray(toolOutput)) {
        console.warn('Invalid tool output:', toolOutput, '- Using dummy data for demonstration');
        edges = DUMMY_DATA;
    } else {
        edges = toolOutput as GPTOutput;
    }
    const nodesMap = new Map<string, NodeData>();
    let idUfValue = '';

    // First pass: collect all nodes from edges
    edges.forEach(edge => {
        const srcType = normalizeNodeType(edge.src_name);
        const dstType = normalizeNodeType(edge.dst_name);

        // Track id_uf value
        if (srcType === 'id_uf') {
            idUfValue = edge.src_id;
        }
        if (dstType === 'id_uf') {
            idUfValue = edge.dst_id;
        }

        // Create or update source node
        const srcKey = `${srcType}:${edge.src_id}`;
        if (!nodesMap.has(srcKey)) {
            nodesMap.set(srcKey, {
                name: srcType,
                id: edge.src_id,
                hierarchy_level: edge.src_hierarchy_level,
                connections: []
            });
        }

        // Create or update destination node
        const dstKey = `${dstType}:${edge.dst_id}`;
        if (!nodesMap.has(dstKey)) {
            nodesMap.set(dstKey, {
                name: dstType,
                id: edge.dst_id,
                hierarchy_level: edge.dst_hierarchy_level,
                connections: []
            });
        }

        // Add connections
        const srcNode = nodesMap.get(srcKey)!;
        const dstNode = nodesMap.get(dstKey)!;

        if (!srcNode.connections.includes(dstKey)) {
            srcNode.connections.push(dstKey);
        }
        if (!dstNode.connections.includes(srcKey)) {
            dstNode.connections.push(srcKey);
        }
    });

    // Group nodes by type
    const groupedNodes = new Map<string, NodeData[]>();
    nodesMap.forEach(node => {
        if (!groupedNodes.has(node.name)) {
            groupedNodes.set(node.name, []);
        }
        groupedNodes.get(node.name)!.push(node);
    });

    // Sort nodes within each group by ID
    groupedNodes.forEach(nodes => {
        nodes.sort((a, b) => a.id.localeCompare(b.id));
    });

    return {
        id_uf: idUfValue,
        nodes: groupedNodes,
        edges
    };
}

/**
 * Build direct connections for a selected node
 * Only returns directly connected nodes, not the full path
 */
export function buildConnectionPath(
    startNode: NodeData,
    allNodes: Map<string, NodeData[]>
): Set<string> {
    const highlighted = new Set<string>();
    const startKey = `${startNode.name}:${startNode.id}`;

    // Add the selected node itself
    highlighted.add(startKey);

    // Add only direct connections (one level deep)
    startNode.connections.forEach(connKey => {
        highlighted.add(connKey);
    });

    return highlighted;
}
