const toolStates = new WeakMap();
function text(element, value) { if (element.textContent !== value) element.textContent = value; }
export function decorateActivity(root) {
  if (document.documentElement.dataset.piWebTheme !== "vitesse:black") { clearActivity(root);return; }
  const kind = root.host?.localName;
  if (kind === 'tool-execution-view') {
    const execution = root.host.execution;
    const card = root.querySelector('.tool-card');
    const title = root.querySelector('.tool-title');
    if (!execution || !card || !title) return;
    const active = ['pending', 'running'].includes(execution.status);
    card.dataset.studioActive = String(active);
    let label = title.querySelector('.studio-tool-label');
    if (!label) { label = document.createElement('span'); label.className = 'studio-tool-label'; title.append(label); }
    text(label, `${execution.status === 'pending' ? 'Starting' : 'Running'} ${execution.toolName || 'tool'}`);
    let state = toolStates.get(root);
    if (!state) {
      state = { active: false, manual: false, onInteract: event => {
        if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
        const summary = event.target.closest?.('summary');
        if (summary && summary.parentElement.matches('.text-body')) {
          state.manual = true;
          state.manualOpen = !summary.parentElement.open;
        }
      }};
      root.addEventListener('pointerdown', state.onInteract, true);
      root.addEventListener('keydown', state.onInteract, true);
      toolStates.set(root, state);
    }
    const details = root.querySelector('.text-body');
    if (details && active && !state.active && !state.manual) details.open = true;
    if (details && !active && state.active && !state.manual && execution.status !== 'error') details.open = false;
    if (details && state.manual && state.status !== execution.status && execution.status !== 'error') details.open = state.manualOpen;
    state.status = execution.status;
    state.active = active;
  }
  if (kind === 'conversation-meter') {
    const meter = root.querySelector('.meter');
    if (!meter) return;
    let ticks = meter.querySelector('.studio-ticks');
    if (!ticks) {
      ticks = document.createElement('div');ticks.className = 'studio-ticks';ticks.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 32; i++) ticks.append(document.createElement('i'));
      meter.append(ticks);
    }
    const percent = Math.min(100, Math.max(0, Number(root.host.positionPercent) || 0));
    const current = Math.round(percent * 31 / 100);
    for (const [i, tick] of [...ticks.children].entries()) {
      const value = String(Math.abs(i - current) <= 1);
      if (tick.dataset.current !== value) tick.dataset.current = value;
    }
  }
  if (kind === 'chat-view') {
    const host = root.host;
    const chat = root.querySelector('.chat');
    if (!chat) return;
    const status = host.status;
    const last = host.messages?.at(-1);
    const thinking = status?.isStreaming && last?.role === 'assistant' && last.parts?.at(-1)?.type === 'thinking';
    const label = host.isSendingPrompt ? 'Sending message' : status?.isCompacting ? 'Compacting conversation' : status?.isBashRunning ? 'Running command' : thinking ? 'Thinking' : status?.isStreaming ? 'Working' : '';
    let indicator = root.querySelector('.studio-inline-activity');
    if (!label) { indicator?.remove(); return; }
    if (!indicator) {
      indicator = document.createElement('div');indicator.className = 'studio-inline-activity';indicator.setAttribute('role', 'status');
      const spinner = document.createElement('span');spinner.className = 'studio-inline-spinner';spinner.setAttribute('aria-hidden', 'true');
      const caption = document.createElement('span');caption.className = 'studio-inline-label';indicator.append(spinner, caption);
    }
    text(indicator.lastElementChild, label);
    if (chat.lastElementChild !== indicator) chat.append(indicator);
  }
}
export function clearActivity(root) {
  const state = toolStates.get(root);
  if (state) { root.removeEventListener('pointerdown', state.onInteract, true);root.removeEventListener('keydown', state.onInteract, true);toolStates.delete(root); }
  for (const element of root.querySelectorAll('.studio-tool-label, .studio-inline-activity, .studio-ticks')) element.remove();
  root.querySelector('[data-studio-active]')?.removeAttribute('data-studio-active');
}
