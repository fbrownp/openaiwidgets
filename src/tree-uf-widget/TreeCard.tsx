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
    selectedItem,
    highlightedItems
}: TreeCardProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div style={{
            backgroundColor: themeColors.cardBackground,
            border: `1px solid ${themeColors.cardBorder}`,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16
        }}>
            {/* Card Title */}
            <h3 style={{
                margin: 0,
                marginBottom: 12,
                fontSize: 16,
                fontWeight: 600,
                color: themeColors.text
            }}>
                {title}
            </h3>

            {/* Items List */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8
            }}>
                {items.map((item, index) => {
                    const itemKey = `${item.name}:${item.id}`;
                    const isHighlighted = highlightedItems.has(itemKey);
                    const isSelected = selectedItem?.id === item.id && selectedItem?.name === item.name;

                    return (
                        <div
                            key={index}
                            data-node-key={itemKey}
                            onClick={() => onItemClick(item)}
                            style={{
                                padding: 12,
                                borderRadius: 8,
                                border: `2px solid ${isHighlighted ? themeColors.purple : themeColors.cardBorder}`,
                                backgroundColor: isSelected
                                    ? themeColors.purple + '20'
                                    : isHighlighted
                                    ? themeColors.purple + '10'
                                    : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                position: 'relative'
                            }}
                            onMouseEnter={(e) => {
                                if (!isHighlighted) {
                                    e.currentTarget.style.backgroundColor = themeColors.buttonHover;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isHighlighted) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
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
                            {item.connections.length > 0 && (
                                <div style={{
                                    fontSize: 12,
                                    color: themeColors.textSecondary,
                                    marginTop: 4
                                }}>
                                    {item.connections.length} {item.connections.length === 1 ? 'conexión' : 'conexiones'}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
