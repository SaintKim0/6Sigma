/**
 * 통계 엔진 벤치마크 검증 케이스
 * expected는 공개 예시/수작업 계산에 맞춘 근사값 (±tol)
 */
import {
  andersonDarlingNormality,
  oneWayAnova,
  tukeyHsd,
  pearsonCorrelation,
  computeCapabilityAdvanced
} from './advancedStats';

export const VALIDATION_CASES = [
  {
    id: 'anova_3group',
    name: 'One-way ANOVA (3그룹)',
    description: '라인A/B/C 평균 비교. F>1, 그룹 간 차이 존재.',
    run: () => {
      const r = oneWayAnova([
        { name: 'A', values: [4.8, 5.0, 4.9, 5.1, 4.7] },
        { name: 'B', values: [5.2, 5.4, 5.3, 5.5, 5.1] },
        { name: 'C', values: [5.0, 5.1, 4.9, 5.0, 5.2] }
      ]);
      const post = tukeyHsd(r);
      return {
        ok: r.ok,
        metrics: [
          { key: 'F', got: r.F, expected: 8.0, tol: 3.0, note: '대략 F≫1' },
          { key: 'significant', got: r.significant ? 1 : 0, expected: 1, tol: 0, note: '유의해야 함' },
          { key: 'postHocPairs', got: post.pairs?.length || 0, expected: 3, tol: 0, note: '쌍 3개' }
        ],
        detail: r.conclusion
      };
    }
  },
  {
    id: 'pearson_perfect',
    name: 'Pearson 완전 상관',
    description: 'Y=2X 직선 → r≈1',
    run: () => {
      const x = [1, 2, 3, 4, 5, 6, 7, 8];
      const y = x.map(v => 2 * v);
      const r = pearsonCorrelation(x, y);
      return {
        ok: r.ok,
        metrics: [
          { key: 'r', got: r.r, expected: 1, tol: 1e-9 },
          { key: 'significant', got: r.significant ? 1 : 0, expected: 1, tol: 0 }
        ],
        detail: r.conclusion
      };
    }
  },
  {
    id: 'pearson_none',
    name: 'Pearson 무상관에 가까움',
    description: '독립에 가까운 패턴 → |r| 작음',
    run: () => {
      const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const y = [5, 1, 8, 2, 9, 3, 7, 4, 6, 0];
      const r = pearsonCorrelation(x, y);
      return {
        ok: r.ok,
        metrics: [
          { key: '|r|', got: Math.abs(r.r), expected: 0.2, tol: 0.35, note: '|r| 작아야 함' }
        ],
        detail: r.conclusion
      };
    }
  },
  {
    id: 'capability_centered',
    name: '공정능력 (중심·여유)',
    description: 'LSL=0, USL=10, 데이터≈5 중심 → Cpk>1',
    run: () => {
      const data = [4.8, 5.0, 5.1, 4.9, 5.2, 5.0, 4.7, 5.1, 4.9, 5.0, 5.3, 4.8];
      const r = computeCapabilityAdvanced(data, 0, 10);
      return {
        ok: r.ok,
        metrics: [
          { key: 'cpk', got: r.cpk, expected: 2.5, tol: 2.0, note: '여유 있는 공정' },
          { key: 'mean', got: r.mean, expected: 5.0, tol: 0.3 }
        ],
        detail: r.note || `Cpk=${r.cpk?.toFixed(3)}`
      };
    }
  },
  {
    id: 'normality_normalish',
    name: '정규성 (정규에 가까운 표본)',
    description: '대략 정규 난수성 데이터 → 기각되지 않을 가능성',
    run: () => {
      // fixed pseudo-normal sample
      const data = [
        9.8, 10.1, 10.0, 9.9, 10.2, 10.3, 9.7, 10.0,
        10.1, 9.9, 10.4, 9.8, 10.0, 10.2, 9.6, 10.1,
        10.0, 9.9, 10.3, 10.1, 9.8, 10.0, 10.2, 9.7
      ];
      const r = andersonDarlingNormality(data);
      return {
        ok: r.ok,
        metrics: [
          { key: 'isNormal', got: r.isNormal ? 1 : 0, expected: 1, tol: 0, note: '정규 가정 OK 기대' },
          { key: 'pValue', got: r.pValue, expected: 0.5, tol: 0.49, note: 'p>0.05 근처' }
        ],
        detail: r.conclusion
      };
    }
  }
];

export function runAllValidations() {
  return VALIDATION_CASES.map(c => {
    let result;
    try {
      result = c.run();
    } catch (err) {
      result = { ok: false, metrics: [], detail: err.message };
    }
    const checks = (result.metrics || []).map(m => {
      const pass = m.got != null && Math.abs(Number(m.got) - Number(m.expected)) <= (m.tol ?? 0);
      return { ...m, pass };
    });
    const allPass = result.ok !== false && checks.every(ch => ch.pass);
    return {
      id: c.id,
      name: c.name,
      description: c.description,
      allPass,
      checks,
      detail: result.detail
    };
  });
}
