/**
 * 업종·도구별 샘플 데이터 라이브러리
 */

export const SAMPLE_PACKS = [
  {
    id: 'mfg_dim_capability',
    industry: 'manufacturing',
    industryLabel: '제조',
    toolId: 'capability',
    phase: 'measure',
    title: '사출 치수 — 공정능력',
    description: '케이스 두께(mm), LSL=1.90 USL=2.10',
    mode: 'numbers',
    payload: {
      numbers: [1.98, 2.01, 1.97, 2.02, 1.99, 2.00, 1.96, 2.03, 1.98, 2.01, 1.99, 2.00, 1.97, 2.02, 1.98, 2.01, 1.99, 2.00, 1.97, 2.04],
      lsl: 1.9,
      usl: 2.1,
      text: ''
    }
  },
  {
    id: 'mfg_anova_lines',
    industry: 'manufacturing',
    industryLabel: '제조',
    toolId: 'anova',
    phase: 'analyze',
    title: '3라인 치수 ANOVA',
    description: '라인A/B/C 평균 비교용 그룹 데이터',
    mode: 'groups',
    payload: {
      groups: [
        { name: '라인A', values: [4.8, 5.0, 4.9, 5.1, 4.7, 4.9, 5.0] },
        { name: '라인B', values: [5.2, 5.4, 5.3, 5.5, 5.1, 5.3, 5.4] },
        { name: '라인C', values: [5.0, 5.1, 4.9, 5.0, 5.2, 5.0, 5.1] }
      ]
    }
  },
  {
    id: 'mfg_grr',
    industry: 'manufacturing',
    industryLabel: '제조',
    toolId: 'msa_grr',
    phase: 'measure',
    title: 'Gage R&R 샘플',
    description: '부품5 × 평가자2 × 반복2',
    mode: 'grr',
    payload: {
      csvText: '부품,평가자,측정값\nP1,A,5.1\nP1,A,5.0\nP1,B,5.2\nP1,B,5.1\nP2,A,4.9\nP2,A,4.8\nP2,B,5.0\nP2,B,4.9\nP3,A,5.3\nP3,A,5.2\nP3,B,5.4\nP3,B,5.3\nP4,A,4.7\nP4,A,4.8\nP4,B,4.9\nP4,B,4.8\nP5,A,5.0\nP5,A,5.1\nP5,B,5.1\nP5,B,5.0'
    }
  },
  {
    id: 'mfg_corr_cool',
    industry: 'manufacturing',
    industryLabel: '제조',
    toolId: 'correlation',
    phase: 'analyze',
    title: '냉각시간 vs 불량률 상관',
    description: 'X=냉각(초), Y=불량률(%)',
    mode: 'xy',
    payload: {
      x: [20, 22, 24, 25, 26, 28, 30, 32],
      y: [12.5, 11.0, 10.2, 9.5, 8.8, 7.9, 7.2, 6.5],
      xText: '20, 22, 24, 25, 26, 28, 30, 32',
      yText: '12.5, 11.0, 10.2, 9.5, 8.8, 7.9, 7.2, 6.5'
    }
  },
  {
    id: 'svc_wait_normality',
    industry: 'service_office',
    industryLabel: '서비스',
    toolId: 'normality',
    phase: 'measure',
    title: '창구 대기시간 정규성',
    description: '분 단위 대기시간',
    mode: 'numbers',
    payload: {
      numbers: [4.2, 5.1, 3.8, 6.0, 4.5, 5.3, 4.9, 5.7, 4.1, 5.0, 4.6, 5.4, 4.8, 5.2, 3.9, 6.2, 4.4, 5.1, 4.7, 5.5],
      text: ''
    }
  },
  {
    id: 'it_mttr_weibull',
    industry: 'it_ops',
    industryLabel: 'IT',
    toolId: 'weibull',
    phase: 'analyze',
    title: '장애 MTTR Weibull',
    description: '복구 시간(분)',
    mode: 'numbers',
    payload: {
      numbers: [12, 18, 25, 9, 30, 14, 22, 40, 11, 16, 28, 19, 35, 13, 21],
      text: ''
    }
  },
  {
    id: 'mfg_control_imr',
    industry: 'manufacturing',
    industryLabel: '제조',
    toolId: 'control',
    phase: 'measure',
    title: 'I-MR 관리도 샘플',
    description: '연속 측정 25점 (중간에 이상 1점 포함)',
    mode: 'control_imr',
    payload: {
      type: 'i-mr',
      samples: Array.from({ length: 25 }, (_, i) => ({
        label: `T${i + 1}`,
        value: i === 18 ? 12.5 : 10 + (Math.sin(i / 3) * 0.15) + ((i % 5) - 2) * 0.05
      }))
    }
  },
  {
    id: 'mfg_doe',
    industry: 'manufacturing',
    industryLabel: '제조',
    toolId: 'doe_effects',
    phase: 'improve',
    title: '2³ DOE 주효과 샘플',
    description: '온도·냉각·보압 → 불량률',
    mode: 'doe',
    payload: {
      factorNames: ['온도', '냉각시간', '보압'],
      runsText: [
        '-1,-1,-1,12.5',
        '1,-1,-1,9.2',
        '-1,1,-1,10.1',
        '1,1,-1,7.8',
        '-1,-1,1,11.0',
        '1,-1,1,8.5',
        '-1,1,1,9.0',
        '1,1,1,6.5'
      ].join('\n')
    }
  }
];

export function getSamplesByIndustry(industryId) {
  if (!industryId) return SAMPLE_PACKS;
  return SAMPLE_PACKS.filter(s => s.industry === industryId || s.industry === 'manufacturing');
}

export function getSampleById(id) {
  return SAMPLE_PACKS.find(s => s.id === id) || null;
}

export function searchSamples(q) {
  const s = String(q || '').toLowerCase();
  if (!s) return SAMPLE_PACKS;
  return SAMPLE_PACKS.filter(p =>
    [p.title, p.description, p.toolId, p.industryLabel].join(' ').toLowerCase().includes(s)
  );
}
