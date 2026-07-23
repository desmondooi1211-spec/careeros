import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Mic, Play, CheckCircle2, Clock, ChevronRight, ShieldCheck, Award, ArrowRight, Sparkles, Cpu, X, AlertTriangle } from 'lucide-react';
import {
  traitOrder,
  traitLabels,
  criteriaLabels,
  evaluateSoftSkills,
  badgeTierColors,
  THINKING_DURATION,
  ANSWERING_DURATION,
  COOLDOWN_MS,
} from '@/lib/softSkillData';
import { SoftSkillBadge, SoftSkillEvaluation, SoftSkillTrait, CriteriaProfile } from '@/lib/types';

interface SoftSkillEvaluationProps {
  selectedQuestions: Record<SoftSkillTrait, string>;
  attemptCount: number;
  existingEvaluation?: SoftSkillEvaluation;
  onComplete: (evaluation: SoftSkillEvaluation) => void;
  onClose: () => void;
}

type QuestionPhase = 'thinking' | 'answering';
type EvalStep = 'intro' | 'q1' | 'q2' | 'q3' | 'q4' | 'processing' | 'score';

const stepToTrait: Record<EvalStep, SoftSkillTrait | null> = {
  intro: null,
  q1: 'communication',
  q2: 'leadership',
  q3: 'decisionMaking',
  q4: 'criticalThinking',
  processing: null,
  score: null,
};

const questionIndex: Record<EvalStep, number> = {
  intro: -1,
  q1: 0,
  q2: 1,
  q3: 2,
  q4: 3,
  processing: 4,
  score: 5,
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatCooldown(ms: number): string {
  if (ms <= 0) return '';
  const totalSeconds = Math.ceil(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export default function SoftSkillEvaluationDialog({
  selectedQuestions,
  attemptCount,
  existingEvaluation,
  onComplete,
  onClose,
}: SoftSkillEvaluationProps) {
  const [step, setStep] = useState<EvalStep>('intro');
  const [phase, setPhase] = useState<QuestionPhase>('thinking');
  const [thinkingTimeLeft, setThinkingTimeLeft] = useState(THINKING_DURATION);
  const [answeringTimeLeft, setAnsweringTimeLeft] = useState(ANSWERING_DURATION);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const thinkingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answeringTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const processingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [evaluated, setEvaluated] = useState<{
    profileByTrait: Record<SoftSkillTrait, CriteriaProfile>;
    badges: Record<SoftSkillTrait, SoftSkillBadge>;
  } | null>(null);

  const initialCooldown = existingEvaluation?.completedAt
    ? Math.max(0, existingEvaluation.completedAt + COOLDOWN_MS - Date.now())
    : 0;
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(initialCooldown);
  const cooldownActive = cooldownRemaining > 0;

  const progress = step === 'intro' ? 0 : step === 'score' ? 4 : (questionIndex[step] + 1);

  const isQuestionStep = (s: EvalStep): s is 'q1' | 'q2' | 'q3' | 'q4' =>
    s === 'q1' || s === 'q2' || s === 'q3' || s === 'q4';

  /* ── Camera ── */

  const startCamera = useCallback(async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        });
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraError(null);
      }
    } catch {
      setCameraError('Camera access denied or unavailable. You can proceed without it.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const clearTimers = useCallback(() => {
    if (thinkingTimerRef.current) { clearInterval(thinkingTimerRef.current); thinkingTimerRef.current = null; }
    if (answeringTimerRef.current) { clearInterval(answeringTimerRef.current); answeringTimerRef.current = null; }
    if (processingTimerRef.current) { clearTimeout(processingTimerRef.current); processingTimerRef.current = null; }
  }, []);

  /* ── Step navigation ── */

  const advanceStep = useCallback(() => {
    clearTimers();
    stopCamera();

    const stepOrder: EvalStep[] = ['intro', 'q1', 'q2', 'q3', 'q4'];
    const currentIdx = stepOrder.indexOf(step);

    if (currentIdx >= 0 && currentIdx < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIdx + 1];
      setStep(nextStep);
      setPhase('thinking');
      setThinkingTimeLeft(THINKING_DURATION);
      setAnsweringTimeLeft(ANSWERING_DURATION);
      setShowQuitConfirm(false);
      setTimeout(() => startCamera(), 200);
    } else if (step === 'q4') {
      setStep('processing');
      setShowQuitConfirm(false);
      setEvaluated(evaluateSoftSkills());
      processingTimerRef.current = setTimeout(() => {
        setStep('score');
      }, 2800);
    }
  }, [step, clearTimers, stopCamera, startCamera]);

  const skipToAnswering = useCallback(() => {
    if (thinkingTimerRef.current) { clearInterval(thinkingTimerRef.current); thinkingTimerRef.current = null; }
    setPhase('answering');
    setAnsweringTimeLeft(ANSWERING_DURATION);
  }, []);

  const handleQuit = useCallback(() => {
    clearTimers();
    stopCamera();
    setShowQuitConfirm(false);
    onClose();
  }, [clearTimers, stopCamera, onClose]);

  const handleConfirm = useCallback(() => {
    if (!evaluated) return;

    const evaluation: SoftSkillEvaluation = {
      attemptCount,
      selectedQuestions,
      profileByTrait: evaluated.profileByTrait,
      badges: evaluated.badges,
    };

    onComplete(evaluation);
  }, [attemptCount, selectedQuestions, onComplete, evaluated]);

  /* ── Cleanup ── */

  useEffect(() => {
    return () => { clearTimers(); stopCamera(); };
  }, [clearTimers, stopCamera]);

  /* ── Cooldown countdown ── */

  useEffect(() => {
    if (!existingEvaluation?.completedAt) return;
    const completedAt = existingEvaluation.completedAt;

    const updateRemaining = () => {
      const remaining = completedAt + COOLDOWN_MS - Date.now();
      setCooldownRemaining(Math.max(0, remaining));
    };
    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [existingEvaluation]);

  /* ── Timer effects ── */

  useEffect(() => {
    if (!isQuestionStep(step)) return;
    setShowQuitConfirm(false);

    if (phase === 'thinking') {
      thinkingTimerRef.current = setInterval(() => {
        setThinkingTimeLeft(prev => {
          if (prev <= 1) {
            if (thinkingTimerRef.current) { clearInterval(thinkingTimerRef.current); thinkingTimerRef.current = null; }
            setPhase('answering');
            setAnsweringTimeLeft(ANSWERING_DURATION);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (thinkingTimerRef.current) { clearInterval(thinkingTimerRef.current); thinkingTimerRef.current = null; } };
    }

    if (phase === 'answering') {
      answeringTimerRef.current = setInterval(() => {
        setAnsweringTimeLeft(prev => {
          if (prev <= 1) {
            if (answeringTimerRef.current) { clearInterval(answeringTimerRef.current); answeringTimerRef.current = null; }
            advanceStep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (answeringTimerRef.current) { clearInterval(answeringTimerRef.current); answeringTimerRef.current = null; } };
    }
  }, [step, phase, advanceStep]);

  /* ── Render ── */

  const isQuittable = isQuestionStep(step);
  const isScoreStep = step === 'score';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
        >
          {/* ── Top bar ── */}
          <div className="bg-slate-950 px-5 py-3.5 flex items-center justify-between border-b border-slate-800 font-mono text-xs shrink-0">
            <div className="flex items-center space-x-2.5 text-violet-400">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="font-bold tracking-wider">AI SOFT SKILL EVALUATION SYSTEM</span>
            </div>
            {(step === 'intro' || isQuittable) && (
              <button
                onClick={() => {
                  if (isQuittable) { setShowQuitConfirm(true); }
                  else { clearTimers(); stopCamera(); onClose(); }
                }}
                className="text-slate-500 hover:text-white transition-all font-bold hover:scale-105 cursor-pointer"
              >
                [QUIT]
              </button>
            )}
          </div>

          {/* ── Quit confirmation overlay ── */}
          <AnimatePresence>
            {showQuitConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-slate-950/90 flex items-center justify-center rounded-2xl"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-slate-800 border border-slate-700 rounded-2xl p-8 mx-6 max-w-sm text-center space-y-5"
                >
                  <div className="w-14 h-14 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-7 h-7 text-rose-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Quit Evaluation?</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      You will lose all progress and need to restart the entire test from Question 1. Are you sure you want to quit?
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowQuitConfirm(false)}
                      className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all cursor-pointer"
                    >
                      Continue Evaluation
                    </button>
                    <button
                      onClick={handleQuit}
                      className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-rose-600 text-slate-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
                    >
                      Quit & Lose Progress
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── INTRO ── */}
          {step === 'intro' && (
            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-violet-900/30">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">AI Soft Skill Evaluation</h2>
                <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  This evaluation will assess your soft skills across 4 competencies using AI-powered analysis of your spoken responses.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-400" />
                  What to expect
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-violet-400 font-mono mt-0.5">01</span>
                    <span>4 questions covering Communication, Leadership, Decision-Making, and Critical Thinking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-400 font-mono mt-0.5">02</span>
                    <span>1 minute to prepare your thoughts before each question</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-400 font-mono mt-0.5">03</span>
                    <span>5 minutes to deliver your spoken answer with camera on</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-400 font-mono mt-0.5">04</span>
                    <span>AI evaluates STAR structure, relevance, communication quality, depth, and confidence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-400 font-mono mt-0.5">05</span>
                    <span>Earn Bronze, Silver, or Gold badges verified on your portfolio</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-950/30 border border-amber-800/30 rounded-xl p-4 flex items-start gap-3">
                <Camera className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300/90">
                  Camera access is required for the evaluation experience. Your video is used for live preview only — nothing is recorded, stored, or uploaded.
                </p>
              </div>

              <button
                onClick={() => {
                  setStep('q1');
                  setPhase('thinking');
                  setThinkingTimeLeft(THINKING_DURATION);
                  setAnsweringTimeLeft(ANSWERING_DURATION);
                  setTimeout(() => startCamera(), 200);
                }}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-violet-900/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                Begin Evaluation
              </button>
            </div>
          )}

          {/* ── QUESTION STEPS ── */}
          {isQuestionStep(step) && (
            <div className="flex flex-col flex-1 min-h-0 relative">
              <div className="px-5 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-violet-400 font-bold">
                    Question {progress} of 4
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-violet-500/15 text-violet-300 font-mono tracking-wider border border-violet-500/20">
                    {traitLabels[stepToTrait[step]!]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span className={`text-sm font-mono font-bold ${phase === 'thinking' ? 'text-amber-400' : answeringTimeLeft <= 60 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {phase === 'thinking' ? formatTime(thinkingTimeLeft) : formatTime(answeringTimeLeft)}
                  </span>
                </div>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <p className="text-sm font-medium text-white leading-relaxed">
                    {selectedQuestions[stepToTrait[step]!]}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                  {phase === 'thinking' && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] border border-amber-500/20">
                      Present Duration: 5 Minutes
                    </span>
                  )}
                  {phase === 'answering' && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
                      RECORDING
                    </span>
                  )}
                </div>

                <div className="relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden aspect-video max-h-[300px]">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  {cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80">
                      <div className="text-center space-y-2 p-6">
                        <Camera className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="text-xs text-slate-500">{cameraError}</p>
                      </div>
                    </div>
                  )}
                  {!cameraError && phase === 'thinking' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70">
                      <Clock className="w-10 h-10 text-amber-400 mb-3 animate-pulse" />
                      <p className="text-sm font-bold text-white">Preparing to answer...</p>
                      <p className="text-xs text-slate-400 mt-1">Read the question and organize your thoughts</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-1.5 rounded-full transition-all ${
                        i < progress ? 'bg-violet-500' : i === progress ? 'bg-violet-500/50' : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>

                {phase === 'thinking' ? (
                  <button
                    onClick={skipToAnswering}
                    className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all shadow-lg shadow-violet-900/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    Start Answering
                  </button>
                ) : (
                  <button
                    onClick={advanceStep}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Done
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── PROCESSING ── */}
          {step === 'processing' && (
            <div className="p-12 flex flex-col items-center justify-center space-y-6 min-h-[300px]">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-violet-600/20 flex items-center justify-center">
                  <Cpu className="w-10 h-10 text-violet-400 animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-2xl border-2 border-violet-500/30 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-white">Analyzing your responses...</h3>
                <p className="text-xs text-slate-400">Evaluating STAR structure, relevance, confidence, and depth across all competencies</p>
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── SCORE SCREEN ── */}
          {step === 'score' && evaluated && (
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-xl font-black text-white">Evaluation Complete</h2>
                <p className="text-xs text-slate-400">AI Soft Skill Assessment Results</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {traitOrder.map(trait => {
                  const profile = evaluated.profileByTrait[trait];
                  return (
                    <div key={trait} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{traitLabels[trait]}</h4>
                        <BadgeIcon tier={profile.badge} size="sm" />
                      </div>
                      <div className="space-y-2">
                        {(Object.keys(criteriaLabels) as Array<keyof typeof criteriaLabels>).map(key => {
                          const val = profile[key as keyof CriteriaProfile] as { score: number; note: string };
                          if (!val || typeof val.score !== 'number') return null;
                          return (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 font-mono">{criteriaLabels[key]}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-300 truncate max-w-[140px]">{val.note}</span>
                                <span className="text-[10px] font-bold font-mono text-violet-400 whitespace-nowrap">{val.score}/5</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 text-center">Verified Soft Skill Badges</h4>
                <div className="flex justify-center gap-6">
                  {traitOrder.map(trait => (
                    <div key={trait} className="flex flex-col items-center gap-1.5">
                      <BadgeIcon tier={evaluated.badges[trait]} size="lg" />
                      <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">{traitLabels[trait]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Confirm & View Portfolio
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ── Badge Icon Component ── */

function BadgeIcon({ tier, size }: { tier: SoftSkillBadge; size: 'sm' | 'lg' }) {
  const c = badgeTierColors[tier];
  const dims = size === 'lg' ? 'w-16 h-16' : 'w-10 h-10';
  const innerDims = size === 'lg' ? 'w-12 h-12' : 'w-7 h-7';
  const labelSize = size === 'lg' ? 'text-[8px]' : 'text-[7px]';
  const starSize = size === 'lg' ? 'w-3 h-3' : 'w-2 h-2';

  return (
    <div className={`${dims} rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center ${c.glow} border-2 border-white/20`}>
      <div className={`${innerDims} rounded-full bg-white/15 border ${c.innerRing} flex flex-col items-center justify-center`}>
        <span className="text-white font-black leading-none" style={{ filter: c.iconGlow }}>
          {tier === 'gold' ? '★' : tier === 'silver' ? '◆' : '●'}
        </span>
        <span className={`${labelSize} text-white font-black tracking-tighter leading-none mt-0.5`}>
          {c.label}
        </span>
      </div>
    </div>
  );
}
