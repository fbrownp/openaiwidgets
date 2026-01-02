import React from 'react';
import { ObservationCarousel } from './ObservationCarousel';
import { ObservationIdentifier } from './types';

/**
 * Test page for development with npm run dev
 */
export default function TestPage() {
    const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

    const themeColors = theme === 'light' ? {
        background: '#f9fafb',
        cardBackground: 'white',
        cardBorder: '#e5e7eb',
        text: '#111827',
        textSecondary: '#6b7280',
        chipBackground: '#f3f4f6',
        chipText: '#374151',
        chipSimilarBg: '#3b82f6',
        chipIdenticalBg: '#10b981',
        chipPAC1Bg: '#8b5cf6',
        chipPAC2Bg: '#f59e0b',
        chipPCPIBg: '#ef4444',
        chipTipificacionBg: '#6366f1',
        citeBorder: '#8b5cf6',
        citeBackground: '#f9fafb'
    } : {
        background: '#212121',
        cardBackground: '#2d2d2d',
        cardBorder: '#404040',
        text: '#ffffff',
        textSecondary: '#b0b0b0',
        chipBackground: '#404040',
        chipText: '#e0e0e0',
        chipSimilarBg: '#3b82f6',
        chipIdenticalBg: '#10b981',
        chipPAC1Bg: '#a78bfa',
        chipPAC2Bg: '#fb923c',
        chipPCPIBg: '#f87171',
        chipTipificacionBg: '#818cf8',
        citeBorder: '#8b5cf6',
        citeBackground: '#1f1f1f'
    };

    const testObservations: ObservationIdentifier[] = [
        {
            identifier: "Usuario_Consulta_001",
            first_level_trace: "EIA_Proyecto_Minero_2023.pdf",
            original_name: "/evaluaciones/2023/mineria/EIA_Proyecto_Minero_2023.pdf",
            cita_encontrada: "Se observa contaminación potencial de napas subterráneas debido a infiltraciones desde el tranque de relaves ubicado en zona de alta pluviosidad.",
            similitud: "Identica",
            instancia_observacion: "PAC_1",
            tipificacion_materia: "contaminación napa infiltraciones"
        },
        {
            identifier: "Usuario_Consulta_045",
            first_level_trace: "Observaciones_Comunidad_Sur.pdf",
            original_name: "/consultas/comunidades/2023/Observaciones_Comunidad_Sur.pdf",
            cita_encontrada: "La comunidad manifiesta preocupación por posibles infiltraciones que podrían afectar las fuentes de agua subterránea utilizadas para consumo.",
            similitud: "Similar",
            instancia_observacion: "PCPI",
            tipificacion_materia: "riesgo salud agua"
        },
        {
            identifier: "Usuario_Consulta_078",
            first_level_trace: "DIA_Planta_Industrial_2024.pdf",
            original_name: "/evaluaciones/2024/industria/DIA_Planta_Industrial_2024.pdf",
            cita_encontrada: "Se requiere evaluación de riesgo a la salud de receptores sensibles ubicados a 500m de la planta debido a material particulado.",
            similitud: "Similar",
            instancia_observacion: "PAC_2",
            tipificacion_materia: "riesgo salud MP"
        },
        {
            identifier: "Usuario_Consulta_112",
            first_level_trace: "EIA_Linea_Transmision_2022.pdf",
            original_name: "/evaluaciones/2022/energia/EIA_Linea_Transmision_2022.pdf",
            cita_encontrada: "Comunidad ubicada a 2 km de la línea de transmisión expresa preocupación por emisiones electromagnéticas y sus efectos en la salud.",
            similitud: "Identica",
            instancia_observacion: "PAC_1",
            tipificacion_materia: "emisiones electromagnéticas comunidad"
        },
        {
            identifier: "Usuario_Consulta_203",
            first_level_trace: "Observaciones_Sanitarias_2023.pdf",
            original_name: "/consultas/sanitarias/Observaciones_Sanitarias_2023.pdf",
            cita_encontrada: "Se solicita estudio de línea base de ruido considerando receptores sensibles como escuela y centro de salud en área de influencia.",
            similitud: "Similar",
            instancia_observacion: "PCPI",
            tipificacion_materia: "contaminación acústica receptores"
        }
    ];

    const identicalCount = testObservations.filter(obs => obs.similitud === 'Identica').length;
    const similarCount = testObservations.filter(obs => obs.similitud === 'Similar').length;

    return (
        <div style={{
            padding: 40,
            backgroundColor: themeColors.background,
            minHeight: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                        <h1 style={{
                            margin: 0,
                            color: themeColors.text,
                            fontSize: 32,
                            fontWeight: 700
                        }}>
                            Widget Test Environment
                        </h1>
                        <p style={{
                            margin: '8px 0 0 0',
                            color: themeColors.textSecondary,
                            fontSize: 16
                        }}>
                            Testing Observation Identifier Widget
                        </p>
                    </div>

                    {/* Theme Toggle */}
                    <div style={{
                        display: 'flex',
                        gap: 8,
                        backgroundColor: themeColors.cardBackground,
                        padding: 4,
                        borderRadius: 8,
                        border: `1px solid ${themeColors.cardBorder}`
                    }}>
                        <button
                            onClick={() => setTheme('light')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 6,
                                border: 'none',
                                backgroundColor: theme === 'light' ? '#8b5cf6' : 'transparent',
                                color: theme === 'light' ? 'white' : themeColors.text,
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Claro
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 6,
                                border: 'none',
                                backgroundColor: theme === 'dark' ? '#8b5cf6' : 'transparent',
                                color: theme === 'dark' ? 'white' : themeColors.text,
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Oscuro
                        </button>
                    </div>
                </div>

                {/* Statistics Panel */}
                <div style={{
                    backgroundColor: themeColors.cardBackground,
                    borderRadius: 8,
                    padding: '20px',
                    marginBottom: 30,
                    border: `1px solid ${themeColors.cardBorder}`,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                    <h3 style={{
                        marginTop: 0,
                        marginBottom: 16,
                        color: themeColors.text,
                        fontSize: 18
                    }}>
                        Widget Statistics
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 20,
                        fontSize: 14
                    }}>
                        <div>
                            <strong style={{ color: themeColors.textSecondary }}>Total Observations:</strong>
                            <p style={{ margin: '8px 0 0 0', fontSize: 28, fontWeight: 700, color: themeColors.text }}>
                                {testObservations.length}
                            </p>
                        </div>
                        <div>
                            <strong style={{ color: themeColors.textSecondary }}>Identical:</strong>
                            <p style={{ margin: '8px 0 0 0', fontSize: 28, fontWeight: 700, color: '#10b981' }}>
                                {identicalCount}
                            </p>
                        </div>
                        <div>
                            <strong style={{ color: themeColors.textSecondary }}>Similar:</strong>
                            <p style={{ margin: '8px 0 0 0', fontSize: 28, fontWeight: 700, color: '#3b82f6' }}>
                                {similarCount}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Carousel Widget */}
                <div style={{
                    backgroundColor: themeColors.cardBackground,
                    borderRadius: 12,
                    padding: '40px',
                    border: `1px solid ${themeColors.cardBorder}`,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 style={{
                        marginTop: 0,
                        marginBottom: 24,
                        color: themeColors.text,
                        fontSize: 24
                    }}>
                        Observaciones Similares Encontradas
                    </h2>
                    <ObservationCarousel
                        observations={testObservations}
                        themeColors={themeColors}
                    />
                </div>

                {/* Info Panel */}
                <div style={{
                    backgroundColor: themeColors.cardBackground,
                    borderRadius: 8,
                    padding: '20px',
                    marginTop: 30,
                    border: `1px solid ${themeColors.cardBorder}`,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                    <h3 style={{
                        marginTop: 0,
                        marginBottom: 16,
                        color: themeColors.text,
                        fontSize: 18
                    }}>
                        Component Information
                    </h3>
                    <div style={{ fontSize: 14, color: themeColors.textSecondary }}>
                        <p style={{ marginBottom: 12 }}>
                            This widget displays observation identifiers in a carousel format with interactive cards.
                            Each card shows detailed information about observations that are similar or identical.
                        </p>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li>Horizontal scrolling carousel with navigation arrows</li>
                            <li>Color-coded chips for different categories</li>
                            <li>Hover effects on cards</li>
                            <li>Light and dark theme support</li>
                            <li>Responsive design</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
