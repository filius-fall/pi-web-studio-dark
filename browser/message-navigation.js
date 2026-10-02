const states = new WeakMap();
let nextId = 0;
function userMessages(host) {
  return (host.messages ?? []).flatMap((message, offset) => {
    if (message.role !== 'user') return [];
    const content = (message.parts ?? []).filter(part => part.type === 'text').map(part => part.text ?? '').join(' ').trim();
    const index = (host.messageStart ?? 0) + offset;
    return [{ index, key: message.entryId ?? String(index), text: content || 'Image or file attachment' }];
  });
}
function updateCurrent(state) {
  const entries = state.entries;
  if (!entries.length) return;
  const top = state.scroller.getBoundingClientRect().top + 32;
  let current = entries[0].index;
  if (state.host.pinnedToBottom) current = entries.at(-1).index;
  else for (const entry of entries) {
    const target = state.root.querySelector(`article.msg.user[data-index="${entry.index}"]`);
    if (target && target.getBoundingClientRect().top <= top) current = entry.index;
  }
  for (const button of state.list.children) {
    const selected = Number(button.dataset.index) === current;
    if (button.getAttribute('aria-current') !== String(selected)) button.setAttribute('aria-current', String(selected));
    button.tabIndex = selected ? 0 : -1;
  }
}
function hidePreview(state) {
  state.preview.hidden = true;
  for (const button of state.list.children) button.removeAttribute('aria-describedby');
}
function showPreview(state, button) {
  const entry = state.entries.find(entry => entry.index === Number(button.dataset.index));
  if (!entry) return;
  const message = entry.text.replace(/\s+/g, ' ');
  state.preview.textContent = message.length > 240 ? `${message.slice(0, 240)}…` : message;
  state.preview.hidden = false;
  const bounds = state.wrap.getBoundingClientRect();
  const desired = button.getBoundingClientRect().top - bounds.top - 8;
  state.preview.style.top = `${Math.max(8, Math.min(desired, bounds.height - state.preview.offsetHeight - 8))}px`;
  button.setAttribute('aria-describedby', state.preview.id);
}
function jump(state, button) {
  const index = Number(button.dataset.index);
  const target = state.root.querySelector(`article.msg.user[data-index="${index}"]`);
  if (!target) return;
  state.host.pinnedToBottom = false;
  if (state.host.scrollToBottomFrame !== undefined) {
    cancelAnimationFrame(state.host.scrollToBottomFrame);
    state.host.scrollToBottomFrame = undefined;
  }
  state.host.lastClientHeight = state.scroller.clientHeight;
  state.scroller.scrollTo({
    top: state.scroller.scrollTop + target.getBoundingClientRect().top - state.scroller.getBoundingClientRect().top - 16,
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  });
  hidePreview(state);
}
export function decorateMessageNavigation(root) {
  if (root.host?.localName !== 'chat-view') return;
  if (document.documentElement.dataset.piWebTheme !== 'vitesse:black') { clearMessageNavigation(root);return; }
  const host = root.host, wrap = root.querySelector('.chat-wrap'), scroller = root.querySelector('.chat');
  if (!wrap || !scroller) return;
  let state = states.get(root);
  if (state && (state.wrap !== wrap || state.scroller !== scroller)) { clearMessageNavigation(root);state = undefined; }
  if (!state) {
    const nav = document.createElement('nav');nav.className = 'studio-message-nav';nav.setAttribute('aria-label', 'Your messages');
    const list = document.createElement('div');list.className = 'studio-message-markers';nav.append(list);
    const earlier = document.createElement('button');earlier.className = 'studio-message-earlier';earlier.textContent = '↑';earlier.title = 'Load earlier messages';earlier.setAttribute('aria-label', 'Load earlier messages');nav.prepend(earlier);
    const preview = document.createElement('div');preview.className = 'studio-message-preview';preview.id = `studio-message-preview-${++nextId}`;preview.setAttribute('role', 'tooltip');preview.hidden = true;
    wrap.append(nav, preview);
    state = { root, host, wrap, scroller, nav, list, earlier, preview, entries: [], signature: '', frame: undefined };
    state.onScroll = () => {
      hidePreview(state);
      if (state.frame === undefined) state.frame = requestAnimationFrame(() => { state.frame = undefined;updateCurrent(state); });
    };
    scroller.addEventListener('scroll', state.onScroll, { passive: true });
    state.resize = new ResizeObserver(state.onScroll);state.resize.observe(scroller);
    earlier.addEventListener('click', () => host.requestLoadMore?.());
    list.addEventListener('click', event => { const button = event.target.closest('button');if (button) jump(state, button); });
    list.addEventListener('pointerover', event => { const button = event.target.closest('button');if (button) showPreview(state, button); });
    list.addEventListener('pointerleave', () => hidePreview(state));
    list.addEventListener('focusin', event => { const button = event.target.closest('button');if (button) showPreview(state, button); });
    list.addEventListener('focusout', () => hidePreview(state));
    list.addEventListener('keydown', event => {
      if (event.key === 'Escape') { hidePreview(state);return; }
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      const buttons = [...list.children];const current = buttons.indexOf(event.target);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : Math.min(buttons.length - 1, Math.max(0, current + (event.key === 'ArrowDown' ? 1 : -1)));
      event.preventDefault();buttons[next]?.focus();
    });
    states.set(root, state);
  }
  const entries = userMessages(host);
  const signature = JSON.stringify([host.machineId, host.sessionId, entries]);
  if (signature !== state.signature) {
    state.signature = signature;state.entries = entries;hidePreview(state);
    const buttons = entries.map((entry, order) => {
      const button = document.createElement('button');button.type = 'button';button.dataset.index = String(entry.index);
      button.setAttribute('aria-label', `Message ${order + 1}: ${entry.text.replace(/\s+/g, ' ').slice(0, 160)}`);
      return button;
    });
    state.list.replaceChildren(...buttons);
  }
  state.nav.hidden = !entries.length && !host.hasMore;
  state.earlier.hidden = !host.hasMore;
  state.earlier.disabled = host.loadingMore || host.loadMoreRequested;
  updateCurrent(state);
}
export function clearMessageNavigation(root) {
  const state = states.get(root);
  if (!state) return;
  state.scroller.removeEventListener('scroll', state.onScroll);
  state.resize.disconnect();if (state.frame !== undefined) cancelAnimationFrame(state.frame);
  state.nav.remove();state.preview.remove();states.delete(root);
}
