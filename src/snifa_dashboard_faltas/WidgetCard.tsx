import React from 'react';
import { ThemeColors } from './types';

interface WidgetCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    subtitle?: string;
    themeColors: ThemeColors;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
    title,
    value,
    icon,
    subtitle,
    themeColors
}) => {
    return (
        <div style={{
            backgroundColor: themeColors.cardBackground,
            borderRadius: 8,
            padding: '12px 16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${themeColors.cardBorder}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minHeight: 90
        }}>
            <div style={{
                fontSize: 11,
                color: themeColors.textSecondary,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 3
            }}>
                <span style={{ fontSize: 8 }}>¹</span>
                {title}
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12
            }}>
                <div style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: themeColors.text,
                    lineHeight: 1.2
                }}>
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </div>

                <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: themeColors.buttonHover,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18
                }}>
                    {icon}
                </div>
            </div>

            {subtitle && (
                <div style={{
                    fontSize: 11,
                    color: themeColors.textSecondary,
                    marginTop: 2
                }}>
                    {subtitle}
                </div>
            )}
        </div>
    );
};
