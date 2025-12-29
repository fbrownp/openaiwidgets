import React, { useState } from 'react';
import { BoxPlotProps } from './types';

export const BoxPlot: React.FC<BoxPlotProps> = ({
    title,
    rows,
    height = 400
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    if (!rows || rows.length === 0) {
        return (
            <div style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 24,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f0f0f0'
            }}>
                <div style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>
                    No data available
                </div>
            </div>
        );
    }

    const allValues = rows.flatMap(r => [r.min, r.max, ...(r.outliers || [])]);
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const range = maxValue - minValue;

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
    };

    // Purple gradient based on median value
    const getBoxColor = (medianValue: number) => {
        const intensity = (medianValue - minValue) / range;
        const hue = 270;
        const saturation = 60 + (intensity * 40);
        const lightness = 85 - (intensity * 35);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const paddingTop = 40;
    const paddingBottom = 40;
    const paddingLeft = 60;
    const paddingRight = 20;
    const availableHeight = height - paddingTop - paddingBottom;

    const valueToY = (value: number) => {
        return paddingTop + (1 - (value - minValue) / range) * availableHeight;
    };

    const handleBoxHover = (index: number, event: React.MouseEvent) => {
        setHoveredIndex(index);
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipPos({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
        });
    };

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f0f0f0',
            position: 'relative'
        }}>
            {/* Header */}
            <div style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#111827',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 4
            }}>
                {title}
                <span style={{ fontSize: 10, color: '#6b7280' }}>¹</span>
            </div>

            {/* Chart Container */}
            <div style={{
                position: 'relative',
                height: height,
                width: '100%'
            }}>
                {/* Y-axis */}
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: paddingTop,
                    bottom: paddingBottom,
                    width: paddingLeft - 10,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    fontSize: 11,
                    color: '#6b7280',
                    paddingRight: 8
                }}>
                    <span>{formatNumber(maxValue)}</span>
                    <span>{formatNumber(minValue + range * 0.75)}</span>
                    <span>{formatNumber(minValue + range * 0.5)}</span>
                    <span>{formatNumber(minValue + range * 0.25)}</span>
                    <span>{formatNumber(minValue)}</span>
                </div>

                {/* Grid lines */}
                <svg
                    style={{
                        position: 'absolute',
                        left: paddingLeft,
                        top: 0,
                        width: `calc(100% - ${paddingLeft + paddingRight}px)`,
                        height: height
                    }}
                >
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                        <line
                            key={i}
                            x1="0"
                            y1={paddingTop + availableHeight * (1 - ratio)}
                            x2="100%"
                            y2={paddingTop + availableHeight * (1 - ratio)}
                            stroke="#f0f0f0"
                            strokeWidth="1"
                            strokeDasharray="4,4"
                        />
                    ))}
                </svg>

                {/* Box Plots */}
                <svg
                    style={{
                        position: 'absolute',
                        left: paddingLeft,
                        top: 0,
                        width: `calc(100% - ${paddingLeft + paddingRight}px)`,
                        height: height
                    }}
                >
                    {rows.map((item, index) => {
                        const x = ((index + 0.5) / rows.length) * 100;
                        const boxWidth = Math.max(80 / rows.length, 20);

                        const minY = valueToY(item.min);
                        const maxY = valueToY(item.max);
                        const q1Y = valueToY(item.q1);
                        const q3Y = valueToY(item.q3);
                        const medianY = valueToY(item.median);

                        const boxHeight = q1Y - q3Y;
                        const color = getBoxColor(item.median);

                        return (
                            <g
                                key={index}
                                onMouseEnter={(e) => handleBoxHover(index, e as any)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Whisker lines (min to Q1, Q3 to max) */}
                                <line
                                    x1={`${x}%`}
                                    y1={minY}
                                    x2={`${x}%`}
                                    y2={q1Y}
                                    stroke="#9ca3af"
                                    strokeWidth="1.5"
                                    strokeDasharray="4,3"
                                    opacity={0.7}
                                />
                                <line
                                    x1={`${x}%`}
                                    y1={q3Y}
                                    x2={`${x}%`}
                                    y2={maxY}
                                    stroke="#9ca3af"
                                    strokeWidth="1.5"
                                    strokeDasharray="4,3"
                                    opacity={0.7}
                                />

                                {/* Min and Max caps */}
                                <line
                                    x1={`calc(${x}% - ${boxWidth / 4}px)`}
                                    y1={minY}
                                    x2={`calc(${x}% + ${boxWidth / 4}px)`}
                                    y2={minY}
                                    stroke="#9ca3af"
                                    strokeWidth="2"
                                    opacity={0.7}
                                />
                                <line
                                    x1={`calc(${x}% - ${boxWidth / 4}px)`}
                                    y1={maxY}
                                    x2={`calc(${x}% + ${boxWidth / 4}px)`}
                                    y2={maxY}
                                    stroke="#9ca3af"
                                    strokeWidth="2"
                                    opacity={0.7}
                                />

                                {/* Box (Q1 to Q3) - Main rectangular body */}
                                <rect
                                    x={`calc(${x}% - ${boxWidth / 2}px)`}
                                    y={q3Y}
                                    width={boxWidth}
                                    height={Math.max(boxHeight, 2)}
                                    fill={color}
                                    stroke="#7c3aed"
                                    strokeWidth="2.5"
                                    opacity={hoveredIndex === index ? 0.95 : 1}
                                    rx="4"
                                />

                                {/* Median line - Bold line across the box */}
                                <line
                                    x1={`calc(${x}% - ${boxWidth / 2}px)`}
                                    y1={medianY}
                                    x2={`calc(${x}% + ${boxWidth / 2}px)`}
                                    y2={medianY}
                                    stroke="#4c1d95"
                                    strokeWidth="3.5"
                                    opacity={1}
                                />

                                {/* Outliers - Individual points */}
                                {item.outliers && item.outliers.map((outlier, oi) => {
                                    const outlierY = valueToY(outlier);
                                    return (
                                        <circle
                                            key={oi}
                                            cx={`${x}%`}
                                            cy={outlierY}
                                            r="4"
                                            fill="none"
                                            stroke="#8b5cf6"
                                            strokeWidth="2"
                                            opacity={hoveredIndex === index ? 0.9 : 1}
                                        />
                                    );
                                })}
                            </g>
                        );
                    })}
                </svg>

                {/* X-axis labels */}
                <div style={{
                    position: 'absolute',
                    left: paddingLeft,
                    right: paddingRight,
                    bottom: 0,
                    height: paddingBottom,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around'
                }}>
                    {rows.map((item, index) => (
                        <span
                            key={index}
                            style={{
                                fontSize: 11,
                                color: '#6b7280',
                                fontWeight: 500,
                                textAlign: 'center',
                                flex: 1
                            }}
                        >
                            {item.period}
                        </span>
                    ))}
                </div>

                {/* X-axis line */}
                <div style={{
                    position: 'absolute',
                    left: paddingLeft,
                    right: paddingRight,
                    bottom: paddingBottom - 1,
                    height: 1,
                    backgroundColor: '#e5e7eb'
                }} />
            </div>

            {/* Tooltip */}
            {hoveredIndex !== null && (
                <div style={{
                    position: 'fixed',
                    left: tooltipPos.x,
                    top: tooltipPos.y,
                    transform: 'translate(-50%, -100%)',
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    color: 'white',
                    padding: '10px 14px',
                    borderRadius: 6,
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
                }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>
                        {rows[hoveredIndex].period}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px 12px' }}>
                        <span style={{ color: '#9ca3af' }}>Max:</span>
                        <span>{formatNumber(rows[hoveredIndex].max)}</span>
                        <span style={{ color: '#9ca3af' }}>Q3:</span>
                        <span>{formatNumber(rows[hoveredIndex].q3)}</span>
                        <span style={{ color: '#9ca3af' }}>Median:</span>
                        <span>{formatNumber(rows[hoveredIndex].median)}</span>
                        <span style={{ color: '#9ca3af' }}>Q1:</span>
                        <span>{formatNumber(rows[hoveredIndex].q1)}</span>
                        <span style={{ color: '#9ca3af' }}>Min:</span>
                        <span>{formatNumber(rows[hoveredIndex].min)}</span>
                        {rows[hoveredIndex].outliers && rows[hoveredIndex].outliers!.length > 0 && (
                            <>
                                <span style={{ color: '#9ca3af' }}>Outliers:</span>
                                <span>{rows[hoveredIndex].outliers!.length}</span>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
