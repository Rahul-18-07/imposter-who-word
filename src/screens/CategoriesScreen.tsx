import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from 'firebase/auth';
import type { Category } from '../game/types';
import { useCategories } from '../hooks/useCategories';
import { useGuestCategories } from '../hooks/useGuestCategories';
import { CategoryEditor } from '../components/CategoryEditor';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import {
  createCustomCategory,
  updateCustomCategory,
  deleteCustomCategory,
} from '../lib/categoriesRepo';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';

interface Props {
  user: User;
}

export function CategoriesScreen({ user }: Props) {
  const navigate = useNavigate();
  const isGuest = user.isAnonymous;

  const { official, loading } = useCategories(user);
  const guest = useGuestCategories();

  const [tab, setTab] = useState<'official' | 'custom'>('official');
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // For logged-in users: Firebase custom categories (re-fetched via useCategories)
  const [firebaseCustom, setFirebaseCustom] = useState<Category[]>([]);

  // Use guest hook for anonymous, Firebase for logged-in
  const customList = isGuest ? guest.categories : firebaseCustom;

  const refreshCustom = async () => {
    if (isGuest) return; // guest hook auto-syncs
    const { custom } = await (async () => {
      const mod = await import('../lib/categoriesRepo');
      const cust = await mod.listMyCustomCategories(user.uid);
      return { custom: cust };
    })();
    setFirebaseCustom(custom);
  };

  // Initialise firebase custom on mount for logged-in users
  useState(() => {
    if (!isGuest) {
      import('../lib/categoriesRepo').then(({ listMyCustomCategories }) =>
        listMyCustomCategories(user.uid).then(setFirebaseCustom)
      );
    }
  });

  const handleCreate = async (data: { name: string; emoji: string; entries: { word: string; hint: string }[] }) => {
    if (isGuest) {
      guest.create(data);
    } else {
      await createCustomCategory(user.uid, data);
      await refreshCustom();
    }
    setCreating(false);
  };

  const handleUpdate = async (data: { name: string; emoji: string; entries: { word: string; hint: string }[] }) => {
    if (!editing) return;
    if (isGuest) {
      guest.update(editing.id, data);
    } else {
      await updateCustomCategory(user.uid, editing.id, data);
      await refreshCustom();
    }
    setEditing(null);
  };

  const handleDelete = async (categoryId: string) => {
    if (isGuest) {
      guest.remove(categoryId);
    } else {
      await deleteCustomCategory(user.uid, categoryId);
      await refreshCustom();
    }
    setDeleting(null);
  };

  const list = tab === 'official' ? official : customList;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#14141A' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 safe-top pt-4 pb-4"
        style={{ borderBottom: '1px solid rgba(245,213,71,0.10)' }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors btn-press"
          style={{ background: '#1A1A22', border: '1px solid rgba(245,213,71,0.12)', color: '#A09A88' }}
        >
          <ArrowLeft size={18} />
        </button>
        <h1
          className="text-xl flex-1"
          style={{ fontFamily: 'Anton, sans-serif', color: '#F5F2E8', letterSpacing: '0.05em' }}
        >
          CATEGORIES
        </h1>
        {tab === 'custom' && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl btn-press"
            style={{ background: '#F5D547', color: '#14141A', fontFamily: 'Anton, sans-serif', letterSpacing: '0.05em' }}
          >
            <Plus size={15} />
            NEW
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4 pb-2">
        <div
          className="flex rounded-2xl p-1 gap-1"
          style={{ background: '#1A1A22', border: '1px solid rgba(245,213,71,0.10)' }}
        >
          {(['official', 'custom'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all btn-press"
              style={
                tab === t
                  ? { background: '#F5D547', color: '#14141A', fontFamily: 'Anton, sans-serif', letterSpacing: '0.05em' }
                  : { color: '#5C5848', fontFamily: 'JetBrains Mono, monospace' }
              }
            >
              {t === 'official'
                ? `OFFICIAL (${official.length})`
                : `MINE (${customList.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Guest banner on custom tab */}
      {tab === 'custom' && isGuest && (
        <div
          className="mx-4 mt-2 rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ background: 'rgba(245,213,71,0.06)', border: '1px solid rgba(245,213,71,0.18)' }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ color: '#F5D547', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.05em' }}>
              GUEST MODE — Saved locally on this device
            </p>
            <p style={{ color: '#5C5848', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', marginTop: '2px' }}>
              Sign in with Google to sync across devices
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scroll-hidden px-4 pb-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(245,213,71,0.30)', borderTopColor: '#F5D547' }}
            />
          </div>
        )}

        {!loading && tab === 'custom' && customList.length === 0 && (
          <div className="text-center py-12">
            <Plus size={32} style={{ color: '#5C5848', margin: '0 auto 12px' }} />
            <p style={{ color: '#A09A88', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
              NO CUSTOM CATEGORIES YET
            </p>
            <p style={{ color: '#5C5848', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', marginTop: '4px' }}>
              TAP NEW TO CREATE ONE
            </p>
          </div>
        )}

        <div className="space-y-3 mt-3">
          {list.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl p-4 animate-fade-in"
              style={{ background: '#1E1E28', border: '1px solid rgba(245,213,71,0.10)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold"
                  style={{ background: 'rgba(245,213,71,0.08)', border: '1px solid rgba(245,213,71,0.15)', color: '#F5D547', fontFamily: 'Anton, sans-serif', fontSize: '14px', letterSpacing: '0.03em' }}
                >
                  {cat.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate" style={{ color: '#F5F2E8' }}>{cat.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#5C5848', fontFamily: 'JetBrains Mono, monospace' }}>
                    {cat.entries.length} WORDS
                  </div>
                </div>
                {tab === 'custom' && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditing(cat)}
                      className="w-9 h-9 rounded-xl transition-colors btn-press flex items-center justify-center"
                      style={{ background: '#1A1A22', border: '1px solid rgba(245,213,71,0.12)', color: '#A09A88' }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleting(cat.id)}
                      className="w-9 h-9 rounded-xl transition-colors btn-press flex items-center justify-center"
                      style={{ background: '#1A1A22', border: '1px solid rgba(245,213,71,0.12)', color: '#A09A88' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      <Modal open={creating} title="New Category">
        <CategoryEditor onSave={handleCreate} onCancel={() => setCreating(false)} />
      </Modal>

      <Modal open={!!editing} title="Edit Category">
        {editing && (
          <CategoryEditor initial={editing} onSave={handleUpdate} onCancel={() => setEditing(null)} />
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
