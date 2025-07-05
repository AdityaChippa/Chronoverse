// Button Component
import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-cosmic-cream text-cosmic-black hover:bg-cosmic-skin-light',
      secondary: 'bg-cosmic-grey-800 text-cosmic-grey-100 hover:bg-cosmic-grey-700',
      ghost: 'hover:bg-cosmic-grey-900 hover:text-cosmic-cream',
      gradient: 'bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cosmic-cream focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

// Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-cosmic-grey-900/50 backdrop-blur-sm',
      glass: 'bg-white/5 backdrop-blur-md border border-white/10',
      gradient: 'bg-gradient-to-br from-cosmic-purple/20 to-cosmic-pink/20 backdrop-blur-md border border-white/10',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl p-6 shadow-lg',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

// LoadingSpinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'orbit';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'default' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (variant === 'orbit') {
    return (
      <div className={cn('relative', sizes[size])}>
        <div className="absolute inset-0 rounded-full border-2 border-cosmic-grey-700"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cosmic-purple animate-spin"></div>
        <div className={cn('absolute inset-2 rounded-full bg-cosmic-purple/20 animate-pulse', 
          size === 'lg' && 'inset-4'
        )}></div>
      </div>
    );
  }

  return (
    <div className={cn(
      'border-2 border-cosmic-grey-700 border-t-cosmic-purple rounded-full animate-spin',
      sizes[size]
    )}>
    </div>
  );
};