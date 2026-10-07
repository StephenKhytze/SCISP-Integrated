import { useState } from 'react';
import { ClipboardCheck, CalendarDays, MapPin, Clock, Check, X } from 'lucide-react';
import { registrationStatusStyles } from '../data';
import EventRequestList from './EventRequestList';

export default function EventApprovalDesk({
  registrations,
  events,
  onApprove,
  onDeny,
  eventRequests = [],
  onApproveRequest,
  onDenyRequest,
}) {
  const [pendingId, setPendingId] = useState(null);
  const findEvent = (eventId) => events.find((e) => e.id === eventId);

  const handleApprove = async (registrationId) => {
    setPendingId(registrationId);
    try {
      await onApprove(registrationId);
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to approve this registration. Please try again.');
    } finally {
      setPendingId(null);
    }
  };

  const handleDeny = async (registrationId) => {
    setPendingId(registrationId);
    try {
      await onDeny(registrationId);
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to deny this registration. Please try again.');
    } finally {
      setPendingId(null);
    }
  };

  return (
    <>
      <EventRequestList
        requests={eventRequests}
        isStaff
        onApprove={onApproveRequest}
        onDeny={onDenyRequest}
      />
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <ClipboardCheck className="w-5 h-5 text-[#80172B]" />
        <h3 className="font-bold text-gray-900 text-lg">
          Event Registration Approvals ({registrations.length})
        </h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Review student RSVPs and approve or deny pending campus event registrations.
      </p>
      <div className="border-t border-gray-100 mb-4" />

      <div className="space-y-3">
        {registrations.map((reg) => {
          const event = findEvent(reg.eventId);
          const isPending = reg.status === 'Pending Approval';
          const isApproved = reg.status === 'Approved';
          const isDenied = reg.status === 'Denied';

          const cardStyle = isApproved
            ? 'border-emerald-200 bg-emerald-50/40'
            : isDenied
              ? 'border-rose-200 bg-rose-50/40'
              : isPending
                ? 'border-amber-200 bg-amber-50/40'
                : 'border-gray-200 bg-white';

          return (
            <div
              key={reg.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-lg p-4 ${cardStyle} ${
                reg.status === 'Cancelled' ? 'opacity-70' : ''
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
                  <span className="text-gray-300">·</span>
                  <span className="text-xs font-semibold text-gray-600">{reg.studentUsername}</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{event?.title}</h4>
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

              {isPending && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(reg.id)}
                    disabled={pendingId === reg.id}
                    className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleDeny(reg.id)}
                    disabled={pendingId === reg.id}
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

      {registrations.length === 0 && (
        <div className="text-center text-sm text-gray-400 py-8">
          No campus event registrations have been submitted yet.
        </div>
      )}
    </div>
    </>
  );
}
