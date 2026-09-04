import React, { useState } from 'react';
import { PageItem, TableItem, ValidationIssue, DocumentItem } from '../types';
import { FileText, Table, AlertTriangle, Cpu, BarChart2, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { calculateDescriptiveStats } from '../utils/statisticalEngine';

interface ExtractionViewerTabProps {
  documents: DocumentItem[];
  pages: PageItem[];
  tables: TableItem[];
  discrepancies: ValidationIssue[];
  selectedDocId: string;
  onSelectDocId: (docId: string) => void;
}

export const ExtractionViewerTab: React.FC<ExtractionViewerTabProps> = ({
  documents,
  pages,
  tables,
  discrepancies,
  selectedDocId,
  onSelectDocId,
}) => {
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'text' | 'tables' | 'ocr_inspect'>('text');
  const [expandedStats, setExpandedStats] = useState<Record<string, boolean>>({});

  const toggleTableStats = (tableKey: string) => {
    setExpandedStats((prev) => ({
      ...prev,
      [tableKey]: !prev[tableKey],
    }));
  };

  // Helper to extract numeric statistics for a table's columns
  const getTableColumnStats = (t: TableItem) => {
    return t.headers.map((header, colIndex) => {
      const numbers: number[] = [];
      t.rows.forEach((row) => {
        const raw = row[colIndex];
        if (raw !== undefined && raw !== null) {
          const clean = String(raw).replace(/[^0-9.-]+/g, '');
          const parsed = parseFloat(clean);
          if (!isNaN(parsed) && isFinite(parsed)) {
            numbers.push(parsed);
          }
        }
      });

      if (numbers.length >= 2) {
        const stats = calculateDescriptiveStats(numbers);
        return {
          header,
          hasStats: true,
          stats,
        };
      }

      return {
        header,
        hasStats: false,
        stats: null,
      };
    }).filter((c) => c.hasStats);
  };

  // If no documents uploaded at all, display clean empty state
  if (documents.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded font-semibold border border-purple-200 dark:border-purple-800">
              Text & Tables
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-600">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Document Reader</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Read Documents & Tables
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            View clean text, tables, and scanned pages read from your files.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 flex items-center justify-center mx-auto shadow-sm">
            <Cpu className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Documents Ingested
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              No documents are currently loaded. Upload a PDF, spreadsheet, CSV, or document in Upload Files to read extracted text and inspect tabular data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filter pages strictly for active doc
  const currentPagesList = pages.filter((p) => p.document_id === selectedDocId);
  const currentPage = currentPagesList[selectedPageIndex] || currentPagesList[0];

  const currentTables = tables.filter(
    (t) => t.document_id === selectedDocId
  );

  const currentDiscrepancies = discrepancies.filter(
    (d) => d.document_id === selectedDocId &&
           d.page_number === (currentPage ? currentPage.page_number : 0)
  );

  return (
    <div className="space-y-6">
      {/* 1. Header with Easy-to-Understand Vocabulary */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded font-semibold border border-purple-200 dark:border-purple-800">
                Text & Tables
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-600">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Document Reader</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Read Documents & Tables
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate max-w-3xl">
              View clean text, tables, and scanned pages read from your files.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 shrink-0">
            <span>Pages: <strong className="text-slate-900 dark:text-white">{currentPagesList.length}</strong></span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span>Tables: <strong className="text-slate-900 dark:text-white">{currentTables.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Top Selector & View Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs transition-colors">
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Choose Document:</label>
          <select
            value={selectedDocId}
            onChange={(e) => {
              onSelectDocId(e.target.value);
              setSelectedPageIndex(0);
            }}
            disabled={documents.length === 0}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 text-xs font-medium px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {documents.length === 0 ? (
              <option value="">No documents uploaded</option>
            ) : (
              documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.original_filename} ({d.category})
                </option>
              ))
            )}
          </select>
        </div>

        {/* View Mode Segmented Control */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-transparent dark:border-slate-700">
          <button
            onClick={() => setViewMode('text')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              viewMode === 'text'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Document Text</span>
            </span>
          </button>
          <button
            onClick={() => setViewMode('tables')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              viewMode === 'tables'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5" />
              <span>Tables ({currentTables.length})</span>
            </span>
          </button>
          <button
            onClick={() => setViewMode('ocr_inspect')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              viewMode === 'ocr_inspect'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Scanned Page Reader</span>
            </span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Page Navigator */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Document Pages
              </h3>
              <span className="text-[10px] text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded font-medium border border-blue-200 dark:border-blue-900">
                Page List
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Click any page to read its text:
            </p>

            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
              {currentPagesList.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
                  No pages available. Please upload a document.
                </div>
              ) : (
                currentPagesList.map((pg, idx) => {
                  const isSelected = selectedPageIndex === idx;
                  const hasDiscrepancy = discrepancies.some(
                    (d) => d.document_id === pg.document_id && d.page_number === pg.page_number
                  );

                  return (
                    <button
                      key={`${pg.document_id}-${pg.page_number}`}
                      onClick={() => setSelectedPageIndex(idx)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          P.{pg.page_number}
                        </span>
                        <span className="truncate text-xs">
                          {pg.document_id}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {pg.ocr_used && (
                          <span className="text-[10px] bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-1.5 py-0.5 rounded font-medium">
                            OCR
                          </span>
                        )}
                        {hasDiscrepancy && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right 3 Cols: Main Inspector Panel */}
        <div className="lg:col-span-3 space-y-4">
          {/* Discrepancy Alert Banner if active on this page */}
          {currentDiscrepancies.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3 shadow-xs animate-fadeIn">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                    Conflict or Difference Found
                  </h4>
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-medium px-2 py-0.5 rounded border border-amber-200 dark:border-amber-700">
                    Needs Attention
                  </span>
                </div>
                {currentDiscrepancies.map((d) => (
                  <p key={d.id} className="text-xs text-amber-900 dark:text-amber-200 mt-1">
                    <strong>{d.metric}:</strong> {d.description}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Text View */}
          {viewMode === 'text' && (
            currentPage ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>File: {currentPage.document_id}</span>
                      <span className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-medium border border-slate-200 dark:border-slate-700">
                        Page {currentPage.page_number}
                      </span>
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                      Read Mode: {currentPage.ocr_used ? 'Scanned Document Reader' : 'Standard Digital Text'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg px-2.5 py-1">
                      Quality: {(currentPage.confidence * 100).toFixed(0)}% Clear
                    </span>
                  </div>
                </div>

                {/* Key Metrics Chips */}
                {currentPage.key_metrics && currentPage.key_metrics.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Important Numbers on this Page:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {currentPage.key_metrics.map((km, i) => (
                        <span
                          key={i}
                          className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1 font-mono font-medium"
                        >
                          {km}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Raw Parsed Text Box */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Page Content:
                  </label>
                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-4 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto">
                    {currentPage.text}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-10 shadow-xs text-center space-y-2">
                <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No Extracted Content</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Upload a document in the Documents tab to view extracted text, tables, and geological metrics.
                </p>
              </div>
            )
          )}

          {/* Tables View */}
          {viewMode === 'tables' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Table className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Tables Found on this Page</span>
                </h3>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 font-medium">
                  {currentTables.length} Table(s)
                </span>
              </div>

              {currentTables.length === 0 ? (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-xs">
                  No tables found on this selected page. Pick another document or page above.
                </div>
              ) : (
                currentTables.map((t, idx) => {
                  const tableKey = t.id || `table-${idx}`;
                  const isStatsOpen = expandedStats[tableKey];
                  const colStats = getTableColumnStats(t);

                  return (
                    <div key={idx} className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Table {t.table_index}: {t.title}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                            Page {t.page_number}
                          </span>
                        </div>

                        {colStats.length > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleTableStats(tableKey)}
                            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-lg px-2.5 py-1 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
                            <span>{isStatsOpen ? 'Hide Statistical Analysis' : 'Statistical Profile'}</span>
                            {isStatsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>

                      {/* Integrated Statistical Analysis Drawer for this Table */}
                      {isStatsOpen && colStats.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-900/70 border border-blue-100 dark:border-blue-900/50 rounded-xl p-3.5 space-y-2.5">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Auto-Computed Column Analytics & Variances:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {colStats.map((cs, cIdx) => (
                              <div
                                key={cIdx}
                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs font-mono space-y-1 shadow-2xs"
                              >
                                <div className="text-[10px] font-sans font-bold text-slate-800 dark:text-slate-200 truncate border-b border-slate-100 dark:border-slate-700 pb-1">
                                  {cs.header}
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-400 font-sans text-[10px]">Mean (μ):</span>
                                  <span className="font-bold text-blue-600 dark:text-blue-400">{cs.stats?.mean}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-400 font-sans text-[10px]">Min / Max:</span>
                                  <span className="text-slate-700 dark:text-slate-300">{cs.stats?.min} / {cs.stats?.max}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-400 font-sans text-[10px]">IQR / StdDev:</span>
                                  <span className="text-slate-500 dark:text-slate-400">{cs.stats?.iqr} (±{cs.stats?.stdDev})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                        <table className="w-full text-left text-xs border-collapse font-sans">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {t.headers.map((h, i) => (
                                <th key={i} className="p-2.5 font-semibold text-xs border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {t.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/50 transition text-slate-800 dark:text-slate-200">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-2.5 font-mono text-xs border-r border-slate-100 dark:border-slate-700 last:border-r-0">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* OCR Fallback View */}
          {viewMode === 'ocr_inspect' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Scanned Image Reader (OCR)</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    How it works: When a document contains scanned paper pages or images, the system automatically reads the text from the image.
                  </p>
                </div>
                <span className="text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded font-medium">
                  Automatic
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">1. Example Scanned Page</div>
                  <div className="h-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center p-4 text-center shadow-xs">
                    <div className="text-slate-800 dark:text-slate-200 text-xs font-semibold mb-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      [Scanned Geological Archive: 1998]
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mt-1">
                      Historical paper record • Scanned document
                    </p>
                    <div className="mt-3 text-[10px] bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded font-medium">
                      Reading image text...
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">2. Converted Text Output</div>
                  <div className="h-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 overflow-y-auto font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed shadow-xs">
                    TURRA SEAM: Net thickness 12.70m.<br/>
                    Proximate Assay Results:<br/>
                    - Moisture: 6.2%<br/>
                    - Ash Content: 22.8%<br/>
                    - Useful Heat Value: 4920 kcal/kg (Grade G8).<br/>
                    - Discrepancy flag logged for production reconciliation.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
