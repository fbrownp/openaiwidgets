import React from 'react';
import { BrechaSelectorProps } from './types';

/**
 * BrechaSelector Component
 * Allows navigation between different brechas
 */
export const BrechaSelector: React.FC<BrechaSelectorProps> = ({
    brechas,
    selectedIndex,
    onSelectBrecha,
    themeColors
}) => {
    if (brechas.length === 0) {
        return null;
    }

    return (
        <div style={{
            backgroundColor: themeColors.cardBackground,
            borderRadius: 12,
            padding: '20px',
            border: `1px solid ${themeColors.cardBorder}`,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16
            }}>
                <h3 style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 700,
                    color: themeColors.text
                }}>
                    Brechas Identificadas ({brechas.length})
                </h3>
                <div style={{
                    fontSize: 13,
                    color: themeColors.textSecondary,
                    fontWeight: 500
                }}>
                    {selectedIndex + 1} de {brechas.length}
                </div>
            </div>

            {/* Navigation Controls */}
            <div style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center'
            }}>
                <button
                    onClick={() => onSelectBrecha(Math.max(0, selectedIndex - 1))}
                    disabled={selectedIndex === 0}
                    style={{
                        padding: '10px 16px',
                        borderRadius: 8,
                        border: 'none',
                        backgroundColor: selectedIndex === 0 ? themeColors.background : themeColors.purple,
                        color: selectedIndex === 0 ? themeColors.textSecondary : 'white',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: selectedIndex === 0 ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                    }}
                    onMouseEnter={(e) => {
                        if (selectedIndex !== 0) {
                            e.currentTarget.style.backgroundColor = themeColors.purpleDark;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (selectedIndex !== 0) {
                            e.currentTarget.style.backgroundColor = themeColors.purple;
                        }
                    }}
                >
                    ← Anterior
                </button>

                {/* Brecha dropdown selector */}
                <select
                    value={selectedIndex}
                    onChange={(e) => onSelectBrecha(Number(e.target.value))}
                    style={{
                        flex: 1,
                        padding: '10px 16px',
                        borderRadius: 8,
                        border: `1px solid ${themeColors.border}`,
                        backgroundColor: themeColors.background,
                        color: themeColors.text,
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    {brechas.map((brecha, idx) => (
                        <option key={idx} value={idx}>
                            Brecha {idx + 1}: {truncateText(brecha.potencial_brecha, 60)}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => onSelectBrecha(Math.min(brechas.length - 1, selectedIndex + 1))}
                    disabled={selectedIndex === brechas.length - 1}
                    style={{
                        padding: '10px 16px',
                        borderRadius: 8,
                        border: 'none',
                        backgroundColor: selectedIndex === brechas.length - 1 ? themeColors.background : themeColors.purple,
                        color: selectedIndex === brechas.length - 1 ? themeColors.textSecondary : 'white',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: selectedIndex === brechas.length - 1 ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                    }}
                    onMouseEnter={(e) => {
                        if (selectedIndex !== brechas.length - 1) {
                            e.currentTarget.style.backgroundColor = themeColors.purpleDark;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (selectedIndex !== brechas.length - 1) {
                            e.currentTarget.style.backgroundColor = themeColors.purple;
                        }
                    }}
                >
                    Siguiente →
                </button>
            </div>

            {/* Quick preview of current brecha */}
            <div style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: themeColors.background,
                borderRadius: 8,
                borderLeft: `3px solid ${themeColors.purple}`
            }}>
                <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: themeColors.textSecondary,
                    marginBottom: 6
                }}>
                    Vista previa:
                </div>
                <div style={{
                    fontSize: 13,
                    color: themeColors.text,
                    lineHeight: 1.5
                }}>
                    {truncateText(brechas[selectedIndex].potencial_brecha, 150)}
                </div>
            </div>
        </div>
    );
};

// Helper function to truncate text
function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
