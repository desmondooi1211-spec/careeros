import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Download, RefreshCw, CheckCircle2, X, Loader2, Search, BarChart3, FileOutput } from 'lucide-react';
import { Candidate, BackgroundReportState } from '@/lib/types';
import { generateBackgroundReportHtml } from '@/lib/mockData';


interface BackgroundSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
  reportState: BackgroundReportState | null;
  onRunReport: (candidateId: string) => void;
  onReRunReport: (candidateId: string) => void;
}

const RUNNING_MESSAGES = [
  { icon: Search, text: 'Searching professional profiles...' },
  { icon: BarChart3, text: 'Analyzing activity patterns...' },
  { icon: FileOutput, text: 'Generating summary...' },
];

export default function BackgroundSummaryModal({
  isOpen,
  onClose,
  candidate,
  reportState,
  onRunReport,
  onReRunReport,
}: BackgroundSummaryModalProps) {
  const [runningStep, setRunningStep] = useState(-1);
  const [showReport, setShowReport] = useState(false);
  const timersRef = useRef<number[]>([]);

  const isRunning = reportState?.reportStatus === 'running';
  const isDone = reportState?.reportStatus === 'done';

  useEffect(() => {
    if (!isOpen || !isRunning) return;
    setRunningStep(-1);
    setShowReport(false);

    const timers: number[] = [];
    RUNNING_MESSAGES.forEach((_, i) => {
      const t = window.setTimeout(() => {
        setRunningStep(i);
      }, i * 1000);
      timers.push(t);
    });

    const doneTimer = window.setTimeout(() => {
      if (reportState?.candidateId) {
        onRunReport(reportState.candidateId);
      }
    }, 3000);
    timers.push(doneTimer);

    timersRef.current = timers;

    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [isOpen, isRunning]);

  useEffect(() => {
    if (!isOpen) {
      setRunningStep(-1);
      setShowReport(false);
      timersRef.current.forEach(window.clearTimeout);
    }
  }, [isOpen]);

  const handleViewReport = () => {
    const html = generateBackgroundReportHtml(candidate);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDownloadPdf = () => {
    const html = generateBackgroundReportHtml(candidate);
    const pw = window.open('', '_blank');
    if (pw) {
      pw.document.write(html);
      pw.document.close();
      pw.focus();
      setTimeout(() => pw.print(), 500);
    }
  };

  const handleReRun = () => {
    onReRunReport(candidate.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" id="background-summary-modal">
      <AnimatePresence mode="wait">
        {isRunning && (
          <motion.div
            key="running"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-slate-100 shadow-2xl space-y-6"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">AI Background Summary</h3>
                <p className="text-xs text-slate-500 mt-0.5">Scanning public profiles for {candidate.name}</p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-2">
              {RUNNING_MESSAGES.map((msg, idx) => {
                const Icon = msg.icon;
                const isActive = idx <= runningStep;
                const isCompleted = idx < runningStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-indigo-50 border border-indigo-100'
                        : 'bg-slate-50 border border-slate-100 opacity-40'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-600'
                          : isActive
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isActive ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold transition-colors ${
                          isActive ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {msg.text}
                      </p>
                      {isActive && !isCompleted && (
                        <div className="mt-1.5 w-full h-1 bg-indigo-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-indigo-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1, ease: 'easeInOut' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {isDone && !showReport && (
          <motion.div
            key="done"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-slate-100 shadow-2xl space-y-6"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Background Summary Complete</h3>
                <p className="text-xs text-slate-500 mt-0.5">{candidate.name}</p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-emerald-500" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold text-slate-900 text-lg">Report Ready</p>
                <p className="text-xs text-slate-500">
                  AI-powered background analysis has been compiled for {candidate.name}. Sources include LinkedIn, personal portfolio, and GitHub activity.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                <button
                  onClick={handleViewReport}
                  className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
                >
                  <FileText className="w-4 h-4" />
                  View Report
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  onClick={handleReRun}
                  className="px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Re-run
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
