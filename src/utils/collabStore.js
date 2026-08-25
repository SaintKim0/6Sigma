/**
 * 협업·공유·코멘트 (로컬 우선, 선택적 서버 동기와 병행 가능)
 */

const commentsKey = (projectId) => `sigma_comments_${projectId}`;
const sharesKey = (userId) => `sigma_shares_${userId}`;

export function listComments(projectId) {
  if (!projectId) return [];
  try {
    const list = JSON.parse(localStorage.getItem(commentsKey(projectId)) || '[]');
    return Array.isArray(list) ? list.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt))) : [];
  } catch {
    return [];
  }
}

export function addComment(projectId, { author, text, phase }) {
  if (!projectId) throw new Error('프로젝트를 먼저 저장하세요.');
  const list = listComments(projectId);
  const row = {
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    author: author || '익명',
    text: String(text || '').trim(),
    phase: phase || '',
    createdAt: new Date().toISOString()
  };
  if (!row.text) throw new Error('코멘트 내용을 입력하세요.');
  list.push(row);
  localStorage.setItem(commentsKey(projectId), JSON.stringify(list));
  return row;
}

export function deleteComment(projectId, commentId) {
  const next = listComments(projectId).filter(c => c.id !== commentId);
  localStorage.setItem(commentsKey(projectId), JSON.stringify(next));
  return next;
}

/** 공유 코드 발급 (스냅샷을 로컬 공유 저장소에 보관) */
export function createShareLink(userId, snapshot) {
  if (!userId) throw new Error('로그인이 필요합니다.');
  if (!snapshot) throw new Error('공유할 프로젝트가 없습니다.');
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  const shares = listShares(userId);
  const entry = {
    code,
    title: snapshot.title || snapshot.define?.projectTitle || '공유 프로젝트',
    createdAt: new Date().toISOString(),
    ownerId: userId,
    snapshot
  };
  shares.unshift(entry);
  localStorage.setItem(sharesKey(userId), JSON.stringify(shares.slice(0, 30)));
  // global lookup table for redeem
  const global = JSON.parse(localStorage.getItem('sigma_share_index') || '{}');
  global[code] = entry;
  localStorage.setItem('sigma_share_index', JSON.stringify(global));
  return entry;
}

export function listShares(userId) {
  if (!userId) return [];
  try {
    return JSON.parse(localStorage.getItem(sharesKey(userId)) || '[]');
  } catch {
    return [];
  }
}

export function redeemShareCode(code) {
  const global = JSON.parse(localStorage.getItem('sigma_share_index') || '{}');
  const entry = global[String(code || '').trim().toUpperCase()];
  if (!entry) throw new Error('유효하지 않은 공유 코드입니다.');
  return entry;
}

/** 역할: owner | editor | viewer (로컬 메타) */
export function getProjectRole(projectId, userId) {
  if (!projectId || !userId) return 'viewer';
  try {
    const map = JSON.parse(localStorage.getItem(`sigma_roles_${projectId}`) || '{}');
    return map[userId] || 'owner';
  } catch {
    return 'owner';
  }
}

export function setProjectRole(projectId, userId, role) {
  const map = JSON.parse(localStorage.getItem(`sigma_roles_${projectId}`) || '{}');
  map[userId] = role;
  localStorage.setItem(`sigma_roles_${projectId}`, JSON.stringify(map));
}
