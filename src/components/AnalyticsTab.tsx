import React, { useState, useMemo } from 'react';
import { DocumentItem, TableItem, PageItem, ValidationIssue } from '../../src/types';
import {
  ENTERPRISE_OPERATIONAL_DATA,
  ENTERPRISE_QUALITY_ASSAYS,
  ENTERPRISE_ESG_DATA,
  OperationalRecord,
} from '../../src/data/enterpriseDatasets';
import { ExecutiveKpiScorecard } from './analytics/ExecutiveKpiScorecard';
import { StatisticalDistributionViewer } from './analytics/StatisticalDistributionViewer';
import { CorrelationAndOutliersView } from './analytics/CorrelationAndOutliersView';
import { ScenarioSimulatorView } from './analytics/ScenarioSimulatorView';
import { ActionableDecisionMatrix } from './analytics/ActionableDecisionMatrix';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Sliders,
  FileCheck2,
  Filter,
  Upload,
  Layers,
  Sparkles,
  ShieldCheck,
  Building,
  Calendar,
  Download,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AnalyticsTabProps {
  documents?: DocumentItem[];
  tables?: TableItem[];
  pages?: PageItem[];
  discrepancies?: ValidationIssue[];
  onNavigateTab?: (tab: string) => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  documents = [],
  tables = [],
  pages = [],
  discrepancies = [],
  onNavigateTab,
}) => {
  const { isDark } = useTheme();

  // Active Analyst Sub-View
  const [analystView, setAnalystView] = useState<'scorecard' | 'distribution' | 'correlation' | 'simulator' | 'action_matrix'>('scorecard');

  // Active Dataset
  const [activeDataset, setActiveDataset] = useState<'operational' | 'quality' | 'esg' | 'custom'>('operational');

  // Subsidiary Filter for Operational Data
  const [subsidiaryFilter, setSubsidiaryFilter] = useState<string>('all');

  // Custom uploaded dataset (if any)
  const [customOperationalData, setCustomOperationalData] = useState<OperationalRecord[] | null>(null);

  // Operational Data filtered
  const operationalData = useMemo(() => {
    const base = customOperationalData || ENTERPRISE_OPERATIONAL_DATA;
    if (subsidiaryFilter === 'all') return base;
    return base.filter((d) => d.subsidiary === subsidiaryFilter);
  }, [customOperationalData, subsidiaryFilter]);

  // CSV File Ingestion Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      try {
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length < 2) return;

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const parsedRecords: OperationalRecord[] = [];

        for (let i = 1; i < lines.length; i++) {
          const vals = lines[i].split(',').map((v) => v.trim());
          if (vals.length >= 5) {
            parsedRecords.push({
              id: `UP-${i}`,
              year: Number(vals[0]) || 2024,
              quarter: vals[1] || 'Q1',
              subsidiary: (vals[2] as any) || 'SECL',
              mine: vals[3] || 'Uploaded Mine',
              target_mt: Number(vals[4]) || 3.0,
              actual_mt: Number(vals[5]) || 3.1,
              variance_mt: Number(vals[5]) - Number(vals[4]) || 0.1,
              achievement_pct: Number((((Number(vals[5]) || 3.1) / (Number(vals[4]) || 3.0)) * 100).toFixed(1)),
              ob_target_mcum: Number(vals[6]) || 9.0,
              ob_actual_mcum: Number(vals[7]) || 9.2,
              stripping_ratio: Number(((Number(vals[7]) || 9.2) / (Number(vals[5]) || 3.1)).toFixed(2)),
              hemm_availability_pct: Number(vals[8]) || 86.5,
              diesel_l_per_t: Number(vals[9]) || 1.85,
              cost_per_t_inr: Number(vals[10]) || 850,
              safety_incident_free_days: 365,
            });
          }
        }

        if (parsedRecords.length > 0) {
          setCustomOperationalData(parsedRecords);
          setActiveDataset('custom');
        }
      } catch (err) {
        console.error('Failed to parse uploaded CSV:', err);
      }
    };
    reader.readAsText(file);
  };

  const navItems = [
    {
      id: 'scorecard',
      label: 'Executive KPI Scorecard',
      icon: <BarChart3 className="w-4 h-4" />,
      tag: 'Volume & Financial Variance',
    },
    {
      id: 'distribution',
      label: 'Statistical Distributions',
      icon: <Activity className="w-4 h-4" />,
      tag: 'Descriptive & Percentiles',
    },
    {
      id: 'correlation',
      label: 'Correlations & Anomalies',
      icon: <TrendingUp className="w-4 h-4" />,
      tag: 'Pearson Heatmap & Outliers',
    },
    {
      id: 'simulator',
      label: 'What-If Sensitivity Simulator',
      icon: <Sliders className="w-4 h-4" />,
      tag: 'Dynamic Scenario Modeling',
    },
    {
      id: 'action_matrix',
      label: 'Actionable Decision Matrix',
      icon: <FileCheck2 className="w-4 h-4" />,
      tag: 'Prioritized Interventions & ROI',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Mining Operations & Decision Intelligence Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Operational Analytics Active
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Quantitative Diagnostics & Actionable Reporting
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Enterprise Mining Analytics & Decision Intelligence System
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Evaluating multi-dimensional longitudinal datasets across Coal India Ltd (CIL) & CMPDI subsidiaries. Applying Tukey's IQR rule, Pearson bivariate correlations, and sensitivity projections to generate clear, actionable strategic directives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer flex items-center gap-1.5 shadow-2xs">
              <Upload className="w-3.5 h-3.5 text-blue-500" />
              <span>Import Custom CSV</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>

            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('report')}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open Report Generator</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Dataset Status & Filtering Strip */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Dataset Selector */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Active Dataset:</span>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                onClick={() => setActiveDataset('operational')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${activeDataset === 'operational' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Master Operations ({operationalData.length} records)
              </button>
              <button
                onClick={() => setActiveDataset('quality')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${activeDataset === 'quality' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Quality Assays ({ENTERPRISE_QUALITY_ASSAYS.length} runs)
              </button>
              <button
                onClick={() => setActiveDataset('esg')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${activeDataset === 'esg' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Parivesh ESG ({ENTERPRISE_ESG_DATA.length} stations)
              </button>
              {customOperationalData && (
                <button
                  onClick={() => setActiveDataset('custom')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${activeDataset === 'custom' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Custom Uploaded ({customOperationalData.length})
                </button>
              )}
            </div>
          </div>

          {/* Subsidiary Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-400 uppercase text-[10px]">Subsidiary:</span>
            <select
              value={subsidiaryFilter}
              onChange={(e) => setSubsidiaryFilter(e.target.value)}
              aria-label="Filter dataset by subsidiary"
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="all">All Subsidiaries (SECL, ECL, NCL, CCL, BCCL)</option>
              <option value="SECL">SECL (Dipka & Gevra)</option>
              <option value="ECL">ECL (Rajmahal & Sonepur Bazari)</option>
              <option value="NCL">NCL (Jayant & Nigahi)</option>
              <option value="CCL">CCL (Amrapali & North Karanpura)</option>
              <option value="BCCL">BCCL (Jharia Coking Coal)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analyst Sub-Views Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setAnalystView(item.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              analystView === item.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            <span
              className={`text-[10px] font-normal px-1.5 py-0.5 rounded ${
                analystView === item.id
                  ? 'bg-blue-700 text-blue-100'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.tag}
            </span>
          </button>
        ))}
      </div>

      {/* Main Sub-View Content */}
      <div className="transition-all duration-200">
        {analystView === 'scorecard' && (
          <ExecutiveKpiScorecard data={operationalData} subsidiaryFilter={subsidiaryFilter} />
        )}

        {analystView === 'distribution' && (
          <StatisticalDistributionViewer
            operationalData={operationalData}
            qualityData={ENTERPRISE_QUALITY_ASSAYS}
          />
        )}

        {analystView === 'correlation' && (
          <CorrelationAndOutliersView
            operationalData={operationalData}
            qualityData={ENTERPRISE_QUALITY_ASSAYS}
          />
        )}

        {analystView === 'simulator' && (
          <ScenarioSimulatorView operationalData={operationalData} />
        )}

        {analystView === 'action_matrix' && (
          <ActionableDecisionMatrix
            onExportReport={() => onNavigateTab && onNavigateTab('report')}
          />
        )}
      </div>
    </div>
  );
};
