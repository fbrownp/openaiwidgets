import React, { useState } from 'react';
import { FilterConfig, ThemeColors } from './types';

interface DropdownFilterProps {
    filters: FilterConfig[];
    onFilterChange: (filterLabel: string, newValues: string[]) => void;
    themeColors: ThemeColors;
}

export const DropdownFilter: React.FC<DropdownFilterProps> = ({
    filters,
    onFilterChange,
    themeColors
}) => {
    const [openFilter, setOpenFilter] = useState<string | null>(null);

    const toggleFilter = (filterLabel: string) => {
        setOpenFilter(openFilter === filterLabel ? null : filterLabel);
    };

    const handleOptionToggle = (filter: FilterConfig, optionValue: string) => {
        const currentValues = filter.selectedValues;
        let newValues: string[];

        // Special handling for "Todas" option
        if (optionValue === 'Todas') {
            newValues = currentValues.includes('Todas') ? [] : ['Todas'];
        } else {
            if (filter.multiSelect) {
                // Remove "Todas" if present when selecting specific option
                const withoutTodas = currentValues.filter(v => v !== 'Todas');
                if (withoutTodas.includes(optionValue)) {
                    newValues = withoutTodas.filter(v => v !== optionValue);
                } else {
                    newValues = [...withoutTodas, optionValue];
                }
            } else {
                newValues = [optionValue];
                setOpenFilter(null);
            }
        }

        onFilterChange(filter.label, newValues);
    };

    return (
        <div style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: `1px solid ${themeColors.border}`
        }}>
            {filters.map((filter) => (
                <div key={filter.label} style={{ position: 'relative' }}>
                    <button
                        onClick={() => toggleFilter(filter.label)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: 8,
                            border: `1px solid ${themeColors.dropdownBorder}`,
                            backgroundColor: themeColors.dropdownBg,
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            transition: 'all 0.2s',
                            color: filter.selectedValues.length > 0 ? themeColors.purple : themeColors.text
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = themeColors.purple;
                            e.currentTarget.style.backgroundColor = themeColors.dropdownHover;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = themeColors.dropdownBorder;
                            e.currentTarget.style.backgroundColor = themeColors.dropdownBg;
                        }}
                    >
                        {filter.label}
                        {filter.selectedValues.length > 0 && (
                            <span style={{
                                backgroundColor: themeColors.purple,
                                color: 'white',
                                borderRadius: 10,
                                padding: '2px 8px',
                                fontSize: 12,
                                fontWeight: 600
                            }}>
                                {filter.selectedValues.length}
                            </span>
                        )}
                        <span style={{ fontSize: 10, color: themeColors.textSecondary }}>▼</span>
                    </button>

                    {openFilter === filter.label && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: 4,
                            backgroundColor: themeColors.dropdownBg,
                            border: `1px solid ${themeColors.border}`,
                            borderRadius: 8,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                            zIndex: 1000,
                            minWidth: 200,
                            maxHeight: 300,
                            overflowY: 'auto'
                        }}>
                            {filter.options.map((option) => (
                                <div
                                    key={option}
                                    onClick={() => handleOptionToggle(filter, option)}
                                    style={{
                                        padding: '10px 16px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        fontSize: 14,
                                        transition: 'background-color 0.2s',
                                        color: themeColors.text,
                                        backgroundColor: filter.selectedValues.includes(option)
                                            ? themeColors.dropdownSelected
                                            : 'transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = themeColors.dropdownHover;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            filter.selectedValues.includes(option)
                                                ? themeColors.dropdownSelected
                                                : 'transparent';
                                    }}
                                >
                                    {filter.multiSelect && (
                                        <div style={{
                                            width: 16,
                                            height: 16,
                                            border: `2px solid ${themeColors.purple}`,
                                            borderRadius: 3,
                                            backgroundColor: filter.selectedValues.includes(option)
                                                ? themeColors.purple
                                                : themeColors.cardBackground,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: 10
                                        }}>
                                            {filter.selectedValues.includes(option) && '✓'}
                                        </div>
                                    )}
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
