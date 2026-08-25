/**
 * 본 프로젝트(project) vs 교육 실습(practice) 워크스페이스 분리
 * — 활성 데이터는 기존 sigma_* 키에 두고, 전환 시 상대 슬롯에 스냅샷을 보관합니다.
 */

export const WORKSPACE_MODE_KEY = 'sigma_workspace_mode';
export const MAIN_SLOT_KEY = 'sigma_slot_main';
export const PRACTICE_SLOT_KEY = 'sigma_slot_practice';

export const WORKSPACE_LIVE_KEYS = [
  'sigma_industry',
  'sigma_diagnostic_completed',
  'sigma_diagnostic_responses',
  'sigma_diagnostic_index',
  'sigma_completed_tools',
  'sigma_project_selected',
  'sigma_opportunity_analyzed',
  'sigma_methodology',
  'sigma_active_step',
  'sigma_project_data',
  'sigma_version_history',
  'sigma_current_project_id'
];

export function getWorkspaceMode() {
  return localStorage.getItem(WORKSPACE_MODE_KEY) === 'practice' ? 'practice' : 'project';
}

export function setWorkspaceMode(mode) {
  localStorage.setItem(WORKSPACE_MODE_KEY, mode === 'practice' ? 'practice' : 'project');
}

export function readLiveWorkspace() {
  const out = {};
  WORKSPACE_LIVE_KEYS.forEach((key) => {
    out[key] = localStorage.getItem(key);
  });
  return out;
}

export function writeLiveWorkspace(snapshot) {
  WORKSPACE_LIVE_KEYS.forEach((key) => {
    const value = snapshot?.[key];
    if (value == null || value === '') localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  });
}

export function saveWorkspaceSlot(slotKey, snapshot = readLiveWorkspace()) {
  localStorage.setItem(slotKey, JSON.stringify(snapshot));
}

export function loadWorkspaceSlot(slotKey) {
  try {
    const raw = localStorage.getItem(slotKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function clearWorkspaceSlot(slotKey) {
  localStorage.removeItem(slotKey);
}

/** React 상태 → localStorage 문자열 스냅샷 */
export function bundleToSnapshot(bundle) {
  return {
    sigma_industry: bundle.industry || null,
    sigma_diagnostic_completed: String(!!bundle.diagnosticCompleted),
    sigma_diagnostic_responses: JSON.stringify(bundle.diagnosticResponses || {}),
    sigma_diagnostic_index: String(bundle.diagnosticIndex ?? 0),
    sigma_completed_tools: JSON.stringify(bundle.completedTools || []),
    sigma_project_selected: String(!!bundle.projectSelected),
    sigma_opportunity_analyzed: String(!!bundle.opportunityAnalyzed),
    sigma_methodology: bundle.methodology || null,
    sigma_active_step: bundle.activeStep || 'selection',
    sigma_project_data: JSON.stringify(bundle.data || {}),
    sigma_version_history: JSON.stringify(bundle.versions || []),
    sigma_current_project_id: bundle.currentProjectId || null
  };
}

/** localStorage 스냅샷 → React에 넣을 객체 */
export function snapshotToBundle(snapshot, emptyDataFactory) {
  const readJson = (key, fallback) => {
    try {
      const raw = snapshot?.[key];
      if (raw == null || raw === '') return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  };

  return {
    industry: snapshot?.sigma_industry || null,
    diagnosticCompleted: snapshot?.sigma_diagnostic_completed === 'true',
    diagnosticResponses: readJson('sigma_diagnostic_responses', {}),
    diagnosticIndex: parseInt(snapshot?.sigma_diagnostic_index || '0', 10) || 0,
    completedTools: readJson('sigma_completed_tools', []),
    projectSelected: snapshot?.sigma_project_selected === 'true',
    opportunityAnalyzed: snapshot?.sigma_opportunity_analyzed === 'true',
    methodology: snapshot?.sigma_methodology || null,
    activeStep: snapshot?.sigma_active_step || 'selection',
    data: readJson('sigma_project_data', emptyDataFactory()),
    versions: readJson('sigma_version_history', []),
    currentProjectId: snapshot?.sigma_current_project_id || null
  };
}

/**
 * 교육 실습용 기본 워크스페이스
 * — 진단/선정 없이 바로 도구 실습 가능하도록 DMAIC를 미리 켭니다.
 */
export function createPracticeBundle(emptyDataFactory, options = {}) {
  const data = emptyDataFactory();
  data.define.projectTitle = options.projectTitle || '[교육실습] 연습 프로젝트';
  data.define.businessCase = '교육 커리큘럼 실습용입니다. 본 프로젝트와 데이터가 분리됩니다.';
  return {
    industry: options.industry || 'manufacturing',
    diagnosticCompleted: true,
    diagnosticResponses: options.diagnosticResponses || { q1_problem_type: ['customer_complaints'] },
    diagnosticIndex: 0,
    completedTools: [],
    projectSelected: true,
    opportunityAnalyzed: true,
    methodology: options.methodology || 'dmaic',
    activeStep: options.activeStep || 'define',
    data,
    versions: [],
    currentProjectId: null
  };
}
