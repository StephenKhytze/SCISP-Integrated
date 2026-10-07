import { X, CalendarDays, Building2, Pin } from 'lucide-react';
import { categoryStyles } from '../data';

// Opens when an announcement card is clicked, so the whole text is readable.
export default function AnnouncementDetailModal({ announcement, onClose, onViewEvent }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryStyles[announcement.category] || 'bg-gray-100 text-gray-600'}`}
            >
              {announcement.category}
            </span>
            {announcement.pinned && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                <Pin className="w-3 h-3" /> PINNED
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto">
          <h3 className="font-extrabold text-gray-900 text-xl leading-snug mb-3">{announcement.title}</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-5">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              {announcement.date}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {announcement.source}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{announcement.description}</p>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          {announcement.eventId && (
            <button
              onClick={() => {
                onClose();
                onViewEvent();
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-[#80172B] hover:bg-[#80172B]/10 transition-colors"
            >
              View in Campus Events Desk
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#80172B] hover:bg-[#651020] text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
