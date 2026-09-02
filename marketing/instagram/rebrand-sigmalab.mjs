import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const mark = (id, size = 48) => `
<svg class="mark" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#${id})"/>
  <path d="M30.2 14.8c2.2 0 3.9 1.1 4.8 2.8.3.5-.1 1.1-.7 1.1h-1.7c-.35 0-.65-.15-.85-.45-.55-.85-1.35-1.3-2.35-1.3-1.85 0-3 1.35-3 3.25 0 1.45.85 2.45 2.55 3.35l2.05 1.05c2.5 1.3 3.95 2.95 3.95 5.55 0 3.55-2.7 5.95-6.55 5.95-2.7 0-4.8-1.25-5.85-3.25-.3-.55.05-1.15.7-1.15h1.8c.35 0 .65.2.85.5.7 1.1 1.8 1.7 3.15 1.7 2.1 0 3.4-1.35 3.4-3.25 0-1.5-.85-2.55-2.65-3.5l-2.15-1.1c-2.5-1.3-3.85-2.95-3.85-5.55 0-3.4 2.5-5.7 6.25-5.7Z" fill="#fff"/>
  <defs>
    <linearGradient id="${id}" x1="6" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FB7185"/><stop offset="1" stop-color="#FB923C"/>
    </linearGradient>
  </defs>
</svg>`.trim();

const brandRow = (gid) => `${mark(gid, 48)}<div class="brand-name">SigmaLab</div><span class="brand-ko">시그마랩</span>`;

function patchExportFull() {
  let html = readFileSync(path.join(__dirname, 'export-full.html'), 'utf8');
  html = html.replace(
    /\.bolt \{[\s\S]*?\}/,
    `.mark { width: 48px; height: 48px; flex-shrink: 0; display: block; }
    .brand { flex-wrap: wrap; align-items: center; }
    .brand-ko { font-size: 22px; font-weight: 700; color: #BE123C; background: rgba(255,255,255,.85); border: 1px solid rgba(251,113,133,.35); border-radius: 999px; padding: 6px 14px; }`
  );
  let n = 0;
  html = html.replace(/<div class="brand"><div class="bolt"><\/div><div class="brand-name">6-SIGMA MASTER<\/div><\/div>/g, () => {
    n += 1;
    return `<div class="brand">${brandRow(`sl${n}`)}</div>`;
  });
  html = html.replace(
    /<div class="brand" style="margin-bottom:48px"><div class="bolt"><\/div><div class="brand-name">6-SIGMA MASTER<\/div><\/div>/g,
    () => {
      n += 1;
      return `<div class="brand" style="margin-bottom:48px">${brandRow(`sl${n}`)}</div>`;
    }
  );
  html = html.replace(
    /<div class="bolt" style="width:64px;height:64px;margin-bottom:32px"><\/div>/g,
    () => {
      n += 1;
      return `<div style="margin-bottom:32px">${mark(`sl${n}`, 72)}</div>`;
    }
  );
  html = html.replace(/6-SIGMA MASTER/g, 'SigmaLab');
  writeFileSync(path.join(__dirname, 'export-full.html'), html, 'utf8');
  console.log('export-full.html OK');
}

function patchReelPlayer() {
  let html = readFileSync(path.join(__dirname, 'reel-player.html'), 'utf8');
  html = html.replace(
    /\.bolt \{[\s\S]*?\}/,
    `.mark { width: 64px; height: 64px; flex-shrink: 0; display: block; }`
  );
  let n = 0;
  html = html.replace(/<div class="bolt"><\/div>/g, () => {
    n += 1;
    return mark(`rp${n}`, 64);
  });
  html = html.replace(/<div class="brand">6-SIGMA MASTER<\/div>/g, '<div class="brand">SigmaLab · 시그마랩</div>');
  html = html.replace(/6-SIGMA MASTER/g, 'SigmaLab');
  // CTA text that said 6시그마 마스터로
  html = html.replace(/6시그마 마스터로/g, '시그마랩으로');
  writeFileSync(path.join(__dirname, 'reel-player.html'), html, 'utf8');
  console.log('reel-player.html OK');
}

function patchCaptions() {
  let md = readFileSync(path.join(__dirname, 'CAPTIONS.md'), 'utf8');
  md = md.replace(/6-SIGMA MASTER/g, 'SigmaLab');
  md = md.replace(/6시그마 마스터/g, '시그마랩');
  writeFileSync(path.join(__dirname, 'CAPTIONS.md'), md, 'utf8');
  console.log('CAPTIONS.md OK');
}

function patchIndex() {
  let html = readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  html = html.replace(/6-SIGMA MASTER/g, 'SigmaLab');
  html = html.replace(
    /\.bolt \{[\s\S]*?\}/,
    `.mark { width: 28px; height: 28px; flex-shrink: 0; display: block; }`
  );
  let n = 0;
  html = html.replace(/<div class="bolt"><\/div>/g, () => {
    n += 1;
    return mark(`ix${n}`, 36);
  });
  html = html.replace(
    /<div class="bolt" style="width:64px;height:64px;margin-bottom:32px"><\/div>/g,
    () => {
      n += 1;
      return `<div style="margin-bottom:32px">${mark(`ix${n}`, 64)}</div>`;
    }
  );
  writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
  console.log('index.html OK');
}

function patchReadme() {
  const p = path.join(__dirname, 'README.md');
  let md = readFileSync(p, 'utf8');
  md = md.replace(/6-SIGMA MASTER/g, 'SigmaLab');
  writeFileSync(p, md, 'utf8');
  console.log('README.md OK');
}

patchExportFull();
patchReelPlayer();
patchCaptions();
patchIndex();
patchReadme();
