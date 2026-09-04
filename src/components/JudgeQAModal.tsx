import React, { useState } from 'react';
import { JUDGE_QA_ITEMS } from '../data/sampleMiningData';
import { JudgeQAItem } from '../types';
import { X, HelpCircle, Sparkles, ShieldAlert, ChevronRight } from 'lucide-react';

interface JudgeQAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const JudgeQAModal: React.FC<JudgeQAModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<JudgeQAItem>(JUDGE_QA_ITEMS[0]);
  const [revealAnswer, setRevealAnswer] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2 flex-wrap">
                <span>Technical Q&A Stress-Test Simulator</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-medium px-2 py-0.5 rounded border border-rose-400/30">
                  CMPDI Stress-Test
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                The 5 critical technical and domain questions evaluated in mining audits + evidence-based answers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: List of 5 Questions */}
          <div className="md:col-span-1 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Select Question:
            </div>
            {JUDGE_QA_ITEMS.map((item) => {
              const isSelected = selectedQuestion.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedQuestion(item);
                    setRevealAnswer(true);
                  }}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-400 dark:border-blue-600 text-blue-950 dark:text-blue-200 shadow-xs'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">{item.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-medium ${
                      item.difficulty === 'Critical Stress Test' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}>
                      {item.difficulty}
                    </span>
                  </div>
                  <div className="text-xs line-clamp-2 leading-snug font-medium">
                    {item.question}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right 2 Columns: Flashcard Detail */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-4 shadow-xs">
              {/* Question Header */}
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                    {selectedQuestion.id} • {selectedQuestion.category}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    Difficulty: <strong className="text-rose-600 dark:text-rose-400 font-semibold">{selectedQuestion.difficulty}</strong>
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedQuestion.question}
                </h3>
              </div>

              {/* Why Evaluators Ask This Box */}
              <div className="bg-white dark:bg-slate-850 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-xs text-slate-800 dark:text-slate-200">
                <div className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Why Technical Evaluators Probe This:</span>
                </div>
                <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                  {selectedQuestion.whyJudgesAsk}
                </p>
              </div>

              {/* Winning Answer Box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Enterprise Architecture Defense:</span>
                  </label>
                  <button
                    onClick={() => setRevealAnswer(!revealAnswer)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    {revealAnswer ? 'Hide Answer' : 'Show Answer'}
                  </button>
                </div>

                {revealAnswer && (
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed space-y-2 animate-fadeIn">
                    <p className="italic">{selectedQuestion.winningAnswer}</p>
                  </div>
                )}
              </div>

              {/* On-The-Spot Demo Action */}
              <div className="bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-blue-900 dark:text-blue-300 font-semibold">Live Verification:</strong> {selectedQuestion.demoAction}
                </div>

                <button
                  onClick={() => {
                    if (selectedQuestion.id === 'Q1') onNavigateTab('upload');
                    else if (selectedQuestion.id === 'Q2') onNavigateTab('qa');
                    else if (selectedQuestion.id === 'Q3') onNavigateTab('report');
                    else if (selectedQuestion.id === 'Q4') onNavigateTab('upload');
                    else onNavigateTab('extraction');
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-xs font-semibold shrink-0 flex items-center gap-1 transition shadow-xs cursor-pointer"
                >
                  <span>Perform Demo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
