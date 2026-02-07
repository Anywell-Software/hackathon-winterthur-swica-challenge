// ============================================
// Card Component
// ============================================

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const cardVariants = {
  default: 'bg-white dark:bg-gray-800 shadow-sm',
  elevated: 'bg-white dark:bg-gray-800 shadow-lg',
  outlined: 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700',
};

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hover = false,
      padding = 'md',
      className = '',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const baseClassName = `
      rounded-2xl
      ${cardVariants[variant]}
      ${paddings[padding]}
      ${hover ? 'cursor-pointer' : ''}
      ${className}
    `;

    if (hover) {
      return (
        <motion.div
          ref={ref}
          className={baseClassName}
          style={style}
          whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={baseClassName} style={style} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mt-4 flex items-center gap-2 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
