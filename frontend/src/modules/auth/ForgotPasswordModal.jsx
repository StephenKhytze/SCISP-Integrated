import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  Mail, 
  ShieldCheck, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  ArrowLeft, 
  CheckCircle2, 
  RefreshCw
} from 'lucide-react';
import api from '../../services/api';

export default function ForgotPasswordModal({ 
  isOpen, 
  onClose = () => {}, 
  onSuccess = () => {},
  initialEmail = '',
  initialToken = ''
}) {
  const [step, setStep] = useState(initialToken && initialEmail ? 2 : 1); // 1: request, 2: reset, 3: success
  const [identity, setIdentity] = useState('');
  const [email, setEmail] = useState(initialEmail || '');
  const [maskedEmail, setMaskedEmail] = useState(initialEmail || '');
  const [code, setCode] = useState('');
  const [token, setToken] = useState(initialToken || '');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

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
  const isFormValid = (code.length === 6 || token) && allRequirementsMet && passwordsMatch;

  // Strength Bar styling
  const getStrengthLabel = () => {
    if (newPassword.length === 0) return { text: '', color: 'bg-slate-200' };
    if (metCount <= 2) return { text: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-600' };
    if (metCount <= 4) return { text: 'Moderate', color: 'bg-amber-500', textColor: 'text-amber-600' };
    return { text: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600' };
  };

  const strength = getStrengthLabel();

  // Handle Step 1: Request Code
  const handleRequestCode = async (e) => {
    if (e) e.preventDefault();
    if (!identity.trim()) {
      setError('Please enter your email address or username.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', {
        identity: identity.trim(),
      });

      setEmail(response.data.email);
      setMaskedEmail(response.data.masked_email || response.data.email);
      setResendCooldown(60);
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to send recovery code. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend code handler
  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return;
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', {
        identity: email || identity.trim(),
      });

      setResendCooldown(60);
      setSuccessMessage('A fresh 6-digit recovery code has been sent!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to resend recovery code.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!token && code.trim().length !== 6) {
      setError('Please enter the 6-digit recovery code from your email.');
      return;
    }

    if (!allRequirementsMet) {
      setError('Please satisfy all password security requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email,
        password: newPassword,
        password_confirmation: confirmPassword,
      };

      if (token) {
        payload.token = token;
      } else {
        payload.code = code.trim();
      }

      const response = await api.post('/auth/reset-password', payload);

      setStep(3);
      if (response.data.username) {
        onSuccess(response.data.username);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to reset password. Please verify the code and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset internal state
    setStep(1);
    setIdentity('');
    setEmail('');
    setMaskedEmail('');
    setCode('');
    setToken('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-auto">
        
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-2xl transition-all cursor-pointer focus:outline-none"
          title="Close"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================================= */}
        {/* STEP 1: REQUEST RECOVERY CODE                                             */}
        {/* ========================================================================= */}
        {step === 1 && (
          <form onSubmit={handleRequestCode} className="space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-[#fcedf0] text-[#80172B] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <KeyRound className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Forgot Password?
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Enter your registered student/faculty email address or username. We'll send you a 6-digit recovery code to reset your password.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2.5 text-xs text-rose-700 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Username or Email Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder="e.g. DelaCruz_Juan_C1234 or juan@abc.edu.ph"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#80172B] focus:border-transparent transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !identity.trim()}
              className="w-full py-3.5 bg-[#80172B] hover:bg-[#681122] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <span>Send Recovery Code</span>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: VERIFY CODE & SET NEW PASSWORD                                    */}
        {/* ========================================================================= */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-[#fcedf0] text-[#80172B] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Reset Your Password
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Enter the recovery code sent to <strong className="text-slate-800">{maskedEmail}</strong> and choose a secure new password.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2 text-xs text-rose-700 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-2 text-xs text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            {/* 6-Digit OTP Input (Unless URL token is being used) */}
            {!token && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    6-Digit Recovery Code
                  </label>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={handleResend}
                    className="text-xs font-semibold text-[#80172B] hover:underline disabled:text-slate-400 disabled:no-underline cursor-pointer"
                  >
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="&bull; &bull; &bull; &bull; &bull; &bull;"
                  className="w-full py-2.5 text-center text-xl font-mono tracking-[0.5em] bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#80172B] focus:border-transparent font-bold"
                />
              </div>
            )}

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#80172B] focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Password Strength:</span>
                    <span className={`font-bold ${strength.textColor}`}>{strength.text}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                    <div className={`h-full rounded-full flex-1 transition-all ${metCount >= 1 ? strength.color : 'bg-slate-200'}`} />
                    <div className={`h-full rounded-full flex-1 transition-all ${metCount >= 3 ? strength.color : 'bg-slate-200'}`} />
                    <div className={`h-full rounded-full flex-1 transition-all ${metCount === 5 ? strength.color : 'bg-slate-200'}`} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#80172B] focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={`text-[11px] font-medium flex items-center space-x-1 ${passwordsMatch ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {passwordsMatch ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                </p>
              )}
            </div>

            {/* Password Security Rules Checklist */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px]">
              <p className="font-bold text-slate-700">Password Security Requirements:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {requirements.map((req) => (
                  <div key={req.id} className="flex items-center space-x-1.5">
                    {req.met ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex-shrink-0" />
                    )}
                    <span className={req.met ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full py-3.5 bg-[#80172B] hover:bg-[#681122] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Request a different email or code</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: SUCCESS CONFIRMATION                                              */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="text-center space-y-5 py-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Password Reset Successfully!
              </h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your portal password has been updated. You can now log into your account using your new password.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 text-left space-y-1">
              <p className="font-bold text-slate-700">Security Tip:</p>
              <p>Keep your login credentials confidential. Do not share your password with anyone.</p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3.5 bg-[#182848] hover:bg-[#111d35] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Sign In Now
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
