/**
 * Advanced Statistical & Quantitative Analysis Engine
 * Operational Analytics & Decision Intelligence
 */

export interface NumericStats {
  count: number;
  mean: number;
  median: number;
  stdDev: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  p90: number;
  p95: number;
}

export interface OutlierRecord<T = any> {
  id: string | number;
  metric: string;
  value: number;
  zScore: number;
  iqrThreshold: 'mild' | 'extreme';
  expectedRange: [number, number];
  record: T;
  anomalyReason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface CorrelationPair {
  metricA: string;
  metricB: string;
  coefficient: number; // -1 to +1
  strength: 'Strong Positive' | 'Moderate Positive' | 'Weak' | 'Moderate Negative' | 'Strong Negative';
  significance: string;
}

export interface ActionRecommendation {
  id: string;
  title: string;
  category: 'Operational' | 'Quality Control' | 'Cost Optimization' | 'Statutory & ESG' | 'Equipment Maintenance';
  priority: 'Critical (P0)' | 'High (P1)' | 'Medium (P2)' | 'Low (P3)';
  timeframe: '0-30 Days (Immediate)' | '1-3 Months (Mid-term)' | '3-12 Months (Strategic)';
  rootCause: string;
  actionRequired: string;
  projectedImpact: string;
  estimatedRoi: string;
  responsibleOwner: string;
  riskOfInaction: string;
  status: 'Open' | 'In Progress' | 'Implemented';
}

// Calculate comprehensive descriptive statistics
export function calculateDescriptiveStats(values: number[]): NumericStats {
  const clean = values.filter((v) => typeof v === 'number' && !isNaN(v) && isFinite(v));
  if (clean.length === 0) {
    return {
      count: 0,
      mean: 0,
      median: 0,
      stdDev: 0,
      variance: 0,
      min: 0,
      max: 0,
      range: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
      skewness: 0,
      p90: 0,
      p95: 0,
    };
  }

  const sorted = [...clean].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const mean = sum / count;

  const getPercentile = (p: number): number => {
    const idx = (p / 100) * (count - 1);
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (idx - lower) * (sorted[upper] - sorted[lower]);
  };

  const median = getPercentile(50);
  const q1 = getPercentile(25);
  const q3 = getPercentile(75);
  const p90 = getPercentile(90);
  const p95 = getPercentile(95);
  const iqr = q3 - q1;
  const min = sorted[0];
  const max = sorted[count - 1];
  const range = max - min;

  const squaredDiffs = sorted.map((v) => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / (count > 1 ? count - 1 : 1);
  const stdDev = Math.sqrt(variance);

  // Sample skewness
  const cubedDiffs = sorted.map((v) => Math.pow((v - mean) / (stdDev || 1), 3));
  const skewness = count > 2 ? (count / ((count - 1) * (count - 2))) * cubedDiffs.reduce((a, b) => a + b, 0) : 0;

  return {
    count,
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    stdDev: Number(stdDev.toFixed(2)),
    variance: Number(variance.toFixed(2)),
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
    range: Number(range.toFixed(2)),
    q1: Number(q1.toFixed(2)),
    q3: Number(q3.toFixed(2)),
    iqr: Number(iqr.toFixed(2)),
    skewness: Number(skewness.toFixed(3)),
    p90: Number(p90.toFixed(2)),
    p95: Number(p95.toFixed(2)),
  };
}

// Calculate Pearson Correlation Coefficient between two arrays
export function calculatePearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  const n = x.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i];
    sumY2 += y[i] * y[i];
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;
  return Number((numerator / denominator).toFixed(3));
}

// Classify correlation strength
export function getCorrelationStrength(r: number): 'Strong Positive' | 'Moderate Positive' | 'Weak' | 'Moderate Negative' | 'Strong Negative' {
  if (r >= 0.7) return 'Strong Positive';
  if (r >= 0.3) return 'Moderate Positive';
  if (r > -0.3) return 'Weak';
  if (r > -0.7) return 'Moderate Negative';
  return 'Strong Negative';
}

// Detect statistical outliers in a dataset
export function detectOutliers<T extends Record<string, any>>(
  dataset: T[],
  metricKey: keyof T,
  idKey: keyof T = 'id' as keyof T
): OutlierRecord<T>[] {
  const numericValues = dataset
    .map((d) => Number(d[metricKey]))
    .filter((v) => !isNaN(v) && isFinite(v));

  if (numericValues.length < 4) return [];

  const stats = calculateDescriptiveStats(numericValues);
  const lowerBound = stats.q1 - 1.5 * stats.iqr;
  const upperBound = stats.q3 + 1.5 * stats.iqr;
  const extremeLowerBound = stats.q1 - 3 * stats.iqr;
  const extremeUpperBound = stats.q3 + 3 * stats.iqr;

  const outliers: OutlierRecord<T>[] = [];

  dataset.forEach((item) => {
    const val = Number(item[metricKey]);
    if (isNaN(val) || !isFinite(val)) return;

    const zScore = stats.stdDev > 0 ? (val - stats.mean) / stats.stdDev : 0;
    const isMild = val < lowerBound || val > upperBound;
    const isExtreme = val < extremeLowerBound || val > extremeUpperBound || Math.abs(zScore) >= 3;

    if (isMild || Math.abs(zScore) >= 2.2) {
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
      if (isExtreme) severity = 'critical';
      else if (Math.abs(zScore) >= 2.5) severity = 'high';

      const reason = val > upperBound
        ? `Value ${val} exceeds 75th percentile upper threshold (${upperBound.toFixed(2)}) by +${((val - upperBound) / upperBound * 100).toFixed(1)}% (z=${zScore.toFixed(2)})`
        : `Value ${val} falls below 25th percentile lower threshold (${lowerBound.toFixed(2)}) by -${((lowerBound - val) / lowerBound * 100).toFixed(1)}% (z=${zScore.toFixed(2)})`;

      outliers.push({
        id: item[idKey] || Math.random().toString(),
        metric: String(metricKey),
        value: val,
        zScore: Number(zScore.toFixed(2)),
        iqrThreshold: isExtreme ? 'extreme' : 'mild',
        expectedRange: [Number(lowerBound.toFixed(2)), Number(upperBound.toFixed(2))],
        record: item,
        anomalyReason: reason,
        severity,
      });
    }
  });

  return outliers.sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore));
}

// Linear regression forecast engine
export function forecastLinearTrend(
  historical: { x: number; y: number }[],
  futurePeriods: number = 3
): { forecast: { x: number; y: number; lower: number; upper: number }[]; slope: number; intercept: number; rSquared: number } {
  const n = historical.length;
  if (n < 2) return { forecast: [], slope: 0, intercept: 0, rSquared: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  historical.forEach((pt) => {
    sumX += pt.x;
    sumY += pt.y;
    sumXY += pt.x * pt.y;
    sumX2 += pt.x * pt.x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared
  const meanY = sumY / n;
  let ssTot = 0, ssRes = 0;
  historical.forEach((pt) => {
    const predicted = slope * pt.x + intercept;
    ssTot += Math.pow(pt.y - meanY, 2);
    ssRes += Math.pow(pt.y - predicted, 2);
  });
  const rSquared = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;
  const residualStdDev = Math.sqrt(ssRes / Math.max(1, n - 2));

  const lastX = historical[historical.length - 1].x;
  const forecast: { x: number; y: number; lower: number; upper: number }[] = [];

  for (let i = 1; i <= futurePeriods; i++) {
    const nextX = lastX + i;
    const projected = slope * nextX + intercept;
    const margin = 1.96 * residualStdDev * Math.sqrt(1 + 1 / n + Math.pow(nextX - sumX / n, 2) / (sumX2 - (sumX * sumX) / n));
    forecast.push({
      x: nextX,
      y: Number(projected.toFixed(2)),
      lower: Number(Math.max(0, projected - margin).toFixed(2)),
      upper: Number((projected + margin).toFixed(2)),
    });
  }

  return {
    forecast,
    slope: Number(slope.toFixed(3)),
    intercept: Number(intercept.toFixed(2)),
    rSquared: Number(rSquared.toFixed(3)),
  };
}
