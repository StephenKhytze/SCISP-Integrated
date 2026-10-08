import React from 'react';
import { X, ShieldAlert, Mail, Phone, MapPin } from 'lucide-react';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <ShieldAlert className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                Password Recovery
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Security Policy Enforcement
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
            For security reasons, self-service password resets are disabled for student and faculty accounts. To recover or reset your password, please contact the IT Administration Office through any of the following channels:
          </p>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Mail className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-700">it-support@abc.edu.ph</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Phone className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-700">(02) 8123-4567 loc 101</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <MapPin className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-700">IT Office, 3rd Floor, Main Bldg</span>
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 bg-[#182848] hover:bg-[#111d35] text-white rounded-xl font-bold text-sm shadow-md transition-all"
            >
              Understood, Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
