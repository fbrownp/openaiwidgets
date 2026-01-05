import React from 'react';

// Custom Card Component
export const Card = ({
    size,
    children
}: {
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode
}) => {
    const padding = size === 'sm' ? 8 : size === 'lg' ? 24 : 16;
    return (
        <div style={{
            padding,
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            backgroundColor: 'white',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
            {children}
        </div>
    );
};

// Custom Text Component
export const Text = ({
    weight,
    children
}: {
    weight?: 'normal' | 'semibold' | 'bold';
    children: React.ReactNode
}) => {
    const fontWeight = weight === 'semibold' ? 600 : weight === 'bold' ? 700 : 400;
    return (
        <span style={{ fontWeight, fontSize: 14 }}>
            {children}
        </span>
    );
};

// Custom Row Component
export const Row = ({
    align,
    children
}: {
    align?: 'start' | 'center' | 'end';
    children: React.ReactNode
}) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: align || 'start',
            gap: 8
        }}>
            {children}
        </div>
    );
};

// Custom Select Component
export const Select = ({
    name,
    options,
    value,
    clearable,
    onChange
}: {
    name: string;
    options: Array<{ label: string; value: string }>;
    value: string;
    clearable?: boolean;
    onChange?: (value: string) => void;
}) => {
    return (
        <select
            name={name}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                fontSize: 14,
                backgroundColor: 'white',
                cursor: 'pointer'
            }}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

// Custom Button Component
export const Button = ({
    onClick,
    children,
    variant = 'default',
    size = 'md'
}: {
    onClick?: () => void;
    children: React.ReactNode;
    variant?: 'default' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#6b7280',
                    hover: '#f3f4f6'
                };
            case 'outline':
                return {
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    hover: '#f9fafb'
                };
            default:
                return {
                    backgroundColor: '#3b82f6',
                    border: 'none',
                    color: 'white',
                    hover: '#2563eb'
                };
        }
    };

    const getPadding = () => {
        switch (size) {
            case 'sm':
                return '4px 8px';
            case 'lg':
                return '12px 20px';
            default:
                return '6px 12px';
        }
    };

    const styles = getVariantStyles();

    return (
        <button
            onClick={onClick}
            style={{
                padding: getPadding(),
                borderRadius: 6,
                border: styles.border,
                backgroundColor: styles.backgroundColor,
                color: styles.color,
                fontSize: size === 'sm' ? 12 : 14,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = styles.hover;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = styles.backgroundColor;
            }}
        >
            {children}
        </button>
    );
};

// Custom Chart Component (simplified version using canvas or SVG)
export const Chart = ({
    data,
    series,
    xAxis,
    showYAxis,
    height
}: {
    data: any[];
    series: Array<{ type: string; dataKey: string; color: string }>;
    xAxis: { dataKey: string };
    showYAxis?: boolean;
    height?: number;
}) => {
    const chartHeight = height || 200;

    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d[series[0].dataKey] as number));
    const barWidth = 100 / data.length;

    return (
        <div style={{
            height: chartHeight,
            width: '100%',
            position: 'relative',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            padding: 16,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 4
        }}>
            {data.map((item, index) => {
                const value = item[series[0].dataKey] as number;
                const barHeight = (value / maxValue) * (chartHeight - 40);

                return (
                    <div key={index} style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4
                    }}>
                        <div style={{
                            width: '100%',
                            height: barHeight,
                            backgroundColor: series[0].color === 'blue' ? '#3b82f6' : series[0].color,
                            borderRadius: '4px 4px 0 0',
                            transition: 'height 0.3s ease'
                        }} />
                        <span style={{ fontSize: 11, color: '#6b7280' }}>
                            {item[xAxis.dataKey]}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};