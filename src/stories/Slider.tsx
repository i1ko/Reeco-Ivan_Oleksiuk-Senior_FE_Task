import React, { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

export interface SliderProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  /**
   * Determines the movement type:
   * - 'pixel': moves by a fixed number of pixels (using moveValue)
   * - 'item': moves by a given number of items (moveValue = number of items to scroll)
   */
  moveBy: 'pixel' | 'item';
  /**
   * The value used for movement.
   * In 'pixel' mode, it is the number of pixels to move per click.
   * In 'item' mode, it is the number of items to scroll per click.
   */
  moveValue: number;
  /** Gap between items in pixels */
  gap?: number;
  /** Orientation of the slider: 'horizontal' or 'vertical'. Default is 'horizontal'. */
  orientation?: 'horizontal' | 'vertical';
  /** Whether the slider should be responsive */
  responsive?: boolean;
  /**
   * Determines how the items are positioned. Working only with `moveBy: 'item'` mode.
   * 'edge' – aligns the items to the edge (current behavior).
   * 'center' – centers the active item within the container.
   */
  centrateBy?: 'edge' | 'center';
}

export function Slider<T>({
                            items,
                            renderItem,
                            moveBy,
                            moveValue,
                            gap = 0,
                            orientation = 'horizontal',
                            responsive = false,
                            centrateBy = 'edge',
                          }: SliderProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  // State for active index (used in center mode)
  const [activeIndex, setActiveIndex] = useState(0);

  // Calculate the maximum offset so that the last element is fully visible
  useEffect(() => {
    const calculateMaxOffset = () => {
      if (containerRef.current && sliderRef.current) {
        const containerSize =
          orientation === 'horizontal'
            ? containerRef.current.offsetWidth
            : containerRef.current.offsetHeight;
        const sliderSize =
          orientation === 'horizontal'
            ? sliderRef.current.scrollWidth
            : sliderRef.current.scrollHeight;
        const newMaxOffset = Math.max(sliderSize - containerSize, 0);
        setMaxOffset(newMaxOffset);
      }
    };

    calculateMaxOffset();
    window.addEventListener('resize', calculateMaxOffset);
    return () => window.removeEventListener('resize', calculateMaxOffset);
  }, [orientation, items, gap, moveValue, moveBy]);

  const handleNext = () => {
    if (moveBy === 'pixel') {
      // Pixel mode: simply add moveValue (in pixels)
      setOffset((prev) => Math.min(prev + moveValue, maxOffset));
    } else if (moveBy === 'item') {
      if (centrateBy === 'center') {
        // Center mode: update activeIndex and compute offset so that the active element is centered
        const newIndex = Math.min(activeIndex + moveValue, items.length - 1);
        setActiveIndex(newIndex);
        if (containerRef.current && sliderRef.current) {
          const containerSize =
            orientation === 'horizontal'
              ? containerRef.current.offsetWidth
              : containerRef.current.offsetHeight;
          const activeElement = sliderRef.current.children[newIndex] as HTMLElement;
          let itemCenter = 0;
          if (orientation === 'horizontal') {
            itemCenter = activeElement.offsetLeft + activeElement.offsetWidth / 2;
          } else {
            itemCenter = activeElement.offsetTop + activeElement.offsetHeight / 2;
          }
          let newOffset = itemCenter - containerSize / 2;
          newOffset = Math.max(0, Math.min(newOffset, maxOffset));
          setOffset(newOffset);
        }
      } else {
        // Edge mode: current behavior – scroll by (moveValue * (item dimension + gap))
        if (sliderRef.current && sliderRef.current.firstElementChild) {
          const firstChild = sliderRef.current.firstElementChild as HTMLElement;
          const itemSize =
            (orientation === 'horizontal' ? firstChild.offsetWidth : firstChild.offsetHeight) + gap;
          const increment = moveValue * itemSize;
          setOffset((prev) => Math.min(prev + increment, maxOffset));
        }
      }
    }
  };

  const handlePrev = () => {
    if (moveBy === 'pixel') {
      // Pixel mode: simply subtract moveValue (in pixels)
      setOffset((prev) => Math.max(prev - moveValue, 0));
    } else if (moveBy === 'item') {
      if (centrateBy === 'center') {
        // Center mode: update activeIndex and compute offset so that the active element is centered
        const newIndex = Math.max(activeIndex - moveValue, 0);
        setActiveIndex(newIndex);
        if (containerRef.current && sliderRef.current) {
          const containerSize =
            orientation === 'horizontal'
              ? containerRef.current.offsetWidth
              : containerRef.current.offsetHeight;
          const activeElement = sliderRef.current.children[newIndex] as HTMLElement;
          let itemCenter = 0;
          if (orientation === 'horizontal') {
            itemCenter = activeElement.offsetLeft + activeElement.offsetWidth / 2;
          } else {
            itemCenter = activeElement.offsetTop + activeElement.offsetHeight / 2;
          }
          let newOffset = itemCenter - containerSize / 2;
          newOffset = Math.max(0, Math.min(newOffset, maxOffset));
          setOffset(newOffset);
        }
      } else {
        // Edge mode: current behavior
        if (sliderRef.current && sliderRef.current.firstElementChild) {
          const firstChild = sliderRef.current.firstElementChild as HTMLElement;
          const itemSize =
            (orientation === 'horizontal' ? firstChild.offsetWidth : firstChild.offsetHeight) + gap;
          const increment = moveValue * itemSize;
          setOffset((prev) => Math.max(prev - increment, 0));
        }
      }
    }
  };

  // Determine transform style based on orientation and current offset
  const transformStyle =
    orientation === 'horizontal'
      ? `translateX(-${offset}px)`
      : `translateY(-${offset}px)`;

  const containerStyle: CSSProperties = {
    overflow: 'hidden',
    position: 'relative',
    width: responsive ? '100%' : 'auto',
    height: responsive ? '100%' : 'auto',
  };

  const sliderStyle: CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    transform: transformStyle,
    transition: 'transform 0.3s ease-in-out',
  };

  return (
    <div style={containerStyle} ref={containerRef}>
      <div style={sliderStyle} ref={sliderRef}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              flexShrink: 0,
              // Apply gap between items (except for the last element)
              marginRight:
                orientation === 'horizontal' && index !== items.length - 1 ? gap : 0,
              marginBottom:
                orientation === 'vertical' && index !== items.length - 1 ? gap : 0,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {/* Navigation Arrows */}
      {offset > 0 && (
        <button
          style={
            orientation === 'horizontal'
              ? {
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
              }
              : {
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
              }
          }
          onClick={handlePrev}
        >
          {orientation === 'horizontal' ? '←' : '▲'}
        </button>
      )}
      {offset < maxOffset && (
        <button
          style={
            orientation === 'horizontal'
              ? {
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
              }
              : {
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
              }
          }
          onClick={handleNext}
        >
          {orientation === 'horizontal' ? '→' : '▼'}
        </button>
      )}
    </div>
  );
}
