import React, { useState } from 'react';
import { STRATEGIC_ACTION_MATRIX } from '../../data/enterpriseDatasets';
import { ActionRecommendation } from '../../utils/statisticalEngine';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Download,
  Copy,
  Check,
  Building,
  Target,
  Filter,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActionableDecisionMatrixProps {
  onExportReport?: () => void;
}

export const ActionableDecisionMatrix: React.FC<ActionableDecisionMatrixProps> = ({ onExportReport }) => {
  const [recommendations, setRecommendations] = useState<ActionRecommendation[]>(STRATEGIC_ACTION_MATRIX);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  // Filter recommendations
  const filteredRecs = recommendations.filter((r) => {
    const matchCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchTime = selectedTimeframe === 'all' || r.timeframe.startsWith(selectedTimeframe);
    return matchCat && matchTime;
  });

  const handleToggleStatus = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = r.status === 'Open' ? 'In Progress' : r.status === 'In Progress' ? 'Implemented' : 'Open';
          if (nextStatus === 'Implemented') {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
          }
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  const handleCopyMarkdown = () => {
    const md = `# CMPDI & CIL Executive Strategic Action Plan
Generated: ${new Date().toLocaleDateString()}
Status: Executive Leadership Review

## Summary of Actionable Interventions

${recommendations
  .map(
    (r, i) => `### ${i + 1}. [${r.priority}] ${r.title}
- **Category:** ${r.category} | **Timeframe:** ${r.timeframe}
- **Status:** ${r.status}
- **Root Cause:** ${r.rootCause}
- **Action Required:** ${r.actionRequired}
- **Projected Impact:** ${r.projectedImpact}
- **Estimated ROI:** ${r.estimatedRoi}
- **Responsible Owner:** ${r.responsibleOwner}
- **Risk of Inaction:** ${r.riskOfInaction}
`
  )
  .join('\n\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCsv = () => {
    const headers = [
      'ID',
      'Title',
      'Category',
      'Priority',
      'Timeframe',
      'Status',
      'Root Cause',
      'Action Required',
      'Projected Impact',
      'Estimated ROI',
      'Owner',
      'Risk of Inaction',
    ];

    const rows = recommendations.map((r) => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.category,
      r.priority,
      r.timeframe,
      r.status,
      `"${r.rootCause.replace(/"/g, '""')}"`,
      `"${r.actionRequired.replace(/"/g, '""')}"`,
      `"${r.projectedImpact.replace(/"/g, '""')}"`,
      `"${r.estimatedRoi.replace(/"/g, '""')}"`,
      `"${r.responsibleOwner.replace(/"/g, '""')}"`,
      `"${r.riskOfInaction.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CMPDI_Executive_Action_Matrix_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Actionable Strategic Decision & Recommendation Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ranked operational directives with root cause attribution, quantifiable ROI, and designated owners
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied Brief!' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-500 uppercase text-[10px]">Category:</span>
          {['all', 'Quality Control', 'Equipment Maintenance', 'Cost Optimization', 'Statutory & ESG', 'Operational'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${selectedCategory === cat ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-500 uppercase text-[10px]">Timeframe:</span>
          {[
            { id: 'all', label: 'All Horizons' },
            { id: '0-30', label: '0-30 Days (Immediate)' },
            { id: '1-3', label: '1-3 Months' },
            { id: '3-12', label: '3-12 Months' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setSelectedTimeframe(tf.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${selectedTimeframe === tf.id ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Cards List */}
      <div className="space-y-4">
        {filteredRecs.map((rec) => {
          const isCritical = rec.priority.includes('P0');
          const isHigh = rec.priority.includes('P1');
          const priorityColor = isCritical
            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
            : isHigh
            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';

          const statusColor =
            rec.status === 'Implemented'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : rec.status === 'In Progress'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

          return (
            <div
              key={rec.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider ${priorityColor}`}>
                    {rec.priority}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {rec.id}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {rec.category}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {rec.timeframe}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(rec.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${statusColor}`}
                    title="Click to toggle status (Open -> In Progress -> Implemented)"
                  >
                    {rec.status === 'Implemented' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>Status: {rec.status}</span>
                  </button>
                </div>
              </div>

              {/* Title & Root Cause */}
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {rec.title}
                </h4>
                <div className="mt-2 p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                  <strong className="font-bold flex items-center gap-1.5 mb-0.5 text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5" /> Data Root-Cause Attribution:
                  </strong>
                  {rec.rootCause}
                </div>
              </div>

              {/* Action Required */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Mandated Operational Action:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {rec.actionRequired}
                </p>
              </div>

              {/* Projected Impact & Estimated ROI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 rounded-xl">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                    Projected Physical Impact
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {rec.projectedImpact}
                  </p>
                </div>

                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 rounded-xl">
                  <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">
                    Estimated Economic Return (ROI)
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {rec.estimatedRoi}
                  </p>
                </div>
              </div>

              {/* Owner & Risk of Inaction Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Designated Owner: <strong className="text-slate-800 dark:text-slate-200">{rec.responsibleOwner}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Risk of Inaction: {rec.riskOfInaction}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
