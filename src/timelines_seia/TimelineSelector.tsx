import React from 'react';
import { TimelineSelectorProps } from './types';

/**
 * Format episode ID into human-readable label
 */
function formatEpisodeLabel(episodeId: string): string {
    // Convert snake_case to Title Case
    return episodeId
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export const TimelineSelector: React.FC<TimelineSelectorProps> = ({
    episodes,
    selectedEpisode,
    onEpisodeChange,
    themeColors
}) => {
    return (
        <div style={{
            backgroundColor: themeColors.cardBackground,
            borderRadius: 12,
            padding: '20px 16px',
            border: `1px solid ${themeColors.cardBorder}`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
            {/* Header */}
            <div style={{
                marginBottom: 24,
                paddingBottom: 16,
                borderBottom: `2px solid ${themeColors.border}`
            }}>
                <h3 style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: themeColors.text,
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                }}>
                    <span style={{
                        width: 4,
                        height: 20,
                        backgroundColor: themeColors.purple,
                        borderRadius: 2
                    }}></span>
                    Línea de Tiempo
                </h3>
            </div>

            {/* Timeline */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                flex: 1,
                paddingLeft: 8
            }}>
                {/* Vertical connecting line */}
                {episodes.length > 1 && (
                    <div style={{
                        position: 'absolute',
                        left: 23,
                        top: 28,
                        bottom: 28,
                        width: 2,
                        backgroundColor: themeColors.border,
                        zIndex: 0
                    }}></div>
                )}

                {/* Timeline items */}
                {episodes.map((episode, index) => {
                    const isSelected = selectedEpisode === episode.id;
                    const label = episode.label || formatEpisodeLabel(episode.id);
                    const isFirst = index === 0;
                    const isLast = index === episodes.length - 1;

                    return (
                        <div
                            key={episode.id}
                            style={{
                                position: 'relative',
                                marginBottom: index === episodes.length - 1 ? 0 : 32,
                                zIndex: 1
                            }}
                        >
                            <button
                                onClick={() => onEpisodeChange(episode.id)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16,
                                    padding: 0,
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    const dot = e.currentTarget.querySelector('.timeline-dot') as HTMLElement;
                                    const content = e.currentTarget.querySelector('.timeline-content') as HTMLElement;
                                    if (dot && !isSelected) {
                                        dot.style.transform = 'scale(1.3)';
                                        dot.style.borderColor = themeColors.purple;
                                    }
                                    if (content && !isSelected) {
                                        content.style.backgroundColor = themeColors.dropdownHover;
                                        content.style.transform = 'translateX(4px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    const dot = e.currentTarget.querySelector('.timeline-dot') as HTMLElement;
                                    const content = e.currentTarget.querySelector('.timeline-content') as HTMLElement;
                                    if (dot && !isSelected) {
                                        dot.style.transform = 'scale(1)';
                                        dot.style.borderColor = themeColors.border;
                                    }
                                    if (content && !isSelected) {
                                        content.style.backgroundColor = 'transparent';
                                        content.style.transform = 'translateX(0)';
                                    }
                                }}
                            >
                                {/* Timeline dot/marker */}
                                <div
                                    className="timeline-dot"
                                    style={{
                                        position: 'relative',
                                        flexShrink: 0,
                                        width: isSelected ? 20 : 16,
                                        height: isSelected ? 20 : 16,
                                        borderRadius: '50%',
                                        border: `3px solid ${isSelected ? themeColors.purple : themeColors.border}`,
                                        backgroundColor: isSelected ? themeColors.purple : themeColors.cardBackground,
                                        transition: 'all 0.3s ease',
                                        transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                                        boxShadow: isSelected
                                            ? `0 0 0 4px ${themeColors.purple}20, 0 0 12px ${themeColors.purple}60`
                                            : 'none'
                                    }}
                                >
                                    {/* Inner pulse effect for selected */}
                                    {isSelected && (
                                        <div style={{
                                            position: 'absolute',
                                            inset: -8,
                                            borderRadius: '50%',
                                            backgroundColor: themeColors.purple,
                                            opacity: 0.2,
                                            animation: 'pulse 2s ease-in-out infinite'
                                        }}></div>
                                    )}
                                </div>

                                {/* Content */}
                                <div
                                    className="timeline-content"
                                    style={{
                                        flex: 1,
                                        padding: '12px 16px',
                                        borderRadius: 8,
                                        backgroundColor: isSelected ? `${themeColors.purple}15` : 'transparent',
                                        border: `1px solid ${isSelected ? themeColors.purple : 'transparent'}`,
                                        transition: 'all 0.3s ease',
                                        transform: isSelected ? 'translateX(4px)' : 'translateX(0)'
                                    }}
                                >
                                    <div style={{
                                        fontSize: 13,
                                        fontWeight: isSelected ? 600 : 500,
                                        color: isSelected ? themeColors.purple : themeColors.text,
                                        lineHeight: 1.4,
                                        wordBreak: 'break-word'
                                    }}>
                                        {label}
                                    </div>
                                    {isSelected && (
                                        <div style={{
                                            fontSize: 11,
                                            color: themeColors.purple,
                                            marginTop: 4,
                                            fontWeight: 500,
                                            opacity: 0.8
                                        }}>
                                            ● Activo
                                        </div>
                                    )}
                                </div>
                            </button>

                            {/* Badge for first/last */}
                            {(isFirst || isLast) && (
                                <div style={{
                                    position: 'absolute',
                                    left: -8,
                                    top: isFirst ? -8 : 'auto',
                                    bottom: isLast ? -8 : 'auto',
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: themeColors.textSecondary,
                                    backgroundColor: themeColors.cardBackground,
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    border: `1px solid ${themeColors.border}`,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5
                                }}>
                                    {isFirst ? 'Inicio' : 'Fin'}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Info text */}
            {episodes.length === 0 && (
                <div style={{
                    padding: 32,
                    textAlign: 'center',
                    color: themeColors.textSecondary,
                    fontSize: 13
                }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
                    No hay episodios disponibles
                </div>
            )}

            {/* Add keyframes animation inline via style tag */}
            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.2;
                    }
                    50% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};
