import React, { useState } from 'react';
import { ThemeColors, TimeSeriesData, GRAVEDAD_COLORS, GRAVEDAD_ORDER } from './types';

interface LineChartProps {
    title: string;
    data: TimeSeriesData[];
    themeColors: ThemeColors;
    height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
    title,
    data,
    themeColors,
    height = 400
}) => {
    const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
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

    // Chart dimensions
    const chartWidth = 900;
    const chartHeight = height;
    const chartPadding = { top: 60, right: 60, bottom: 60, left: 80 };
    const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
    const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

    // Calculate scales
    const years = data.map(d => d.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    // Find max value across all gravedad types
    const maxValue = Math.max(
        ...data.map(d =>
            Math.max(...GRAVEDAD_ORDER.map(g => d.byGravedad[g] || 0))
        )
    );

    // Scale functions
    const xScale = (year: number) => {
        return chartPadding.left + ((year - minYear) / (maxYear - minYear)) * plotWidth;
    };

    const yScale = (value: number) => {
        return chartPadding.top + plotHeight - (value / maxValue) * plotHeight;
    };

    // Generate grid lines
    const gridLines = 5;
    const yTicks = Array.from({ length: gridLines }, (_, i) => ({
        value: Math.round((maxValue / (gridLines - 1)) * i),
        y: chartPadding.top + plotHeight - (i / (gridLines - 1)) * plotHeight
    }));

    // Generate paths for each gravedad type
    const generatePath = (gravedad: string) => {
        const points = data.map(d => ({
            x: xScale(d.year),
            y: yScale(d.byGravedad[gravedad as keyof typeof d.byGravedad] || 0)
        }));

        return points.map((p, i) => {
            if (i === 0) return `M ${p.x} ${p.y}`;
            return `L ${p.x} ${p.y}`;
        }).join(' ');
    };

    const handlePointHover = (year: number, gravedad: string, value: number, event: React.MouseEvent) => {
        setHoveredPoint(`${year}-${gravedad}`);
        setTooltipData({
            x: event.clientX,
            y: event.clientY,
            content: `Año: ${year}\n${gravedad}: ${value.toLocaleString()}`
        });
    };

    const handlePointLeave = () => {
        setHoveredPoint(null);
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

            <svg width={chartWidth} height={chartHeight} style={{ display: 'block' }}>
                {/* Legend */}
                <text
                    x={chartPadding.left}
                    y={25}
                    fill={themeColors.textSecondary}
                    fontSize={11}
                    fontWeight={500}
                >
                    clasificacion_gravedad:
                </text>

                {GRAVEDAD_ORDER.map((gravedad, idx) => (
                    <g key={gravedad} transform={`translate(${chartPadding.left + 160 + idx * 100}, 20)`}>
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

                {/* Grid lines */}
                {yTicks.map((tick, i) => (
                    <g key={i}>
                        <line
                            x1={chartPadding.left}
                            y1={tick.y}
                            x2={chartWidth - chartPadding.right}
                            y2={tick.y}
                            stroke={themeColors.gridLine}
                            strokeWidth={1}
                            opacity={0.3}
                        />
                        <text
                            x={chartPadding.left - 10}
                            y={tick.y}
                            fill={themeColors.textSecondary}
                            fontSize={10}
                            textAnchor="end"
                            dominantBaseline="middle"
                        >
                            {tick.value}
                        </text>
                    </g>
                ))}

                {/* X-axis labels */}
                {data.map((d, i) => {
                    // Show every 2nd year to avoid crowding
                    if (i % 2 !== 0) return null;
                    const x = xScale(d.year);
                    return (
                        <text
                            key={d.year}
                            x={x}
                            y={chartHeight - chartPadding.bottom + 20}
                            fill={themeColors.text}
                            fontSize={11}
                            textAnchor="middle"
                        >
                            {d.year}
                        </text>
                    );
                })}

                {/* Axis label */}
                <text
                    x={chartWidth / 2}
                    y={chartHeight - 10}
                    fill={themeColors.textSecondary}
                    fontSize={11}
                    textAnchor="middle"
                >
                    Año
                </text>

                <text
                    x={20}
                    y={chartHeight / 2}
                    fill={themeColors.textSecondary}
                    fontSize={11}
                    textAnchor="middle"
                    transform={`rotate(-90, 20, ${chartHeight / 2})`}
                >
                    Recuento de clasificacion_gravedad
                </text>

                {/* Lines for each gravedad */}
                {GRAVEDAD_ORDER.map(gravedad => {
                    const path = generatePath(gravedad);
                    return (
                        <path
                            key={gravedad}
                            d={path}
                            fill="none"
                            stroke={GRAVEDAD_COLORS[gravedad]}
                            strokeWidth={2}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    );
                })}

                {/* Points for each gravedad */}
                {data.map(d => (
                    GRAVEDAD_ORDER.map(gravedad => {
                        const value = d.byGravedad[gravedad] || 0;
                        if (value === 0) return null;

                        const x = xScale(d.year);
                        const y = yScale(value);
                        const isHovered = hoveredPoint === `${d.year}-${gravedad}`;

                        return (
                            <circle
                                key={`${d.year}-${gravedad}`}
                                cx={x}
                                cy={y}
                                r={isHovered ? 6 : 4}
                                fill={GRAVEDAD_COLORS[gravedad]}
                                stroke={themeColors.cardBackground}
                                strokeWidth={isHovered ? 2 : 1}
                                onMouseEnter={(e) => handlePointHover(d.year, gravedad, value, e)}
                                onMouseLeave={handlePointLeave}
                                style={{ cursor: 'pointer' }}
                            />
                        );
                    })
                ))}
            </svg>

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
