// ============================================
// Badge Component
// ============================================

import { HTMLAttributes } from 'react';
import { TaskCategory, TaskPriority, CATEGORY_META } from '../../types';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  category?: TaskCategory;
  priority?: TaskPriority;
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge = ({
  variant = 'default',
  size = 'sm',
  category,
  priority,
  className = '',
  children,
  ...props
}: BadgeProps) => {
  let colorClasses = 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

  if (category) {
    const meta = CATEGORY_META[category];
    colorClasses = `text-white`;
    const style = { backgroundColor: meta.color };
    return (
      <span
        className={`
          inline-flex items-center gap-1 rounded-full font-medium
          ${sizes[size]}
          ${className}
        `}
        style={style}
        {...props}
      >
        <span>{meta.icon}</span>
        {children || meta.name}
      </span>
    );
  }

  if (priority) {
    colorClasses = priorityColors[priority];
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${colorClasses}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

// Priority badge
export const PriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const labels = {
    low: 'Niedrig',
    medium: 'Mittel',
    high: 'Hoch',
    critical: 'Kritisch',
  };

  const icons = {
    low: '○',
    medium: '◐',
    high: '●',
    critical: '⬤',
  };

  return (
    <Badge priority={priority}>
      <span>{icons[priority]}</span>
      {labels[priority]}
    </Badge>
  );
};

// Streak badge
export const StreakBadge = ({ days }: { days: number }) => {
  let color = 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  
  if (days >= 100) {
    color = 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
  } else if (days >= 30) {
    color = 'bg-gradient-to-r from-orange-400 to-red-500 text-white';
  } else if (days >= 7) {
    color = 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${color}`}>
      🔥 {days} {days === 1 ? 'Tag' : 'Tage'}
    </span>
  );
};

// Level badge
export const LevelBadge = ({ level }: { level: number }) => {
  let color = 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  let icon = '⭐';

  if (level >= 50) {
    color = 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    icon = '👑';
  } else if (level >= 25) {
    color = 'bg-gradient-to-r from-blue-500 to-purple-500 text-white';
    icon = '💫';
  } else if (level >= 10) {
    color = 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
    icon = '🌟';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${color}`}>
      {icon} Level {level}
    </span>
  );
};

export default Badge;
