import React from 'react';
import { TreeCardProps } from './types';

/**
 * TreeCard Component
 * Displays a card containing a list of related documents
 */
export function TreeCard({
    title,
    items,
    themeColors,
    onItemClick,
    onItemHover,
    selectedItem,
    highlightedItems,
    hoveredItems,
    allNodes
}: TreeCardProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div style={{
            backgroundColor: themeColors.cardBackground,
            border: `1px solid ${themeColors.cardBorder}`,
            borderRadius: 12,
            padding: 14,
            flex: '1 1 150px',
            minWidth: 140,
            maxWidth: 220
        }}>
            {/* Card Title */}
            <h3 style={{
                margin: 0,
                marginBottom: 12,
                fontSize: 16,
                fontWeight: 600,
                color: themeColors.text,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>
                {title}
            </h3>

            {/* Items List */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                maxHeight: 500,
                overflowY: 'auto'
            }}>
                {items.map((item, index) => {
                    const itemKey = `${item.name}:${item.id}`;
                    const isHighlighted = highlightedItems.has(itemKey);
                    const isHovered = hoveredItems.has(itemKey);
                    const isSelected = selectedItem?.id === item.id && selectedItem?.name === item.name;

                    // Get related documents (excluding id_uf)
                    const relatedDocs = item.connections
                        .filter(connKey => !connKey.startsWith('id_uf:'))
                        .map(connKey => {
                            const [type, id] = connKey.split(':');
                            return { type, id };
                        });

                    // Get chip color based on expediente type
                    const getChipColor = (type: string) => {
                        const colorMap: Record<string, { bg: string; text: string }> = {
                            'expediente_seia': { bg: '#3B82F620', text: '#3B82F6' },
                            'expediente_medida': { bg: '#D9770620', text: '#D97706' },
                            'expediente_snifa': { bg: '#F9731620', text: '#F97316' },
                            'expediente_fiscalizacion': { bg: '#10B98120', text: '#10B981' }
                        };
                        return colorMap[type] || { bg: themeColors.purple + '20', text: themeColors.purple };
                    };

                    return (
                        <div
                            key={index}
                            data-node-key={itemKey}
                            onClick={() => onItemClick(item)}
                            onMouseEnter={() => onItemHover(item)}
                            onMouseLeave={() => onItemHover(null)}
                            style={{
                                padding: 12,
                                borderRadius: 8,
                                border: `2px solid ${
                                    isHighlighted
                                        ? themeColors.purple
                                        : isHovered
                                        ? themeColors.purple + '40'
                                        : themeColors.cardBorder
                                }`,
                                backgroundColor: isSelected
                                    ? themeColors.purple + '20'
                                    : isHighlighted
                                    ? themeColors.purple + '10'
                                    : isHovered
                                    ? themeColors.purple + '05'
                                    : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: themeColors.text,
                                wordBreak: 'break-word'
                            }}>
                                {item.id}
                            </div>
                            {relatedDocs.length > 0 && (
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 4,
                                    marginTop: 8,
                                    paddingTop: 8,
                                    borderTop: `1px solid ${themeColors.cardBorder}`
                                }}>
                                    {relatedDocs.map((rel, relIdx) => {
                                        const colors = getChipColor(rel.type);
                                        return (
                                            <div
                                                key={relIdx}
                                                style={{
                                                    fontSize: 9,
                                                    padding: '2px 6px',
                                                    backgroundColor: colors.bg,
                                                    color: colors.text,
                                                    borderRadius: 4,
                                                    fontWeight: 600
                                                }}
                                            >
                                                {rel.id}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
