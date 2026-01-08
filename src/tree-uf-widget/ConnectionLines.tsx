import React, { useEffect, useState } from 'react';
import { ThemeColors } from './types';

interface ConnectionLinesProps {
    highlightedItems: Set<string>;
    themeColors: ThemeColors;
    containerRef: React.RefObject<HTMLDivElement>;
}

interface LineCoordinates {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    key: string;
}

/**
 * ConnectionLines Component
 * Renders SVG lines between connected nodes
 */
export function ConnectionLines({
    highlightedItems,
    themeColors,
    containerRef
}: ConnectionLinesProps) {
    const [lines, setLines] = useState<LineCoordinates[]>([]);

    useEffect(() => {
        if (!containerRef.current || highlightedItems.size === 0) {
            setLines([]);
            return;
        }

        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const newLines: LineCoordinates[] = [];

        // Get all highlighted nodes
        const highlightedNodes = Array.from(highlightedItems);

        // For each pair of highlighted nodes, check if they should be connected
        for (let i = 0; i < highlightedNodes.length; i++) {
            for (let j = i + 1; j < highlightedNodes.length; j++) {
                const node1Key = highlightedNodes[i];
                const node2Key = highlightedNodes[j];

                // Find the DOM elements
                const element1 = container.querySelector(`[data-node-key="${node1Key}"]`);
                const element2 = container.querySelector(`[data-node-key="${node2Key}"]`);

                if (element1 && element2) {
                    const rect1 = element1.getBoundingClientRect();
                    const rect2 = element2.getBoundingClientRect();

                    // Calculate center points relative to container
                    const x1 = rect1.left + rect1.width / 2 - containerRect.left;
                    const y1 = rect1.top + rect1.height / 2 - containerRect.top;
                    const x2 = rect2.left + rect2.width / 2 - containerRect.left;
                    const y2 = rect2.top + rect2.height / 2 - containerRect.top;

                    newLines.push({
                        x1,
                        y1,
                        x2,
                        y2,
                        key: `${node1Key}-${node2Key}`
                    });
                }
            }
        }

        setLines(newLines);
    }, [highlightedItems, containerRef]);

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
