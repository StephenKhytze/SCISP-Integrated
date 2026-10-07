import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, Clock, AlertCircle, X } from 'lucide-react';
import api from '../../services/api';

export default function RegistrationStatusModal({ isOpen, onClose, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter your application reference code or registered email address.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.get(`/auth/registration-status?query=${encodeURIComponent(query.trim())}`);
      setResult(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'No registration found matching the entered reference code or email.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 mb-5">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Check Application Status
          </h3>
          <p className="text-xs text-slate-500">
            Enter your registration reference number (e.g. <code>REG-2026-XXXX</code>) or registered email address.
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. REG-2026-MWJLZX or student@email.com"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#80172B] focus:border-transparent font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#182848] hover:bg-[#111d35] text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Inquire Application</span>
            )}
          </button>
        </form>

        {loading && (
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-3 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-slate-200 rounded-md"></div>
              <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5">
              <div className="h-4 w-40 bg-slate-200 rounded-md"></div>
              <div className="h-3 w-56 bg-slate-200 rounded-md"></div>
              <div className="h-3 w-48 bg-slate-200 rounded-md"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 font-mono">
                {result.reference_no}
              </span>
              {result.status === 'pending' && (
                <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-[11px] font-extrabold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Pending Review</span>
                </span>
              )}
              {result.status === 'approved' && (
                <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[11px] font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Approved</span>
                </span>
              )}
              {result.status === 'rejected' && (
                <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-full text-[11px] font-extrabold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-700" />
                  <span>Not Approved</span>
                </span>
              )}
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Applicant Name:</span>
                <span className="font-bold text-slate-900">{result.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Program:</span>
                <span className="font-bold text-slate-900">{result.program}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Year Level:</span>
                <span className="font-bold text-slate-900">{result.year_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Submitted:</span>
                <span className="font-medium text-slate-600">{result.submitted_at}</span>
              </div>

              {result.status === 'approved' && (
                <div className="mt-3 pt-3 border-t border-slate-200 text-[11px] text-emerald-900 bg-emerald-50 p-2.5 rounded-xl">
                  <strong>Congratulations!</strong> Your application was approved. Check your email (<strong>{result.email}</strong>) for your official username and temporary password.
                </div>
              )}

              {result.status === 'rejected' && (
                <div className="mt-3 pt-3 border-t border-slate-200 text-[11px] text-rose-900 bg-rose-50 p-2.5 rounded-xl">
                  <strong>Note from Administration:</strong><br />
                  {result.admin_notes || 'Please contact admissions for further guidance.'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
