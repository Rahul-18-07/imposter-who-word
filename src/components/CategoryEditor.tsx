import { useState } from 'react';
import type { CategoryEntry } from '../game/types';
import { Plus, X, AlertCircle } from 'lucide-react';

interface Props {
  initial?: { name: string; emoji: string; entries: CategoryEntry[] };
  onSave: (data: { name: string; emoji: string; entries: CategoryEntry[] }) => Promise<void>;
  onCancel: () => void;
}

const S = {
  bg: '#14141A',
  surface: '#1A1A22',
  border: 'rgba(245,213,71,0.10)',
  lemon: '#F5D547',
  ink: '#F5F2E8',
  dim: '#A09A88',
  fade: '#5C5848',
  mono: 'JetBrains Mono, monospace' as const,
  anton: 'Anton, sans-serif' as const,
};

export function CategoryEditor({ initial, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [entries, setEntries] = useState<CategoryEntry[]>(initial?.entries ?? []);
  const [newWord, setNewWord] = useState('');
  const [newHint, setNewHint] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addEntry = () => {
    const word = newWord.trim();
    const hint = newHint.trim();
    if (!word || !hint) return;
    if (entries.some((e) => e.word.toLowerCase() === word.toLowerCase())) return;
    setEntries([...entries, { word, hint }]);
    setNewWord('');
    setNewHint('');
  };

  const removeEntry = (i: number) => setEntries(entries.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!name.trim()) { setError('Category name is required.'); return; }
    if (entries.length < 1) { setError('Add at least 1 word.'); return; }
    if (entries.length > 50) { setError('Maximum 50 words allowed.'); return; }
    setError('');
    setSaving(true);
    try {
      await onSave({ name: name.trim(), emoji: initial?.emoji ?? '★', entries });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label style={{ display: 'block', fontFamily: S.mono, fontSize: '10px', color: S.dim, letterSpacing: '0.08em', marginBottom: '6px' }}>
          CATEGORY NAME
        </label>
        <input
          placeholder="e.g., Office Inside Jokes"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
          style={{ background: S.bg, border: `1px solid ${S.border}`, color: S.ink, fontFamily: 'Inter, sans-serif' }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,213,71,0.50)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = S.border)}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label style={{ fontFamily: S.mono, fontSize: '10px', color: S.dim, letterSpacing: '0.08em' }}>
            WORDS ({entries.length}/50)
          </label>
          <span style={{ fontFamily: S.mono, fontSize: '10px', color: S.fade }}>WORD + HINT REQUIRED</span>
        </div>
        <div className="flex gap-2 mb-2">
          <input
            placeholder="Word"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEntry()}
            className="flex-1 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
            style={{ background: S.bg, border: `1px solid ${S.border}`, color: S.ink, fontFamily: 'Inter, sans-serif' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,213,71,0.50)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = S.border)}
          />
          <input
            placeholder="Hint"
            value={newHint}
            onChange={(e) => setNewHint(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEntry()}
            className="flex-1 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
            style={{ background: S.bg, border: `1px solid ${S.border}`, color: S.ink, fontFamily: 'Inter, sans-serif' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,213,71,0.50)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = S.border)}
          />
          <button
            onClick={addEntry}
            disabled={!newWord.trim() || !newHint.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center btn-press disabled:opacity-40 flex-shrink-0"
            style={{ background: S.lemon, color: '#14141A', boxShadow: '0 3px 0 #C9AB22' }}
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-1.5 max-h-44 overflow-y-auto scroll-hidden">
          {entries.map((e, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl px-3 py-2"
              style={{ background: S.surface, border: `1px solid ${S.border}` }}
            >
              <span style={{ color: S.ink, fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
                {e.word}
                <span style={{ color: S.fade }}> · {e.hint}</span>
              </span>
              <button
                onClick={() => removeEntry(i)}
                className="ml-2 btn-press"
                style={{ color: S.fade }}
                onMouseEnter={(ev) => (ev.currentTarget.style.color = '#ef4444')}
                onMouseLeave={(ev) => (ev.currentTarget.style.color = S.fade)}
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.30)' }}>
          <AlertCircle size={14} style={{ color: '#f87171', flexShrink: 0 }} />
          <p style={{ color: '#f87171', fontFamily: S.mono, fontSize: '11px' }}>{error}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl btn-press"
          style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.dim, fontFamily: S.mono, fontSize: '12px', letterSpacing: '0.05em' }}
        >
          CANCEL
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 py-3 rounded-xl btn-press disabled:opacity-50"
          style={{ background: S.lemon, color: '#14141A', boxShadow: '0 3px 0 #C9AB22', fontFamily: S.anton, letterSpacing: '0.05em', fontSize: '16px' }}
        >
          {saving ? 'SAVING...' : 'SAVE'}
        </button>
      </div>
    </div>
  );
}
