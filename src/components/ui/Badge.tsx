import { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'info';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-blue-100 text-blue-800 border-transparent',
    secondary: 'bg-slate-100 text-slate-700 border-transparent',
    outline: 'border border-slate-300 text-slate-700 bg-transparent',
    success: 'bg-emerald-100 text-emerald-800 border-transparent',
    warning: 'bg-amber-100 text-amber-800 border-transparent',
    info: 'bg-sky-100 text-sky-800 border-transparent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
