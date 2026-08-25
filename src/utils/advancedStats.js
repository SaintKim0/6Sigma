/**
 * 미니탭 스타일 고급 통계 유틸 (정규성, 공정능력, ANOVA, χ², GR&R, DOE)
 */

const erfApprox = (x) => {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
};

export const normalCdf = (z) => 0.5 * (1 + erfApprox(z / Math.SQRT2));

export const normalPdf = (z) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

export const mean = (arr) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);

export const sampleStd = (arr) => {
  const n = arr.length;
  if (n < 2) return 0;
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / (n - 1));
};

/** Moving Range 기반 within σ (I-MR, d2=1.128) */
export const withinStdFromMR = (arr) => {
  if (arr.length < 2) return 0;
  let sum = 0;
  for (let i = 1; i < arr.length; i++) sum += Math.abs(arr[i] - arr[i - 1]);
  const avgMR = sum / (arr.length - 1);
  return avgMR / 1.128;
};

/**
 * Anderson-Darling 정규성 검정 (근사 p-value)
 */
export function andersonDarlingNormality(rawData = []) {
  const data = rawData.filter(v => typeof v === 'number' && !isNaN(v)).sort((a, b) => a - b);
  const n = data.length;
  if (n < 8) {
    return { ok: false, message: '정규성 검정에는 최소 8개 이상의 데이터가 필요합니다.', n };
  }

  const m = mean(data);
  const s = sampleStd(data);
  if (s === 0) {
    return { ok: false, message: '표준편차가 0입니다.', n, mean: m, stdDev: s };
  }

  const z = data.map(v => (v - m) / s);
  let a2 = 0;
  for (let i = 0; i < n; i++) {
    const phi1 = Math.min(0.999999, Math.max(1e-10, normalCdf(z[i])));
    const phi2 = Math.min(0.999999, Math.max(1e-10, normalCdf(z[n - 1 - i])));
    a2 += (2 * (i + 1) - 1) * (Math.log(phi1) + Math.log(1 - phi2));
  }
  a2 = -n - a2 / n;
  // 모수 추정 보정
  const a2Star = a2 * (1 + 0.75 / n + 2.25 / (n * n));

  // Stephens 근사 p-value (정규성, 모수 추정)
  let pValue;
  if (a2Star >= 0.6) pValue = Math.exp(1.2937 - 5.709 * a2Star + 0.0186 * a2Star * a2Star);
  else if (a2Star >= 0.34) pValue = Math.exp(0.9177 - 4.279 * a2Star - 1.38 * a2Star * a2Star);
  else if (a2Star >= 0.2) pValue = 1 - Math.exp(-8.318 + 42.796 * a2Star - 59.938 * a2Star * a2Star);
  else pValue = 1 - Math.exp(-13.436 + 101.14 * a2Star - 223.73 * a2Star * a2Star);
  pValue = Math.max(0, Math.min(1, pValue));

  const alpha = 0.05;
  return {
    ok: true,
    n,
    mean: m,
    stdDev: s,
    a2,
    a2Star,
    pValue,
    alpha,
    isNormal: pValue >= alpha,
    conclusion: pValue >= alpha
      ? `p=${pValue.toFixed(4)} ≥ ${alpha} → 정규분포로 볼 수 있습니다.`
      : `p=${pValue.toFixed(4)} < ${alpha} → 정규성 가정이 기각됩니다. 변환·비모수 검정을 검토하세요.`
  };
}

/**
 * 공정능력 고도화: Cp/Cpk(within), Pp/Ppk(overall), %OOS, Z.bench
 */
export function computeCapabilityAdvanced(rawData = [], lsl = null, usl = null) {
  const data = rawData.filter(v => typeof v === 'number' && !isNaN(v));
  const n = data.length;
  if (n < 2) {
    return { ok: false, message: '데이터가 부족합니다.', n };
  }

  const m = mean(data);
  const sigmaOverall = sampleStd(data);
  const sigmaWithin = withinStdFromMR(data) || sigmaOverall;
  const hasLsl = lsl != null && !isNaN(lsl);
  const hasUsl = usl != null && !isNaN(usl);

  const calcIndices = (sigma) => {
    if (!sigma || sigma <= 0) return { cp: null, cpk: null, cpu: null, cpl: null };
    let cp = null; let cpu = null; let cpl = null; let cpk = null;
    if (hasLsl && hasUsl) {
      cp = (usl - lsl) / (6 * sigma);
      cpu = (usl - m) / (3 * sigma);
      cpl = (m - lsl) / (3 * sigma);
      cpk = Math.min(cpu, cpl);
    } else if (hasUsl) {
      cpu = (usl - m) / (3 * sigma);
      cpk = cpu;
    } else if (hasLsl) {
      cpl = (m - lsl) / (3 * sigma);
      cpk = cpl;
    }
    return { cp, cpk, cpu, cpl };
  };

  const within = calcIndices(sigmaWithin);
  const overall = calcIndices(sigmaOverall);

  // 실측 %OOS
  let oosCount = 0;
  if (hasLsl || hasUsl) {
    oosCount = data.filter(v => (hasLsl && v < lsl) || (hasUsl && v > usl)).length;
  }
  const pctOosObserved = n ? (oosCount / n) * 100 : null;

  // 정규 근사 기대 %OOS (overall σ)
  let pctOosExpected = null;
  if (sigmaOverall > 0 && (hasLsl || hasUsl)) {
    let p = 0;
    if (hasLsl) p += normalCdf((lsl - m) / sigmaOverall);
    if (hasUsl) p += 1 - normalCdf((usl - m) / sigmaOverall);
    pctOosExpected = p * 100;
  }

  const ppk = overall.cpk;
  const zBench = ppk != null ? ppk * 3 : null;
  const ppmExpected = pctOosExpected != null ? pctOosExpected * 10000 : null;

  return {
    ok: true,
    n,
    mean: m,
    sigmaWithin,
    sigmaOverall,
    lsl: hasLsl ? lsl : null,
    usl: hasUsl ? usl : null,
    cp: within.cp,
    cpk: within.cpk,
    cpl: within.cpl,
    cpu: within.cpu,
    pp: overall.cp,
    ppk: overall.cpk,
    ppl: overall.cpl,
    ppu: overall.cpu,
    oosCount,
    pctOosObserved,
    pctOosExpected,
    ppmExpected,
    zBench,
    note: 'Cp/Cpk는 MR 기반 within σ, Pp/Ppk는 전체 σ(표본표준편차)를 사용합니다.'
  };
}

/** F 분포 우측 꼬리 근사 p-value (Wilson-Hilferty / 간단한 근사) */
function fDistPValue(f, df1, df2) {
  if (!isFinite(f) || f < 0 || df1 <= 0 || df2 <= 0) return 1;
  // incomplete beta 근사 대신 변환 후 정규 근사
  const x = df2 / (df2 + df1 * f);
  // regularized incomplete beta I_x(df2/2, df1/2) ≈ P(F > f)
  // 간단한 연속성 보정 정규 근사 (정확도 제한적이나 UI용)
  const a = df2 / 2;
  const b = df1 / 2;
  const mu = a / (a + b);
  const varBeta = (a * b) / ((a + b) ** 2 * (a + b + 1));
  const z = (x - mu) / Math.sqrt(Math.max(varBeta, 1e-12));
  // I_x ≈ P(Beta ≤ x), p = I_x for upper F
  return Math.max(0.0001, Math.min(0.9999, normalCdf(z)));
}

/**
 * 일원 분산분석 (One-way ANOVA)
 * groups: [{ name, values: number[] }]
 */
export function oneWayAnova(groups = []) {
  const cleaned = groups
    .map(g => ({ name: g.name || 'Group', values: (g.values || []).filter(v => !isNaN(v)) }))
    .filter(g => g.values.length >= 2);
  if (cleaned.length < 2) {
    return { ok: false, message: '그룹이 2개 이상이고, 각 그룹 데이터 ≥2개가 필요합니다.' };
  }

  const k = cleaned.length;
  const all = cleaned.flatMap(g => g.values);
  const N = all.length;
  const grand = mean(all);

  let ssBetween = 0;
  let ssWithin = 0;
  const groupStats = cleaned.map(g => {
    const ni = g.values.length;
    const mi = mean(g.values);
    const ssi = g.values.reduce((s, v) => s + (v - mi) ** 2, 0);
    ssBetween += ni * (mi - grand) ** 2;
    ssWithin += ssi;
    return { name: g.name, n: ni, mean: mi, stdDev: sampleStd(g.values) };
  });

  const dfBetween = k - 1;
  const dfWithin = N - k;
  if (dfWithin <= 0) return { ok: false, message: '자유도가 부족합니다.' };

  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;
  const F = msWithin > 0 ? msBetween / msWithin : Infinity;
  const pValue = fDistPValue(F, dfBetween, dfWithin);
  const alpha = 0.05;

  return {
    ok: true,
    groupStats,
    N,
    k,
    grandMean: grand,
    ssBetween,
    ssWithin,
    ssTotal: ssBetween + ssWithin,
    dfBetween,
    dfWithin,
    msBetween,
    msWithin,
    F,
    pValue,
    alpha,
    significant: pValue < alpha,
    conclusion: pValue < alpha
      ? `F=${F.toFixed(3)}, p=${pValue.toFixed(4)} < ${alpha} → 그룹 평균에 유의한 차이가 있습니다.`
      : `F=${F.toFixed(3)}, p=${pValue.toFixed(4)} ≥ ${alpha} → 그룹 평균 차이가 유의하지 않습니다.`
  };
}

/**
 * Tukey–Kramer 사후검정 (α=0.05 기본)
 * anovaResult: oneWayAnova 성공 결과
 */
const Q05_TABLE = {
  // df → critical q for k=2..8 (studentized range, α=0.05)
  5: [3.64, 4.60, 5.22, 5.67, 6.03, 6.33, 6.58],
  10: [3.15, 3.88, 4.33, 4.65, 4.91, 5.12, 5.30],
  15: [3.01, 3.67, 4.08, 4.37, 4.59, 4.78, 4.94],
  20: [2.95, 3.58, 3.96, 4.23, 4.45, 4.62, 4.77],
  30: [2.89, 3.49, 3.85, 4.10, 4.30, 4.46, 4.60],
  40: [2.86, 3.44, 3.79, 4.04, 4.23, 4.39, 4.52],
  60: [2.83, 3.40, 3.74, 3.98, 4.16, 4.31, 4.44],
  120: [2.80, 3.36, 3.68, 3.92, 4.10, 4.24, 4.36],
  9999: [2.77, 3.31, 3.63, 3.86, 4.03, 4.17, 4.29]
};

function studentizedRangeCrit(k, df, alpha = 0.05) {
  if (alpha !== 0.05) {
    // 보수적: α≠0.05면 0.05표 + 약간 보정
  }
  const kk = Math.max(2, Math.min(8, Math.round(k)));
  const col = kk - 2;
  const dfs = Object.keys(Q05_TABLE).map(Number).sort((a, b) => a - b);
  let lo = dfs[0];
  let hi = dfs[dfs.length - 1];
  for (let i = 0; i < dfs.length; i++) {
    if (dfs[i] <= df) lo = dfs[i];
    if (dfs[i] >= df) { hi = dfs[i]; break; }
  }
  const qLo = Q05_TABLE[lo][col];
  const qHi = Q05_TABLE[hi][col];
  if (lo === hi) return qLo;
  const t = (df - lo) / (hi - lo);
  return qLo + t * (qHi - qLo);
}

export function tukeyHsd(anovaResult, alpha = 0.05) {
  if (!anovaResult?.ok) {
    return { ok: false, message: anovaResult?.message || 'ANOVA 결과가 없습니다.' };
  }
  if (!anovaResult.significant) {
    return {
      ok: true,
      skipped: true,
      pairs: [],
      conclusion: 'ANOVA가 비유의하여 사후검정(Tukey)을 생략합니다.'
    };
  }
  const { groupStats, msWithin, dfWithin, k } = anovaResult;
  if (!(msWithin > 0) || dfWithin < 1) {
    return { ok: false, message: '사후검정에 필요한 잔차 분산/자유도가 부족합니다.' };
  }
  const qCrit = studentizedRangeCrit(k, dfWithin, alpha);
  const pairs = [];
  for (let i = 0; i < groupStats.length; i++) {
    for (let j = i + 1; j < groupStats.length; j++) {
      const a = groupStats[i];
      const b = groupStats[j];
      const se = Math.sqrt(msWithin * (1 / a.n + 1 / b.n) / 2); // Tukey–Kramer
      const diff = a.mean - b.mean;
      const q = se > 0 ? Math.abs(diff) / se : 0;
      const hsd = qCrit * se;
      pairs.push({
        a: a.name,
        b: b.name,
        meanA: a.mean,
        meanB: b.mean,
        diff,
        q,
        qCrit,
        hsd,
        ciLow: diff - hsd,
        ciHigh: diff + hsd,
        significant: q > qCrit
      });
    }
  }
  const sig = pairs.filter(p => p.significant);
  return {
    ok: true,
    skipped: false,
    alpha,
    qCrit,
    pairs,
    conclusion: sig.length
      ? `유의한 쌍 ${sig.length}개: ${sig.map(p => `${p.a}≠${p.b}`).join(', ')}`
      : '쌍별 비교에서는 유의 차이가 없습니다(전체 ANOVA만 유의).'
  };
}

/**
 * 카이제곱 독립성 검정 (분할표)
 * table: number[][] 행×열 도수
 */
export function chiSquareIndependence(table = [], rowLabels = [], colLabels = []) {
  const rows = table.length;
  const cols = table[0]?.length || 0;
  if (rows < 2 || cols < 2) {
    return { ok: false, message: '최소 2×2 분할표가 필요합니다.' };
  }

  const rowSum = table.map(r => r.reduce((a, b) => a + Number(b || 0), 0));
  const colSum = Array.from({ length: cols }, (_, j) =>
    table.reduce((a, r) => a + Number(r[j] || 0), 0)
  );
  const total = rowSum.reduce((a, b) => a + b, 0);
  if (total <= 0) return { ok: false, message: '관측 도수가 없습니다.' };

  let chi2 = 0;
  const expected = table.map((r, i) => r.map((_, j) => (rowSum[i] * colSum[j]) / total));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const e = expected[i][j];
      if (e > 0) chi2 += ((Number(table[i][j]) - e) ** 2) / e;
    }
  }
  const df = (rows - 1) * (cols - 1);
  // χ² p-value 근사: Wilson-Hilferty
  const h = 1 - 2 / (9 * df);
  const z = (Math.pow(chi2 / df, 1 / 3) - h) / Math.sqrt(2 / (9 * df));
  const pValue = Math.max(0.0001, Math.min(0.9999, 1 - normalCdf(z)));
  const alpha = 0.05;

  return {
    ok: true,
    table,
    expected,
    rowLabels: rowLabels.length ? rowLabels : table.map((_, i) => `행${i + 1}`),
    colLabels: colLabels.length ? colLabels : Array.from({ length: cols }, (_, j) => `열${j + 1}`),
    rowSum,
    colSum,
    total,
    chi2,
    df,
    pValue,
    alpha,
    significant: pValue < alpha,
    conclusion: pValue < alpha
      ? `χ²=${chi2.toFixed(3)}, p=${pValue.toFixed(4)} < ${alpha} → 행·열 변수가 독립이 아닙니다(연관 있음).`
      : `χ²=${chi2.toFixed(3)}, p=${pValue.toFixed(4)} ≥ ${alpha} → 독립이라고 볼 수 있습니다.`
  };
}

/**
 * Gage R&R (Range method / AIAG 간략)
 * measurements[part][operator][rep] or flat list with structure
 * dataRows: [{ part, operator, value }]
 */
export function gageRndRFromRows(rows = [], opts = {}) {
  const data = rows
    .map(r => ({ part: String(r.part), operator: String(r.operator), value: Number(r.value) }))
    .filter(r => r.part && r.operator && !isNaN(r.value));

  if (data.length < 6) {
    return { ok: false, message: '최소 부품×평가자×반복 데이터가 필요합니다. (예: 10×3×2)' };
  }

  const parts = [...new Set(data.map(d => d.part))];
  const operators = [...new Set(data.map(d => d.operator))];
  const n = parts.length;
  const k = operators.length;

  // replicates per cell
  const cellMap = new Map();
  data.forEach(d => {
    const key = `${d.part}||${d.operator}`;
    if (!cellMap.has(key)) cellMap.set(key, []);
    cellMap.get(key).push(d.value);
  });
  const reps = Math.min(...[...cellMap.values()].map(v => v.length));
  if (reps < 2) return { ok: false, message: '각 부품×평가자 조합에 반복측정 ≥2가 필요합니다.' };

  // Average range within cell (repeatability)
  let sumR = 0;
  let cellCount = 0;
  cellMap.forEach(vals => {
    const slice = vals.slice(0, reps);
    sumR += Math.max(...slice) - Math.min(...slice);
    cellCount += 1;
  });
  const Rbar = sumR / cellCount;

  // d2 constants (approx) for subgroup size = reps
  const d2Table = { 2: 1.128, 3: 1.693, 4: 2.059, 5: 2.326 };
  const d2 = d2Table[reps] || 1.128;
  const EV = Rbar / d2; // equipment variation (std)

  // Xbar per operator
  const opMeans = operators.map(op => {
    const vals = data.filter(d => d.operator === op).map(d => d.value);
    return mean(vals);
  });
  const XbarDiff = Math.max(...opMeans) - Math.min(...opMeans);
  // d2* for operators (k), rough use 1.91 for 3 ops — AIAG Xbardiff / d2*
  const d2StarOp = k === 2 ? 1.41 : k === 3 ? 1.91 : k === 4 ? 2.24 : 2.48;
  let AV = Math.sqrt(Math.max(0, (XbarDiff / d2StarOp) ** 2 - (EV * EV) / (n * reps)));

  const GRR = Math.sqrt(EV * EV + AV * AV);

  // Part variation: range of part averages
  const partMeans = parts.map(p => mean(data.filter(d => d.part === p).map(d => d.value)));
  const Rp = Math.max(...partMeans) - Math.min(...partMeans);
  const d2StarPart = n <= 2 ? 1.41 : n <= 3 ? 1.91 : n <= 4 ? 2.24 : n <= 5 ? 2.48 : n <= 6 ? 2.67 : n <= 7 ? 2.83 : n <= 8 ? 2.96 : n <= 9 ? 3.08 : 3.18;
  const PV = Rp / d2StarPart;
  const TV = Math.sqrt(GRR * GRR + PV * PV);

  const pctEV = TV > 0 ? (EV / TV) * 100 : 0;
  const pctAV = TV > 0 ? (AV / TV) * 100 : 0;
  const pctGRR = TV > 0 ? (GRR / TV) * 100 : 0;
  const pctPV = TV > 0 ? (PV / TV) * 100 : 0;
  const ndc = GRR > 0 ? Math.max(1, Math.floor(1.41 * (PV / GRR))) : 1;

  let verdict = '보통';
  if (pctGRR < 10) verdict = '우수 (≤10%)';
  else if (pctGRR <= 30) verdict = '허용 가능 (10~30%)';
  else verdict = '부적합 (>30%) — 측정시스템 개선 필요';

  const tolerance = opts.tolerance != null && !isNaN(opts.tolerance) ? Number(opts.tolerance) : null;
  const pctTol = tolerance && tolerance > 0 ? (6 * GRR / tolerance) * 100 : null;

  return {
    ok: true,
    nParts: n,
    nOperators: k,
    replicates: reps,
    EV,
    AV,
    GRR,
    PV,
    TV,
    pctEV,
    pctAV,
    pctGRR,
    pctPV,
    ndc,
    pctTol,
    verdict,
    conclusion: `%GR&R=${pctGRR.toFixed(1)}% · ndc=${ndc} → ${verdict}`
  };
}

/** t 분포 양측 p-value 근사 (정규 근사, df 클 때 / 보수적) */
function tDistTwoTailP(t, df) {
  if (!isFinite(t) || df <= 0) return 1;
  // Student-t → 정규 근사 with mild inflation for small df
  const z = Math.abs(t) * Math.sqrt(df / (df + t * t));
  const p = 2 * (1 - normalCdf(z));
  return Math.max(0.0001, Math.min(0.9999, p));
}

/**
 * Pearson 상관 + t검정 p-value
 * x, y: number[]
 */
export function pearsonCorrelation(x = [], y = []) {
  const n = Math.min(x.length, y.length);
  const pairs = [];
  for (let i = 0; i < n; i++) {
    const a = Number(x[i]);
    const b = Number(y[i]);
    if (!isNaN(a) && !isNaN(b)) pairs.push([a, b]);
  }
  if (pairs.length < 3) {
    return { ok: false, message: '유효한 (x,y) 쌍이 최소 3개 필요합니다.', n: pairs.length };
  }
  const xs = pairs.map(p => p[0]);
  const ys = pairs.map(p => p[1]);
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0; let dx = 0; let dy = 0;
  for (let i = 0; i < pairs.length; i++) {
    const a = xs[i] - mx;
    const b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  if (dx <= 0 || dy <= 0) {
    return { ok: false, message: '분산이 0인 변수가 있어 상관을 계산할 수 없습니다.', n: pairs.length };
  }
  const r = num / Math.sqrt(dx * dy);
  const df = pairs.length - 2;
  const tStat = r * Math.sqrt(df / Math.max(1e-12, 1 - r * r));
  const pValue = tDistTwoTailP(tStat, df);
  const absR = Math.abs(r);
  let strength = '매우 약함';
  if (absR >= 0.9) strength = '매우 강함';
  else if (absR >= 0.7) strength = '강함';
  else if (absR >= 0.4) strength = '보통';
  else if (absR >= 0.2) strength = '약함';
  const direction = r >= 0 ? '양의' : '음의';
  return {
    ok: true,
    n: pairs.length,
    r,
    r2: r * r,
    tStat,
    df,
    pValue,
    significant: pValue < 0.05,
    strength,
    conclusion: `Pearson r=${r.toFixed(4)} (${direction} ${strength}), p=${pValue.toFixed(4)}${pValue < 0.05 ? ' → 유의(α=0.05)' : ' → 비유의'}`
  };
}

/**
 * 다중 선형회귀 (최소제곱, 정규방정식)
 * y: number[], X: number[][] (각 행 = 한 관측의 예측변수들, 절편은 자동 추가)
 * names: 예측변수 이름
 */
export function multipleRegression(y = [], X = [], names = []) {
  const n = y.length;
  if (n < 3 || X.length !== n) {
    return { ok: false, message: 'y와 X 행 수가 같고 최소 3개 관측이 필요합니다.' };
  }
  const k = X[0]?.length || 0;
  if (k < 1) return { ok: false, message: '예측변수(X)가 최소 1개 필요합니다.' };
  for (let i = 0; i < n; i++) {
    if (y[i] == null || isNaN(y[i]) || !Array.isArray(X[i]) || X[i].length !== k || X[i].some(v => isNaN(Number(v)))) {
      return { ok: false, message: `${i + 1}번째 행에 결측/형식 오류가 있습니다.` };
    }
  }

  // Design matrix with intercept
  const p = k + 1;
  const A = Array.from({ length: n }, (_, i) => [1, ...X[i].map(Number)]);
  const yt = y.map(Number);

  // XtX and XtY
  const XtX = Array.from({ length: p }, () => Array(p).fill(0));
  const XtY = Array(p).fill(0);
  for (let i = 0; i < n; i++) {
    for (let r = 0; r < p; r++) {
      XtY[r] += A[i][r] * yt[i];
      for (let c = 0; c < p; c++) XtX[r][c] += A[i][r] * A[i][c];
    }
  }

  const beta = solveLinearSystem(XtX, XtY);
  if (!beta) return { ok: false, message: '행렬이 특이합니다(공선성). 변수를 줄이거나 데이터를 확인하세요.' };

  const fitted = A.map(row => row.reduce((s, v, j) => s + v * beta[j], 0));
  const residuals = yt.map((yi, i) => yi - fitted[i]);
  const yMean = mean(yt);
  const sst = yt.reduce((s, yi) => s + (yi - yMean) ** 2, 0);
  const sse = residuals.reduce((s, e) => s + e * e, 0);
  const ssr = sst - sse;
  const r2 = sst > 0 ? ssr / sst : 0;
  const adjR2 = n > p ? 1 - ((1 - r2) * (n - 1)) / (n - p) : r2;
  const mse = n > p ? sse / (n - p) : 0;
  const rmse = Math.sqrt(mse);
  const resMean = mean(residuals);
  const resStd = sampleStd(residuals);
  const sortedRes = [...residuals].sort((a, b) => a - b);
  const resMin = sortedRes[0];
  const resMax = sortedRes[sortedRes.length - 1];

  const varNames = names.length === k
    ? names
    : Array.from({ length: k }, (_, i) => `X${i + 1}`);
  const coefficients = [
    { name: 'Intercept', value: beta[0] },
    ...varNames.map((name, i) => ({ name, value: beta[i + 1] }))
  ];

  const eq = `Ŷ = ${beta[0].toFixed(4)}${varNames.map((nm, i) => {
    const b = beta[i + 1];
    const sign = b >= 0 ? ' + ' : ' - ';
    return `${sign}${Math.abs(b).toFixed(4)}·${nm}`;
  }).join('')}`;

  return {
    ok: true,
    n,
    k,
    coefficients,
    equation: eq,
    r2,
    adjR2,
    rmse,
    sse,
    residuals: {
      mean: resMean,
      std: resStd,
      min: resMin,
      max: resMax,
      values: residuals
    },
    fitted,
    conclusion: `R²=${(r2 * 100).toFixed(1)}%, Adj.R²=${(adjR2 * 100).toFixed(1)}%, RMSE=${rmse.toFixed(4)}`
  };
}

/** Gaussian elimination with partial pivoting */
function solveLinearSystem(matrix, vector) {
  const n = vector.length;
  const M = matrix.map((row, i) => [...row, vector[i]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    }
    if (Math.abs(M[pivot][col]) < 1e-12) return null;
    if (pivot !== col) [M[col], M[pivot]] = [M[pivot], M[col]];
    const div = M[col][col];
    for (let c = col; c <= n; c++) M[col][c] /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col];
      for (let c = col; c <= n; c++) M[r][c] -= f * M[col][c];
    }
  }
  return M.map(row => row[n]);
}

/**
 * 속성 관리도 / Xbar-R 보조 계산
 * type: 'p'|'np'|'c'|'u'|'xbar'|'r'|'i-mr'
 * samples:
 *  - p/np: { defects, sampleSize }
 *  - c: { count }
 *  - u: { count, area }
 *  - xbar/r: { values: number[] }
 *  - i-mr: { value }
 */
export function computeControlChartStats(type, samples = []) {
  const list = Array.isArray(samples) ? samples : [];
  if (!list.length) return { ok: false, message: '데이터가 없습니다.' };

  if (type === 'p' || type === 'np') {
    const rows = list.map((s, i) => {
      const defects = s.defects != null ? Number(s.defects) : Number(s.values?.[0]);
      const n = s.sampleSize != null ? Number(s.sampleSize) : Number(s.values?.[1] ?? s.n);
      return { defects, n, label: s.label || `Sample ${i + 1}` };
    }).filter(r => r.n > 0 && !isNaN(r.defects));
    if (rows.length < 2) return { ok: false, message: '샘플이 부족합니다 (defects, n).' };
    const totalD = rows.reduce((s, r) => s + r.defects, 0);
    const totalN = rows.reduce((s, r) => s + r.n, 0);
    const pBar = totalD / totalN;
    if (type === 'p') {
      const values = rows.map(r => r.defects / r.n);
      const ucls = rows.map(r => Math.min(1, pBar + 3 * Math.sqrt(pBar * (1 - pBar) / r.n)));
      const lcls = rows.map(r => Math.max(0, pBar - 3 * Math.sqrt(pBar * (1 - pBar) / r.n)));
      return {
        ok: true, chartType: 'p', values, centerLine: pBar,
        ucl: ucls, lcl: lcls, variableLimits: true,
        labels: rows.map(r => r.label),
        meta: { pBar, totalD, totalN }
      };
    }
    // np — equal n preferred; use average n if varying
    const nBar = totalN / rows.length;
    const values = rows.map(r => r.defects);
    const ucl = pBar * nBar + 3 * Math.sqrt(nBar * pBar * (1 - pBar));
    const lcl = Math.max(0, pBar * nBar - 3 * Math.sqrt(nBar * pBar * (1 - pBar)));
    return {
      ok: true, chartType: 'np', values, centerLine: pBar * nBar, ucl, lcl,
      labels: rows.map(r => r.label),
      meta: { pBar, nBar, note: 'np 한계는 평균 n 기준입니다.' }
    };
  }

  if (type === 'c') {
    const rows = list.map((s, i) => ({
      count: s.count != null ? Number(s.count) : Number(s.value ?? s.values?.[0]),
      label: s.label || `Sample ${i + 1}`
    })).filter(r => !isNaN(r.count));
    if (rows.length < 2) return { ok: false, message: '결점 수(c) 데이터가 부족합니다.' };
    const cBar = mean(rows.map(r => r.count));
    const ucl = cBar + 3 * Math.sqrt(cBar);
    const lcl = Math.max(0, cBar - 3 * Math.sqrt(cBar));
    return {
      ok: true, chartType: 'c', values: rows.map(r => r.count),
      centerLine: cBar, ucl, lcl, labels: rows.map(r => r.label)
    };
  }

  if (type === 'u') {
    const rows = list.map((s, i) => {
      const count = s.count != null ? Number(s.count) : Number(s.values?.[0]);
      const area = s.area != null ? Number(s.area) : Number(s.values?.[1] ?? 1);
      return { count, area, label: s.label || `Sample ${i + 1}` };
    }).filter(r => r.area > 0 && !isNaN(r.count));
    if (rows.length < 2) return { ok: false, message: 'u 차트는 count, area가 필요합니다.' };
    const totalC = rows.reduce((s, r) => s + r.count, 0);
    const totalA = rows.reduce((s, r) => s + r.area, 0);
    const uBar = totalC / totalA;
    const values = rows.map(r => r.count / r.area);
    const ucls = rows.map(r => uBar + 3 * Math.sqrt(uBar / r.area));
    const lcls = rows.map(r => Math.max(0, uBar - 3 * Math.sqrt(uBar / r.area)));
    return {
      ok: true, chartType: 'u', values, centerLine: uBar,
      ucl: ucls, lcl: lcls, variableLimits: true,
      labels: rows.map(r => r.label), meta: { uBar }
    };
  }

  return { ok: false, message: `미지원 유형: ${type}` };
}

/**
 * 2-수준 Factorial 주효과 / 2인자 교호작용
 * runs: [{ factors: {A: -1|1, B: -1|1, ...}, y: number }]
 */
export function doeEffects(runs = []) {
  const cleaned = runs.filter(r => r && typeof r.y === 'number' && !isNaN(r.y) && r.factors);
  if (cleaned.length < 4) {
    return { ok: false, message: '최소 4개 이상의 실험 run(y)이 필요합니다.' };
  }

  const factorNames = [...new Set(cleaned.flatMap(r => Object.keys(r.factors || {})))];
  if (factorNames.length < 2) {
    return { ok: false, message: '인자가 2개 이상 필요합니다.' };
  }

  const n = cleaned.length;
  const mainEffects = factorNames.map(name => {
    let plus = 0; let minus = 0; let np = 0; let nm = 0;
    cleaned.forEach(r => {
      const lvl = Number(r.factors[name]);
      if (lvl >= 0) { plus += r.y; np += 1; }
      else { minus += r.y; nm += 1; }
    });
    const effect = (np && nm) ? (plus / np) - (minus / nm) : 0;
    return { name, effect, meanPlus: np ? plus / np : null, meanMinus: nm ? minus / nm : null };
  });

  const interactions = [];
  for (let i = 0; i < factorNames.length; i++) {
    for (let j = i + 1; j < factorNames.length; j++) {
      const a = factorNames[i];
      const b = factorNames[j];
      let plus = 0; let minus = 0; let np = 0; let nm = 0;
      cleaned.forEach(r => {
        const prod = Number(r.factors[a]) * Number(r.factors[b]);
        if (prod >= 0) { plus += r.y; np += 1; }
        else { minus += r.y; nm += 1; }
      });
      const effect = (np && nm) ? (plus / np) - (minus / nm) : 0;
      interactions.push({ name: `${a}×${b}`, effect });
    }
  }

  const sorted = [...mainEffects].sort((x, y) => Math.abs(y.effect) - Math.abs(x.effect));
  return {
    ok: true,
    n,
    factorNames,
    mainEffects,
    interactions,
    topEffect: sorted[0] || null,
    conclusion: sorted[0]
      ? `주효과가 가장 큰 인자: ${sorted[0].name} (효과=${sorted[0].effect.toFixed(3)})`
      : ''
  };
}
