import { sessionIsBusy } from './session-state.js';
// Fold completed work without moving native message nodes or changing session data.
import { activitySummary, toolActionName } from './tool-labels.js';

const states = new WeakMap();
function setHidden(node, hidden) {
  if (node.dataset.studioWorkHidden !== String(hidden)) node.dataset.studioWorkHidden = String(hidden);
}
export function decorateEventGroups(root) {
  if (root.host?.localName !== 'chat-view') return;
  if (document.documentElement.dataset.piWebTheme !== 'vitesse:black') { clearEventGroups(root);return; }
  const host = root.host, chat = root.querySelector('.chat');
  if (!chat) return;
  let state = states.get(root);
  if (!state || state.session !== host.sessionId) {
    clearEventGroups(root);state = { session: host.sessionId, turns: new Map(), groups: new Map() };states.set(root, state);
  }
  // Native groups render their children lazily. Read execution data from the
  // messages so the summary is accurate even when a group is closed.
  const groupExecutions = new Map();
  for (const group of chat.querySelectorAll('.msg.event-group')) {
    const summary = group.querySelector(':scope > summary');
    const nativeCaption = summary?.querySelector('span:not(.studio-group-caption)');
    if (!nativeCaption) continue;
    let record = state.groups.get(group);
    if (!record) {
      record = { folded: false };state.groups.set(group, record);
    }
    const count = Number(nativeCaption.textContent.match(/(\d+) events?\b/)?.[1] || 0);
    const start = Number(group.dataset.index);
    const executions = Number.isInteger(start) ? (host.messages || []).slice(start - (host.messageStart || 0), start - (host.messageStart || 0) + count)
      .flatMap(message => (message.parts || []).filter(part => part.type === 'toolExecution')) : [];
    if (executions.length && !record.folded) {
      // Preserve subsequent mouse/keyboard choices through native disclosure
      // state. Pure thinking groups keep their existing live presentation.
      record.folded = true;group.open = false;
    }
    groupExecutions.set(group, executions);
    let caption = summary.querySelector('.studio-group-caption');
    if (!caption) { caption = document.createElement('span');caption.className = 'studio-group-caption';summary.append(caption); }
    const label = executions.length ? activitySummary(executions) : 'Thinking and updates';
    if (caption.textContent !== label) caption.textContent = label;
    group.setAttribute('data-studio-activity-group', '');
  }
  for (const [group] of state.groups) if (!group.isConnected) state.groups.delete(group);
  const turns = [];
  let turn;
  for (const node of chat.children) {
    if (!node.matches('.msg')) continue;
    if (node.matches('.user')) { turn = { key: node.dataset.scrollAnchorId || node.dataset.index, nodes: [] };turns.push(turn); }
    else {
      if (!turn) { turn = { key: 'earlier-work', nodes: [] };turns.push(turn); }
      turn.nodes.push(node);
    }
  }
  const active = sessionIsBusy(host);
  host.dataset.studioSessionLive = String(active);
  const present = new Set();
  for (const [index, current] of turns.entries()) {
    const live = active && index === turns.length - 1;
    const final = live ? undefined : current.nodes.filter(node => node.matches('article.assistant')).at(-1);
    const work = current.nodes.filter(node => node !== final && node.matches('.event-group, .skill, .assistant, .tool-execution-shell, .tool, .bash'));
    // Streaming articles become final answers without replacement.
    for (const node of current.nodes) if (!work.includes(node)) {
      node.removeAttribute('data-studio-work-hidden');node.removeAttribute('data-studio-work-nested');node.removeAttribute('data-studio-turn-live');
    }
    if (!work.length) continue;
    present.add(current.key);
    let record = state.turns.get(current.key);
    if (!record) {
      const wrap = document.createElement('div');wrap.className = 'studio-work-summary';
      const button = document.createElement('button');button.type = 'button';wrap.append(button);
      const caption = document.createElement('span');button.append(caption);
      record = { wrap, button, caption, work: [], expanded: false, live };
      button.addEventListener('click', () => {
        record.expanded = !record.expanded;
        for (const node of record.work) { setHidden(node, !record.expanded);if (record.expanded && node.matches('details.event-group')) node.open = true; }
        button.setAttribute('aria-expanded', String(record.expanded));
      });
      state.turns.set(current.key, record);
    }
    if (record.live && !live) record.expanded = false;
    record.live = live;record.work = work;
    const executions = work.flatMap(node => node.matches('.event-group') ? groupExecutions.get(node) || [] :
      [...node.querySelectorAll('tool-execution-view')].map(tool => tool.execution).filter(Boolean));
    const running = executions.findLast(execution => ['running', 'pending'].includes(execution.status));
    const thinking = host.messages?.at(-1)?.parts?.at(-1)?.type === 'thinking';
    const user = (host.messages || []).findLast(message => message.role === 'user');
    const readingImage = live && thinking && user?.parts?.some(part => part.type === 'image');
    const label = live ? (running ? `Working · ${toolActionName(running)}` : thinking ? 'Thinking' : 'Working') : (executions.length ? `${final ? 'Work done' : 'Activity'} · ${activitySummary(executions)}` : final ? 'Work done' : 'Activity');
    if (record.caption.textContent !== label) record.caption.textContent = label;
    let imageBadge = record.button.querySelector('.studio-image-reading');
    if (readingImage && !imageBadge) {
      imageBadge = document.createElement('span');imageBadge.className = 'studio-image-reading';
      imageBadge.innerHTML = '<span class="studio-image-reading-icon"><span class="studio-image-scan-line"></span></span><span>Reading image</span>';
      record.button.append(imageBadge);
    } else if (!readingImage) imageBadge?.remove();
    record.button.setAttribute('aria-expanded', String(record.expanded));
    record.wrap.hidden = false;
    record.wrap.dataset.studioLive = String(live);
    record.wrap.dataset.studioThinking = String(live && !running && thinking);
    record.wrap.setAttribute('role', 'group');
    if (record.wrap.nextElementSibling !== work[0]) work[0].before(record.wrap);
    for (const node of work) {
      node.dataset.studioWorkNested = String(record.expanded);
      node.dataset.studioTurnLive = String(live);
      if (record.expanded) for (const details of node.querySelectorAll('details.part:not(.skill-invocation)')) {
        const summary = details.querySelector(':scope > summary');
        if (summary?.hasAttribute('data-studio-reasoning') || summary?.textContent.trim().toLowerCase() === 'thinking') {
          if (!details.hasAttribute('data-studio-unfolded')) details.dataset.studioUnfolded = String(details.open);
          details.open = true;
        }
      }
      setHidden(node, !record.expanded);
      if (!record.expanded && node.matches('details.event-group') && node.open) node.open = false;
    }
  }
  for (const [key, record] of state.turns) if (!present.has(key)) {
    record.wrap.remove();for (const node of record.work) { node.removeAttribute('data-studio-work-hidden');node.removeAttribute('data-studio-work-nested');node.removeAttribute('data-studio-turn-live'); }state.turns.delete(key);
  }
}
export function clearEventGroups(root) {
  root.host?.removeAttribute('data-studio-session-live');
  const state = states.get(root);
  if (state) for (const record of state.turns.values()) record.wrap.remove();
  if (state) for (const [group] of state.groups) {
    group.querySelector('.studio-group-caption')?.remove();
    group.removeAttribute('data-studio-activity-group');
  }
  for (const summary of root.querySelectorAll('.studio-work-summary')) summary.remove();
  for (const node of root.querySelectorAll('[data-studio-work-hidden]')) { node.removeAttribute('data-studio-work-hidden');node.removeAttribute('data-studio-work-nested');node.removeAttribute('data-studio-turn-live'); }
  for (const details of root.querySelectorAll('[data-studio-unfolded]')) {
    details.open = details.dataset.studioUnfolded === 'true';details.removeAttribute('data-studio-unfolded');
  }
  states.delete(root);
}
