import './style.css';
import tools from './tools.json';
import { filterTools } from './search.js';

const paths = {
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
  github: '<path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 22v-3.4c0-1 .1-1.4-.5-2 3.3-.4 6.8-1.6 6.8-7.3A5.7 5.7 0 0 0 19.8 5a5.3 5.3 0 0 0-.1-4S18.4.6 15.3 2.6a15.3 15.3 0 0 0-8 0C4.2.6 2.9 1 2.9 1a5.3 5.3 0 0 0-.1 4 5.7 5.7 0 0 0-1.5 4.3c0 5.7 3.5 6.9 6.8 7.3-.6.6-.6 1.2-.5 2V22" transform="translate(1 0) scale(.92)"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  arrow: '<path d="M5 19 19 5M6 5h13v13"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
const grid = document.querySelector('#tool-grid');
const search = document.querySelector('#search');
let activeFilter = 'all';
document.querySelector('#all-count').textContent = tools.length;
const escape = text => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
function render() {
  const results = filterTools(tools, search.value, activeFilter);
  document.querySelector('#result-count').textContent = `${results.length} ${results.length === 1 ? 'tool' : 'tools'} to explore`;
  document.querySelector('#empty-state').hidden = results.length !== 0;
  grid.innerHTML = results.map((tool, index) => `<article class="tool-card">
    <a class="preview-link" href="${tool.url}" target="_blank" rel="noopener noreferrer" aria-label="${escape(tool.action)}: ${escape(tool.title)}" style="--preview-bg:${tool.color}">
      <img src="${import.meta.env.BASE_URL}previews/${tool.image}" alt="${escape(tool.title)} preview" ${index < 6 ? 'fetchpriority="high"' : 'loading="lazy"'} width="800" height="500">
      <span class="preview-arrow">${icon('arrow')}</span>
    </a>
    <div class="card-content"><div class="card-category">${escape(tool.category)}</div><h2><a href="${tool.url}" target="_blank" rel="noopener noreferrer">${escape(tool.title)}</a></h2><p>${escape(tool.subtitle)}</p><div class="card-bottom"><a class="tool-action ${tool.type}" href="${tool.url}" target="_blank" rel="noopener noreferrer">${icon(tool.type === 'online' ? 'globe' : 'download')}${escape(tool.action)}<span aria-hidden="true">↗</span></a><a class="source-link" href="https://github.com/imranpollob/${tool.repo}" target="_blank" rel="noopener noreferrer" aria-label="Source code for ${escape(tool.title)}">${icon('github')}</a></div></div>
  </article>`).join('');
}
search.addEventListener('input', render);
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  render();
}));
document.querySelector('#reset-search').addEventListener('click', () => {
  search.value = '';
  document.querySelector('[data-filter="all"]').click();
  search.focus();
});
document.addEventListener('keydown', event => {
  if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault(); search.focus();
  }
  if (event.key === 'Escape' && document.activeElement === search) { search.value = ''; render(); }
});
render();
