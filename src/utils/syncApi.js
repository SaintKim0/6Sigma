/**
 * 클라우드 동기화 인터페이스
 * - VITE_API_URL 미설정: 로컬 전용
 * - VITE_API_URL 설정 시: server/ API와 연동
 */

export const SYNC_STATUS = {
  LOCAL_ONLY: 'local_only',
  READY: 'ready',
  SYNCING: 'syncing',
  ERROR: 'error'
};

const apiBase = () => (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function isCloudEnabled() {
  return Boolean(apiBase());
}

export function getSyncStatus() {
  if (!isCloudEnabled()) {
    return {
      status: SYNC_STATUS.LOCAL_ONLY,
      message: '지금은 이 브라우저에만 저장됩니다. 전체 백업으로 PC 간 옮길 수 있습니다.',
      cloudEnabled: false
    };
  }
  return {
    status: SYNC_STATUS.READY,
    message: `클라우드 API 연결: ${apiBase()}`,
    cloudEnabled: true
  };
}

async function request(path, { method = 'GET', body, userId } = {}) {
  const base = apiBase();
  if (!base) throw new Error('VITE_API_URL이 설정되지 않았습니다.');
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId || 'anonymous'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `요청 실패 (${res.status})`);
  }
  return data;
}

/** 서버로 프로젝트 목록 push(병합) */
export async function pushProjects(projects = [], userId = 'anonymous') {
  if (!isCloudEnabled()) {
    throw new Error('클라우드 동기화는 API URL이 필요합니다. (.env에 VITE_API_URL)');
  }
  const normalized = projects.map(p => ({
    ...p,
    name: p.name || p.title
  }));
  return request('/api/projects/merge', {
    method: 'POST',
    userId,
    body: { projects: normalized }
  });
}

/** 서버에서 프로젝트 목록 pull */
export async function pullProjects(userId = 'anonymous') {
  if (!isCloudEnabled()) {
    throw new Error('클라우드 동기화는 API URL이 필요합니다. (.env에 VITE_API_URL)');
  }
  const data = await request('/api/projects', { userId });
  return data.projects || [];
}

/** 서버 프로젝트 목록 전체 교체 */
export async function replaceProjects(projects = [], userId = 'anonymous') {
  if (!isCloudEnabled()) {
    throw new Error('클라우드 동기화는 API URL이 필요합니다. (.env에 VITE_API_URL)');
  }
  return request('/api/projects', {
    method: 'PUT',
    userId,
    body: { projects }
  });
}

export async function checkHealth() {
  if (!isCloudEnabled()) return { ok: false, localOnly: true };
  return request('/api/health');
}
