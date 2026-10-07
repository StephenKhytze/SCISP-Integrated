import React, { useState } from 'react';
import { Lock, ShieldCheck, AlertCircle, Eye, EyeOff, Check, X } from 'lucide-react';
import api from '../../services/api';

export default function FirstTimePasswordModal({ isOpen, user, onPasswordSet, onClose = () => {} }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Password Requirement Rules
  const requirements = [
    { id: 'length', label: 'At least 8 characters', met: newPassword.length >= 8 },
    { id: 'uppercase', label: 'At least 1 uppercase letter (A-Z)', met: /[A-Z]/.test(newPassword) },
    { id: 'lowercase', label: 'At least 1 lowercase letter (a-z)', met: /[a-z]/.test(newPassword) },
    { id: 'number', label: 'At least 1 number (0-9)', met: /[0-9]/.test(newPassword) },
    {
      id: 'special',
      label: 'At least 1 special character (!@#$%^&*)',
      met: /[!@#$%^&*(),.?":{}|<>_\-\\/+=~`[\]]/.test(newPassword),
    },
  ];

  const metCount = requirements.filter((r) => r.met).length;
  const allRequirementsMet = requirements.every((r) => r.met);
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid = allRequirementsMet && passwordsMatch;

  // Strength Bar styling
  const getStrengthLabel = () => {
    if (newPassword.length === 0) return { text: '', color: 'bg-slate-200' };
    if (metCount <= 2) return { text: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-600' };
    if (metCount <= 4) return { text: 'Moderate', color: 'bg-amber-500', textColor: 'text-amber-600' };
    return { text: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600' };
  };

  const strength = getStrengthLabel();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!allRequirementsMet) {
      setError('Please satisfy all password security requirements before proceeding.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/change-password', {
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      // Update tokens and user in localStorage
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      onPasswordSet(response.data.user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to set permanent password. Please check requirements and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-auto">
        {/* Top-Right X Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-2xl transition-all cursor-pointer focus:outline-none"
          title="Close"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#fcedf0] text-[#80172B] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Set Permanent Password
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Welcome, <strong>{user?.name || user?.username}</strong>! Because this is your first time logging in with temporary credentials, please establish your private permanent password.
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                New Permanent Password
              </label>
              {strength.text && (
                <span className={`text-[11px] font-bold ${strength.textColor}`}>
                  Strength: {strength.text}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#80172B] focus:border-transparent font-medium transition-all"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength Meter Bar */}
            {newPassword.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-full flex-1 transition-all duration-300 ${
                        metCount >= level ? strength.color : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Requirements Checklist */}
          <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block">
              Password Security Requirements:
            </span>
            <ul className="space-y-1.5 text-xs">
              {requirements.map((req) => (
                <li
                  key={req.id}
                  className={`flex items-center space-x-2 transition-colors ${
                    req.met ? 'text-emerald-700 font-semibold' : 'text-slate-500 font-normal'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      req.met
                        ? 'bg-emerald-100 text-emerald-600 shadow-sm'
                        : newPassword.length > 0
                        ? 'bg-rose-100 text-rose-500'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {req.met ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <X className={`w-3 h-3 stroke-[3] ${newPassword.length > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
                    )}
                  </div>
                  <span>{req.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Confirm Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Confirm New Password
              </label>
              {confirmPassword.length > 0 && (
                <span
                  className={`text-[11px] font-bold flex items-center gap-1 ${
                    passwordsMatch ? 'text-emerald-600' : 'text-rose-500'
                  }`}
                >
                  {passwordsMatch ? (
                    <>
                      <Check className="w-3 h-3" /> Passwords match
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3" /> Passwords do not match
                    </>
                  )}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-type your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:border-transparent font-medium transition-all ${
                  confirmPassword.length > 0
                    ? passwordsMatch
                      ? 'border-emerald-400 focus:ring-emerald-500'
                      : 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-300 focus:ring-[#80172B]'
                }`}
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
              isFormValid && !loading
                ? 'bg-[#80172B] hover:bg-[#6b1424] text-white cursor-pointer hover:shadow-lg active:scale-[0.99]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Activate Account &amp; Proceed</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
