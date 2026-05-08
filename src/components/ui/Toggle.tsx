interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}

export function Toggle({ checked, onChange, label, description }: Props) {
  return (
    <div
      className="flex items-center justify-between gap-4 cursor-pointer py-3"
      onClick={() => onChange(!checked)}
    >
      <div className="flex-1">
        <div className="text-sm font-medium" style={{ color: '#F5F2E8', fontFamily: 'Inter, sans-serif' }}>
          {label}
        </div>
        {description && (
          <div className="text-xs mt-0.5" style={{ color: '#5C5848', fontFamily: 'JetBrains Mono, monospace' }}>
            {description}
          </div>
        )}
      </div>
      <div
        role="switch"
        aria-checked={checked}
        className="relative w-12 h-7 rounded-full transition-colors duration-200 flex-shrink-0"
        style={{ background: checked ? '#F5D547' : '#2a2a38' }}
      >
        <span
          className="absolute top-1.5 w-4 h-4 rounded-full shadow transition-transform duration-200"
          style={{
            background: checked ? '#14141A' : '#5C5848',
            transform: checked ? 'translateX(28px)' : 'translateX(4px)',
          }}
        />
      </div>
    </div>
  );
}
