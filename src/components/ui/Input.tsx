import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', style, ...rest }: Props) {
  return (
    <div className="w-full">
      {label && (
        <label
          className="block text-xs uppercase tracking-wider mb-1.5"
          style={{ fontFamily: 'JetBrains Mono, monospace', color: '#5C5848' }}
        >
          {label}
        </label>
      )}
      <input
        {...rest}
        style={{
          background: '#14141A',
          border: '1px solid rgba(245,213,71,0.15)',
          color: '#F5F2E8',
          fontFamily: 'Inter, sans-serif',
          ...style,
        }}
        className={`rounded-xl px-4 py-3 w-full text-sm focus:outline-none transition-colors placeholder:text-[#5C5848] ${className}`}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(245,213,71,0.50)'; rest.onFocus?.(e); }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(245,213,71,0.15)'; rest.onBlur?.(e); }}
      />
    </div>
  );
}
