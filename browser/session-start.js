// A draft-only welcome screen. Suggestions never send a message.
const starters = [
  ['Explore this project', 'Find your way around the code.', 'Give me a concise tour of this project: its purpose, structure, and how to run it.', 'M4 5h6l2 2h8v13H4Zm4 6h8m-8 4h5'],
  ['Fix a problem', 'Turn a rough edge into a solution.', 'Help me investigate a problem in this project. First, ask me about the symptoms and expected behavior.', 'M9 3h6m-3 0v4m-5 4H3m18 0h-4M7 17l-3 3m13-3 3 3M7 8h10v8a5 5 0 0 1-10 0Z'],
  ['Build something', 'Bring your next idea to life.', 'Help me plan and implement a new feature in this project. First, ask me what I want to build.', 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z'],
  ['Review changes', 'Get a fresh pair of eyes.', 'Review the current changes in this project for bugs and missing checks. Explain the most important findings.', 'M7 4H4v16h16v-3M9 4h11v9H9Zm3 4 2 2 3-3'],
];

export function clearSessionStart(root) {
  root.querySelector('.studio-session-start')?.remove();
  root.querySelector('.chat')?.removeAttribute('data-studio-session-start');
}

export function decorateSessionStart(root) {
  if (root.host?.localName === 'prompt-editor') {
    const chat = root.host.getRootNode().querySelector('chat-view');
    if (chat?.shadowRoot) decorateSessionStart(chat.shadowRoot);
    return;
  }
  if (root.host?.localName !== 'chat-view') return;
  const host = root.host, chat = root.querySelector('.chat');
  if (!chat) return;
  const busy = host.isSendingPrompt || host.isCompacting || host.loadingMore || host.hasMore || host.messageTotal > 0 ||
    host.status?.isStreaming || host.status?.isBashRunning || host.status?.isCompacting ||
    host.pendingMessageCount > 0 || host.status?.pendingMessageCount > 0 ||
    host.clientQueuedMessages?.length > 0 || host.status?.queuedMessages?.length > 0;
  if (document.documentElement.dataset.piWebTheme !== 'vitesse:black' || host.messages?.length || busy) {
    clearSessionStart(root);return;
  }
  const editor = host.getRootNode().querySelector('prompt-editor');
  let welcome = root.querySelector('.studio-session-start');
  if (!welcome) {
    welcome = document.createElement('section');welcome.className = 'studio-session-start';
    welcome.setAttribute('aria-label', 'Start a conversation');
    welcome.innerHTML = `<div class="studio-start-mark" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="m24 5 5 14 14 5-14 5-5 14-5-14-14-5 14-5Z"/><path d="m38 4 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/></svg></div><p class="studio-start-eyebrow">A fresh start</p><h2>What are we building?</h2><p class="studio-start-intro">A question, a fix, a spark of an idea.<br>Let’s make something good.</p><div class="studio-start-suggestions"></div><p class="studio-start-hint">Pick a starting point, or write your own below.</p>`;
    const suggestions = welcome.querySelector('.studio-start-suggestions');
    for (const [title, description, prompt, path] of starters) {
      const button = document.createElement('button');button.type = 'button';
      button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg><span><strong>${title}</strong><small>${description}</small></span><span class="studio-start-arrow" aria-hidden="true">↗</span>`;
      button.title = 'Add this suggestion to your draft';
      button.onclick = () => {
        const currentEditor = host.getRootNode().querySelector('prompt-editor');
        if (!currentEditor || currentEditor.disabled || currentEditor.draft?.trim()) return;
        currentEditor.replaceText?.(prompt);
        currentEditor.focusInput?.();
      };
      suggestions.append(button);
    }
    chat.append(welcome);
  }
  if (!chat.hasAttribute('data-studio-session-start')) chat.setAttribute('data-studio-session-start', '');
  const disabled = !editor || editor.disabled || Boolean(editor.draft?.trim());
  for (const button of welcome.querySelectorAll('button')) if (button.disabled !== disabled) button.disabled = disabled;
}
