'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!name.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            name
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
      } else if (data?.user) {
        // Redirection to main page workspace
        router.push('/');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3 animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Create your account
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Join the unified national talent network
          </p>
        </div>

        {/* Role Picker (Tabs) */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 border border-slate-800/60 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setRole('candidate')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              role === 'candidate'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Candidate
          </button>
          <button
            type="button"
            onClick={() => setRole('recruiter')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              role === 'recruiter'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Recruiter
          </button>
        </div>

        {/* Error Alert */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key={error}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                x: [0, -10, 10, -10, 10, -5, 5, 0] 
              }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ 
                x: { duration: 0.5, ease: "easeInOut" },
                opacity: { duration: 0.2 },
                y: { duration: 0.2 },
                scale: { duration: 0.2 }
              }}
              className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-rose-400 text-sm mb-6 shadow-lg shadow-rose-950/20"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
              <div className="flex-1">
                <p className="font-semibold text-rose-300 mb-0.5">Registration Error</p>
                <p className="text-rose-400/90 leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500 text-white pl-11 pr-4 py-3.5 rounded-2xl outline-none transition text-sm placeholder-slate-600"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500 text-white pl-11 pr-4 py-3.5 rounded-2xl outline-none transition text-sm placeholder-slate-600"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500 text-white pl-11 pr-4 py-3.5 rounded-2xl outline-none transition text-sm placeholder-slate-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 select-none cursor-pointer mt-6 shadow-xl ${
              role === 'candidate'
                ? 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/20 active:scale-98'
                : 'bg-violet-600 hover:bg-violet-500 hover:shadow-violet-500/20 active:scale-98'
            } disabled:opacity-50 disabled:pointer-events-none`}
          >
            {loading ? 'Creating account...' : 'Create Account'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className={`font-semibold hover:underline ${
                role === 'candidate' ? 'text-blue-500' : 'text-violet-500'
              }`}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
