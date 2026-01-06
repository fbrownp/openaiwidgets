import React from 'react';
import { SeiaProjectCardProps } from './types';

/**
 * SeiaProjectCard Component
 * Displays a single SEIA project with all its details
 */
export const SeiaProjectCard: React.FC<SeiaProjectCardProps> = ({
    project,
    themeColors
}) => {
    // Format cosine similarity as percentage
    const similarityPercentage = (project.cosine_similarity * 100).toFixed(1);

    return (
        <div style={{
            backgroundColor: themeColors.cardBackground,
            borderRadius: 12,
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${themeColors.cardBorder}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            minHeight: 240,
            minWidth: 320,
            maxWidth: 400,
            position: 'relative',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }}
        >
            {/* Upper right corner chip - Expediente SEIA */}
            <div style={{
                position: 'absolute',
                top: 16,
                right: 16
            }}>
                <div style={{
                    backgroundColor: themeColors.chipBackground,
                    color: themeColors.chipText,
                    padding: '4px 12px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Expediente SEIA : {project.expediente_seia}
                </div>
            </div>

            {/* Cosine Similarity - Upper part, emphasized */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 36 // Space for the expediente chip
            }}>
                <div style={{
                    backgroundColor: themeColors.purple,
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: 16,
                    fontSize: 14,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                }}>
                    <span style={{ fontSize: 12, opacity: 0.9 }}>Similitud:</span>
                    <span style={{ fontSize: 18 }}>{similarityPercentage}%</span>
                </div>
            </div>

            {/* Nombre Proyecto - Title */}
            <div style={{
                fontSize: 18,
                fontWeight: 700,
                color: themeColors.text,
                lineHeight: 1.3,
                minHeight: 48
            }}>
                {project.nombre_proyecto}
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Details section - Investment and Region */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                paddingTop: 12,
                borderTop: `1px solid ${themeColors.cardBorder}`
            }}>
                {/* Investment */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                }}>
                    <span style={{
                        fontSize: 13,
                        color: themeColors.textSecondary,
                        fontWeight: 600
                    }}>
                        💰
                    </span>
                    <span style={{
                        fontSize: 13,
                        color: themeColors.text,
                        fontWeight: 500
                    }}>
                        Inversión MMU$ : {project.inversion.toLocaleString('es-CL')}
                    </span>
                </div>

                {/* Region */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                }}>
                    <span style={{
                        fontSize: 13,
                        color: themeColors.textSecondary,
                        fontWeight: 600
                    }}>
                        📍
                    </span>
                    <span style={{
                        fontSize: 13,
                        color: themeColors.text,
                        fontWeight: 500
                    }}>
                        {project.region}
                    </span>
                </div>
            </div>
        </div>
    );
};
