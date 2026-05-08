interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}

export function Toggle({ checked, onChange, label, description }: Props) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer py-2.5">
      <div>
        <div className="text-white font-medium text-sm">{label}</div>
        {description && (
          <div className="text-gray-500 text-xs mt-0.5">{description}</div>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? 'bg-purple-base' : 'bg-surface border border-border'}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-7' : 'translate-x-1'}`}
        />
      </button>
    </label>
  );
}
