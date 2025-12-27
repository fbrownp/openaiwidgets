import React from 'react';
import { WidgetCardProps } from './types';

export const WidgetCard: React.FC<WidgetCardProps> = ({
    title,
    value,
    icon = '📊',
    subtitle
}) => {
    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            minHeight: 140
        }}>
            <div style={{
                fontSize: 13,
                color: '#6b7280',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 4
            }}>
                <span style={{ fontSize: 10 }}>¹</span>
                {title}
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16
            }}>
                <div style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: '#111827',
                    lineHeight: 1.2
                }}>
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </div>

                <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24
                }}>
                    {icon}
                </div>
            </div>

            {subtitle && (
                <div style={{
                    fontSize: 13,
                    color: '#6b7280',
                    marginTop: 4
                }}>
                    {subtitle}
                </div>
            )}
        </div>
    );
};