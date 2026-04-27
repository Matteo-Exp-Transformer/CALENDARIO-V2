import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]'

  const variants = {
    primary:   'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-md hover:shadow-lg',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-400 border border-slate-200',
    danger:    'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400 shadow-md',
    success:   'bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-400 shadow-md',
    ghost:     'bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-300',
    outline:   'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-400 bg-transparent',
  }

  const sizes = {
    sm:   'px-3 py-1.5 text-sm gap-1.5',
    md:   'px-4 py-2.5 text-sm gap-2',
    lg:   'px-6 py-3 text-base gap-2',
    icon: 'p-2',
  }

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        disabled && 'opacity-60 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
