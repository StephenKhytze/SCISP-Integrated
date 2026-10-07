import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Mail, 
  Send, 
  Key, 
  UserCheck, 
  AlertCircle, 
  Inbox, 
  Calendar,
  GraduationCap,
  Phone,
  MapPin,
  RefreshCw
} from 'lucide-react';
import api from '../../services/api';

export default function RegistrationConfirmation() {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [isOutboxOpen, setIsOutboxOpen] = useState(false);
  const [outboxItems, setOutboxItems] = useState([]);

  // Approve Form
  const [customUsername, setCustomUsername] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [adminNotes, setAdminNotes] = useState('Registration verified and approved by admissions.');
  const [actionLoading, setActionLoading] = useState(false);

  // Reject Form
  const [rejectionReason, setRejectionReason] = useState('Incomplete scholastic records or prerequisite requirements.');
  const [customRejectionReason, setCustomRejectionReason] = useState('');

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [regsRes, statsRes] = await Promise.all([
        api.get(`/admin/registrations?status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`),
        api.get('/admin/registrations/stats')
      ]);
      setRegistrations(regsRes.data.data || []);
      setStats(statsRes.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch registration data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchOutbox = async () => {
    try {
      const res = await api.get('/admin/registrations/outbox');
      setOutboxItems(res.data.data || []);
      setIsOutboxOpen(true);
    } catch (err) {
      showToast('Failed to load notification outbox.', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const openApproveModal = (student) => {
    setApproveTarget(student);
    const cleanLast = (student.last_name || '').replace(/[^A-Za-z0-9]/g, '');
    const cleanFirst = (student.first_name || '').replace(/[^A-Za-z0-9]/g, '');
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setCustomUsername(`${cleanLast}_${cleanFirst}_C${randomCode}`);
    setCustomPassword(`Abc#${Math.random().toString(36).slice(-6)}`);
    setAdminNotes('Registration verified and approved by admissions.');
  };

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    if (!approveTarget) return;

    setActionLoading(true);
    try {
      const res = await api.post(`/admin/registrations/${approveTarget.id}/approve`, {
        custom_username: customUsername,
        custom_password: customPassword,
        admin_notes: adminNotes,
      });

      showToast(res.data.message || 'Student registration successfully approved!');
      setApproveTarget(null);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to approve registration.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (student) => {
    setRejectTarget(student);
    setRejectionReason('Incomplete scholastic records or prerequisite requirements.');
    setCustomRejectionReason('');
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectTarget) return;

    const finalReason = rejectionReason === 'Other'
      ? customRejectionReason.trim()
      : rejectionReason;

    if (!finalReason) {
      showToast('Please provide a specific reason for denying the registration.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.post(`/admin/registrations/${rejectTarget.id}/reject`, {
        reason: finalReason,
      });

      showToast(res.data.message || 'Registration rejected and student notified.');
      setRejectTarget(null);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reject registration.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-bold flex items-center space-x-2 animate-bounce ${
          toast.type === 'error' 
            ? 'bg-rose-50 border-rose-300 text-rose-800' 
            : 'bg-emerald-50 border-emerald-300 text-emerald-800'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-rose-600" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Banner & Action */}
      <div className="bg-gradient-to-r from-[#182848] via-[#243b6b] to-[#80172B] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-2">
            <span className="px-2.5 py-1 bg-white/20 rounded-lg text-[11px] font-extrabold tracking-wider uppercase text-white">
              Office of Admissions &amp; Enrollment
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Student Registration Acceptance Console
          </h1>
          <p className="text-white/80 text-xs sm:text-sm">
            Review online student registration applications, verify eligibility, issue official portal credentials, and automatically dispatch acceptance/denial emails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOutbox}
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm transition-all"
          >
            <Inbox className="w-4 h-4 text-white" />
            <span>Sent Notification Outbox</span>
          </button>
          <button
            onClick={fetchData}
            className="p-2.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-xl transition-all"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600">
              PENDING REVIEW
            </span>
            <div className={`text-3xl font-black text-slate-900 mt-1 transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
              {stats.pending}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Awaiting administrator action</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
              APPROVED STUDENTS
            </span>
            <div className={`text-3xl font-black text-slate-900 mt-1 transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
              {stats.approved}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Credentials dispatched</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600">
              DENIED REQUESTS
            </span>
            <div className={`text-3xl font-black text-slate-900 mt-1 transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
              {stats.rejected}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Notice emailed to applicant</span>
          </div>
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
              TOTAL RECEIVED
            </span>
            <div className={`text-3xl font-black text-slate-900 mt-1 transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
              {stats.total}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">All applications submitted</span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'pending', label: 'Pending Review', count: stats.pending, color: 'amber' },
            { id: 'approved', label: 'Approved', count: stats.approved, color: 'emerald' },
            { id: 'rejected', label: 'Denied', count: stats.rejected, color: 'rose' },
            { id: '', label: 'All Applicants', count: stats.total, color: 'slate' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                statusFilter === tab.id
                  ? 'bg-[#182848] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-white text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search name, email, ref #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#80172B] focus:border-transparent font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Main Registrations Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Reference &amp; Applicant</th>
                  <th className="py-4 px-6">Program &amp; Standing</th>
                  <th className="py-4 px-6">Contact &amp; Delivery</th>
                  <th className="py-4 px-6">Submitted Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="animate-pulse">
                    {/* Reference & Applicant Skeleton */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0"></div>
                        <div className="space-y-1.5 w-32 sm:w-40">
                          <div className="h-3.5 bg-slate-200 rounded-md w-full"></div>
                          <div className="h-2.5 bg-slate-100 rounded-md w-24"></div>
                        </div>
                      </div>
                    </td>

                    {/* Program & Standing Skeleton */}
                    <td className="py-4 px-6">
                      <div className="space-y-1.5 w-36 sm:w-44">
                        <div className="h-3.5 bg-slate-200 rounded-md w-full"></div>
                        <div className="h-2.5 bg-slate-100 rounded-md w-16"></div>
                      </div>
                    </td>

                    {/* Contact & Delivery Skeleton */}
                    <td className="py-4 px-6">
                      <div className="space-y-1.5 w-40 sm:w-48">
                        <div className="h-3.5 bg-slate-200 rounded-md w-4/5"></div>
                        <div className="h-2.5 bg-slate-100 rounded-md w-28"></div>
                      </div>
                    </td>

                    {/* Submitted Date Skeleton */}
                    <td className="py-4 px-6">
                      <div className="h-3.5 bg-slate-200 rounded-md w-20"></div>
                    </td>

                    {/* Status Badge Skeleton */}
                    <td className="py-4 px-6">
                      <div className="h-6 bg-slate-200 rounded-full w-24"></div>
                    </td>

                    {/* Actions Skeleton */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                        <div className="w-16 h-8 bg-slate-200 rounded-lg"></div>
                        <div className="w-12 h-8 bg-slate-100 rounded-lg"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : registrations.length === 0 ? (
          <div className="py-20 text-center space-y-4 px-4">
            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-400 shadow-inner">
              <UserCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-base">No Registration Records Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? `No records match "${searchQuery}". Try searching with a different term.`
                  : `There are currently no registration requests in the "${statusFilter || 'all'}" queue.`}
              </p>
            </div>
            {(statusFilter || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('');
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Clear Filters &amp; Show All</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Reference &amp; Applicant</th>
                  <th className="py-4 px-6">Program &amp; Standing</th>
                  <th className="py-4 px-6">Contact &amp; Delivery</th>
                  <th className="py-4 px-6">Submitted Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Applicant & Ref */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-[#80172B]/10 text-[#80172B] flex items-center justify-center font-black text-sm flex-shrink-0">
                          {reg.first_name?.[0]}{reg.last_name?.[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {reg.first_name} {reg.middle_name ? `${reg.middle_name} ` : ''}{reg.last_name}
                          </div>
                          <span className="font-mono text-[11px] text-slate-500 font-bold">
                            {reg.reference_no}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Academic */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800">{reg.program}</div>
                        <div className="text-[11px] text-slate-500">{reg.year_level}</div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{reg.email}</span>
                        </div>
                        {reg.contact_number && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{reg.contact_number}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-slate-600">
                      {new Date(reg.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      {reg.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-extrabold rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>Pending Review</span>
                        </span>
                      )}
                      {reg.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approved</span>
                        </span>
                      )}
                      {reg.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-extrabold rounded-full">
                          <XCircle className="w-3 h-3" />
                          <span>Denied</span>
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedStudent(reg)}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View 3-Section Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {reg.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openApproveModal(reg)}
                              className="px-3 py-1.5 bg-[#007A5A] hover:bg-[#00664a] text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center space-x-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              onClick={() => openRejectModal(reg)}
                              className="px-3 py-1.5 border border-slate-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                            >
                              <span>Deny</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW FULL APPLICANT 3-SECTION DETAILS                            */}
      {/* ========================================================================= */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4 border-b border-slate-100 pb-4">
              <div className="w-14 h-14 bg-[#80172B]/10 text-[#80172B] rounded-2xl flex items-center justify-center font-black text-xl">
                {selectedStudent.first_name?.[0]}{selectedStudent.last_name?.[0]}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {selectedStudent.first_name} {selectedStudent.middle_name} {selectedStudent.last_name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {selectedStudent.reference_no}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    selectedStudent.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedStudent.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedStudent.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 1 Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#80172B]" />
                <span>Section 1: Personal Details</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">First Name</span>
                  <span className="font-bold text-slate-800">{selectedStudent.first_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Middle Name</span>
                  <span className="font-bold text-slate-800">{selectedStudent.middle_name || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Last Name</span>
                  <span className="font-bold text-slate-800">{selectedStudent.last_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Date of Birth</span>
                  <span className="font-bold text-slate-800">
                    {selectedStudent.birthdate 
                      ? new Date(selectedStudent.birthdate.split('T')[0] + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Gender</span>
                  <span className="font-bold text-slate-800">{selectedStudent.gender || '—'}</span>
                </div>
              </div>
            </div>

            {/* Section 2 Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#80172B]" />
                <span>Section 2: Academic Placement</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block font-medium">Program / Degree</span>
                  <span className="font-bold text-slate-800">{selectedStudent.program}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Year Level</span>
                  <span className="font-bold text-slate-800">{selectedStudent.year_level}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Existing Student ID</span>
                  <span className="font-bold text-slate-800">{selectedStudent.student_id_number || 'New Student'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block font-medium">Previous School</span>
                  <span className="font-bold text-slate-800">{selectedStudent.previous_school || '—'}</span>
                </div>
              </div>
            </div>

            {/* Section 3 Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#80172B]" />
                <span>Section 3: Contact &amp; Notification Delivery</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Email Address (Credential Destination)</span>
                  <span className="font-bold text-slate-800">{selectedStudent.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Contact Number</span>
                  <span className="font-bold text-slate-800">{selectedStudent.contact_number || '—'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block font-medium">Residential Address</span>
                  <span className="font-bold text-slate-800">{selectedStudent.home_address || '—'}</span>
                </div>
              </div>
            </div>

            {selectedStudent.admin_notes && (
              <div className="bg-slate-100 p-4 rounded-2xl text-xs">
                <span className="font-bold text-slate-700 block mb-1">Administrative Notes:</span>
                <p className="text-slate-600">{selectedStudent.admin_notes}</p>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: APPROVE REGISTRATION & DISPATCH CREDENTIALS                      */}
      {/* ========================================================================= */}
      {approveTarget && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Approve Student Registration</h3>
                <p className="text-xs text-slate-500">
                  Create student account and dispatch official credentials email
                </p>
              </div>
            </div>

            <form onSubmit={handleApproveSubmit} className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-slate-600">
                  Applicant: {approveTarget.first_name} {approveTarget.last_name} ({approveTarget.reference_no})
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assigned Portal Username
                  </label>
                  <input
                    type="text"
                    value={customUsername}
                    onChange={(e) => setCustomUsername(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500">Auto-generated following school standard format.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Temporary Password
                  </label>
                  <input
                    type="text"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500">
                    Student will be forced to change this on their initial login.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Approval Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Email Notification Preview Callout */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 space-y-1.5">
                <div className="font-extrabold flex items-center gap-1.5 text-emerald-800">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>Automated Email Will Be Dispatched:</span>
                </div>
                <p className="text-emerald-800/90 text-[11px] leading-relaxed">
                  To: <strong>{approveTarget.email}</strong><br />
                  Subject: <em>Welcome to ABC School - Your Student Portal Account is Approved</em><br />
                  Contains: Login URL, Assigned Username (<code>{customUsername}</code>), and Temporary Password (<code>{customPassword}</code>).
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApproveTarget(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-60"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Approve &amp; Send Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DENY REGISTRATION & DISPATCH REJECTION NOTICE                    */}
      {/* ========================================================================= */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center">
                <X className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Deny Student Registration</h3>
                <p className="text-xs text-slate-500">
                  Inform applicant regarding eligibility or record requirements
                </p>
              </div>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-slate-600">
                  Applicant: {rejectTarget.first_name} {rejectTarget.last_name} ({rejectTarget.reference_no})
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Standard Reason
                  </label>
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium cursor-pointer"
                  >
                    <option value="Incomplete scholastic records or prerequisite requirements.">
                      Incomplete scholastic records or prerequisite requirements
                    </option>
                    <option value="Program capacity for the academic term has reached maximum enrollment limit.">
                      Program enrollment limit reached
                    </option>
                    <option value="Invalid contact details or duplicate student record detected.">
                      Invalid details or duplicate application
                    </option>
                    <option value="Transferee credentials need on-campus verification with Registrar.">
                      Transferee credentials need on-campus verification
                    </option>
                    <option value="Other">
                      Other (Specify custom reason...)
                    </option>
                  </select>
                </div>

                {/* Only shown when "Other" is selected */}
                {rejectionReason === 'Other' && (
                  <div className="space-y-1 animate-in fade-in duration-200">
                    <label className="block text-xs font-bold text-slate-700">
                      Specify Custom Reason <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={customRejectionReason}
                      onChange={(e) => setCustomRejectionReason(e.target.value)}
                      placeholder="Please enter the specific reason for denial to inform the applicant..."
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      required
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Email Notification Preview Callout */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 text-xs text-rose-900 space-y-1.5">
                <div className="font-extrabold flex items-center gap-1.5 text-rose-800">
                  <Mail className="w-4 h-4 text-rose-600" />
                  <span>Automated Denial Email Will Be Dispatched:</span>
                </div>
                <p className="text-rose-800/90 text-[11px] leading-relaxed">
                  To: <strong>{rejectTarget.email}</strong><br />
                  Subject: <em>ABC School Student Registration Update</em><br />
                  Reason to send: <strong>{rejectionReason === 'Other' ? (customRejectionReason || 'Custom reason...') : rejectionReason}</strong>
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectTarget(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-60"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Deny &amp; Send Notice</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER 4: SENT NOTIFICATIONS & OUTBOX VIEWER                              */}
      {/* ========================================================================= */}
      {isOutboxOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[85vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setIsOutboxOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center">
                <Inbox className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Dispatched Notification Outbox
                </h3>
                <p className="text-xs text-slate-500">
                  Live history of all automated acceptance and denial emails sent to students
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {outboxItems.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 font-bold">
                  No automated emails have been logged yet.
                </div>
              ) : (
                outboxItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.status}
                        </span>
                        <span className="font-bold text-slate-800">{item.student_name}</span>
                        <span className="text-slate-400">({item.email})</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {item.reviewed_at}
                      </span>
                    </div>

                    <div className="font-medium text-slate-700">
                      <strong>Subject:</strong> {item.subject}
                    </div>

                    {item.username && (
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between font-mono text-[11px]">
                        <span>Issued Username: <strong>{item.username}</strong></span>
                        <span className="text-slate-500 font-sans text-[10px]">Reference: {item.reference_no}</span>
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsOutboxOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs"
              >
                Close Outbox
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
