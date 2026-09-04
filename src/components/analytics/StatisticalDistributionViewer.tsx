import React, { useState, useMemo } from 'react';
import { calculateDescriptiveStats, NumericStats } from '../../utils/statisticalEngine';
import { OperationalRecord, QualityAssayRecord } from '../../data/enterpriseDatasets';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { Sigma, BarChart2, Info, ArrowUpDown, Sliders, CheckCircle, HelpCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface StatisticalDistributionViewerProps {
  operationalData: OperationalRecord[];
  qualityData: QualityAssayRecord[];
}

export const StatisticalDistributionViewer: React.FC<StatisticalDistributionViewerProps> = ({
  operationalData,
  qualityData,
}) => {
  const { isDark } = useTheme();

  const [selectedDomain, setSelectedDomain] = useState<'operational' | 'quality'>('operational');
  const [selectedMetric, setSelectedMetric] = useState<string>('actual_mt');

  const metricOptions = useMemo(() => {
    if (selectedDomain === 'operational') {
      return [
        { key: 'actual_mt', label: 'Actual Coal Production (MT)', unit: 'MT' },
        { key: 'target_mt', label: 'Target Coal Production (MT)', unit: 'MT' },
        { key: 'stripping_ratio', label: 'Stripping Ratio (OB/Coal)', unit: 'm³/t' },
        { key: 'hemm_availability_pct', label: 'HEMM Equipment Availability (%)', unit: '%' },
        { key: 'diesel_l_per_t', label: 'Specific Diesel Consumption (L/t)', unit: 'L/t' },
        { key: 'cost_per_t_inr', label: 'Unit Extraction Cost (₹/tonne)', unit: '₹/t' },
      ];
    } else {
      return [
        { key: 'ash_pct', label: 'Ash Content (%)', unit: '%' },
        { key: 'gcv_kcal_kg', label: 'Gross Calorific Value (GCV)', unit: 'kcal/kg' },
        { key: 'clean_coal_yield_pct', label: 'Clean Coal Beneficiation Yield (%)', unit: '%' },
        { key: 'thickness_m', label: 'Seam Thickness (m)', unit: 'm' },
        { key: 'depth_m', label: 'Seam Depth (m)', unit: 'm' },
        { key: 'moisture_pct', label: 'Total Moisture (%)', unit: '%' },
      ];
    }
  }, [selectedDomain]);

  // Extract raw values for the selected metric
  const rawValues = useMemo(() => {
    if (selectedDomain === 'operational') {
      return operationalData.map((d) => Number((d as any)[selectedMetric])).filter((v) => !isNaN(v));
    } else {
      return qualityData.map((d) => Number((d as any)[selectedMetric])).filter((v) => !isNaN(v));
    }
  }, [selectedDomain, selectedMetric, operationalData, qualityData]);

  // Calculate descriptive statistics
  const stats: NumericStats = useMemo(() => {
    return calculateDescriptiveStats(rawValues);
  }, [rawValues]);

  // Frequency Bins for Histogram
  const histogramData = useMemo(() => {
    if (rawValues.length === 0 || stats.range === 0) return [];
    const binCount = 8;
    const binSize = stats.range / binCount;
    const bins: { binRange: string; count: number; minVal: number; maxVal: number }[] = [];

    for (let i = 0; i < binCount; i++) {
      const minVal = stats.min + i * binSize;
      const maxVal = i === binCount - 1 ? stats.max : minVal + binSize;
      bins.push({
        binRange: `${minVal.toFixed(1)} - ${maxVal.toFixed(1)}`,
        count: 0,
        minVal,
        maxVal,
      });
    }

    rawValues.forEach((val) => {
      for (let i = 0; i < binCount; i++) {
        if (val >= bins[i].minVal && (i === binCount - 1 ? val <= bins[i].maxVal : val < bins[i].maxVal)) {
          bins[i].count++;
          break;
        }
      }
    });

    return bins;
  }, [rawValues, stats]);

  const activeUnit = metricOptions.find((m) => m.key === selectedMetric)?.unit || '';
  const coeffOfVariation = stats.mean !== 0 ? ((stats.stdDev / stats.mean) * 100).toFixed(1) : '0.0';

  // Analyst Interpretation
  const analystInterpretation = useMemo(() => {
    let skewDesc = 'Symmetric (bell-shaped normal distribution)';
    if (stats.skewness > 0.5) skewDesc = `Right-skewed (positive tail towards higher ${activeUnit}), indicating upper-tier outliers or high-volume pockets.`;
    else if (stats.skewness < -0.5) skewDesc = `Left-skewed (negative tail towards lower ${activeUnit}), indicating trailing underperforming units.`;

    let variabilityDesc = 'Moderate variance across mine clusters.';
    const cv = Number(coeffOfVariation);
    if (cv < 10) variabilityDesc = 'High operational stability and process consistency (CV < 10%).';
    else if (cv > 25) variabilityDesc = 'Substantial dispersion and operational heterogeneity between subsidiaries (CV > 25%).';

    return { skewDesc, variabilityDesc };
  }, [stats, activeUnit, coeffOfVariation]);

  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';
  const tooltipColor = isDark ? '#f8fafc' : '#1e293b';
  const gridStroke = isDark ? '#1e293b' : '#f1f5f9';
  const axisColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-6">
      {/* Controls: Domain and Metric Selection */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Domain:
          </span>
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => {
                setSelectedDomain('operational');
                setSelectedMetric('actual_mt');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${selectedDomain === 'operational' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Mine Operations
            </button>
            <button
              onClick={() => {
                setSelectedDomain('quality');
                setSelectedMetric('ash_pct');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${selectedDomain === 'quality' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Quality Assays
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Metric Variable:
          </span>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            aria-label="Select metric variable for statistical distribution analysis"
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            {metricOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Descriptive Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Sample Count (N)</span>
          <p className="text-lg font-mono font-extrabold text-slate-900 dark:text-white mt-1">{stats.count}</p>
          <span className="text-[10px] text-slate-500">Valid Observations</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Mean (μ)</span>
          <p className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400 mt-1">{stats.mean} {activeUnit}</p>
          <span className="text-[10px] text-slate-500">Arithmetic Average</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Median (Q2 / P50)</span>
          <p className="text-lg font-mono font-extrabold text-slate-900 dark:text-white mt-1">{stats.median} {activeUnit}</p>
          <span className="text-[10px] text-slate-500">50th Percentile</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Std Deviation (σ)</span>
          <p className="text-lg font-mono font-extrabold text-slate-900 dark:text-white mt-1">{stats.stdDev} {activeUnit}</p>
          <span className="text-[10px] text-slate-500">Dispersion Spread</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Coeff. of Variation</span>
          <p className="text-lg font-mono font-extrabold text-purple-600 dark:text-purple-400 mt-1">{coeffOfVariation}%</p>
          <span className="text-[10px] text-slate-500">Relative Volatility (CV)</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Skewness</span>
          <p className="text-lg font-mono font-extrabold text-slate-900 dark:text-white mt-1">{stats.skewness}</p>
          <span className="text-[10px] text-slate-500">{stats.skewness > 0 ? 'Right Asymmetry' : 'Left Asymmetry'}</span>
        </div>
      </div>

      {/* Detailed Percentile Range Table & Box Plot Bounds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Frequency Histogram Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Empirical Distribution Histogram ({histogramData.length} Bins)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Frequency distribution of observations across intervals
              </p>
            </div>
            <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
              IQR = {stats.iqr} {activeUnit}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="binRange" stroke={axisColor} fontSize={10} angle={-25} textAnchor="end" height={50} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipColor, borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {histogramData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.count >= Math.max(...histogramData.map((b) => b.count)) ? '#2563eb' : '#60a5fa'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quartile & Tukey Bounds Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 mb-3">
              <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Quartile & Tukey Boundaries
            </h4>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Min Observed</span>
                <span className="font-bold text-slate-900 dark:text-white">{stats.min} {activeUnit}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">25th Percentile (Q1)</span>
                <span className="font-bold text-slate-900 dark:text-white">{stats.q1} {activeUnit}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 bg-blue-50/50 dark:bg-blue-950/30 px-2 rounded">
                <span className="text-blue-700 dark:text-blue-400 font-semibold">Median (Q2)</span>
                <span className="font-extrabold text-blue-700 dark:text-blue-400">{stats.median} {activeUnit}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">75th Percentile (Q3)</span>
                <span className="font-bold text-slate-900 dark:text-white">{stats.q3} {activeUnit}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">90th Percentile (P90)</span>
                <span className="font-bold text-slate-900 dark:text-white">{stats.p90} {activeUnit}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Max Observed</span>
                <span className="font-bold text-slate-900 dark:text-white">{stats.max} {activeUnit}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1.5 border border-slate-200/60 dark:border-slate-700/60">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              Statistical Diagnostics:
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              {analystInterpretation.skewDesc}
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              {analystInterpretation.variabilityDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
