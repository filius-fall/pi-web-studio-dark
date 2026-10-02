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
    const action = typeof execution.summary === 'string' ? execution.summary.trim() : '';
    // The spinner and status icon already communicate progress; keep the row
    // label focused on the action so it stays concise in nested event lists.
    text(label, action || execution.toolName || 'tool');
    const commandSummary = title.querySelector('.summary');
    if (commandSummary && action) {
      if (!commandSummary.hasAttribute('data-studio-command')) {
        commandSummary.dataset.studioCommand = commandSummary.getAttribute('title') || commandSummary.textContent.trim();
        commandSummary.dataset.studioOriginalTitle = commandSummary.getAttribute('title') || '';
        commandSummary.dataset.studioOriginalAria = commandSummary.getAttribute('aria-label') || '';
      }
      const command = commandSummary.dataset.studioCommand;
      if (action !== command) {
        text(commandSummary, action);
        commandSummary.title = command ? `Command: ${command}` : action;
        const ariaLabel = command ? `Action: ${action}. Command: ${command}` : action;
        if (commandSummary.getAttribute('aria-label') !== ariaLabel) commandSummary.setAttribute('aria-label', ariaLabel);
        commandSummary.setAttribute('data-studio-action', '');
      }
    }
    let state = toolStates.get(root);
    if (!state) {
      state = { manual: false, onInteract: event => {
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
    if (details && state.manual && state.status !== execution.status && execution.status !== 'error') details.open = state.manualOpen;
    state.status = execution.status;
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
    if (!label || (label === "Thinking" && root.querySelector("summary[data-studio-thinking]"))) { indicator?.remove(); return; }
    if (!indicator) {
      indicator = document.createElement('div');indicator.className = 'studio-inline-activity';indicator.setAttribute('role', 'status');
      const spinner = document.createElement('span');spinner.className = 'studio-inline-spinner';spinner.setAttribute('aria-hidden', 'true');
      const caption = document.createElement('span');caption.className = 'studio-inline-label';indicator.append(spinner, caption);
    }
    indicator.dataset.thinking = String(label === "Thinking");
    text(indicator.lastElementChild, label);
    if (chat.lastElementChild !== indicator) chat.append(indicator);
  }
}
export function clearActivity(root) {
  const state = toolStates.get(root);
  if (state) { root.removeEventListener('pointerdown', state.onInteract, true);root.removeEventListener('keydown', state.onInteract, true);toolStates.delete(root); }
  for (const element of root.querySelectorAll('.studio-tool-label, .studio-inline-activity, .studio-ticks')) element.remove();
  for (const summary of root.querySelectorAll('.tool-title .summary[data-studio-command]')) {
    text(summary, summary.dataset.studioCommand);
    if (summary.dataset.studioOriginalTitle) summary.setAttribute('title', summary.dataset.studioOriginalTitle);
    else summary.removeAttribute('title');
    if (summary.dataset.studioOriginalAria) summary.setAttribute('aria-label', summary.dataset.studioOriginalAria);
    else summary.removeAttribute('aria-label');
    delete summary.dataset.studioCommand;
    delete summary.dataset.studioOriginalTitle;
    delete summary.dataset.studioOriginalAria;
    summary.removeAttribute('data-studio-action');
  }
  root.querySelector('[data-studio-active]')?.removeAttribute('data-studio-active');
}
