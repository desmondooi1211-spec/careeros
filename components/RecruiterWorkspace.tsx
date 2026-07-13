import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Users, 
  Clipboard, 
  Plus, 
  Search, 
  ShieldCheck, 
  Check, 
  ChevronRight, 
  Award, 
  Sparkles, 
  Send, 
  Bookmark, 
  BookOpen, 
  Flame, 
  Briefcase,
  CheckCircle2,
  X,
  ThumbsDown,
  ThumbsUp,
  SkipForward,
  ArrowLeft,
  LayoutList,
  Layers,
  GripVertical
} from 'lucide-react';
import { Candidate, Course, Job, CourseRequest } from '@/lib/types';
import { SKILL_TREES, getPathConnections, renderSkillIcon } from './CandidateWorkspace';

interface RecruiterWorkspaceProps {
  candidates: Candidate[];
  courses: Course[];
  jobs: Job[];
  courseRequests: CourseRequest[];
  onAddJob: (job: Omit<Job, 'id' | 'applicantsCount' | 'datePosted' | 'logo'>) => void;
  onRequestCourse: (request: Omit<CourseRequest, 'id' | 'status' | 'dateRequested'>) => void;
  onApproveSyllabus: (requestId: string) => void;
  initialFocusedCandidate?: Candidate | null;
  onClearInitialFocusedCandidate?: () => void;
  activeTab: 'talent' | 'post-job' | 'curriculum' | 'my-jobs';
  setActiveTab: (tab: 'talent' | 'post-job' | 'curriculum' | 'my-jobs') => void;
}

export default function RecruiterWorkspace({
  candidates,
  courses,
  jobs,
  courseRequests,
  onAddJob,
  onRequestCourse,
  onApproveSyllabus,
  initialFocusedCandidate,
  onClearInitialFocusedCandidate,
  activeTab,
  setActiveTab
}: RecruiterWorkspaceProps) {
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All');

  // Job Posting state
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobSkills, setJobSkills] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState<'Full-time' | 'Contract' | 'Part-time' | 'Remote'>('Full-time');
  const [jobSuccessMsg, setJobSuccessMsg] = useState(false);

  // Course Request state
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqSkills, setReqSkills] = useState('');
  const [reqNotes, setReqNotes] = useState('');
  const [reqRecruiterName, setReqRecruiterName] = useState('Elena Rostova');
  const [reqSuccessMsg, setReqSuccessMsg] = useState(false);

  // Assess candidate fit drawer/modal
  const [focusedCandidate, setFocusedCandidate] = useState<Candidate | null>(null);
  const [assessAgainstJob, setAssessAgainstJob] = useState<string>(jobs[0]?.id || '');

  // ── NEW: Job Detail View (My Jobs → click job card) ──────────────────────
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobDetailTab, setJobDetailTab] = useState<'applicants' | 'syllabus'>('applicants');

  // ── NEW: Tinder deck state ────────────────────────────────────────────────
  type SwipeDir = 'left' | 'right' | 'up' | null;
  const [swipeDir, setSwipeDir] = useState<SwipeDir>(null);

  const [tinderStates, setTinderStates] = useState<Record<string, {
    deckIndex: number;
    shortlisted: string[];
    rejected: string[];
    skipped: string[];
    deckView: 'stack' | 'list';
    deckDone: boolean;
  }>>({});

  const activeTinderState = selectedJob ? (tinderStates[selectedJob.id] || {
    deckIndex: 0,
    shortlisted: [],
    rejected: [],
    skipped: [],
    deckView: 'stack',
    deckDone: false
  }) : { deckIndex: 0, shortlisted: [], rejected: [], skipped: [], deckView: 'stack' as const, deckDone: false };

  const deckIndex = activeTinderState.deckIndex;
  const shortlisted = activeTinderState.shortlisted;
  const rejected = activeTinderState.rejected;
  const skipped = activeTinderState.skipped;
  const deckView = activeTinderState.deckView;
  const deckDone = activeTinderState.deckDone;

  const selectedJobIdRef = useRef<string | null>(null);
  selectedJobIdRef.current = selectedJob?.id || null;

  const updateTinderState = useCallback((jobId: string, updates: Partial<typeof activeTinderState> | ((prev: typeof activeTinderState) => Partial<typeof activeTinderState>)) => {
    setTinderStates(prev => {
      const current = prev[jobId] || { deckIndex: 0, shortlisted: [], rejected: [], skipped: [], deckView: 'stack', deckDone: false };
      const newValues = typeof updates === 'function' ? updates(current) : updates;
      return { ...prev, [jobId]: { ...current, ...newValues } };
    });
  }, []);

  const setDeckIndex = useCallback((val: number | ((prev: number) => number)) => {
    const id = selectedJobIdRef.current;
    if (!id) return;
    updateTinderState(id, prev => ({ deckIndex: typeof val === 'function' ? val(prev.deckIndex) : val }));
  }, [updateTinderState]);

  const setShortlisted = useCallback((val: string[] | ((prev: string[]) => string[])) => {
    const id = selectedJobIdRef.current;
    if (!id) return;
    updateTinderState(id, prev => ({ shortlisted: typeof val === 'function' ? val(prev.shortlisted) : val }));
  }, [updateTinderState]);

  const setRejected = useCallback((val: string[] | ((prev: string[]) => string[])) => {
    const id = selectedJobIdRef.current;
    if (!id) return;
    updateTinderState(id, prev => ({ rejected: typeof val === 'function' ? val(prev.rejected) : val }));
  }, [updateTinderState]);

  const setSkipped = useCallback((val: string[] | ((prev: string[]) => string[])) => {
    const id = selectedJobIdRef.current;
    if (!id) return;
    updateTinderState(id, prev => ({ skipped: typeof val === 'function' ? val(prev.skipped) : val }));
  }, [updateTinderState]);

  const setDeckView = useCallback((val: 'stack' | 'list' | ((prev: 'stack' | 'list') => 'stack' | 'list')) => {
    const id = selectedJobIdRef.current;
    if (!id) return;
    updateTinderState(id, prev => ({ deckView: typeof val === 'function' ? val(prev.deckView) : val }));
  }, [updateTinderState]);

  const setDeckDone = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    const id = selectedJobIdRef.current;
    if (!id) return;
    updateTinderState(id, prev => ({ deckDone: typeof val === 'function' ? val(prev.deckDone) : val }));
  }, [updateTinderState]);

  // Touch swipe tracking
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // ── NEW: Drag-and-drop state (Talent Market) ──────────────────────────────
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);
  const [basketsOpen, setBasketsOpen] = useState(false);
  const [dragOverBasket, setDragOverBasket] = useState<string | null>(null);
  const [sourcedMap, setSourcedMap] = useState<Record<string, string[]>>({}); // jobId → candidateIds[]
  const [toast, setToast] = useState<string | null>(null);

  // Reset swipe dir when job changes
  useEffect(() => {
    setSwipeDir(null);
  }, [selectedJob]);

  useEffect(() => {
    if (initialFocusedCandidate) {
      setFocusedCandidate(initialFocusedCandidate);
      setActiveTab('talent');
      if (onClearInitialFocusedCandidate) {
        onClearInitialFocusedCandidate();
      }
    }
  }, [initialFocusedCandidate, onClearInitialFocusedCandidate]);

  // Master list of all skills verified by completed courses
  const allVerifiedSkills = Array.from(new Set(courses.flatMap(c => c.skillsGranted)));

  // Filter candidates based on name search and skill filters
  const filteredCandidates = candidates.filter(cand => {
    const nameMatch = cand.name.toLowerCase().includes(candidateSearch.toLowerCase()) || 
                      cand.title.toLowerCase().includes(candidateSearch.toLowerCase());
    
    // We only aggregate dynamic skills
    const skillMatch = selectedSkillFilter === 'All' || cand.skills.includes(selectedSkillFilter);
    return nameMatch && skillMatch;
  });

  // ── NEW HELPERS ───────────────────────────────────────────────────────────
  const getFitScore = useCallback((cand: Candidate, job: Job) => {
    if (!job.skillsNeeded.length) return 100;
    const matches = job.skillsNeeded.filter(s => cand.skills.includes(s)).length;
    return Math.round((matches / job.skillsNeeded.length) * 100);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Tinder: advance the deck (uses applicantsForJob length, computed below via useMemo equivalent)
  const advanceDeck = useCallback((dir: 'left' | 'right' | 'up', candidateId: string, poolSize: number) => {
    setSwipeDir(dir);
    setTimeout(() => {
      if (dir === 'right') {
        setShortlisted(prev => [...prev, candidateId]);
        setSkipped(prev => prev.filter(id => id !== candidateId));
      } else if (dir === 'left') {
        setRejected(prev => [...prev, candidateId]);
        setSkipped(prev => prev.filter(id => id !== candidateId));
      } else {
        setSkipped(prev => prev.includes(candidateId) ? [...prev.filter(id => id !== candidateId), candidateId] : [...prev, candidateId]);
      }
      setSwipeDir(null);
    }, 380);
  }, [setShortlisted, setRejected, setSkipped]);

  // Keyboard hotkeys for tinder deck
  useEffect(() => {
    if (activeTab !== 'my-jobs' || !selectedJob || jobDetailTab !== 'applicants' || deckView !== 'stack') return;
    const sourcedIds = sourcedMap[selectedJob.id] || [];
    const applicants = candidates.filter(c => c.followedJobIds?.includes(selectedJob.id) && !sourcedIds.includes(c.id));
    const freshCandidates = applicants.filter(c => !shortlisted.includes(c.id) && !rejected.includes(c.id) && !skipped.includes(c.id));
    const skippedCandidates = skipped
      .map(id => applicants.find(c => c.id === id))
      .filter(c => c !== undefined) as typeof applicants;
    const unevaluated = [...freshCandidates, ...skippedCandidates];
    if (unevaluated.length === 0) return;

    const handler = (e: KeyboardEvent) => {
      const card = unevaluated[0];
      if (!card) return;
      if (e.key === 'ArrowLeft')  advanceDeck('left', card.id, applicants.length);
      if (e.key === 'ArrowRight') advanceDeck('right', card.id, applicants.length);
      if (e.key === 'ArrowUp')    advanceDeck('up', card.id, applicants.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeTab, selectedJob, jobDetailTab, deckView, shortlisted, rejected, skipped, sourcedMap, candidates, advanceDeck]);

  // Drag-and-drop handlers
  const handleDragStart = (e: React.DragEvent, candId: string) => {
    setDraggedCandidateId(candId);
    setBasketsOpen(true);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnd = () => {
    setDraggedCandidateId(null);
    setBasketsOpen(false);
    setDragOverBasket(null);
  };
  const handleDropOnBasket = (jobId: string) => {
    if (!draggedCandidateId) return;
    const cand = candidates.find(c => c.id === draggedCandidateId);
    const job = jobs.find(j => j.id === jobId);
    if (!cand || !job) return;
    // Add to sourced map
    setSourcedMap(prev => ({
      ...prev,
      [jobId]: Array.from(new Set([...(prev[jobId] || []), draggedCandidateId]))
    }));
    showToast(`✅ ${cand.name} sourced & shortlisted for "${job.title}"`);
    setDraggedCandidateId(null);
    setBasketsOpen(false);
    setDragOverBasket(null);
  };

  // Global scroll wheel hijack & edge-scrolling while dragging
  useEffect(() => {
    if (!draggedCandidateId) return;
    const panel = document.getElementById('job-baskets-panel');
    if (!panel) return;

    const handleWheel = (e: WheelEvent) => {
      // Hijack the scroll wheel to scroll the baskets panel
      e.preventDefault();
      e.stopPropagation();
      const scrollAmt = e.deltaY > 0 ? 80 : e.deltaY < 0 ? -80 : 0;
      panel.scrollTop += scrollAmt;
    };

    let animationFrameId: number;
    let currentSpeed = 0;

    const scrollLoop = () => {
      if (currentSpeed !== 0) {
        panel.scrollTop += currentSpeed * 25;
      }
      animationFrameId = requestAnimationFrame(scrollLoop);
    };
    
    // Start the physics loop
    animationFrameId = requestAnimationFrame(scrollLoop);

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault(); // Necessary to allow dropping globally
      const y = e.clientY;
      const height = window.innerHeight;
      
      // Calculate velocity based on proximity to top/bottom 20% of screen
      if (y < height * 0.20) {
        // Easing curve for smooth acceleration
        currentSpeed = -Math.pow((height * 0.20 - y) / (height * 0.20), 1.5);
      } else if (y > height * 0.80) {
        currentSpeed = Math.pow((y - height * 0.80) / (height * 0.20), 1.5);
      } else {
        currentSpeed = 0;
      }
    };

    const handleDragEnd = () => {
      currentSpeed = 0;
      cancelAnimationFrame(animationFrameId);
    };

    // Use capture phase on document to intercept before native browser engine
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    document.addEventListener('dragover', handleDragOver, { capture: true });
    document.addEventListener('dragend', handleDragEnd);
    document.addEventListener('drop', handleDragEnd);

    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true });
      document.removeEventListener('dragover', handleDragOver, { capture: true });
      document.removeEventListener('dragend', handleDragEnd);
      document.removeEventListener('drop', handleDragEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [draggedCandidateId]);

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobCompany.trim() || !jobDesc.trim()) return;

    onAddJob({
      title: jobTitle,
      company: jobCompany,
      description: jobDesc,
      skillsNeeded: jobSkills.split(',').map(s => s.trim()).filter(s => s !== ''),
      salary: jobSalary || '$100k – $120k',
      location: jobLocation || 'Remote',
      type: jobType
    });

    setJobTitle('');
    setJobCompany('');
    setJobDesc('');
    setJobSkills('');
    setJobSalary('');
    setJobLocation('');
    setJobSuccessMsg(true);
    setTimeout(() => setJobSuccessMsg(false), 4000);
  };

  const handleRequestCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim() || !reqDesc.trim() || !reqSkills.trim()) return;

    onRequestCourse({
      title: reqTitle,
      description: reqDesc,
      notes: reqNotes,
      skillsWanted: reqSkills.split(',').map(s => s.trim()).filter(s => s !== ''),
      recruiterName: reqRecruiterName,
      company: 'Veloce Platforms'
    });

    setReqTitle('');
    setReqDesc('');
    setReqSkills('');
    setReqNotes('');
    setReqSuccessMsg(true);
    setTimeout(() => setReqSuccessMsg(false), 4000);
  };

  // Compute detailed venn profile fit matching scores
  const getVennAnalysis = (candidate: Candidate, jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return { matching: [], lacking: [] };
    
    const matching = job.skillsNeeded.filter(s => candidate.skills.includes(s));
    const lacking = job.skillsNeeded.filter(s => !candidate.skills.includes(s));
    
    return { matching, lacking, jobTitle: job.title };
  };

  return (
    <div className="space-y-8" id="recruiter-workspace">
      {/* Recruiter Sub-Header Navigation - Only shown on Talent Search tab */}
      {activeTab === 'talent' && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4" id="recruiter-subnav">
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span>Talent Marketplace</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-indigo-600 text-white font-mono uppercase tracking-wider">
                Talent Pipeline active
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Acquire zero-bias, verified candidates in real-time or request course syllabus adjustments to solve upstream talent shortage metrics.</p>
          </div>
        </div>
      )}

      {/* 1. TALENT POOL SEARCH & FIT ASSESSMENT TAB PANEL */}
      {activeTab === 'talent' && (
        <div className="space-y-6 animate-fadeIn" id="tab-panels-talent">
          {/* Statistics summary headers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="metric-summary-grid">
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">SECURED POOL SIZE</span>
              <p className="text-2xl font-black text-slate-900">{candidates.length}</p>
              <p className="text-xs text-slate-500">100% evaluated by syllabus consensus.</p>
            </div>
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">COURSES IN DYNAMIC SYLLABUS</span>
              <p className="text-2xl font-black text-slate-900">{courses.length}</p>
              <p className="text-xs text-slate-500">Continuous upstream learning path.</p>
            </div>
            <div className="bg-indigo-50/30 border border-indigo-100/50 p-5 rounded-2xl shadow-sm space-y-1">
              <span className="text-[10px] text-indigo-600 font-mono font-bold uppercase tracking-wider">UPSTREAM DEPLOYMENTS REQUESTED</span>
              <p className="text-2xl font-black text-slate-900">
                {courseRequests.length} <span className="text-xs font-normal text-slate-500">({courseRequests.filter(r => r.status === 'Pending').length} Pending)</span>
              </p>
              <p className="text-xs text-slate-500">Direct integration of market demands.</p>
            </div>
          </div>

          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm" id="talent-search-bar">
            {/* Candidate Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input 
                id="cand-search-input"
                type="text" 
                placeholder="Search candidates by name, job role, qualifications..."
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>
            
            {/* Filter by Candidate Verified Skills */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold font-mono whitespace-nowrap">Verified Competency:</span>
              <select
                id="cand-skill-select"
                value={selectedSkillFilter}
                onChange={(e) => setSelectedSkillFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="All">All Proven Skills</option>
                {allVerifiedSkills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Candidates Feed — draggable for job basket sourcing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="candidates-grid">
            {filteredCandidates.map(cand => (
              <div 
                key={cand.id} 
                id={`candidate-card-${cand.id}`}
                draggable
                onMouseDown={() => {
                  setDraggedCandidateId(cand.id);
                  setBasketsOpen(true);
                }}
                onMouseUp={() => {
                  setDraggedCandidateId(null);
                  setBasketsOpen(false);
                }}
                onDragStart={(e) => handleDragStart(e, cand.id)}
                onDragEnd={handleDragEnd}
                className={`group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing ${
                  cand.isCurrentUser ? 'ring-2 ring-indigo-500/40 bg-indigo-50/10' : ''
                } ${draggedCandidateId === cand.id ? 'opacity-50 scale-95' : ''}`}
              >
                <div>
                  {/* Candidate Identification Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3.5">
                      <img 
                        src={cand.avatar} 
                        alt={cand.name} 
                        className="w-13 h-13 rounded-xl object-cover ring-2 ring-slate-100" 
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900 text-sm tracking-tight">{cand.name}</h3>
                          {cand.isCurrentUser && (
                            <span className="text-[9px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-mono">
                              YOU (DEMO)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-semibold">{cand.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight border ${
                        cand.status === 'Open for Offers' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        cand.status === 'Interviewing' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                        {cand.status}
                      </span>
                      <div className="text-slate-300 group-hover:text-indigo-500 transition-colors p-1 bg-slate-50 group-hover:bg-indigo-50 rounded-md" title="Drag to source">
                        <GripVertical className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Summary Biography */}
                  <p className="text-xs text-slate-600 mt-4 leading-relaxed italic">"{cand.bio}"</p>

                  {/* Core Verified Skills Pillar */}
                  <div className="mt-4 space-y-2">
                    <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> VERIFIED SKILLS PORTFOLIO (NO MANUAL BULLETS)
                    </h4>
                    {cand.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {cand.skills.map(skill => {
                          const matchingCourse = courses.find(c => c.skillsGranted.includes(skill));
                          return (
                            <span 
                              key={skill} 
                              className="px-2 py-1 bg-emerald-50 border border-emerald-100 rounded text-[11px] font-semibold text-emerald-800 flex items-center gap-1 cursor-help"
                              title={matchingCourse ? `Verified completion of "${matchingCourse.title}"` : 'Verified on CareerOS'}
                            >
                              <Check className="w-3 h-3 text-emerald-500" /> {skill}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 bg-slate-50 py-2 px-3 rounded-lg border border-dashed border-slate-200">
                        No verified academic courses completed yet. This candidate is currently active in independent portfolios.
                      </div>
                    )}
                  </div>

                  {/* Projects, if any */}
                  {cand.projects.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
                      <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">CANDIDATE PROJECTS DETAILED:</h4>
                      <div className="space-y-1.5">
                        {cand.projects.map(proj => (
                          <div key={proj.id} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="font-bold text-slate-800 block text-[11px]">{proj.title}</span>
                            <span className="text-slate-500 leading-tight block mt-0.5 text-[11px]">{proj.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Match assessment CTAs */}
                <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between gap-3">
                  <button
                    id={`assess-fit-${cand.id}`}
                    onClick={() => {
                      setFocusedCandidate(cand);
                      if (jobs.length > 0) setAssessAgainstJob(jobs[0].id);
                    }}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Run Algorithmic Fit Test</span>
                  </button>
                  <a 
                    href={`mailto:${cand.email}`}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                  >
                    Email
                  </a>
                </div>
                {/* Drag hint */}
                <p className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                  <GripVertical className="w-3 h-3" /> Drag to a job basket to source
                </p>
              </div>
            ))}
          </div>

          {/* ── Job Baskets — fixed, Framer Motion spring slide ── */}
          {typeof document !== 'undefined' && createPortal(
            <motion.div
              id="job-baskets-panel"
              initial={{ x: 340, y: '-50%', opacity: 0 }}
              animate={{ 
                x: basketsOpen ? 0 : 340, 
                y: '-50%',
                opacity: basketsOpen ? 1 : 0 
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              style={{
                position: 'fixed',
                top: '50%',
                right: '24px',
                width: '260px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '12px',
              }}
            >
              <div className="bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-2 rounded-xl text-center shadow-lg">
                🎯 Drop into a Job Basket
              </div>
              {(() => {
                const dragged = candidates.find(c => c.id === draggedCandidateId);
                const sortedJobs = [...jobs].sort((a, b) => {
                  if (!dragged) return 0;
                  return getFitScore(dragged, b) - getFitScore(dragged, a);
                });
                return sortedJobs.map(j => {
                  const fit = dragged ? getFitScore(dragged, j) : 0;
                  const already = (sourcedMap[j.id] || []).includes(draggedCandidateId || '');
                const isOver = dragOverBasket === j.id;
                const glowColor =
                  fit >= 75 ? 'border-emerald-400 bg-emerald-50 shadow-emerald-100' :
                  fit >= 40 ? 'border-amber-400 bg-amber-50 shadow-amber-100' :
                              'border-rose-300 bg-rose-50 shadow-rose-100';
                const badgeColor =
                  fit >= 75 ? 'bg-emerald-500' :
                  fit >= 40 ? 'bg-amber-500' :
                              'bg-rose-500';
                return (
                  <div
                    key={j.id}
                    id={`basket-${j.id}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOverBasket(j.id); }}
                    onDragLeave={() => setDragOverBasket(null)}
                    onDrop={(e) => { e.preventDefault(); handleDropOnBasket(j.id); }}
                    className={`border-2 rounded-xl p-4 transition-all duration-150 shadow-md cursor-copy ${
                      isOver ? 'scale-105 shadow-xl ' + glowColor : 'border-slate-200 bg-white'
                    } ${already ? 'opacity-40' : ''}`}
                  >
                    <p className="text-sm font-bold text-slate-800 leading-tight">{j.title}</p>
                    <p className="text-[10px] text-slate-500">{j.company}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                        {fit}% fit
                      </span>
                      {already && <span className="text-[10px] text-slate-400 font-semibold">✓ Sourced</span>}
                    </div>
                  </div>
                );
              })})()}
            </motion.div>,
            document.body
          )}
        </div>
      )}

      {/* 2. POST JOB LISTING TAB PANEL */}
      {activeTab === 'post-job' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn" id="tab-panels-post-job">
          <div>
            <span className="text-[10px] font-mono text-indigo-600 font-black uppercase tracking-wider">VACANCY DISCOVERY GENERATOR</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">Broadcast Open Opportunities to Validated Talents</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              When you post a vacancy, our platform translates required skills directly into highlight cues for the candidate terminal. Underperforming applicants will receive direct pathways to acquire missing targets.
            </p>
          </div>

          <form onSubmit={handlePostJobSubmit} className="space-y-4 text-xs">
            {jobSuccessMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium"
              >
                Excellent! The vacancy has been logged on the shared ecosystem marketplace and matched candidates can immediately begin applying!
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                <input 
                  id="job-title-input"
                  type="text" 
                  required
                  placeholder="e.g. LLM Interaction Specialist"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hiring Institution / Company Name</label>
                <input 
                  id="job-company-input"
                  type="text" 
                  required
                  placeholder="e.g. Stripe, OpenAI"
                  value={jobCompany}
                  onChange={(e) => setJobCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Annual Salary range</label>
                <input 
                  id="job-salary-input"
                  type="text" 
                  placeholder="e.g. $130k – $160K"
                  value={jobSalary}
                  onChange={(e) => setJobSalary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location / Timezone limits</label>
                <input 
                  id="job-location-input"
                  type="text" 
                  placeholder="e.g. Remote (EU timezones)"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Engagement Framework</label>
                <select 
                  id="job-type-select"
                  value={jobType} 
                  onChange={(e) => setJobType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50"
                >
                  <option value="Full-time">Full-time Employee</option>
                  <option value="Contract">Contract basis</option>
                  <option value="Part-time">Part-time project</option>
                  <option value="Remote">Autonomous Remote</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Core Required Technical Core Competencies</label>
              <input 
                id="job-skills-input"
                type="text" 
                required
                placeholder="Next.js, React, SSR, Gemini API (comma separated)"
                value={jobSkills}
                onChange={(e) => setJobSkills(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50 font-mono text-[11px]"
              />
              <p className="text-[10px] text-slate-400 mt-1">Please enter the exact skill names that match the academic available courses for maximum pipeline correlation!</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Role Description / Scope of Work</label>
              <textarea 
                id="job-desc-input"
                required
                rows={5}
                placeholder="Write the responsibilities, expected daily workflow, and strategic metrics details of the employee..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50 leading-relaxed"
              />
            </div>

            <div className="pt-3">
              <button 
                id="submit-job-btn"
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-slate-900 shadow-md shadow-indigo-100 text-white font-bold transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Finalize Job & Enlist in Shared Feed
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. SYLLABUS DOCK & UPSTREAM COURSE REQUESTS TAB PANEL */}
      {activeTab === 'curriculum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn" id="tab-panels-curriculum">
          
          {/* Left Form: Submit Request */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div>
              <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-wider">UPSTREAM SIGNALING SYSTEM</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Shape the Upstream Talent Pool</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                If the pool lack applicants who can build on your target frameworks, write a course program request here.
              </p>
            </div>

            <form onSubmit={handleRequestCourseSubmit} className="space-y-4 text-xs">
              {reqSuccessMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg"
                >
                  Request logged! Now, go to the active list on the right and authorize it to instantly manifest the course!
                </motion.div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Syllabus / Topic name</label>
                <input 
                  id="course-req-title-input"
                  type="text" 
                  required
                  placeholder="e.g. Advanced Rust Programming"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Verification Skills Wanted (comma separated)</label>
                <input 
                  id="course-req-skills-input"
                  type="text" 
                  required
                  placeholder="Rust, Memory Management, WASM"
                  value={reqSkills}
                  onChange={(e) => setReqSkills(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Scope Objectives</label>
                <textarea 
                  id="course-req-desc-input"
                  required
                  rows={3}
                  placeholder="What is the objective of the course? Describe the technical capabilities students should prove."
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Recruiter Specific Notes & Business Context</label>
                <textarea 
                  id="course-req-notes-input"
                  rows={2}
                  placeholder="e.g. We have 3 active positions but zero verified applicants have WebAssembly badges. We need this upstream!"
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Syllabus Origin / Requested By</label>
                <input 
                  id="course-req-recruiter-input"
                  type="text" 
                  required
                  placeholder="Your Name (Hiring Lead)"
                  value={reqRecruiterName}
                  onChange={(e) => setReqRecruiterName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
              </div>

              <button 
                id="submit-course-req-btn"
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all text-xs"
              >
                Log Pipeline Request Signal
              </button>
            </form>
          </div>

          {/* Right Panel: Pending/Active requests */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-indigo-50/60 text-indigo-950 rounded-2xl p-4 sm:p-6 shadow-sm border border-indigo-100/80 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-650 pointer-events-none">
                <BookOpen className="w-24 h-24" />
              </div>
              <h3 className="text-base font-black tracking-tight mb-2 flex items-center gap-1.5 text-slate-900">
                <Flame className="w-4.5 h-4.5 text-amber-600" /> Continuous Self-Healing Marketplace
              </h3>
              <p className="text-xs text-indigo-900/80 leading-relaxed font-mono">
                When recruiters submit a request, they can directly <strong>APPROVE & BUILD</strong> it. This automatically structures an active course on the Candidate platform. Check out how it works in action below!
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Curriculum Requests ({courseRequests.length})</h3>
              
              <div className="space-y-4" id="course-requests-list">
                {courseRequests.map(req => (
                  <div 
                    key={req.id} 
                    id={`req-card-${req.id}`}
                    className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 font-mono tracking-wider">
                            ID: {req.id.toUpperCase()}
                          </span>
                          <h4 className="font-bold text-slate-900 text-xs mt-1.5">{req.title}</h4>
                          <p className="text-[10px] text-slate-505 mt-0.5">{req.recruiterName} • {req.company}</p>
                        </div>
                        <div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'Approved' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{req.description}</p>
                      
                      {req.notes && (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 block">
                          <strong>Note:</strong> "{req.notes}"
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        {req.skillsWanted.map(skill => (
                          <span key={skill} className="px-1.5 py-0.5 bg-slate-50 text-slate-700 border border-slate-100 rounded text-[10px] font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {req.status === 'Pending' && (
                      <div className="pt-3 border-t border-slate-50">
                        <button
                          id={`approve-syllabus-${req.id}`}
                          onClick={() => onApproveSyllabus(req.id)}
                          className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/50 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <Award className="w-4 h-4" />
                          <span>Approve & Manifest Dynamic Course Modules</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'my-jobs' && (
        <div className="space-y-6 animate-fadeIn font-sans" id="tab-panels-my-jobs">

          {/* ── Job Detail View (when a job card is clicked) ── */}
          <AnimatePresence>
            {selectedJob && (
              <motion.div
                key={selectedJob.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-md"
                id="job-detail-view"
              >
                {/* Detail header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                      aria-label="Back to jobs"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-base">{selectedJob.logo || '💼'}</span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{selectedJob.title}</h3>
                      <p className="text-[11px] text-slate-500">{selectedJob.company} • {selectedJob.type} • {selectedJob.location}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold rounded-full border border-indigo-100">
                    {selectedJob.applicantsCount} Applicants
                  </span>
                </div>

                {/* Detail tab bar */}
                <div className="flex border-b border-slate-100 px-5">
                  {(['applicants', 'syllabus'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setJobDetailTab(tab)}
                      className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
                        jobDetailTab === tab
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab === 'applicants' ? 'Applicants & Sourcing' : 'Syllabus Path Editor'}
                    </button>
                  ))}
                </div>

                {/* ── TAB 1: Applicants & Sourcing ── */}
                {jobDetailTab === 'applicants' && (
                  <div className="p-5" id="job-detail-applicants">
                    {/* Sourced by You strip */}
                    {(sourcedMap[selectedJob.id] || []).length > 0 && (
                      <div className="mb-5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <p className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider mb-2">✦ Sourced by You ({(sourcedMap[selectedJob.id] || []).length})</p>
                        <div className="flex flex-wrap gap-2">
                          {(sourcedMap[selectedJob.id] || []).map(cid => {
                            const c = candidates.find(x => x.id === cid);
                            if (!c) return null;
                            return (
                              <div key={cid} className="flex items-center gap-1.5 bg-white border border-emerald-100 rounded-lg px-2 py-1 group">
                                <img src={c.avatar} alt={c.name} className="w-5 h-5 rounded-full object-cover" />
                                <span className="text-xs font-semibold text-slate-800">{c.name}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                  getFitScore(c, selectedJob) >= 75 ? 'bg-emerald-100 text-emerald-700' :
                                  getFitScore(c, selectedJob) >= 40 ? 'bg-amber-100 text-amber-700' :
                                                                      'bg-rose-100 text-rose-700'
                                }`}>{getFitScore(c, selectedJob)}%</span>
                                <button
                                  onClick={() => setSourcedMap(prev => ({
                                    ...prev,
                                    [selectedJob.id]: (prev[selectedJob.id] || []).filter(id => id !== cid)
                                  }))}
                                  className="w-4 h-4 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                                  title="Remove from sourced"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {/* View toggle */}
                    {(() => {
                      // Candidates who applied to this specific job and are NOT sourced
                      const sourcedIds = sourcedMap[selectedJob.id] || [];
                      const applicantsForJob = candidates.filter(c =>
                        c.followedJobIds?.includes(selectedJob.id) && !sourcedIds.includes(c.id)
                      );
                      const freshCandidates = applicantsForJob.filter(c => 
                        !shortlisted.includes(c.id) && !rejected.includes(c.id) && !skipped.includes(c.id)
                      );
                      const skippedCandidates = skipped
                        .map(id => applicantsForJob.find(c => c.id === id))
                        .filter(c => c !== undefined) as typeof applicantsForJob;
                      const unevaluatedCandidates = [...freshCandidates, ...skippedCandidates];
                      return (
                      <>
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-xs text-slate-500">
                        <span className="font-bold text-slate-800">{applicantsForJob.length}</span> applicants for this role
                      </p>
                      <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-bold">
                        <button
                          onClick={() => setDeckView('stack')}
                          className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
                            deckView === 'stack' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5" /> Stack View
                        </button>
                        <button
                          onClick={() => setDeckView('list')}
                          className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors border-l border-slate-200 ${
                            deckView === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <LayoutList className="w-3.5 h-3.5" /> List View
                        </button>
                      </div>
                    </div>

                    {/* STACK VIEW & LIST VIEW cross-fade container */}
                    <AnimatePresence mode="wait">
                      {deckView === 'stack' && (
                        <motion.div 
                          key="stack"
                          initial={{ opacity: 0, y: 15 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: -15 }} 
                          transition={{ duration: 0.2 }}
                          className="flex flex-col items-center"
                        >
                        {applicantsForJob.length === 0 ? (
                          <div className="text-center py-10 space-y-3">
                            <div className="text-4xl">📭</div>
                            <h4 className="font-bold text-slate-900 text-sm">No applicants yet</h4>
                            <p className="text-xs text-slate-500 max-w-xs">
                              No one has applied to this role yet. Head to the <strong>Talent Market</strong> tab to source candidates directly.
                            </p>
                          </div>
                        ) : unevaluatedCandidates.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-10 space-y-4"
                          >
                            <div className="text-5xl">🎉</div>
                            <h4 className="font-bold text-slate-900 text-base">All applicants reviewed!</h4>
                            <p className="text-sm text-slate-500">
                              You reviewed <strong>{applicantsForJob.length}</strong> applicants —
                              <span className="text-emerald-600 font-bold"> {shortlisted.length} shortlisted</span> and 
                              <span className="text-rose-600 font-bold"> {rejected.length} rejected</span>.
                            </p>
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => { setShortlisted([]); setRejected([]); setSkipped([]); }}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
                              >
                                Restart Deck
                              </button>
                              <button
                                onClick={() => setDeckView('list')}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-colors"
                              >
                                View Shortlisted List
                              </button>
                            </div>
                          </motion.div>
                        ) : (
                          <>
                            <p className="text-[10px] text-slate-400 mb-4 font-mono">
                              ← Reject &nbsp;|&nbsp; ↑ Skip &nbsp;|&nbsp; → Shortlist &nbsp;(keyboard hotkeys)
                            </p>
                            <div className="relative w-full max-w-sm" style={{ height: '340px' }}>
                              {[2, 1].map(offset => {
                                const ghost = unevaluatedCandidates[offset];
                                if (!ghost) return null;
                                return (
                                  <div
                                    key={ghost.id}
                                    className="absolute inset-x-0 bg-white border border-slate-100 rounded-2xl shadow-sm"
                                    style={{
                                      top: `${offset * 8}px`,
                                      left: `${offset * 6}px`,
                                      right: `${offset * 6}px`,
                                      bottom: 0,
                                      zIndex: 10 - offset,
                                      transform: `scale(${1 - offset * 0.025})`
                                    }}
                                  />
                                );
                              })}
                              {(() => {
                                const card = unevaluatedCandidates[0];
                                if (!card) return null;
                                const fit = getFitScore(card, selectedJob);
                                const swipeClass =
                                  swipeDir === 'left'  ? 'animate-swipe-left'  :
                                  swipeDir === 'right' ? 'animate-swipe-right' :
                                  swipeDir === 'up'    ? 'animate-swipe-up'    : '';
                                return (
                                  <motion.div
                                    key={card.id}
                                    className={`absolute inset-0 bg-white border border-slate-200 rounded-2xl shadow-md p-5 flex flex-col z-20 select-none ${swipeClass}`}
                                    onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY; }}
                                    onTouchEnd={(e) => {
                                      const dx = e.changedTouches[0].clientX - touchStartX.current;
                                      const dy = e.changedTouches[0].clientY - touchStartY.current;
                                      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
                                        advanceDeck(dx < 0 ? 'left' : 'right', card.id, applicantsForJob.length);
                                      } else if (dy < -60) {
                                        advanceDeck('up', card.id, applicantsForJob.length);
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <img src={card.avatar} alt={card.name} className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-100" />
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 text-sm">{card.name}</h4>
                                        <p className="text-xs text-slate-500">{card.title}</p>
                                        <div className="mt-1">
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            fit >= 75 ? 'bg-emerald-100 text-emerald-700' :
                                            fit >= 40 ? 'bg-amber-100 text-amber-700' :
                                                       'bg-rose-100 text-rose-700'
                                          }`}>{fit}% fit</span>
                                        </div>
                                      </div>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                        card.status === 'Open for Offers' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        card.status === 'Interviewing' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-slate-50 text-slate-600 border-slate-100'
                                      }`}>{card.status}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 mt-3 leading-relaxed italic flex-1 overflow-hidden line-clamp-3">"{card.bio}"</p>
                                    <div className="mt-3 space-y-1">
                                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Skills
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {card.skills.slice(0, 5).map(s => (
                                          <span key={s} className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 rounded text-[10px] font-semibold text-emerald-800 flex items-center gap-0.5">
                                            <Check className="w-2.5 h-2.5" /> {s}
                                          </span>
                                        ))}
                                        {card.skills.length > 5 && <span className="text-[10px] text-slate-400">+{card.skills.length - 5} more</span>}
                                      </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 text-center mt-2">
                                      {applicantsForJob.length - unevaluatedCandidates.length + 1} / {applicantsForJob.length}
                                    </p>
                                  </motion.div>
                                );
                              })()}
                            </div>
                            <div className="flex items-center gap-4 mt-6">
                              <button
                                id="tinder-reject-btn"
                                onClick={() => { const c = unevaluatedCandidates[0]; if(c) advanceDeck('left', c.id, applicantsForJob.length); }}
                                className="flex flex-col items-center gap-1 group"
                              >
                                <span className="w-14 h-14 rounded-full bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm">
                                  <ThumbsDown className="w-6 h-6 text-rose-500" />
                                </span>
                                <span className="text-[10px] text-rose-500 font-bold">Reject</span>
                              </button>
                              <button
                                id="tinder-skip-btn"
                                onClick={() => { const c = unevaluatedCandidates[0]; if(c) advanceDeck('up', c.id, applicantsForJob.length); }}
                                className="flex flex-col items-center gap-1 group"
                              >
                                <span className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm">
                                  <SkipForward className="w-5 h-5 text-slate-500" />
                                </span>
                                <span className="text-[10px] text-slate-500 font-bold">Skip</span>
                              </button>
                              <button
                                id="tinder-shortlist-btn"
                                onClick={() => { const c = unevaluatedCandidates[0]; if(c) advanceDeck('right', c.id, applicantsForJob.length); }}
                                className="flex flex-col items-center gap-1 group"
                              >
                                <span className="w-14 h-14 rounded-full bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm">
                                  <ThumbsUp className="w-6 h-6 text-emerald-500" />
                                </span>
                                <span className="text-[10px] text-emerald-600 font-bold">Shortlist</span>
                              </button>
                            </div>
                          </>
                        )}
                        </motion.div>
                      )}

                      {/* LIST VIEW — applicants + sourced */}
                      {deckView === 'list' && (
                        <motion.div 
                          key="list"
                          initial={{ opacity: 0, y: 15 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: -15 }} 
                          transition={{ duration: 0.2 }}
                          className="space-y-2" id="applicants-list-view"
                        >
                        {applicantsForJob.length === 0 && (sourcedMap[selectedJob.id] || []).length === 0 && (
                          <p className="text-xs text-slate-400 text-center py-6">No applicants or sourced candidates yet.</p>
                        )}
                        {applicantsForJob.map(c => {
                          const fit = getFitScore(c, selectedJob);
                          const isShortlisted = shortlisted.includes(c.id);
                          const isRejected = rejected.includes(c.id);
                          const isSkipped = skipped.includes(c.id);
                          return (
                            <div key={c.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                              isShortlisted ? 'bg-emerald-50 border-emerald-200' :
                              isRejected    ? 'bg-rose-50 border-rose-200 opacity-60' :
                              isSkipped     ? 'bg-slate-50 border-slate-200 opacity-80' :
                                              'bg-white border-slate-100'
                            }`}>
                              <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-lg object-cover" />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 text-xs">{c.name}</p>
                                <p className="text-[10px] text-slate-500">{c.title}</p>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                fit >= 75 ? 'bg-emerald-100 text-emerald-700' :
                                fit >= 40 ? 'bg-amber-100 text-amber-700' :
                                           'bg-rose-100 text-rose-700'
                              }`}>{fit}% fit</span>
                              {isShortlisted && (
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-emerald-600">✓ Shortlisted</span>
                                  <button 
                                    onClick={() => setShortlisted(prev => prev.filter(id => id !== c.id))} 
                                    className="text-[10px] text-slate-400 hover:text-slate-600 underline font-semibold transition-colors"
                                  >
                                    Undo
                                  </button>
                                </div>
                              )}
                              {isRejected && (
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-rose-500">✕ Rejected</span>
                                  <button 
                                    onClick={() => setRejected(prev => prev.filter(id => id !== c.id))} 
                                    className="text-[10px] text-slate-400 hover:text-slate-600 underline font-semibold transition-colors"
                                  >
                                    Undo
                                  </button>
                                </div>
                              )}
                              {isSkipped && (
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-slate-500">⏭ Skipped</span>
                                  <button 
                                    onClick={() => setSkipped(prev => prev.filter(id => id !== c.id))} 
                                    className="text-[10px] text-slate-400 hover:text-slate-600 underline font-semibold transition-colors"
                                  >
                                    Undo
                                  </button>
                                </div>
                              )}
                              {!isShortlisted && !isRejected && !isSkipped && (
                                <div className="flex gap-1">
                                  <button onClick={() => advanceDeck('left', c.id, applicantsForJob.length)} className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold rounded-lg transition-colors">✕</button>
                                  <button onClick={() => advanceDeck('right', c.id, applicantsForJob.length)} className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-lg transition-colors">✓</button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    </>
                      );
                    })()}
                  </div>
                )}

                {/* ── TAB 2: Syllabus Path Editor (placeholder) ── */}
                {jobDetailTab === 'syllabus' && (
                  <div className="p-8 text-center space-y-3" id="job-detail-syllabus">
                    <div className="text-4xl">🗺️</div>
                    <h4 className="font-bold text-slate-900 text-sm">Syllabus Path Editor</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Define the skill node sequence required for this role. Candidates will see their progress along this path.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mt-3">
                      {selectedJob.skillsNeeded.map((s, i) => (
                        <div key={s} className="flex items-center gap-1.5">
                          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                          <span className="px-2 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-semibold text-indigo-800">{s}</span>
                          {i < selectedJob.skillsNeeded.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Job cards grid ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-mono text-indigo-650 font-bold uppercase tracking-wider">Active Recruiter Vacancies</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Live Recruiter Listings</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Click a job card to screen applicants or edit the syllabus path.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => { setSelectedJob(job); setJobDetailTab('applicants'); }}
                  className={`bg-slate-50 border rounded-2xl p-5 hover:shadow-md transition-all space-y-3 flex flex-col justify-between cursor-pointer ${
                    selectedJob?.id === job.id ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-100 hover:border-indigo-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-base shadow-sm">
                          {job.logo || '💼'}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs leading-tight">{job.title}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">{job.company}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-750 text-[10px] font-mono font-bold rounded-full border border-indigo-100/40">
                          {job.applicantsCount} Applicants
                        </span>
                        {(sourcedMap[job.id] || []).length > 0 && (
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-full border border-emerald-100">
                            {(sourcedMap[job.id] || []).length} Sourced ✦
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-3 leading-relaxed line-clamp-3">
                      {job.description}
                    </p>

                    <div className="pt-3 space-y-1">
                      <div className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">Required Skills</div>
                      <div className="flex flex-wrap gap-1">
                        {job.skillsNeeded.map(s => (
                          <span key={s} className="px-1.5 py-0.5 bg-white border border-slate-150 text-slate-650 text-[10px] rounded font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/50 flex justify-between items-center text-[10px] text-slate-450 font-mono">
                    <span>{job.type} • {job.location}</span>
                    <span className="font-bold text-slate-700">{job.salary}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fit assessment Modal (Algorithmic Venn Analysis) */}
      <AnimatePresence>
        {focusedCandidate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" id="fit-assessment-modal">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full border border-slate-100 shadow-2xl space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3.5">
                  <img src={focusedCandidate.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">Match Assessment: {focusedCandidate.name}</h3>
                    <p className="text-xs text-slate-500">{focusedCandidate.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setFocusedCandidate(null)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Job Selector Context */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 font-mono">Select Vacancy to Assess Fit against:</label>
                <select
                  id="focused-job-select"
                  value={assessAgainstJob}
                  onChange={(e) => setAssessAgainstJob(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-5"
                >
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.company} — {j.title}</option>
                  ))}
                </select>
              </div>

              {/* Assessment Visual Venn Breakdown */}
              {assessAgainstJob && (
                (() => {
                  const { matching, lacking, jobTitle } = getVennAnalysis(focusedCandidate, assessAgainstJob);
                  const job = jobs.find(j => j.id === assessAgainstJob);
                  const total = matching.length + lacking.length;
                  const percent = total > 0 ? Math.round((matching.length / total) * 100) : 100;

                  return (
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">OVERALL DEEP CORRELATION</span>
                          <span className="text-xs text-indigo-750 font-bold block">{jobTitle} Match Score</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-2xl font-black ${
                            percent === 100 ? 'text-emerald-600' : percent >= 50 ? 'text-indigo-600' : 'text-rose-500'
                          }`}>{percent}%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Verified Matches */}
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 py-1.5 px-2 rounded-lg flex items-center justify-between border border-emerald-100">
                            <span>✅ Verified Match ({matching.length})</span>
                            <span className="text-[10px] font-mono">Zero Bias Guaranteed</span>
                          </div>
                          
                          {matching.length > 0 ? (
                            <div className="space-y-1.5">
                              {matching.map(s => (
                                <div key={s} className="text-xs bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center gap-1.5">
                                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                  <span className="font-bold text-slate-800">{s}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">No verified direct competency overlaps exist in candidate ledger.</p>
                          )}
                        </div>

                        {/* Deficit / Gaps list */}
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-slate-700 bg-slate-100 py-1.5 px-2 rounded-lg flex items-center justify-between border border-slate-200">
                            <span>⚠️ Deficit Competencies ({lacking.length})</span>
                            <span className="text-[10px] font-mono text-indigo-600 font-bold">Auto-Guided Upstream</span>
                          </div>

                          {lacking.length > 0 ? (
                            <div className="space-y-1.5">
                              {lacking.map(s => (
                                <div key={s} className="text-xs bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex flex-col">
                                  <span className="font-bold text-slate-600">{s} (Deficit)</span>
                                  {/* Auto-prescribe course */}
                                  {(() => {
                                    const matchingCourse = courses.find(c => c.skillsGranted.includes(s));
                                    if (matchingCourse) {
                                      return (
                                        <span className="text-[10px] text-indigo-600 font-semibold mt-1 font-mono">
                                          → Prescribed Syllabus: {matchingCourse.title}
                                        </span>
                                      );
                                    }
                                    return <span className="text-[10px] text-slate-400 mt-1 font-mono">→ No syllabus requested yet.</span>;
                                  })()}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl text-center">
                              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                              <p className="text-xs text-emerald-800 font-bold">Perfect FIT Overlap</p>
                              <p className="text-[10px] text-emerald-600 mt-0.5">Candidate presents pristine compatibility with requirements.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Visual Skill Match Tree Overlay */}
                      {job && (
                        (() => {
                          let activeTreePath: 'Full-Stack' | 'AI Specialist' | 'Product Designer' | 'Product Manager' = 'Full-Stack';
                          const needed = job.skillsNeeded;
                          if (needed.some(s => ['Gemini API', 'AI Engineering', 'Large Language Models', 'Prompt Engineering'].includes(s))) {
                            activeTreePath = 'AI Specialist';
                          } else if (needed.some(s => ['Typography', 'UI/UX', 'Figma', 'Design Systems'].includes(s))) {
                            activeTreePath = 'Product Designer';
                          } else if (needed.some(s => ['A/B Testing', 'User Retention', 'Funnel Analytics', 'PLG'].includes(s))) {
                            activeTreePath = 'Product Manager';
                          }

                          return (
                            <div className="space-y-2 pt-4 border-t border-slate-100">
                              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Visual Competency Graph Comparison ({SKILL_TREES[activeTreePath].title})</span>
                                       <div className="relative border border-slate-200 rounded-xl bg-slate-50 p-2 overflow-hidden select-none" style={{ height: '220px' }}>
                                {/* Radial dots grid */}
                                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
                                  backgroundImage: 'radial-gradient(circle, #818cf8 1px, transparent 1px)', 
                                  backgroundSize: '12px 12px' 
                                }} />

                                {/* SVG connectors */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                  <defs>
                                    <linearGradient id="recruiter-glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                      <stop offset="0%" stopColor="#10b981" />
                                      <stop offset="100%" stopColor="#6366f1" />
                                    </linearGradient>
                                  </defs>
                                  {(() => {
                                    const nodes = SKILL_TREES[activeTreePath].nodes;
                                    const connections = getPathConnections(activeTreePath);

                                    return connections.map((conn, idx) => {
                                      const fromNode = nodes.find(n => n.name === conn.from);
                                      const toNode = nodes.find(n => n.name === conn.to);

                                      if (!fromNode || !toNode) return null;

                                      // Scale coordinates to fit Recruiter card height [0..220]
                                      const scaleX = (x: number) => 35 + (x / 760) * 540;
                                      const scaleY = (y: number) => 25 + (y / 350) * 150;

                                      const startX = scaleX(fromNode.x);
                                      const startY = scaleY(fromNode.y);
                                      const endX = scaleX(toNode.x);
                                      const endY = scaleY(toNode.y);

                                      const d = `M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${(startX + endX) / 2} ${endY}, ${endX} ${endY}`;

                                      const fromUnlocked = focusedCandidate.skills.includes(fromNode.name);
                                      const toUnlocked = focusedCandidate.skills.includes(toNode.name);

                                      let strokeColor = '#e2e8f0';
                                      let strokeDash = undefined;
                                      let strokeWidth = 1.5;

                                      if (fromUnlocked && toUnlocked) {
                                        strokeColor = 'url(#recruiter-glow-grad)';
                                        strokeWidth = 2.5;
                                      } else if (fromUnlocked) {
                                        strokeColor = '#94a3b8';
                                        strokeDash = '3,3';
                                      }

                                      return (
                                        <path 
                                          key={idx}
                                          d={d}
                                          fill="none"
                                          stroke={strokeColor}
                                          strokeWidth={strokeWidth}
                                          strokeDasharray={strokeDash}
                                        />
                                      );
                                    });
                                  })()}
                                </svg>

                                {/* Nodes */}
                                <div className="absolute inset-0">
                                  {SKILL_TREES[activeTreePath].nodes.map(node => {
                                    const isRequired = job.skillsNeeded.includes(node.name);
                                    const isUnlocked = focusedCandidate.skills.includes(node.name);
                                    const mastery = isUnlocked ? (focusedCandidate.skillLevels?.[node.name] || 'Intermediate') : 'Locked';

                                    // Scale coordinates
                                    const scaleX = (x: number) => 35 + (x / 760) * 540;
                                    const scaleY = (y: number) => 25 + (y / 350) * 150;

                                    const nodeStyle = {
                                      position: 'absolute' as const,
                                      left: `${scaleX(node.x)}px`,
                                      top: `${scaleY(node.y)}px`,
                                      transform: 'translate(-50%, -50%)',
                                      zIndex: 10
                                    };

                                    let nodeClass = '';
                                    if (isRequired) {
                                      if (isUnlocked) {
                                        nodeClass = 'bg-emerald-50 border border-emerald-500 text-emerald-700 shadow-sm';
                                      } else {
                                        nodeClass = 'bg-rose-50 border border-dashed border-rose-400 text-rose-700 shadow-sm';
                                      }
                                    } else {
                                      if (isUnlocked) {
                                        nodeClass = 'bg-slate-100 border border-slate-300 text-slate-650';
                                      } else {
                                        nodeClass = 'bg-slate-200/50 border border-slate-200 text-slate-400';
                                      }
                                    }

                                    return (
                                      <div 
                                        key={node.name}
                                        style={nodeStyle}
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center relative transition-all group ${nodeClass}`}
                                        title={`${node.name}: ${isUnlocked ? `Verified ${mastery}` : isRequired ? 'Deficit (Required)' : 'Locked'}`}
                                      >
                                        <div className="scale-75 text-inherit">
                                          {renderSkillIcon(node.name)}
                                        </div>

                                        {/* Tooltip on hover */}
                                        <div className="absolute opacity-0 group-hover:opacity-100 bg-slate-900 border border-slate-800 p-2 rounded shadow-2xl text-[10px] text-white pointer-events-none transition-all w-36 text-center z-50" style={{ bottom: '40px', left: '50%', transform: 'translateX(-50%)' }}>
                                          <p className="font-bold">{node.name}</p>
                                          <p className="mt-0.5 text-slate-400">
                                            {isUnlocked ? `Verified Mastery: ${mastery}` : isRequired ? 'Deficit Required' : 'Locked'}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      )}
                    </div>
                  );
                })()
              )}

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <a 
                  href={`mailto:${focusedCandidate.email}?subject=CareerOS Opportunities Discovery — Fit Evaluation Verification`}
                  onClick={() => setFocusedCandidate(null)}
                  className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white font-bold py-3 rounded-xl text-xs text-center transition-all shadow-md shadow-indigo-100"
                >
                  Invite to Fast-Track Hiring Conversation
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Toast notification ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
