import React, { useState } from 'react';
import coalRockTexture from './assets/images/coal_rock_texture_1788456045919.jpg';
import { useTheme } from './context/ThemeContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './components/HomePage';
import { DocumentUploadTab } from './components/DocumentUploadTab';
import { ExtractionViewerTab } from './components/ExtractionViewerTab';
import { GroundedQATab } from './components/GroundedQATab';
import { DiscrepancyValidatorTab } from './components/DiscrepancyValidatorTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { ReportGeneratorTab } from './components/ReportGeneratorTab';
import { JudgePitchModal } from './components/JudgePitchModal';
import { JudgeQAModal } from './components/JudgeQAModal';
import { GroundTruthMetricsModal } from './components/GroundTruthMetricsModal';
import { LoginModal } from './components/LoginModal';
import { DocumentItem, PageItem, TableItem, ValidationIssue, UserProfile } from './types';
import {
  INITIAL_DOCUMENTS,
  SAMPLE_PAGES,
  SAMPLE_TABLES,
  SAMPLE_DISCREPANCIES,
} from './data/sampleMiningData';
import {
  Award,
  HelpCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  User,
  Home,
  Sparkles,
  FolderPlus,
  Cpu,
  Search,
  AlertTriangle,
  BarChart3,
  FileCheck,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [tabHistory, setTabHistory] = useState<string[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [selectedDocId, setSelectedDocId] = useState<string>('CMPDI-GEO-2024-001');
  const [pages, setPages] = useState<PageItem[]>(SAMPLE_PAGES);
  const [tables, setTables] = useState<TableItem[]>(SAMPLE_TABLES);
  const [discrepancies, setDiscrepancies] = useState<ValidationIssue[]>(SAMPLE_DISCREPANCIES);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [isJudgeQAOpen, setIsJudgeQAOpen] = useState(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);

  // Navigation handlers with history tracking for Back and Forth
  const handleNavigateTab = (tabId: string) => {
    if (tabId === activeTab) return;
    const newHistory = tabHistory.slice(0, historyIndex + 1);
    newHistory.push(tabId);
    setTabHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setActiveTab(tabHistory[prevIndex]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoForward = () => {
    if (historyIndex < tabHistory.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setActiveTab(tabHistory[nextIndex]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < tabHistory.length - 1;

  const handleAddDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocId(newDoc.id);
    const newPage: PageItem = {
      id: `PG-${newDoc.id}-1`,
      document_id: newDoc.id,
      page_number: 1,
      text: `[Ingested File Record: ${newDoc.original_filename}]\n- File Format: ${newDoc.file_type}\n- Category: ${newDoc.category}\n- Subsidiary: ${newDoc.subsidiary}\n- Size: ${newDoc.size_kb} KB\n- Ingestion Time: ${newDoc.uploaded_at}`,
      has_tables: newDoc.tables_count > 0,
      has_figures: false,
      ocr_confidence: 99.0,
    };
    setPages((prev) => [newPage, ...prev]);
  };

  const handleIngestContent = (newDoc: DocumentItem, newPages: PageItem[], newTables: TableItem[]) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setPages((prev) => [...newPages, ...prev]);
    setTables((prev) => [...newTables, ...prev]);
    setSelectedDocId(newDoc.id);
  };

  const handleResolveDiscrepancy = (id: number) => {
    setDiscrepancies((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, geologist_verified: !d.geologist_verified } : d
      )
    );
  };

  const unresolvedDiscrepancyCount = discrepancies.filter((d) => !d.geologist_verified).length;
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div
      className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-row font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-200"
      style={{
        backgroundImage: isDark
          ? `linear-gradient(180deg, rgba(13, 16, 23, 0.89) 0%, rgba(9, 11, 17, 0.95) 100%), url(${coalRockTexture})`
          : `linear-gradient(180deg, rgba(246, 248, 252, 0.90) 0%, rgba(238, 242, 248, 0.94) 100%), url(${coalRockTexture})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      {/* Left Sidebar Panel */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleNavigateTab}
        discrepancyCount={unresolvedDiscrepancyCount}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area (Header + Tab Content) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={handleNavigateTab}
          documents={documents}
          pages={pages}
          tables={tables}
          activeDocumentId={selectedDocId}
          onSelectDocument={(id) => setSelectedDocId(id)}
          onOpenPitch={() => setIsPitchOpen(true)}
          onOpenJudgeQA={() => setIsJudgeQAOpen(true)}
          onOpenBenchmark={() => setIsBenchmarkOpen(true)}
          onOpenLogin={() => setIsLoginOpen(true)}
          currentUser={currentUser}
          discrepancyCount={unresolvedDiscrepancyCount}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onGoBack={handleGoBack}
          onGoForward={handleGoForward}
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Main Workspace Canvas */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'home' && (
          <HomePage
            documents={documents}
            onAddDocument={handleAddDocument}
            onSelectDocument={(id) => {
              setSelectedDocId(id);
              handleNavigateTab('extraction');
            }}
            selectedDocId={selectedDocId}
            onNavigateTab={handleNavigateTab}
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginOpen(true)}
            onSelectQuickProfile={(user) => setCurrentUser(user)}
            onOpenPitch={() => setIsPitchOpen(true)}
            onOpenJudgeQA={() => setIsJudgeQAOpen(true)}
            onOpenBenchmark={() => setIsBenchmarkOpen(true)}
            discrepancyCount={unresolvedDiscrepancyCount}
          />
        )}

        {/* 1. AUTOMATED REPORT GENERATION PLATFORM */}
        {activeTab === 'report' && (
          <ReportGeneratorTab
            documents={documents}
            activeDocumentId={selectedDocId}
            onSelectDocument={(id) => setSelectedDocId(id)}
            discrepancies={discrepancies}
            pages={pages}
            tables={tables}
            onAddDocument={handleAddDocument}
            onOpenDocReader={() => handleNavigateTab('extraction')}
            onOpenQA={() => handleNavigateTab('qa')}
          />
        )}

        {activeTab === 'upload' && (
          <DocumentUploadTab
            documents={documents}
            onAddDocument={handleAddDocument}
            onIngestContent={handleIngestContent}
            onSelectDocument={(id) => {
              setSelectedDocId(id);
              handleNavigateTab('extraction');
            }}
            selectedDocId={selectedDocId}
            onNavigateTab={handleNavigateTab}
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginOpen(true)}
            onSelectQuickProfile={(user) => setCurrentUser(user)}
          />
        )}

        {activeTab === 'extraction' && (
          <ExtractionViewerTab
            documents={documents}
            pages={pages}
            tables={tables}
            discrepancies={discrepancies}
            selectedDocId={selectedDocId}
            onSelectDocId={setSelectedDocId}
          />
        )}

        {activeTab === 'qa' && (
          <GroundedQATab pages={pages} />
        )}

        {activeTab === 'discrepancy' && (
          <DiscrepancyValidatorTab
            discrepancies={discrepancies}
            onResolveDiscrepancy={handleResolveDiscrepancy}
            documents={documents}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab
            documents={documents}
            tables={tables}
            pages={pages}
            discrepancies={discrepancies}
            onNavigateTab={handleNavigateTab}
          />
        )}
        </main>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
      />

      <JudgePitchModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
        onNavigateTab={(tabKey) => handleNavigateTab(tabKey)}
      />

      <JudgeQAModal
        isOpen={isJudgeQAOpen}
        onClose={() => setIsJudgeQAOpen(false)}
        onNavigateTab={(tabKey) => handleNavigateTab(tabKey)}
      />

      <GroundTruthMetricsModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
      />
    </div>
  );
}
