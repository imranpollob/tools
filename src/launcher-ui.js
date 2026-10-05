import { launcherOrder } from './launcher.js';

const escape = text =>
  String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const boxHTML = tool =>
  `<a class="launcher-box" href="${tool.url}" target="_blank" rel="noopener noreferrer">${escape(tool.title)}</a>`;

export function initLauncher(doc, tools) {
  const toggle = doc.querySelector('#launcher-toggle');
  const panel = doc.querySelector('#launcher');
  const backdrop = doc.querySelector('#launcher-backdrop');
  const grid = doc.querySelector('#launcher-grid');
  const count = doc.querySelector('#launcher-count');
  if (!toggle || !panel || !backdrop || !grid || !count) return;

  const order = launcherOrder(tools);
  grid.innerHTML = order.map(boxHTML).join('');
  count.textContent = `${order.length}`;

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
