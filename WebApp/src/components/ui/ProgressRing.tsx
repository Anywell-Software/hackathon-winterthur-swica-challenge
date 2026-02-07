// ============================================
// Progress Ring Component (SVG-based)
// ============================================

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CATEGORY_META, TaskCategory } from '../../types';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  category?: TaskCategory;
  color?: string;
  showPercentage?: boolean;
  showPercent?: boolean;
  icon?: string;
  label?: string;
  animated?: boolean;
  className?: string;
  children?: ReactNode;
}

export const ProgressRing = ({
  progress,
  size = 80,
  strokeWidth = 8,
  category,
  color,
  showPercentage = true,
  showPercent,
  icon,
  label,
  animated = true,
  className = '',
  children,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  // Get color from category or use provided color
  const ringColor = category
    ? CATEGORY_META[category].color
    : color || '#00A39D';

  const categoryMeta = category ? CATEGORY_META[category] : null;
  
  // Support both showPercentage and showPercent
  const shouldShowPercent = showPercent !== undefined ? showPercent : showPercentage;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children ? (
            children
          ) : icon || categoryMeta?.icon ? (
            <span className="text-2xl" role="img" aria-label={categoryMeta?.name}>
              {icon || categoryMeta?.icon}
            </span>
          ) : shouldShowPercent ? (
            <motion.span
              className="text-lg font-bold"
              initial={animated ? { opacity: 0 } : { opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Math.round(progress)}%
            </motion.span>
          ) : null}
        </div>
      </div>
      
      {label && (
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
          {label}
        </span>
      )}
    </div>
  );
};

// Mini version for inline use
export const ProgressRingMini = ({
  progress,
  category,
  color,
}: Pick<ProgressRingProps, 'progress' | 'category' | 'color'>) => {
  const size = 24;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const ringColor = category
    ? CATEGORY_META[category].color
    : color || '#00A39D';

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-200 dark:text-gray-700"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={ringColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  );
};

export default ProgressRing;
