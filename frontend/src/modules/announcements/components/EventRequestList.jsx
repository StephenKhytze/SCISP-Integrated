import { useState } from 'react';
import { Lightbulb, CalendarDays, MapPin, Clock, Users, Check, X } from 'lucide-react';
import { registrationStatusStyles } from '../data';
import { errorMessage } from '../role';

// Student-proposed events (like "Techno Week").
// Students see their own with a status; staff also get Approve / Deny on pending ones.
export default function EventRequestList({ requests, isStaff, onApprove, onDeny }) {
  const [pendingId, setPendingId] = useState(null);

  const review = async (action, id) => {
    setPendingId(id);
    try {
      await action(id);
    } catch (err) {
      alert(errorMessage(err, 'Unable to update this request. Please try again.'));
    } finally {
      setPendingId(null);
    }
  };

  if (requests.length === 0 && isStaff) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Lightbulb className="w-5 h-5 text-[#80172B]" />
        <h3 className="font-bold text-gray-900 text-lg">
          {isStaff ? 'Event Requests from Students' : 'My Event Requests'} ({requests.length})
        </h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        {isStaff
          ? 'Approving a request publishes the event in the Campus Events Desk and the Announcements Feed.'
          : 'Events you proposed. A teacher or admin must approve them before they are published.'}
      </p>
      <div className="border-t border-gray-100 mb-4" />

      <div className="space-y-3">
        {requests.map((req) => {
          const isPending = req.status === 'Pending Approval';
          const cardStyle =
            req.status === 'Approved'
              ? 'border-emerald-200 bg-emerald-50/40'
              : req.status === 'Denied'
                ? 'border-rose-200 bg-rose-50/40'
                : 'border-amber-200 bg-amber-50/40';

          return (
            <div
              key={req.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-lg p-4 ${cardStyle}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase">{req.type}</span>
                  <span className="text-gray-300">·</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${registrationStatusStyles[req.status]}`}
                  >
                    {req.status}
                  </span>
                  {isStaff && (
                    <>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs font-semibold text-gray-600">{req.studentUsername}</span>
                    </>
                  )}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{req.title}</h4>
                <p className="text-sm text-gray-500 mb-2">{req.description}</p>
                {req.requirements && (
                  <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-2">
                    <span className="font-bold">Requirements:</span> {req.requirements}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {req.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {req.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {req.venue}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {req.seatsTotal} seats · Host: {req.host}
                  </span>
                </div>
              </div>

              {isStaff && isPending && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => review(onApprove, req.id)}
                    disabled={pendingId === req.id}
                    className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => review(onDeny, req.id)}
                    disabled={pendingId === req.id}
                    className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 font-semibold text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <X className="w-3.5 h-3.5" />
                    Deny
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {requests.length === 0 && (
        <div className="text-center text-sm text-gray-400 py-6">
          You haven't requested any events yet. Use "Request an Event" in the Campus Events Desk.
        </div>
      )}
    </div>
  );
}
