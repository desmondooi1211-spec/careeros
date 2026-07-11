import React from 'react';
import { Layers, User, Building2, Eye, Award, Briefcase, LogOut } from 'lucide-react';

interface HeaderProps {
  currentPersona: 'candidate' | 'recruiter';
  setPersona: (persona: 'candidate' | 'recruiter') => void;
  candidateCompletedCount: number;
  totalJobsCount: number;
  userName?: string;
  onLogout?: () => void;
  userRole?: 'candidate' | 'recruiter';
}

export default function Header({
  currentPersona,
  setPersona,
  candidateCompletedCount,
  totalJobsCount,
  userName,
  onLogout,
  userRole,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm h-[55px] flex items-center" id="header-main">
      <div className="w-full mx-auto px-4 flex items-center justify-between">
        {/* Brand Logo and Title */}
        <div className="flex items-center space-x-2.5" id="brand-logo-container">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-indigo-100">
            <Layers className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-sans font-extrabold text-base tracking-tight text-slate-900">CareerOS</span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                Unified Ecosystem
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium font-mono hidden sm:block leading-none">LEARNING × HIRING PIPELINE</p>
          </div>
        </div>

        {/* Dynamic Context Panel */}
        <div className="hidden md:flex items-center space-x-4 text-xs text-slate-600 bg-slate-50 py-1 px-3 rounded-full border border-slate-100" id="live-telemetry">
          <div className="flex items-center space-x-1 font-sans">
            <Award className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-medium text-slate-700">{candidateCompletedCount}</span>
            <span className="text-slate-500 text-[10px]">Verified Certs</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center space-x-1 font-sans">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-medium text-slate-700">{totalJobsCount}</span>
            <span className="text-slate-500 text-[10px]">Market Opportunities</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center space-x-1 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-600 font-medium">Synced Platform</span>
          </div>
        </div>

        {/* Persona Switch Switcher & Logout */}
        <div className="flex items-center space-x-3" id="header-actions">
          <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg" id="persona-switcher">
            {userRole !== 'recruiter' && (
              <button
                id="switch-btn-candidate"
                onClick={() => setPersona('candidate')}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 ${
                  currentPersona === 'candidate'
                    ? 'bg-white text-indigo-600 shadow-sm shadow-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Candidate View</span>
                <span className="sm:hidden">Candidate</span>
              </button>
            )}
            
            {userRole !== 'candidate' && (
              <button
                id="switch-btn-recruiter"
                onClick={() => setPersona('recruiter')}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 ${
                  currentPersona === 'recruiter'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Recruiter View</span>
                <span className="sm:hidden">Recruiter</span>
              </button>
            )}
          </div>

          {userName && (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 h-6" id="user-profile-badge">
              <div className="hidden lg:block text-left">
                <p className="text-[11px] font-bold text-slate-800 leading-none">{userName}</p>
                <p className="text-[9px] text-slate-400 capitalize mt-0.5 leading-none">{currentPersona}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 rounded-lg transition cursor-pointer flex items-center justify-center"
                title="Sign Out"
                id="header-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
