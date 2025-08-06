'use client';

import { useEffect, useState } from 'react';

interface UseScrollDirectionProps {
  threshold?: number;
  debounceMs?: number;
}

interface ScrollState {
  scrollDirection: 'up' | 'down' | null;
  isScrolling: boolean;
  scrollY: number;
  isAtTop: boolean;
}

export function useScrollDirection({ 
  threshold = 10, 
  debounceMs = 150 
}: UseScrollDirectionProps = {}): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollDirection: null,
    isScrolling: false,
    scrollY: 0,
    isAtTop: true,
  });

  useEffect(() => {
    // Ensure we're in the browser environment
    if (typeof window === 'undefined') return;
    
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;
    let rafId: number;
    let isThrottled = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const difference = Math.abs(scrollY - lastScrollY);
      const isAtTop = scrollY < threshold;

      // Throttle updates for better performance
      if (isThrottled) return;
      isThrottled = true;
      
      // Reset throttle after next frame
      requestAnimationFrame(() => {
        isThrottled = false;
      });

      // Only update direction if scroll difference is above threshold
      if (difference >= threshold) {
        const newDirection = scrollY > lastScrollY ? 'down' : 'up';
        
        setScrollState(prev => ({
          ...prev,
          scrollDirection: newDirection,
          scrollY,
          isAtTop,
          isScrolling: true,
        }));

        lastScrollY = scrollY;
      } else {
        // Update scroll position and top state even if direction doesn't change
        setScrollState(prev => ({
          ...prev,
          scrollY,
          isAtTop,
          isScrolling: true,
        }));
      }

      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set new timeout to detect when scrolling stops
      scrollTimeout = setTimeout(() => {
        setScrollState(prev => ({
          ...prev,
          isScrolling: false,
        }));
      }, debounceMs);
    };

    const handleScroll = () => {
      // Use requestAnimationFrame for smooth performance
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(updateScrollDirection);
    };

    // Set initial scroll position
    setScrollState(prev => ({
      ...prev,
      scrollY: window.scrollY,
      isAtTop: window.scrollY < threshold,
    }));

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [threshold, debounceMs]);

  return scrollState;
}