import React, { useState } from 'react';
import { BrechaCardProps } from './types';

/**
 * BrechaCard Component
 * Displays a single brecha analysis with multi-screen navigation
 */
export const BrechaCard: React.FC<BrechaCardProps> = ({ brecha, themeColors }) => {
    const [activeScreen, setActiveScreen] = useState<'overview' | 'defense' | 'allegation' | 'references'>('overview');

    // Determine chip color based on tipo_brecha
    const getTipoBrechaColor = () => {
        const tipo = brecha.tipo_brecha.toLowerCase();
        if (tipo.includes('insuficiente')) return themeColors.chipRespuestaInsuficienteBg;
        if (tipo.includes('omision') || tipo.includes('omisión')) return themeColors.chipOmisionBg;
        if (tipo.includes('contradiccion') || tipo.includes('contradicción')) return themeColors.chipContradiccionBg;
        return themeColors.chipBackground;
    };

    // Determine chip color for aplica
    const getAplicaColor = () => {
        return brecha.aplica.toLowerCase().includes('aplica') && !brecha.aplica.toLowerCase().includes('no')
            ? themeColors.chipAplicaBg
            : themeColors.chipNoAplicaBg;
    };

    // Screen navigation buttons
    const screenButtons = [
        { id: 'overview' as const, label: 'Vista General', icon: '📋' },
        { id: 'defense' as const, label: 'Defensa', icon: '⚖️' },
        { id: 'allegation' as const, label: 'Alegato', icon: '🔍' },
        { id: 'references' as const, label: 'Referencias', icon: '📚' }
    ];

    return (
        <div style={{
            backgroundColor: themeColors.cardBackground,
            borderRadius: 16,
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            border: `1px solid ${themeColors.cardBorder}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            minHeight: 600,
            maxWidth: 900,
            margin: '0 auto'
        }}>
            {/* Header with chips */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 12
            }}>
                <div style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        backgroundColor: getTipoBrechaColor(),
                        color: 'white',
                        padding: '6px 14px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        {brecha.tipo_brecha}
                    </div>
                    <div style={{
                        backgroundColor: getAplicaColor(),
                        color: 'white',
                        padding: '6px 14px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600
                    }}>
                        {brecha.aplica}
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div style={{
                display: 'flex',
                gap: 8,
                backgroundColor: themeColors.background,
                padding: 6,
                borderRadius: 10,
                border: `1px solid ${themeColors.border}`
            }}>
                {screenButtons.map(btn => (
                    <button
                        key={btn.id}
                        onClick={() => setActiveScreen(btn.id)}
                        style={{
                            flex: 1,
                            padding: '10px 16px',
                            borderRadius: 8,
                            border: 'none',
                            backgroundColor: activeScreen === btn.id ? themeColors.buttonActiveBg : themeColors.buttonBackground,
                            color: activeScreen === btn.id ? themeColors.buttonActiveText : themeColors.buttonText,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6
                        }}
                        onMouseEnter={(e) => {
                            if (activeScreen !== btn.id) {
                                e.currentTarget.style.backgroundColor = themeColors.buttonHover;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeScreen !== btn.id) {
                                e.currentTarget.style.backgroundColor = themeColors.buttonBackground;
                            }
                        }}
                    >
                        <span>{btn.icon}</span>
                        <span>{btn.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                overflowY: 'auto',
                maxHeight: 500
            }}>
                {/* Overview Screen */}
                {activeScreen === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <Section
                            title="Potencial Brecha"
                            icon="⚠️"
                            content={brecha.potencial_brecha}
                            themeColors={themeColors}
                            accentColor={themeColors.accentVoids}
                        />
                        <Section
                            title="Justificación"
                            icon="📝"
                            content={brecha.justificacion_brecha}
                            themeColors={themeColors}
                        />
                        <Section
                            title="Solución del Titular"
                            icon="💡"
                            content={brecha.solucion_titular}
                            themeColors={themeColors}
                        />
                        <Section
                            title="Resumen Considerado por Titular"
                            icon="📄"
                            content={brecha.resumen_considerado_titular}
                            themeColors={themeColors}
                        />
                    </div>
                )}

                {/* Defense Screen */}
                {activeScreen === 'defense' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <Section
                            title="Aristas del Titular (Defensa)"
                            icon="🛡️"
                            content={brecha.potenciales_aristas_titular}
                            themeColors={themeColors}
                            accentColor={themeColors.accentDefense}
                        />
                        <Section
                            title="Potenciales Vacíos"
                            icon="⚠️"
                            content={brecha.potenciales_vacios}
                            themeColors={themeColors}
                            accentColor={themeColors.accentVoids}
                        />
                    </div>
                )}

                {/* Allegation Screen */}
                {activeScreen === 'allegation' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <Section
                            title="Aristas del Alegato (Contra-argumentos)"
                            icon="⚔️"
                            content={brecha.potenciales_aristas_alegato}
                            themeColors={themeColors}
                            accentColor={themeColors.accentAllegation}
                        />
                        <Section
                            title="Potenciales Vacíos"
                            icon="⚠️"
                            content={brecha.potenciales_vacios}
                            themeColors={themeColors}
                            accentColor={themeColors.accentVoids}
                        />
                    </div>
                )}

                {/* References Screen */}
                {activeScreen === 'references' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {brecha.referencias.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: 40,
                                color: themeColors.textSecondary
                            }}>
                                No hay referencias disponibles
                            </div>
                        ) : (
                            brecha.referencias.map((ref, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        backgroundColor: themeColors.citeBackground,
                                        borderLeft: `4px solid ${themeColors.citeBorder}`,
                                        borderRadius: 8,
                                        padding: 16,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 12
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8
                                    }}>
                                        <span style={{ fontSize: 18 }}>📄</span>
                                        <div style={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: themeColors.text,
                                            fontFamily: 'monospace'
                                        }}>
                                            {ref.first_level_trace}
                                        </div>
                                    </div>

                                    <div style={{
                                        fontSize: 12,
                                        color: themeColors.textSecondary,
                                        fontFamily: 'monospace'
                                    }}>
                                        {ref.original_name}
                                    </div>

                                    {ref.pages.length > 0 && (
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 6,
                                            alignItems: 'center'
                                        }}>
                                            <span style={{
                                                fontSize: 11,
                                                color: themeColors.textSecondary,
                                                fontWeight: 600
                                            }}>
                                                Páginas:
                                            </span>
                                            {ref.pages.map((page, pageIdx) => (
                                                <span
                                                    key={pageIdx}
                                                    style={{
                                                        backgroundColor: themeColors.chipBackground,
                                                        color: themeColors.chipText,
                                                        padding: '3px 8px',
                                                        borderRadius: 6,
                                                        fontSize: 11,
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {page}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {ref.sentence_reference.length > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {ref.sentence_reference.map((sentence, sentIdx) => (
                                                <div
                                                    key={sentIdx}
                                                    style={{
                                                        fontSize: 12,
                                                        fontStyle: 'italic',
                                                        color: themeColors.textSecondary,
                                                        paddingLeft: 12,
                                                        borderLeft: `2px solid ${themeColors.border}`,
                                                        lineHeight: 1.6
                                                    }}
                                                >
                                                    {sentence}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {ref.urls.length > 0 && (
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 8
                                        }}>
                                            {ref.urls.map((url, urlIdx) => (
                                                <a
                                                    key={urlIdx}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        backgroundColor: themeColors.purple,
                                                        color: 'white',
                                                        padding: '6px 12px',
                                                        borderRadius: 6,
                                                        fontSize: 11,
                                                        fontWeight: 500,
                                                        textDecoration: 'none',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = themeColors.purpleDark;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = themeColors.purple;
                                                    }}
                                                >
                                                    Ver página {ref.pages[urlIdx] || urlIdx + 1}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper component for sections
interface SectionProps {
    title: string;
    icon: string;
    content: string;
    themeColors: any;
    accentColor?: string;
}

const Section: React.FC<SectionProps> = ({ title, icon, content, themeColors, accentColor }) => (
    <div style={{
        backgroundColor: themeColors.background,
        borderLeft: `4px solid ${accentColor || themeColors.border}`,
        borderRadius: 8,
        padding: 16
    }}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12
        }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <h3 style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: themeColors.text
            }}>
                {title}
            </h3>
        </div>
        <p style={{
            margin: 0,
            fontSize: 13,
            color: themeColors.textSecondary,
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap'
        }}>
            {content}
        </p>
    </div>
);
