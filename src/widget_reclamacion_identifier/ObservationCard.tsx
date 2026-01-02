import React from 'react';
import { ObservationCardProps } from './types';

/**
 * ObservationCard Component
 * Displays a single observation identifier with all its details
 */
export const ObservationCard: React.FC<ObservationCardProps> = ({
    observation,
    themeColors
}) => {
    // Determine background color for similitud chip
    const getSimilitudColor = () => {
        return observation.similitud === 'Identica'
            ? themeColors.chipIdenticalBg
            : themeColors.chipSimilarBg;
    };

    // Determine background color for instancia chip
    const getInstanciaColor = () => {
        switch (observation.instancia_observacion) {
            case 'PAC_1':
                return themeColors.chipPAC1Bg;
            case 'PAC_2':
                return themeColors.chipPAC2Bg;
            case 'PCPI':
                return themeColors.chipPCPIBg;
            default:
                return themeColors.chipBackground;
        }
    };

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
            minHeight: 280,
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
            {/* Upper right corner chips */}
            <div style={{
                position: 'absolute',
                top: 16,
                right: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                alignItems: 'flex-end'
            }}>
                {/* Instancia Observacion chip */}
                <div style={{
                    backgroundColor: getInstanciaColor(),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {observation.instancia_observacion}
                </div>

                {/* Tipificacion Materia chip */}
                <div style={{
                    backgroundColor: themeColors.chipTipificacionBg,
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: 12,
                    fontSize: 10,
                    fontWeight: 500,
                    maxWidth: 180,
                    textAlign: 'right',
                    lineHeight: 1.3
                }}>
                    {observation.tipificacion_materia}
                </div>
            </div>

            {/* Identifier - Title */}
            <div style={{
                fontSize: 20,
                fontWeight: 700,
                color: themeColors.text,
                lineHeight: 1.3,
                paddingRight: 100 // Space for the chips
            }}>
                {observation.identifier}
            </div>

            {/* Similitud chip */}
            <div style={{ marginTop: -8 }}>
                <div style={{
                    display: 'inline-block',
                    backgroundColor: getSimilitudColor(),
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: 14,
                    fontSize: 12,
                    fontWeight: 600
                }}>
                    {observation.similitud}
                </div>
            </div>

            {/* File traces section */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8
            }}>
                {/* First level trace chip */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                }}>
                    <span style={{
                        fontSize: 11,
                        color: themeColors.textSecondary,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Archivo:
                    </span>
                    <div style={{
                        backgroundColor: themeColors.chipBackground,
                        color: themeColors.chipText,
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 500,
                        fontFamily: 'monospace'
                    }}>
                        {observation.first_level_trace}
                    </div>
                </div>

                {/* Original name chip */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                }}>
                    <span style={{
                        fontSize: 11,
                        color: themeColors.textSecondary,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Ruta:
                    </span>
                    <div style={{
                        backgroundColor: themeColors.chipBackground,
                        color: themeColors.chipText,
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 500,
                        fontFamily: 'monospace',
                        maxWidth: 250,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                    title={observation.original_name}
                    >
                        {observation.original_name}
                    </div>
                </div>
            </div>

            {/* Spacer to push citation to bottom */}
            <div style={{ flex: 1 }} />

            {/* Citation (cita_encontrada) */}
            <div style={{
                borderLeft: `3px solid ${themeColors.citeBorder}`,
                paddingLeft: 12,
                backgroundColor: themeColors.citeBackground,
                padding: '12px',
                borderRadius: 6,
                marginTop: 'auto'
            }}>
                <p style={{
                    margin: 0,
                    fontSize: 13,
                    fontStyle: 'italic',
                    color: themeColors.textSecondary,
                    lineHeight: 1.5
                }}>
                    "{observation.cita_encontrada}"
                </p>
            </div>
        </div>
    );
};
