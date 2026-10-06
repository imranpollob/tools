import { launcherOrder, starredFirst } from './launcher.js';

const escape = text =>
  String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const STAR_KEY = 'launcher-starred';
const loadStars = () => {
  try {
    const v = JSON.parse(localStorage.getItem(STAR_KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};
const saveStars = stars => {
  try {
    localStorage.setItem(STAR_KEY, JSON.stringify(stars));
  } catch {
    /* storage unavailable: stars last for this session only */
  }
};

const STAR_SVG =
  '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 2.8l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.6l-5.8 3.1 1.1-6.5L2.6 9.6l6.5-.9z" stroke-linejoin="round"/></svg>';

const boxHTML = (tool, starred) =>
  `<div class="launcher-box" style="--hue: ${Number(tool.hue) || 170}">` +
  `<span class="launcher-glyph" aria-hidden="true">${escape(tool.glyph ?? '')}</span>` +
  `<a class="launcher-link" href="${tool.url}" target="_blank" rel="noopener noreferrer">${escape(tool.title)}</a>` +
  `<button type="button" class="launcher-star" data-repo="${escape(tool.repo)}" aria-pressed="${starred}" aria-label="${starred ? 'Unstar' : 'Star'} ${escape(tool.title)}" title="${starred ? 'Unstar' : 'Star'}">${STAR_SVG}</button></div>`;

export function initLauncher(doc, tools) {
  const toggle = doc.querySelector('#launcher-toggle');
  const panel = doc.querySelector('#launcher');
  const backdrop = doc.querySelector('#launcher-backdrop');
  const grid = doc.querySelector('#launcher-grid');
  const count = doc.querySelector('#launcher-count');
  if (!toggle || !panel || !backdrop || !grid || !count) return;

  const base = launcherOrder(tools);
  let stars = loadStars();
  const render = () => {
    grid.innerHTML = starredFirst(base, stars)
      .map(t => boxHTML(t, stars.includes(t.repo)))
      .join('');
  };
  render();
  count.textContent = `${base.length}`;

  grid.addEventListener('click', event => {
    const btn = event.target.closest?.('.launcher-star');
    if (!btn) return;
    const repo = btn.dataset.repo;
    stars = stars.includes(repo) ? stars.filter(r => r !== repo) : [...stars, repo];
    saveStars(stars);
    grid.scrollTop = 0;
    render();
  });

  const isOpen = () => !panel.hidden;

  const updateFade = () => {
    const more = grid.scrollHeight - grid.scrollTop - grid.clientHeight > 8;
    panel.classList.toggle('has-more', more && isOpen());
  };

  // Hover intent: a short delay bridges the gap between toggle and panel
  // so moving the pointer across doesn't flicker the menu closed.
  let closeTimer = null;
  const cancelClose = () => {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer = setTimeout(() => close(), 150);
  };

  const open = () => {
    cancelClose();
    panel.hidden = false;
    backdrop.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    updateFade();
  };

  const close = (refocus = false) => {
    cancelClose();
    if (!isOpen()) return;
    panel.hidden = true;
    backdrop.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    updateFade();
    if (refocus) toggle.focus();
  };

  // Hover owns open/close on hover-capable devices, so a click while open
  // is a no-op there (hover already opened it). Touch and keyboard clicks
  // still toggle: detail === 0 marks keyboard activation.
  const hoverCapable = () =>
    doc.defaultView?.matchMedia?.('(hover: hover)')?.matches ?? true;
  toggle.addEventListener('click', event => {
    if (!isOpen()) open();
    else if (event.detail === 0 || !hoverCapable()) close();
  });
  toggle.addEventListener('mouseenter', open);
  toggle.addEventListener('mouseleave', scheduleClose);
  panel.addEventListener('mouseenter', cancelClose);
  panel.addEventListener('mouseleave', scheduleClose);
  grid.addEventListener('scroll', updateFade, { passive: true });
  doc.defaultView?.addEventListener('resize', updateFade);
  backdrop.addEventListener('click', () => close());
  doc.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen()) close(true);
  });
}
