import { filterTools } from './search.js';

// Homepage order: the Web Tools section first, then Installables,
// each following its manual priority.
export function launcherOrder(tools) {
  return [...filterTools(tools, '', 'online'), ...filterTools(tools, '', 'install')];
}
