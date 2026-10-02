// Fold completed work without moving native message nodes or changing session data.
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
    clearEventGroups(root);state = { session: host.sessionId, turns: new Map() };states.set(root, state);
  }
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
  const active = Boolean(host.status?.isStreaming || host.status?.isBashRunning || host.status?.isCompacting || host.isSendingPrompt);
  const present = new Set();
  for (const [index, current] of turns.entries()) {
    const live = active && index === turns.length - 1;
    const final = current.nodes.filter(node => node.matches('article.assistant')).at(-1);
    const work = current.nodes.filter(node => node !== final && node.matches('.event-group, .skill, .assistant, .tool-execution-shell, .tool, .bash'));
    if (!work.length) continue;
    present.add(current.key);
    let record = state.turns.get(current.key);
    if (!record) {
      const wrap = document.createElement('div');wrap.className = 'studio-work-summary';
      const button = document.createElement('button');button.type = 'button';wrap.append(button);
      record = { wrap, button, work: [], expanded: false, live };
      button.addEventListener('click', () => {
        record.expanded = !record.expanded;
        for (const node of record.work) { setHidden(node, !record.expanded);if (record.expanded && node.matches('details.event-group')) node.open = true; }
        button.setAttribute('aria-expanded', String(record.expanded));
      });
      state.turns.set(current.key, record);
    }
    if (record.live && !live) record.expanded = false;
    record.live = live;record.work = work;
    const tools = work.reduce((count, node) => count + (node.matches('.event-group') ? Number(node.querySelector(':scope > summary > span')?.textContent.match(/(\d+) tool\b/)?.[1] || 0) : node.matches('.tool-execution-shell, .tool, .bash') ? 1 : 0), 0);
    const label = tools ? `Work done · ${tools} tool call${tools === 1 ? '' : 's'}` : 'Work done';
    if (record.button.textContent !== label) record.button.textContent = label;
    record.button.setAttribute('aria-expanded', String(record.expanded));
    record.wrap.hidden = live;
    if (record.wrap.nextElementSibling !== work[0]) work[0].before(record.wrap);
    for (const node of work) {
      setHidden(node, !live && !record.expanded);
      if (!live && !record.expanded && node.matches('details.event-group') && node.open) node.open = false;
    }
  }
  for (const [key, record] of state.turns) if (!present.has(key)) {
    record.wrap.remove();for (const node of record.work) node.removeAttribute('data-studio-work-hidden');state.turns.delete(key);
  }
}
export function clearEventGroups(root) {
  const state = states.get(root);
  if (state) for (const record of state.turns.values()) record.wrap.remove();
  for (const summary of root.querySelectorAll('.studio-work-summary')) summary.remove();
  for (const node of root.querySelectorAll('[data-studio-work-hidden]')) node.removeAttribute('data-studio-work-hidden');
  states.delete(root);
}
