export const initialAnnouncements = [
  {
    id: 'ann-1',
    category: 'Academic',
    date: 'August 5, 2026',
    source: 'Office of the Registrar',
    title: 'Midterm Examination Schedule for AY 2024-2025 First Semester',
    description:
      'Please be guided that the Midterm Examination period will run from August 18 to August 22, 2026. Make sure your examination permits are validated prior to exam dates.',
    pinned: true,
  },
  {
    id: 'ann-2',
    category: 'Student Affairs',
    date: 'August 5, 2026',
    source: 'Office of Student Affairs',
    title: 'Deadline for Student Organization Membership Renewal',
    description:
      'All students intending to renew or apply for organization membership must submit their forms on or before August 20, 2026 at the OSA office.',
    pinned: false,
  },
  {
    id: 'ann-3',
    category: 'General Information',
    date: 'August 3, 2026',
    source: 'IT Services Office',
    title: 'Scheduled Portal Maintenance This Weekend',
    description:
      'The Student Portal will undergo scheduled maintenance on August 8, 2026 from 11:00 PM to 2:00 AM. Some services may be temporarily unavailable during this window.',
    pinned: false,
  },
  {
    id: 'ann-4',
    category: 'Events',
    date: 'August 1, 2026',
    source: 'Office of Student Placement',
    title: 'Registration Now Open: Graduate Career Fair & Industry Partner Expo',
    description:
      'Slots are now open for the Graduate Career Fair on September 5, 2026. Visit the Campus Events Desk tab to reserve your ticket.',
    pinned: false,
  },
];

export const categoryStyles = {
  Academic: 'bg-rose-50 text-rose-600',
  'Student Affairs': 'bg-emerald-50 text-emerald-600',
  Events: 'bg-indigo-50 text-indigo-600',
  'General Information': 'bg-blue-50 text-blue-600',
};

export const announcementCategories = ['All', 'Academic', 'Student Affairs', 'Events', 'General Information'];

export const announcementFormCategories = ['Academic', 'Student Affairs', 'Events', 'General Information'];

export const campusEvents = [
  {
    id: 'evt-hack',
    type: 'Hackathon',
    title: 'Annual College Hackathon 2026: AI & Cloud Computing',
    description:
      'Build innovative AI solutions and cloud microservices in 24 hours. Open to all BSIT & BSCS students.',
    date: '2026-08-15',
    time: '09:00 AM - 05:00 PM',
    venue: 'CCS Audio-Visual Hall',
    host: 'CCS Student Council & Dev Club',
    seatsTaken: 42,
    seatsTotal: 100,
  },
  {
    id: 'evt-sec',
    type: 'Symposium',
    title: 'Cybersecurity & Ethical Hacking Symposium',
    description:
      'Industry practitioners discuss penetration testing, network defense, and zero-trust security frameworks.',
    date: '2026-08-22',
    time: '01:00 PM - 04:30 PM',
    venue: 'Tech Auditorium B',
    host: 'Information Security Org',
    seatsTaken: 18,
    seatsTotal: 60,
  },
  {
    id: 'evt-car',
    type: 'Career Fair',
    title: 'Graduate Career Fair & Industry Partner Expo',
    description:
      'Meet recruiters from top tech enterprises, software houses, and financial institutions for internships & jobs.',
    date: '2026-09-05',
    time: '10:00 AM - 04:00 PM',
    venue: 'University Grand Gymnasium',
    host: 'Office of Student Placement',
    seatsTaken: 120,
    seatsTotal: 300,
  },
  {
    id: 'evt-db',
    type: 'Workshop',
    title: 'Database Systems & SQL Optimization Workshop',
    description:
      'Hands-on query execution plan tuning, indexing strategies, and performance profiling for relational databases.',
    date: '2026-08-29',
    time: '01:00 PM - 05:00 PM',
    venue: 'Computer Laboratory 3',
    host: 'Database Systems Guild',
    seatsTaken: 25,
    seatsTotal: 30,
  },
];

export const eventTypes = ['All', 'Hackathon', 'Symposium', 'Career Fair', 'Workshop', 'Seminar'];

export const eventTypeStyles = {
  Hackathon: 'bg-indigo-50 text-indigo-600',
  Symposium: 'bg-purple-50 text-purple-600',
  'Career Fair': 'bg-orange-50 text-orange-600',
  Workshop: 'bg-blue-50 text-blue-600',
  Seminar: 'bg-teal-50 text-teal-600',
};

export const initialRegistrations = [
  {
    id: 'reg-1',
    eventId: 'evt-car',
    ticketCode: 'TCK-CAR-6940',
    status: 'Cancelled',
    registeredOn: '2026-08-04 10:51',
  },
  {
    id: 'reg-2',
    eventId: 'evt-hack',
    ticketCode: 'TCK-HK2026-88',
    status: 'Approved',
    registeredOn: '2026-08-01 10:30',
  },
  {
    id: 'reg-3',
    eventId: 'evt-sec',
    ticketCode: 'TCK-SEC2026-12',
    status: 'Pending Approval',
    registeredOn: '2026-08-02 14:15',
  },
];

export const registrationStatusStyles = {
  Cancelled: 'bg-gray-200 text-gray-500',
  Approved: 'bg-emerald-100 text-emerald-700',
  'Pending Approval': 'bg-amber-100 text-amber-700',
  Denied: 'bg-rose-100 text-rose-700',
};
