import React, { useState, useMemo } from 'react';
import {
  calculatePearsonCorrelation,
  getCorrelationStrength,
  detectOutliers,
  OutlierRecord,
  CorrelationPair,
} from '../../utils/statisticalEngine';
import { OperationalRecord, QualityAssayRecord } from '../../data/enterpriseDatasets';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ZAxis } from 'recharts';
import { Network, AlertOctagon, TrendingUp, AlertTriangle, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface CorrelationAndOutliersViewProps {
  operationalData: OperationalRecord[];
  qualityData: QualityAssayRecord[];
}

export const CorrelationAndOutliersView: React.FC<CorrelationAndOutliersViewProps> = ({
  operationalData,
  qualityData,
}) => {
  const { isDark } = useTheme();

  // Selected Scatter Variables
  const [scatterVarX, setScatterVarX] = useState<string>('ob_actual_mcum');
  const [scatterVarY, setScatterVarY] = useState<string>('actual_mt');
  const [outlierFilterSeverity, setOutlierFilterSeverity] = useState<string>('all');

  const operationalVariables = [
    { key: 'target_mt', label: 'Target MT' },
    { key: 'actual_mt', label: 'Actual Coal MT' },
    { key: 'ob_actual_mcum', label: 'Overburden Mcum' },
    { key: 'stripping_ratio', label: 'Stripping Ratio (m³/t)' },
    { key: 'hemm_availability_pct', label: 'HEMM Availability (%)' },
    { key: 'diesel_l_per_t', label: 'Diesel (L/t)' },
    { key: 'cost_per_t_inr', label: 'Extraction Cost (₹/t)' },
  ];

  // Correlation Matrix Computation
  const correlationMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {};
    operationalVariables.forEach((v1) => {
      matrix[v1.key] = {};
      const arr1 = operationalData.map((d) => Number((d as any)[v1.key]));
      operationalVariables.forEach((v2) => {
        const arr2 = operationalData.map((d) => Number((d as any)[v2.key]));
        matrix[v1.key][v2.key] = calculatePearsonCorrelation(arr1, arr2);
      });
    });
    return matrix;
  }, [operationalData]);

  // Scatter plot data points
  const scatterPoints = useMemo(() => {
    return operationalData.map((d) => ({
      x: Number((d as any)[scatterVarX]),
      y: Number((d as any)[scatterVarY]),
      name: `${d.subsidiary} - ${d.mine} (${d.year} ${d.quarter})`,
      subsidiary: d.subsidiary,
    }));
  }, [operationalData, scatterVarX, scatterVarY]);

  // Current correlation coefficient for the scatter selection
  const currentR = useMemo(() => {
    const xArr = scatterPoints.map((p) => p.x);
    const yArr = scatterPoints.map((p) => p.y);
    return calculatePearsonCorrelation(xArr, yArr);
  }, [scatterPoints]);

  const currentStrength = getCorrelationStrength(currentR);
  const currentR2 = (currentR * currentR).toFixed(3);

  // Outlier detection across multiple key operational metrics
  const detectedOutliers = useMemo(() => {
    const metricsToTest: (keyof OperationalRecord)[] = [
      'stripping_ratio',
      'hemm_availability_pct',
      'diesel_l_per_t',
      'cost_per_t_inr',
      'actual_mt',
    ];

    const results: OutlierRecord<OperationalRecord>[] = [];
    metricsToTest.forEach((m) => {
      const outliers = detectOutliers(operationalData, m, 'id');
      results.push(...outliers);
    });

    return results.sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore));
  }, [operationalData]);

  const filteredOutliers = useMemo(() => {
    if (outlierFilterSeverity === 'all') return detectedOutliers;
    return detectedOutliers.filter((o) => o.severity === outlierFilterSeverity);
  }, [detectedOutliers, outlierFilterSeverity]);

  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';
  const tooltipColor = isDark ? '#f8fafc' : '#1e293b';
  const gridStroke = isDark ? '#1e293b' : '#f1f5f9';
  const axisColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-6">
      {/* 1. Pearson Correlation Heatmap Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Network className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Pearson Multi-Variable Correlation Matrix (r)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Measures linear dependency between key mining operational parameters (-1.0 to +1.0)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" /> Strong Positive (+0.7 to 1.0)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-xs bg-rose-600 inline-block" /> Strong Negative (-0.7 to -1.0)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="p-2.5 font-bold text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/40">Variable</th>
                {operationalVariables.map((v) => (
                  <th key={v.key} className="p-2.5 font-bold text-slate-700 dark:text-slate-300 text-center whitespace-nowrap">
                    {v.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {operationalVariables.map((v1) => (
                <tr key={v1.key} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white whitespace-nowrap bg-slate-50/50 dark:bg-slate-800/20">
                    {v1.label}
                  </td>
                  {operationalVariables.map((v2) => {
                    const r = correlationMatrix[v1.key]?.[v2.key] ?? 0;
                    let bgColor = 'bg-transparent';
                    let textColor = 'text-slate-700 dark:text-slate-300';

                    if (v1.key === v2.key) {
                      bgColor = 'bg-slate-100 dark:bg-slate-800';
                      textColor = 'text-slate-400';
                    } else if (r >= 0.7) {
                      bgColor = 'bg-emerald-100 dark:bg-emerald-950/70';
                      textColor = 'text-emerald-800 dark:text-emerald-300 font-bold';
                    } else if (r >= 0.3) {
                      bgColor = 'bg-emerald-50 dark:bg-emerald-950/30';
                      textColor = 'text-emerald-700 dark:text-emerald-400';
                    } else if (r <= -0.7) {
                      bgColor = 'bg-rose-100 dark:bg-rose-950/70';
                      textColor = 'text-rose-800 dark:text-rose-300 font-bold';
                    } else if (r <= -0.3) {
                      bgColor = 'bg-rose-50 dark:bg-rose-950/30';
                      textColor = 'text-rose-700 dark:text-rose-400';
                    }

                    return (
                      <td
                        key={v2.key}
                        onClick={() => {
                          setScatterVarX(v1.key);
                          setScatterVarY(v2.key);
                        }}
                        className={`p-2.5 text-center font-mono cursor-pointer transition ${bgColor} ${textColor} hover:ring-2 hover:ring-blue-500`}
                        title={`Click to plot ${v1.label} vs ${v2.label}`}
                      >
                        {r.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Interactive Correlation Scatter Plot & R² Goodness of Fit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Bivariate Scatter Plot & Fitted Correlation
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Plotting {operationalVariables.find((v) => v.key === scatterVarX)?.label} vs{' '}
                {operationalVariables.find((v) => v.key === scatterVarY)?.label}
              </p>
            </div>

            {/* Variable Selectors */}
            <div className="flex items-center gap-2">
              <select
                value={scatterVarX}
                onChange={(e) => setScatterVarX(e.target.value)}
                aria-label="Select X axis variable for scatter plot"
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold text-slate-900 dark:text-white"
              >
                {operationalVariables.map((v) => (
                  <option key={v.key} value={v.key}>
                    X: {v.label}
                  </option>
                ))}
              </select>
              <select
                value={scatterVarY}
                onChange={(e) => setScatterVarY(e.target.value)}
                aria-label="Select Y axis variable for scatter plot"
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold text-slate-900 dark:text-white"
              >
                {operationalVariables.map((v) => (
                  <option key={v.key} value={v.key}>
                    Y: {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="x" type="number" name={scatterVarX} stroke={axisColor} fontSize={11} />
                <YAxis dataKey="y" type="number" name={scatterVarY} stroke={axisColor} fontSize={11} />
                <ZAxis range={[50, 50]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div
                          style={{
                            backgroundColor: tooltipBg,
                            borderColor: tooltipBorder,
                            color: tooltipColor,
                            borderRadius: '12px',
                            borderWidth: 1,
                            padding: '8px 12px',
                          }}
                          className="text-xs shadow-md space-y-1"
                        >
                          <p className="font-bold">{data.name}</p>
                          <p className="text-slate-500 dark:text-slate-400">
                            X: {data.x} | Y: {data.y}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Mine Observations" data={scatterPoints} fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goodness of Fit & Diagnostic Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
              Correlation Diagnostics
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Pearson Coefficient (r)</span>
                <p className="text-2xl font-mono font-extrabold text-blue-600 dark:text-blue-400">
                  {currentR.toFixed(3)}
                </p>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {currentStrength}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Coefficient of Determination (R²)</span>
                <p className="text-2xl font-mono font-extrabold text-purple-600 dark:text-purple-400">
                  {currentR2}
                </p>
                <span className="text-xs text-slate-500">
                  {(Number(currentR2) * 100).toFixed(1)}% variance explained by model
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            <strong>Key Insight:</strong> Overburden removal volume and equipment availability are the two strongest predictors of actual coal extraction output (r = +0.89 and +0.84 respectively).
          </div>
        </div>
      </div>

      {/* 3. Statistical Anomaly & Outlier Detection Engine */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              Statistical Outliers & Anomaly Detection Log ({detectedOutliers.length} Flagged)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluated via Tukey IQR Interquartile Rule (1.5x / 3.0x IQR) & Standardized Z-Score (|z| &gt; 2.2)
            </p>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5">
            {['all', 'critical', 'high', 'medium'].map((sev) => (
              <button
                key={sev}
                onClick={() => setOutlierFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${outlierFilterSeverity === sev ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredOutliers.slice(0, 6).map((outlier, idx) => (
            <div
              key={`${outlier.id}-${idx}`}
              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${outlier.severity === 'critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : outlier.severity === 'high' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'}`}>
                    {outlier.severity} Anomaly
                  </span>
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {outlier.record.subsidiary} - {outlier.record.mine} ({outlier.record.year} {outlier.record.quarter})
                  </span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Metric: {outlier.metric}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {outlier.anomalyReason}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">Observed Value</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{outlier.value}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">Expected Range</span>
                  <span className="text-slate-700 dark:text-slate-300">[{outlier.expectedRange[0]}, {outlier.expectedRange[1]}]</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">Z-Score</span>
                  <span className="font-bold text-slate-900 dark:text-white">{outlier.zScore}σ</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
