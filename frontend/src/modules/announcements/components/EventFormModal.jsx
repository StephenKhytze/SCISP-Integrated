import { useState } from 'react';
import { X } from 'lucide-react';

const emptyForm = {
  type: '',
  title: '',
  description: '',
  event_date: '',
  event_time: '',
  venue: '',
  host: '',
  requirements: '',
  seats_total: 50,
};

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#80172B]/20';

// mode: 'create' (staff publish an event right away) | 'request' (student asks staff to approve one)
export default function EventFormModal({ mode, types, onSubmit, onClose, submitting }) {
  const [form, setForm] = useState({ ...emptyForm, type: types[0] || '' });
  const isRequest = mode === 'request';
  const today = new Date().toISOString().slice(0, 10);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      seats_total: Number(form.seats_total),
      // Empty requirements are sent as null so they are simply not stored.
      requirements: form.requirements.trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg">
            {isRequest ? 'Request a Campus Event' : 'Create Campus Event'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {isRequest ? (
            <p className="text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Your request will be reviewed by a teacher or admin. Once approved, the event is published
              in the Campus Events Desk and the Announcements Feed.
            </p>
          ) : (
            <p className="text-xs text-gray-500 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              Events appear in both the Campus Events Desk and the Announcements Feed.
            </p>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Event Title</label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange('title')}
              required
              placeholder="e.g. Techno Week 2026"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select value={form.type} onChange={handleChange('type')} required className={inputClass}>
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Total Seats</label>
              <input
                type="number"
                min="1"
                max="5000"
                value={form.seats_total}
                onChange={handleChange('seats_total')}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
              <input
                type="date"
                min={today}
                value={form.event_date}
                onChange={handleChange('event_date')}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
              <input
                type="text"
                value={form.event_time}
                onChange={handleChange('event_time')}
                required
                placeholder="e.g. 09:00 AM - 05:00 PM"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Venue</label>
              <input
                type="text"
                value={form.venue}
                onChange={handleChange('venue')}
                required
                placeholder="e.g. CCS Quadrangle"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Host / Organizer</label>
              <input
                type="text"
                value={form.host}
                onChange={handleChange('host')}
                required
                placeholder="e.g. CCS Student Council"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={handleChange('description')}
              required
              rows={3}
              placeholder="What is this event about?"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Requirements / Needs <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              value={form.requirements}
              onChange={handleChange('requirements')}
              rows={2}
              placeholder="e.g. 2 electric fans, 30 extra chairs, sound system"
              className={`${inputClass} resize-none`}
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Shown to students on the event and to the approving teacher or admin.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#80172B] hover:bg-[#651020] text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : isRequest ? 'Submit Request' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
