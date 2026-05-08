import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const variants: Record<string, React.CSSProperties> = {
  primary: { background: '#F5D547', color: '#14141A', boxShadow: '0 3px 0 #C9AB22' },
  secondary: { background: '#1A1A22', color: '#F5F2E8', border: '1px solid rgba(245,213,71,0.15)' },
  ghost: { background: 'transparent', color: '#A09A88' },
  danger: { background: '#dc2626', color: '#fff' },
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
  style,
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      style={{ ...variants[variant], fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em', ...style }}
      className={`
        font-semibold rounded-xl transition-all duration-150 btn-press
        disabled:opacity-40 disabled:cursor-not-allowed
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
