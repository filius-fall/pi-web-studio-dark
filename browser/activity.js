import { toolActionName, toolActionKind } from './tool-labels.js';

const toolStates = new WeakMap();
function text(element, value) { if (element.textContent !== value) element.textContent = value; }
export function decorateActivity(root) {
  if (document.documentElement.dataset.piWebTheme !== "vitesse:black") { clearActivity(root);return; }
  const kind = root.host?.localName;
  if (kind === 'prompt-editor') {
    const steer = root.querySelector('.steer-button');
    if (steer) {
      if (!steer.hasAttribute('data-studio-steer-title')) {
        steer.dataset.studioSteerTitle = steer.title;
        steer.dataset.studioSteerAria = steer.getAttribute('aria-label') || '';
      }
      const title = 'Send now — steer the response at the next model call';
      if (steer.title !== title) steer.title = title;
      if (steer.getAttribute('aria-label') !== 'Send now (steer current response)') steer.setAttribute('aria-label', 'Send now (steer current response)');
    }
  }
  if (kind === 'tool-execution-view') {
    const execution = root.host.execution;
    const card = root.querySelector('.tool-card');
    const title = root.querySelector('.tool-title');
    if (!execution || !card || !title) return;
    const active = ['pending', 'running'].includes(execution.status);
    card.dataset.studioActive = String(active);
    let icon = title.querySelector('.studio-tool-icon');
    if (!icon) { icon = document.createElement('span');icon.className = 'studio-tool-icon';icon.setAttribute('aria-hidden', 'true');title.append(icon); }
    const actionKind = toolActionKind(execution);
    if (icon.dataset.kind !== actionKind) icon.dataset.kind = actionKind;
    let label = title.querySelector('.studio-tool-label');
    if (!label) { label = document.createElement('span'); label.className = 'studio-tool-label'; title.append(label); }
    const action = toolActionName(execution);
    // The spinner and status icon already communicate progress; keep the row
    // label focused on the action so it stays concise in nested event lists.
    text(label, action);
    const target = title.querySelector('.summary, .path');
    const fullTarget = target?.getAttribute('title') || execution.summary || execution.toolName || '';
    if (label.title !== fullTarget) label.title = fullTarget;
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
    for (const message of root.querySelectorAll('.queued-message')) {
      let state = message.querySelector('.studio-queue-state');
      if (!state) { state = document.createElement('span');state.className = 'studio-queue-state';message.append(state); }
      const nativeKind = message.querySelector('.queued-kind')?.textContent || '';
      text(state, nativeKind.startsWith('Steer') ? 'Steering' : 'Queued');
    }
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
  for (const element of root.querySelectorAll('.studio-tool-icon, .studio-tool-label, .studio-inline-activity, .studio-ticks, .studio-queue-state')) element.remove();
  const steer = root.querySelector('.steer-button[data-studio-steer-title]');
  if (steer) {
    steer.title = steer.dataset.studioSteerTitle;
    steer.setAttribute('aria-label', steer.dataset.studioSteerAria);
    delete steer.dataset.studioSteerTitle;delete steer.dataset.studioSteerAria;
  }
  root.querySelector('[data-studio-active]')?.removeAttribute('data-studio-active');
}
