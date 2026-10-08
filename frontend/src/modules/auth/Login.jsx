import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import StudentRegisterForm from './StudentRegisterForm';
import RegistrationStatusModal from './RegistrationStatusModal';
import FirstTimePasswordModal from './FirstTimePasswordModal';
import GoogleAuthModal from './GoogleAuthModal';
import ForgotPasswordModal from './ForgotPasswordModal';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: Sign In vs Student Registration
  const [isRegister, setIsRegister] = useState(location.pathname === '/register');

  useEffect(() => {
    setIsRegister(location.pathname === '/register');
  }, [location.pathname]);

  const toggleMode = (registerMode) => {
    setIsRegister(registerMode);
    if (registerMode) {
      navigate('/register', { replace: true });
    } else {
      navigate('/auth', { replace: true });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const savedUsername = localStorage.getItem('scisp_remembered_username') || '';
  const [username, setUsername] = useState(savedUsername);
  const [rememberMe, setRememberMe] = useState(Boolean(savedUsername));
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Status check modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusQuery, setStatusQuery] = useState('');

  // Google OAuth modal
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // First-time password modal
  const [firstTimeUser, setFirstTimeUser] = useState(null);

  // Forgot password modal & reset link parameters
  const searchParams = new URLSearchParams(location.search);
  const isDirectReset = searchParams.get('action') === 'reset-password';
  const urlResetToken = searchParams.get('token') || '';
  const urlResetEmail = searchParams.get('email') || '';

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(
    isDirectReset && (urlResetToken !== '' || urlResetEmail !== '')
  );
  const [resetEmail, setResetEmail] = useState(urlResetEmail);
  const [resetToken, setResetToken] = useState(urlResetToken);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      const user = response.data.user;
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem('scisp_remembered_username', username.trim());
      } else {
        localStorage.removeItem('scisp_remembered_username');
      }

      // If user must change password upon first login, prompt modal
      if (user?.must_change_password) {
        setFirstTimeUser(user);
        return;
      }

      if (onLogin) {
        onLogin(user);
      }

      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (user) => {
    if (user?.must_change_password) {
      setFirstTimeUser(user);
      return;
    }
    if (onLogin) {
      onLogin(user);
    }
    navigate('/');
  };

  const handlePasswordSet = (updatedUser) => {
    setFirstTimeUser(null);
    if (onLogin) {
      onLogin(updatedUser);
    }
    navigate('/');
  };

  const openStatusCheck = (refCode = '') => {
    setStatusQuery(refCode);
    setIsStatusModalOpen(true);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-start lg:justify-center items-center p-4 sm:p-6 lg:p-8 overflow-y-auto"
      style={{ backgroundImage: `url('/bg-campus.jpeg')` }}
    >
      {/* Dark overlay for better contrast */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#111111]/30 via-[#111111]/70 to-[#111111]/90 backdrop-blur-[2px]"></div>

      {/* Main Glass Container */}
      <div className="relative w-full max-w-[1000px] lg:w-[100%] lg:max-w-[1200px] min-h-0 lg:min-h-[660px] py-6 sm:py-8 lg:py-10 bg-[#E8EEF2]/85 backdrop-blur-xl rounded-[2rem] shadow-2xl flex flex-col lg:flex-row border border-white/40 mt-16 sm:mt-20 my-6 lg:my-0 lg:ml-12 lg:mr-12">

        {/* MOBILE SEGMENTED TOGGLE (< lg screens) */}
        <div className="lg:hidden w-full px-4 sm:px-6 pt-2 pb-4 z-20">
          <div className="flex bg-slate-200/90 p-1.5 rounded-2xl max-w-sm mx-auto shadow-inner border border-white/60">
            <button
              type="button"
              onClick={() => toggleMode(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${!isRegister
                ? 'bg-[#182848] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => toggleMode(true)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isRegister
                ? 'bg-[#80172B] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Register as Student
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FORM 1: SIGN IN (Left Half)                                               */}
        {/* ========================================================================= */}
        <div
          className={`
            w-full lg:w-1/2 p-5 sm:p-8 lg:p-12 flex flex-col justify-start lg:justify-center overflow-visible
            lg:absolute lg:top-0 lg:left-0 lg:h-full lg:transition-all lg:duration-700 lg:ease-in-out
            ${isRegister
              ? 'hidden lg:flex lg:opacity-0 lg:pointer-events-none lg:z-10'
              : 'flex lg:opacity-100 lg:pointer-events-auto lg:z-20'
            }
          `}
        >
          {/* Floating Logo */}
          <div className="flex items-center justify-center mb-6 lg:mb-8 absolute -top-16 sm:-top-20 lg:-top-[5.5rem] left-1/2 -translate-x-1/2 w-[35%] max-w-[140px] sm:max-w-[180px] pointer-events-none">
            <img src="/main_logo.png" alt="ABC School Logo" className="w-full object-contain" />
          </div>

          <div className="text-center mb-5">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Welcome Back</h1>
            <p className="text-gray-600 font-medium text-sm">Sign in to your ABC School account</p>
          </div>

          {error && (
            <div className="p-3.5 mb-4 text-xs sm:text-sm text-red-800 rounded-2xl bg-red-50 border border-red-200" role="alert">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col space-y-3.5" autoComplete="off">
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium text-sm"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium text-sm pr-16"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 font-bold"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="flex items-center justify-center space-x-3 my-2 py-0.5">
              <div className="h-px bg-gray-400 flex-1"></div>
              <span className="text-gray-500 font-medium text-xs">or</span>
              <div className="h-px bg-gray-400 flex-1"></div>
            </div>

            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full flex items-center justify-center space-x-3 px-5 py-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-bold text-gray-700 text-xs sm:text-sm">Sign in with Google</span>
            </button>

            <div className="flex items-center justify-between pt-1 pb-1">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setRememberMe(isChecked);
                    if (!isChecked) {
                      localStorage.removeItem('scisp_remembered_username');
                    }
                  }}
                  className="w-4 h-4 text-[#182848] border-gray-300 rounded focus:ring-[#182848] cursor-pointer"
                />
                <span className="ml-2 text-xs text-gray-600 font-medium">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-xs font-bold text-[#182848] hover:underline cursor-pointer bg-transparent border-none p-0 focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#182848] hover:bg-[#111d35] text-white rounded-[1.5rem] font-bold text-sm shadow-md transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

            {/* Quick switch to register on mobile (< lg) */}
            <div className="lg:hidden text-center pt-3 pb-1">
              <p className="text-xs text-slate-600 font-medium">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => toggleMode(true)}
                  className="font-bold text-[#80172B] hover:underline cursor-pointer"
                >
                  Register as Student
                </button>
              </p>
            </div>

          {/* Footer */}
          <div className="pt-4 text-center mt-1">
            <p className="text-[11px] text-gray-500 font-medium">
              ABC School Student Portal v0.0.0 &copy; 2026
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FORM 2: STUDENT REGISTRATION (Right Half)                                 */}
        {/* ========================================================================= */}
        <div
          className={`
            w-full lg:w-1/2 p-5 sm:p-8 lg:p-12 flex flex-col justify-start lg:justify-center overflow-visible
            lg:absolute lg:top-0 lg:right-0 lg:h-full lg:transition-all lg:duration-700 lg:ease-in-out
            ${isRegister
              ? 'flex lg:opacity-100 lg:pointer-events-auto lg:z-20'
              : 'hidden lg:flex lg:opacity-0 lg:pointer-events-none lg:z-10'
            }
          `}
        >
          {/* Floating Logo on Registration Form */}
          <div className="flex items-center justify-center mb-6 lg:mb-8 absolute -top-16 sm:-top-20 lg:-top-[5.5rem] left-1/2 -translate-x-1/2 w-[35%] max-w-[140px] sm:max-w-[180px] pointer-events-none">
            <img src="/main_logo.png" alt="ABC School Logo" className="w-full object-contain" />
          </div>

          <div className="text-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
              Student Registration
            </h1>
            <p className="text-xs text-gray-600 font-medium">
              Complete the 3 sections to submit your registration
            </p>
          </div>

          <StudentRegisterForm
            onBackToLogin={() => toggleMode(false)}
            onOpenStatusCheck={openStatusCheck}
          />
        </div>

        {/* ========================================================================= */}
        {/* SLIDING GRAPHIC POSTER PANEL (Desktop >= lg)                              */}
        {/* ========================================================================= */}
        <div
          className={`
            hidden lg:block absolute -top-16 bottom-4 w-[43%] z-30
            transition-all duration-700 ease-in-out
            ${isRegister ? 'left-5' : 'left-[53%] translate-x-2'}
          `}
        >
          <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-[10px_10px_10px_0px_rgba(0,0,0,0.25)]">
            <img
              src="/auth-graphic.png"
              alt="Truth and Wisdom"
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {/* REGISTER AS STUDENT / SIGN IN Action Button */}
            <div className="absolute bottom-6 inset-x-0 flex justify-center z-20 px-6">
              <button
                type="button"
                onClick={() => toggleMode(!isRegister)}
                className="w-auto min-w-[220px] px-8 py-3.5 border-2 border-white text-white bg-black/40 hover:bg-white hover:text-[#182848] rounded-full font-bold text-xs uppercase tracking-widest backdrop-blur-md transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.5)] active:scale-95 cursor-pointer text-center"
              >
                {isRegister ? 'Sign In' : 'Register as Student'}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Application Status Query Modal */}
      <RegistrationStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        initialQuery={statusQuery}
      />

      {/* Mandatory First-Time Login Password Change Modal */}
      <FirstTimePasswordModal
        isOpen={!!firstTimeUser}
        user={firstTimeUser}
        onPasswordSet={handlePasswordSet}
        onClose={() => setFirstTimeUser(null)}
      />

      {/* Google OAuth & Account Selector Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onLoginSuccess={handleGoogleSuccess}
        onSwitchToRegister={() => {
          setIsGoogleModalOpen(false);
          toggleMode(true);
        }}
        onCheckStatus={(refCode) => {
          setIsGoogleModalOpen(false);
          openStatusCheck(refCode);
        }}
      />

      {/* Forgot Password Recovery Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => {
          setIsForgotPasswordOpen(false);
          setResetEmail('');
          setResetToken('');
        }}
        onSuccess={(recoveredUsername) => {
          if (recoveredUsername) {
            setUsername(recoveredUsername);
          }
        }}
        initialEmail={resetEmail}
        initialToken={resetToken}
      />
    </div>
  );
}
