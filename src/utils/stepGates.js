/**
 * 단계 게이트: 다음 단계로 가기 전 최소 필수 도구
 */

export const STEP_GATE_REQUIRED = {
  define: ['project_charter', 'sipoc'],
  measure: ['histogram'],
  analyze: ['pareto'],
  improve: ['solutions'],
  design: ['design_spec'],
  control: ['control_plan', 'monitoring'],
  verify: ['pilot']
};

export const STEP_GATE_LABELS = {
  project_charter: '프로젝트 헌장',
  sipoc: 'SIPOC',
  voc_ctq: 'VOC & CTQ',
  team: '팀/일정',
  process_map: '프로세스맵',
  swimlane_map: '스윔레인',
  histogram: '히스토그램/공정능력',
  normality: '정규성 검정',
  capability: '공정능력(Pp/Ppk)',
  correlation: '상관분석',
  multi_regression: '다중회귀',
  anova: 'ANOVA',
  chi_square: '카이제곱',
  doe_effects: 'DOE 효과분석',
  proportion_test: '비율검정',
  levene: '등분산',
  nonparametric: '비모수',
  residual_diag: '잔차진단',
  weibull: 'Weibull',
  ce_matrix: 'C&E Matrix',
  hypothesis_log: 'Y=f(X) 검증로그',
  sample_size: '샘플크기',
  before_after: 'Before/After',
  dpmo: 'DPMO',
  msa_grr: 'MSA',
  control: '관리도',
  pareto: '파레토',
  fishbone: '특성요인도',
  fmea: 'FMEA',
  '5whys': '5-Why',
  solutions: '해결안 선정',
  doe: 'DOE',
  design_spec: '설계 스펙',
  control_plan: '관리계획서',
  monitoring: '모니터링',
  pilot: '시제품 검증',
  standard_work: '표준작업',
  result: '최종 성과'
};

export function getMissingGateTools(stepId, completedTools = []) {
  const required = STEP_GATE_REQUIRED[stepId] || [];
  return required.filter(id => !completedTools.includes(id));
}

export function canLeaveStep(stepId, completedTools = []) {
  return getMissingGateTools(stepId, completedTools).length === 0;
}

export function formatMissingTools(missingIds = []) {
  return missingIds.map(id => STEP_GATE_LABELS[id] || id).join(', ');
}
