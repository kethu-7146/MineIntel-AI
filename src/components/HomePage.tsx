import React from 'react';
import { DocumentItem, UserProfile } from '../types';
import {
  ArrowRight,
  FolderPlus,
  Cpu,
  Search,
  AlertTriangle,
  BarChart3,
  ChevronRight,
  Sparkles,
  Sliders,
} from 'lucide-react';

interface HomePageProps {
  documents?: DocumentItem[];
  onAddDocument?: (doc: DocumentItem) => void;
  onSelectDocument?: (id: string) => void;
  selectedDocId?: string;
  onNavigateTab: (tabId: string) => void;
  currentUser?: UserProfile | null;
  onOpenLogin: () => void;
  onSelectQuickProfile?: (user: UserProfile) => void;
  onOpenPitch?: () => void;
  onOpenJudgeQA?: () => void;
  onOpenBenchmark?: () => void;
  discrepancyCount: number;
}

export const HomePage: React.FC<HomePageProps> = ({
  documents = [],
  onNavigateTab,
  onOpenLogin,
  onOpenPitch,
  onOpenJudgeQA,
  onOpenBenchmark,
  discrepancyCount,
}) => {
  // Core Highlighted Modules - Purely essential mining document intelligence
  const primaryModules = [
    {
      id: 'report',
      moduleNumber: '1',
      title: 'Automated Report Generator',
      tagline: 'Instant technical synthesis',
      description: 'Automated conclusions, findings & reasons with PDF export',
      icon: <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      actionText: 'Try Report Generator',
      actionTab: 'report',
      accentBorder: 'border-blue-200 dark:border-blue-900/60 hover:border-blue-400 dark:hover:border-blue-600',
      accentBg: 'bg-gradient-to-br from-blue-50/50 via-white to-slate-50/30 dark:from-blue-950/20 dark:via-slate-900 dark:to-slate-900',
    },
    {
      id: 'extraction',
      moduleNumber: '2',
      title: 'Document & Table Reader',
      tagline: 'Deep OCR & Stratigraphic Analysis',
      description: 'Review extracted text, tables, borehole assays & figures',
      icon: <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      actionText: 'Open Doc Reader',
      actionTab: 'extraction',
      accentBorder: 'border-purple-200 dark:border-purple-900/60 hover:border-purple-400 dark:hover:border-purple-600',
      accentBg: 'bg-gradient-to-br from-purple-50/50 via-white to-slate-50/30 dark:from-purple-950/20 dark:via-slate-900 dark:to-slate-900',
    },
    {
      id: 'qa',
      moduleNumber: '3',
      title: 'AI Mining Assistant',
      tagline: 'Zero-hallucination fact Q&A',
      description: 'Ask questions with exact page and table citations',
      icon: <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      actionText: 'Ask Assistant',
      actionTab: 'qa',
      accentBorder: 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400 dark:hover:border-emerald-600',
      accentBg: 'bg-gradient-to-br from-emerald-50/50 via-white to-slate-50/30 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900',
    },
  ];

  // Secondary Tools - Concise small phrases
  const secondaryTools = [
    {
      id: 'upload',
      title: 'Upload Files & Links',
      definition: 'PDFs, spreadsheets, web links & text logs',
      icon: <FolderPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      actionTab: 'upload',
    },
    {
      id: 'discrepancy',
      title: 'Check Errors & Conflicts',
      definition: 'Conflicting numbers & data discrepancies',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      actionTab: 'discrepancy',
    },
    {
      id: 'analytics',
      title: 'Operations & Analytics Intelligence',
      definition: 'Correlations, Tukey anomalies, sensitivity simulator & ROI matrix',
      icon: <BarChart3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
      actionTab: 'analytics',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Primary Highlighted Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {primaryModules.map((mod) => (
          <div
            key={mod.id}
            onClick={() => onNavigateTab(mod.actionTab)}
            className={`rounded-2xl border ${mod.accentBorder} ${mod.accentBg} p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group`}
          >
            <div className="space-y-2.5">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200 dark:border-slate-700 w-fit">
                {mod.icon}
              </div>

              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {mod.title}
                </h4>
                {/* Tagline: Strictly 1 line */}
                <div
                  className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 mt-0.5 truncate"
                  title={mod.tagline}
                >
                  {mod.tagline}
                </div>
              </div>

              {/* Definition: Strictly 1 line */}
              <p
                className="text-xs text-slate-600 dark:text-slate-400 truncate"
                title={mod.description}
              >
                {mod.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition flex items-center gap-1">
                <span>{mod.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition duration-150" />
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                Module {mod.moduleNumber}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Secondary Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {secondaryTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onNavigateTab(tool.actionTab)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                  {tool.icon}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate">
                  {tool.title}
                </h4>
              </div>

              {/* Definition: Strictly 1 line */}
              <p
                className="text-[11px] text-slate-500 dark:text-slate-400 truncate"
                title={tool.definition}
              >
                {tool.definition}
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              <span>Open tool</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
