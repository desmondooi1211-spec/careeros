import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Briefcase, 
  Award, 
  User, 
  ArrowRight, 
  MapPin, 
  DollarSign, 
  Check, 
  Building2, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  CornerDownRight, 
  Zap, 
  BookOpen,
  ChevronRight 
} from 'lucide-react';
import { Candidate, Job, Course, CourseRequest } from '@/lib/types';

interface SharedMarketplaceProps {
  candidates: Candidate[];
  jobs: Job[];
  courses: Course[];
  appliedJobIds: string[];
  courseRequests: CourseRequest[];
  onSwitchToCandidate: () => void;
  onSwitchToRecruiter: () => void;
  onEvaluateCandidate?: (candidate: Candidate) => void;
}

interface ActivityEvent {
  id: string;
  type: 'graduate' | 'job_post' | 'enroll' | 'apply' | 'course_request';
  title: string;
  subtitle: string;
  timestamp: string;
  meta?: any;
}

export default function SharedMarketplace({
  candidates,
  jobs,
  courses,
  appliedJobIds,
  courseRequests,
  onSwitchToCandidate,
  onSwitchToRecruiter,
  onEvaluateCandidate
}: SharedMarketplaceProps) {
  const [activeMarketView, setActiveMarketView] = useState<'both' | 'talent' | 'jobs'>('both');
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  // Periodically generate dynamic activity feed events or pre-seed them
  useEffect(() => {
    // Generate pre-seeded activity feed events reflecting the actual app state
    const seedEvents: ActivityEvent[] = [
      {
        id: 'evt-1',
        type: 'graduate',
        title: 'Meera Patel graduated with Verifiable Distinction',
        subtitle: 'Obtained "Deep Learning Foundations & Gemini API" credential • 100% test score.',
        timestamp: '15 mins ago',
      },
      {
        id: 'evt-2',
        type: 'job_post',
        title: 'Senior Frontend Architect position posted',
        subtitle: 'Published by Veloce Platforms • Budget $140k – $180k • Seeks Verified "Next.js".',
        timestamp: '1 hour ago',
      },
      {
        id: 'evt-3',
        type: 'course_request',
        title: 'New Upstream Curriculum Syllabus request registered',
        subtitle: 'Elena Rostova (Veloce Platforms) requested: "Rust Safe Systems & WebAssembly Compilation".',
        timestamp: '3 hours ago',
      },
      {
        id: 'evt-4',
        type: 'graduate',
        title: 'Marcus Vance certified in modern React Rendering mechanisms',
        subtitle: 'Completed "Figma Design Systems at Scale" & "Next.js 14 Production Architecture".',
        timestamp: '4 hours ago',
      },
    ];

    // Add additional customized events if user completed any courses or projects inside app
    const userCandidate = candidates.find(c => c.isCurrentUser);
    if (userCandidate && userCandidate.skills.length > 0) {
      userCandidate.skills.forEach((skill, index) => {
        seedEvents.unshift({
          id: `evt-user-grad-${index}`,
          type: 'graduate',
          title: `You (Khor Ming Yao) successfully secured Verified Badge: ${skill}`,
          subtitle: `Added to your candidate profile securely. Verified matching roles highlighted!`,
          timestamp: 'Just now'
        });
      });
    }

    // Add events if user applied to any jobs
    appliedJobIds.forEach(jobId => {
      const targetJob = jobs.find(j => j.id === jobId);
      if (targetJob) {
        seedEvents.unshift({
          id: `evt-apply-${jobId}`,
          type: 'apply',
          title: `Khor Ming Yao applied for ${targetJob.title}`,
          subtitle: `CVS verified credentials attached to application package for ${targetJob.company}.`,
          timestamp: '2 mins ago'
        });
      }
    });

    setActivities(seedEvents);
  }, [candidates, jobs, appliedJobIds]);

  return (
    <div className="space-y-8" id="unified-shared-marketplace">
      {/* Visual Identity Hero Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden border border-slate-800 shadow-xl" id="marketplace-hero bg">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Layers className="w-96 h-96" />
        </div>

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-500/10 border border-indigo-500/2 transition-colors duration-200 text-indigo-300 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>THE SHARED MARKETPLACE COEXISTENCE FEED</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Where upskilling path meets recruiter target demand.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Candidates learn and get discovered in the same place. Recruiters post target listings where candidates are upskilling, shaping the very pipeline they hire from. Mutual discovery happens in real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column (col-span-4): Dynamic Platform Activity Telemetry */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                <span>Live Consortium Action Ticker</span>
              </h3>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 rounded-full">LIVE FEED</span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1" id="activity-timeline-scroller">
              {activities.map(evt => (
                <div key={evt.id} className="relative pl-6 pb-4 border-l border-slate-100 last:pb-0">
                  {/* Custom Indicator Dot */}
                  <span className={`absolute -left-[6px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                    evt.type === 'graduate' ? 'bg-emerald-500' :
                    evt.type === 'job_post' ? 'bg-indigo-500' :
                    evt.type === 'apply' ? 'bg-blue-500' : 'bg-amber-500'
                  }`}></span>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono block">{evt.timestamp}</span>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{evt.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">{evt.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Educational Sandbox Helper */}
          <div className="bg-indigo-50/40 border border-dashed border-indigo-200 rounded-2xl p-6 space-y-4 relative overflow-hidden" id="sandbox-helper">
            {/* Sandbox Indicator Badge */}
            <div className="absolute top-3 right-3 bg-indigo-100 border border-indigo-200 text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded text-indigo-700 uppercase">
              Prototype Shortcut
            </div>
            
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800">Experience Mutual Discovery Loop</h4>
            <p className="text-xs text-slate-650 leading-relaxed font-normal">
              CareerOS is designed with an interconnected loop:
            </p>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-mono font-bold">1</span>
                <span>Completed courses in <strong>Candidate Mode</strong> automatically update portfolios.</span>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-mono font-bold">2</span>
                <span>Recruiters instantly view those verified applicants in <strong>Recruiter Mode</strong>.</span>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-mono font-bold">3</span>
                <span>Recruiters request missing skills, creating dynamic courses candidates study.</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button 
                onClick={onSwitchToCandidate}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1 transition"
                id="sandbox-candidate-btn"
              >
                <span>Start Learning (Candidate View)</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
              
              <button 
                onClick={onSwitchToRecruiter}
                className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1 transition"
                id="sandbox-recruiter-btn"
              >
                <span>Browse Candidates (Recruiter View)</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right column (col-span-8): Shared Coexistence List (Profiles + Open Roles coexisting!) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3" id="coexistence-header">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>The Coexistence Feed</span>
                <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                  MUTUAL DISCOVERY ZONE
                </span>
              </h3>
              <p className="text-xs text-slate-500">Live profiles and vacancies sitting together on the unified pipeline layer.</p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-lg text-xs" id="coexistence-selectors">
              <button 
                onClick={() => setActiveMarketView('both')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                  activeMarketView === 'both' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Unified Feed
              </button>
              <button 
                onClick={() => setActiveMarketView('talent')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                  activeMarketView === 'talent' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Talent Pool
              </button>
              <button 
                onClick={() => setActiveMarketView('jobs')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                  activeMarketView === 'jobs' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Job Listed
              </button>
            </div>
          </div>

          <div className="space-y-4" id="shared-coexistence-feed">
            {/* 1. TALENT POOL ENTRIES */}
            {(activeMarketView === 'both' || activeMarketView === 'talent') && (
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-emerald-600 font-extrabold uppercase tracking-wider block">
                  ✦ Live Verified Candidate Talent Pool
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="coexistence-talent">
                  {candidates.map(cand => (
                    <div 
                      key={cand.id} 
                      id={`coexist-cand-${cand.id}`}
                      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <img src={cand.avatar} alt={cand.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <div className="flex items-center gap-1">
                              <h4 className="font-bold text-slate-900 text-xs leading-none">{cand.name}</h4>
                              {cand.isCurrentUser && <span className="text-[9px] bg-indigo-50 text-indigo-700 font-mono px-1 rounded">Alex</span>}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 font-semibold">{cand.title}</p>
                          </div>
                        </div>

                        {/* Bio line */}
                        <p className="text-[11px] text-slate-600 leading-relaxed italic line-clamp-2">"{cand.bio}"</p>

                        {/* Verified Skills */}
                        <div className="pt-2 space-y-1.5 border-t border-slate-50">
                          <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono font-bold uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> VERIFIED SKILLS (SYLLABUS SECURED)
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {cand.skills.length > 0 ? (
                              cand.skills.map(s => (
                                <span key={s} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded font-semibold">
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-400">Undergoing upskilling process...</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 flex justify-end border-t border-slate-50 mt-4">
                        <button 
                          onClick={() => {
                            if (onEvaluateCandidate) {
                              onEvaluateCandidate(cand);
                            } else {
                              onSwitchToRecruiter();
                            }
                          }}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 cursor-pointer"
                          id={`assess-fit-coexist-btn-${cand.id}`}
                        >
                          <span>Evaluate Candidate Fit</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. OPEN JOB POSTINGS ENTRIES */}
            {(activeMarketView === 'both' || activeMarketView === 'jobs') && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <span className="text-[10px] font-mono text-indigo-600 font-extrabold uppercase tracking-wider block">
                  ✦ Active Market Vacancy Listings
                </span>
                <div className="grid grid-cols-1 gap-4" id="coexistence-jobs">
                  {jobs.map(job => (
                    <div 
                      key={job.id} 
                      id={`coexist-job-${job.id}`}
                      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 bg-indigo-50 text-indigo-700 rounded-md font-bold text-base flex justify-center items-center select-none shrink-0">
                            {job.logo}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs leading-none">{job.title}</h4>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{job.company}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center font-mono text-[10px] text-slate-500 gap-x-3 gap-y-0.5">
                          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {job.location}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                          <span>•</span>
                          <span className="bg-slate-100 px-1 rounded text-slate-700">{job.type}</span>
                        </div>
                      </div>

                      {/* Target skills requested, linked course helper */}
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {job.skillsNeeded.map(s => (
                          <span key={s} className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-600 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="shrink-0 self-stretch sm:self-auto flex items-center justify-end">
                        <button 
                          onClick={onSwitchToCandidate}
                          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-150 text-indigo-700 hover:text-indigo-850 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          id={`coexist-job-apply-btn-${job.id}`}
                        >
                          <span>Explore Career Path</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
