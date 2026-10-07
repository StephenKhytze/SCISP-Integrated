import { useState } from 'react';
import { Ticket, CalendarDays, MapPin, Clock } from 'lucide-react';
import { registrationStatusStyles } from '../data';
import EventRequestList from './EventRequestList';

export default function EventRegistrationMonitor({ registrations, events, onCancel, eventRequests = [] }) {
  const [cancellingId, setCancellingId] = useState(null);
  const findEvent = (eventId) => events.find((e) => e.id === eventId);

  const handleCancel = async (registrationId) => {
    setCancellingId(registrationId);
    try {
      await onCancel(registrationId);
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to cancel this registration. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      <EventRequestList requests={eventRequests} isStaff={false} />
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <Ticket className="w-5 h-5 text-[#80172B]" />
        <h3 className="font-bold text-gray-900 text-lg">
          My Registered Campus Event Tickets ({registrations.length})
        </h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Track status of your event RSVPs — Pending Approval, Approved, or Denied — view ticket pass
        codes, or cancel registration before event date.
      </p>
      <div className="border-t border-gray-100 mb-4" />

      <div className="space-y-3">
        {registrations.map((reg) => {
          const event = findEvent(reg.eventId);
          const isCancelled = reg.status === 'Cancelled';
          const isDenied = reg.status === 'Denied';
          const isApproved = reg.status === 'Approved';
          const isTerminal = isCancelled || isDenied;
          const canCancel = reg.status === 'Pending Approval' || isApproved;

          const cardStyle = isCancelled
            ? 'border-gray-200 bg-white'
            : isDenied
              ? 'border-rose-200 bg-rose-50/40'
              : isApproved
                ? 'border-emerald-200 bg-emerald-50/40'
                : 'border-amber-200 bg-amber-50/40';

          return (
            <div
              key={reg.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-lg p-4 ${cardStyle} ${
                isTerminal ? 'opacity-70' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-500">{reg.ticketCode}</span>
                  <span className="text-gray-300">·</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${registrationStatusStyles[reg.status]}`}
                  >
                    {reg.status}
                  </span>
                </div>
                <h4 className={`font-bold mb-1 ${isTerminal ? 'text-gray-500' : 'text-gray-900'}`}>
                  {event?.title}
                </h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Date: {event?.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Venue: {event?.venue}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Registered on: {reg.registeredOn}
                  </span>
                </div>
              </div>

              {canCancel && (
                <button
                  onClick={() => handleCancel(reg.id)}
                  disabled={cancellingId === reg.id}
                  className="shrink-0 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 font-semibold text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {cancellingId === reg.id ? 'Cancelling...' : 'Cancel RSVP'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {registrations.length === 0 && (
        <div className="text-center text-sm text-gray-400 py-8">
          You haven't registered for any campus events yet.
        </div>
      )}
    </div>
    </>
  );
}
