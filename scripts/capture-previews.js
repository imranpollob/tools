import { chromium } from '@playwright/test';
import { readFile, writeFile, access } from 'node:fs/promises';
const tools = JSON.parse(await readFile('src/tools.json', 'utf8'));
const browser = await chromium.launch();
for (const tool of tools) {
  try { await access(`public/previews/${tool.image}`); continue; } catch {}
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  if (tool.type === 'online' && tool.action === 'Use online') {
    try {
      await page.goto(tool.url, { waitUntil: 'networkidle', timeout: 25000 });
      await page.screenshot({ path: `public/previews/${tool.image}` });
      console.log('Captured', tool.repo);
      await page.close();
      continue;
    } catch (error) { console.log('Could not capture', tool.repo, error.message.split('\n')[0]); }
  }
  const commands = {
    'slugcopy': ['$ slugcopy "Hello, beautiful world!"', 'hello-beautiful-world', '✓ Copied to clipboard'],
    'note-cli': ['$ note', '1. Ship something useful', '2. Make time to create', '3. Keep things simple'],
    'github-star-calculator': ['$ gitstar <username>', 'Count stars across repositories.', 'Discover the most popular projects.'],

  };
  const lines = commands[tool.repo] || [tool.subtitle];
  await page.setContent(`<html><body style="margin:0;background:#182233;color:#c3cede;font-family:monospace;padding:64px;font-size:30px;box-sizing:border-box"><div style="color:#748094;font-size:24px;letter-spacing:12px">● ● ●</div><div style="margin:75px 0 55px;font-family:Arial;font-size:48px;font-weight:bold;color:white">${tool.title}</div>${lines.map((line, i) => `<div style="margin:22px 0;color:${i === 0 ? '#9eb3ff' : '#c3cede'}">${line.replaceAll('<','&lt;')}</div>`).join('')}<div style="color:#647187;position:absolute;bottom:45px;font-size:19px">ILLUSTRATIVE PREVIEW · ${tool.repo}</div></body></html>`);
  await page.screenshot({ path: `public/previews/${tool.image}` });
  console.log('Illustrated', tool.repo);
  await page.close();
}
await browser.close();
