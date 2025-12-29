import React, { useState } from 'react';
import { BarplotProps } from './types';

export const HorizontalBarplot: React.FC<BarplotProps> = ({
    title,
    metricOptions,
    selectedMetric,
    rows,
    onMetricChange,
    height = 500,
    themeColors
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Default to light theme colors if not provided
    const colors = themeColors || {
        cardBackground: 'white',
        cardBorder: '#f0f0f0',
        text: '#111827',
        textSecondary: '#6b7280',
        buttonHover: '#f3f4f6',
        purple: '#8b5cf6',
        purpleDark: '#7c3aed'
    };

    if (!rows || rows.length === 0) {
        return (
            <div style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 12,
                padding: 24,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${colors.cardBorder}`
            }}>
                <div style={{ textAlign: 'center', color: colors.textSecondary, padding: 40 }}>
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

    const barHeight = 24;
    const gap = 8;

    return (
        <div style={{
            backgroundColor: colors.cardBackground,
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${colors.cardBorder}`,
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
                    color: colors.text,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                }}>
                    {title}
                    <span style={{ fontSize: 10, color: colors.textSecondary }}>¹</span>
                </div>
            </div>

            {/* Horizontal Bars */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: gap,
                maxHeight: height,
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: 8
            }}>
                {rows.map((item, index) => {
                    const value = item[selectedMetric] as number;
                    const barWidth = (value / maxValue) * 100;
                    const barColor = getBarColor(value);

                    return (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                position: 'relative'
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Region Label */}
                            <div style={{
                                width: 120,
                                fontSize: 12,
                                color: colors.text,
                                fontWeight: 500,
                                textAlign: 'right',
                                flexShrink: 0,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {item.period}
                            </div>

                            {/* Bar Container */}
                            <div style={{
                                flex: 1,
                                position: 'relative',
                                height: barHeight,
                                backgroundColor: colors.buttonHover,
                                borderRadius: 4,
                                overflow: 'hidden'
                            }}>
                                {/* Bar */}
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${barWidth}%`,
                                        backgroundColor: barColor,
                                        borderRadius: 4,
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        boxShadow: hoveredIndex === index
                                            ? '0 2px 6px rgba(99, 102, 241, 0.4)'
                                            : 'none',
                                        opacity: hoveredIndex === index ? 0.85 : 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        paddingRight: 8
                                    }}
                                >
                                    {/* Value Label inside bar */}
                                    {barWidth > 15 && (
                                        <span style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: barWidth > 50 ? 'white' : colors.text
                                        }}>
                                            {formatNumber(value)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Value Label outside bar */}
                            {barWidth <= 15 && (
                                <div style={{
                                    width: 60,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: colors.textSecondary,
                                    flexShrink: 0
                                }}>
                                    {formatNumber(value)}
                                </div>
                            )}

                            {/* Tooltip on hover */}
                            {hoveredIndex === index && (
                                <div style={{
                                    position: 'absolute',
                                    left: 130,
                                    top: -35,
                                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                    color: 'white',
                                    padding: '6px 10px',
                                    borderRadius: 6,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    pointerEvents: 'none',
                                    zIndex: 100,
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
                                }}>
                                    {item.period}: {formatNumber(value)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};