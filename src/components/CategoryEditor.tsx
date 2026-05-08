import { useState } from 'react';
import type { CategoryEntry } from '../game/types';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface Props {
  initial?: { name: string; emoji: string; entries: CategoryEntry[] };
  onSave: (data: { name: string; emoji: string; entries: CategoryEntry[] }) => Promise<void>;
  onCancel: () => void;
}

const EMOJI_OPTIONS = ['🎯', '🎲', '🎪', '🏆', '🌟', '🔥', '💡', '🎭', '🌈', '⚡'];

export function CategoryEditor({ initial, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [emoji, setEmoji] = useState(initial?.emoji ?? '🎯');
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
      await onSave({ name: name.trim(), emoji, entries });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Input
          label="Category name"
          placeholder="e.g., Office Inside Jokes"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
        />

        <div>
          <label className="block text-sm text-gray-400 mb-2">Emoji</label>
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`text-2xl w-10 h-10 rounded-lg transition-colors ${
                  emoji === e ? 'bg-purple-600' : 'bg-[#0f3460] hover:bg-[#1a4a7a]'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-400">
          Words ({entries.length}/50) — both word and hint required
        </label>

        <div className="flex gap-2">
          <Input
            placeholder="Word *"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEntry()}
            className="flex-1"
          />
          <Input
            placeholder="Hint *"
            value={newHint}
            onChange={(e) => setNewHint(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEntry()}
            className="flex-1"
          />
          <Button onClick={addEntry} disabled={!newWord.trim() || !newHint.trim()} className="px-4">
            Add
          </Button>
        </div>

        <div className="space-y-1 max-h-48 overflow-y-auto">
          {entries.map((e, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-[#0f3460] rounded-lg px-3 py-2"
            >
              <span className="text-white text-sm">
                {e.word}
                {e.hint && <span className="text-gray-400"> → {e.hint}</span>}
              </span>
              <button
                onClick={() => removeEntry(i)}
                className="text-gray-500 hover:text-red-400 transition-colors ml-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onCancel} fullWidth>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving} fullWidth>
          {saving ? 'Saving…' : 'Save Category'}
        </Button>
      </div>
    </div>
  );
}
