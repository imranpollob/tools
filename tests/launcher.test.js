import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { launcherOrder } from '../src/launcher.js';
import { filterTools } from '../src/search.js';

const tools = JSON.parse(readFileSync(new URL('../src/tools.json', import.meta.url)));

test('launcherOrder follows homepage order: online first, then install, each by priority', () => {
  const sample = [
    { title: 'Install B', type: 'install', priority: 2 },
    { title: 'Web B', type: 'online', priority: 2 },
    { title: 'Install A', type: 'install', priority: 1 },
    { title: 'Web A', type: 'online', priority: 1 },
    { title: 'Web Last', type: 'online' },
  ];
  assert.deepEqual(
    launcherOrder(sample).map(t => t.title),
    ['Web A', 'Web B', 'Web Last', 'Install A', 'Install B'],
  );
});

test('launcherOrder covers the whole catalog in homepage section order', () => {
  const order = launcherOrder(tools);
  assert.equal(order.length, tools.length);
  assert.deepEqual(
    order.map(t => t.repo),
    [...filterTools(tools, '', 'online'), ...filterTools(tools, '', 'install')].map(t => t.repo),
  );
  const firstInstall = order.findIndex(t => t.type === 'install');
  assert.ok(order.slice(0, firstInstall).every(t => t.type === 'online'));
  assert.ok(order.slice(firstInstall).every(t => t.type === 'install'));
});
