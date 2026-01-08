import React, { useEffect, useState, useCallback } from 'react';
import { ThemeColors, NodeData, EdgeData } from './types';

interface ConnectionLinesProps {
    edges: EdgeData[];
    themeColors: ThemeColors;
    containerRef: React.RefObject<HTMLDivElement>;
    hoveredNode: NodeData | null;
    selectedNode: NodeData | null;
}

interface LineData {
    path: string;
    sourceKey: string;
    targetKey: string;
    isHovered: boolean;
}

/**
 * Get the exit/entry point on a box edge for 90-degree corner connections
 */
function getEdgePoint(
    rectLeft: number,
    rectTop: number,
    rectWidth: number,
    rectHeight: number,
    targetCenterX: number,
    targetCenterY: number,
    isSource: boolean
): { x: number; y: number } {
    const centerX = rectLeft + rectWidth / 2;
    const centerY = rectTop + rectHeight / 2;

    // Determine if we're going up or down
    const goingDown = targetCenterY > centerY;
    const goingRight = targetCenterX > centerX;

    if (isSource) {
        // For source, exit from bottom or top edge
        return {
            x: centerX,
            y: goingDown ? rectTop + rectHeight : rectTop
        };
    } else {
        // For target, enter from top or bottom edge
        return {
            x: centerX,
            y: goingDown ? rectTop : rectTop + rectHeight
        };
    }
}

/**
 * ConnectionLines Component
 * Draws SVG lines with 90-degree corners and arrows between connected nodes
 */
export function ConnectionLines({
    edges,
    themeColors,
    containerRef,
    hoveredNode,
    selectedNode
}: ConnectionLinesProps) {
    const [lines, setLines] = useState<LineData[]>([]);

    const calculateLines = useCallback(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const newLines: LineData[] = [];

        edges.forEach(edge => {
            // Skip id_uf connections
            if (edge.src_name === 'id_uf' || edge.dst_name === 'id_uf') return;

            const sourceKey = `${edge.src_name}:${edge.src_id}`;
            const targetKey = `${edge.dst_name}:${edge.dst_id}`;

            // Find source and target elements
            const sourceElement = container.querySelector(`[data-node-key="${sourceKey}"]`) as HTMLElement;
            const targetElement = container.querySelector(`[data-node-key="${targetKey}"]`) as HTMLElement;

            if (!sourceElement || !targetElement) return;

            const sourceRect = sourceElement.getBoundingClientRect();
            const targetRect = targetElement.getBoundingClientRect();

            // Calculate center points for direction determination
            const sourceCenterX = sourceRect.left + sourceRect.width / 2 - containerRect.left;
            const sourceCenterY = sourceRect.top + sourceRect.height / 2 - containerRect.top;
            const targetCenterX = targetRect.left + targetRect.width / 2 - containerRect.left;
            const targetCenterY = targetRect.top + targetRect.height / 2 - containerRect.top;

            // Get edge points instead of center points
            const sourceEdge = getEdgePoint(
                sourceRect.left - containerRect.left,
                sourceRect.top - containerRect.top,
                sourceRect.width,
                sourceRect.height,
                targetCenterX,
                targetCenterY,
                true
            );

            const targetEdge = getEdgePoint(
                targetRect.left - containerRect.left,
                targetRect.top - containerRect.top,
                targetRect.width,
                targetRect.height,
                sourceCenterX,
                sourceCenterY,
                false
            );

            // Determine if connection is hovered
            const hoveredKey = hoveredNode ? `${hoveredNode.name}:${hoveredNode.id}` : null;
            const selectedKey = selectedNode ? `${selectedNode.name}:${selectedNode.id}` : null;
            const activeKey = selectedKey || hoveredKey;
            const isHovered = activeKey === sourceKey || activeKey === targetKey;

            // Create path with 90-degree corners
            let path: string;

            // Calculate midpoint for the corner
            const midY = (sourceEdge.y + targetEdge.y) / 2;

            if (Math.abs(sourceEdge.x - targetEdge.x) < 50) {
                // Vertical connection
                path = `M ${sourceEdge.x},${sourceEdge.y} L ${targetEdge.x},${targetEdge.y}`;
            } else {
                // Use 90-degree corners
                // Go down/up from source, then horizontal, then down/up to target
                path = `M ${sourceEdge.x},${sourceEdge.y} L ${sourceEdge.x},${midY} L ${targetEdge.x},${midY} L ${targetEdge.x},${targetEdge.y}`;
            }

            newLines.push({
                path,
                sourceKey,
                targetKey,
                isHovered
            });
        });

        setLines(newLines);
    }, [edges, containerRef, hoveredNode, selectedNode]);

    useEffect(() => {
        calculateLines();

        // Recalculate on window resize and scroll
        const handleUpdate = () => calculateLines();
        window.addEventListener('resize', handleUpdate);
        window.addEventListener('scroll', handleUpdate, true);

        // Also listen for container scroll
        const scrollHandler = () => calculateLines();
        const scrollableContainer = containerRef.current;
        if (scrollableContainer) {
            scrollableContainer.addEventListener('scroll', scrollHandler, true);
        }

        return () => {
            window.removeEventListener('resize', handleUpdate);
            window.removeEventListener('scroll', handleUpdate, true);
            if (scrollableContainer) {
                scrollableContainer.removeEventListener('scroll', scrollHandler, true);
            }
        };
    }, [calculateLines, containerRef]);

    if (!containerRef.current || lines.length === 0) return null;

    return (
        <svg
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 10,
                overflow: 'visible'
            }}
        >
            {/* Define arrow markers */}
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path
                        d="M0,0 L0,6 L8,3 z"
                        fill={themeColors.purple}
                        opacity="0.3"
                    />
                </marker>
                <marker
                    id="arrowhead-hover"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path
                        d="M0,0 L0,6 L8,3 z"
                        fill={themeColors.purple}
                        opacity="0.7"
                    />
                </marker>
            </defs>

            {/* Draw lines */}
            {lines.map((line, index) => (
                <path
                    key={index}
                    d={line.path}
                    stroke={themeColors.purple}
                    strokeWidth={line.isHovered ? 2 : 1.5}
                    fill="none"
                    opacity={line.isHovered ? 0.7 : 0.3}
                    markerEnd={line.isHovered ? "url(#arrowhead-hover)" : "url(#arrowhead)"}
                    style={{
                        transition: 'all 0.2s ease'
                    }}
                />
            ))}
        </svg>
    );
}
