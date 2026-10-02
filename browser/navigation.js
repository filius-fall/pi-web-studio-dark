// Presentation metadata for the existing navigation rows. Native actions stay intact.
const badgeColors = ['#818cf8', '#38bdf8', '#a3e635', '#fbbf24', '#c084fc'];
function badge(name) {
  const words = name.match(/[\p{L}\p{N}]+/gu) ?? ['Pi'];
  return (words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2)).toUpperCase();
}
function color(name) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return badgeColors[hash % badgeColors.length];
}
function text(element, value) {
  if (element.textContent !== value) element.textContent = value;
}
function age(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
  return `${Math.floor(minutes / 1440)}d`;
}
export function decorateNavigation(root) {
  const kind = root.host?.localName;
  if (!['project-list', 'workspace-list', 'session-list'].includes(kind)) return;
  const navigation = root.host.getRootNode().host;
  const project = navigation?.selectedProject;
  const sessions = new Map((root.host.sessions ?? []).map(session => [session.path, session]));
  for (const row of root.querySelectorAll('.action-row')) {
    const main = row.querySelector('.action-main');
    if (!main) continue;
    if (kind !== 'session-list') {
      const name = main.querySelector('.action-name, .workspace-primary-label')?.textContent.trim() ?? '';
      main.dataset.studioBadge = kind === 'workspace-list' ? '↳' : badge(name);
      main.style.setProperty('--studio-badge-color', color(kind === 'workspace-list' ? project?.name ?? name : name));
      continue;
    }
    const session = sessions.get(row.getAttribute('title'));
    const context = project?.name ?? session?.cwd?.split('/').filter(Boolean).at(-1) ?? 'Workspace';
    let meta = main.querySelector('.studio-session-meta');
    if (!meta) {
      meta = document.createElement('span');
      meta.className = 'studio-session-meta';
      for (const className of ['studio-project-badge', 'studio-project-name', 'studio-session-state']) {
        const part = document.createElement('span');
        part.className = className;
        meta.append(part);
      }
      main.prepend(meta);
    }
    meta.style.setProperty('--studio-badge-color', color(context));
    text(meta.children[0], badge(context));
    meta.children[0].setAttribute('aria-hidden', 'true');
    text(meta.children[1], context);
    meta.children[1].title = context;
    const state = meta.children[2];
    const indicator = main.querySelector('.action-activity .activity-indicator');
    const active = indicator?.matches('.session, .sending, .terminal') === true;
    const unread = row.classList.contains('unread') || !!main.querySelector('.activity-indicator.unread, .unread-ring');
    const label = active ? indicator.classList.contains('sending') ? 'Sending' : indicator.classList.contains('terminal') ? 'Terminal' : 'Working' : unread ? 'New' : age(session?.modified);
    state.dataset.active = String(active);
    state.dataset.unread = String(!active && unread);
    text(state, label);
    state.title = active ? label : unread ? 'Unread messages' : session?.modified ? `Last updated ${new Date(session.modified).toLocaleString()}` : '';
  }
}
export function clearNavigation(root) {
  for (const meta of root.querySelectorAll('.studio-session-meta')) meta.remove();
  for (const main of root.querySelectorAll('[data-studio-badge]')) {
    main.removeAttribute('data-studio-badge');
    main.style.removeProperty('--studio-badge-color');
  }
}
