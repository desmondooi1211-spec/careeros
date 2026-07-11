'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (loginError) {
        setError(loginError.message);
      } else if (data?.user) {
        // Redirect to dashboard
        router.push('/');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during login.');
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
            Welcome back
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Access your CareerOS dashboard
          </p>
        </div>

        {/* Demo Credentials Tip for Judges */}
        <div className="mb-6 p-4 bg-slate-950/80 border border-slate-800/85 rounded-2xl text-xs text-slate-400 flex items-start gap-2.5">
          <HelpCircle className="w-4.5 h-4.5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-slate-300">Hackathon Sandbox Profiles:</div>
            <div>
              <span className="text-blue-400 font-mono">candidate@careeros.my</span> (Password: <span className="text-slate-300 font-mono">password</span>)
            </div>
            <div>
              <span className="text-violet-400 font-mono">recruiter@maybank.my</span> (Password: <span className="text-slate-300 font-mono">password</span>)
            </div>
          </div>
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
                <p className="font-semibold text-rose-300 mb-0.5">Authentication Error</p>
                <p className="text-rose-400/90 leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
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
            className="w-full py-4 px-6 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 select-none cursor-pointer mt-6 shadow-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Logging in...' : 'Log In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link 
              href="/signup" 
              className="font-semibold text-blue-500 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
