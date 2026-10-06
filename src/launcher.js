import { filterTools } from './search.js';

// Homepage order: the Web Tools section first, then Installables,
// each following its manual priority.
export function launcherOrder(tools) {
  return [...filterTools(tools, '', 'online'), ...filterTools(tools, '', 'install')];
}

// Starred tools (by repo) float to the front, keeping homepage order within each group.
export function starredFirst(order, starred) {
  const set = new Set(starred);
  return [...order.filter(t => set.has(t.repo)), ...order.filter(t => !set.has(t.repo))];
}
