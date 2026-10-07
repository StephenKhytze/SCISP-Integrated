import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Calendar, 
  Megaphone, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  Server, 
  ShieldCheck, 
  Database, 
  FileCheck, 
  Layers, 
  Activity,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  
  // Retrieve user from Outlet context or fallback to localStorage or default
  const storedUser = (() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  const currentUser = outletContext?.user || storedUser || {
    name: 'Juan Dela Cruz',
    role: 'Student',
    department: 'College of Computer Studies',
    idNumber: '2023-00123'
  };

  // Normalize role string (case-insensitive)
  const roleRaw = (currentUser?.role || '').toLowerCase();
  
  const isTeacher = roleRaw === 'teacher' || roleRaw === 'faculty' || roleRaw === 'instructor';
  const isAdmin = roleRaw === 'admin' || roleRaw === 'administrator';
  const isSuperAdmin = roleRaw === 'superadmin' || roleRaw === 'super admin';
  const isStudent = !isTeacher && !isAdmin && !isSuperAdmin;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* ========================================================================= */}
      {/* 1. STUDENT DASHBOARD (RED THEME)                                          */}
      {/* ========================================================================= */}
      {isStudent && (
        <>
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#6b1424] via-[#5c101e] to-[#450a14] text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
                Welcome Back, {currentUser?.name || 'Juan Dela Cruz'}!
              </h1>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed font-normal">
                Welcome to your ABC School student hub for AY 2024-2025 First Semester. Track your daily class schedules, stay informed with official announcements, and explore digital library resources all in one place.
              </p>
            </div>
            {/* Subtle background decoration */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* 4 Metric / Info Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Card 1: TODAY'S CLASSES (Clickable -> Redirects to /schedule) */}
            <div 
              onClick={() => navigate('/schedule')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/schedule')}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:border-[#80172B] transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider group-hover:text-[#80172B] transition-colors">
                  TODAY'S CLASSES
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#fcedf0] group-hover:bg-[#80172B] flex items-center justify-center text-[#80172B] group-hover:text-white flex-shrink-0 transition-colors duration-200">
                  <Calendar className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  4 Subjects
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#80172B]" />
                <span>Next: <strong className="text-slate-800 font-bold">IT 311 (8:00 AM)</strong></span>
              </div>
            </div>

            {/* Card 2: ANNOUNCEMENTS (Clickable -> Redirects to /announcements) */}
            <div 
              onClick={() => navigate('/announcements')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/announcements')}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:border-[#d97706] transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider group-hover:text-[#d97706] transition-colors">
                  ANNOUNCEMENTS
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#fef6e7] group-hover:bg-[#d97706] flex items-center justify-center text-[#d97706] group-hover:text-white flex-shrink-0 transition-colors duration-200">
                  <Megaphone className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  3 Notices
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-[#b45309] font-bold">
                <FileText className="w-3.5 h-3.5 text-[#b45309]" />
                <span>1 Urgent Announcement</span>
              </div>
            </div>

            {/* Card 3: LIBRARY BOOKS (Clickable -> Redirects to /library) */}
            <div 
              onClick={() => navigate('/library')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/library')}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:border-[#2563eb] transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider group-hover:text-[#2563eb] transition-colors">
                  LIBRARY BOOKS
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#eaf3ff] group-hover:bg-[#2563eb] flex items-center justify-center text-[#2563eb] group-hover:text-white flex-shrink-0 transition-colors duration-200">
                  <BookOpen className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  1 Borrowed
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-[#2563eb] font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Due in 13 days</span>
              </div>
            </div>

            {/* Card 4: ACADEMIC STANDING (NOT Clickable, but has matching hover style) */}
            <div 
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:border-[#059669] transition-all duration-200 cursor-default flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider group-hover:text-[#059669] transition-colors">
                  ACADEMIC STANDING
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#e8f8f0] group-hover:bg-[#059669] flex items-center justify-center text-[#059669] group-hover:text-white flex-shrink-0 transition-colors duration-200">
                  <GraduationCap className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  1.25 GPA
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-[#059669] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>Dean's List • Good Standing</span>
              </div>
            </div>

          </div>

          {/* Bottom Container: Today's Class Schedule */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Today's Class Schedule
              </h2>
              <button 
                onClick={() => navigate('/schedule')}
                className="text-xs sm:text-sm font-bold text-[#80172B] hover:text-[#5c101e] hover:underline transition-colors cursor-pointer"
              >
                Full Schedule
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Class Schedule Item 1 */}
              <div 
                onClick={() => navigate('/schedule')}
                className="bg-[#fcfdfd] border border-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/90 hover:border-slate-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="bg-[#80172B] text-white font-extrabold text-xs sm:text-sm px-3 py-2 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    IT 311
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#80172B] transition-colors leading-snug">
                      Web Development with React &amp; Laravel
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Engr. M. Santos - Lab 402 Tech Building
                    </p>
                  </div>
                </div>
                <div className="self-start sm:self-center">
                  <span className="inline-block px-3.5 py-1.5 rounded-full border border-rose-200 text-[#80172B] text-xs font-bold bg-white shadow-2xs">
                    08:00 - 10:30 am
                  </span>
                </div>
              </div>

              {/* Class Schedule Item 2 */}
              <div 
                onClick={() => navigate('/schedule')}
                className="bg-[#fcfdfd] border border-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/90 hover:border-slate-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="bg-[#80172B] text-white font-extrabold text-xs sm:text-sm px-3 py-2 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    IT 311
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#80172B] transition-colors leading-snug">
                      Web Development with React &amp; Laravel
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Engr. M. Santos - Lab 402 Tech Building
                    </p>
                  </div>
                </div>
                <div className="self-start sm:self-center">
                  <span className="inline-block px-3.5 py-1.5 rounded-full border border-rose-200 text-[#80172B] text-xs font-bold bg-white shadow-2xs">
                    08:00 - 10:30 am
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. ADMIN DASHBOARD (YELLOW / AMBER / BROWN THEME - IMAGE 4)              */}
      {/* ========================================================================= */}
      {isAdmin && (
        <>
          {/* Admin Hero Banner */}
          <div className="bg-gradient-to-r from-[#803d0c] via-[#6f3308] to-[#4d2203] text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg relative overflow-hidden">
            <div className="relative z-10 space-y-4 max-w-4xl">
              <div className="inline-flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-400/20 border border-amber-300/30 rounded-lg text-[10px] sm:text-xs font-extrabold text-amber-200 uppercase tracking-wider">
                  ACADEMIC AFFAIRS &amp; DEPARTMENT ADMIN CONSOLE • Office of the Dean
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Welcome Back, {currentUser?.name || 'Dr. Alejandro Reyes'}!
              </h1>
              <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed font-normal">
                You are currently viewing the <span className="text-amber-300 font-bold underline decoration-amber-400/60">Academic Admin Perspective</span>. Oversee department curriculum structures, faculty teaching load distribution, student enlistment overrides, and academic circular approvals.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button 
                  type="button"
                  className="px-4 py-2.5 bg-[#E5A93C] text-slate-950 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-sm cursor-default"
                >
                  <BookOpen className="w-4 h-4 text-slate-950" />
                  <span>Open Library &amp; Inventory Station</span>
                </button>
                <button 
                  type="button"
                  className="px-4 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-sm cursor-default"
                >
                  <Users className="w-4 h-4 text-slate-700" />
                  <span>Faculty Load Matrix</span>
                </button>
                <button 
                  type="button"
                  className="px-4 py-2.5 bg-black/25 text-white border border-white/30 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 cursor-default"
                >
                  <FileText className="w-4 h-4 text-amber-200" />
                  <span>Publish Academic Circular</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 Metric Cards for Admin (View Only / Non-Clickable with hover visual effects) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Card 1: TOTAL DEPT ENROLLEES */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:border-emerald-600 transition-all duration-200 cursor-default flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                  TOTAL DEPT ENROLLEES
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 flex items-center justify-center text-emerald-600 group-hover:text-white flex-shrink-0 transition-colors duration-200">
                  <TrendingUp className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  1,280 Students
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-bold">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>+4.2% Year-over-Year</span>
              </div>
            </div>

            {/* Card 2: ACTIVE FACULTY MEMBERS */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:border-blue-600 transition-all duration-200 cursor-default flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                  ACTIVE FACULTY MEMBERS
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center text-blue-600 group-hover:text-white flex-shrink-0 transition-colors duration-200">
                  <Users className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  48 Instructors
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-blue-600 font-medium">
                <span>Full-Time &amp; Industry Adjuncts</span>
              </div>
            </div>

            {/* Card 3: SECTION CAPACITY LOAD */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:border-indigo-600 transition-all duration-200 cursor-default flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                  SECTION CAPACITY LOAD
                </span>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 flex items-center justify-center text-indigo-600 group-hover:text-white flex-shrink-0 transition-colors duration-200">
                  <Layers className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  94.2% Filled
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-indigo-600 font-medium">
                <span>38 Open Sections Active</span>
              </div>
            </div>

            {/* Card 4: ENLISTMENT OVERRIDES */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:border-rose-600 transition-all duration-200 cursor-default flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider group-hover:text-rose-600 transition-colors">
                  ENLISTMENT OVERRIDES
                </span>
                <div className="w-10 h-10 rounded-xl bg-rose-50 group-hover:bg-rose-600 flex items-center justify-center text-rose-600 group-hover:text-white flex-shrink-0 transition-colors duration-200">
                  <AlertCircle className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-rose-700 tracking-tight">
                  6 Pending Requests
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-rose-600 font-medium">
                <span>Prerequisite Waivers</span>
              </div>
            </div>

          </div>

          {/* Bottom Container: Approval Queue */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Academic Administrative Approval Queue
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Prerequisite waivers, section expansions &amp; schedule revisions
                </p>
              </div>
              <div className="self-start sm:self-center">
                <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-full">
                  6 Action Items
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Queue Item 1 */}
              <div className="bg-amber-50/20 border border-amber-200/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 bg-amber-100/90 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                    PREREQUISITE OVERRIDE
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Maria Santos (2023-00912)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Requesting waiver for IT 311 (Prereq: CS 101 passed)
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button 
                    type="button" 
                    className="px-4 py-1.5 bg-[#007A5A] text-white text-xs font-bold rounded-lg hover:bg-[#00664a] transition-colors cursor-default"
                  >
                    Approve
                  </button>
                  <button 
                    type="button" 
                    className="px-4 py-1.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors cursor-default"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Queue Item 2 */}
              <div className="bg-amber-50/20 border border-amber-200/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 bg-amber-100/90 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                    SECTION EXPANSION
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    BSIT 3-A Committee
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Expand section capacity from 40 to 45 seats for DB 301
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button 
                    type="button" 
                    className="px-4 py-1.5 bg-[#007A5A] text-white text-xs font-bold rounded-lg hover:bg-[#00664a] transition-colors cursor-default"
                  >
                    Approve
                  </button>
                  <button 
                    type="button" 
                    className="px-4 py-1.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors cursor-default"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. TEACHER DASHBOARD (BLUE THEME)                                         */}
      {/* ========================================================================= */}
      {isTeacher && (
        <>
          {/* Teacher Hero Banner */}
          <div className="bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-[#0f2864] text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg relative overflow-hidden">
            <div className="relative z-10 space-y-4 max-w-4xl">
              <div className="inline-flex items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-300/20 border border-blue-200/30 rounded-lg text-[10px] sm:text-xs font-extrabold text-blue-200 uppercase tracking-wider">
                  FACULTY INSTRUCTION &amp; ADVISING PORTAL • College of Computer Studies
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Welcome Back, {currentUser?.name || 'Prof. Maria Santos'}!
              </h1>
              <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed font-normal">
                You are currently viewing the <span className="text-blue-200 font-bold underline decoration-blue-300/60">Faculty Perspective</span>. Manage class rosters, record semester grading milestones, view student consultations, and track curriculum syllabus coverage.
              </p>
              
              {/* Action Badges */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button 
                  type="button"
                  className="px-4 py-2.5 bg-blue-100 text-blue-950 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-sm cursor-default"
                >
                  <FileCheck className="w-4 h-4 text-blue-900" />
                  <span>Open Gradebook Console</span>
                </button>
                <button 
                  type="button"
                  className="px-4 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-sm cursor-default"
                >
                  <Users className="w-4 h-4 text-blue-700" />
                  <span>Student Consultation Queue</span>
                </button>
                <button 
                  type="button"
                  className="px-4 py-2.5 bg-black/25 text-white border border-white/30 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 cursor-default"
                >
                  <Layers className="w-4 h-4 text-blue-200" />
                  <span>Submit Course Syllabus</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 Metric Cards for Teacher (View Only / Non-Clickable with hover visual effects) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Card 1: ASSIGNED SECTIONS */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:border-blue-600 transition-all duration-200 cursor-default flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                  ASSIGNED SECTIONS
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center text-blue-600 group-hover:text-white flex-shrink-0 transition-colors duration-200">
                  <Calendar className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  5 Classes
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-blue-700 font-bold">
                <Clock className="w-3.5 h-3.5 text-blue-700" />
                <span>Next: IT 311 (8:00 AM)</span>
              </div>
            </div>

            {/* Card 2: STUDENT ADVISEES */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:border-purple-600 transition-all duration-200 cursor-default flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider group-hover:text-purple-600 transition-colors">
                  STUDENT ADVISEES
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 group-hover:bg-purple-600 flex items-center justify-center text-purple-600 group-hover:text-white flex-shrink-0 transition-colors duration-200">
                  <Users className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  34 Students
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-purple-700 font-medium">
                <span>4 Consultations Booked</span>
              </div>
            </div>

            {/* Card 3: GRADING SUBMISSIONS */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:border-amber-600 transition-all duration-200 cursor-default flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider group-hover:text-amber-600 transition-colors">
                  GRADING SUBMISSIONS
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-amber-600 flex items-center justify-center text-amber-600 group-hover:text-white flex-shrink-0 transition-colors duration-200">
                  <FileCheck className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-amber-800 tracking-tight">
                  28 Pending
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-amber-700 font-medium">
                <span>Midterm Projects to verify</span>
              </div>
            </div>

            {/* Card 4: SYLLABUS COVERAGE */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:border-emerald-600 transition-all duration-200 cursor-default flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                  SYLLABUS COVERAGE
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 flex items-center justify-center text-emerald-600 group-hover:text-white flex-shrink-0 transition-colors duration-200">
                  <CheckCircle2 className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                  88% On Track
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-medium">
                <span>Week 9 of 18 Complete</span>
              </div>
            </div>

          </div>

          {/* Bottom Container: Teacher Class Rosters & Schedule */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Faculty Teaching Schedule &amp; Class Rosters
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  AY 2024-2025 First Semester • Daily Class Schedule
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold rounded-full">
                3 Classes Today
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Teacher Class 1 */}
              <div className="bg-[#f8faff] border border-blue-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="bg-[#1E3A8A] text-white font-extrabold text-xs sm:text-sm px-3 py-2 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    IT 311
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      Web Development with React &amp; Laravel
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      BSIT 3-A • Lab 402 Tech Building (42 Students)
                    </p>
                  </div>
                </div>
                <div className="self-start sm:self-center">
                  <span className="inline-block px-3.5 py-1.5 rounded-full border border-blue-200 text-[#1E3A8A] text-xs font-bold bg-white shadow-2xs">
                    08:00 - 10:30 am
                  </span>
                </div>
              </div>

              {/* Teacher Class 2 */}
              <div className="bg-[#f8faff] border border-blue-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="bg-[#1E3A8A] text-white font-extrabold text-xs sm:text-sm px-3 py-2 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    CS 201
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      Data Structures &amp; Algorithms
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      BSCS 2-B • Room 305 Main Hall (38 Students)
                    </p>
                  </div>
                </div>
                <div className="self-start sm:self-center">
                  <span className="inline-block px-3.5 py-1.5 rounded-full border border-blue-200 text-[#1E3A8A] text-xs font-bold bg-white shadow-2xs">
                    11:00 - 01:00 pm
                  </span>
                </div>
              </div>

              {/* Teacher Class 3 */}
              <div className="bg-[#f8faff] border border-blue-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="bg-[#1E3A8A] text-white font-extrabold text-xs sm:text-sm px-3 py-2 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    IT 405
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      Systems Integration and Architecture
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      BSIT 4-A • Lab 405 Tech Building (35 Students)
                    </p>
                  </div>
                </div>
                <div className="self-start sm:self-center">
                  <span className="inline-block px-3.5 py-1.5 rounded-full border border-blue-200 text-[#1E3A8A] text-xs font-bold bg-white shadow-2xs">
                    02:00 - 04:30 pm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 4. SUPERADMIN DASHBOARD (DARK THEME)                                      */}
      {/* ========================================================================= */}
      {isSuperAdmin && (
        <>
          {/* Superadmin Dark Hero Banner */}
          <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#090d16] text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="relative z-10 space-y-4 max-w-4xl">
              <div className="inline-flex items-center gap-2">
                <span className="px-2.5 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-[10px] sm:text-xs font-extrabold text-cyan-300 uppercase tracking-wider">
                  CENTRAL SYSTEM INFRASTRUCTURE &amp; SECURITY • Master Console
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Welcome Back, {currentUser?.name || 'System Superadmin'}!
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                You are currently viewing the <span className="text-cyan-300 font-bold underline decoration-cyan-400/60">Superadmin Perspective</span>. Monitor system cluster health, database integrity, audit event streams, and global tenant security policies across all modules.
              </p>
              
              {/* Action Badges */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button 
                  type="button"
                  className="px-4 py-2.5 bg-cyan-400 text-slate-950 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-sm cursor-default"
                >
                  <Activity className="w-4 h-4 text-slate-950" />
                  <span>Audit Event Explorer</span>
                </button>
                <button 
                  type="button"
                  className="px-4 py-2.5 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-sm cursor-default"
                >
                  <Database className="w-4 h-4 text-cyan-300" />
                  <span>Database Replication Status</span>
                </button>
                <button 
                  type="button"
                  className="px-4 py-2.5 bg-black/40 text-white border border-slate-700 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 cursor-default"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>RBAC Role Matrix</span>
                </button>
              </div>
            </div>
            
            {/* Glowing ambient background glow */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* 4 Metric Cards for Superadmin (View Only / Non-Clickable with hover visual effects) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Card 1: ACTIVE SYSTEM SESSIONS */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800 hover:border-cyan-400 transition-all duration-200 cursor-default flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
                  ACTIVE SESSIONS
                </span>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-400 flex items-center justify-center text-cyan-400 group-hover:text-slate-950 flex-shrink-0 transition-colors duration-200">
                  <Server className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight">
                  3,412 Online
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                <span>Peak load 98.4% capacity</span>
              </div>
            </div>

            {/* Card 2: SERVICE HEALTH & UPTIME */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800 hover:border-emerald-400 transition-all duration-200 cursor-default flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
                  SERVICE UPTIME
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-400 flex items-center justify-center text-emerald-400 group-hover:text-slate-950 flex-shrink-0 transition-colors duration-200">
                  <Activity className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                  99.99%
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
                <span>12 Services Operational</span>
              </div>
            </div>

            {/* Card 3: SECURITY THREAT DETECTOR */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800 hover:border-purple-400 transition-all duration-200 cursor-default flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-wider group-hover:text-purple-400 transition-colors">
                  SECURITY SCAN
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 group-hover:bg-purple-400 flex items-center justify-center text-purple-400 group-hover:text-slate-950 flex-shrink-0 transition-colors duration-200">
                  <ShieldCheck className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-purple-300 tracking-tight">
                  0 Threats
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                <span>Last scan: 2 mins ago</span>
              </div>
            </div>

            {/* Card 4: STORAGE & DATABASE LOAD */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800 hover:border-blue-400 transition-all duration-200 cursor-default flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                  DATABASE LOAD
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 group-hover:bg-blue-400 flex items-center justify-center text-blue-400 group-hover:text-slate-950 flex-shrink-0 transition-colors duration-200">
                  <Database className="w-5 h-5 transition-colors duration-200" />
                </div>
              </div>
              <div className="mt-4 mb-3">
                <div className="text-2xl sm:text-3xl font-black text-blue-400 tracking-tight">
                  42.8 GB / 120 GB
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                <span>Postgres Pool Synced</span>
              </div>
            </div>

          </div>

          {/* Bottom Container: Telemetry & Cluster Status */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  System Audit Logs &amp; Live Service Status
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                  Real-time cluster telemetry, JWT auth-traffic &amp; database query health
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-full">
                100% Cluster Nominal
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Telemetry Item 1 */}
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="bg-cyan-500 text-slate-950 font-extrabold text-xs sm:text-sm px-3 py-2 rounded-xl flex items-center justify-center shrink-0 shadow-sm font-mono">
                    AUTH-GW-01
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
                      JWT Token Issuer &amp; Session Validator
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium">
                      Latency: 18ms • RPS: 480 req/s • Memory: 320 MB
                    </p>
                  </div>
                </div>
                <div className="self-start sm:self-center">
                  <span className="inline-block px-3.5 py-1.5 rounded-full border border-emerald-500/40 text-emerald-400 text-xs font-bold bg-emerald-950/40">
                    200 OK (Healthy)
                  </span>
                </div>
              </div>

              {/* Telemetry Item 2 */}
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="bg-cyan-500 text-slate-950 font-extrabold text-xs sm:text-sm px-3 py-2 rounded-xl flex items-center justify-center shrink-0 shadow-sm font-mono">
                    DB-POOL-MAIN
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
                      PostgreSQL Primary Cluster Pool
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium">
                      Replication Lag: 0ms • Active Connections: 48 / 200
                    </p>
                  </div>
                </div>
                <div className="self-start sm:self-center">
                  <span className="inline-block px-3.5 py-1.5 rounded-full border border-emerald-500/40 text-emerald-400 text-xs font-bold bg-emerald-950/40">
                    Primary Synced
                  </span>
                </div>
              </div>

              {/* Telemetry Item 3 */}
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="bg-cyan-500 text-slate-950 font-extrabold text-xs sm:text-sm px-3 py-2 rounded-xl flex items-center justify-center shrink-0 shadow-sm font-mono">
                    REDIS-CACHE
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
                      In-Memory Session &amp; Route Caching
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium">
                      Hit Rate: 96.4% • Keys: 14,289 • Uptime: 48d 12h
                    </p>
                  </div>
                </div>
                <div className="self-start sm:self-center">
                  <span className="inline-block px-3.5 py-1.5 rounded-full border border-emerald-500/40 text-emerald-400 text-xs font-bold bg-emerald-950/40">
                    Active (Cached)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
