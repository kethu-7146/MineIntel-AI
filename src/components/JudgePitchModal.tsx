import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Award, Clock, Volume2, ChevronRight } from 'lucide-react';

interface JudgePitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

interface PitchStage {
  timeRange: string;
  startSec: number;
  endSec: number;
  action: string;
  tabKey: string;
  whatToSay: string;
  proTip: string;
}

const PITCH_STAGES: PitchStage[] = [
  {
    timeRange: '0:00 – 0:30',
    startSec: 0,
    endSec: 30,
    action: 'Introduction & Problem Hook',
    tabKey: 'upload',
    whatToSay: '“CMPDI geologists produce 900+ technical mining reports annually, manually synthesizing drill logs, assays, and legacy scans. MineIntel AI is not just a chatbot — it is a document-grounded intelligence platform purpose-built for CMPDI and CIL subsidiaries.”',
    proTip: 'Establish problem severity: 900+ reports, CIL target of 781+ MT coal output.',
  },
  {
    timeRange: '0:30 – 1:15',
    startSec: 30,
    endSec: 75,
    action: 'Multi-Source Document Ingestion',
    tabKey: 'upload',
    whatToSay: '“Here we ingest our sample North Karanpura Barakar geological report (PDF), SECL Bilaspur production sheet (Excel), and an aged scanned borehole log. Notice our schema-driven ingestion assigns UUIDs and validates file security.”',
    proTip: 'Highlight support for PDF, Excel, CSV, and Scanned images (Multi-source ingestion pipeline).',
  },
  {
    timeRange: '1:15 – 2:00',
    startSec: 75,
    endSec: 120,
    action: 'Extraction, OCR & Table Parsing',
    tabKey: 'extraction',
    whatToSay: '“Our extraction engine uses PyMuPDF for digital text and seamlessly falls back to Tesseract OCR when text density is low. Here you can see parsed borehole lithology tables and proximate assay data with 99% extraction accuracy.”',
    proTip: 'Show OCR vs digital text toggle and parsed table rows.',
  },
  {
    timeRange: '2:00 – 3:30',
    startSec: 120,
    endSec: 210,
    action: 'Grounded Q&A Demo',
    tabKey: 'qa',
    whatToSay: '“Let’s ask a technical question: ‘What was North Karanpura coal production in 2024 and stripping ratio?’ MineIntel retrieves the exact page chunk via TF-IDF and generates an answer strictly grounded in the document, showing the exact formula calculation.”',
    proTip: 'Emphasize that the AI is forbidden from free-generating ungrounded figures.',
  },
  {
    timeRange: '3:30 – 4:15',
    startSec: 210,
    endSec: 255,
    action: 'Click Source/Page Evidence Link',
    tabKey: 'qa',
    whatToSay: '“When I click this citation pill [Doc: CMPDI-NK-01 | Page 73], we can immediately inspect the raw page evidence buffer. This guarantees 100% auditability for regulatory submissions.”',
    proTip: 'Click the source pill to open the Grounding Evidence Inspector.',
  },
  {
    timeRange: '4:15 – 5:00',
    startSec: 255,
    endSec: 300,
    action: 'Multi-Year & Subsidiary Comparison',
    tabKey: 'analytics',
    whatToSay: '“Here we compare SECL Gevra Mega OCP (52.5 MT) against Kusmunda and Dipka opencast mines, alongside 5-year overburden excavation trends and stripping ratios.”',
    proTip: 'Show the interactive Recharts production graphs.',
  },
  {
    timeRange: '5:00 – 5:45',
    startSec: 300,
    endSec: 345,
    action: 'Discrepancy Validation Engine',
    tabKey: 'discrepancy',
    whatToSay: '“When two geological reports disagree — like 10.20 MT vs 11.70 MT on Page 61 — we do not pick a winner arbitrarily. We raise a clear validation warning requiring human-geologist signoff.”',
    proTip: 'Demonstrate the "Signoff as Verified by Geologist" button.',
  },
  {
    timeRange: '5:45 – 7:00',
    startSec: 345,
    endSec: 420,
    action: '1-Click CMPDI PDF Report Generation',
    tabKey: 'report',
    whatToSay: '“With one click, MineIntel AI auto-compiles the official CMPDI Technical Report complete with UNFC resource categorizations, 5-year audit tables, discrepancy logs, and certified page citations.”',
    proTip: 'Click "Download Official PDF Report" and show the formatted PDF output.',
  },
  {
    timeRange: '7:00 – 8:00',
    startSec: 420,
    endSec: 480,
    action: 'Measured Impact & Closing',
    tabKey: 'upload',
    whatToSay: '“In benchmark tests across 50 ground-truth mining facts: 96.4% extraction accuracy, 98.2% citation accuracy, and 78% reduction in report compilation time — from 18 hours down to under 3 minutes.”',
    proTip: 'End confidently and invite stakeholder questions.',
  },
];

export const JudgePitchModal: React.FC<JudgePitchModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          const nextStage = PITCH_STAGES.findIndex((s) => next >= s.startSec && next < s.endSec);
          if (nextStage !== -1) setActiveStageIdx(nextStage);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  if (!isOpen) return null;

  const currentStage = PITCH_STAGES[activeStageIdx] || PITCH_STAGES[0];
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-4xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2 flex-wrap">
                <span>Executive Pitch Walkthrough Script</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-medium px-2 py-0.5 rounded border border-blue-400/30">
                  CMPDI Platform
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Synchronized step-by-step live demo walkthrough for technical and domain stakeholders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer Control Header */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-xl font-mono font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 flex items-center gap-2 shadow-xs">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{formatTime(seconds)}</span>
              <span className="text-xs text-slate-500 font-normal">/ 08:00</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs ${
                  isRunning
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isRunning ? 'Pause' : 'Start Timer'}</span>
              </button>

              <button
                onClick={() => {
                  setSeconds(0);
                  setIsRunning(false);
                  setActiveStageIdx(0);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition flex items-center gap-1 shadow-xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1">
            Current Cue: <strong className="text-blue-700 font-semibold">{currentStage.timeRange}</strong>
          </div>
        </div>

        {/* Script Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Active Stage Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-200">
                  {currentStage.timeRange}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{currentStage.action}</h3>
              </div>

              <button
                onClick={() => {
                  onNavigateTab(currentStage.tabKey);
                  onClose();
                }}
                className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-xs"
              >
                <span>Jump to this Tab</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span>Presenter Script (What to say out loud):</span>
              </label>
              <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed italic">
                {currentStage.whatToSay}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
              <span className="font-semibold">Evaluation Tip:</span> {currentStage.proTip}
            </div>
          </div>

          {/* Timeline of all 8 Stages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Full 8-Minute Stage Sequence:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PITCH_STAGES.map((stg, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setActiveStageIdx(i);
                    setSeconds(stg.startSec);
                  }}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                    activeStageIdx === i
                      ? 'bg-blue-50 border-blue-400 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 font-mono text-[11px]">
                    <span className="text-blue-700 font-medium">{stg.timeRange}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 rounded px-1.5 py-0.5">
                      Step {i + 1}
                    </span>
                  </div>
                  <div className="text-slate-900 truncate">{stg.action}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
