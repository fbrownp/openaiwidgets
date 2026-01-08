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

    // Handle item click
    const handleItemClick = (item: NodeData) => {
        // If clicking the same item, deselect it
        if (selectedNode?.id === item.id && selectedNode?.name === item.name) {
            setSelectedNode(null);
        } else {
            setSelectedNode(item);
        }
    };

    // Define the order of node types to display (excluding id_uf)
    const nodeTypeOrder = [
        'expediente_seia',
        'expediente_medida',
        'expediente_fiscalizacion',
        'expediente_snifa',
        'instrumento_aplicable'
    ];

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
            <div style={{ marginBottom: 24 }}>
                <h1 style={{
                    margin: 0,
                    fontSize: 28,
                    fontWeight: 700,
                    color: themeColors.text,
                    marginBottom: 4
                }}>
                    Árbol de Expedientes {treeData.id_uf ? `- UF ${treeData.id_uf}` : ''}
                </h1>
                <p style={{
                    margin: 0,
                    fontSize: 14,
                    color: themeColors.textSecondary
                }}>
                    {selectedNode
                        ? `Mostrando conexiones para: ${selectedNode.id}`
                        : 'Haz clic en un elemento para ver sus conexiones'
                    }
                </p>
            </div>

            {/* Summary Statistics */}
            <div style={{
                marginBottom: 24,
                padding: 16,
                backgroundColor: themeColors.cardBackground,
                border: `1px solid ${themeColors.cardBorder}`,
                borderRadius: 12
            }}>
                <h3 style={{
                    margin: 0,
                    marginBottom: 12,
                    fontSize: 16,
                    fontWeight: 600,
                    color: themeColors.text
                }}>
                    Resumen
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: 12
                }}>
                    {Array.from(treeData.nodes.entries())
                        .filter(([type]) => type !== 'id_uf')
                        .map(([type, nodes]) => (
                        <div key={type} style={{
                            padding: 12,
                            borderRadius: 8,
                            backgroundColor: themeColors.background
                        }}>
                            <div style={{
                                fontSize: 12,
                                color: themeColors.textSecondary,
                                marginBottom: 4
                            }}>
                                {getNodeTypeDisplayName(type)}
                            </div>
                            <div style={{
                                fontSize: 20,
                                fontWeight: 600,
                                color: themeColors.purple
                            }}>
                                {nodes.length}
                            </div>
                        </div>
                    ))}
                    <div style={{
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: themeColors.background
                    }}>
                        <div style={{
                            fontSize: 12,
                            color: themeColors.textSecondary,
                            marginBottom: 4
                        }}>
                            Conexiones Totales
                        </div>
                        <div style={{
                            fontSize: 20,
                            fontWeight: 600,
                            color: themeColors.purple
                        }}>
                            {treeData.edges.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards Container with Connection Lines */}
            <div
                ref={containerRef}
                style={{
                    position: 'relative'
                }}
            >
                {/* Tree Cards - Horizontal Layout */}
                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    gap: 16,
                    overflowX: 'auto',
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
                                selectedItem={selectedNode}
                                highlightedItems={highlightedItems}
                            />
                        );
                    })}
                </div>

                {/* Connection Lines SVG - Rendered after cards to appear on top */}
                <ConnectionLines
                    highlightedItems={highlightedItems}
                    themeColors={themeColors}
                    containerRef={containerRef}
                />
            </div>
        </div>
    );
}
