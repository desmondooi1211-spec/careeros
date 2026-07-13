'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
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
  Lock,
  Compass,
  Users,
  BookOpen,
  Plus,
  Award,
  Settings
} from 'lucide-react';

export default function Home() {
  const router = useRouter();

  // Navigation: "marketplace" | "candidate" | "recruiter"
  const [activePage, setActivePage] = useState<'marketplace' | 'candidate' | 'recruiter'>('marketplace');

  // Navigation tabs state
  const [candidateTab, setCandidateTab] = useState<'learning' | 'roadmaps' | 'profile' | 'opportunities'>('learning');
  const [recruiterTab, setRecruiterTab] = useState<'talent' | 'post-job' | 'my-jobs' | 'curriculum'>('talent');

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
    const roleLabel = targetRole === 'candidate' ? 'Candidate (Khor Ming Yao)' : 'Recruiter (Teh Meng Chang)';
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

  // Keyboard shortcuts listener for switching views (1, 2, 3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target && 
        (target.tagName === 'INPUT' || 
         target.tagName === 'TEXTAREA' || 
         target.isContentEditable)
      ) {
        return;
      }

      if (e.key === '1') {
        setActivePage('marketplace');
      } else if (e.key === '2') {
        if (userRole === 'recruiter') {
          handleSwitchRoleWithConfirmation('candidate');
        } else {
          setActivePage('candidate');
        }
      } else if (e.key === '3') {
        if (userRole === 'candidate') {
          handleSwitchRoleWithConfirmation('recruiter');
        } else {
          setActivePage('recruiter');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userRole]);

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

    // Add this job to the current user's followedJobIds so they appear
    // in the recruiter's Tinder deck for this role
    setCandidates(prevCands => prevCands.map(cand => {
      if (cand.isCurrentUser) {
        return {
          ...cand,
          followedJobIds: [...(cand.followedJobIds || []), jobId]
        };
      }
      return cand;
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
      
      {/* Main Workspace with Left Sidebar */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-55px)] w-full">
        {/* Left Workspace Sidebar (60px) - Hidden on Mobile */}
        <aside className="hidden md:flex w-16 bg-white border-r border-slate-200 flex-col justify-between items-center py-4 z-20 shadow-sm flex-shrink-0" id="sidebar-main">
          {/* Navigation group */}
          <div className="flex flex-col items-center space-y-4 w-full">
            
            {/* Global Page Switchers in Sidebar */}
            <div className="flex flex-col items-center space-y-2 pb-4 border-b border-slate-105 w-full">
              <button
                onClick={() => setActivePage('marketplace')}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                  activePage === 'marketplace'
                    ? 'text-white'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
                title="Coexistence Marketplace"
              >
                {activePage === 'marketplace' && (
                  <motion.div
                    layoutId="active-sidebar-pill"
                    className="absolute inset-0 bg-indigo-600 rounded-xl -z-10 shadow-md shadow-indigo-100"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Layers className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  if (userRole === 'recruiter') {
                    handleSwitchRoleWithConfirmation('candidate');
                    return;
                  }
                  setActivePage('candidate');
                }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                  activePage === 'candidate' && userRole !== 'recruiter'
                    ? 'text-white'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
                title="My Learning Desk"
              >
                {activePage === 'candidate' && userRole !== 'recruiter' && (
                  <motion.div
                    layoutId="active-sidebar-pill"
                    className="absolute inset-0 bg-indigo-600 rounded-xl -z-10 shadow-md shadow-indigo-100"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <GraduationCap className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  if (userRole === 'candidate') {
                    handleSwitchRoleWithConfirmation('recruiter');
                    return;
                  }
                  setActivePage('recruiter');
                }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                  activePage === 'recruiter' && userRole !== 'candidate'
                    ? 'text-white'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
                title="Hiring Hub"
              >
                {activePage === 'recruiter' && userRole !== 'candidate' && (
                  <motion.div
                    layoutId="active-sidebar-pill"
                    className="absolute inset-0 bg-indigo-600 rounded-xl -z-10 shadow-md shadow-indigo-100"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Building2 className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs specific to workspaces */}
            {activePage === 'candidate' && userRole !== 'recruiter' && (
              <div className="flex flex-col items-center space-y-3 pt-2">
                <button
                  onClick={() => setCandidateTab('roadmaps')}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                    candidateTab === 'roadmaps'
                      ? 'text-white'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                  title="My Path (Skill Tree)"
                >
                  {candidateTab === 'roadmaps' && (
                    <motion.div
                      layoutId="active-candidate-tab-pill"
                      className="absolute inset-0 bg-slate-900 rounded-xl -z-10 shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Compass className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCandidateTab('learning')}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                    candidateTab === 'learning'
                      ? 'text-white'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                  title="Learning Academy"
                >
                  {candidateTab === 'learning' && (
                    <motion.div
                      layoutId="active-candidate-tab-pill"
                      className="absolute inset-0 bg-slate-900 rounded-xl -z-10 shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <BookOpen className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCandidateTab('profile')}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                    candidateTab === 'profile'
                      ? 'text-white'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                  title="Verified Portfolio"
                >
                  {candidateTab === 'profile' && (
                    <motion.div
                      layoutId="active-candidate-tab-pill"
                      className="absolute inset-0 bg-slate-900 rounded-xl -z-10 shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Award className="w-5 h-5 relative z-10" />
                  {activeCurrentUser.skills.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center z-20">
                      {activeCurrentUser.skills.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setCandidateTab('opportunities')}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                    candidateTab === 'opportunities'
                      ? 'text-white'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                  title="Discover Jobs"
                >
                  {candidateTab === 'opportunities' && (
                    <motion.div
                      layoutId="active-candidate-tab-pill"
                      className="absolute inset-0 bg-slate-900 rounded-xl -z-10 shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Briefcase className="w-5 h-5 relative z-10" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center z-20">
                    {jobs.length}
                  </span>
                </button>
              </div>
            )}

            {activePage === 'recruiter' && userRole !== 'candidate' && (
              <div className="flex flex-col items-center space-y-3 pt-2">
                <button
                  onClick={() => setRecruiterTab('talent')}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                    recruiterTab === 'talent'
                      ? 'text-white'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                  title="Talent Market"
                >
                  {recruiterTab === 'talent' && (
                    <motion.div
                      layoutId="active-recruiter-tab-pill"
                      className="absolute inset-0 bg-slate-900 rounded-xl -z-10 shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Users className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setRecruiterTab('post-job')}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                    recruiterTab === 'post-job'
                      ? 'text-white'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                  title="Post Live Listing"
                >
                  {recruiterTab === 'post-job' && (
                    <motion.div
                      layoutId="active-recruiter-tab-pill"
                      className="absolute inset-0 bg-slate-900 rounded-xl -z-10 shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setRecruiterTab('my-jobs')}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                    recruiterTab === 'my-jobs'
                      ? 'text-white'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                  title="My Posted Jobs"
                >
                  {recruiterTab === 'my-jobs' && (
                    <motion.div
                      layoutId="active-recruiter-tab-pill"
                      className="absolute inset-0 bg-slate-900 rounded-xl -z-10 shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Briefcase className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setRecruiterTab('curriculum')}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                    recruiterTab === 'curriculum'
                      ? 'text-white'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                  title="Syllabus Upstream Requests"
                >
                  {recruiterTab === 'curriculum' && (
                    <motion.div
                      layoutId="active-recruiter-tab-pill"
                      className="absolute inset-0 bg-slate-900 rounded-xl -z-10 shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <BookOpen className="w-5 h-5 relative z-10" />
                  {courseRequests.filter(r => r.status === 'Pending').length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center z-20">
                      {courseRequests.filter(r => r.status === 'Pending').length}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Bottom Settings & Reset */}
          <div className="flex flex-col items-center space-y-3 w-full">
            <button
              onClick={handleResetWorkspace}
              className="w-9 h-9 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-all"
              title="Reset Playground Data"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 rounded-lg text-slate-400 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-all"
              title="System Configuration"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Workspace Scrollable Stage Viewport */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between bg-slate-50" id="stage-viewport-container">
          <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1" id="stage-viewport">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
                className="w-full flex-grow flex flex-col"
              >
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
                      setRecruiterTab('talent');
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
                    activeTab={candidateTab}
                    setActiveTab={setCandidateTab}
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
                    activeTab={recruiterTab}
                    setActiveTab={setRecruiterTab}
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
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Informative Footer */}
          <footer className="bg-white border-t border-slate-150 py-4 px-4 text-center text-xs text-slate-450 font-mono" id="app-footer">
            <div className="w-full space-y-1">
              <p>© 2026 CareerOS Unified Pipeline Network. All rights reserved.</p>
              <p className="text-[10px] text-slate-400">
                Powered by consensus curriculum verification engines. Bridging physical supply vectors with demand patterns in real-time.
              </p>
            </div>
          </footer>
        </div>

        {/* Mobile Bottom Navigation Bar - Only visible on small viewports */}
        <nav className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-30 justify-around items-center px-2 shadow-lg" id="mobile-bottom-nav">
          {activePage === 'candidate' && userRole !== 'recruiter' && (
            <>
              <button
                onClick={() => setActivePage('marketplace')}
                className="flex flex-col items-center justify-center flex-1 h-full text-slate-400 hover:text-slate-600 transition-colors"
                title="Marketplace"
              >
                <Layers className="w-5 h-5" />
                <span className="text-[8px] font-extrabold mt-1 uppercase tracking-wider font-mono">Market</span>
              </button>
              <button
                onClick={() => setCandidateTab('learning')}
                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                  candidateTab === 'learning' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-655'
                }`}
                title="Academy"
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-[8px] font-extrabold mt-1 uppercase tracking-wider font-mono">Academy</span>
              </button>
              <button
                onClick={() => setCandidateTab('roadmaps')}
                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                  candidateTab === 'roadmaps' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-655'
                }`}
                title="My Path"
              >
                <Compass className="w-5 h-5" />
                <span className="text-[8px] font-extrabold mt-1 uppercase tracking-wider font-mono">My Path</span>
              </button>
              <button
                onClick={() => setCandidateTab('profile')}
                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                  candidateTab === 'profile' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-655'
                }`}
                title="Portfolio"
              >
                <div className="relative">
                  <Award className="w-5 h-5" />
                  {activeCurrentUser.skills.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-emerald-500 text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                      {activeCurrentUser.skills.length}
                    </span>
                  )}
                </div>
                <span className="text-[8px] font-extrabold mt-1 uppercase tracking-wider font-mono">Portfolio</span>
              </button>
              <button
                onClick={() => setCandidateTab('opportunities')}
                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                  candidateTab === 'opportunities' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-655'
                }`}
                title="Discover Jobs"
              >
                <div className="relative">
                  <Briefcase className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-indigo-500 text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                    {jobs.length}
                  </span>
                </div>
                <span className="text-[8px] font-extrabold mt-1 uppercase tracking-wider font-mono">Jobs</span>
              </button>
            </>
          )}

          {activePage === 'recruiter' && userRole !== 'candidate' && (
            <>
              <button
                onClick={() => setActivePage('marketplace')}
                className="flex flex-col items-center justify-center flex-1 h-full text-slate-400 hover:text-slate-600 transition-colors"
                title="Marketplace"
              >
                <Layers className="w-5 h-5" />
                <span className="text-[8px] font-extrabold mt-1 uppercase tracking-wider font-mono">Market</span>
              </button>
              <button
                onClick={() => setRecruiterTab('talent')}
                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                  recruiterTab === 'talent' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-655'
                }`}
                title="Search Candidates"
              >
                <Users className="w-5 h-5" />
                <span className="text-[8px] font-extrabold mt-1 uppercase tracking-wider font-mono">Talent</span>
              </button>
              <button
                onClick={() => setRecruiterTab('post-job')}
                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                  recruiterTab === 'post-job' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-655'
                }`}
                title="Post Live Listing"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[8px] font-extrabold mt-1 uppercase tracking-wider font-mono">Post</span>
              </button>
              <button
                onClick={() => setRecruiterTab('my-jobs')}
                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                  recruiterTab === 'my-jobs' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-655'
                }`}
                title="My Posted Jobs"
              >
                <Briefcase className="w-5 h-5" />
                <span className="text-[8px] font-extrabold mt-1 uppercase tracking-wider font-mono">My Jobs</span>
              </button>
              <button
                onClick={() => setRecruiterTab('curriculum')}
                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                  recruiterTab === 'curriculum' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-655'
                }`}
                title="Requests"
              >
                <div className="relative">
                  <BookOpen className="w-5 h-5" />
                  {courseRequests.filter(r => r.status === 'Pending').length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-500 text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                      {courseRequests.filter(r => r.status === 'Pending').length}
                    </span>
                  )}
                </div>
                <span className="text-[8px] font-extrabold mt-1 uppercase tracking-wider font-mono">Requests</span>
              </button>
            </>
          )}

          {activePage === 'marketplace' && (
            <>
              <button
                className="flex flex-col items-center justify-center flex-1 h-full text-indigo-600 font-bold"
                title="Marketplace"
              >
                <Layers className="w-5 h-5" />
                <span className="text-[8px] font-extrabold mt-1 uppercase tracking-wider font-mono">Marketplace</span>
              </button>
              <button
                onClick={() => {
                  if (userRole === 'recruiter') {
                    handleSwitchRoleWithConfirmation('candidate');
                    return;
                  }
                  setActivePage('candidate');
                }}
                className="flex flex-col items-center justify-center flex-1 h-full text-slate-400 hover:text-slate-600 transition-colors"
                title="Candidate view"
              >
                <GraduationCap className="w-5 h-5" />
                <span className="text-[8px] font-extrabold mt-1 uppercase tracking-wider font-mono">Candidate</span>
              </button>
              <button
                onClick={() => {
                  if (userRole === 'candidate') {
                    handleSwitchRoleWithConfirmation('recruiter');
                    return;
                  }
                  setActivePage('recruiter');
                }}
                className="flex flex-col items-center justify-center flex-1 h-full text-slate-400 hover:text-slate-655 transition-colors"
                title="Recruiter view"
              >
                <Building2 className="w-5 h-5" />
                <span className="text-[8px] font-extrabold mt-1 uppercase tracking-wider font-mono">Recruiter</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Hide Next.js dev portal on mobile screens to prevent blocking bottom nav clicks */}
      <style>{`
        @media (max-width: 767px) {
          nextjs-portal,
          #__next-prerender-indicator,
          [data-nextjs-dialog-overlay] {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        }
      `}</style>
    </div>
  );
}
