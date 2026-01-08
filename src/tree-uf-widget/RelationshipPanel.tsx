import React from 'react';
import { ThemeColors, NodeData } from './types';

interface RelationshipPanelProps {
    selectedNode: NodeData | null;
    allNodes: Map<string, NodeData[]>;
    themeColors: ThemeColors;
}

interface HierarchyNode {
    node: NodeData;
    level: number;
}

/**
 * RelationshipPanel Component
 * Displays a vertical hierarchical tree of relationships for a selected node
 */
export function RelationshipPanel({
    selectedNode,
    allNodes,
    themeColors
}: RelationshipPanelProps) {
    if (!selectedNode) {
        return (
            <div style={{
                width: 350,
                flexShrink: 0,
                padding: 24,
                backgroundColor: themeColors.cardBackground,
                border: `1px solid ${themeColors.cardBorder}`,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <p style={{
                    color: themeColors.textSecondary,
                    fontSize: 14,
                    textAlign: 'center',
                    margin: 0
                }}>
                    Selecciona un elemento para ver el mapa de relaciones
                </p>
            </div>
        );
    }

    // Define hierarchy levels
    const hierarchyLevels: Record<string, number> = {
        'expediente_seia': 1,
        'instrumento_aplicable': 1,
        'expediente_medida': 2,
        'expediente_snifa': 3
    };

    // Build the relationship tree
    const buildRelationshipTree = (): {
        hierarchyNodes: Map<number, HierarchyNode[]>;
        fiscalizacionNodes: NodeData[];
    } => {
        const hierarchyNodes = new Map<number, HierarchyNode[]>();
        const fiscalizacionNodes: NodeData[] = [];
        const visited = new Set<string>();

        // Add the selected node
        const selectedKey = `${selectedNode.name}:${selectedNode.id}`;
        visited.add(selectedKey);

        // Helper to find node by key
        const findNodeByKey = (key: string): NodeData | null => {
            const [type, id] = key.split(':');
            const nodeGroup = allNodes.get(type);
            if (!nodeGroup) return null;
            return nodeGroup.find(n => n.id === id) || null;
        };

        // Add connected nodes
        selectedNode.connections.forEach(connKey => {
            if (connKey.startsWith('id_uf:') || visited.has(connKey)) return;

            const connNode = findNodeByKey(connKey);
            if (!connNode) return;

            visited.add(connKey);

            // Check if it's fiscalizacion (special case)
            if (connNode.name === 'expediente_fiscalizacion') {
                fiscalizacionNodes.push(connNode);
            } else {
                const level = hierarchyLevels[connNode.name] || 2;
                if (!hierarchyNodes.has(level)) {
                    hierarchyNodes.set(level, []);
                }
                hierarchyNodes.get(level)!.push({ node: connNode, level });
            }
        });

        // Add the selected node to appropriate level
        if (selectedNode.name === 'expediente_fiscalizacion') {
            fiscalizacionNodes.unshift(selectedNode);
        } else {
            const level = hierarchyLevels[selectedNode.name] || 2;
            if (!hierarchyNodes.has(level)) {
                hierarchyNodes.set(level, []);
            }
            hierarchyNodes.get(level)!.unshift({ node: selectedNode, level });
        }

        return { hierarchyNodes, fiscalizacionNodes };
    };

    const { hierarchyNodes, fiscalizacionNodes } = buildRelationshipTree();

    return (
        <div style={{
            width: 350,
            flexShrink: 0,
            padding: 20,
            backgroundColor: themeColors.cardBackground,
            border: `1px solid ${themeColors.cardBorder}`,
            borderRadius: 12,
            maxHeight: '80vh',
            overflowY: 'auto',
            transition: 'all 0.3s ease'
        }}>
            {/* Title */}
            <h3 style={{
                margin: 0,
                marginBottom: 20,
                fontSize: 16,
                fontWeight: 700,
                color: themeColors.text
            }}>
                Mapa de Relaciones
            </h3>

            <div style={{
                fontSize: 13,
                color: themeColors.textSecondary,
                marginBottom: 16,
                padding: 10,
                backgroundColor: themeColors.background,
                borderRadius: 8
            }}>
                <strong style={{ color: themeColors.purple }}>{selectedNode.id}</strong>
            </div>

            {/* Main content area with hierarchy and fiscalizacion */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
            }}>
                {/* Hierarchy tree */}
                <div style={{ flex: 1 }}>
                    {[1, 2, 3].map(level => {
                        const nodes = hierarchyNodes.get(level);
                        if (!nodes || nodes.length === 0) return null;

                        return (
                            <div key={level} style={{ marginBottom: 16 }}>
                                {/* Level nodes */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 8,
                                    marginBottom: level < 3 ? 12 : 0
                                }}>
                                    {nodes.map((item, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                padding: '10px 12px',
                                                backgroundColor: item.node.id === selectedNode.id
                                                    ? themeColors.purple + '20'
                                                    : themeColors.background,
                                                border: `2px solid ${
                                                    item.node.id === selectedNode.id
                                                        ? themeColors.purple
                                                        : themeColors.cardBorder
                                                }`,
                                                borderRadius: 8
                                            }}
                                        >
                                            <div style={{
                                                fontSize: 10,
                                                color: themeColors.textSecondary,
                                                marginBottom: 3,
                                                textTransform: 'uppercase',
                                                fontWeight: 600
                                            }}>
                                                {item.node.name.replace('expediente_', '').replace('_', ' ')}
                                            </div>
                                            <div style={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: themeColors.text
                                            }}>
                                                {item.node.id}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Connector line to next level */}
                                {level < 3 && hierarchyNodes.get(level + 1) && (
                                    <div style={{
                                        height: 20,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{
                                            width: 2,
                                            height: '100%',
                                            backgroundColor: themeColors.purple,
                                            opacity: 0.3
                                        }} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Fiscalizacion section */}
                {fiscalizacionNodes.length > 0 && (
                    <div style={{
                        borderTop: `2px solid ${themeColors.cardBorder}`,
                        paddingTop: 16
                    }}>
                        <div style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: themeColors.textSecondary,
                            marginBottom: 12,
                            textTransform: 'uppercase'
                        }}>
                            Fiscalización
                        </div>
                        {fiscalizacionNodes.map((node, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: '10px 12px',
                                    backgroundColor: node.id === selectedNode.id
                                        ? themeColors.purple + '20'
                                        : themeColors.background,
                                    border: `2px solid ${
                                        node.id === selectedNode.id
                                            ? themeColors.purple
                                            : themeColors.cardBorder
                                    }`,
                                    borderRadius: 8,
                                    marginBottom: 8,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: themeColors.text
                                }}
                            >
                                {node.id}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
