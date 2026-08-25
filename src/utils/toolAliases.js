/**
 * AI 추천 도구 ID → UI activeTool ID 매핑
 */
export const TOOL_ALIASES = {
  capability_analysis: 'capability',
  spc_control_chart: 'control',
  control_chart: 'control',
  process_capability: 'capability',
  normality_test: 'normality',
  anderson_darling: 'normality',
  anova_analysis: 'anova',
  chisquare: 'chi_square',
  chi2: 'chi_square',
  doe_analysis: 'doe_effects',
  correlation_analysis: 'correlation',
  pearson: 'correlation',
  multiple_regression: 'multi_regression',
  multi_reg: 'multi_regression',
  proportion: 'proportion_test',
  two_proportion: 'proportion_test',
  equal_variance: 'levene',
  levene_test: 'levene',
  mann_whitney: 'nonparametric',
  kruskal: 'nonparametric',
  residual: 'residual_diag',
  weibull_analysis: 'weibull',
  reliability: 'weibull',
  ce_matrix_tool: 'ce_matrix',
  cause_effect: 'ce_matrix',
  yfx: 'hypothesis_log',
  sample_size_calc: 'sample_size',
  before_after_kpi: 'before_after',
  grr: 'msa_grr',
  msa: 'msa_grr',
  why_5: '5whys',
  five_whys: '5whys',
  root_cause_5why: '5whys',
  fishbone_diagram: 'fishbone',
  ishikawa: 'fishbone',
  solution_selection: 'solutions',
  poka_yoke: 'poka_yoke',
  design_specification: 'design_spec',
  final_design: 'design_spec',
  pilot_verification: 'pilot',
  verify_pilot: 'pilot',
  monitoring_plan: 'monitoring',
  final_result: 'result',
  project_completion: 'complete'
};

export function resolveToolId(id) {
  if (!id) return id;
  return TOOL_ALIASES[id] || id;
}
