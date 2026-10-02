import { appearanceCss } from "./appearance.js";
// Pi Web adaptation of Anthony Fu's Vitesse Black palette.
// https://github.com/antfu/vscode-theme-vitesse
// Contrast variant requested by the user: bright neutral text and saturated accents.
export const theme = {
  id: "black",
  name: "Studio Dark",
  description: "Charcoal, DM Sans, flat messages, and compact navigation.",
  order: 5,
  colorScheme: "dark",
  tokens: {
    "--pi-bg": "#111111",
    "--pi-surface": "#1b1b1b",
    "--pi-surface-hover": "#252525",
    "--pi-terminal-bg": "#0b0b0b",
    "--pi-terminal-text": "#ededf0",
    "--pi-border": "#2b2b2b",
    "--pi-border-muted": "#202020",
    "--pi-text": "#e8e8ed",
    "--pi-text-secondary": "#d4d4dc",
    "--pi-text-bright": "#ffffff",
    "--pi-muted": "#a0a0a5",
    "--pi-dim": "#89898f",
    "--pi-accent": "#628dff",
    "--pi-accent-border": "#4368cf",
    "--pi-selection-bg": "#202020",
    "--pi-success": "#34d399",
    "--pi-success-border": "#277c60",
    "--pi-success-bg": "#15231d",
    "--pi-success-surface": "#1c3026",
    "--pi-success-ring": "#34d39930",
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
    "--pi-bg-overlay-soft": "#111111dd",
    "--pi-bg-overlay": "#111111ee",
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


// Theme-scoped presentation layer for Pi Web v1.202610.0.
// Content and agent execution remain owned by Pi Web.
function installChatContrast(signal) {
  const sheet = new CSSStyleSheet();
  const scope = ':host-context(html[data-pi-web-theme="vitesse:black"])';
  sheet.replaceSync(appearanceCss(scope));
  const roots = new Map();
  let disposed = false;
  let toolsButton;
  function rememberTools(event) {
    const button = event.target.closest?.("button");
    const label = button?.getAttribute("aria-label");
    try {
      if (label === "Collapse workspace panel") localStorage.setItem("pi-studio-tools-open", "false");
      if (label === "Expand workspace panel") localStorage.setItem("pi-studio-tools-open", "true");
    } catch { /* Private-mode storage may be blocked. */ }
  }
  function installToolsButton() {
    const appRoot = document.querySelector("pi-web-app")?.shadowRoot;
    if (!appRoot || toolsButton) return;
    toolsButton = document.createElement("button");
    toolsButton.className = "studio-tools-toggle";
    toolsButton.textContent = "Files & terminal";
    toolsButton.title = "Open the workspace tools panel";
    toolsButton.addEventListener("click", () => {
      const edge = appRoot.querySelector('app-panel-edge-control[side="workspace"]');
      edge?.shadowRoot?.querySelector('button[aria-label="Expand workspace panel"]')?.click();
    });
    appRoot.append(toolsButton);
  }
  const font = new FontFace("Pi Studio Sans", `url(${new URL("./dm-sans.woff2", import.meta.url)})`, { weight: "100 1000", style: "normal", display: "swap" });
  font.load().then(loaded => { if (!disposed) document.fonts.add(loaded); }).catch(() => {});
  function discover(node) {
    if (disposed || !node.querySelectorAll) return;
    const elements = node instanceof Element ? [node, ...node.querySelectorAll('*')] : node.querySelectorAll('*');
    for (const element of elements) {
      const root = element.shadowRoot;
      if (!root || roots.has(root)) continue;
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
      if (root.host.matches('app-panel-edge-control[side="workspace"]')) root.addEventListener("click", rememberTools, true);
      observe(root);
      discover(root);
    }
  }
  function observe(root) {
    const observer = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) discover(node);
      // Do not retain observers for virtualized messages that left the DOM.
      if (records.some(r => r.removedNodes.length)) {
        for (const [observed, watcher] of roots) {
          if (observed instanceof ShadowRoot && !observed.host.isConnected) {
            watcher.disconnect();
            observed.removeEventListener("click", rememberTools, true);
            observed.adoptedStyleSheets = observed.adoptedStyleSheets.filter(s => s !== sheet);
            roots.delete(observed);
          }
        }
      }
      installToolsButton();
    });
    roots.set(root, observer);
    observer.observe(root, { childList: true, subtree: true });
  }
  observe(document);
  discover(document);
  installToolsButton();
  // Adopt the app's own panel toggle once; subsequent choices stay with the user.
  function syncLayout() {
    if (disposed || document.documentElement.dataset.piWebTheme !== "vitesse:black" || innerWidth <= 1180) return;
    try {
      const open = localStorage.getItem("pi-studio-tools-open") === "true";
      const app = document.querySelector("pi-web-app");
      const edge = app?.shadowRoot?.querySelector('app-panel-edge-control[side="workspace"]');
      const label = open ? "Expand workspace panel" : "Collapse workspace panel";
      const button = edge?.shadowRoot?.querySelector(`button[aria-label="${label}"]`);
      button?.click();

    } catch { /* Storage may be unavailable; leave the app's layout untouched. */ }
  }
  let layoutTimer = setTimeout(syncLayout, 500);
  function onResize() {
    clearTimeout(layoutTimer);
    layoutTimer = setTimeout(syncLayout, 100);
  }
  window.addEventListener("resize", onResize);
  function dispose() {
    if (disposed) return;
    disposed = true;
    clearTimeout(layoutTimer);
    window.removeEventListener("resize", onResize);
    for (const [root, observer] of roots) {
      observer.disconnect();
      root.removeEventListener("click", rememberTools, true);
      if (root instanceof ShadowRoot) root.adoptedStyleSheets = root.adoptedStyleSheets.filter(s => s !== sheet);
    }
    roots.clear();
    document.fonts.delete(font);
    toolsButton?.remove();
    signal.removeEventListener('abort', dispose);
  }
  signal.addEventListener('abort', dispose, { once: true });
  return dispose;
}
