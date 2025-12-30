import React, { useState } from 'react';
import { IndexStatus, ThemeColors } from './types';

type IndexBarplotProps = {
    title: string;
    data: IndexStatus[];
    height?: number;
    themeColors: ThemeColors;
};

export const IndexBarplot: React.FC<IndexBarplotProps> = ({
    title,
    data,
    height = 400,
    themeColors
}) => {
    const [hoveredBar, setHoveredBar] = useState<{ index: number; field: string } | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    if (!data || data.length === 0) {
        return (
            <div style={{
                backgroundColor: themeColors.cardBackground,
                borderRadius: 12,
                padding: 24,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${themeColors.cardBorder}`
            }}>
                <div style={{ textAlign: 'center', color: themeColors.textSecondary, padding: 40 }}>
                    No data available
                </div>
            </div>
        );
    }

    // Status fields to display (excluding pdf_validado)
    const statusFields = [
        { key: 'listo_para_indexar', label: 'Listo para indexar' },
        { key: 'corrompido', label: 'Corrompido' },
        { key: 'en_cola', label: 'En cola' },
        { key: 'indexado', label: 'Indexado' },
        { key: 'falta_ocr', label: 'Falta OCR' },
        { key: 'no_descargado', label: 'No descargado' }
    ];

    // Get bar color using white-pink-purple gradient (matching barplot theme)
    const getBarColor = (value: number, maxVal: number) => {
        const intensity = maxVal > 0 ? value / maxVal : 0;
        const hue = 270; // Purple hue
        const saturation = 60 + (intensity * 40);
        const lightness = 95 - (intensity * 45);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    // Calculate max value for scaling
    const maxValue = Math.max(...data.flatMap(item =>
        statusFields.map(field => (item[field.key as keyof IndexStatus] as number) || 0)
    ));

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
    };

    const paddingTop = 40;
    const paddingBottom = 60;
    const paddingLeft = 150;
    const paddingRight = 40;
    const availableHeight = height - paddingTop - paddingBottom;
    const rowHeight = availableHeight / data.length;
    const barHeight = Math.min(rowHeight * 0.7, 40);

    const handleBarHover = (index: number, field: string, event: React.MouseEvent) => {
        setHoveredBar({ index, field });
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipPos({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
        });
    };

    return (
        <div style={{
            backgroundColor: themeColors.cardBackground,
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${themeColors.cardBorder}`,
            position: 'relative'
        }}>
            {/* Header */}
            <div style={{
                fontSize: 15,
                fontWeight: 600,
                color: themeColors.text,
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 4
            }}>
                {title}
                <span style={{ fontSize: 10, color: themeColors.textSecondary }}>¹</span>
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 16,
                marginBottom: 20,
                fontSize: 12
            }}>
                {statusFields.map((field, idx) => (
                    <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{
                            width: 12,
                            height: 12,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${getBarColor(0.3 + idx * 0.15, 1)}, ${getBarColor(0.5 + idx * 0.15, 1)})`
                        }} />
                        <span style={{ color: themeColors.textSecondary }}>{field.label}</span>
                    </div>
                ))}
            </div>

            {/* Chart Container */}
            <div style={{
                position: 'relative',
                height: height,
                width: '100%'
            }}>
                {/* Y-axis labels (tipo_documento) */}
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: paddingTop,
                    width: paddingLeft - 10,
                    height: availableHeight,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around'
                }}>
                    {data.map((item, index) => (
                        <div key={index} style={{
                            fontSize: 12,
                            color: themeColors.text,
                            textAlign: 'right',
                            paddingRight: 10,
                            height: rowHeight,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            fontWeight: 500
                        }}>
                            {item.tipo_documento}
                        </div>
                    ))}
                </div>

                {/* Grid lines */}
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
                            x1={`${ratio * 100}%`}
                            y1="0"
                            x2={`${ratio * 100}%`}
                            y2="100%"
                            stroke={themeColors.gridLine}
                            strokeWidth="1"
                            strokeDasharray="4,4"
                        />
                    ))}
                </svg>

                {/* X-axis labels */}
                <div style={{
                    position: 'absolute',
                    left: paddingLeft,
                    right: paddingRight,
                    bottom: paddingBottom - 30,
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    color: themeColors.textSecondary
                }}>
                    <span>0</span>
                    <span>{formatNumber(maxValue * 0.25)}</span>
                    <span>{formatNumber(maxValue * 0.5)}</span>
                    <span>{formatNumber(maxValue * 0.75)}</span>
                    <span>{formatNumber(maxValue)}</span>
                </div>

                {/* Bars */}
                <div style={{
                    position: 'absolute',
                    left: paddingLeft,
                    top: paddingTop,
                    right: paddingRight,
                    height: availableHeight,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around'
                }}>
                    {data.map((item, index) => (
                        <div key={index} style={{
                            height: rowHeight,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            {statusFields.map(field => {
                                const value = (item[field.key as keyof IndexStatus] as number) || 0;
                                const barWidth = maxValue > 0 ? (value / maxValue) * 100 : 0;
                                const barColor = getBarColor(value, maxValue);

                                return (
                                    <div
                                        key={field.key}
                                        onMouseEnter={(e) => handleBarHover(index, field.key, e)}
                                        onMouseLeave={() => setHoveredBar(null)}
                                        style={{
                                            height: barHeight,
                                            width: `${barWidth}%`,
                                            backgroundColor: barColor,
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            opacity: hoveredBar?.index === index && hoveredBar?.field === field.key ? 0.8 : 1,
                                            transform: hoveredBar?.index === index && hoveredBar?.field === field.key
                                                ? 'scaleY(1.1)'
                                                : 'scaleY(1)',
                                            boxShadow: hoveredBar?.index === index && hoveredBar?.field === field.key
                                                ? `0 2px 8px ${barColor}80`
                                                : 'none',
                                            position: 'relative'
                                        }}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Tooltip */}
            {hoveredBar !== null && (
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
                        {data[hoveredBar.index].tipo_documento}
                    </div>
                    <div style={{ fontSize: 12 }}>
                        {statusFields.find(f => f.key === hoveredBar.field)?.label}: {' '}
                        {formatNumber((data[hoveredBar.index][hoveredBar.field as keyof IndexStatus] as number) || 0)}
                    </div>
                </div>
            )}
        </div>
    );
};
