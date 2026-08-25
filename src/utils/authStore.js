/**
 * 로컬 계정 인증 (브라우저 localStorage)
 * 나중에 서버 API로 교체할 수 있도록 인터페이스를 단순하게 유지합니다.
 */

const USERS_KEY = 'sigma_users';
const SESSION_KEY = 'sigma_session';

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export async function hashPassword(password) {
  const enc = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function getSession() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    return s?.userId ? s : null;
  } catch {
    return null;
  }
}

export function setSession(user) {
  const session = {
    userId: user.id,
    email: user.email,
    name: user.name,
    loggedInAt: new Date().toISOString()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function registerUser({ name, email, password }) {
  const trimmedEmail = String(email || '').trim().toLowerCase();
  const trimmedName = String(name || '').trim();
  if (!trimmedName) throw new Error('이름을 입력하세요.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) throw new Error('올바른 이메일을 입력하세요.');
  if (!password || password.length < 4) throw new Error('비밀번호는 4자 이상이어야 합니다.');

  const users = readUsers();
  if (users.some(u => u.email === trimmedEmail)) {
    throw new Error('이미 등록된 이메일입니다.');
  }

  const user = {
    id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: trimmedName,
    email: trimmedEmail,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString()
  };
  users.push(user);
  writeUsers(users);
  return setSession(user);
}

export async function loginUser({ email, password }) {
  const trimmedEmail = String(email || '').trim().toLowerCase();
  const users = readUsers();
  const user = users.find(u => u.email === trimmedEmail);
  if (!user) throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  return setSession(user);
}

export function logoutUser() {
  clearSession();
}
