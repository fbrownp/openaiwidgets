import React, { useMemo, useState, useRef } from 'react';
import { parseGPTOutput, getNodeTypeDisplayName, buildConnectionPath } from './gpt-adapter';
import { ThemeColors, NodeData } from './types';
import { TreeCard } from './TreeCard';
import { ConnectionLines } from './ConnectionLines';

// Import hooks from parent directory
import { useOpenAiGlobal } from '../use-openai-global';

// Import shared theme
import { getThemeColors, DEFAULT_THEME, Theme } from '../widget_styles/theme';

export function Dashboard() {
    // Theme state
    const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
    const themeColors = getThemeColors(theme) as ThemeColors;

    // Selected node state
    const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

    // Hovered node state
    const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);

    // Container ref for calculating line positions
    const containerRef = useRef<HTMLDivElement>(null);

    // Get tool output from OpenAI
    const toolOutput = useOpenAiGlobal('toolOutput');

    // Parse GPT output into tree data
    const treeData = useMemo(() => {
        return parseGPTOutput(toolOutput);
    }, [toolOutput]);

    // Calculate highlighted items based on selected node
    const highlightedItems = useMemo(() => {
        if (!selectedNode) {
            return new Set<string>();
        }
        return buildConnectionPath(selectedNode, treeData.nodes);
    }, [selectedNode, treeData.nodes]);

    // Calculate hovered items based on hovered node
    const hoveredItems = useMemo(() => {
        if (!hoveredNode || selectedNode) {
            return new Set<string>();
        }
        return buildConnectionPath(hoveredNode, treeData.nodes);
    }, [hoveredNode, selectedNode, treeData.nodes]);

    // Handle item click - opens the relationship panel
    const handleItemClick = (item: NodeData) => {
        setSelectedNode(item);
    };

    // Handle item hover
    const handleItemHover = (item: NodeData | null) => {
        setHoveredNode(item);
    };

    // Define the order of node types to display (excluding id_uf, instrumento_aplicable, and expediente_fiscalizacion)
    const nodeTypeOrder = [
        'expediente_seia',
        'expediente_medida',
        'expediente_snifa'
    ];

    // Get instrumento_aplicable nodes for chips
    const instrumentoNodes = treeData.nodes.get('instrumento_aplicable') || [];

    // Get expediente_fiscalizacion nodes for separate section
    const fiscalizacionNodes = treeData.nodes.get('expediente_fiscalizacion') || [];

    return (
        <div style={{
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundColor: themeColors.background,
            minHeight: '100vh',
            padding: 24,
            position: 'relative'
        }}>
            {/* Theme Toggle */}
            <div style={{
                display: 'flex',
                gap: 6,
                padding: 4,
                borderRadius: 8,
                width: 'fit-content',
                marginBottom: 20,
                backgroundColor: themeColors.cardBackground,
                border: `1px solid ${themeColors.cardBorder}`
            }}>
                <button
                    onClick={() => setTheme('light')}
                    style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 500,
                        transition: 'all 0.2s',
                        backgroundColor: theme === 'light' ? themeColors.purple : 'transparent',
                        color: theme === 'light' ? 'white' : themeColors.textSecondary
                    }}
                >
                    Claro
                </button>
                <button
                    onClick={() => setTheme('dark')}
                    style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 500,
                        transition: 'all 0.2s',
                        backgroundColor: theme === 'dark' ? themeColors.purple : 'transparent',
                        color: theme === 'dark' ? 'white' : themeColors.textSecondary
                    }}
                >
                    Oscuro
                </button>
            </div>

            {/* Header */}
            <div style={{ marginBottom: 16 }}>
                <h1 style={{
                    margin: 0,
                    fontSize: 28,
                    fontWeight: 700,
                    color: themeColors.text,
                    marginBottom: 8
                }}>
                    Árbol de Expedientes {treeData.id_uf ? `- UF ${treeData.id_uf}` : ''}
                </h1>

                {/* Instrumento Aplicable Chips */}
                {instrumentoNodes.length > 0 && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 8,
                        marginBottom: 12
                    }}>
                        {instrumentoNodes.map((node, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleItemClick(node)}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: selectedNode?.id === node.id && selectedNode?.name === node.name
                                        ? themeColors.purple
                                        : hoveredNode?.id === node.id && hoveredNode?.name === node.name
                                        ? themeColors.purple + '40'
                                        : themeColors.cardBackground,
                                    color: selectedNode?.id === node.id && selectedNode?.name === node.name
                                        ? 'white'
                                        : themeColors.text,
                                    border: `1px solid ${
                                        selectedNode?.id === node.id && selectedNode?.name === node.name
                                            ? themeColors.purple
                                            : themeColors.cardBorder
                                    }`,
                                    borderRadius: 20,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={() => setHoveredNode(node)}
                                onMouseLeave={() => setHoveredNode(null)}
                            >
                                {node.id}
                            </div>
                        ))}
                    </div>
                )}

                <p style={{
                    margin: 0,
                    fontSize: 14,
                    color: themeColors.textSecondary
                }}>
                    {selectedNode
                        ? `Mostrando relaciones para: ${selectedNode.id}`
                        : 'Haz clic en un elemento para ver sus relaciones'
                    }
                </p>
            </div>

            {/* Summary Statistics */}
            <div style={{
                marginBottom: 20,
                padding: 12,
                backgroundColor: themeColors.cardBackground,
                border: `1px solid ${themeColors.cardBorder}`,
                borderRadius: 10
            }}>
                <h3 style={{
                    margin: 0,
                    marginBottom: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    color: themeColors.text
                }}>
                    Resumen
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                    gap: 8
                }}>
                    {Array.from(treeData.nodes.entries())
                        .filter(([type]) => type !== 'id_uf')
                        .map(([type, nodes]) => (
                        <div key={type} style={{
                            padding: 8,
                            borderRadius: 6,
                            backgroundColor: themeColors.background
                        }}>
                            <div style={{
                                fontSize: 11,
                                color: themeColors.textSecondary,
                                marginBottom: 3
                            }}>
                                {getNodeTypeDisplayName(type)}
                            </div>
                            <div style={{
                                fontSize: 18,
                                fontWeight: 600,
                                color: themeColors.purple
                            }}>
                                {nodes.length}
                            </div>
                        </div>
                    ))}
                    <div style={{
                        padding: 8,
                        borderRadius: 6,
                        backgroundColor: themeColors.background
                    }}>
                        <div style={{
                            fontSize: 11,
                            color: themeColors.textSecondary,
                            marginBottom: 3
                        }}>
                            Conexiones Totales
                        </div>
                        <div style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: themeColors.purple
                        }}>
                            {treeData.edges.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Expediente Fiscalizacion Section - Horizontal */}
            {fiscalizacionNodes.length > 0 && (
                <div style={{
                    marginBottom: 20,
                    padding: 12,
                    backgroundColor: themeColors.cardBackground,
                    border: `1px solid ${themeColors.cardBorder}`,
                    borderRadius: 10
                }}>
                    <h3 style={{
                        margin: 0,
                        marginBottom: 10,
                        fontSize: 14,
                        fontWeight: 600,
                        color: themeColors.text
                    }}>
                        Expediente Fiscalización
                    </h3>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 8
                    }}>
                        {fiscalizacionNodes.map((node, idx) => {
                            const itemKey = `${node.name}:${node.id}`;
                            const isHighlighted = highlightedItems.has(itemKey);
                            const isHovered = hoveredItems.has(itemKey);

                            // Get related expedientes (excluding id_uf)
                            const relatedExpedientes = node.connections
                                .filter(connKey => !connKey.startsWith('id_uf:'))
                                .map(connKey => {
                                    const [type, id] = connKey.split(':');
                                    return { type, id };
                                });

                            return (
                                <div
                                    key={idx}
                                    data-node-key={itemKey}
                                    onClick={() => handleItemClick(node)}
                                    onMouseEnter={() => handleItemHover(node)}
                                    onMouseLeave={() => handleItemHover(null)}
                                    style={{
                                        padding: '10px 12px',
                                        backgroundColor: isHighlighted
                                            ? themeColors.purple + '10'
                                            : isHovered
                                            ? themeColors.purple + '05'
                                            : themeColors.background,
                                        border: `2px solid ${
                                            isHighlighted
                                                ? themeColors.purple
                                                : isHovered
                                                ? themeColors.purple + '40'
                                                : themeColors.cardBorder
                                        }`,
                                        borderRadius: 8,
                                        minWidth: 140,
                                        flex: '0 0 auto',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 6
                                    }}
                                >
                                    <div style={{
                                        fontSize: 12,
                                        fontWeight: 500,
                                        color: themeColors.text
                                    }}>
                                        {node.id}
                                    </div>
                                    {relatedExpedientes.length > 0 && (
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 4,
                                            paddingTop: 4,
                                            borderTop: `1px solid ${themeColors.cardBorder}`
                                        }}>
                                            {relatedExpedientes.map((rel, relIdx) => (
                                                <div
                                                    key={relIdx}
                                                    style={{
                                                        fontSize: 9,
                                                        padding: '2px 6px',
                                                        backgroundColor: themeColors.purple + '20',
                                                        color: themeColors.purple,
                                                        borderRadius: 4,
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {rel.id}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Tree Cards Container */}
            <div
                ref={containerRef}
                style={{
                    position: 'relative'
                }}
            >
                {/* Connection Lines */}
                <ConnectionLines
                    edges={treeData.edges}
                    themeColors={themeColors}
                    containerRef={containerRef}
                    hoveredNode={hoveredNode}
                    selectedNode={selectedNode}
                />

                {/* Tree Cards - Responsive Layout */}
                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 12,
                    paddingBottom: 8
                }}>
                    {nodeTypeOrder.map(nodeType => {
                        const nodes = treeData.nodes.get(nodeType);
                        if (!nodes || nodes.length === 0) {
                            return null;
                        }

                        return (
                            <TreeCard
                                key={nodeType}
                                title={getNodeTypeDisplayName(nodeType)}
                                items={nodes}
                                themeColors={themeColors}
                                onItemClick={handleItemClick}
                                onItemHover={handleItemHover}
                                selectedItem={null}
                                highlightedItems={highlightedItems}
                                hoveredItems={hoveredItems}
                                allNodes={treeData.nodes}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
