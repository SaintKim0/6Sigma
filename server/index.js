/**
 * 간단한 프로젝트 동기화 API (파일 기반)
 * 프론트: VITE_API_URL=http://localhost:8787
 *
 * 실행: npm run server
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8787);
const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'projects.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(STORE_FILE)) {
  fs.writeFileSync(STORE_FILE, JSON.stringify({ users: {} }, null, 2));
}

const readStore = () => JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
const writeStore = (data) => fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));

const send = (res, status, body) => {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id'
  });
  res.end(json);
};

const readBody = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    try {
      const raw = Buffer.concat(chunks).toString('utf8');
      resolve(raw ? JSON.parse(raw) : {});
    } catch (e) {
      reject(e);
    }
  });
  req.on('error', reject);
});

const getUserId = (req) => req.headers['x-user-id'] || 'anonymous';

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return send(res, 204, {});
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const userId = getUserId(req);

  try {
    if (req.method === 'GET' && url.pathname === '/api/health') {
      return send(res, 200, { ok: true, service: '6sigma-sync', time: new Date().toISOString() });
    }

    if (req.method === 'GET' && url.pathname === '/api/projects') {
      const store = readStore();
      const list = store.users[userId]?.projects || [];
      return send(res, 200, { ok: true, projects: list });
    }

    if (req.method === 'PUT' && url.pathname === '/api/projects') {
      const body = await readBody(req);
      const projects = Array.isArray(body.projects) ? body.projects : [];
      const store = readStore();
      store.users[userId] = {
        updatedAt: new Date().toISOString(),
        projects
      };
      writeStore(store);
      return send(res, 200, { ok: true, count: projects.length, updatedAt: store.users[userId].updatedAt });
    }

    if (req.method === 'POST' && url.pathname === '/api/projects/merge') {
      // push: 로컬 프로젝트를 서버에 병합(이름 기준 upsert)
      const body = await readBody(req);
      const incoming = Array.isArray(body.projects) ? body.projects : [];
      const store = readStore();
      const current = store.users[userId]?.projects || [];
      const byName = new Map(current.map(p => [p.name, p]));
      incoming.forEach(p => {
        if (!p?.name) return;
        byName.set(p.name, { ...byName.get(p.name), ...p, updatedAt: new Date().toISOString() });
      });
      const merged = [...byName.values()];
      store.users[userId] = { updatedAt: new Date().toISOString(), projects: merged };
      writeStore(store);
      return send(res, 200, { ok: true, count: merged.length, projects: merged });
    }

    return send(res, 404, { ok: false, error: 'Not found' });
  } catch (err) {
    return send(res, 500, { ok: false, error: err.message || 'Server error' });
  }
});

server.listen(PORT, () => {
  console.log(`[6sigma-sync] http://localhost:${PORT}`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /api/projects   (header X-User-Id)`);
  console.log(`  PUT  /api/projects`);
  console.log(`  POST /api/projects/merge`);
});
