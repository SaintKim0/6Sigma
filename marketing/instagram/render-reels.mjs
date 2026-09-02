/**
 * Instagram 릴스 3편 렌더 (15초, 1080×1920)
 * 사용: node marketing/instagram/render-reels.mjs
 */
import { chromium } from 'playwright';
import { mkdir, readdir, rename, unlink } from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { spawn } from 'child_process';
import { existsSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const player = path.join(__dirname, 'reel-player.html');
const outDir = path.join(__dirname, 'export', 'reels');
const tmpDir = path.join(outDir, '_tmp');

const REELS = [
  { id: 'reel-a', file: 'reel-a-app-intro.mp4', title: '앱 소개' },
  { id: 'reel-b', file: 'reel-b-dmaic-dfss.mp4', title: 'DMAIC vs DFSS' },
  { id: 'reel-c', file: 'reel-c-before-after.mp4', title: 'Before After' }
];

function findFfmpeg() {
  const candidates = [
    'ffmpeg',
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Links', 'ffmpeg.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages')
  ];
  return 'ffmpeg';
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exit ${code}`))));
  });
}

async function convertToMp4(webmPath, mp4Path) {
  const ffmpeg = findFfmpeg();
  await run(ffmpeg, [
    '-y',
    '-i', webmPath,
    '-an',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-profile:v', 'high',
    '-level', '4.1',
    '-r', '30',
    '-movflags', '+faststart',
    mp4Path
  ]);
}

async function renderOne(browser, reel) {
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: tmpDir,
      size: { width: 1080, height: 1920 }
    }
  });
  const page = await context.newPage();
  const url = `${pathToFileURL(player).href}?reel=${reel.id}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__reelReady === true, null, { timeout: 15000 });
  await page.waitForTimeout(15500);
  await page.waitForFunction(() => document.body.dataset.done === '1', null, { timeout: 5000 }).catch(() => {});
  const video = page.video();
  await page.close();
  await context.close();
  const webmPath = await video.path();
  const mp4Path = path.join(outDir, reel.file);
  await convertToMp4(webmPath, mp4Path);
  if (existsSync(webmPath)) await unlink(webmPath).catch(() => {});
  console.log(`✓ ${reel.title} → ${mp4Path}`);
  return mp4Path;
}

async function main() {
  await mkdir(tmpDir, { recursive: true });
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const reel of REELS) {
      await renderOne(browser, reel);
    }
  } finally {
    await browser.close();
  }
  console.log(`\nDone. Reels in: ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
