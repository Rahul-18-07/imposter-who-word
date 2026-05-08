import type { ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-t-3xl w-full max-w-lg p-6 pb-8 shadow-2xl animate-slide-up safe-bottom">
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
        {title && (
          <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
