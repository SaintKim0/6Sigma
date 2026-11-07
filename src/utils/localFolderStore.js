/**
 * PC 지정 폴더 저장 (File System Access API)
 * — 프로젝트마다 이름.sigma 파일 하나.
 * — 서버로 보내지 않습니다. Chrome / Edge 지원.
 */

const DB_NAME = 'sigma_local_folder';
const STORE = 'handles';
const RECORD_KEY = 'vault';
export const SIGMA_EXT = '.sigma';

export function canUseFolderPicker() {
  return typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function';
}

export function canUseOpenPicker() {
  return typeof window !== 'undefined' && typeof window.showOpenFilePicker === 'function';
}

export function suggestFileStem(title) {
  const stem = String(title || '프로젝트')
    .replace(/\.sigma$/i, '')
    .replace(/[\\/:*?"<>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 32);
  return stem || '프로젝트';
}

export function toSigmaFileName(stem) {
  return `${suggestFileStem(stem)}${SIGMA_EXT}`;
}

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('IndexedDB를 열 수 없습니다.'));
  });
}

function idbGet() {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(RECORD_KEY);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  }));
}

function idbSet(value) {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).put(value, RECORD_KEY);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  }));
}

function idbClear() {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).delete(RECORD_KEY);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  }));
}

async function queryPermission(handle, mode = 'readwrite') {
  if (!handle?.queryPermission) return 'granted';
  return handle.queryPermission({ mode });
}

export async function requestFolderPermission(handle, mode = 'readwrite') {
  if (!handle) return false;
  const current = await queryPermission(handle, mode);
  if (current === 'granted') return true;
  if (!handle.requestPermission) return false;
  return (await handle.requestPermission({ mode })) === 'granted';
}

export async function getStoredFolder() {
  const record = await idbGet();
  if (!record?.handle) return null;
  return {
    handle: record.handle,
    name: record.name || record.handle.name || '지정 폴더',
    lastSyncedAt: record.lastSyncedAt || null
  };
}

export async function getFolderStatus() {
  if (!canUseFolderPicker()) {
    return {
      supported: false,
      connected: false,
      granted: false,
      name: null,
      lastSyncedAt: null,
      message: '이 브라우저는 폴더 지정을 지원하지 않습니다. .sigma 파일을 받아 두었다가 「파일 열기」로 이어서 하세요.'
    };
  }
  const stored = await getStoredFolder();
  if (!stored) {
    return {
      supported: true,
      connected: false,
      granted: false,
      name: null,
      lastSyncedAt: null,
      message: '아직 폴더를 지정하지 않았습니다. 지정하면 프로젝트마다 이름.sigma 파일로 저장합니다.'
    };
  }
  const granted = (await queryPermission(stored.handle)) === 'granted';
  return {
    supported: true,
    connected: true,
    granted,
    name: stored.name,
    lastSyncedAt: stored.lastSyncedAt,
    handle: stored.handle,
    message: granted
      ? `지정 폴더: ${stored.name}`
      : `지정 폴더: ${stored.name} (다시 허용이 필요합니다)`
  };
}

export async function pickLocalFolder() {
  if (!canUseFolderPicker()) {
    throw new Error('이 브라우저는 PC 폴더 지정을 지원하지 않습니다. Chrome, Edge, Opera를 쓰거나, .sigma 파일을 받아 두세요.');
  }
  const handle = await window.showDirectoryPicker({
    id: 'sigmalab-vault',
    mode: 'readwrite',
    startIn: 'documents'
  });
  await idbSet({
    handle,
    name: handle.name,
    lastSyncedAt: null
  });
  return { handle, name: handle.name };
}

export async function clearStoredFolder() {
  await idbClear();
}

async function rememberSyncTime(handle, name) {
  await idbSet({
    handle,
    name: name || handle.name,
    lastSyncedAt: new Date().toISOString()
  });
}

async function writeJsonFile(dirHandle, fileName, payload) {
  const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(`${JSON.stringify(payload, null, 2)}\n`);
  await writable.close();
}

async function readJsonFile(dirHandle, fileName) {
  const fileHandle = await dirHandle.getFileHandle(fileName);
  const file = await fileHandle.getFile();
  return JSON.parse(await file.text());
}

function buildProjectFile(project) {
  return {
    format: 'sigma-project',
    version: 1,
    savedAt: new Date().toISOString(),
    project: {
      id: project.id,
      title: project.title,
      status: project.status || 'in_progress',
      methodology: project.methodology || null,
      industry: project.industry || null,
      activeStep: project.activeStep || 'define',
      createdAt: project.createdAt,
      updatedAt: project.updatedAt || new Date().toISOString(),
      folderFileName: project.folderFileName || null,
      snapshot: project.snapshot
    }
  };
}

export function parseProjectFile(data, fileName = '') {
  if (!data || typeof data !== 'object') {
    throw new Error('올바른 프로젝트 파일이 아닙니다.');
  }
  if (data.format === 'sigma-project' && data.project?.snapshot) {
    return { type: 'one', project: data.project, fileName };
  }
  if (data.format === 'sigma-user-backup' && Array.isArray(data.projects)) {
    return { type: 'many', backup: data, fileName };
  }
  if (data.snapshot?.data?.define) {
    return { type: 'one', project: data, fileName };
  }
  if (data.data?.define) {
    return {
      type: 'one',
      fileName,
      project: {
        id: data.id || `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title: data.title || data.data.define.projectTitle || '가져온 프로젝트',
        status: data.status || 'in_progress',
        methodology: data.methodology || null,
        industry: data.industry || null,
        activeStep: data.activeStep || 'define',
        createdAt: data.savedAt || new Date().toISOString(),
        updatedAt: data.savedAt || new Date().toISOString(),
        snapshot: data
      }
    };
  }
  throw new Error('6시그마 프로젝트 파일(.sigma)이 아닙니다.');
}

async function listExistingNames(dirHandle) {
  const names = new Set();
  if (!dirHandle.values) return names;
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') names.add(entry.name);
  }
  return names;
}

async function fileProjectId(dirHandle, fileName) {
  try {
    const data = await readJsonFile(dirHandle, fileName);
    return data?.project?.id || data?.id || null;
  } catch {
    return null;
  }
}

async function uniqueFileName(dirHandle, fileName, projectId) {
  const names = await listExistingNames(dirHandle);
  if (!names.has(fileName)) return fileName;
  const existingId = await fileProjectId(dirHandle, fileName);
  if (existingId && existingId === projectId) return fileName;
  const stem = fileName.replace(/\.sigma$/i, '');
  let i = 2;
  while (names.has(`${stem}-${i}${SIGMA_EXT}`)) i += 1;
  return `${stem}-${i}${SIGMA_EXT}`;
}

export async function saveProjectToFolder(project, fileName) {
  if (!project?.snapshot) throw new Error('저장할 프로젝트 내용이 없습니다.');
  const stored = await getStoredFolder();
  if (!stored) throw new Error('먼저 PC 폴더를 지정하세요.');
  const ok = await requestFolderPermission(stored.handle);
  if (!ok) throw new Error('폴더 쓰기 권한이 없습니다. 폴더를 다시 지정해 주세요.');
  const wanted = toSigmaFileName(fileName || project.folderFileName || project.title);
  const finalName = await uniqueFileName(stored.handle, wanted, project.id);
  await writeJsonFile(stored.handle, finalName, buildProjectFile({ ...project, folderFileName: finalName }));
  await rememberSyncTime(stored.handle, stored.name);
  return { folderName: stored.name, fileName: finalName };
}

/** 이미 파일 이름이 있고 권한이 있으면 그 파일을 덮어씁니다. */
export async function syncProjectToFolder(project) {
  if (!project?.id || !project?.snapshot || !project.folderFileName) return { skipped: true };
  if (!canUseFolderPicker()) return { skipped: true };
  const stored = await getStoredFolder();
  if (!stored) return { skipped: true };
  if ((await queryPermission(stored.handle)) !== 'granted') return { skipped: true };
  await writeJsonFile(
    stored.handle,
    toSigmaFileName(project.folderFileName),
    buildProjectFile(project)
  );
  await rememberSyncTime(stored.handle, stored.name);
  return { skipped: false, fileName: toSigmaFileName(project.folderFileName) };
}

export async function pickAndReadProjectFile() {
  if (!canUseOpenPicker()) {
    throw new Error('FILE_INPUT');
  }
  const [handle] = await window.showOpenFilePicker({
    multiple: false,
    types: [
      {
        description: '6시그마 프로젝트',
        accept: { 'application/json': ['.sigma', '.sigma-backup', '.json'] }
      }
    ]
  });
  const file = await handle.getFile();
  const data = JSON.parse(await file.text());
  return parseProjectFile(data, file.name);
}

export async function readProjectTextFile(file) {
  const text = await file.text();
  return parseProjectFile(JSON.parse(text), file.name);
}
