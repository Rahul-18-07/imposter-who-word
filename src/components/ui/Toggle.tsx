interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}

export function Toggle({ checked, onChange, label, description }: Props) {
  return (
    <div
      className="flex items-center justify-between gap-4 cursor-pointer py-2.5"
      onClick={() => onChange(!checked)}
    >
      <div className="flex-1">
        <div className="text-white font-medium text-sm">{label}</div>
        {description && (
          <div className="text-gray-500 text-xs mt-0.5">{description}</div>
        )}
      </div>
      <div
        role="switch"
        aria-checked={checked}
        className={`relative w-12 h-7 rounded-full transition-colors duration-200 flex-shrink-0 ${
          checked ? 'bg-purple-base' : 'bg-gray-700'
        }`}
      >
        <span
          className={`absolute top-1.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </div>
    </div>
  );
}
