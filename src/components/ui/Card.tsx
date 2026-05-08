import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
}

export function Card({ padding = true, className = '', children, ...rest }: Props) {
  return (
    <div
      {...rest}
      className={`bg-card border border-border rounded-2xl shadow-lg ${padding ? 'p-4' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
