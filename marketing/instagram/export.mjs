/**
 * Instagram 슬라이드를 PNG로보내기
 * 사용: node marketing/instagram/export.mjs
 */
import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'export-full.html');
const outDir = path.join(__dirname, 'export');

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const nodes = await page.$$('[data-export]');
  for (const node of nodes) {
    const name = await node.getAttribute('data-export');
    const file = path.join(outDir, `${name}.png`);
    await node.screenshot({ path: file, type: 'png' });
    console.log('saved', file);
  }
  await browser.close();
  console.log(`Done: ${nodes.length} files → ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
