import React, { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

// Threshold of 3px is used to check if offset is almost equal to previous max.
const ThresholdPx = 3;

export enum SliderMoveBy {
  Pixel = 'pixel',
  Item = 'item',
}

export enum SliderOrientation {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export enum SliderCentrateBy {
  Edge = 'edge',
  Center = 'center',
}

export interface SliderProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  /**
   * Determines the movement type:
   * - SliderMoveBy.Pixel: moves by a fixed number of pixels (using moveValue)
   * - SliderMoveBy.Item: moves by a given number of items (moveValue = number of items to scroll)
   */
  moveBy?: SliderMoveBy;
  /**
   * The value used for movement.
   * In 'pixel' mode, it is the number of pixels to move per click.
   * In 'item' mode, it is the number of items to scroll per click.
   */
  moveValue?: number;
  /** Gap between items in pixels */
  gap?: number;
  /** Orientation of the slider: Horizontal or Vertical. Default is Horizontal. */
  orientation?: SliderOrientation;
  /**
   * Determines how the items are positioned. Working only with `moveBy: SliderMoveBy.Item` mode.
   * SliderCentrateBy.Edge – aligns the items to the edge (current behavior).
   * SliderCentrateBy.Center – centers the active item within the container.
   */
  centrateBy?: SliderCentrateBy;
}

export function Slider<T>({
                            items,
                            renderItem,
                            moveBy = SliderMoveBy.Item,
                            moveValue = (moveBy === SliderMoveBy.Item ? 1 : 150),
                            gap = 0,
                            orientation = SliderOrientation.Horizontal,
                            centrateBy = SliderCentrateBy.Edge,
                          }: SliderProps<T>) {
  const isHorizontalOrientation = orientation === SliderOrientation.Horizontal,
        isVerticalOrientation = orientation === SliderOrientation.Vertical,
        isMovedByPixel = moveBy === SliderMoveBy.Pixel,
        isMovedByItem = moveBy === SliderMoveBy.Item,
        isCentrateByCenter = centrateBy === SliderCentrateBy.Center,
        isCentrateByEdge = centrateBy === SliderCentrateBy.Edge;

  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  // State for active index (used in center mode)
  const [activeIndex, setActiveIndex] = useState(0);
  // Ref to store the previous maxOffset
  const previousMaxOffsetRef = useRef(0);

  // Function for recalculating maximum displacement
  const calculateMaxOffset = () => {
    if (containerRef.current && sliderRef.current) {
      const containerSize =
        isHorizontalOrientation
          ? containerRef.current.offsetWidth
          : containerRef.current.offsetHeight;
      const sliderSize =
        isHorizontalOrientation
          ? sliderRef.current.scrollWidth
          : sliderRef.current.scrollHeight;
      const newMaxOffset = Math.max(sliderSize - containerSize, 0);
      console.log('[calculateMaxOffset]: recalculating...');
      console.table({
        sliderSize,
        containerSize,
        previousMaxOffset: previousMaxOffsetRef.current,
        newMaxOffset,
        currentOffset: offset,
      });
      // If newMaxOffset increased and the current offset is "at the end", update offset.
      setOffset((prevOffset) => {
        if (
          previousMaxOffsetRef.current > 0 &&
          newMaxOffset > previousMaxOffsetRef.current &&
          Math.abs(prevOffset - previousMaxOffsetRef.current) < ThresholdPx
        ) {
          console.log('[calculateMaxOffset]: Adjusting offset from', prevOffset, 'to newMaxOffset', newMaxOffset);
          return newMaxOffset;
        }
        return prevOffset;
      });
      previousMaxOffsetRef.current = newMaxOffset;
      setMaxOffset(newMaxOffset);
    }
  };

  // Debug logging on offset change
  useEffect(() => {
    const containerSize =
      isHorizontalOrientation
        ? containerRef?.current?.offsetWidth
        : containerRef?.current?.offsetHeight;
    const sliderSize =
      isHorizontalOrientation
        ? sliderRef?.current?.scrollWidth
        : sliderRef?.current?.scrollHeight;
    const newMaxOffset = Math.max(sliderSize! - containerSize!, 0);
    console.log('[DEBUG]: useEffect offset changed', {sliderSize, containerSize});
    console.table({
      sliderSize,
      containerSize,
      previousMaxOffsetRef: previousMaxOffsetRef.current,
      newMaxOffset,
      currentOffset: offset,
    });
  }, [offset]);

  // Call calculateMaxOffset when load or when display size changes
  useEffect(() => {
    calculateMaxOffset();
    window.addEventListener('resize', calculateMaxOffset);

    // Using ResizeObserver to watch sliderRef size changes
    let resizeObserver: ResizeObserver | null = null;
    if (sliderRef.current) {
      resizeObserver = new ResizeObserver(() => {
        calculateMaxOffset();
      });
      resizeObserver.observe(sliderRef.current);
    }
    return () => {
      window.removeEventListener('resize', calculateMaxOffset);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [orientation, items, gap, moveValue, moveBy, offset]);

  const handleNext = () => {
    if (isMovedByPixel) {
      setOffset((prev) => {
        const newOffset = Math.min(prev + moveValue, maxOffset);
        console.log('[handleNext] Pixel mode:', { prev, moveValue, newOffset, maxOffset });
        return newOffset;
      });
      return;
    }
    if (isMovedByItem) {
      if (isCentrateByCenter) {
        const newIndex = Math.min(activeIndex + moveValue, items.length - 1);
        console.log('[handleNext] Center mode: newIndex:', newIndex);
        setActiveIndex(newIndex);
        if (containerRef.current && sliderRef.current) {
          const containerSize =
            isHorizontalOrientation
              ? containerRef.current.offsetWidth
              : containerRef.current.offsetHeight;
          const activeElement = sliderRef.current.children[newIndex] as HTMLElement;
          let itemCenter = 0;
          if (isHorizontalOrientation) {
            itemCenter = activeElement.offsetLeft + activeElement.offsetWidth / 2;
          } else {
            itemCenter = activeElement.offsetTop + activeElement.offsetHeight / 2;
          }
          let newOffset = itemCenter - containerSize / 2;
          newOffset = Math.max(0, Math.min(newOffset, maxOffset));
          console.log('[handleNext] Center mode:', { itemCenter, containerSize, newOffset, maxOffset });
          setOffset(newOffset);
        }
      } else {
        if (sliderRef.current && sliderRef.current.firstElementChild) {
          const firstChild = sliderRef.current.firstElementChild as HTMLElement;
          const itemSize =
            (isHorizontalOrientation ? firstChild.offsetWidth : firstChild.offsetHeight) + gap;
          const increment = moveValue * itemSize;
          console.log('[handleNext] Edge mode:', { itemSize, moveValue, increment, currentOffset: offset, maxOffset });
          setOffset((prev) => Math.min(prev + increment, maxOffset));
        }
      }
      return;
    }
  };

  const handlePrev = () => {
    if (isMovedByPixel) {
      setOffset((prev) => {
        const newOffset = Math.max(prev - moveValue, 0);
        console.log('[handlePrev] Pixel mode:', { prev, moveValue, newOffset });
        return newOffset;
      });
    } else if (isMovedByItem) {
      if (isCentrateByCenter) {
        const newIndex = Math.max(activeIndex - moveValue, 0);
        console.log('[handlePrev] Center mode: newIndex:', newIndex);
        setActiveIndex(newIndex);
        if (containerRef.current && sliderRef.current) {
          const containerSize =
            isHorizontalOrientation
              ? containerRef.current.offsetWidth
              : containerRef.current.offsetHeight;
          const activeElement = sliderRef.current.children[newIndex] as HTMLElement;
          let itemCenter = 0;
          if (isHorizontalOrientation) {
            itemCenter = activeElement.offsetLeft + activeElement.offsetWidth / 2;
          } else {
            itemCenter = activeElement.offsetTop + activeElement.offsetHeight / 2;
          }
          let newOffset = itemCenter - containerSize / 2;
          newOffset = Math.max(0, Math.min(newOffset, maxOffset));
          console.log('[handlePrev] Center mode:', { itemCenter, containerSize, newOffset, maxOffset });
          setOffset(newOffset);
        }
      } else {
        if (sliderRef.current && sliderRef.current.firstElementChild) {
          const firstChild = sliderRef.current.firstElementChild as HTMLElement;
          const itemSize =
            (isHorizontalOrientation ? firstChild.offsetWidth : firstChild.offsetHeight) + gap;
          const increment = moveValue * itemSize;
          console.log('[handlePrev] Edge mode:', { itemSize, moveValue, increment, currentOffset: offset });
          setOffset((prev) => Math.max(prev - increment, 0));
        }
      }
    }
  };

  const transformStyle =
    isHorizontalOrientation
      ? `translateX(-${offset}px)`
      : `translateY(-${offset}px)`;

  const containerStyle: CSSProperties = {
    overflow: 'hidden',
    position: 'relative',
    width: 'auto',
    height: 'auto',
  };

  const sliderStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isHorizontalOrientation ? 'row' : 'column',
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
              marginRight:
                isHorizontalOrientation && index !== items.length - 1 ? gap : 0,
              marginBottom:
                isVerticalOrientation && index !== items.length - 1 ? gap : 0,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {offset > 0 && (
        <button
          style={
            isHorizontalOrientation
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
          {isHorizontalOrientation ? '←' : '▲'}
        </button>
      )}
      {offset < maxOffset && (
        <button
          style={
            isHorizontalOrientation
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
          {isHorizontalOrientation ? '→' : '▼'}
        </button>
      )}
    </div>
  );
}
