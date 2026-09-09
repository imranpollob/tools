import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { filterTools } from '../src/search.js';
const tools = JSON.parse(readFileSync(new URL('../src/tools.json', import.meta.url)));
test('search handles case, whitespace, multiple terms, and descriptions', () => {
  assert.equal(filterTools(tools, '  COLOR  shades  ')[0].repo, 'color-shade-generator');
  assert.equal(filterTools(tools, 'clipboard')[0].repo, 'slugcopy');
  assert.equal(filterTools(tools, 'PDF speech')[0].repo, 'pdf-text-to-speech-reader');
  assert.equal(filterTools(tools, 'zzzz-no-match').length, 0);
  assert.equal(filterTools(tools, '    ').length, tools.length);
});
test('availability combines with search', () => {
  assert.equal(filterTools(tools, 'pomodoro', 'online').length, 0);
  assert.equal(filterTools(tools, 'pomodoro', 'install').length, 1);
  assert.equal(filterTools(tools, '', 'online').length + filterTools(tools, '', 'install').length, tools.length);
});
test('catalog has unique repositories, local previews, and safe links', () => {
  assert.equal(new Set(tools.map(tool => tool.repo)).size, tools.length);
  for (const tool of tools) {
    assert.ok(tool.title && tool.subtitle);
    assert.ok(['online', 'install'].includes(tool.type));
    assert.equal(new URL(tool.url).protocol, 'https:');
    assert.ok(existsSync(new URL(`../public/previews/${tool.image}`, import.meta.url)), tool.image);
  }
});
