// Proxy the native per-message action; Pi Web owns entry selection and forking.
export function decorateResponseActions(root) {
  if (root.host?.localName !== 'chat-view') return;
  if (document.documentElement.dataset.piWebTheme !== 'vitesse:black') {
    clearResponseActions(root);
    return;
  }
  for (const message of root.querySelectorAll('.msg.assistant, .group-msg.assistant')) {
    const native = message.querySelector('.msg-actions button[aria-label="Clone session from this message"]');
    let footer = message.querySelector(':scope > .studio-response-actions');
    if (!native) { footer?.remove(); message.removeAttribute('data-studio-fork-footer'); continue; }
    if (!footer) {
      footer = document.createElement('div');
      footer.className = 'studio-response-actions';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'studio-fork-action';
      button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="5" r="2"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="5" r="2"/><path d="M7 7v10m10-10v2a5 5 0 0 1-5 5H7"/></svg><span>Fork from here</span>';
      button.addEventListener('click', () => {
        const target = message.querySelector('.msg-actions button[aria-label="Clone session from this message"]');
        if (target && !target.disabled) target.click();
      });
      footer.append(button);
      message.append(footer);
    }
    const button = footer.firstElementChild;
    if (button.disabled !== native.disabled) button.disabled = native.disabled;
    const title = native.disabled ? 'Forking is unavailable while this session is busy or its history is loading.' : 'Create a separate session through this response';
    if (button.title !== title) button.title = title;
    if (!message.hasAttribute('data-studio-fork-footer')) message.setAttribute('data-studio-fork-footer', '');
  }
}
export function clearResponseActions(root) {
  root.querySelectorAll('.studio-response-actions').forEach(node => node.remove());
  root.querySelectorAll('[data-studio-fork-footer]').forEach(node => node.removeAttribute('data-studio-fork-footer'));
}
