// Pi Web adaptation of Anthony Fu's Vitesse Black palette.
// https://github.com/antfu/vscode-theme-vitesse
// Contrast variant requested by the user: bright neutral text and saturated accents.
export const theme = {
  id: "black",
  name: "Vitesse Black",
  description: "Black surfaces, crisp white text, and vivid emerald accents.",
  order: 5,
  colorScheme: "dark",
  tokens: {
    "--pi-bg": "#000000",
    "--pi-surface": "#0b0b0b",
    "--pi-surface-hover": "#121212",
    "--pi-terminal-bg": "#000000",
    "--pi-terminal-text": "#f3f6fa",
    "--pi-border": "#3d4652",
    "--pi-border-muted": "#2c333d",
    "--pi-text": "#f3f6fa",
    "--pi-text-secondary": "#e3e9f0",
    "--pi-text-bright": "#ffffff",
    "--pi-muted": "#b9c4d2",
    "--pi-dim": "#a1acb9",
    "--pi-accent": "#00e69a",
    "--pi-accent-border": "#00b878",
    "--pi-selection-bg": "#05271b",
    "--pi-success": "#00e69a",
    "--pi-success-border": "#00b878",
    "--pi-success-bg": "#031a11",
    "--pi-success-surface": "#06291b",
    "--pi-success-ring": "#00e69a40",
    "--pi-warning": "#ffcf33",
    "--pi-warning-border": "#c99d12",
    "--pi-warning-surface": "#19160d",
    "--pi-danger": "#ff526d",
    "--pi-purple": "#be85ff",
    "--pi-purple-border": "#8952d4",
    "--pi-purple-surface": "#160b24",
    "--pi-overlay": "#000000b3",
    "--pi-shadow-soft": "#00000066",
    "--pi-shadow": "#00000099",
    "--pi-shadow-strong": "#000000cc",
    "--pi-bg-overlay-soft": "#000000dd",
    "--pi-bg-overlay": "#000000ee",
    "--pi-success-bg-overlay": "#031a11ee",
    "--pi-terminal-selection": "#eeeeee18"
  }
};

export default {
  apiVersion: 4,
  name: "Vitesse",
  activate: ({ lifetimeSignal }) => {
    const dispose = installChatContrast(lifetimeSignal);
    return { contributions: { themes: [theme] }, dispose };
  }
};


// Pi Web v1.202610.0 fades metadata independently of theme tokens.
// This small, theme-scoped presentation override keeps it readable. It does
// not change messages, sessions, controls, navigation, or other themes.
function installChatContrast(signal) {
  const sheet = new CSSStyleSheet();
  const scope = ':host-context(html[data-pi-web-theme="vitesse:black"])';
  sheet.replaceSync(`
    ${scope} .msg-meta { opacity: 1 !important; color: var(--pi-dim); }
    ${scope} .msg { border-radius: 4px; }
    ${scope} .msg > .msg-header { border-radius: 3px 3px 0 0; border-bottom-color: var(--pi-border); }
    ${scope} .msg.user { border-color: var(--pi-accent-border); }
    ${scope} .msg.user > .msg-header { border-bottom-color: var(--pi-accent-border); }
    ${scope} .msg.assistant > .msg-header .label { color: var(--pi-text-bright); }
  `);
  const roots = new Map();
  let disposed = false;
  function discover(node) {
    if (disposed || !node.querySelectorAll) return;
    const elements = node instanceof Element ? [node, ...node.querySelectorAll('*')] : node.querySelectorAll('*');
    for (const element of elements) {
      const root = element.shadowRoot;
      if (!root || roots.has(root)) continue;
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
      observe(root);
      discover(root);
    }
  }
  function observe(root) {
    const observer = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) discover(node);
    });
    roots.set(root, observer);
    observer.observe(root, { childList: true, subtree: true });
  }
  observe(document);
  discover(document);
  function dispose() {
    if (disposed) return;
    disposed = true;
    for (const [root, observer] of roots) {
      observer.disconnect();
      if (root instanceof ShadowRoot) root.adoptedStyleSheets = root.adoptedStyleSheets.filter(s => s !== sheet);
    }
    roots.clear();
    signal.removeEventListener('abort', dispose);
  }
  signal.addEventListener('abort', dispose, { once: true });
  return dispose;
}
