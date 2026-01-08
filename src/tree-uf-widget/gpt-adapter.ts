/**
 * GPT Adapter for Tree UF Widget
 * Processes GPT output into a format suitable for the widget
 */

import { EdgeData, NodeData, TreeData } from './types';
import { GPTOutput } from './gpt-types';

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
    const defaultData: TreeData = {
        id_uf: '',
        nodes: new Map(),
        edges: []
    };

    if (!toolOutput || !Array.isArray(toolOutput)) {
        console.warn('Invalid tool output:', toolOutput);
        return defaultData;
    }

    const edges = toolOutput as GPTOutput;
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
 * Build the path of connected nodes from a starting node
 */
export function buildConnectionPath(
    startNode: NodeData,
    allNodes: Map<string, NodeData[]>
): Set<string> {
    const visited = new Set<string>();
    const queue: string[] = [`${startNode.name}:${startNode.id}`];

    while (queue.length > 0) {
        const currentKey = queue.shift()!;
        if (visited.has(currentKey)) continue;

        visited.add(currentKey);

        // Find the node
        const [type, id] = currentKey.split(':');
        const nodeGroup = allNodes.get(type);
        if (!nodeGroup) continue;

        const node = nodeGroup.find(n => n.id === id);
        if (!node) continue;

        // Add all connected nodes to queue
        node.connections.forEach(connKey => {
            if (!visited.has(connKey)) {
                queue.push(connKey);
            }
        });
    }

    return visited;
}
