/**
 * 추가 통계: 비율검정, 등분산, 비모수, Weibull, 샘플크기, 잔차진단
 */
import { mean, sampleStd, normalCdf, andersonDarlingNormality } from './advancedStats';

const clampP = (p) => Math.max(0.0001, Math.min(0.9999, p));

function zTwoTailP(z) {
  return clampP(2 * (1 - normalCdf(Math.abs(z))));
}

function chiSquareApproxP(x, df) {
  // Wilson-Hilferty 근사 → 정규
  if (x < 0 || df <= 0) return 1;
  const h = 2 / (9 * df);
  const z = ((x / df) ** (1 / 3) - (1 - h)) / Math.sqrt(h);
  return clampP(1 - normalCdf(z));
}

/** 1-비율 z검정 (H0: p = p0) */
export function oneProportionTest({ successes, n, p0 = 0.5 }) {
  const x = Number(successes);
  const nn = Number(n);
  const pHyp = Number(p0);
  if (!(nn > 0) || x < 0 || x > nn || pHyp <= 0 || pHyp >= 1) {
    return { ok: false, message: '성공수·표본수·가설비율(0~1)을 확인하세요.' };
  }
  const phat = x / nn;
  const se = Math.sqrt(pHyp * (1 - pHyp) / nn);
  if (se <= 0) return { ok: false, message: '표준오차를 계산할 수 없습니다.' };
  const z = (phat - pHyp) / se;
  const pValue = zTwoTailP(z);
  return {
    ok: true,
    type: '1-proportion',
    n: nn,
    successes: x,
    phat,
    p0: pHyp,
    z,
    pValue,
    significant: pValue < 0.05,
    conclusion: `p̂=${(phat * 100).toFixed(2)}% vs p₀=${(pHyp * 100).toFixed(2)}%, z=${z.toFixed(3)}, p=${pValue.toFixed(4)}${pValue < 0.05 ? ' → 유의' : ' → 비유의'}`
  };
}

/** 2-비율 z검정 */
export function twoProportionTest({ x1, n1, x2, n2 }) {
  const a = Number(x1); const na = Number(n1);
  const b = Number(x2); const nb = Number(n2);
  if (!(na > 0 && nb > 0) || a < 0 || b < 0 || a > na || b > nb) {
    return { ok: false, message: '두 그룹의 성공수·표본수를 확인하세요.' };
  }
  const p1 = a / na;
  const p2 = b / nb;
  const pPool = (a + b) / (na + nb);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / na + 1 / nb));
  if (se <= 0) return { ok: false, message: '표준오차를 계산할 수 없습니다.' };
  const z = (p1 - p2) / se;
  const pValue = zTwoTailP(z);
  return {
    ok: true,
    type: '2-proportion',
    p1, p2, pPool, z, pValue,
    n1: na, n2: nb, x1: a, x2: b,
    significant: pValue < 0.05,
    diff: p1 - p2,
    conclusion: `p₁=${(p1 * 100).toFixed(2)}%, p₂=${(p2 * 100).toFixed(2)}%, Δ=${((p1 - p2) * 100).toFixed(2)}%p, z=${z.toFixed(3)}, p=${pValue.toFixed(4)}${pValue < 0.05 ? ' → 유의' : ' → 비유의'}`
  };
}

/** Levene 등분산 (중앙값 기반, Brown-Forsythe) */
export function leveneTest(groups = []) {
  const cleaned = groups
    .map(g => ({ name: g.name || 'G', values: (g.values || []).filter(v => !isNaN(Number(v))).map(Number) }))
    .filter(g => g.values.length >= 2);
  if (cleaned.length < 2) return { ok: false, message: '그룹이 2개 이상, 각 그룹 n≥2 필요합니다.' };

  const medians = cleaned.map(g => {
    const s = [...g.values].sort((a, b) => a - b);
    const m = s.length;
    return m % 2 ? s[(m - 1) / 2] : (s[m / 2 - 1] + s[m / 2]) / 2;
  });
  const zGroups = cleaned.map((g, i) => g.values.map(v => Math.abs(v - medians[i])));
  const allZ = zGroups.flat();
  const N = allZ.length;
  const k = cleaned.length;
  const grand = mean(allZ);
  const zMeans = zGroups.map(z => mean(z));

  let ssb = 0;
  zGroups.forEach((z, i) => { ssb += z.length * (zMeans[i] - grand) ** 2; });
  let ssw = 0;
  zGroups.forEach((z, i) => { z.forEach(v => { ssw += (v - zMeans[i]) ** 2; }); });

  const df1 = k - 1;
  const df2 = N - k;
  if (df2 <= 0 || ssw <= 0) return { ok: false, message: '자유도/분산이 부족합니다.' };
  const msb = ssb / df1;
  const msw = ssw / df2;
  const W = msb / msw;
  // F p-value 근사 (정규 변환)
  const x = df2 / (df2 + df1 * W);
  const a = df2 / 2; const b = df1 / 2;
  const mu = a / (a + b);
  const varBeta = (a * b) / ((a + b) ** 2 * (a + b + 1));
  const zz = (x - mu) / Math.sqrt(Math.max(varBeta, 1e-12));
  const pValue = clampP(normalCdf(zz));

  return {
    ok: true,
    W,
    df1,
    df2,
    pValue,
    groupNs: cleaned.map(g => g.values.length),
    groupNames: cleaned.map(g => g.name),
    equalVariance: pValue >= 0.05,
    conclusion: `Levene W=${W.toFixed(3)}, p=${pValue.toFixed(4)}${pValue >= 0.05 ? ' → 등분산 가정 OK' : ' → 등분산 기각(이분산 주의)'}`
  };
}

function rankArray(arr) {
  const indexed = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const ranks = Array(arr.length).fill(0);
  let i = 0;
  while (i < indexed.length) {
    let j = i;
    while (j + 1 < indexed.length && indexed[j + 1].v === indexed[i].v) j++;
    const avg = (i + j + 2) / 2; // 1-based average rank
    for (let k = i; k <= j; k++) ranks[indexed[k].i] = avg;
    i = j + 1;
  }
  return ranks;
}

/** Mann-Whitney U (2표본) */
export function mannWhitneyU(a = [], b = []) {
  const x = a.filter(v => !isNaN(Number(v))).map(Number);
  const y = b.filter(v => !isNaN(Number(v))).map(Number);
  if (x.length < 2 || y.length < 2) return { ok: false, message: '각 그룹 최소 2개 필요합니다.' };
  const combined = [...x, ...y];
  const ranks = rankArray(combined);
  const n1 = x.length;
  const n2 = y.length;
  const R1 = ranks.slice(0, n1).reduce((s, r) => s + r, 0);
  const U1 = R1 - (n1 * (n1 + 1)) / 2;
  const U2 = n1 * n2 - U1;
  const U = Math.min(U1, U2);
  const mu = (n1 * n2) / 2;
  const sigma = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
  const z = (U - mu + 0.5) / sigma; // continuity
  const pValue = zTwoTailP(z);
  return {
    ok: true,
    n1, n2, U, U1, U2, z, pValue,
    median1: median(x),
    median2: median(y),
    significant: pValue < 0.05,
    conclusion: `Mann-Whitney U=${U.toFixed(1)}, z=${z.toFixed(3)}, p=${pValue.toFixed(4)}${pValue < 0.05 ? ' → 중앙값 차이 유의' : ' → 비유의'}`
  };
}

function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}

/** Kruskal-Wallis */
export function kruskalWallis(groups = []) {
  const cleaned = groups
    .map(g => ({ name: g.name || 'G', values: (g.values || []).filter(v => !isNaN(Number(v))).map(Number) }))
    .filter(g => g.values.length >= 1);
  if (cleaned.length < 3) return { ok: false, message: '그룹 3개 이상 필요합니다.' };
  const all = cleaned.flatMap(g => g.values);
  const N = all.length;
  const ranks = rankArray(all);
  let offset = 0;
  let H = 0;
  cleaned.forEach(g => {
    const n = g.values.length;
    const R = ranks.slice(offset, offset + n).reduce((s, r) => s + r, 0);
    offset += n;
    H += (R * R) / n;
  });
  H = (12 / (N * (N + 1))) * H - 3 * (N + 1);
  const df = cleaned.length - 1;
  const pValue = chiSquareApproxP(H, df);
  return {
    ok: true,
    H,
    df,
    pValue,
    groupNs: cleaned.map(g => g.values.length),
    significant: pValue < 0.05,
    conclusion: `Kruskal-Wallis H=${H.toFixed(3)}, df=${df}, p=${pValue.toFixed(4)}${pValue < 0.05 ? ' → 그룹 차이 유의' : ' → 비유의'}`
  };
}

/** 잔차 진단 (회귀 결과 보조) */
export function residualDiagnostics(residuals = [], fitted = []) {
  const e = residuals.filter(v => !isNaN(v));
  if (e.length < 5) return { ok: false, message: '잔차가 부족합니다.' };
  const normality = andersonDarlingNormality(e);
  // 잔차를 적합값 중앙 기준 2그룹으로 나눠 등분산
  const pairs = fitted.map((f, i) => ({ f, e: residuals[i] })).filter(p => !isNaN(p.f) && !isNaN(p.e));
  const mid = median(pairs.map(p => p.f));
  const g1 = pairs.filter(p => p.f <= mid).map(p => p.e);
  const g2 = pairs.filter(p => p.f > mid).map(p => p.e);
  const lev = (g1.length >= 2 && g2.length >= 2)
    ? leveneTest([{ name: 'low-fit', values: g1 }, { name: 'high-fit', values: g2 }])
    : { ok: false };
  return {
    ok: true,
    normality,
    levene: lev,
    residualMean: mean(e),
    residualStd: sampleStd(e),
    points: pairs,
    conclusion: [
      normality.ok ? `잔차 정규성 p=${normality.pValue.toFixed(3)}${normality.isNormal ? ' OK' : ' 주의'}` : '',
      lev.ok ? `잔차 등분산 p=${lev.pValue.toFixed(3)}${lev.equalVariance ? ' OK' : ' 주의'}` : ''
    ].filter(Boolean).join(' · ')
  };
}

/**
 * Weibull 2-모수 MLE 근사 (수명 데이터, 우측절단 없음)
 * shape β, scale η
 */
export function weibullFit(lifetimes = []) {
  const t = lifetimes.filter(v => Number(v) > 0).map(Number);
  if (t.length < 5) return { ok: false, message: '양수 수명 데이터가 최소 5개 필요합니다.' };
  const n = t.length;
  // β 탐색 (1D)
  let bestB = 1;
  let bestLL = -Infinity;
  for (let b = 0.3; b <= 5.01; b += 0.05) {
    const tB = t.map(x => x ** b);
    const sumTB = tB.reduce((s, v) => s + v, 0);
    const eta = (sumTB / n) ** (1 / b);
    const ll = n * Math.log(b) - n * b * Math.log(eta) + (b - 1) * t.reduce((s, x) => s + Math.log(x), 0)
      - t.reduce((s, x) => s + (x / eta) ** b, 0);
    if (ll > bestLL) { bestLL = ll; bestB = b; }
  }
  const beta = bestB;
  const sumTB = t.reduce((s, x) => s + x ** beta, 0);
  const eta = (sumTB / n) ** (1 / beta);
  const B10 = eta * ((-Math.log(0.9)) ** (1 / beta));
  const MTTF = eta * gammaApprox(1 + 1 / beta);
  const reliabilityAt = (x) => Math.exp(-((x / eta) ** beta));
  return {
    ok: true,
    n,
    shape: beta,
    scale: eta,
    B10,
    MTTF,
    R50: eta * ((-Math.log(0.5)) ** (1 / beta)),
    reliabilityAt,
    conclusion: `Weibull β(shape)=${beta.toFixed(3)}, η(scale)=${eta.toFixed(3)}, B10=${B10.toFixed(3)}, MTTF≈${MTTF.toFixed(3)}`
  };
}

function gammaApprox(z) {
  // Lanczos 일부 근사 (z>0)
  const g = 7;
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.984369654078991e-6, 1.5056327351493116e-7
  ];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaApprox(1 - z));
  z -= 1;
  let x = p[0];
  for (let i = 1; i < g + 2; i++) x += p[i] / (z + i);
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * (t ** (z + 0.5)) * Math.exp(-t) * x;
}

/**
 * 샘플 크기 계산
 * - mean: 1-표본 / 2-표본 평균 (정규, 양측)
 * - proportion: 1-비율 / 2-비율
 */
export function sampleSizeCalculator({
  mode = 'mean_1sample',
  alpha = 0.05,
  power = 0.8,
  delta = 1,
  sigma = 1,
  p0 = 0.5,
  p1 = 0.4,
  pA = 0.1,
  pB = 0.05
} = {}) {
  const zAlpha = invNormApprox(1 - alpha / 2);
  const zBeta = invNormApprox(power);

  if (mode === 'mean_1sample') {
    if (!(delta > 0 && sigma > 0)) return { ok: false, message: 'delta, sigma > 0 필요' };
    const n = Math.ceil(((zAlpha + zBeta) * sigma / delta) ** 2);
    return { ok: true, mode, n, formula: 'n = ((zα/2+zβ)·σ/δ)²', conclusion: `1표본 평균: 필요 n ≈ ${n}` };
  }
  if (mode === 'mean_2sample') {
    if (!(delta > 0 && sigma > 0)) return { ok: false, message: 'delta, sigma > 0 필요' };
    const n = Math.ceil(2 * ((zAlpha + zBeta) * sigma / delta) ** 2);
    return { ok: true, mode, n, nPerGroup: n, formula: 'n/그룹 = 2·((zα/2+zβ)·σ/δ)²', conclusion: `2표본 평균: 그룹당 n ≈ ${n}` };
  }
  if (mode === 'prop_1sample') {
    const se = Math.sqrt(p0 * (1 - p0));
    const d = Math.abs(p1 - p0);
    if (d <= 0) return { ok: false, message: 'p0와 p1이 달라야 합니다.' };
    const n = Math.ceil(((zAlpha * se + zBeta * Math.sqrt(p1 * (1 - p1))) / d) ** 2);
    return { ok: true, mode, n, conclusion: `1비율: 필요 n ≈ ${n}` };
  }
  if (mode === 'prop_2sample') {
    const d = Math.abs(pA - pB);
    if (d <= 0) return { ok: false, message: '두 비율이 달라야 합니다.' };
    const pBar = (pA + pB) / 2;
    const n = Math.ceil(2 * ((zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + zBeta * Math.sqrt(pA * (1 - pA) + pB * (1 - pB))) / d) ** 2);
    return { ok: true, mode, n, nPerGroup: n, conclusion: `2비율: 그룹당 n ≈ ${n}` };
  }
  return { ok: false, message: '지원하지 않는 mode' };
}

/** 표준정규 분위수 근사 (Acklam) */
function invNormApprox(p) {
  if (p <= 0 || p >= 1) return p <= 0 ? -8 : 8;
  const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614736e+01, 2.506628277459239e+00];
  const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  const plow = 0.02425;
  const phigh = 1 - plow;
  let q, r;
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > phigh) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  q = p - 0.5;
  r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}
