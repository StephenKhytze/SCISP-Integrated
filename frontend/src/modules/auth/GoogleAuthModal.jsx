import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  UserPlus, 
  FileSearch 
} from 'lucide-react';
import api from '../../services/api';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '81426550812-f96oreqhm2m9l5f5rudhcdmve7a45ck4.apps.googleusercontent.com';

export default function GoogleAuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess, 
  onSwitchToRegister, 
  onCheckStatus 
}) {
  const [loading, setLoading] = useState(false);
  const [statusInfo, setStatusInfo] = useState(null); // { type, message, refNumber, email }

  const handleClose = () => {
    setStatusInfo(null);
    onClose();
  };

  const handleResetForm = () => {
    setStatusInfo(null);
  };

  const handleAuthResponse = (data) => {
    const { access_token, user } = data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    onLoginSuccess(user);
    handleClose();
  };

  const handleAuthError = (err, fallbackEmail = '') => {
    const data = err.response?.data || {};
    const errorCode = data.error_code;
    const targetEmail = data.email || fallbackEmail;
    
    if (errorCode === 'REGISTRATION_PENDING') {
      setStatusInfo({
        type: 'pending',
        message: data.message,
        refNumber: data.reference_number,
        email: targetEmail
      });
    } else if (errorCode === 'ACCOUNT_NOT_FOUND') {
      setStatusInfo({
        type: 'not_found',
        message: data.message || `No registered ABC School account found for ${targetEmail || 'this Google account'}.`,
        email: targetEmail
      });
    } else if (errorCode === 'REGISTRATION_REJECTED') {
      setStatusInfo({
        type: 'rejected',
        message: data.message,
        refNumber: data.reference_number,
        email: targetEmail
      });
    } else {
      setStatusInfo({
        type: 'error',
        message: data.message || 'Unable to sign in with Google. Please verify your credentials or permissions.'
      });
    }
  };

  // Launch official Google OAuth account chooser with prompt=select_account
  const handleGoogleSignIn = () => {
    if (!window.google?.accounts?.oauth2) {
      handleAuthError({ 
        response: { 
          data: { 
            message: 'Google Sign-In service is loading. Please wait a moment and try again.' 
          } 
        } 
      });
      return;
    }

    setLoading(true);
    setStatusInfo(null);

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        prompt: 'select_account', // Forces Google to show all accounts and "+ Use another account"
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setLoading(false);
            if (tokenResponse.error !== 'access_denied') {
              handleAuthError({ 
                response: { 
                  data: { 
                    message: `Google Sign-In encountered an issue: ${tokenResponse.error}` 
                  } 
                } 
              });
            }
            return;
          }

          try {
            const res = await api.post('/auth/google', {
              access_token: tokenResponse.access_token,
            });
            handleAuthResponse(res.data);
          } catch (err) {
            handleAuthError(err);
          } finally {
            setLoading(false);
          }
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (e) {
      setLoading(false);
      handleAuthError({ response: { data: { message: e.message } } });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Google Branding */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                Sign in with Google
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Official Google Identity SSO
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* STATE 1: PENDING REGISTRATION */}
          {statusInfo?.type === 'pending' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <div className="flex items-center space-x-2.5 text-amber-800 font-bold text-sm mb-1.5">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Application Under Review</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed mb-2.5">
                  {statusInfo.message}
                </p>
                {statusInfo.refNumber && (
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100/70 border border-amber-300 rounded-lg text-xs font-mono font-bold text-amber-900">
                    <span>Reference #:</span>
                    <span>{statusInfo.refNumber}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <button
                  type="button"
                  onClick={() => onCheckStatus && onCheckStatus(statusInfo.refNumber)}
                  className="w-full py-3 bg-[#182848] hover:bg-[#111d35] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <FileSearch className="w-4 h-4" />
                  <span>Track Application Status</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Choose another account
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: NOT FOUND -> GUIDE TO REGISTRATION */}
          {statusInfo?.type === 'not_found' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="flex items-center space-x-2.5 text-blue-900 font-bold text-sm mb-1.5">
                  <UserPlus className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Account Not Registered</span>
                </div>
                <p className="text-xs text-blue-900/90 leading-relaxed">
                  {statusInfo.message}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <button
                  type="button"
                  onClick={() => onSwitchToRegister && onSwitchToRegister()}
                  className="w-full py-3 bg-[#182848] hover:bg-[#111d35] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register as Student Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Choose another account
                </button>
              </div>
            </div>
          )}

          {/* STATE 3: REJECTED REGISTRATION */}
          {statusInfo?.type === 'rejected' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                <div className="flex items-center space-x-2.5 text-rose-800 font-bold text-sm mb-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>Registration Not Approved</span>
                </div>
                <p className="text-xs text-rose-900/90 leading-relaxed">
                  {statusInfo.message}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <button
                  type="button"
                  onClick={() => onCheckStatus && onCheckStatus(statusInfo.refNumber)}
                  className="w-full py-3 bg-[#182848] hover:bg-[#111d35] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <FileSearch className="w-4 h-4" />
                  <span>View Details & Remarks</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Choose another account
                </button>
              </div>
            </div>
          )}

          {/* STATE 4: SELECT ACCOUNT BUTTON */}
          {(!statusInfo || statusInfo.type === 'error') && (
            <div className="space-y-5 text-center py-2">
              {statusInfo?.type === 'error' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-700 text-left">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{statusInfo.message}</span>
                </div>
              )}

              <p className="text-xs text-slate-600 font-medium">
                Click below to select any of your Google accounts or sign in with another:
              </p>

              {/* CUSTOM GOOGLE SIGN-IN BUTTON THAT ALWAYS PROMPTS SELECT_ACCOUNT */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 rounded-2xl font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center justify-center space-x-3 cursor-pointer group disabled:opacity-50"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>{loading ? 'Opening Google Account Chooser...' : 'Choose Google Account'}</span>
              </button>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure institutional OAuth 2.0</span>
          </div>
          <span className="text-slate-400">ABC School Portal</span>
        </div>
      </div>
    </div>
  );
}
