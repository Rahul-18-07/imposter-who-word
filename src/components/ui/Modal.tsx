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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg p-6 pb-8 shadow-2xl animate-slide-up safe-bottom rounded-t-3xl"
        style={{ background: '#1E1E28', borderTop: '1px solid rgba(245,213,71,0.15)' }}
      >
        <div
          className="w-10 h-1 rounded-full mx-auto mb-5"
          style={{ background: 'rgba(245,213,71,0.25)' }}
        />
        {title && (
          <h2
            className="text-lg mb-4"
            style={{ fontFamily: 'Anton, sans-serif', color: '#F5F2E8', letterSpacing: '0.05em' }}
          >
            {title.toUpperCase()}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
