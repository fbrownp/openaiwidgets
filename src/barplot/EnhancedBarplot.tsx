import React, { useState } from 'react';
import { BarplotProps } from './types';

export const EnhancedBarplot: React.FC<BarplotProps> = ({
    title,
    metricOptions,
    selectedMetric,
    rows,
    onMetricChange,
    twoWayPlot = false,
    showYAxis = true,
    height = 300
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

    const values = rows.map(d => d[selectedMetric] as number);
    const maxValue = Math.max(...values);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
    };

    const getBarColor = (value: number) => {
        const intensity = value / maxValue;
        const hue = 270;
        const saturation = 60 + (intensity * 40);
        const lightness = 95 - (intensity * 45);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const paddingTop = 40;
    const paddingBottom = 40;
    const paddingLeft = showYAxis ? 60 : 20;
    const paddingRight = 20;
    const availableHeight = height - paddingTop - paddingBottom;

    const handleBarHover = (index: number, event: React.MouseEvent) => {
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
                flexWrap: 'wrap',
                gap: 12
            }}>
                <div style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                }}>
                    {title}
                    <span style={{ fontSize: 10, color: '#6b7280' }}>¹</span>
                </div>
            </div>

            {/* Chart Container */}
            <div style={{
                position: 'relative',
                height: height,
                width: '100%'
            }}>
                {showYAxis && (
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
                        <span>{formatNumber(maxValue * 0.75)}</span>
                        <span>{formatNumber(maxValue * 0.5)}</span>
                        <span>{formatNumber(maxValue * 0.25)}</span>
                        <span>0</span>
                    </div>
                )}

                <svg
                    style={{
                        position: 'absolute',
                        left: paddingLeft,
                        top: paddingTop,
                        width: `calc(100% - ${paddingLeft + paddingRight}px)`,
                        height: availableHeight,
                        pointerEvents: 'none'
                    }}
                >
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                        <line
                            key={i}
                            x1="0"
                            y1={availableHeight * (1 - ratio)}
                            x2="100%"
                            y2={availableHeight * (1 - ratio)}
                            stroke="#f0f0f0"
                            strokeWidth="1"
                            strokeDasharray="4,4"
                        />
                    ))}
                </svg>

                <div style={{
                    position: 'absolute',
                    left: paddingLeft,
                    top: paddingTop,
                    right: paddingRight,
                    height: availableHeight,
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: twoWayPlot ? 12 : 8
                }}>
                    {rows.map((item, index) => {
                        const value = item[selectedMetric] as number;
                        const barHeight = (value / maxValue) * availableHeight;
                        const barColor = getBarColor(value);

                        return (
                            <div
                                key={index}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8,
                                    minWidth: 20,
                                    position: 'relative'
                                }}
                            >
                                <div
                                    onMouseEnter={(e) => handleBarHover(index, e)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    style={{
                                        width: '100%',
                                        height: Math.max(barHeight, 2),
                                        backgroundColor: barColor,
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        boxShadow: hoveredIndex === index
                                            ? '0 4px 8px rgba(99, 102, 241, 0.4)'
                                            : '0 2px 4px rgba(99, 102, 241, 0.2)',
                                        opacity: hoveredIndex === index ? 0.8 : 1,
                                        transform: hoveredIndex === index ? 'translateY(-4px)' : 'translateY(0)',
                                        position: 'relative'
                                    }}
                                />

                                <span style={{
                                    fontSize: 11,
                                    color: '#6b7280',
                                    fontWeight: 500,
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {item.period}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {twoWayPlot && (
                    <svg
                        style={{
                            position: 'absolute',
                            left: paddingLeft,
                            top: paddingTop,
                            width: `calc(100% - ${paddingLeft + paddingRight}px)`,
                            height: availableHeight,
                            pointerEvents: 'none'
                        }}
                    >
                        <polyline
                            points={rows.map((item, index) => {
                                const value = item[selectedMetric] as number;
                                const x = ((index + 0.5) / rows.length) * 100;
                                const y = ((1 - value / maxValue) * availableHeight);
                                return `${x}%,${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {rows.map((item, index) => {
                            const value = item[selectedMetric] as number;
                            const x = ((index + 0.5) / rows.length) * 100;
                            const y = ((1 - value / maxValue) * availableHeight);
                            return (
                                <circle
                                    key={index}
                                    cx={`${x}%`}
                                    cy={y}
                                    r="4"
                                    fill="#6366f1"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            );
                        })}
                    </svg>
                )}

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
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
                }}>
                    <div style={{ marginBottom: 4, fontWeight: 600 }}>
                        {rows[hoveredIndex].period}
                    </div>
                    <div style={{ fontSize: 12 }}>
                        {selectedMetric}: {formatNumber(rows[hoveredIndex][selectedMetric] as number)}
                    </div>
                </div>
            )}
        </div>
    );
};