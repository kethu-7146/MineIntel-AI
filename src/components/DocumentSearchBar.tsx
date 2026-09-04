import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  X,
  FileText,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Layers,
  Table,
  Cpu,
} from 'lucide-react';
import { DocumentItem, PageItem, TableItem } from '../types';

interface DocumentSearchBarProps {
  documents: DocumentItem[];
  pages?: PageItem[];
  tables?: TableItem[];
  activeDocumentId: string;
  onSelectDocument: (docId: string) => void;
  onNavigateTab: (tabId: string) => void;
  className?: string;
}

export const DocumentSearchBar: React.FC<DocumentSearchBarProps> = ({
  documents,
  pages = [],
  tables = [],
  activeDocumentId,
  onSelectDocument,
  onNavigateTab,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Active document
  const currentDoc = useMemo(() => {
    return (
      documents.find((d) => d.id === activeDocumentId) ||
      documents[0] || {
        id: 'default',
        original_filename: 'CMPDI Mining Repository',
        category: 'Geological Report',
      }
    );
  }, [documents, activeDocumentId]);

  // Search matching pages across documents
  const matchingPages = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    return pages
      .filter((p) => p.text.toLowerCase().includes(q))
      .slice(0, 6)
      .map((p) => {
        const doc = documents.find((d) => d.id === p.document_id);
        const lowerText = p.text.toLowerCase();
        const index = lowerText.indexOf(q);
        const start = Math.max(0, index - 40);
        const end = Math.min(p.text.length, index + q.length + 60);
        const snippet = (start > 0 ? '...' : '') + p.text.slice(start, end) + (end < p.text.length ? '...' : '');

        return {
          page: p,
          docName: doc?.original_filename || p.document_id,
          snippet,
        };
      });
  }, [pages, documents, query]);

  // Search matching documents
  const matchingDocs = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    return documents.filter((d) =>
      d.original_filename.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.subsidiary?.toLowerCase().includes(q)
    );
  }, [documents, query]);

  // Search matching tables
  const matchingTables = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    return tables
      .filter((t) =>
        t.title?.toLowerCase().includes(q) ||
        t.headers.some((h) => h.toLowerCase().includes(q)) ||
        t.rows.some((row) => row.some((cell) => cell.toLowerCase().includes(q)))
      )
      .slice(0, 4);
  }, [tables, query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard shortcut (Cmd+K or Ctrl+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleOpenPage = (docId: string) => {
    onSelectDocument(docId);
    setIsOpen(false);
    onNavigateTab('extraction');
  };

  const handleAskAssistant = (q: string) => {
    setIsOpen(false);
    onNavigateTab('qa');
  };

  const QUICK_SEARCH_CHIPS = [
    'Barakar Formation',
    'Stripping Ratio',
    'Ash Content',
    'Overburden Mcum',
    'PARIVESH Clearance',
    'Borehole Lithology',
  ];

  return (
    <div ref={containerRef} className={`relative w-full max-w-2xl ${className}`}>
      {/* Search Input Box */}
      <div className="relative group">
        <div className="relative flex items-center bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-xs transition-all duration-200 group-hover:border-blue-400 dark:group-hover:border-blue-500/60 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
          {/* Left Icon Pill */}
          <div className="pl-3 pr-2 flex items-center gap-1.5 shrink-0">
            <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <Search className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Main Text Input */}
          <input
            ref={inputRef}
            type="text"
            id="search-mining-documents-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search mining documents, pages & borehole data (e.g. Seam, Stripping, Ash)..."
            className="w-full py-2 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden min-w-0 pr-2"
          />

          {/* Right Action Icons: Clear, Counts & Keyboard Shortcut */}
          <div className="flex items-center gap-1.5 pr-2.5 shrink-0">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Clear search"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Shortcut Badge */}
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      {/* Floating Results Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-[75vh] flex flex-col">
          {/* Quick Search Chips */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs shrink-0">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
              Quick Filter:
            </span>
            {QUICK_SEARCH_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(chip)}
                className="px-2 py-0.5 rounded-md text-[11px] bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-800 text-slate-700 dark:text-slate-300 transition whitespace-nowrap cursor-pointer shadow-2xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Results Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[55vh]">
            {!query.trim() ? (
              <div className="text-center py-6 text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Search across {documents.length} CMPDI documents and {pages.length} extracted pages
                </p>
                <p className="text-[11px]">Type keywords like &quot;Barakar&quot;, &quot;Stripping&quot;, or &quot;Ash Content&quot; to locate exact sections.</p>
              </div>
            ) : (
              <>
                {/* Matching Documents */}
                {matchingDocs.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Matching Documents ({matchingDocs.length})
                    </span>
                    <div className="space-y-1.5">
                      {matchingDocs.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => handleOpenPage(doc.id)}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {doc.original_filename}
                              </p>
                              <span className="text-[10px] text-slate-500">
                                {doc.category} • {doc.subsidiary}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Page Excerpts */}
                {matchingPages.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Matching Text Excerpts ({matchingPages.length})
                    </span>
                    <div className="space-y-2">
                      {matchingPages.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleOpenPage(item.page.document_id)}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-slate-800/60 transition cursor-pointer space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              Page {item.page.page_number}
                            </span>
                            <span className="text-slate-400 truncate max-w-[200px]">
                              {item.docName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                            {item.snippet}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Tables */}
                {matchingTables.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Matching Tables ({matchingTables.length})
                    </span>
                    <div className="space-y-1.5">
                      {matchingTables.map((t, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleOpenPage(t.document_id)}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 bg-slate-50 dark:bg-slate-800/40 transition cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Table className="w-4 h-4 text-purple-600 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {t.title}
                              </p>
                              <span className="text-[10px] text-slate-500">
                                Page {t.page_number} • {t.rows.length} rows
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {matchingDocs.length === 0 && matchingPages.length === 0 && matchingTables.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-500">
                    No results found for &quot;{query}&quot;. Try adjusting your search query.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
            <span className="text-slate-500 text-[11px]">
              Active Doc: {currentDoc.original_filename}
            </span>
            <button
              type="button"
              onClick={() => handleAskAssistant(query)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <Sparkles className="w-3 h-3" />
              <span>Ask AI Assistant</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
