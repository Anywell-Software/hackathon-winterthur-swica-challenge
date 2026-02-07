// ============================================
// Animated Number (Count-up) Component
// ============================================

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatOptions?: Intl.NumberFormatOptions;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const AnimatedNumber = ({
  value,
  duration = 1,
  formatOptions = {},
  className = '',
  prefix = '',
  suffix = '',
}: AnimatedNumberProps) => {
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) =>
    new Intl.NumberFormat('de-CH', formatOptions).format(Math.round(current))
  );
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    return display.on('change', (v) => setDisplayValue(v));
  }, [display]);

  return (
    <span className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};

// Simple hook version for more control
export const useCountUp = (end: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = countRef.current;
    const difference = end - startValue;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const currentValue = Math.round(startValue + difference * easeOutQuad);

      setCount(currentValue);
      countRef.current = currentValue;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = null;
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

// Points display with animation
export const AnimatedPoints = ({
  points,
  showPlus = false,
  className = '',
}: {
  points: number;
  showPlus?: boolean;
  className?: string;
}) => {
  const count = useCountUp(points, 800);

  return (
    <motion.span
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {showPlus && points > 0 ? '+' : ''}
      {count.toLocaleString('de-CH')}
    </motion.span>
  );
};

export default AnimatedNumber;
