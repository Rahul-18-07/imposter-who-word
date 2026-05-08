import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from 'firebase/auth';
import type { Category } from '../game/types';
import { useCategories } from '../hooks/useCategories';
import { CategoryEditor } from '../components/CategoryEditor';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import {
  createCustomCategory,
  updateCustomCategory,
  deleteCustomCategory,
} from '../lib/categoriesRepo';

interface Props {
  user: User;
}

export function CategoriesScreen({ user }: Props) {
  const navigate = useNavigate();
  const { official, custom, loading, refresh } = useCategories(user);
  const [tab, setTab] = useState<'official' | 'custom'>('official');
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleCreate = async (data: { name: string; emoji: string; entries: { word: string; hint: string }[] }) => {
    await createCustomCategory(user.uid, data);
    await refresh();
    setCreating(false);
  };

  const handleUpdate = async (data: { name: string; emoji: string; entries: { word: string; hint: string }[] }) => {
    if (!editing) return;
    await updateCustomCategory(user.uid, editing.id, data);
    await refresh();
    setEditing(null);
  };

  const handleDelete = async (categoryId: string) => {
    await deleteCustomCategory(user.uid, categoryId);
    await refresh();
    setDeleting(null);
  };

  const list = tab === 'official' ? official : custom;

  return (
    <div className="min-h-dvh bg-bg flex flex-col">
      <div className="flex items-center gap-3 px-5 safe-top pt-4 pb-4 border-b border-border/50">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-gray-400 hover:text-white transition-colors btn-press"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-white flex-1">Categories</h1>
        {tab === 'custom' && user && !user.isAnonymous && (
          <button
            onClick={() => setCreating(true)}
            className="bg-purple-gradient text-white text-sm font-semibold px-4 py-2 rounded-xl btn-press"
          >
            + New
          </button>
        )}
      </div>

      <div className="px-4 pt-4 pb-2">
        <div className="flex bg-surface border border-border rounded-2xl p-1 gap-1">
          {(['official', 'custom'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all btn-press ${
                tab === t ? 'bg-purple-gradient text-white shadow' : 'text-gray-400'
              }`}
            >
              {t === 'official' ? `🏆 Official (${official.length})` : `⭐ Mine (${custom.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hidden px-4 pb-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-purple-light border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && tab === 'custom' && (!user || user.isAnonymous) && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🔒</div>
            <p className="font-medium">Sign in to create custom categories</p>
          </div>
        )}

        {!loading && tab === 'custom' && user && !user.isAnonymous && custom.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">✨</div>
            <p className="font-medium">No custom categories yet</p>
            <p className="text-sm mt-1">Tap + New to create one</p>
          </div>
        )}

        <div className="space-y-3 mt-3">
          {list.map((cat) => (
            <div key={cat.id} className="bg-card border border-border rounded-2xl p-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-mid/20 flex items-center justify-center text-2xl flex-shrink-0">
                  {cat.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold truncate">{cat.name}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{cat.entries.length} words</div>
                </div>
                {tab === 'custom' && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditing(cat)}
                      className="w-9 h-9 rounded-xl bg-surface border border-border text-gray-400 hover:text-white text-sm transition-colors btn-press flex items-center justify-center"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setDeleting(cat.id)}
                      className="w-9 h-9 rounded-xl bg-surface border border-border text-gray-400 hover:text-red-400 text-sm transition-colors btn-press flex items-center justify-center"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {cat.entries.slice(0, 6).map((e, i) => (
                  <span
                    key={i}
                    className="bg-surface border border-border/50 text-gray-300 text-xs px-2.5 py-1 rounded-lg"
                  >
                    {e.word}
                  </span>
                ))}
                {cat.entries.length > 6 && (
                  <span className="text-gray-500 text-xs px-2 py-1">
                    +{cat.entries.length - 6} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={creating} title="New Category">
        <CategoryEditor
          onSave={handleCreate}
          onCancel={() => setCreating(false)}
        />
      </Modal>

      <Modal open={!!editing} title="Edit Category">
        {editing && (
          <CategoryEditor
            initial={editing}
            onSave={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <Modal open={!!deleting} title="Delete Category">
        <p className="text-gray-400 mb-6">Are you sure? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="danger" fullWidth onClick={() => deleting && handleDelete(deleting)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
