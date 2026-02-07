// ============================================
// Skeleton Loading Components
// ============================================

import { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

export const Skeleton = ({
  width,
  height,
  rounded = 'md',
  className = '',
  style,
  ...props
}: SkeletonProps) => {
  return (
    <div
      className={`skeleton ${roundedClasses[rounded]} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
};

// Pre-built skeleton components
export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height={16}
        width={i === lines - 1 ? '70%' : '100%'}
        rounded="md"
      />
    ))}
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-3 mb-4">
      <Skeleton width={48} height={48} rounded="full" />
      <div className="flex-1 space-y-2">
        <Skeleton height={20} width="60%" />
        <Skeleton height={14} width="40%" />
      </div>
    </div>
    <SkeletonText lines={2} />
    <div className="flex gap-2 mt-4">
      <Skeleton height={36} width={100} rounded="xl" />
      <Skeleton height={36} width={80} rounded="xl" />
    </div>
  </div>
);

export const SkeletonTaskCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
    <div className="flex items-start gap-3">
      <Skeleton width={40} height={40} rounded="xl" />
      <div className="flex-1">
        <Skeleton height={18} width="70%" className="mb-2" />
        <Skeleton height={14} width="50%" className="mb-3" />
        <div className="flex gap-2">
          <Skeleton height={24} width={60} rounded="full" />
          <Skeleton height={24} width={80} rounded="full" />
        </div>
      </div>
      <Skeleton width={24} height={24} rounded="md" />
    </div>
  </div>
);

export const SkeletonProgressRing = () => (
  <div className="flex flex-col items-center gap-2">
    <Skeleton width={80} height={80} rounded="full" />
    <Skeleton height={12} width={50} />
  </div>
);

export const SkeletonDashboard = () => (
  <div className="space-y-6 p-4">
    {/* Header */}
    <div className="flex justify-between items-center">
      <Skeleton height={32} width={200} rounded="lg" />
      <Skeleton height={40} width={100} rounded="xl" />
    </div>

    {/* Stats row */}
    <div className="grid grid-cols-3 gap-4">
      <Skeleton height={100} rounded="2xl" />
      <Skeleton height={100} rounded="2xl" />
      <Skeleton height={100} rounded="2xl" />
    </div>

    {/* Progress rings */}
    <div className="flex justify-around py-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonProgressRing key={i} />
      ))}
    </div>

    {/* Task list */}
    <div className="space-y-3">
      <Skeleton height={24} width={150} className="mb-4" />
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonTaskCard key={i} />
      ))}
    </div>
  </div>
);

export default Skeleton;
