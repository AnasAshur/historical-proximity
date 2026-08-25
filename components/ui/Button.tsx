import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base — pill-shaped (rounded-full), generous padding
          'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-full',
          // variants
          variant === 'primary' &&
            'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-80 active:scale-95',
          variant === 'ghost' &&
            'bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] active:scale-95',
          variant === 'outline' &&
            'bg-transparent border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] active:scale-95',
          // sizes — pill needs more horizontal padding than before
          size === 'sm' && 'text-xs px-5 py-2',
          size === 'md' && 'text-sm px-8 py-3',
          size === 'lg' && 'text-base px-14 py-4',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
