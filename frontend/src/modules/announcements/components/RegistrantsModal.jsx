import { useEffect, useState } from 'react';
import { X, Loader2, Users } from 'lucide-react';
import api from '../../../services/api';
import { registrationStatusStyles } from '../data';
import { errorMessage } from '../role';

// Staff-only: who registered for one event, and when.
export default function RegistrantsModal({ event, onClose }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/announcements/events/${event.id}/registrations`)
      .then((res) => setRows(res.data))
      .catch((err) => setError(errorMessage(err, 'Unable to load the registrants.')));
  }, [event.id]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[#80172B] text-xs font-bold uppercase tracking-wide">
              <Users className="w-4 h-4" />
              Registered Students
            </div>
            <h3 className="font-bold text-gray-900 text-lg truncate">{event.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg p-3">{error}</div>
          )}

          {!error && !rows && (
            <div className="flex items-center justify-center gap-2 text-gray-400 py-10">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading registrants...</span>
            </div>
          )}

          {rows && rows.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-10">No one has registered for this event yet.</p>
          )}

          {rows && rows.length > 0 && (
            <>
              <p className="text-xs text-gray-500 mb-3">
                {rows.length} registration{rows.length === 1 ? '' : 's'} · Seats are counted for Pending and Approved only.
              </p>
              <div className="overflow-x-auto border border-gray-100 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Student</th>
                      <th className="px-4 py-2 font-semibold">Registered On</th>
                      <th className="px-4 py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-semibold text-gray-800 break-all">{row.studentUsername}</td>
                        <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{row.registeredOn}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${registrationStatusStyles[row.status]}`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
