'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ScrollZoomProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  scaleFrom?: number;
  yOffset?: number;
  amount?: number | 'some' | 'all';
}

/**
 * ScrollZoomOut Component
 * Provides a high-performance, GPU-accelerated "Zoom Out" reveal animation
 * as content scrolls into the viewport.
 * 
 * Initial state: opacity 0, scale 1.07 (or 0.94), slightly offset.
 * In-view state: opacity 1, scale 1, settling smoothly into place.
 */
export function ScrollZoomOut({
  children,
  className = '',
  delay = 0,
  duration = 0.65,
  scaleFrom = 1.06,
  yOffset = 24,
  amount = 0.12,
}: ScrollZoomProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: scaleFrom,
        y: yOffset,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: amount as any,
        margin: '0px 0px -40px 0px',
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Smooth cubic-bezier deceleration
      }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollZoomIn Component
 * Alternative smooth scale-up zoom reveal (scale 0.94 -> 1)
 */
export function ScrollZoomIn({
  children,
  className = '',
  delay = 0,
  duration = 0.65,
  amount = 0.12,
}: ScrollZoomProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.94,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: amount as any,
        margin: '0px 0px -40px 0px',
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
