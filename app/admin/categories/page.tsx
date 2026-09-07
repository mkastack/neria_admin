'use client';

import { useState } from 'react';
import { Plus, Save, Trash2, Tag, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { ConfirmModal } from '@/src/components/ui/ConfirmModal';
import { deleteCategory, renameCategory, type CategoryDoc } from '@/src/lib/firebase/categories';

const emptyCategory = (position: number): CategoryDoc => ({
  id: '',
  name: '',
  slug: '',
  image: '',
  itemCount: 0,
  badge: '',
  position,
  visible: true,
});

export default function CategoriesPage() {
  const { categories, addToast } = useAdmin();
  const [draft, setDraft] = useState<CategoryDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<CategoryDoc | null>(null);

  const startNew = () => setDraft(emptyCategory(categories.length + 1));
  const startEdit = (category: CategoryDoc) => setDraft({ ...category });

  const save = async () => {
    if (!draft) return;
    const name = draft.name.trim();
    const slug = draft.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!name || !slug) {
      addToast({ type: 'error', title: 'Category details required', description: 'Add a name and a URL-safe slug.' });
      return;
    }

    setSaving(true);
    try {
      const nextCategory = { ...draft, id: slug, name, slug };
      await renameCategory(draft.slug, nextCategory);
      addToast({ type: 'success', title: 'Category saved', description: `${name} is now available in product forms and the storefront.` });
      setDraft(null);
    } catch (error) {
      addToast({ type: 'error', title: 'Could not save category', description: error instanceof Error ? error.message : 'Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!pendingDelete) return;
    const category = pendingDelete;
    try {
      await deleteCategory(category.slug);
      addToast({ type: 'success', title: 'Category deleted', description: `${category.name} was removed.` });
    } catch (error) {
      addToast({ type: 'error', title: 'Could not delete category', description: error instanceof Error ? error.message : 'Please try again.' });
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Product Categories</h1>
          <p className="mt-1 text-xs text-[#667085]">Manage the categories used by product forms and the live storefront.</p>
        </div>
        <button type="button" onClick={startNew} className="neria-btn-primary inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {categories.map((category) => (
          <div key={category.slug} className="rounded-2xl border border-[#F2F3F5] bg-white p-5 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF4F8] text-[#FF4FA3]"><Tag className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-[#263550]">{category.name}</h2>
                  <p className="truncate text-[11px] text-[#98A0AE]">/{category.slug} · {category.itemCount} products</p>
                </div>
              </div>
              <span className={`inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold ${category.visible ? 'text-emerald-600' : 'text-[#98A0AE]'}`}>
                {category.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {category.visible ? 'Visible' : 'Hidden'}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2 border-t border-[#F2F3F5] pt-4">
              <button type="button" onClick={() => setPendingDelete(category)} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
              <button type="button" onClick={() => startEdit(category)} className="neria-btn-secondary px-3 py-2 text-xs font-semibold">Edit</button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && <div className="rounded-2xl border border-dashed border-[#DDE1E7] bg-white p-10 text-center text-sm text-[#667085]">No categories yet. Add the first one to populate product forms.</div>}

      {draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#263550]/30 p-4" role="dialog" aria-modal="true" aria-label="Edit product category">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold text-[#263550]">{draft.id ? 'Edit Category' : 'Add Category'}</h2><button type="button" onClick={() => setDraft(null)} className="text-sm text-[#98A0AE]">Close</button></div>
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-[#263550]">Display name<input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="mt-1.5 w-full rounded-xl border border-[#DDE1E7] px-3.5 py-2.5 text-sm outline-none focus:border-[#FF4FA3]" placeholder="e.g. Knitwear" /></label>
              <label className="block text-xs font-semibold text-[#263550]">Slug<input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className="mt-1.5 w-full rounded-xl border border-[#DDE1E7] px-3.5 py-2.5 text-sm outline-none focus:border-[#FF4FA3]" placeholder="e.g. knitwear" /></label>
              <label className="block text-xs font-semibold text-[#263550]">Description<textarea value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="mt-1.5 min-h-24 w-full rounded-xl border border-[#DDE1E7] px-3.5 py-2.5 text-sm outline-none focus:border-[#FF4FA3]" /></label>
              <div className="grid grid-cols-2 gap-3"><label className="block text-xs font-semibold text-[#263550]">Position<input type="number" min="0" value={draft.position} onChange={(e) => setDraft({ ...draft, position: Number(e.target.value) || 0 })} className="mt-1.5 w-full rounded-xl border border-[#DDE1E7] px-3.5 py-2.5 text-sm outline-none focus:border-[#FF4FA3]" /></label><label className="flex items-center gap-2 self-end pb-3 text-xs font-semibold text-[#263550]"><input type="checkbox" checked={draft.visible} onChange={(e) => setDraft({ ...draft, visible: e.target.checked })} className="accent-[#FF4FA3]" /> Visible on storefront</label></div>
              <label className="block text-xs font-semibold text-[#263550]">Image URL<input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} className="mt-1.5 w-full rounded-xl border border-[#DDE1E7] px-3.5 py-2.5 text-sm outline-none focus:border-[#FF4FA3]" placeholder="https://..." /></label>
            </div>
            <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setDraft(null)} className="neria-btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button><button type="button" disabled={saving} onClick={save} className="neria-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold"><Save className="h-3.5 w-3.5" /> {saving ? 'Saving...' : 'Save Category'}</button></div>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={pendingDelete !== null}
        title="Delete category?"
        message={pendingDelete ? `Products assigned to ${pendingDelete.name} will keep their slug but disappear from category navigation.` : ''}
        confirmLabel="Delete Category"
        onCancel={() => setPendingDelete(null)}
        onConfirm={remove}
      />
    </div>
  );
}
