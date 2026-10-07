import { useState } from 'react';
import { Filter, ChevronRight, Plus, Pencil, Archive, Ticket } from 'lucide-react';
import { categoryStyles } from '../data';
import AnnouncementFormModal from './AnnouncementFormModal';
import AnnouncementDetailModal from './AnnouncementDetailModal';

export default function AnnouncementsFeed({
  announcements,
  categories,
  onPost,
  onEdit,
  onArchive,
  canManage,
  onViewEvent,
  onAddCategory,
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [modalMode, setModalMode] = useState(null); // null | 'create' | 'edit'
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [viewingAnnouncement, setViewingAnnouncement] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [archivingId, setArchivingId] = useState(null);

  const filtered =
    activeCategory === 'All'
      ? announcements
      : announcements.filter((a) => a.category === activeCategory);

  const openCreateModal = () => {
    setEditingAnnouncement(null);
    setModalMode('create');
  };

  const openEditModal = (announcement) => {
    setEditingAnnouncement(announcement);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingAnnouncement(null);
  };

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      if (modalMode === 'edit') {
        await onEdit(editingAnnouncement.id, form);
      } else {
        await onPost(form);
      }
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong while saving. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (announcement) => {
    if (!window.confirm(`Archive "${announcement.title}"? It will be hidden from the feed.`)) return;
    setArchivingId(announcement.id);
    try {
      await onArchive(announcement.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong while archiving. Please try again.');
    } finally {
      setArchivingId(null);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    setAddingCategory(true);
    try {
      await onAddCategory(name);
      setNewCategoryName('');
      setShowAddCategory(false);
      setActiveCategory(name);
    } catch (err) {
      alert(err.response?.data?.errors?.name?.[0] || err.response?.data?.message || 'Unable to add this category. Please try again.');
    } finally {
      setAddingCategory(false);
    }
  };

  // Buttons inside a card must not also open the detail popup.
  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 mr-2">
            <Filter className="w-4 h-4" />
            Category:
          </span>
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-[#80172B] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}

          {canManage &&
            (showAddCategory ? (
              <form onSubmit={handleAddCategory} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  maxLength={60}
                  autoFocus
                  placeholder="New category name"
                  className="border border-gray-200 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#80172B]/20 w-48"
                />
                <button
                  type="submit"
                  disabled={addingCategory || !newCategoryName.trim()}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold bg-[#80172B] text-white hover:bg-[#651020] disabled:opacity-50"
                >
                  {addingCategory ? 'Adding...' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName('');
                  }}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowAddCategory(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border border-dashed border-[#80172B] text-[#80172B] hover:bg-[#80172B]/5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Category
              </button>
            ))}
        </div>

        {canManage && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:w-auto">
            <button
              onClick={openCreateModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#80172B] hover:bg-[#651020] text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Post Announcement
            </button>
          </div>
        )}
        </div>
      </div>

      {filtered.map((a) => (
        <div
          key={a.id}
          onClick={() => setViewingAnnouncement(a)}
          className={`relative bg-white rounded-xl p-5 mb-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
            a.pinned ? 'border-2 border-amber-400' : 'border border-gray-200'
          }`}
        >
          {a.pinned && (
            <span className="absolute -top-3 right-4 bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm tracking-wide">
              PINNED NOTICE
            </span>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1.5">
            <span
              className={`self-start px-2.5 py-1 rounded-full text-xs font-semibold ${categoryStyles[a.category] || 'bg-gray-100 text-gray-600'}`}
            >
              {a.category}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">
                {a.date} <span className="mx-1">•</span> {a.source}
              </span>
              {canManage && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={stop(() => openEditModal(a))}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#80172B] hover:bg-gray-100 transition-colors"
                    aria-label="Edit announcement"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={stop(() => handleArchive(a))}
                    disabled={archivingId === a.id}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-amber-700 hover:bg-amber-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Archive announcement"
                    title="Archive"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <h3 className="font-bold text-gray-900 mb-1">{a.title}</h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{a.description}</p>
          <div className="border-t border-gray-100 pt-3 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-[#80172B] inline-flex items-center gap-1">
              Read Full Announcement <ChevronRight className="w-3.5 h-3.5" />
            </span>
            {a.eventId && (
              // Posted as an event: it lives in the Campus Events Desk too.
              <button
                onClick={stop(onViewEvent)}
                className="text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-full inline-flex items-center gap-1"
              >
                <Ticket className="w-3 h-3" />
                View event
              </button>
            )}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-sm text-gray-400">
          No announcements found for this category.
        </div>
      )}

      {modalMode && (
        <AnnouncementFormModal
          mode={modalMode}
          categories={categories}
          initialValues={
            modalMode === 'edit'
              ? {
                  title: editingAnnouncement.title,
                  category: editingAnnouncement.category,
                  source: editingAnnouncement.source,
                  description: editingAnnouncement.description,
                  pinned: editingAnnouncement.pinned,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onClose={closeModal}
          submitting={submitting}
        />
      )}

      {viewingAnnouncement && (
        <AnnouncementDetailModal
          announcement={viewingAnnouncement}
          onClose={() => setViewingAnnouncement(null)}
          onViewEvent={onViewEvent}
        />
      )}
    </>
  );
}
