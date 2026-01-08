import React, { useEffect, useState } from 'react';
import { ThemeColors, NodeData } from './types';

interface ConnectionLinesProps {
    highlightedItems: Set<string>;
    themeColors: ThemeColors;
    containerRef: React.RefObject<HTMLDivElement>;
    selectedNode: NodeData | null;
}

interface LineCoordinates {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    key: string;
}

/**
 * Calculate the intersection point on the border of a rectangle
 */
function getBorderPoint(
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    targetX: number,
    targetY: number
): { x: number; y: number } {
    const dx = targetX - centerX;
    const dy = targetY - centerY;

    // Calculate angle
    const angle = Math.atan2(dy, dx);

    // Calculate intersection with rectangle border
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    let x: number, y: number;

    // Check which edge the line intersects
    if (Math.abs(cos) > Math.abs(sin * (width / height))) {
        // Intersects left or right edge
        x = centerX + (width / 2) * Math.sign(cos);
        y = centerY + (width / 2) * Math.tan(angle) * Math.sign(cos);
    } else {
        // Intersects top or bottom edge
        y = centerY + (height / 2) * Math.sign(sin);
        x = centerX + (height / 2) / Math.tan(angle) * Math.sign(sin);
    }

    return { x, y };
}

/**
 * ConnectionLines Component
 * Renders SVG lines between connected nodes
 */
export function ConnectionLines({
    highlightedItems,
    themeColors,
    containerRef,
    selectedNode
}: ConnectionLinesProps) {
    const [lines, setLines] = useState<LineCoordinates[]>([]);

    useEffect(() => {
        if (!containerRef.current || highlightedItems.size === 0 || !selectedNode) {
            setLines([]);
            return;
        }

        const updateLines = () => {
            const container = containerRef.current;
            if (!container) return;

            const containerRect = container.getBoundingClientRect();
            const newLines: LineCoordinates[] = [];

            // Get the selected node's connections
            const selectedKey = `${selectedNode.name}:${selectedNode.id}`;

            // Only draw lines from selected node to its direct connections
            selectedNode.connections.forEach(connKey => {
                // Skip if connection is to id_uf
                if (connKey.startsWith('id_uf:')) return;

                // Find the DOM elements
                const element1 = container.querySelector(`[data-node-key="${selectedKey}"]`);
                const element2 = container.querySelector(`[data-node-key="${connKey}"]`);

                if (element1 && element2) {
                    const rect1 = element1.getBoundingClientRect();
                    const rect2 = element2.getBoundingClientRect();

                    // Calculate center points relative to container
                    const center1X = rect1.left + rect1.width / 2 - containerRect.left;
                    const center1Y = rect1.top + rect1.height / 2 - containerRect.top;
                    const center2X = rect2.left + rect2.width / 2 - containerRect.left;
                    const center2Y = rect2.top + rect2.height / 2 - containerRect.top;

                    // Calculate border intersection points
                    const point1 = getBorderPoint(
                        center1X,
                        center1Y,
                        rect1.width,
                        rect1.height,
                        center2X,
                        center2Y
                    );

                    const point2 = getBorderPoint(
                        center2X,
                        center2Y,
                        rect2.width,
                        rect2.height,
                        center1X,
                        center1Y
                    );

                    newLines.push({
                        x1: point1.x,
                        y1: point1.y,
                        x2: point2.x,
                        y2: point2.y,
                        key: `${selectedKey}-${connKey}`
                    });
                }
            });

            setLines(newLines);
        };

        updateLines();

        // Update lines on scroll
        const scrollContainer = containerRef.current?.querySelector('[style*="overflowX"]');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', updateLines);
            return () => scrollContainer.removeEventListener('scroll', updateLines);
        }
    }, [highlightedItems, containerRef, selectedNode]);

    if (lines.length === 0) {
        return null;
    }

    return (
        <svg
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 10
            }}
        >
            {lines.map((line) => (
                <line
                    key={line.key}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke={themeColors.purple}
                    strokeWidth={2}
                    strokeOpacity={0.6}
                />
            ))}
        </svg>
    );
}
