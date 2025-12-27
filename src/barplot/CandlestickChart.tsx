import React, { useState } from 'react';
import { CandlestickDataRow } from './types';

interface CandlestickChartProps {
    title: string;
    rows: CandlestickDataRow[];
    height?: number;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
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

    const allValues = rows.flatMap(r => [r.low, r.high]);
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const range = maxValue - minValue;

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
    };

    // Purple gradient for bullish (close > open), darker for bearish
    const getBullishColor = (value: number) => {
        const intensity = (value - minValue) / range;
        const hue = 270;
        const saturation = 60 + (intensity * 40);
        const lightness = 85 - (intensity * 35);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const getBearishColor = (value: number) => {
        const intensity = (value - minValue) / range;
        const hue = 270;
        const saturation = 70 + (intensity * 30);
        const lightness = 40 - (intensity * 20);
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

    const handleCandleHover = (index: number, event: React.MouseEvent) => {
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

                {/* Candlesticks */}
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
                        const isBullish = item.close >= item.open;
                        const x = ((index + 0.5) / rows.length) * 100;
                        const candleWidth = Math.max(80 / rows.length, 6);

                        const highY = valueToY(item.high);
                        const lowY = valueToY(item.low);
                        const openY = valueToY(item.open);
                        const closeY = valueToY(item.close);

                        const bodyTop = Math.min(openY, closeY);
                        const bodyBottom = Math.max(openY, closeY);
                        const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

                        const avgValue = (item.high + item.low) / 2;
                        const color = isBullish
                            ? getBullishColor(avgValue)
                            : getBearishColor(avgValue);

                        return (
                            <g
                                key={index}
                                onMouseEnter={(e) => handleCandleHover(index, e as any)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* High-Low line (wick) */}
                                <line
                                    x1={`${x}%`}
                                    y1={highY}
                                    x2={`${x}%`}
                                    y2={lowY}
                                    stroke={color}
                                    strokeWidth="2"
                                    opacity={hoveredIndex === index ? 0.8 : 1}
                                />

                                {/* Open-Close body (candle) */}
                                <rect
                                    x={`calc(${x}% - ${candleWidth / 2}px)`}
                                    y={bodyTop}
                                    width={candleWidth}
                                    height={bodyHeight}
                                    fill={color}
                                    stroke={isBullish ? color : '#8b5cf6'}
                                    strokeWidth={isBullish ? 0 : 2}
                                    opacity={hoveredIndex === index ? 0.8 : 1}
                                    rx="2"
                                />
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
                        <span style={{ color: '#9ca3af' }}>Open:</span>
                        <span>{formatNumber(rows[hoveredIndex].open)}</span>
                        <span style={{ color: '#9ca3af' }}>High:</span>
                        <span>{formatNumber(rows[hoveredIndex].high)}</span>
                        <span style={{ color: '#9ca3af' }}>Low:</span>
                        <span>{formatNumber(rows[hoveredIndex].low)}</span>
                        <span style={{ color: '#9ca3af' }}>Close:</span>
                        <span>{formatNumber(rows[hoveredIndex].close)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};