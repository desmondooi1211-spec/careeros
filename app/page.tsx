'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import CandidateWorkspace from '@/components/CandidateWorkspace';
import RecruiterWorkspace from '@/components/RecruiterWorkspace';
import SharedMarketplace from '@/components/SharedMarketplace';
import LandingPage from '@/components/LandingPage';
import { 
  INITIAL_COURSES, 
  INITIAL_CANDIDATES, 
  INITIAL_JOBS, 
  INITIAL_REQUESTS 
} from '@/lib/mockData';
import { Course, Candidate, Job, CourseRequest, Project } from '@/lib/types';
import { 
  Layers, 
  Sparkles, 
  Database, 
  HelpCircle, 
  Info, 
  RefreshCcw, 
  Search, 
  GraduationCap, 
  Briefcase, 
  Building2,
  Lock 
} from 'lucide-react';

export default function Home() {
  const router = useRouter();

  // Navigation: "marketplace" | "candidate" | "recruiter"
  const [activePage, setActivePage] = useState<'marketplace' | 'candidate' | 'recruiter'>('marketplace');

  // Auth States
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [authLoading, setAuthLoading] = useState(true);

  // Core global synchronized states
  const [courses, setCourses] = useState<Course[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [courseRequests, setCourseRequests] = useState<CourseRequest[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  // Track state initialized
  const [isLoaded, setIsLoaded] = useState(false);
  const [preselectedCandidate, setPreselectedCandidate] = useState<Candidate | null>(null);

  // Verify and sync Auth user
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          setUser(null);
          return;
        }
        setUser(currentUser);
        const role = currentUser.user_metadata?.role || 'candidate';
        setUserRole(role);
        
        // Start recruiters on Hiring Hub or Marketplace
        if (role === 'recruiter') {
          setActivePage('recruiter');
        }
      } catch (err) {
        console.error('Session verification failed:', err);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkUserSession();
  }, [router]);

  // Synchronize authenticated user details with Candidate profile
  useEffect(() => {
    if (!isLoaded || !user || userRole !== 'candidate') return;
    setCandidates(prev => prev.map(c => {
      if (c.isCurrentUser) {
        return {
          ...c,
          name: user.user_metadata?.name || c.name,
          email: user.email || c.email
        };
      }
      return c;
    }));
  }, [user, userRole, isLoaded]);

  const handleSwitchRoleWithConfirmation = async (targetRole: 'candidate' | 'recruiter') => {
    const roleLabel = targetRole === 'candidate' ? 'Candidate (Alex Carter / Khor Ming Yao)' : 'Recruiter (Teh Meng Chang)';
    const confirmSwitch = window.confirm(
      `[Prototype Sandbox] This section requires ${targetRole === 'candidate' ? 'Candidate' : 'Recruiter'} credentials.\n\nWould you like to temporarily switch your active prototype session to ${roleLabel} to test this feature?`
    );

    if (confirmSwitch) {
      if (targetRole === 'candidate') {
        localStorage.setItem('co_current_user_email', 'candidate@careeros.my');
        localStorage.setItem('co_current_user_role', 'candidate');
        localStorage.setItem('co_current_user_name', 'Khor Ming Yao');
        localStorage.setItem('co_current_user_id', 'mock-candidate-1');
      } else {
        localStorage.setItem('co_current_user_email', 'recruiter@maybank.my');
        localStorage.setItem('co_current_user_role', 'recruiter');
        localStorage.setItem('co_current_user_name', 'Teh Meng Chang');
        localStorage.setItem('co_current_user_id', 'mock-recruiter-1');
      }
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      setUserRole(targetRole);
      setActivePage(targetRole);
    }
  };

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedCourses = localStorage.getItem('career_os_courses');
      const storedCandidates = localStorage.getItem('career_os_candidates');
      const storedJobs = localStorage.getItem('career_os_jobs');
      const storedRequests = localStorage.getItem('career_os_requests');
      const storedAppId = localStorage.getItem('career_os_applied_ids');

      if (storedCourses) setCourses(JSON.parse(storedCourses));
      else setCourses(INITIAL_COURSES);

      if (storedCandidates) {
        const parsed = JSON.parse(storedCandidates);
        const updated = parsed.map((c: Candidate) => {
          if (c.isCurrentUser && (!c.skills || c.skills.length < 10)) {
            const defaultUser = INITIAL_CANDIDATES.find(u => u.isCurrentUser) || INITIAL_CANDIDATES[0];
            return {
              ...c,
              skills: defaultUser.skills,
              skillLevels: defaultUser.skillLevels
            };
          }
          return c;
        });
        setCandidates(updated);
      } else {
        setCandidates(INITIAL_CANDIDATES);
      }

      if (storedJobs) {
        const parsedJobs = JSON.parse(storedJobs);
        const isOldData = parsedJobs.some((j: any) => j.id === 'job-1' && j.skillsNeeded.length < 10);
        if (isOldData) {
          localStorage.setItem('career_os_jobs', JSON.stringify(INITIAL_JOBS));
          setJobs(INITIAL_JOBS);
        } else {
          setJobs(parsedJobs);
        }
      } else {
        setJobs(INITIAL_JOBS);
      }

      if (storedRequests) setCourseRequests(JSON.parse(storedRequests));
      else setCourseRequests(INITIAL_REQUESTS);

      if (storedAppId) setAppliedJobIds(JSON.parse(storedAppId));
      else setAppliedJobIds([]);

    } catch (e) {
      console.error('Failed to load CareerOS storage:', e);
      // Fallback
      setCourses(INITIAL_COURSES);
      setCandidates(INITIAL_CANDIDATES);
      setJobs(INITIAL_JOBS);
      setCourseRequests(INITIAL_REQUESTS);
      setAppliedJobIds([]);
    }
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage whenever state alters
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('career_os_courses', JSON.stringify(courses));
      localStorage.setItem('career_os_candidates', JSON.stringify(candidates));
      localStorage.setItem('career_os_jobs', JSON.stringify(jobs));
      localStorage.setItem('career_os_requests', JSON.stringify(courseRequests));
      localStorage.setItem('career_os_applied_ids', JSON.stringify(appliedJobIds));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }, [courses, candidates, jobs, courseRequests, appliedJobIds, isLoaded]);

  // Reset helper
  const handleResetWorkspace = () => {
    if (window.confirm('Are you sure you want to reset App state back to original setup? All your completed courses, projects, and vacancies will be restored.')) {
      localStorage.removeItem('career_os_courses');
      localStorage.removeItem('career_os_candidates');
      localStorage.removeItem('career_os_jobs');
      localStorage.removeItem('career_os_requests');
      localStorage.removeItem('career_os_applied_ids');
      
      setCourses(INITIAL_COURSES);
      setCandidates(INITIAL_CANDIDATES);
      setJobs(INITIAL_JOBS);
      setCourseRequests(INITIAL_REQUESTS);
      setAppliedJobIds([]);
      setActivePage('marketplace');
      
      // Trigger subtle page reload
      window.location.reload();
    }
  };

  // CANDIDATE ACTIONS
  const handleEnrollCourse = (courseId: string) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id === courseId) {
        return { ...course, enrolled: true, progress: 10 };
      }
      return course;
    }));
  };

  const handleCompleteCourse = (courseId: string) => {
    // 1. Mark course completed
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id === courseId) {
        return { ...course, enrolled: true, completed: true, progress: 100 };
      }
      return course;
    }));

    // Find skills granted by completed course
    const completedCourse = courses.find(c => c.id === courseId);
    if (!completedCourse) return;

    // 2. Inject skills dynamically into Candidate portfolio
    setCandidates(prevCands => prevCands.map(cand => {
      if (cand.isCurrentUser) {
        const updatedCourseIds = Array.from(new Set([...cand.completedCourseIds, courseId]));
        const updatedSkills = Array.from(new Set([...cand.skills, ...completedCourse.skillsGranted]));
        
        // Add default Intermediate level for completed courses
        const currentLevels = cand.skillLevels || {};
        const updatedLevels = { ...currentLevels };
        completedCourse.skillsGranted.forEach(skill => {
          if (updatedLevels[skill] !== 'Pro') {
            updatedLevels[skill] = 'Intermediate';
          }
        });

        return {
          ...cand,
          completedCourseIds: updatedCourseIds,
          skills: updatedSkills,
          skillLevels: updatedLevels
        };
      }
      return cand;
    }));
  };

  const handleUpdateTargetJob = (jobId: string | undefined) => {
    setCandidates(prevCands => prevCands.map(cand => {
      if (cand.isCurrentUser) {
        return {
          ...cand,
          targetJobId: jobId
        };
      }
      return cand;
    }));
  };

  const handleFollowJob = (jobId: string) => {
    setCandidates(prevCands => prevCands.map(cand => {
      if (cand.isCurrentUser) {
        const current = cand.followedJobIds || [];
        if (current.includes(jobId)) return cand;
        return {
          ...cand,
          followedJobIds: [...current, jobId]
        };
      }
      return cand;
    }));
  };

  const handleUnfollowJob = (jobId: string) => {
    setCandidates(prevCands => prevCands.map(cand => {
      if (cand.isCurrentUser) {
        return {
          ...cand,
          followedJobIds: (cand.followedJobIds || []).filter(id => id !== jobId)
        };
      }
      return cand;
    }));
  };

  const handleUpdateSkillLevel = (skillName: string, newLevel: 'Beginner' | 'Intermediate' | 'Pro') => {
    setCandidates(prevCands => prevCands.map(cand => {
      if (cand.isCurrentUser) {
        const levels = cand.skillLevels || {};
        return {
          ...cand,
          skillLevels: {
            ...levels,
            [skillName]: newLevel
          },
          skills: Array.from(new Set([...cand.skills, skillName]))
        };
      }
      return cand;
    }));
  };

  const handleAddProject = (newProjectData: Omit<Project, 'id'>) => {
    const freshProject: Project = {
      id: `proj-${Date.now()}`,
      ...newProjectData
    };

    setCandidates(prevCands => prevCands.map(cand => {
      if (cand.isCurrentUser) {
        // Automatically mark project skills as Beginner if not present
        const currentLevels = cand.skillLevels || {};
        const updatedLevels = { ...currentLevels };
        newProjectData.skills.forEach(skill => {
          if (!updatedLevels[skill]) {
            updatedLevels[skill] = 'Beginner';
          }
        });

        return {
          ...cand,
          projects: [...cand.projects, freshProject],
          skills: Array.from(new Set([...cand.skills, ...newProjectData.skills])),
          skillLevels: updatedLevels
        };
      }
      return cand;
    }));
  };

  const handleApplyJob = (jobId: string) => {
    if (appliedJobIds.includes(jobId)) return;

    // Log applied state
    setAppliedJobIds(prev => [...prev, jobId]);

    // Increment applicants counter for vacancy object
    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === jobId) {
        return { ...job, applicantsCount: job.applicantsCount + 1 };
      }
      return job;
    }));
  };

  const handleUpdateStatus = (newStatus: Candidate['status']) => {
    setCandidates(prevCands => prevCands.map(cand => {
      if (cand.isCurrentUser) {
        return { ...cand, status: newStatus };
      }
      return cand;
    }));
  };

  // RECRUITER ACTIONS
  const handleAddJob = (jobData: Omit<Job, 'id' | 'applicantsCount' | 'datePosted' | 'logo'>) => {
    const emojis = ['⚡', '▲', '🪐', '⚙️', '💎', '🛡️', '🧬', '🔮'];
    const randomBadge = emojis[Math.floor(Math.random() * emojis.length)];

    const freshJob: Job = {
      id: `job-${Date.now()}`,
      applicantsCount: 0,
      datePosted: 'Just now',
      logo: randomBadge,
      ...jobData
    };

    setJobs(prevJobs => [freshJob, ...prevJobs]);
  };

  const handleRequestCourse = (reqData: Omit<CourseRequest, 'id' | 'status' | 'dateRequested'>) => {
    const freshRequest: CourseRequest = {
      id: `req-${Date.now()}`,
      status: 'Pending',
      dateRequested: 'Just now',
      ...reqData
    };

    setCourseRequests(prevRequests => [freshRequest, ...prevRequests]);
  };

  // Upstream Course compiler:
  const handleApproveSyllabus = (requestId: string) => {
    const targetRequest = courseRequests.find(r => r.id === requestId);
    if (!targetRequest) return;

    // 1. Mark request Approved
    setCourseRequests(prevReqs => prevReqs.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'Approved' };
      }
      return req;
    }));

    // 2. Generate and structure a brand new active Course!
    const newCourseId = `course-requested-${Date.now()}`;
    const dynamicCourse: Course = {
      id: newCourseId,
      title: targetRequest.title,
      category: 'Engineering',
      description: targetRequest.description,
      duration: '10 hours',
      skillsGranted: targetRequest.skillsWanted,
      enrolled: false,
      completed: false,
      progress: 0,
      requestedByRecruiter: true,
      lessons: [
        {
          id: `${newCourseId}-l1`,
          title: `Verification Core: introduction to ${targetRequest.skillsWanted[0] || 'Modern Technologies'}`,
          content: `Welcome to the custom training course requested upstream by recruiters of ${targetRequest.company}.
          
Objective:
This syllabus bridges the localized deficit in high-demand industrial systems. By completing this certification, you prove your direct competency to our recruitment partners with standard evaluation bounds.

Key Requirements:
• Read through the conceptual requirements.
• Understand how ${targetRequest.skillsWanted.join(', ')} apply to global production architectures.`,
          quiz: {
            question: `Which core problem in the market did recruiters at ${targetRequest.company} intend to resolve by requesting this course?`,
            options: [
              `Fulfill gaps in ${targetRequest.skillsWanted[0] || 'Technical competency'} to fast-track hiring fit`,
              'To populate their email arrays arbitrarily',
              'To charge licensing fees to candidates',
              'No objective was declared'
            ],
            correctAnswer: 0
          }
        }
      ]
    };

    // Append course to candidate list
    setCourses(prevCourses => [...prevCourses, dynamicCourse]);
    alert(`Success! "${targetRequest.title}" is now structurally compiled and published to the available Candidate Course Academy dashboard!`);
  };

  // Get current active states stats
  const activeCurrentUser = candidates.find(c => c.isCurrentUser) || INITIAL_CANDIDATES[0];
  const candidateCompletedCount = courses.filter(c => c.completed).length;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-slate-350">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center animate-spin">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-semibold tracking-wide animate-pulse">Verifying CareerOS secure session...</p>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" id="career-os-root">
      
      {/* Top Global Header with Switcher */}
      <Header 
        currentPersona={activePage === 'recruiter' ? 'recruiter' : 'candidate'}
        setPersona={(pers) => {
          if (pers === 'recruiter' && userRole === 'candidate') {
            handleSwitchRoleWithConfirmation('recruiter');
            return;
          }
          if (pers === 'candidate' && userRole === 'recruiter') {
            handleSwitchRoleWithConfirmation('candidate');
            return;
          }
          setActivePage(pers === 'recruiter' ? 'recruiter' : 'candidate');
        }}
        candidateCompletedCount={candidateCompletedCount}
        totalJobsCount={jobs.length}
        userName={user?.user_metadata?.name}
        onLogout={handleLogout}
        userRole={userRole}
      />

      {/* Primary Shared Global Navigation System */}
      <nav className="bg-white border-b border-slate-150 py-3 px-4 sm:px-6 lg:px-8 shadow-sm relative z-30" id="global-sub-nav">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* Main Scope Switcher Tab Bar */}
          <div className="flex bg-slate-100 p-1 rounded-xl self-stretch sm:self-auto" id="scope-tab-bar">
            
            <button
              id="scope-btn-marketplace"
              onClick={() => setActivePage('marketplace')}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePage === 'marketplace'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Coexistence Marketplace</span>
            </button>

            <button
              id="scope-btn-candidate"
              onClick={() => {
                if (userRole === 'recruiter') {
                  handleSwitchRoleWithConfirmation('candidate');
                  return;
                }
                setActivePage('candidate');
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                userRole === 'recruiter'
                  ? 'opacity-65 text-slate-400 hover:text-slate-600'
                  : 'text-slate-600 hover:text-slate-900'
              } ${activePage === 'candidate' && userRole !== 'recruiter' ? 'bg-slate-900 text-white shadow-md' : ''}`}
            >
              {userRole === 'recruiter' ? (
                <Lock className="w-4 h-4 text-slate-400" />
              ) : (
                <GraduationCap className="w-4 h-4 text-indigo-400" />
              )}
              <span>My Learning Desk</span>
            </button>

            <button
              id="scope-btn-recruiter"
              onClick={() => {
                if (userRole === 'candidate') {
                  handleSwitchRoleWithConfirmation('recruiter');
                  return;
                }
                setActivePage('recruiter');
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                userRole === 'candidate'
                  ? 'opacity-65 text-slate-400 hover:text-slate-600'
                  : 'text-slate-600 hover:text-slate-900'
              } ${activePage === 'recruiter' && userRole !== 'candidate' ? 'bg-slate-900 text-white shadow-md' : ''}`}
            >
              {userRole === 'candidate' ? (
                <Lock className="w-4 h-4 text-slate-400" />
              ) : (
                <Building2 className="w-4 h-4 text-pink-400" />
              )}
              <span>Hiring Hub</span>
            </button>

          </div>

          {/* Sandbox Controls Information Bar */}
          <div className="flex items-center space-x-3 text-xs" id="sandbox-info-bar">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Info className="w-4 h-4 text-indigo-500" />
              <span className="hidden lg:inline">Toggle views to experience how learning automatically unlocks hiring options!</span>
              <span className="lg:hidden">Experiential Demo Active</span>
            </span>
            <button
              onClick={handleResetWorkspace}
              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700/80 rounded-lg text-[11px] font-bold border border-rose-100 flex items-center gap-1 transition-all cursor-pointer"
              title="Reset initial dataset parameters"
              id="reset-playground-btn"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> <span>Reset playground</span>
            </button>
          </div>

        </div>
      </nav>

      {/* Primary Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="stage-viewport">
        {activePage === 'marketplace' && (
          <SharedMarketplace 
            candidates={candidates}
            jobs={jobs}
            courses={courses}
            appliedJobIds={appliedJobIds}
            courseRequests={courseRequests}
            onSwitchToCandidate={() => {
              if (userRole === 'recruiter') {
                handleSwitchRoleWithConfirmation('candidate');
                return;
              }
              setActivePage('candidate');
            }}
            onSwitchToRecruiter={() => {
              if (userRole === 'candidate') {
                handleSwitchRoleWithConfirmation('recruiter');
                return;
              }
              setActivePage('recruiter');
            }}
            onEvaluateCandidate={async (cand) => {
              if (userRole === 'candidate') {
                const roleLabel = 'Recruiter (Teh Meng Chang)';
                const confirmSwitch = window.confirm(
                  `[Prototype Sandbox] Evaluating candidate fit requires Recruiter credentials.\n\nWould you like to temporarily switch your active prototype session to ${roleLabel} to assess ${cand.name}?`
                );
                if (!confirmSwitch) return;
                
                localStorage.setItem('co_current_user_email', 'recruiter@maybank.my');
                localStorage.setItem('co_current_user_role', 'recruiter');
                localStorage.setItem('co_current_user_name', 'Teh Meng Chang');
                localStorage.setItem('co_current_user_id', 'mock-recruiter-1');
                
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                setUser(currentUser);
                setUserRole('recruiter');
              }
              setPreselectedCandidate(cand);
              setActivePage('recruiter');
            }}
          />
        )}

        {activePage === 'candidate' && userRole !== 'recruiter' && (
          <CandidateWorkspace 
            courses={courses}
            candidate={activeCurrentUser}
            jobs={jobs}
            onEnroll={handleEnrollCourse}
            onCompleteCourse={handleCompleteCourse}
            onAddProject={handleAddProject}
            onApplyJob={handleApplyJob}
            onUpdateStatus={handleUpdateStatus}
            appliedJobIds={appliedJobIds}
            onUpdateTargetJob={handleUpdateTargetJob}
            onUpdateSkillLevel={handleUpdateSkillLevel}
            onFollowJob={handleFollowJob}
            onUnfollowJob={handleUnfollowJob}
          />
        )}

        {activePage === 'recruiter' && userRole !== 'candidate' && (
          <RecruiterWorkspace 
            candidates={candidates}
            courses={courses}
            jobs={jobs}
            courseRequests={courseRequests}
            onAddJob={handleAddJob}
            onRequestCourse={handleRequestCourse}
            onApproveSyllabus={handleApproveSyllabus}
            initialFocusedCandidate={preselectedCandidate}
            onClearInitialFocusedCandidate={() => setPreselectedCandidate(null)}
          />
        )}

        {/* Fallbacks for unauthorized direct page state manipulation */}
        {activePage === 'candidate' && userRole === 'recruiter' && (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-150 shadow-sm max-w-md mx-auto mt-12 gap-3">
            <Lock className="w-12 h-12 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800">Workspace Restricted</h2>
            <p className="text-sm text-slate-400 text-center">
              The Candidate Learning Desk is restricted to Candidate profiles. Switch back to Recruiter View in the top header.
            </p>
          </div>
        )}

        {activePage === 'recruiter' && userRole === 'candidate' && (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-150 shadow-sm max-w-md mx-auto mt-12 gap-3">
            <Lock className="w-12 h-12 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800">Workspace Restricted</h2>
            <p className="text-sm text-slate-400 text-center">
              The Recruiter Hiring Hub is restricted to Recruiter profiles. Switch back to Candidate View in the top header.
            </p>
          </div>
        )}
      </main>

      {/* Informative Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 px-4 mt-12 text-center text-xs text-slate-400 font-mono" id="app-footer">
        <div className="max-w-7xl mx-auto space-y-1">
          <p>© 2026 CareerOS Unified Pipeline Network. All rights reserved.</p>
          <p className="text-[10px] text-slate-350">
            Powered by consensus curriculum verification engines. Bridging physical supply vectors with demand patterns in real-time.
          </p>
        </div>
      </footer>
    </div>
  );
}
