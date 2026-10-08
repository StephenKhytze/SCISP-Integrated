import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Eye, EyeOff, Check, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function ResetPasswordModal({ isOpen, onClose, email, token }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  if (!isOpen) return null;

  // Password Requirement Rules
  const requirements = [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'uppercase', label: 'At least 1 uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { id: 'lowercase', label: 'At least 1 lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { id: 'number', label: 'At least 1 number (0-9)', met: /[0-9]/.test(password) },
    {
      id: 'special',
      label: 'At least 1 special character (!@#$%^&*)',
      met: /[!@#$%^&*(),.?":{}|<>_\-\\/+=~`[\]]/.test(password),
    },
  ];

  const metCount = requirements.filter((r) => r.met).length;
  const allRequirementsMet = requirements.every((r) => r.met);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isFormValid = allRequirementsMet && passwordsMatch;

  // Strength Bar styling
  const getStrengthLabel = () => {
    if (password.length === 0) return { text: '', color: 'bg-slate-200' };
    if (metCount <= 2) return { text: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-600' };
    if (metCount <= 4) return { text: 'Moderate', color: 'bg-amber-500', textColor: 'text-amber-600' };
    return { text: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600' };
  };

  const strength = getStrengthLabel();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!allRequirementsMet) {
      setStatus({ type: 'error', message: 'Please satisfy all password security requirements.' });
      return;
    }

    if (!passwordsMatch) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await api.post('/auth/reset-password', {
        email,
        token,
        password,
        password_confirmation: confirmPassword
      });
      setStatus({
        type: 'success',
        message: 'Password successfully reset! You can now log in with your new password.'
      });
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to reset password. The link may have expired.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-full">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                Create New Password
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Secure your account
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Please enter your new password below. Ensure it meets the security requirements.
          </p>

          {status.message && (
            <div className={`p-3 rounded-xl text-xs font-semibold border flex items-start space-x-2 ${
              status.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {status.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  New Password
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#80172B] focus:border-transparent font-medium transition-all"
                  required
                  disabled={loading || status.type === 'success'}
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading || status.type === 'success'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter Bar */}
              {password.length > 0 && (
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
                          : password.length > 0
                          ? 'bg-rose-100 text-rose-500'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {req.met ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <X className={`w-3 h-3 stroke-[3] ${password.length > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
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
                  disabled={loading || status.type === 'success'}
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  disabled={loading || status.type === 'success'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid || loading || status.type === 'success'}
                className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
                  isFormValid && !loading && status.type !== 'success'
                    ? 'bg-[#182848] hover:bg-[#111d35] text-white cursor-pointer hover:shadow-lg active:scale-[0.99]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
