import React from 'react';
import { OperationalRecord } from '../../data/enterpriseDatasets';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ComposedChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Target, Zap, ShieldCheck, AlertTriangle, ArrowUpRight, ArrowDownRight, Layers, BarChart3, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ExecutiveKpiScorecardProps {
  data: OperationalRecord[];
  subsidiaryFilter: string;
}

export const ExecutiveKpiScorecard: React.FC<ExecutiveKpiScorecardProps> = ({ data, subsidiaryFilter }) => {
  const { isDark } = useTheme();

  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';
  const tooltipColor = isDark ? '#f8fafc' : '#1e293b';
  const gridStroke = isDark ? '#1e293b' : '#f1f5f9';
  const axisColor = isDark ? '#94a3b8' : '#64748b';

  // Aggregations
  const totalTarget = data.reduce((acc, d) => acc + d.target_mt, 0);
  const totalActual = data.reduce((acc, d) => acc + d.actual_mt, 0);
  const overallAchievement = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;
  const netVariance = totalActual - totalTarget;

  const totalObActual = data.reduce((acc, d) => acc + d.ob_actual_mcum, 0);
  const avgStrippingRatio = totalActual > 0 ? totalObActual / totalActual : 0;

  const avgHemm = data.length > 0 ? data.reduce((acc, d) => acc + d.hemm_availability_pct, 0) / data.length : 0;
  const avgDiesel = data.length > 0 ? data.reduce((acc, d) => acc + d.diesel_l_per_t, 0) / data.length : 0;
  const avgUnitCost = data.length > 0 ? data.reduce((acc, d) => acc + d.cost_per_t_inr, 0) / data.length : 0;

  // Chart data by Year and Quarter
  const timelineChartData = React.useMemo(() => {
    const grouped: Record<string, { period: string; target: number; actual: number; ob: number; stripping: number; cost: number; count: number }> = {};
    data.forEach((d) => {
      const key = `${d.year} ${d.quarter}`;
      if (!grouped[key]) {
        grouped[key] = { period: key, target: 0, actual: 0, ob: 0, stripping: 0, cost: 0, count: 0 };
      }
      grouped[key].target += d.target_mt;
      grouped[key].actual += d.actual_mt;
      grouped[key].ob += d.ob_actual_mcum;
      grouped[key].stripping += d.stripping_ratio;
      grouped[key].cost += d.cost_per_t_inr;
      grouped[key].count += 1;
    });

    return Object.values(grouped).map((g) => ({
      period: g.period,
      target: Number(g.target.toFixed(2)),
      actual: Number(g.actual.toFixed(2)),
      variance: Number((g.actual - g.target).toFixed(2)),
      ob: Number(g.ob.toFixed(2)),
      stripping: Number((g.stripping / g.count).toFixed(2)),
      cost: Number((g.cost / g.count).toFixed(0)),
    }));
  }, [data]);

  // Subsidiary Breakdown
  const subsidiaryBreakdown = React.useMemo(() => {
    const subs: Record<string, { sub: string; target: number; actual: number; ob: number; hemm: number; count: number }> = {};
    data.forEach((d) => {
      if (!subs[d.subsidiary]) {
        subs[d.subsidiary] = { sub: d.subsidiary, target: 0, actual: 0, ob: 0, hemm: 0, count: 0 };
      }
      subs[d.subsidiary].target += d.target_mt;
      subs[d.subsidiary].actual += d.actual_mt;
      subs[d.subsidiary].ob += d.ob_actual_mcum;
      subs[d.subsidiary].hemm += d.hemm_availability_pct;
      subs[d.subsidiary].count += 1;
    });

    return Object.values(subs).map((s) => ({
      subsidiary: s.sub,
      target: Number(s.target.toFixed(2)),
      actual: Number(s.actual.toFixed(2)),
      achievement: Number(((s.actual / (s.target || 1)) * 100).toFixed(1)),
      ob: Number(s.ob.toFixed(2)),
      avgHemm: Number((s.hemm / s.count).toFixed(1)),
      strippingRatio: Number((s.ob / (s.actual || 1)).toFixed(2)),
    })).sort((a, b) => b.actual - a.actual);
  }, [data]);

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Production */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Production (Actual)
            </span>
            <span className={`p-2 rounded-xl text-xs font-semibold ${overallAchievement >= 100 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'}`}>
              {overallAchievement.toFixed(1)}% of Target
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalActual.toFixed(2)}
            </span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Million Tonnes (MT)
            </span>
          </div>
          <div className="mt-2 text-xs flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            {netVariance >= 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" /> +{netVariance.toFixed(2)} MT
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 flex items-center font-bold">
                <ArrowDownRight className="w-3.5 h-3.5" /> {netVariance.toFixed(2)} MT
              </span>
            )}
            <span>vs {totalTarget.toFixed(2)} MT planned target</span>
          </div>
        </div>

        {/* Overburden & Stripping Ratio */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Stripping Ratio (OB/Coal)
            </span>
            <span className="p-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
              {totalObActual.toFixed(1)} Mcum OB
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {avgStrippingRatio.toFixed(2)}
            </span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              m³/tonne
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            <span>Optimal stripping range: 2.80 – 3.25 m³/t</span>
          </div>
        </div>

        {/* HEMM Availability */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              HEMM Equipment Availability
            </span>
            <span className={`p-2 rounded-xl text-xs font-semibold ${avgHemm >= 85 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'}`}>
              Target: &gt;85%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {avgHemm.toFixed(1)}%
            </span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Active Fleet Run
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            <span>Draglines, 42m³ electric shovels & 240T dumpers</span>
          </div>
        </div>

        {/* Unit Cost & Efficiency */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Avg Extraction Unit Cost
            </span>
            <span className="p-2 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400">
              {avgDiesel.toFixed(2)} L/t Diesel
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              ₹{avgUnitCost.toFixed(0)}
            </span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              per tonne
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            <span>Range: ₹660/t (CCL) to ₹1,485/t (BCCL Jharia)</span>
          </div>
        </div>
      </div>

      {/* Main Charts: Target vs Actual Timeline & Subsidiary Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Quarterly Production Run-Rate: Target vs. Actual
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Longitudinal analysis across {timelineChartData.length} fiscal quarters showing target vs. realized excavation
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded-xs bg-slate-300 dark:bg-slate-700 inline-block" /> Target
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block" /> Actual
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-3 h-1 bg-emerald-500 inline-block" /> Stripping Ratio
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={timelineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="period" stroke={axisColor} fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke={axisColor} fontSize={11} tickLine={false} unit=" MT" />
                <YAxis yAxisId="right" orientation="right" stroke={axisColor} fontSize={11} tickLine={false} unit=" m³/t" />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipColor, borderRadius: '12px' }}
                />
                <Bar yAxisId="left" dataKey="target" fill={isDark ? '#334155' : '#cbd5e1'} name="Target MT" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="actual" fill="#3b82f6" name="Actual MT" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="stripping" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="Stripping Ratio (m³/t)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subsidiary Performance Ranking */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2 mb-1">
              <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Subsidiary Achievement Index
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Realized coal production achievement % by subsidiary entity
            </p>

            <div className="space-y-3.5">
              {subsidiaryBreakdown.map((s) => (
                <div key={s.subsidiary} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {s.subsidiary}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 dark:text-slate-400">{s.actual} MT</span>
                      <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${s.achievement >= 100 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
                        {s.achievement}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.achievement >= 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, (s.achievement / 110) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>HEMM Availability: {s.avgHemm}%</span>
                    <span>Stripping: {s.strippingRatio} m³/t</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>NCL & SECL lead volume efficiency with &gt;102% realization and &gt;88% fleet availability.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
