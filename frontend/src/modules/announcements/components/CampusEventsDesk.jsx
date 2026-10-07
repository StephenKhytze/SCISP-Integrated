import { useState } from 'react';
import { Filter, Search, CalendarDays, MapPin, User, CheckCircle2, Plus, Archive, ClipboardList } from 'lucide-react';
import { eventTypeStyles } from '../data';
import { errorMessage } from '../role';
import EventFormModal from './EventFormModal';
import RegistrantsModal from './RegistrantsModal';

export default function CampusEventsDesk({
  events,
  registrations,
  types,
  onRegister,
  onCancel,
  canRegister,
  isStaff,
  onCreateEvent,
  onRequestEvent,
  onArchiveEvent,
  onAddEventType,
}) {
  const [activeType, setActiveType] = useState('All');
  const [query, setQuery] = useState('');
  const [pendingEventId, setPendingEventId] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [submittingEvent, setSubmittingEvent] = useState(false);
  const [showAddType, setShowAddType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [addingType, setAddingType] = useState(false);
  const [registrantsFor, setRegistrantsFor] = useState(null);

  const handleRegister = async (eventId) => {
    setPendingEventId(eventId);
    try {
      await onRegister(eventId);
    } catch (err) {
      alert(errorMessage(err, 'Unable to register for this event. Please try again.'));
    } finally {
      setPendingEventId(null);
    }
  };

  const handleCancel = async (registrationId, eventId) => {
    setPendingEventId(eventId);
    try {
      await onCancel(registrationId);
    } catch (err) {
      alert(errorMessage(err, 'Unable to cancel this registration. Please try again.'));
    } finally {
      setPendingEventId(null);
    }
  };

  const handleSubmitEvent = async (form) => {
    setSubmittingEvent(true);
    try {
      if (isStaff) {
        await onCreateEvent(form);
      } else {
        await onRequestEvent(form);
        alert('Your event request was sent. You can track its status in the Event Registration Monitor tab.');
      }
      setShowEventForm(false);
    } catch (err) {
      alert(errorMessage(err, 'Unable to save this event. Please check the details and try again.'));
    } finally {
      setSubmittingEvent(false);
    }
  };

  const handleAddType = async (e) => {
    e.preventDefault();
    const name = newTypeName.trim();
    if (!name) return;
    setAddingType(true);
    try {
      await onAddEventType(name);
      setNewTypeName('');
      setShowAddType(false);
      setActiveType(name);
    } catch (err) {
      alert(errorMessage(err, 'Unable to add this category. Please try again.'));
    } finally {
      setAddingType(false);
    }
  };

  const handleArchiveEvent = async (event) => {
    if (
      !window.confirm(
        `Archive "${event.title}"? It will be hidden from the desk and its announcement from the feed.`
      )
    ) {
      return;
    }
    setPendingEventId(event.id);
    try {
      await onArchiveEvent(event.id);
    } catch (err) {
      alert(errorMessage(err, 'Unable to archive this event. Please try again.'));
    } finally {
      setPendingEventId(null);
    }
  };

  const filtered = events.filter((ev) => {
    const matchesType = activeType === 'All' || ev.type === activeType;
    const matchesQuery = ev.title.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });

  const findRegistration = (eventId) =>
    registrations.find((r) => r.eventId === eventId && ['Pending Approval', 'Approved'].includes(r.status));

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 mr-2">
              <Filter className="w-4 h-4" />
              Category:
            </span>
            {['All', ...types].map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  activeType === type
                    ? 'bg-[#80172B] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}

            {isStaff &&
              (showAddType ? (
                <form onSubmit={handleAddType} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    maxLength={60}
                    autoFocus
                    placeholder="New category name"
                    className="border border-gray-200 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#80172B]/20 w-48"
                  />
                  <button
                    type="submit"
                    disabled={addingType || !newTypeName.trim()}
                    className="px-3 py-1.5 rounded-full text-sm font-semibold bg-[#80172B] text-white hover:bg-[#651020] disabled:opacity-50"
                  >
                    {addingType ? 'Adding...' : 'Add'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddType(false);
                      setNewTypeName('');
                    }}
                    className="px-3 py-1.5 rounded-full text-sm font-semibold text-gray-500 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowAddType(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border border-dashed border-[#80172B] text-[#80172B] hover:bg-[#80172B]/5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Category
                </button>
              ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:w-auto">
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#80172B]/20"
              />
            </div>
            <button
              onClick={() => setShowEventForm(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#80172B] hover:bg-[#651020] text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              {isStaff ? 'Create Event' : 'Request an Event'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((ev) => {
          const registration = findRegistration(ev.id);
          const seatsOpen = ev.seatsTaken;

          return (
            <div
              key={ev.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${eventTypeStyles[ev.type] || 'bg-gray-100 text-gray-600'}`}
                >
                  {ev.type}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                  {seatsOpen} / {ev.seatsTotal} Seats Open
                </span>
              </div>

              <h3 className="font-bold text-gray-900 leading-snug mb-2">{ev.title}</h3>
              <p className="text-sm text-gray-500 mb-3 flex-1">{ev.description}</p>

              {ev.requirements && (
                <div className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3">
                  <span className="font-bold">Requirements:</span> {ev.requirements}
                </div>
              )}

              <div className="border-t border-gray-100 pt-3 space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-semibold">{ev.date}</span>
                  <span className="text-gray-400">·</span>
                  <span>{ev.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{ev.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>Host: {ev.host}</span>
                </div>
              </div>

              {!canRegister ? (
                <div className="flex items-center gap-2">
                  <span className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 text-sm font-semibold bg-gray-50 text-gray-400 border border-gray-100 text-center">
                    Staff View
                  </span>
                  {isStaff && (
                    <>
                      <button
                        onClick={() => setRegistrantsFor(ev)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-[#80172B] bg-[#80172B]/5 hover:bg-[#80172B]/10 border border-[#80172B]/20 transition-colors"
                        title="See who registered"
                      >
                        <ClipboardList className="w-4 h-4" />
                        Registrants
                      </button>
                      <button
                        onClick={() => handleArchiveEvent(ev)}
                        disabled={pendingEventId === ev.id}
                        className="p-2 rounded-lg text-gray-400 hover:text-amber-700 hover:bg-amber-50 border border-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Archive event"
                        title="Archive event"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ) : registration ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <span
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold border ${
                      registration.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Status: {registration.status}
                  </span>
                  <button
                    onClick={() => handleCancel(registration.id, ev.id)}
                    disabled={pendingEventId === ev.id}
                    className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 font-semibold text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {pendingEventId === ev.id ? 'Cancelling...' : 'Cancel'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleRegister(ev.id)}
                  disabled={pendingEventId === ev.id || seatsOpen >= ev.seatsTotal}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#80172B] hover:bg-[#651020] text-white rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CalendarDays className="w-4 h-4" />
                  {pendingEventId === ev.id
                    ? 'Registering...'
                    : seatsOpen >= ev.seatsTotal
                      ? 'Event Full'
                      : 'Register for Campus Event'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-sm text-gray-400">
          No events match your search.
        </div>
      )}

      {showEventForm && (
        <EventFormModal
          mode={isStaff ? 'create' : 'request'}
          types={types}
          onSubmit={handleSubmitEvent}
          onClose={() => setShowEventForm(false)}
          submitting={submittingEvent}
        />
      )}

      {registrantsFor && <RegistrantsModal event={registrantsFor} onClose={() => setRegistrantsFor(null)} />}
    </>
  );
}
