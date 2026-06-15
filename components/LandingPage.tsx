'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Layers, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  Award, 
  Code2, 
  FileCheck,
  PlusCircle
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [activePreviewTab, setActivePreviewTab] = useState<'both' | 'candidate' | 'job'>('both');

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    })
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      
      {/* Glow effects */}
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[45%] h-[45%] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-900" id="landing-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-900/30">
              <Layers className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-sans font-extrabold text-xl tracking-tight text-white">CareerOS</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Unified Ecosystem
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium font-mono tracking-wider">LEARNING × HIRING PIPELINE</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-slate-400 hover:text-white text-sm font-semibold transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-indigo-600/20 active:scale-98 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center" id="landing-hero">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Badge */}
          <motion.div 
            variants={fadeInUp} 
            custom={0}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Introducing the Talentbank Hackathon Prototype</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            variants={fadeInUp} 
            custom={1}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent max-w-4xl mx-auto"
          >
            Where Learning and Hiring <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-500 bg-clip-text text-transparent">Coexist in One Feed</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={fadeInUp} 
            custom={2}
            className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            CareerOS is a single platform connecting two worlds that have always lived apart: learning and recruitment. 
            Upskill directly into hiring-ready proof, and let recruiters see your growth from day one.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={fadeInUp} 
            custom={3}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
          >
            <button
              onClick={() => router.push('/signup?role=candidate')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-950 font-bold text-sm tracking-wide shadow-xl hover:bg-slate-100 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Join as Candidate</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
            <button
              onClick={() => router.push('/signup?role=recruiter')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-white font-bold text-sm tracking-wide hover:bg-slate-850 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Join as Recruiter</span>
              <Building2 className="w-4 h-4 text-slate-400" />
            </button>
          </motion.div>

          {/* Reset Workspace tip for Judges */}
          <motion.div 
            variants={fadeInUp} 
            custom={4}
            className="mt-6 text-xs text-slate-500 font-mono flex items-center justify-center gap-2"
          >
            <span>👉 Already have a sandbox account?</span>
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
              Sign In Here
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Platform Overview Flow (Dual Journeys) */}
      <section className="relative z-10 py-16 border-t border-slate-900 bg-slate-950/40" id="platform-overview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              The Synced Platform Architecture
            </h2>
            <p className="mt-3 text-slate-400 text-sm max-w-xl mx-auto">
              How CareerOS integrates education and acquisition into a single, closed-loop telemetry system.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
            {/* Center dividing vertical line for larger screens */}
            <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-indigo-500/20 via-slate-800/10 to-transparent" />

            {/* Candidate Journey */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-2 border-b border-indigo-950">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-indigo-400">Candidate Flow</h3>
              </div>

              {/* Step 1 */}
              <div className="p-5 bg-slate-900/40 border border-slate-850 rounded-2xl flex items-start gap-4 hover:border-slate-800 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Take Specialized Courses</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Browse and enroll in high-demand industry courses. Take interactive quizzes to verify your functional capacity.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 bg-slate-900/40 border border-slate-850 rounded-2xl flex items-start gap-4 hover:border-slate-800 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Dynamic Portfolio Builds</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Course completions automatically inject verified skills directly into your digital portfolio. Add personal projects alongside.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 bg-slate-900/40 border border-slate-850 rounded-2xl flex items-start gap-4 hover:border-slate-800 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Listed on Marketplace</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Appear instantly on the active recruiter marketplace feed. Recruiters search for verified proof of skill, not self-reported text.
                  </p>
                </div>
              </div>
            </div>

            {/* Recruiter Journey */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-2 border-b border-violet-950">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-violet-400">Recruiter Flow</h3>
              </div>

              {/* Step 1 */}
              <div className="p-5 bg-slate-900/40 border border-slate-850 rounded-2xl flex items-start gap-4 hover:border-slate-800 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Post Jobs & Request Curriculum</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Post job openings with target tags. If the platform lacks a course preparing talent for your role, submit a curriculum request.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 bg-slate-900/40 border border-slate-850 rounded-2xl flex items-start gap-4 hover:border-slate-800 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-800/85 text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Browse Marketplace Feed</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Scan matching candidate profiles showing complete course transcripts and project code side-by-side in one unified screen.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 bg-slate-900/40 border border-slate-850 rounded-2xl flex items-start gap-4 hover:border-slate-800 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-800/85 text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Hire Verified Candidates</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Recruit directly with full visibility into course syllabus alignment, knowing skills are verified by curriculum engines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Marketplace Feed Preview (Coexistence Feed) */}
      <section className="relative z-10 py-20 border-t border-slate-900 bg-slate-900/20" id="marketplace-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              LIVE COEXISTENCE FEED PREVIEW
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mt-4">
              Candidates and Jobs Coexist in One Feed
            </h2>
            <p className="mt-3 text-slate-400 text-sm max-w-xl mx-auto">
              Instead of hiding data behind siloed pages, both candidate profiles and job vacancies sit together, facilitating mutual discovery.
            </p>
          </div>

          {/* Selector Tabs */}
          <div className="flex justify-center p-1 bg-slate-950 border border-slate-900 rounded-xl max-w-md mx-auto mb-8">
            <button
              onClick={() => setActivePreviewTab('both')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePreviewTab === 'both' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Coexistence Feed
            </button>
            <button
              onClick={() => setActivePreviewTab('candidate')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePreviewTab === 'candidate' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Candidate View
            </button>
            <button
              onClick={() => setActivePreviewTab('job')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePreviewTab === 'job' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Job Vacancies Only
            </button>
          </div>

          {/* Mock Feed Area */}
          <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl relative">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>SIMULATED FEED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              
              {/* Candidate Card (Shown for 'both' and 'candidate') */}
              {(activePreviewTab === 'both' || activePreviewTab === 'candidate') && (
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 mb-2">
                          VERIFIED TALENT
                        </span>
                        <h4 className="font-extrabold text-white text-base">Khor Ming Yao</h4>
                        <p className="text-xs text-slate-400">Frontend Engineer Candidate</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-850 flex items-center justify-center font-bold text-xs text-slate-300">
                        MY
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Completed Curriculum:</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs p-1.5 bg-slate-950/80 border border-slate-850 rounded-lg">
                          <span className="text-slate-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Next.js App Router Setup
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-400">100% Verified</span>
                        </div>
                        <div className="flex items-center justify-between text-xs p-1.5 bg-slate-950/80 border border-slate-850 rounded-lg">
                          <span className="text-slate-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Tailwind CSS Modern Styling
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-400">100% Verified</span>
                        </div>
                      </div>
                    </div>

                    {/* Skill Badges */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">React</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">Next.js</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">Tailwind CSS</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">TypeScript</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-850 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-mono text-[10px]">Active Status: Open for Hire</span>
                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                      <span>View Profile</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Job Vacancy Card (Shown for 'both' and 'job') */}
              {(activePreviewTab === 'both' || activePreviewTab === 'job') && (
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/15 mb-2">
                          ACTIVE JOB LISTING
                        </span>
                        <h4 className="font-extrabold text-white text-base">Junior Web Developer</h4>
                        <p className="text-xs text-slate-400">Maybank • Technology Hub</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-pink-900/30 flex items-center justify-center text-pink-400 text-lg shadow-sm">
                        ⚡
                      </div>
                    </div>

                    <p className="text-xs text-slate-450 mt-4 leading-relaxed line-clamp-3">
                      We are seeking a React developer to join our digital banking team to build clean customer-facing dashboards. Strong knowledge of CSS styling and state management is required.
                    </p>

                    <div className="mt-4">
                      <p className="text-xs text-slate-450 font-semibold mb-1.5 uppercase tracking-wider">Target Skills Needed:</p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-900/40 text-indigo-300 border border-indigo-800/30">React</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-900/40 text-indigo-300 border border-indigo-800/30">JavaScript</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-900/40 text-indigo-300 border border-indigo-800/30">State Management</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-850 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-mono text-[10px]">Posted: 2 days ago</span>
                    <Link href="/login" className="text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1">
                      <span>Apply Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Core Modules Grid */}
      <section className="relative z-10 py-20 border-t border-slate-900 bg-slate-950" id="landing-modules">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Complete System Infrastructure
            </h2>
            <p className="mt-3 text-slate-400 text-sm max-w-xl mx-auto">
              Everything built for CareerOS runs on a single, synchronized schema. No disconnected tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Module 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850/60 hover:border-slate-800 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Course Platform</h3>
                <p className="text-xs text-slate-450 mt-2 leading-relaxed">
                  Browse, enroll, and study modern technologies. Take customized lessons and solve validation quizzes to instantly trigger credential upgrades.
                </p>
              </div>
              <span className="text-[10px] text-indigo-400 font-mono font-bold mt-4 uppercase">Core Layer</span>
            </div>

            {/* Module 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850/60 hover:border-slate-800 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20 mb-4">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Dynamic Portfolio</h3>
                <p className="text-xs text-slate-450 mt-2 leading-relaxed">
                  A dynamic, public profile generated directly from your database records. Shows completed course transcripts and manual code project cards.
                </p>
              </div>
              <span className="text-[10px] text-violet-400 font-mono font-bold mt-4 uppercase">Core Layer</span>
            </div>

            {/* Module 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850/60 hover:border-slate-800 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Talent Marketplace</h3>
                <p className="text-xs text-slate-450 mt-2 leading-relaxed">
                  The flagship ecosystem dashboard. Both recruiters and candidates coexist in the feed side-by-side with filtering by target skill tags.
                </p>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold mt-4 uppercase">Core Layer</span>
            </div>

            {/* Module 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850/60 hover:border-slate-800 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20 mb-4">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Job Postings</h3>
                <p className="text-xs text-slate-450 mt-2 leading-relaxed">
                  Allows recruiters to draft vacancy details, targeting the exact course-certified competencies required. Direct link for candidates to apply.
                </p>
              </div>
              <span className="text-[10px] text-pink-400 font-mono font-bold mt-4 uppercase">Core Layer</span>
            </div>

            {/* Module 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850/60 hover:border-slate-800 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 mb-4">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Course Request System</h3>
                <p className="text-xs text-slate-450 mt-2 leading-relaxed">
                  Recruiters request new custom courses for skills lacking on-platform. Once approved, the platform compiles and deploys the syllabus.
                </p>
              </div>
              <span className="text-[10px] text-amber-400 font-mono font-bold mt-4 uppercase">Supporting</span>
            </div>

            {/* Module 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850/60 hover:border-slate-800 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 mb-4">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Role-Based Views</h3>
                <p className="text-xs text-slate-450 mt-2 leading-relaxed">
                  Separate Candidate and Recruiter workspaces operating on the same relational database. Restricts views to appropriate user credentials.
                </p>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono font-bold mt-4 uppercase">Supporting</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section / Paradigm Shift */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-900" id="philosophy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-mono tracking-widest text-indigo-400 uppercase">A NEW EDUCATION & RECRUITMENT PARADIGM</p>
          <blockquote className="mt-8 text-xl sm:text-2xl font-medium text-slate-250 italic leading-relaxed">
            &ldquo;Most platforms solve for one side of the equation. Job boards help recruiters broadcast openings; learning platforms help candidates build skills. CareerOS does both, and more importantly, connects them. A course completion is not just a line on a r&eacute;sum&eacute;&mdash;it&rsquo;s a live, employer-visible data point.&rdquo;
          </blockquote>
          <div className="mt-8 flex justify-center items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white leading-none">CareerOS System Design</p>
              <p className="text-xs text-slate-500 mt-1">Talentbank Hackathon Prototype</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-950 border-t border-slate-900 py-12 text-center text-xs text-slate-500 font-mono" id="landing-footer">
        <div className="max-w-7xl mx-auto space-y-3 px-4">
          <p>© 2026 CareerOS Unified Pipeline Network. All rights reserved.</p>
          <p className="text-[10px] text-slate-600 max-w-lg mx-auto leading-relaxed">
            Designed for the CareerOS hackathon proof-of-concept. Powered by consensus curriculum verification engines. 
            Bridging supply and demand vectors in real-time.
          </p>
        </div>
      </footer>
    </div>
  );
}
