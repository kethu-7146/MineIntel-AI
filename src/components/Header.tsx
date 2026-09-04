import React from 'react';
import {
  Shield,
  HelpCircle,
  ShieldCheck,
  Layers,
  ChevronLeft,
  ChevronRight,
  User,
  Home,
  ArrowLeft,
  Search,
  Cpu,
  FolderPlus,
  AlertTriangle,
  BarChart3,
  FileCheck,
  Sun,
  Moon,
  Sparkles,
  Menu,
} from 'lucide-react';
import { UserProfile, DocumentItem, PageItem, TableItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { DocumentSearchBar } from './DocumentSearchBar';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  documents: DocumentItem[];
  pages?: PageItem[];
  tables?: TableItem[];
  activeDocumentId: string;
  onSelectDocument: (id: string) => void;
  onOpenPitch?: () => void;
  onOpenJudgeQA?: () => void;
  onOpenBenchmark: () => void;
  onOpenLogin: () => void;
  currentUser: UserProfile | null;
  discrepancyCount: number;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  documents,
  pages = [],
  tables = [],
  activeDocumentId,
  onSelectDocument,
  onOpenPitch,
  onOpenJudgeQA,
  onOpenBenchmark,
  onOpenLogin,
  currentUser,
  discrepancyCount,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onToggleSidebar,
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const getTabLabel = (id: string) => {
    switch (id) {
      case 'home':
        return {
          label: 'Home',
          desc: 'Smart mining documents & technical reporting assistant',
          icon: <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
        };
      case 'upload':
        return {
          label: 'Upload Files',
          desc: 'PDFs, spreadsheets & document files',
          icon: <FolderPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
        };
      case 'extraction':
        return {
          label: 'Read Documents & Tables',
          desc: 'Extracted text, tables & borehole logs',
          icon: <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
        };
      case 'qa':
        return {
          label: 'Ask Questions',
          desc: 'Document Q&A with page citations',
          icon: <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
        };
      case 'discrepancy':
        return {
          label: `Check Errors (${discrepancyCount} to review)`,
          desc: 'Conflicting values & data discrepancies',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
        };
      case 'analytics':
        return {
          label: 'Charts & Trends',
          desc: 'Target vs. actual coal production',
          icon: <BarChart3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
        };
      case 'report':
        return {
          label: 'Automated Report Generator',
          desc: 'Automated conclusions & technical reasons',
          icon: <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
        };
      default:
        return {
          label: 'Home',
          desc: 'Smart mining documents & technical reporting assistant',
          icon: <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
        };
    }
  };

  const currentTabInfo = getTabLabel(activeTab);

  return (
    <header className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-40 shadow-xs transition-colors duration-200">
      {/* Top Subtle Status Bar */}
      <div className="bg-slate-900 text-slate-400 px-4 py-1 text-[11px] font-medium flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-semibold text-[10px]">
            CMPDI • Coal India
          </span>
          <span className="hidden sm:inline text-slate-400 text-[11px]">
            Geological & Mining Document Intelligence
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>NLP Extraction Active</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Sidebar Toggle */}
          {onToggleSidebar && (
            <button
              id="btn-mobile-sidebar-toggle"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          {/* Navigation Controls: Home, Back, Next */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 mr-1">
            <button
              id="btn-nav-home"
              onClick={() => setActiveTab('home')}
              title="Go to Home"
              className={`p-1.5 rounded-lg transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 hover:shadow-xs'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold pr-0.5">Home</span>
            </button>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

            <button
              id="btn-nav-back"
              onClick={onGoBack}
              disabled={!canGoBack}
              title="Go Back"
              className={`p-1.5 rounded-lg transition flex items-center gap-1 text-xs font-medium ${
                canGoBack
                  ? 'text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs cursor-pointer'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[11px] hidden sm:inline font-semibold">Back</span>
            </button>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-0.5" />

            <button
              id="btn-nav-forth"
              onClick={onGoForward}
              disabled={!canGoForward}
              title="Go to Next Screen"
              className={`p-1.5 rounded-lg transition flex items-center gap-1 text-xs font-medium ${
                canGoForward
                  ? 'text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs cursor-pointer'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <span className="text-[11px] hidden sm:inline font-semibold">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 group-hover:bg-blue-700 transition flex items-center justify-center text-white shadow-xs shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                MineIntel AI
              </h1>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                CMPDI
              </span>
            </div>
          </div>
        </div>

        {/* Center Search Bar at the Red Bar Location: Fast Document & Section Search */}
        <div className="flex-1 max-w-xl mx-auto w-full px-1 md:px-3">
          <DocumentSearchBar
            documents={documents}
            pages={pages}
            tables={tables}
            activeDocumentId={activeDocumentId}
            onSelectDocument={onSelectDocument}
            onNavigateTab={setActiveTab}
          />
        </div>

        {/* Action Controls & Theme Toggle */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 justify-end">
          {/* Light / Dark Mode Toggle Button */}
          <button
            id="btn-theme-toggle"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Light and Dark Theme"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-xs">Dark</span>
              </>
            )}
          </button>

          {/* User Account / Login Button */}
          <button
            id="btn-user-login"
            onClick={onOpenLogin}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
              {currentUser ? currentUser.name.charAt(0) : <User className="w-3 h-3" />}
            </div>
            <span className="text-xs font-medium">
              {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-Header Breadcrumb Bar with 1-Line Definition (Appears when activeTab !== 'home') */}
      {activeTab !== 'home' && (
        <div className="bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 px-4 py-1.5 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs min-w-0">
              <button
                onClick={() => setActiveTab('home')}
                className="text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 font-medium flex items-center gap-1 hover:underline cursor-pointer shrink-0"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
                {currentTabInfo.icon}
                <span>{currentTabInfo.label}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700 hidden md:inline">—</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:inline truncate">
                {currentTabInfo.desc}
              </span>
            </div>

            <button
              onClick={() => setActiveTab('home')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-blue-200 px-2.5 py-1 rounded transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
