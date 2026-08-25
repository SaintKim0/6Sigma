/**
 * 사용자별 프로젝트 임시저장소 (localStorage)
 * 키: sigma_projects_{userId}
 */

const projectsKey = (userId) => `sigma_projects_${userId}`;
const CURRENT_PROJECT_KEY = 'sigma_current_project_id';

export function getCurrentProjectId() {
  return localStorage.getItem(CURRENT_PROJECT_KEY) || null;
}

export function setCurrentProjectId(id) {
  if (id) localStorage.setItem(CURRENT_PROJECT_KEY, id);
  else localStorage.removeItem(CURRENT_PROJECT_KEY);
}

export function listProjects(userId) {
  if (!userId) return [];
  try {
    const list = JSON.parse(localStorage.getItem(projectsKey(userId)) || '[]');
    return Array.isArray(list)
      ? list.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
      : [];
  } catch {
    return [];
  }
}

function writeProjects(userId, list) {
  localStorage.setItem(projectsKey(userId), JSON.stringify(list));
}

export function writeProjectsList(userId, list) {
  writeProjects(userId, Array.isArray(list) ? list : []);
}

/** 원격 프로젝트 목록을 로컬에 병합 (id 우선, 없으면 name) */
export function mergeRemoteProjects(userId, remoteProjects = []) {
  const local = listProjects(userId);
  const byId = new Map(local.map(p => [p.id, p]));
  const byName = new Map(local.filter(p => !byId.has(p.id)).map(p => [p.name || p.title, p]));
  let added = 0;
  let updated = 0;
  remoteProjects.forEach(rp => {
    if (!rp) return;
    if (rp.id && byId.has(rp.id)) {
      const cur = byId.get(rp.id);
      if (String(rp.updatedAt || '') >= String(cur.updatedAt || '')) {
        byId.set(rp.id, { ...cur, ...rp });
        updated += 1;
      }
    } else if ((rp.name || rp.title) && byName.has(rp.name || rp.title)) {
      const key = rp.name || rp.title;
      const cur = byName.get(key);
      byName.set(key, { ...cur, ...rp, id: cur.id });
      updated += 1;
    } else {
      const id = rp.id || `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      byId.set(id, { ...rp, id, name: rp.name || rp.title });
      added += 1;
    }
  });
  const merged = [...byId.values()];
  // byName entries that weren't in byId
  byName.forEach((p) => {
    if (!merged.find(m => m.id === p.id)) merged.push(p);
  });
  writeProjects(userId, merged);
  return { count: merged.length, added, updated };
}

/**
 * @param {string} userId
 * @param {object} payload - export와 동일한 스냅샷 + title/status
 * @param {string|null} projectId - 있으면 업데이트
 */
export function saveUserProject(userId, payload, projectId = null) {
  if (!userId) throw new Error('로그인이 필요합니다.');
  const list = listProjects(userId);
  const now = new Date().toISOString();
  const title = payload.title
    || payload.data?.define?.projectTitle
    || '제목 없는 프로젝트';
  const status = payload.status || 'in_progress';

  if (projectId) {
    const idx = list.findIndex(p => p.id === projectId);
    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        title,
        status,
        methodology: payload.methodology || list[idx].methodology,
        industry: payload.industry || list[idx].industry,
        activeStep: payload.activeStep || list[idx].activeStep,
        updatedAt: now,
        snapshot: payload
      };
      writeProjects(userId, list);
      setCurrentProjectId(projectId);
      return list[idx];
    }
  }

  const project = {
    id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title,
    status,
    methodology: payload.methodology || null,
    industry: payload.industry || null,
    activeStep: payload.activeStep || 'define',
    createdAt: now,
    updatedAt: now,
    snapshot: payload
  };
  list.unshift(project);
  writeProjects(userId, list);
  setCurrentProjectId(project.id);
  return project;
}

export function getUserProject(userId, projectId) {
  return listProjects(userId).find(p => p.id === projectId) || null;
}

export function deleteUserProject(userId, projectId) {
  const next = listProjects(userId).filter(p => p.id !== projectId);
  writeProjects(userId, next);
  if (getCurrentProjectId() === projectId) setCurrentProjectId(null);
  return next;
}

export function renameUserProject(userId, projectId, title) {
  const list = listProjects(userId);
  const idx = list.findIndex(p => p.id === projectId);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], title, updatedAt: new Date().toISOString() };
  if (list[idx].snapshot) {
    list[idx].snapshot = { ...list[idx].snapshot, title };
  }
  writeProjects(userId, list);
  return list[idx];
}

/** 현재 워크스페이스 localStorage에 스냅샷 적용 (reload 전 호출) */
export function applySnapshotToWorkspace(snapshot) {
  const projectData = snapshot.data || snapshot.projectData;
  if (!projectData?.define) throw new Error('유효한 프로젝트 스냅샷이 아닙니다.');

  localStorage.setItem('sigma_project_data', JSON.stringify(projectData));
  if (snapshot.methodology) localStorage.setItem('sigma_methodology', snapshot.methodology);
  else localStorage.removeItem('sigma_methodology');
  if (snapshot.industry) localStorage.setItem('sigma_industry', snapshot.industry);
  else localStorage.removeItem('sigma_industry');
  localStorage.setItem('sigma_active_step', snapshot.activeStep || 'define');
  localStorage.setItem('sigma_diagnostic_completed', String(snapshot.diagnosticCompleted ?? true));
  localStorage.setItem('sigma_diagnostic_responses', JSON.stringify(snapshot.diagnosticResponses || {}));
  localStorage.setItem('sigma_diagnostic_index', String(snapshot.diagnosticIndex ?? 0));
  localStorage.setItem('sigma_completed_tools', JSON.stringify(snapshot.completedTools || []));
  localStorage.setItem('sigma_project_selected', String(snapshot.projectSelected ?? true));
  localStorage.setItem('sigma_opportunity_analyzed', String(snapshot.opportunityAnalyzed ?? true));
  if (snapshot.versions) {
    localStorage.setItem('sigma_version_history', JSON.stringify(snapshot.versions));
  }
}

/**
 * 전체 프로젝트 백업 묶음 (브라우저 교체·캐시 삭제 대비)
 */
export function buildUserBackup(userId, sessionMeta = {}) {
  if (!userId) throw new Error('로그인이 필요합니다.');
  return {
    format: 'sigma-user-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    user: {
      userId,
      email: sessionMeta.email || null,
      name: sessionMeta.name || null
    },
    projects: listProjects(userId)
  };
}

export function downloadUserBackup(userId, sessionMeta = {}) {
  const backup = buildUserBackup(userId, sessionMeta);
  const date = new Date().toISOString().slice(0, 10);
  const safeName = (sessionMeta.name || sessionMeta.email || 'user').replace(/[^\w가-힣.-]+/g, '_');
  const blob = new Blob([JSON.stringify(backup)], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `6시그마_백업_${safeName}_${date}.sigma-backup`;
  link.click();
  URL.revokeObjectURL(url);
  return backup;
}

/** @param {'merge'|'replace'} mode */
export function restoreUserBackup(userId, backup, mode = 'merge') {
  if (!userId) throw new Error('로그인이 필요합니다.');
  if (!backup || backup.format !== 'sigma-user-backup') {
    throw new Error('올바른 6시그마 백업 파일이 아닙니다.');
  }
  const incoming = Array.isArray(backup.projects) ? backup.projects : [];
  if (!incoming.length) throw new Error('백업에 프로젝트가 없습니다.');

  if (mode === 'replace') {
    writeProjects(userId, incoming);
    return { count: incoming.length, mode };
  }

  const existing = listProjects(userId);
  const byId = new Map(existing.map(p => [p.id, p]));
  let added = 0;
  let updated = 0;
  incoming.forEach(p => {
    if (!p?.id) {
      const id = `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      byId.set(id, { ...p, id, updatedAt: p.updatedAt || new Date().toISOString() });
      added += 1;
      return;
    }
    if (byId.has(p.id)) {
      const prev = byId.get(p.id);
      const newer = String(p.updatedAt || '') >= String(prev.updatedAt || '');
      if (newer) {
        byId.set(p.id, p);
        updated += 1;
      }
    } else {
      byId.set(p.id, p);
      added += 1;
    }
  });
  const merged = Array.from(byId.values());
  writeProjects(userId, merged);
  return { count: merged.length, added, updated, mode };
}

export function readBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result || '{}')));
      } catch {
        reject(new Error('백업 파일을 읽을 수 없습니다.'));
      }
    };
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsText(file, 'UTF-8');
  });
}
