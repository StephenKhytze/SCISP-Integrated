import { useState, useEffect, useCallback } from 'react';
import { Megaphone, CalendarDays, UserCheck, ClipboardCheck, Loader2 } from 'lucide-react';
import AnnouncementsFeed from './components/AnnouncementsFeed';
import CampusEventsDesk from './components/CampusEventsDesk';
import EventRegistrationMonitor from './components/EventRegistrationMonitor';
import EventApprovalDesk from './components/EventApprovalDesk';
import api from '../../services/api';
import { isStaffUser } from './role';

const mapAnnouncement = (a) => ({
  id: a.announcement_id,
  eventId: a.event_id,
  title: a.title,
  category: a.category,
  source: a.source,
  description: a.description,
  pinned: !!a.pinned,
  date: new Date(a.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
});

export default function AnnouncementList() {
  const [activeTab, setActiveTab] = useState('feed');
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [eventRequests, setEventRequests] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [announcementCategories, setAnnouncementCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Admins/Faculty/Superadmin manage announcements, events and approvals;
  // Students register for events, request new ones, and track their own status.
  const isStaff = isStaffUser();
  const isStudent = !isStaff;

  const TABS = [
    { key: 'feed', label: 'Announcements Feed', icon: Megaphone },
    { key: 'events', label: 'Campus Events Desk', icon: CalendarDays },
    isStaff
      ? { key: 'monitor', label: 'Registration Approvals', icon: ClipboardCheck }
      : { key: 'monitor', label: 'Event Registration Monitor', icon: UserCheck },
  ];

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [announcementsRes, eventsRes, registrationsRes, requestsRes, typesRes, categoriesRes] = await Promise.all([
        api.get('/announcements'),
        api.get('/announcements/events'),
        api.get('/announcements/registrations'),
        api.get('/announcements/event-requests'),
        api.get('/announcements/event-types'),
        api.get('/announcements/categories'),
      ]);
      setEventTypes(typesRes.data);
      setAnnouncementCategories(categoriesRes.data);
      setAnnouncements(announcementsRes.data.map(mapAnnouncement));
      setEvents(eventsRes.data);
      setRegistrations(registrationsRes.data);
      setEventRequests(requestsRes.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to load announcements data from the server.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // An event post also creates an announcement (and deleting it removes it), so re-read both lists.
  const refreshEventsAndAnnouncements = async () => {
    const [announcementsRes, eventsRes] = await Promise.all([
      api.get('/announcements'),
      api.get('/announcements/events'),
    ]);
    setAnnouncements(announcementsRes.data.map(mapAnnouncement));
    setEvents(eventsRes.data);
  };

  const handlePostAnnouncement = async (form) => {
    const res = await api.post('/announcements', form);
    setAnnouncements((prev) => {
      const next = [mapAnnouncement(res.data), ...prev];
      return next.sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1));
    });
  };

  const handleEditAnnouncement = async (id, form) => {
    const res = await api.put(`/announcements/${id}`, form);
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? mapAnnouncement(res.data) : a)));
  };

  const handleArchiveAnnouncement = async (id) => {
    await api.patch(`/announcements/${id}/archive`);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCreateEvent = async (form) => {
    await api.post('/announcements/events', form);
    await refreshEventsAndAnnouncements();
  };

  const handleArchiveEvent = async (eventId) => {
    await api.patch(`/announcements/events/${eventId}/archive`);
    await refreshEventsAndAnnouncements();
    setRegistrations((prev) => prev.filter((r) => r.eventId !== eventId));
  };

  const handleAddAnnouncementCategory = async (name) => {
    const res = await api.post('/announcements/categories', { name });
    setAnnouncementCategories((prev) => (prev.includes(res.data) ? prev : [...prev, res.data]));
  };

  const handleAddEventType = async (name) => {
    const res = await api.post('/announcements/event-types', { name });
    setEventTypes((prev) => (prev.includes(res.data) ? prev : [...prev, res.data]));
  };

  const handleRequestEvent = async (form) => {
    const res = await api.post('/announcements/event-requests', form);
    setEventRequests((prev) => [res.data, ...prev]);
  };

  const handleApproveRequest = async (requestId) => {
    const res = await api.patch(`/announcements/event-requests/${requestId}/approve`);
    setEventRequests((prev) => prev.map((r) => (r.id === requestId ? res.data : r)));
    await refreshEventsAndAnnouncements();
  };

  const handleDenyRequest = async (requestId) => {
    const res = await api.patch(`/announcements/event-requests/${requestId}/deny`);
    setEventRequests((prev) => prev.map((r) => (r.id === requestId ? res.data : r)));
  };

  const handleRegister = async (eventId) => {
    const res = await api.post(`/announcements/events/${eventId}/register`);
    setRegistrations((prev) => [res.data, ...prev]);
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, seatsTaken: e.seatsTaken + 1 } : e))
    );
  };

  const handleCancel = async (registrationId) => {
    const res = await api.patch(`/announcements/registrations/${registrationId}/cancel`);
    setRegistrations((prev) => prev.map((r) => (r.id === registrationId ? res.data : r)));
    setEvents((prev) =>
      prev.map((e) =>
        e.id === res.data.eventId ? { ...e, seatsTaken: Math.max(0, e.seatsTaken - 1) } : e
      )
    );
  };

  const handleApprove = async (registrationId) => {
    const res = await api.patch(`/announcements/registrations/${registrationId}/approve`);
    setRegistrations((prev) => prev.map((r) => (r.id === registrationId ? res.data : r)));
  };

  const handleDeny = async (registrationId) => {
    const res = await api.patch(`/announcements/registrations/${registrationId}/deny`);
    setRegistrations((prev) => prev.map((r) => (r.id === registrationId ? res.data : r)));
    setEvents((prev) =>
      prev.map((e) =>
        e.id === res.data.eventId ? { ...e, seatsTaken: Math.max(0, e.seatsTaken - 1) } : e
      )
    );
  };

  const tabCounts = {
    feed: announcements.length,
    events: events.length,
    monitor: registrations.length + eventRequests.length,
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          Announcements & Event Registration
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Dynamic copy-level stock availability, barcode tracking, borrower dynamic due dates & late fee calculations.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-6 flex overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 sm:flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-[#80172B] border-[#80172B]'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.label} ({tabCounts[tab.key]})
            </button>
          );
        })}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-16 flex flex-col items-center justify-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium">Loading announcements & events...</span>
        </div>
      ) : (
        <>
          {activeTab === 'feed' && (
            <AnnouncementsFeed
              announcements={announcements}
              categories={announcementCategories}
              onAddCategory={handleAddAnnouncementCategory}
              onPost={handlePostAnnouncement}
              onEdit={handleEditAnnouncement}
              onArchive={handleArchiveAnnouncement}
              canManage={isStaff}
              onViewEvent={() => setActiveTab('events')}
            />
          )}

          {activeTab === 'events' && (
            <CampusEventsDesk
              events={events}
              registrations={registrations}
              onRegister={handleRegister}
              onCancel={handleCancel}
              canRegister={isStudent}
              isStaff={isStaff}
              types={eventTypes}
              onAddEventType={handleAddEventType}
              onCreateEvent={handleCreateEvent}
              onRequestEvent={handleRequestEvent}
              onArchiveEvent={handleArchiveEvent}
            />
          )}

          {activeTab === 'monitor' &&
            (isStaff ? (
              <EventApprovalDesk
                registrations={registrations}
                events={events}
                onApprove={handleApprove}
                onDeny={handleDeny}
                eventRequests={eventRequests}
                onApproveRequest={handleApproveRequest}
                onDenyRequest={handleDenyRequest}
              />
            ) : (
              <EventRegistrationMonitor
                registrations={registrations}
                events={events}
                onCancel={handleCancel}
                eventRequests={eventRequests}
              />
            ))}
        </>
      )}
    </div>
  );
}
