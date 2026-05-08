import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-purple-gradient text-white shadow-lg shadow-purple-mid/20',
  secondary: 'bg-surface border border-border text-white hover:border-purple-light/50',
  ghost: 'text-gray-400 hover:text-white bg-transparent',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

const sizes = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-3 px-5 text-sm',
  lg: 'py-4 px-6 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={`
        font-semibold rounded-xl transition-all duration-150 btn-press
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
