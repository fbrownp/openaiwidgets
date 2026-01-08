import React from 'react';
import { ThemeColors, NodeData } from './types';

interface RelationshipPanelProps {
    selectedNode: NodeData | null;
    allNodes: Map<string, NodeData[]>;
    themeColors: ThemeColors;
    onClose: () => void;
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
    themeColors,
    onClose
}: RelationshipPanelProps) {
    if (!selectedNode) return null;

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
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: 24
        }}>
            <div style={{
                backgroundColor: themeColors.cardBackground,
                borderRadius: 16,
                padding: 32,
                maxWidth: 900,
                maxHeight: '90vh',
                width: '100%',
                overflowY: 'auto',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        padding: '8px 16px',
                        backgroundColor: themeColors.purple,
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 600
                    }}
                >
                    Cerrar
                </button>

                {/* Title */}
                <h2 style={{
                    margin: 0,
                    marginBottom: 32,
                    fontSize: 24,
                    fontWeight: 700,
                    color: themeColors.text
                }}>
                    Mapa de Relaciones: {selectedNode.id}
                </h2>

                {/* Main content area with hierarchy and fiscalizacion side by side */}
                <div style={{
                    display: 'flex',
                    gap: 32,
                    alignItems: 'flex-start'
                }}>
                    {/* Hierarchy tree */}
                    <div style={{ flex: 1 }}>
                        {[1, 2, 3].map(level => {
                            const nodes = hierarchyNodes.get(level);
                            if (!nodes || nodes.length === 0) return null;

                            return (
                                <div key={level} style={{ marginBottom: 24 }}>
                                    {/* Level nodes */}
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 12,
                                        justifyContent: 'center',
                                        marginBottom: level < 3 ? 16 : 0
                                    }}>
                                        {nodes.map((item, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    padding: '12px 16px',
                                                    backgroundColor: item.node.id === selectedNode.id
                                                        ? themeColors.purple + '20'
                                                        : themeColors.background,
                                                    border: `2px solid ${
                                                        item.node.id === selectedNode.id
                                                            ? themeColors.purple
                                                            : themeColors.cardBorder
                                                    }`,
                                                    borderRadius: 12,
                                                    minWidth: 150,
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <div style={{
                                                    fontSize: 11,
                                                    color: themeColors.textSecondary,
                                                    marginBottom: 4,
                                                    textTransform: 'uppercase',
                                                    fontWeight: 600
                                                }}>
                                                    {item.node.name.replace('expediente_', '').replace('_', ' ')}
                                                </div>
                                                <div style={{
                                                    fontSize: 13,
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
                                            height: 40,
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

                    {/* Fiscalizacion sidebar */}
                    {fiscalizacionNodes.length > 0 && (
                        <div style={{
                            width: 200,
                            borderLeft: `2px solid ${themeColors.cardBorder}`,
                            paddingLeft: 24
                        }}>
                            <div style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: themeColors.textSecondary,
                                marginBottom: 16,
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
                                        borderRadius: 10,
                                        marginBottom: 12,
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
        </div>
    );
}
