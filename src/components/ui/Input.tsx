import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...rest }: Props) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      )}
      <input
        {...rest}
        className={`
          bg-surface border border-border text-white placeholder-gray-600
          rounded-xl px-4 py-3 w-full text-sm
          focus:outline-none focus:border-purple-light
          transition-colors ${className}
        `}
      />
    </div>
  );
}
