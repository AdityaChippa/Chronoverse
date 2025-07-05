import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg',
        {
          'bg-cosmic-grey-900 cosmic-border': variant === 'default',
          'cosmic-glass cosmic-border': variant === 'glass',
          'bg-gradient-to-br from-cosmic-purple/20 to-cosmic-pink/20 cosmic-border': variant === 'gradient',
        },
        className
      )}
      {...props}
    />
  );
}

// src/components/ui/button.tsx
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-cosmic',
          {
            // Variants
            'bg-cosmic-cream text-cosmic-black hover:bg-cosmic-skin-light': variant === 'default',
            'cosmic-border bg-transparent text-cosmic-cream hover:bg-cosmic-grey-900': variant === 'outline',
            'bg-transparent text-cosmic-grey-400 hover:text-cosmic-cream hover:bg-cosmic-grey-900': variant === 'ghost',
            'bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white hover:opacity-90': variant === 'gradient',
            // Sizes
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';