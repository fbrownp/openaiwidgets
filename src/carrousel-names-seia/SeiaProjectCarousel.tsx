import React, { useRef, useState } from 'react';
import { SeiaProjectCarouselProps } from './types';
import { SeiaProjectCard } from './SeiaProjectCard';

/**
 * SeiaProjectCarousel Component
 * Displays a scrollable carousel of SEIA project cards
 */
export const SeiaProjectCarousel: React.FC<SeiaProjectCarouselProps> = ({
    projects,
    themeColors
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Check scroll position to update button states
    const checkScrollPosition = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
            container.scrollLeft < container.scrollWidth - container.clientWidth - 10
        );
    };

    // Scroll left
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -360,
                behavior: 'smooth'
            });
            setTimeout(checkScrollPosition, 300);
        }
    };

    // Scroll right
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 360,
                behavior: 'smooth'
            });
            setTimeout(checkScrollPosition, 300);
        }
    };

    // Initial check on mount
    React.useEffect(() => {
        checkScrollPosition();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollPosition);
            return () => container.removeEventListener('scroll', checkScrollPosition);
        }
    }, [projects]);

    if (projects.length === 0) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                color: themeColors.textSecondary,
                fontSize: 14
            }}>
                No se encontraron proyectos SEIA
            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            {/* Carousel Container */}
            <div
                ref={scrollContainerRef}
                style={{
                    display: 'flex',
                    gap: 20,
                    overflowX: 'auto',
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE/Edge
                    padding: '8px 4px 24px 4px',
                    // Hide scrollbar for Chrome, Safari, and Opera
                    WebkitOverflowScrolling: 'touch'
                }}
                className="seia-carousel-container"
            >
                {projects.map((project, index) => (
                    <SeiaProjectCard
                        key={`${project.expediente_seia}-${index}`}
                        project={project}
                        themeColors={themeColors}
                    />
                ))}
            </div>

            {/* Navigation buttons */}
            {projects.length > 1 && (
                <>
                    {/* Left arrow */}
                    <button
                        onClick={scrollLeft}
                        disabled={!canScrollLeft}
                        style={{
                            position: 'absolute',
                            left: -16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            border: `2px solid ${themeColors.cardBorder}`,
                            backgroundColor: themeColors.cardBackground,
                            color: themeColors.text,
                            fontSize: 20,
                            cursor: canScrollLeft ? 'pointer' : 'not-allowed',
                            opacity: canScrollLeft ? 1 : 0.3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s',
                            zIndex: 10
                        }}
                        onMouseEnter={(e) => {
                            if (canScrollLeft) {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        ←
                    </button>

                    {/* Right arrow */}
                    <button
                        onClick={scrollRight}
                        disabled={!canScrollRight}
                        style={{
                            position: 'absolute',
                            right: -16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            border: `2px solid ${themeColors.cardBorder}`,
                            backgroundColor: themeColors.cardBackground,
                            color: themeColors.text,
                            fontSize: 20,
                            cursor: canScrollRight ? 'pointer' : 'not-allowed',
                            opacity: canScrollRight ? 1 : 0.3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s',
                            zIndex: 10
                        }}
                        onMouseEnter={(e) => {
                            if (canScrollRight) {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        →
                    </button>
                </>
            )}

            {/* Indicator dots */}
            {projects.length > 1 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 8,
                    marginTop: 8
                }}>
                    {projects.map((_, index) => (
                        <div
                            key={index}
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: themeColors.textSecondary,
                                opacity: 0.3,
                                transition: 'opacity 0.2s'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
