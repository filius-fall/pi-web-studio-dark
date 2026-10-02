// Session presentation helpers. Archiving and restoration stay with Pi Web.
const storageKey = 'pi-studio-session-pins:v1';
function readPins(storage) {
  try {
    const value = JSON.parse(storage.getItem(storageKey) ?? '[]');
    return new Set(Array.isArray(value) ? value.filter(key => typeof key === 'string') : []);
  } catch { return new Set(); }
}
function keyFor(host, session) {
  const navigation = host.getRootNode().host;
  const machine = navigation?.selectedMachine?.id ?? session.machineId ?? 'local';
  return JSON.stringify([machine, session.id]);
}
function active(host, session) {
  const status = host.statuses?.[session.id];
  const activity = host.activities?.[session.id];
  return host.sending?.[session.id] === true || status?.isStreaming === true || status?.isBashRunning === true || status?.isCompacting === true || (status?.pendingMessageCount ?? 0) > 0 || (activity?.phase === 'active' && activity.startup !== true);
}
function canArchive(host, session) {
  const status = host.statuses?.[session.id];
  const persisted = (status?.sessionId === session.id ? status.persisted : undefined) ?? session.persisted;
  return session.archived !== true && persisted === true && typeof host.onArchive === 'function' && !active(host, session);
}
export function prioritizeThreads(rows, isPinned) {
  // Move whole branches together so pinned children keep their parent context.
  const groups = [];
  for (const row of rows) {
    if (!groups.length || row.depth === 0) groups.push([]);
    groups.at(-1).push(row);
  }
  const pinned = [], ordinary = [];
  for (const group of groups) (group.some(row => row.session.archived !== true && isPinned(row.session)) ? pinned : ordinary).push(...group);
  return [...pinned, ...ordinary];
}
function setAttribute(element, name, value) { if (element.getAttribute(name) !== value) element.setAttribute(name, value); }
function setText(element, value) { if (element.textContent !== value) element.textContent = value; }
function button(className) {
  const element = document.createElement('button');element.type = 'button';element.className = className;
  element.addEventListener('click', event => event.stopPropagation());
  element.addEventListener('keydown', event => event.stopPropagation());
  return element;
}
export function createSessionManagement(storage = localStorage) {
  const roots = new Map();
  let pins = readPins(storage);
  let revision = 0;
  let disposed = false;
  function refresh() {
    revision++;
    for (const [root, state] of roots) {
      state.host.requestUpdate();
      decorate(root);
    }
  }
  function report(state, message) {
    let notice = state.root.querySelector('.studio-session-notice');
    if (!notice) {
      notice = document.createElement('div');notice.className = 'studio-session-notice';notice.setAttribute('role', 'status');
      state.root.querySelector('section')?.append(notice);
    }
    setText(notice, message);
  }
  function togglePin(state, session) {
    const key = keyFor(state.host, session);
    const latest = readPins(storage);
    if (latest.has(key)) latest.delete(key);else latest.add(key);
    try { storage.setItem(storageKey, JSON.stringify([...latest])); }
    catch { report(state, 'Could not save the pin in this browser.');return; }
    pins = latest;state.root.querySelector('.studio-session-notice')?.remove();refresh();
  }
  async function settle(state, session) {
    const restoring = session.archived === true;
    if (state.pending.has(session.id) || (!restoring && !canArchive(state.host, session))) return;
    const callback = restoring ? state.host.onRestore : state.host.onArchive;
    if (typeof callback !== 'function') return;
    state.pending.add(session.id);decorate(state.root);
    try { await callback(session);state.root.querySelector('.studio-session-notice')?.remove(); }
    catch { report(state, restoring ? 'Could not restore this session. Try again.' : 'Could not archive this session. Try again.'); }
    finally { state.pending.delete(session.id);if (!disposed) decorate(state.root); }
  }
  function install(root) {
    const host = root.host;
    const descriptor = Object.getOwnPropertyDescriptor(host, 'sessionTree');
    const original = host.sessionTree;
    if (typeof original !== 'function') return;
    const state = { root, host, descriptor, original, pending: new Set(), cached: undefined, cachedRevision: -1 };
    state.wrapper = function () {
      const tree = original.call(this);
      if (document.documentElement.dataset.piWebTheme !== 'vitesse:black') return tree;
      const scope = keyFor(host, { id: '' });
      if (state.source === tree && state.cachedRevision === revision && state.scope === scope) return state.cached;
      const currentRows = prioritizeThreads(tree.currentRows, session => pins.has(keyFor(host, session)));
      const selectable = new Set(tree.currentSelectableSessions.map(session => session.id));
      state.cached = { ...tree, currentRows, currentSelectableSessions: currentRows.map(row => row.session).filter(session => selectable.has(session.id)) };
      state.source = tree;state.scope = scope;state.cachedRevision = revision;
      return state.cached;
    };
    host.sessionTree = state.wrapper;roots.set(root, state);host.requestUpdate();return state;
  }
  function decorate(root) {
    if (disposed || root.host?.localName !== 'session-list') return;
    if (document.documentElement.dataset.piWebTheme !== 'vitesse:black') { clear(root);return; }
    const state = roots.get(root) ?? install(root);
    if (!state) return;
    const sessions = new Map((state.host.sessions ?? []).map(session => [session.path, session]));
    for (const row of root.querySelectorAll('.action-row')) {
      const session = sessions.get(row.getAttribute('title'));
      if (!session) continue;
      const pinned = pins.has(keyFor(state.host, session));
      let controls = row.querySelector('.studio-session-controls');
      if (!controls) {
        controls = document.createElement('div');controls.className = 'studio-session-controls';
        const pin = button('studio-session-pin'), done = button('studio-session-done');controls.append(pin, done);row.append(controls);
      }
      const [pin, done] = controls.children;
      pin.hidden = session.archived === true;
      pin.title = pinned ? 'Unpin session' : 'Pin session';setAttribute(pin, 'aria-label', pin.title);pin.setAttribute('aria-pressed', String(pinned));
      pin.onclick = event => { event.stopPropagation();togglePin(state, session); };
      const restoring = session.archived === true;
      done.dataset.restore = String(restoring);done.dataset.pending = String(state.pending.has(session.id));
      done.title = restoring ? 'Restore session' : active(state.host, session) ? 'Stop active work before marking done' : 'Mark done (archive session)';setAttribute(done, 'aria-label', restoring ? 'Restore session' : 'Mark done');
      done.disabled = state.pending.has(session.id) || (restoring ? typeof state.host.onRestore !== 'function' : !canArchive(state.host, session));
      done.onclick = event => { event.stopPropagation();settle(state, session); };
      row.dataset.studioPinned = String(pinned && !restoring);
      const menu = row.querySelector('.action-menu-panel');
      if (menu) {
        let actions = menu.querySelector('.studio-session-menu-actions');
        if (!actions) { actions = document.createElement('div');actions.className = 'studio-session-menu-actions';actions.append(button('studio-session-menu-pin'), button('studio-session-menu-done'));menu.prepend(actions); }
        const [menuPin, menuDone] = actions.children;
        menuPin.hidden = restoring;setText(menuPin, pinned ? 'Unpin session' : 'Pin session');menuPin.onclick = event => { event.stopPropagation();state.host.openMenuSessionId = undefined;togglePin(state, session); };
        menuDone.hidden = restoring;setText(menuDone, 'Mark done');menuDone.disabled = done.disabled;menuDone.title = done.title;menuDone.onclick = event => { event.stopPropagation();state.host.openMenuSessionId = undefined;settle(state, session); };
      }
    }
  }
  function clear(root) {
    const state = roots.get(root);
    if (state) {
      if (state.host.sessionTree === state.wrapper) {
        if (state.descriptor) Object.defineProperty(state.host, 'sessionTree', state.descriptor);else delete state.host.sessionTree;
        if (state.host.isConnected) state.host.requestUpdate();
      }
      roots.delete(root);
    }
    for (const element of root.querySelectorAll('.studio-session-controls, .studio-session-menu-actions, .studio-session-notice')) element.remove();
    for (const row of root.querySelectorAll('[data-studio-pinned]')) row.removeAttribute('data-studio-pinned');
  }
  function onStorage(event) { if (event.key === storageKey || event.key === null) { pins = readPins(storage);refresh(); } }
  window.addEventListener('storage', onStorage);
  return {
    decorate,
    clear,
    dispose() { disposed = true;window.removeEventListener('storage', onStorage);for (const root of [...roots.keys()]) clear(root); }
  };
}
