import React, { useState } from 'react';
import { ThemeColors, AggregatedData, GRAVEDAD_COLORS, GRAVEDAD_ORDER } from './types';

interface HorizontalStackedBarplotProps {
    title: string;
    data: AggregatedData[];
    themeColors: ThemeColors;
    height?: number;
}

export const HorizontalStackedBarplot: React.FC<HorizontalStackedBarplotProps> = ({
    title,
    data,
    themeColors,
    height = 400
}) => {
    const [hoveredBar, setHoveredBar] = useState<string | null>(null);
    const [tooltipData, setTooltipData] = useState<{ x: number; y: number; content: string } | null>(null);

    if (!data || data.length === 0) {
        return (
            <div style={{
                backgroundColor: themeColors.cardBackground,
                borderRadius: 8,
                padding: 16,
                border: `1px solid ${themeColors.cardBorder}`,
                textAlign: 'center',
                color: themeColors.textSecondary
            }}>
                No hay datos disponibles
            </div>
        );
    }

    // Calculate max total for scaling
    const maxTotal = Math.max(...data.map(d => d.count));

    // Chart dimensions
    const chartWidth = 800;
    const chartHeight = Math.max(height, data.length * 30);
    const barHeight = 20;
    const barSpacing = 8;
    const labelWidth = 200;
    const chartPadding = { top: 40, right: 80, bottom: 20, left: labelWidth };

    const handleMouseEnter = (category: string, gravedad: string, count: number, event: React.MouseEvent) => {
        setHoveredBar(`${category}-${gravedad}`);
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipData({
            x: event.clientX,
            y: event.clientY,
            content: `${category}\n${gravedad}: ${count.toLocaleString()}`
        });
    };

    const handleMouseLeave = () => {
        setHoveredBar(null);
        setTooltipData(null);
    };

    return (
        <div style={{
            backgroundColor: themeColors.cardBackground,
            borderRadius: 8,
            padding: 16,
            border: `1px solid ${themeColors.cardBorder}`,
            position: 'relative'
        }}>
            <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: themeColors.text,
                marginBottom: 16
            }}>
                {title}
            </div>

            <div style={{ position: 'relative', overflowX: 'auto' }}>
                <svg width={chartWidth} height={chartHeight} style={{ display: 'block' }}>
                    {/* Title and legend */}
                    <text
                        x={chartPadding.left}
                        y={15}
                        fill={themeColors.textSecondary}
                        fontSize={11}
                        fontWeight={500}
                    >
                        clasificacion_gravedad:
                    </text>

                    {/* Legend */}
                    {GRAVEDAD_ORDER.map((gravedad, idx) => (
                        <g key={gravedad} transform={`translate(${chartPadding.left + 160 + idx * 100}, 10)`}>
                            <circle
                                cx={0}
                                cy={0}
                                r={5}
                                fill={GRAVEDAD_COLORS[gravedad]}
                            />
                            <text
                                x={10}
                                y={4}
                                fill={themeColors.text}
                                fontSize={10}
                            >
                                {gravedad}
                            </text>
                        </g>
                    ))}

                    {/* Bars */}
                    {data.map((item, idx) => {
                        const y = chartPadding.top + idx * (barHeight + barSpacing);
                        let xOffset = chartPadding.left;

                        return (
                            <g key={item.category}>
                                {/* Category label */}
                                <text
                                    x={chartPadding.left - 10}
                                    y={y + barHeight / 2}
                                    fill={themeColors.text}
                                    fontSize={11}
                                    textAnchor="end"
                                    dominantBaseline="middle"
                                >
                                    {item.category.length > 25
                                        ? item.category.substring(0, 25) + '...'
                                        : item.category}
                                </text>

                                {/* Stacked segments */}
                                {GRAVEDAD_ORDER.map(gravedad => {
                                    const count = item.byGravedad[gravedad] || 0;
                                    if (count === 0) return null;

                                    const segmentWidth = (count / maxTotal) * (chartWidth - chartPadding.left - chartPadding.right);
                                    const segment = (
                                        <rect
                                            key={gravedad}
                                            x={xOffset}
                                            y={y}
                                            width={segmentWidth}
                                            height={barHeight}
                                            fill={GRAVEDAD_COLORS[gravedad]}
                                            opacity={hoveredBar === `${item.category}-${gravedad}` ? 1 : 0.85}
                                            onMouseEnter={(e) => handleMouseEnter(item.category, gravedad, count, e)}
                                            onMouseLeave={handleMouseLeave}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    );

                                    xOffset += segmentWidth;
                                    return segment;
                                })}

                                {/* Total count label */}
                                <text
                                    x={xOffset + 5}
                                    y={y + barHeight / 2}
                                    fill={themeColors.text}
                                    fontSize={10}
                                    dominantBaseline="middle"
                                >
                                    {item.count.toLocaleString()}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Tooltip */}
            {tooltipData && (
                <div style={{
                    position: 'fixed',
                    left: tooltipData.x + 10,
                    top: tooltipData.y - 10,
                    backgroundColor: themeColors.cardBackground,
                    border: `1px solid ${themeColors.border}`,
                    borderRadius: 4,
                    padding: '8px 12px',
                    fontSize: 12,
                    color: themeColors.text,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    pointerEvents: 'none',
                    zIndex: 10000,
                    whiteSpace: 'pre-line'
                }}>
                    {tooltipData.content}
                </div>
            )}
        </div>
    );
};
