/**
 * 단계별 도구 카테고리 그룹 정의
 */

export const TOOL_GROUP_META = {
  all: { id: 'all', label: '전체' },
  core: { id: 'core', label: '핵심' },
  stats: { id: 'stats', label: '통계 검정' },
  charts: { id: 'charts', label: '차트/시각화' },
  capability: { id: 'capability', label: '공정능력·MSA' },
  cause: { id: 'cause', label: '원인 분석' },
  experiment: { id: 'experiment', label: '실험·개선' },
  sustain: { id: 'sustain', label: '유지·성과' },
  design: { id: 'design', label: '설계' },
  other: { id: 'other', label: '기타' }
};

/** toolId → groupId */
export const TOOL_GROUP_BY_ID = {
  // Define
  project_charter: 'core',
  voc_ctq: 'core',
  team: 'core',
  sipoc: 'core',
  process_map: 'core',
  swimlane_map: 'core',

  // Measure
  dpmo: 'capability',
  msa_grr: 'capability',
  normality: 'stats',
  capability: 'capability',
  sample_size: 'stats',
  control: 'charts',
  histogram: 'charts',
  scatter: 'charts',
  boxplot: 'charts',
  run: 'charts',

  // Analyze
  pareto: 'cause',
  fishbone: 'cause',
  ce_matrix: 'cause',
  hypothesis_log: 'cause',
  fmea: 'cause',
  '5whys': 'cause',
  hypothesis_test: 'stats',
  proportion_test: 'stats',
  levene: 'stats',
  nonparametric: 'stats',
  anova: 'stats',
  chi_square: 'stats',
  correlation: 'stats',
  regression: 'stats',
  multi_regression: 'stats',
  residual_diag: 'stats',
  weibull: 'stats',
  alternatives: 'cause',

  // Improve / Design
  solutions: 'experiment',
  doe: 'experiment',
  doe_effects: 'experiment',
  piloting: 'experiment',
  poka_yoke: 'experiment',
  design_spec: 'design',

  // Control / Verify
  control_plan: 'sustain',
  standard_work: 'sustain',
  monitoring: 'sustain',
  before_after: 'sustain',
  result: 'sustain',
  complete: 'sustain',
  pilot: 'experiment'
};

/** 단계별 탭 순서 */
export const STEP_GROUP_ORDER = {
  define: ['all', 'core'],
  measure: ['all', 'capability', 'stats', 'charts'],
  analyze: ['all', 'cause', 'stats'],
  improve: ['all', 'experiment'],
  design: ['all', 'design'],
  control: ['all', 'sustain'],
  verify: ['all', 'experiment', 'sustain']
};

export function getToolGroupId(toolId) {
  return TOOL_GROUP_BY_ID[toolId] || 'other';
}

export function getGroupsForStep(stepId, tools = []) {
  const order = STEP_GROUP_ORDER[stepId] || ['all'];
  const present = new Set(tools.map(t => getToolGroupId(t.id)));
  return order.filter(gid => gid === 'all' || present.has(gid));
}
