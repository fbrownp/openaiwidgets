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
            padding: 16,
            border: `1px solid ${themeColors.cardBorder}`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: `1px solid ${themeColors.border}`
            }}>
                <h3 style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: themeColors.text,
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5
                }}>
                    Episodios
                </h3>
            </div>

            {/* Episode List */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                flex: 1
            }}>
                {episodes.map((episode) => {
                    const isSelected = selectedEpisode === episode.id;
                    const label = episode.label || formatEpisodeLabel(episode.id);

                    return (
                        <button
                            key={episode.id}
                            onClick={() => onEpisodeChange(episode.id)}
                            style={{
                                padding: '12px 16px',
                                borderRadius: 8,
                                border: isSelected
                                    ? `2px solid ${themeColors.purple}`
                                    : `1px solid ${themeColors.border}`,
                                backgroundColor: isSelected
                                    ? themeColors.purple
                                    : 'transparent',
                                color: isSelected
                                    ? 'white'
                                    : themeColors.text,
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: isSelected ? 600 : 500,
                                textAlign: 'left',
                                transition: 'all 0.2s ease',
                                wordWrap: 'break-word',
                                lineHeight: 1.4
                            }}
                            onMouseEnter={(e) => {
                                if (!isSelected) {
                                    e.currentTarget.style.backgroundColor = themeColors.dropdownHover;
                                    e.currentTarget.style.borderColor = themeColors.purple;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isSelected) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = themeColors.border;
                                }
                            }}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Info text */}
            {episodes.length === 0 && (
                <div style={{
                    padding: 16,
                    textAlign: 'center',
                    color: themeColors.textSecondary,
                    fontSize: 12
                }}>
                    No hay episodios disponibles
                </div>
            )}
        </div>
    );
};
