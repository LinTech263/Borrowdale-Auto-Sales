import React, { useState } from 'react';
import { useDealership } from '../../context/DealershipContext';
import { saveCategory, deleteCategory } from '../../services/dataService';
import { Category } from '../../types';
import { getCarSvgPlaceholder } from '../../data/seedData';
import { FolderTree, Plus, Edit, Trash2, CheckCircle2, X } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, refreshData, addToast } = useDealership();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [defaultMarkupPercent, setDefaultMarkupPercent] = useState(12);
  const [isActive, setIsActive] = useState(true);
  const [showOnHome, setShowOnHome] = useState(true);

  const openNewCategory = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setDefaultMarkupPercent(12);
    setIsActive(true);
    setShowOnHome(true);
    setShowModal(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setDefaultMarkupPercent(cat.defaultMarkupPercent);
    setIsActive(cat.isActive);
    setShowOnHome(cat.showOnHome);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = editingCategory ? editingCategory.id : `cat-${Date.now()}`;
    const autoSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const catPayload: Category = {
      id,
      name: name.trim(),
      slug: autoSlug,
      description: description.trim(),
      heroImage: editingCategory ? editingCategory.heroImage : getCarSvgPlaceholder('#C6A15B', name),
      defaultMarkupPercent: Number(defaultMarkupPercent),
      isActive,
      showOnHome,
      sortOrder: editingCategory ? editingCategory.sortOrder : categories.length + 1
    };

    saveCategory(catPayload);
    refreshData();
    addToast(editingCategory ? 'Category updated' : 'New category created', 'success');
    setShowModal(false);
  };

  const handleDelete = (id: string, catName: string) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      deleteCategory(id);
      refreshData();
      addToast('Category deleted', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23272C]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
            Fleet Taxonomy
          </span>
          <h1 className="font-heading text-3xl font-black uppercase text-[#F5F2EB]">
            Categories & Collections
          </h1>
        </div>

        <button
          onClick={openNewCategory}
          className="px-4 py-2 bg-[#C6A15B] text-[#0A0A0B] font-heading text-xs font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F] flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="card-luxury p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-[#9AA0A8] uppercase">
                  /inventory/{cat.slug}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  cat.isActive ? 'bg-[#0E7A33]/20 text-[#0E7A33]' : 'bg-[#9AA0A8]/20 text-[#9AA0A8]'
                }`}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 className="font-heading text-2xl font-bold uppercase text-[#F5F2EB] mb-1">
                {cat.name}
              </h3>

              <p className="text-xs text-[#9AA0A8] line-clamp-2 mb-4 leading-relaxed">
                {cat.description}
              </p>

              <div className="text-xs text-[#C6A15B] font-mono mb-4">
                Default Markup: <strong>{cat.defaultMarkupPercent}%</strong> • {cat.showOnHome ? 'On Home' : 'Catalog Only'}
              </div>
            </div>

            <div className="pt-3 border-t border-[#23272C] flex items-center justify-end gap-2">
              <button
                onClick={() => openEditCategory(cat)}
                className="p-1.5 text-[#9AA0A8] hover:text-[#C6A15B] rounded hover:bg-[#0A0A0B]"
                title="Edit Category"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-1.5 text-[#9AA0A8] hover:text-[#B3261E] rounded hover:bg-[#0A0A0B]"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Category Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="card-luxury p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#23272C]">
              <h3 className="font-heading text-xl font-bold uppercase text-[#F5F2EB]">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#9AA0A8]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#9AA0A8] font-semibold mb-1">Name*</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Executive Saloons"
                  className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-sm text-[#F5F2EB]"
                />
              </div>

              <div>
                <label className="block text-[#9AA0A8] font-semibold mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="e.g. executive-saloons"
                  className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs font-mono text-[#F5F2EB]"
                />
              </div>

              <div>
                <label className="block text-[#9AA0A8] font-semibold mb-1">SEO Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Intro copy displayed on category landing page..."
                  className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] p-2 text-xs text-[#F5F2EB]"
                />
              </div>

              <div>
                <label className="block text-[#9AA0A8] font-semibold mb-1">Default Markup Percentage (%)</label>
                <input
                  type="number"
                  value={defaultMarkupPercent}
                  onChange={e => setDefaultMarkupPercent(Number(e.target.value))}
                  className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-sm text-[#F5F2EB]"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="accent-[#C6A15B]"
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnHome}
                    onChange={e => setShowOnHome(e.target.checked)}
                    className="accent-[#C6A15B]"
                  />
                  <span>Show in Homepage Tiles</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#23272C]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#0A0A0B] border border-[#23272C] text-xs font-bold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C6A15B] text-[#0A0A0B] text-xs font-bold uppercase rounded"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
