import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (onLogin) {
        onLogin(response.data.user);
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

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundImage: `url('/bg-campus.jpeg')` }}
    >
      {/* Dark overlay for better contrast */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#111111]/0 to-[#111111]"></div>

      {/* Main Glass Container */}
      <div className="relative w-full max-w-[1000px] md:w-[100%] md:max-w-[1200px] min-h-[600px] bg-[#E8EEF2]/85 backdrop-blur-xl rounded-[2rem] shadow-2xl flex flex-col md:flex-row border border-white/40  mt-20 md:ml-12 md:mr-12">
        
        {/* Left Side: Login Form */}
        <div className="w-full md:w-[55%] p-8 sm:p-12 lg:p-16 flex flex-col relative md:flex-[1]">
          
          {/* Logo */}
          <div className="flex items-center justify-center mb-8 absolute bottom-[86%] lg:bottom-[84%] left-[50%] translate-x-[-50%] md:w-[40%]">
            <img src='/main_logo.png' alt='ABC School Logo' className='max-w-[70%]'/>
          </div>

          <div className="text-center mt-5 md:mt-2 mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600 font-medium">Sign in to your ABC School account</p>
          </div>

          {error && (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-2xl bg-red-50 border border-red-200" role="alert">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col space-y-4" autoComplete="off">
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                className="w-full px-5 py-4 bg-white border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium"
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
                className="w-full px-5 py-4 bg-white border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium pr-16"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="flex items-center justify-center space-x-4 my-6 py-2">
              <div className="h-px bg-gray-500 flex-1"></div>
              <span className="text-gray-500 font-medium text-sm">or</span>
              <div className="h-px bg-gray-500 flex-1"></div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center space-x-3 px-5 py-3.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-bold text-gray-700">Sign in with Google</span>
            </button>

            <div className="flex items-center pt-2 pb-4">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-[#182848] border-gray-300 rounded focus:ring-[#182848]"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600 font-medium">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#182848] hover:bg-[#111d35] text-white rounded-[1.5rem] font-bold text-[17px] shadow-md transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div className="text-center pt-4">
              <a href="#" className="text-sm font-bold text-[#182848] hover:underline">
                Forgot Password?
              </a>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-auto pt-10 text-center">
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
              ABC School Student Portal v0.0.0 &copy; 2026
            </p>
          </div>
        </div>

        {/* Right Side: Graphic Poster */}
        <div className="hidden lg:block w-[45%] relative md:flex-[1.2]">
          <div className=" rounded-[2rem] overflow-hidden shadow-[10px_10px_10px_0px_rgba(0,0,0,0.25)] absolute bottom-10 mr-5">
            <img 
              src="/auth-graphic.png" 
              alt="Truth and Wisdom" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
