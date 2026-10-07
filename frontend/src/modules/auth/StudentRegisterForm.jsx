import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Copy, 
  Check,
  Search
} from 'lucide-react';
import api from '../../services/api';

export default function StudentRegisterForm({ onBackToLogin, onOpenStatusCheck }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form State across all 3 Sections
  const [formData, setFormData] = useState({
    // Section 1: Personal Details
    first_name: '',
    middle_name: '',
    last_name: '',
    birthdate: '',
    gender: 'Male',

    // Section 2: Academic Information
    program: 'BS Information Technology',
    year_level: '1st Year',
    previous_school: '',
    student_id_number: '',

    // Section 3: Contact & Delivery
    email: '',
    contact_number: '',
    home_address: '',
  });

  const programs = [
    'BS Information Technology',
    'BS Computer Science',
    'BS Information Systems',
    'BS Computer Engineering',
    'BS Business Administration',
    'BS Accountancy',
    'BS Hospitality Management',
    'Bachelor of Elementary Education',
    'Bachelor of Secondary Education',
  ];

  const yearLevels = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    'Transferee / Irregular',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.first_name.trim()) return 'Please enter your first name.';
      if (!formData.last_name.trim()) return 'Please enter your last name.';
      if (!formData.birthdate) return 'Please select your birthdate.';
    } else if (currentStep === 2) {
      if (!formData.program) return 'Please select your degree program.';
      if (!formData.year_level) return 'Please select your year level.';
    } else if (currentStep === 3) {
      if (!formData.email.trim()) return 'Please enter your email address.';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) return 'Please enter a valid email address.';
      if (!formData.contact_number.trim()) return 'Please enter your contact phone number.';
    }
    return null;
  };

  const handleNext = () => {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setError('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateStep(3);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', formData);
      setSubmittedData(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to submit registration. Please check your information and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReference = () => {
    if (submittedData?.reference_no) {
      navigator.clipboard.writeText(submittedData.reference_no);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // SUCCESS SUBMISSION SCREEN
  if (submittedData) {
    return (
      <div className="space-y-6 text-center py-4 animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Registration Submitted!
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your registration application has been received and queued for school administrator review.
          </p>
        </div>

        {/* Reference Code Callout */}
        <div className="bg-white/90 border border-slate-200 rounded-2xl p-5 shadow-sm max-w-md mx-auto text-left space-y-3">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Application Reference Code
          </div>
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <span className="font-mono font-black text-lg text-[#182848]">
              {submittedData.reference_no}
            </span>
            <button
              type="button"
              onClick={handleCopyReference}
              className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please keep this reference code safe. You will receive an official notification at <strong>{submittedData.email}</strong> once your account is reviewed. If accepted, your email will contain your login credentials.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full sm:w-auto px-6 py-3 bg-[#182848] hover:bg-[#111d35] text-white rounded-xl font-bold text-sm shadow-md transition-all"
          >
            Back to Sign In
          </button>
          <button
            type="button"
            onClick={() => onOpenStatusCheck(submittedData.reference_no)}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-sm shadow-sm transition-all"
          >
            Track Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 3-Section Stepper Progress Header */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-3 gap-2 text-xs font-bold text-left">
          <span className={`truncate ${step >= 1 ? 'text-[#182848]' : 'text-slate-400'}`}>
            1. Personal Details
          </span>
          <span className={`truncate ${step >= 2 ? 'text-[#182848]' : 'text-slate-400'}`}>
            2. Academic Info
          </span>
          <span className={`truncate ${step >= 3 ? 'text-[#182848]' : 'text-slate-400'}`}>
            3. Contact &amp; Delivery
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className={`h-2 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-[#182848]' : 'bg-slate-200'}`} />
          <div className={`h-2 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-[#182848]' : 'bg-slate-200'}`} />
          <div className={`h-2 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-[#182848]' : 'bg-slate-200'}`} />
        </div>
      </div>

      {error && (
        <div className="p-3.5 text-xs text-red-800 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ========================================================================= */}
        {/* SECTION 1: PERSONAL DETAILS                                               */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-200/80 pb-2">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#182848]" />
                <span>Section 1: Applicant Information</span>
              </h3>
              <p className="text-xs text-slate-500">Enter your full legal name and birthdate</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="e.g. Maria"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Middle Name (Optional)
                </label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  placeholder="e.g. Santos"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="e.g. Dela Cruz"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: ACADEMIC INFORMATION                                          */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-200/80 pb-2">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#182848]" />
                <span>Section 2: Academic Program &amp; Placement</span>
              </h3>
              <p className="text-xs text-slate-500">Select your intended program and enrollment standing</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Degree Program / Strand <span className="text-red-500">*</span>
              </label>
              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium"
                required
              >
                {programs.map((prog) => (
                  <option key={prog} value={prog}>{prog}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Year Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="year_level"
                  value={formData.year_level}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium"
                  required
                >
                  {yearLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Previous School / High School
                </label>
                <input
                  type="text"
                  name="previous_school"
                  value={formData.previous_school}
                  onChange={handleChange}
                  placeholder="e.g. ABC National High School"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Existing Student ID / Admission Slip # (Optional)
              </label>
              <input
                type="text"
                name="student_id_number"
                value={formData.student_id_number}
                onChange={handleChange}
                placeholder="e.g. 2026-00421"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium"
              />
              <span className="text-[11px] text-slate-500">
                Leave blank if this is your first time enrolling with ABC School.
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: CONTACT & CREDENTIAL DELIVERY                                  */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-200/80 pb-2">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#182848]" />
                <span>Section 3: Contact &amp; Account Delivery</span>
              </h3>
              <p className="text-xs text-slate-500">
                Your portal username &amp; temporary password will be sent to this email
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="yourname@gmail.com"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium"
                required
              />
              <span className="text-[11px] text-slate-500">
                Make sure this is an active email account that you can access immediately.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  placeholder="e.g. 09171234567"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City / Residential Address
                </label>
                <input
                  type="text"
                  name="home_address"
                  value={formData.home_address}
                  onChange={handleChange}
                  placeholder="e.g. Quezon City, Metro Manila"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#182848] focus:border-transparent font-medium"
                />
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
              <span className="font-bold">Next Steps After Submission:</span>
              <p className="text-amber-800/90 text-[11px] leading-relaxed">
                1. School administrators verify your submitted records.<br />
                2. Upon acceptance, an automated email with your official <strong>Username</strong> and <strong>Temporary Password</strong> will be dispatched to <strong>{formData.email || 'your email'}</strong>.<br />
                3. You will be required to set a permanent password upon first login.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenStatusCheck()}
              className="text-xs font-bold text-[#182848] hover:underline flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Check Application Status</span>
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 bg-[#182848] hover:bg-[#6b1424] text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <span>Next: Section {step + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#182848] hover:bg-[#6b1424] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span>Submit Registration</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
