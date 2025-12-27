import React, { useState } from 'react';
import { DropdownFilterProps, FilterConfig } from './types';

export const DropdownFilter: React.FC<DropdownFilterProps> = ({
    filters,
    onFilterChange
}) => {
    const [openFilter, setOpenFilter] = useState<string | null>(null);

    const toggleFilter = (filterLabel: string) => {
        setOpenFilter(openFilter === filterLabel ? null : filterLabel);
    };

    const handleOptionToggle = (filter: FilterConfig, optionValue: string) => {
        const currentValues = filter.selectedValues;
        let newValues: string[];

        if (filter.multiSelect) {
            if (currentValues.includes(optionValue)) {
                newValues = currentValues.filter(v => v !== optionValue);
            } else {
                newValues = [...currentValues, optionValue];
            }
        } else {
            newValues = [optionValue];
            setOpenFilter(null);
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
            borderBottom: '1px solid #e5e7eb'
        }}>
            {filters.map((filter) => (
                <div key={filter.label} style={{ position: 'relative' }}>
                    <button
                        onClick={() => toggleFilter(filter.label)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: 8,
                            border: '1px solid #d1d5db',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            transition: 'all 0.2s',
                            color: filter.selectedValues.length > 0 ? '#6366f1' : '#374151'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#6366f1';
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#d1d5db';
                            e.currentTarget.style.backgroundColor = 'white';
                        }}
                    >
                        {filter.label}
                        {filter.selectedValues.length > 0 && (
                            <span style={{
                                backgroundColor: '#6366f1',
                                color: 'white',
                                borderRadius: 10,
                                padding: '2px 8px',
                                fontSize: 12,
                                fontWeight: 600
                            }}>
                                {filter.selectedValues.length}
                            </span>
                        )}
                        <span style={{ fontSize: 10 }}>▼</span>
                    </button>

                    {openFilter === filter.label && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: 4,
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: 8,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            zIndex: 1000,
                            minWidth: 200,
                            maxHeight: 300,
                            overflowY: 'auto'
                        }}>
                            {filter.options.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleOptionToggle(filter, option.value)}
                                    style={{
                                        padding: '10px 16px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        fontSize: 14,
                                        transition: 'background-color 0.2s',
                                        backgroundColor: filter.selectedValues.includes(option.value)
                                            ? '#f0f0ff'
                                            : 'transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f9fafb';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            filter.selectedValues.includes(option.value)
                                                ? '#f0f0ff'
                                                : 'transparent';
                                    }}
                                >
                                    {filter.multiSelect && (
                                        <div style={{
                                            width: 16,
                                            height: 16,
                                            border: '2px solid #6366f1',
                                            borderRadius: 3,
                                            backgroundColor: filter.selectedValues.includes(option.value)
                                                ? '#6366f1'
                                                : 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: 10
                                        }}>
                                            {filter.selectedValues.includes(option.value) && '✓'}
                                        </div>
                                    )}
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};