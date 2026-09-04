import React, { useState, useMemo } from 'react';
import { ValidationIssue, DocumentItem } from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  UserCheck,
  RotateCcw,
  FolderPlus,
  BarChart2,
  TrendingUp,
  Activity,
  Layers,
  Filter,
} from 'lucide-react';
import { ENTERPRISE_OPERATIONAL_DATA } from '../data/enterpriseDatasets';
import { detectOutliers, OutlierRecord } from '../utils/statisticalEngine';

interface DiscrepancyValidatorTabProps {
  discrepancies: ValidationIssue[];
  onResolveDiscrepancy: (id: number) => void;
  documents?: DocumentItem[];
  onNavigateTab?: (tab: string) => void;
}

export const DiscrepancyValidatorTab: React.FC<DiscrepancyValidatorTabProps> = ({
  discrepancies,
  onResolveDiscrepancy,
  documents = [],
  onNavigateTab,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'documents' | 'statistical'>('all');
  const [acknowledgedOutliers, setAcknowledgedOutliers] = useState<Record<string, boolean>>({});

  // Compute statistical outliers across key metrics using Tukey's IQR rule
  const statisticalOutliers = useMemo(() => {
    const strippingOutliers = detectOutliers(ENTERPRISE_OPERATIONAL_DATA, 'stripping_ratio', 'id').map((o) => ({
      ...o,
      metricLabel: 'Stripping Ratio (OB:Coal)',
      unit: 'm³/t',
    }));
    const dieselOutliers = detectOutliers(ENTERPRISE_OPERATIONAL_DATA, 'diesel_l_per_t', 'id').map((o) => ({
      ...o,
      metricLabel: 'Specific Diesel Consumption',
      unit: 'L/t',
    }));
    const fleetOutliers = detectOutliers(ENTERPRISE_OPERATIONAL_DATA, 'hemm_availability_pct', 'id').map((o) => ({
      ...o,
      metricLabel: 'HEMM Fleet Availability',
      unit: '%',
    }));

    return [...strippingOutliers, ...dieselOutliers, ...fleetOutliers];
  }, []);

  const toggleAcknowledgeOutlier = (key: string) => {
    setAcknowledgedOutliers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const unresolvedDiscrepancyCount = discrepancies.filter((d) => !d.geologist_verified).length;
  const unacknowledgedOutliersCount = statisticalOutliers.filter(
    (o) => !acknowledgedOutliers[`${o.id}-${o.metric}`]
  ).length;

  const totalActionRequired = unresolvedDiscrepancyCount + unacknowledgedOutliersCount;

  if (documents.length === 0 && statisticalOutliers.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Check Errors & Conflicts
                </h2>
                <span className="text-[10px] bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                  Input Required
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Automatically finds conflicting numbers, unexpected values, or mismatches across your documents.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Documents to Validate
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Discrepancy and conflict validation runs strictly on your uploaded inputs. Please upload a mining report or spreadsheet in Upload Files to check for calculations and data differences.
            </p>
          </div>

          {onNavigateTab && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateTab('upload')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 mx-auto cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Upload Documents to Check</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner explaining Validation Engine with Integrated Statistical Anomaly Detection */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Discrepancy & Statistical Anomaly Validator
                </h2>
                <span className="text-[10px] bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                  Cross-Validation Active
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 max-w-3xl leading-relaxed">
                Auditing conflicting values across ingested reports and detecting statistical outliers using Tukey's IQR rule across operational metrics.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 shrink-0 flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {totalActionRequired}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Needs Checking</div>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {(discrepancies.length - unresolvedDiscrepancyCount) + (statisticalOutliers.length - unacknowledgedOutliersCount)}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Approved</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Issues ({discrepancies.length + statisticalOutliers.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('documents')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'documents'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Document Conflicts ({discrepancies.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('statistical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'statistical'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Statistical Outliers ({statisticalOutliers.length})</span>
          </button>
        </div>
      </div>

      {/* Discrepancy & Anomaly List */}
      <div className="space-y-4">
        {/* Render Document Discrepancies */}
        {(activeFilter === 'all' || activeFilter === 'documents') && (
          <>
            {discrepancies.map((item) => {
              const issueLabel =
                item.issue_type === 'discrepancy'
                  ? 'Different Numbers'
                  : item.issue_type === 'out_of_range'
                  ? 'Unusual Value'
                  : 'Missing Information';

              return (
                <div
                  key={`doc-${item.id}`}
                  className={`rounded-xl border p-5 transition-all shadow-xs ${
                    item.geologist_verified
                      ? 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                          item.issue_type === 'discrepancy'
                            ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : item.issue_type === 'out_of_range'
                            ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                            : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        {issueLabel}
                      </span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-mono">
                        Document Source
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.metric}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.geologist_verified ? (
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Checked & Approved
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Needs Your Check
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 font-mono mb-0.5">Found in Document (Page {item.page_number})</div>
                      <div className="font-semibold text-slate-900 dark:text-white">{item.value_a}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.document_id}</div>
                    </div>

                    {item.comparing_document_id && (
                      <div className="border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 pt-2 sm:pt-0 sm:pl-3">
                        <div className="text-[10px] text-slate-400 font-mono mb-0.5">Comparing Document (Page {item.comparing_page_number})</div>
                        <div className="font-semibold text-slate-900 dark:text-white">{item.value_b}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.comparing_document_id}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.geologist_verified ? 'Validated by Technical Team' : 'Awaiting confirmation'}
                    </span>

                    <button
                      type="button"
                      onClick={() => onResolveDiscrepancy(item.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                        item.geologist_verified
                          ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-2xs'
                      }`}
                    >
                      {item.geologist_verified ? (
                        <>
                          <RotateCcw className="w-3 h-3" /> Re-open Flag
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5" /> Approve Value
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Render Statistical & Anomaly Outliers */}
        {(activeFilter === 'all' || activeFilter === 'statistical') && (
          <>
            {statisticalOutliers.map((outlier) => {
              const outlierKey = `${outlier.id}-${outlier.metric}`;
              const isAcknowledged = acknowledgedOutliers[outlierKey];
              const recordData = outlier.record as any;

              return (
                <div
                  key={`stat-${outlierKey}`}
                  className={`rounded-xl border p-5 transition-all shadow-xs ${
                    isAcknowledged
                      ? 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                          outlier.severity === 'critical'
                            ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900'
                            : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900'
                        }`}
                      >
                        {outlier.severity === 'critical' ? 'Tukey Extreme Outlier (>3.0 IQR)' : 'Tukey Outlier (>1.5 IQR)'}
                      </span>
                      <span className="text-[10px] bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded font-mono">
                        Statistical Anomaly
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {outlier.metricLabel} — {recordData.subsidiary} ({recordData.mine || recordData.block || 'Active Mine'})
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {isAcknowledged ? (
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Outlier Acknowledged
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5" /> Action Required (z={outlier.zScore})
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {outlier.anomalyReason}. Observed in {recordData.quarter || 'Operating Cycle'} reporting for{' '}
                    {recordData.subsidiary}.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs font-mono">
                    <div>
                      <div className="text-[10px] text-slate-400 mb-0.5">Recorded Value:</div>
                      <div className="text-sm font-black text-rose-600 dark:text-rose-400">
                        {outlier.value} {outlier.unit}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 mb-0.5">Expected Bounds [Q1-1.5IQR, Q3+1.5IQR]:</div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        [{outlier.expectedRange[0]} - {outlier.expectedRange[1]} {outlier.unit}]
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 mb-0.5">Standard Score (Z-Score):</div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        z = {outlier.zScore} σ
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Evaluated against 56 historical quarterly operating datasets
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleAcknowledgeOutlier(outlierKey)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                        isAcknowledged
                          ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          : 'bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-2xs'
                      }`}
                    >
                      {isAcknowledged ? (
                        <>
                          <RotateCcw className="w-3 h-3" /> Re-flag Outlier
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5" /> Acknowledge Variance
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {discrepancies.length === 0 && statisticalOutliers.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Zero Conflicts or Anomalies Detected</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              All numbers, calculations, and operational metrics have passed consistency and statistical outlier checks without any detected issues.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
