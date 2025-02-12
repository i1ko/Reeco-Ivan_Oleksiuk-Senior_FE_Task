import React, { useState, useEffect, useRef, type CSSProperties } from 'react';

export interface SliderProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Determines the movement type: 'pixel' moves by a fixed number of pixels, 'item' moves by one item width (plus gap) */
  moveBy: 'pixel' | 'item';
  /** The value used for movement when moveBy is 'pixel'. Ignored if moveBy is 'item'. */
  moveValue: number;
  /** Gap between items in pixels */
  gap?: number;
  /** Orientation of the slider: 'horizontal' or 'vertical'. Default is 'horizontal'. */
  orientation?: 'horizontal' | 'vertical';
  /** Whether the slider should be responsive */
  responsive?: boolean;
}

export function Slider<T>({
                            items,
                            renderItem,
                            moveBy,
                            moveValue,
                            gap = 0,
                            orientation = 'horizontal',
                            responsive = false,
                          }: SliderProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

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
    let increment = moveValue;
    if (moveBy === 'item' && sliderRef.current && sliderRef.current.firstElementChild) {
      const firstChild = sliderRef.current.firstElementChild as HTMLElement;
      // For 'item' mode, use the dimension of the first item plus gap
      increment = (orientation === 'horizontal' ? firstChild.offsetWidth : firstChild.offsetHeight) + gap;
    }
    setOffset((prev) => Math.min(prev + increment, maxOffset));
  };

  const handlePrev = () => {
    let increment = moveValue;
    if (moveBy === 'item' && sliderRef.current && sliderRef.current.firstElementChild) {
      const firstChild = sliderRef.current.firstElementChild as HTMLElement;
      increment = (orientation === 'horizontal' ? firstChild.offsetWidth : firstChild.offsetHeight) + gap;
    }
    setOffset((prev) => Math.max(prev - increment, 0));
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
          style={{
            position: 'absolute',
            left: orientation === 'horizontal' ? 0 : '50%',
            top: orientation === 'vertical' ? 0 : '50%',
            transform:
              orientation === 'horizontal'
                ? 'translateY(-50%)'
                : 'translateX(-50%)',
          }}
          onClick={handlePrev}
        >
          &#8592;
        </button>
      )}
      {offset < maxOffset && (
        <button
          style={{
            position: 'absolute',
            right: orientation === 'horizontal' ? 0 : '50%',
            bottom: orientation === 'vertical' ? 0 : '50%',
            transform:
              orientation === 'horizontal'
                ? 'translateY(-50%)'
                : 'translateX(-50%)',
          }}
          onClick={handleNext}
        >
          &#8594;
        </button>
      )}
    </div>
  );
}
