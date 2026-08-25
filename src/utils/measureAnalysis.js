/**
 * 공통 측정 데이터에서 Measure 단계 분석 결과 파생
 */
import { computeCapabilityAdvanced, andersonDarlingNormality } from './advancedStats';

export const parseMeasurementText = (text) => {
  if (!text) return [];
  return String(text)
    .replace(/\uFEFF/g, '')
    .split(/[\s,;|\t\n\r]+/)
    .map(v => v.trim())
    .filter(Boolean)
    .map(v => parseFloat(v.replace(/,/g, '')))
    .filter(v => !isNaN(v));
};

export const computeDescriptiveStats = (rawData = []) => {
  const n = rawData.length;
  if (n === 0) return null;

  const sorted = [...rawData].sort((a, b) => a - b);
  const mean = rawData.reduce((a, b) => a + b, 0) / n;
  const variance = n > 1
    ? rawData.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (n - 1)
    : 0;
  const stdDev = Math.sqrt(variance);
  const min = sorted[0];
  const max = sorted[n - 1];
  const median = n % 2 === 0
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : sorted[Math.floor(n / 2)];

  return { n, mean, stdDev, min, max, median, variance };
};

export const computeCapability = (rawData = [], lsl = null, usl = null) => {
  const stats = computeDescriptiveStats(rawData);
  if (!stats || stats.stdDev === 0) {
    return { ...stats, cp: null, cpk: null, cpu: null, cpl: null, sigmaLevel: null };
  }

  const { mean, stdDev } = stats;
  let cp = null;
  let cpk = null;
  let cpu = null;
  let cpl = null;
  let sigmaLevel = null;

  const hasLsl = lsl !== null && lsl !== undefined && !isNaN(lsl);
  const hasUsl = usl !== null && usl !== undefined && !isNaN(usl);

  if (hasLsl && hasUsl) {
    cp = (usl - lsl) / (6 * stdDev);
    cpu = (usl - mean) / (3 * stdDev);
    cpl = (mean - lsl) / (3 * stdDev);
    cpk = Math.min(cpu, cpl);
    sigmaLevel = cpk * 3;
  } else if (hasUsl) {
    cpu = (usl - mean) / (3 * stdDev);
    cpk = cpu;
    sigmaLevel = cpk * 3;
  } else if (hasLsl) {
    cpl = (mean - lsl) / (3 * stdDev);
    cpk = cpl;
    sigmaLevel = cpk * 3;
  }

  return { ...stats, cp, cpk, cpu, cpl, sigmaLevel };
};

export const computeDpmoFromSpec = (rawData = [], lsl = null, usl = null) => {
  const n = rawData.length;
  if (n === 0) {
    return { unitCount: 0, defectCount: 0, opportunityPerUnit: 1, dpmo: 0, yieldPct: 0, sigmaApprox: null };
  }

  const hasLsl = lsl !== null && lsl !== undefined && !isNaN(lsl);
  const hasUsl = usl !== null && usl !== undefined && !isNaN(usl);

  let defectCount = 0;
  if (hasLsl || hasUsl) {
    defectCount = rawData.filter(v => {
      if (hasLsl && v < lsl) return true;
      if (hasUsl && v > usl) return true;
      return false;
    }).length;
  }

  const dpmo = (defectCount / n) * 1_000_000;
  const yieldPct = ((n - defectCount) / n) * 100;

  // 대략적 시그마 수준 (단기, yield 기반 근사)
  let sigmaApprox = null;
  if (yieldPct >= 99.99966) sigmaApprox = 6;
  else if (yieldPct >= 99.977) sigmaApprox = 5;
  else if (yieldPct >= 99.38) sigmaApprox = 4;
  else if (yieldPct >= 93.3) sigmaApprox = 3;
  else if (yieldPct >= 69.1) sigmaApprox = 2;
  else sigmaApprox = 1;

  return {
    unitCount: n,
    defectCount,
    opportunityPerUnit: 1,
    dpmo,
    yieldPct,
    sigmaApprox,
    hasSpec: hasLsl || hasUsl
  };
};

export const toControlChart = (rawData = [], subgroupSize = 5) => {
  if (!rawData.length) return { samples: [], type: 'i-mr' };

  if (rawData.length < subgroupSize * 2) {
    return {
      type: 'i-mr',
      samples: rawData.map((value, i) => ({
        value,
        label: `#${i + 1}`
      }))
    };
  }

  const samples = [];
  for (let i = 0; i + subgroupSize <= rawData.length; i += subgroupSize) {
    samples.push({
      id: `sg-${i}`,
      values: rawData.slice(i, i + subgroupSize)
    });
  }

  return { type: 'xbar', samples };
};

export const toRunChart = (rawData = []) => ({
  data: rawData.map((value, i) => ({
    label: `#${i + 1}`,
    day: i + 1,
    value
  }))
});

export const toBoxPlot = (rawData = []) => ({
  groups: rawData.length
    ? [{ id: 'all', name: '전체 측정값', data: [...rawData] }]
    : []
});

export const toHistogram = (rawData = [], { lsl = null, usl = null, binCount = 10 } = {}) => ({
  rawData: [...rawData],
  lsl: lsl !== '' && lsl != null && !isNaN(Number(lsl)) ? Number(lsl) : null,
  usl: usl !== '' && usl != null && !isNaN(Number(usl)) ? Number(usl) : null,
  binCount: binCount || 10
});

/**
 * 공통 측정값 → measure.chartData + DPMO 필드 일괄 파생
 */
export const deriveMeasureFromRaw = (rawData = [], options = {}) => {
  const {
    lsl = null,
    usl = null,
    binCount = 10,
    subgroupSize = 5,
    keepScatter = null
  } = options;

  const histogram = toHistogram(rawData, { lsl, usl, binCount });
  const controlChart = toControlChart(rawData, subgroupSize);
  const runChart = toRunChart(rawData);
  const boxPlot = toBoxPlot(rawData);
  const capability = computeCapability(rawData, histogram.lsl, histogram.usl);
  const advanced = computeCapabilityAdvanced(rawData, histogram.lsl, histogram.usl);
  const normality = andersonDarlingNormality(rawData);
  const dpmo = computeDpmoFromSpec(rawData, histogram.lsl, histogram.usl);

  return {
    histogram,
    controlChart,
    runChart,
    boxPlot,
    scatterPlot: keepScatter || {
      data: rawData.map((y, i) => ({ x: i + 1, y })),
      xLabel: '측정 순서',
      yLabel: '측정값'
    },
    capability,
    advanced,
    normality,
    dpmo,
    summary: {
      n: rawData.length,
      mean: capability?.mean ?? null,
      stdDev: capability?.stdDev ?? null,
      cp: advanced?.ok ? advanced.cp : (capability?.cp ?? null),
      cpk: advanced?.ok ? advanced.cpk : (capability?.cpk ?? null),
      pp: advanced?.ok ? advanced.pp : null,
      ppk: advanced?.ok ? advanced.ppk : null,
      zBench: advanced?.ok ? advanced.zBench : null,
      pctOosObserved: advanced?.ok ? advanced.pctOosObserved : null,
      pctOosExpected: advanced?.ok ? advanced.pctOosExpected : null,
      sigmaLevel: capability?.sigmaLevel ?? null,
      normalityP: normality?.ok ? normality.pValue : null,
      isNormal: normality?.ok ? normality.isNormal : null,
      dpmo: dpmo.dpmo,
      defectCount: dpmo.defectCount
    }
  };
};

export const applyDerivedToMeasure = (measure, rawData, options = {}) => {
  const derived = deriveMeasureFromRaw(rawData, {
    ...options,
    keepScatter: options.preserveScatter ? measure?.chartData?.scatterPlot : null
  });

  // 규격이 있으면 연속형 데이터 기준 DPMO, 없으면 기존 속성(불량개수) 유지
  const nextUnit = derived.dpmo.hasSpec ? derived.dpmo.unitCount : (measure.unitCount || 0);
  const nextDefect = derived.dpmo.hasSpec ? derived.dpmo.defectCount : (measure.defectCount || 0);

  return {
    ...measure,
    unitCount: nextUnit,
    defectCount: nextDefect,
    opportunityPerUnit: measure.opportunityPerUnit || 1,
    chartData: {
      ...measure.chartData,
      histogram: derived.histogram,
      controlChart: derived.controlChart,
      runChart: derived.runChart,
      boxPlot: derived.boxPlot,
      scatterPlot: derived.scatterPlot
    },
    analysisSummary: derived.summary
  };
};
