import React, { useState, useEffect } from 'react';
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
  X 
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
              <span>Recruitment Command Center</span>
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

          {/* Candidates Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="candidates-grid">
            {filteredCandidates.map(cand => (
              <div 
                key={cand.id} 
                id={`candidate-card-${cand.id}`}
                className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between ${
                  cand.isCurrentUser ? 'ring-2 ring-indigo-500/40 bg-indigo-50/10' : ''
                }`}
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

                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight border ${
                        cand.status === 'Open for Offers' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        cand.status === 'Interviewing' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                        {cand.status}
                      </span>
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
              </div>
            ))}
          </div>
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
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-mono text-indigo-650 font-bold uppercase tracking-wider">Active Recruiter Vacancies</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Live Recruiter Listings</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Monitor active listings, required skill verification metrics, and live applicant volumes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:shadow-sm transition-all space-y-3 flex flex-col justify-between">
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
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-750 text-[10px] font-mono font-bold rounded-full border border-indigo-100/40">
                        {job.applicantsCount} Applicants
                      </span>
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
    </div>
  );
}
