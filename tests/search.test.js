import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { filterTools } from '../src/search.js';
import { categories } from '../src/categories.js';
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
test('filterTools respects manual priority ordering', () => {
  const sample = [
    { title: 'Alpha', repo: 'a', priority: 3, type: 'online' },
    { title: 'Beta', repo: 'b', priority: 1, type: 'online' },
    { title: 'Gamma', repo: 'c', priority: 2, type: 'online' },
    { title: 'Delta', repo: 'd', type: 'online' }
  ];
  const sorted = filterTools(sample, '');
  assert.deepEqual(sorted.map(t => t.title), ['Beta', 'Gamma', 'Alpha', 'Delta']);
});
test('tools are grouped into the four ordered categories, each tool exactly once', () => {
  const expected = {
    'Featured Tools': ['bangla-quran', 'crypto-chart-viewer', 'text-diff-checker', 'markdown-previewer', 'snippet-notes', 'pdf-text-to-speech-reader'],
    'Useful Utilities': ['word-character-counter', 'pomodoro-timer', 'slugcopy'],
    'Learning & Specialized': ['bibtex-to-bibitem', 'github-profile-analyzer', 'mental-math-trainer', 'online-spelling-quiz', 'online-trivia-quiz'],
    'More Tools': ['color-shade-generator', 'lorem-ipsum-generator', 'black-screen-online', 'note-cli', 'github-star-calculator'],
  };
  assert.deepEqual(categories, Object.keys(expected));
  assert.equal(tools.length, 19);
  const sorted = filterTools(tools, '');
  for (const [category, repos] of Object.entries(expected)) {
    assert.deepEqual(sorted.filter(t => t.category === category).map(t => t.repo), repos, category);
  }
  assert.equal(sorted.every(t => categories.includes(t.category)), true);
});
test('category and availability filters combine with search', () => {
  assert.deepEqual(filterTools(tools, 'featured').map(t => t.category), Array(6).fill('Featured Tools'));
  assert.deepEqual(filterTools(tools, '', 'install').map(t => t.repo), ['pomodoro-timer', 'slugcopy', 'note-cli', 'github-star-calculator']);
});
