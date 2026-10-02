import { decorateMessageNavigation, clearMessageNavigation } from "./message-navigation.js";
import { decorateActivity, clearActivity } from "./activity.js";
import { appearanceCss } from "./appearance.js";
import { decorateNavigation, clearNavigation } from "./navigation.js";
import { decorateModels, clearModels } from "./models.js";
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
    "--pi-bg": "#121212",
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
    "--pi-bg-overlay-soft": "#121212dd",
    "--pi-bg-overlay": "#121212ee",
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
  // Use the upstream Pi favicon, served locally with the plugin.
  const iconUrl = new URL("./pi-icon.svg", import.meta.url).href;
  const icons = [...document.head.querySelectorAll('link[rel~="icon"]')];
  const originalIcons = icons.map(icon => ({ icon, attributes: ["href", "type", "sizes"].map(name => [name, icon.getAttribute(name)]) }));
  let addedIcon;
  if (!icons.length) {
    addedIcon = document.createElement("link");
    addedIcon.rel = "icon";
    document.head.append(addedIcon);
    icons.push(addedIcon);
  }
  for (const icon of icons) {
    icon.href = iconUrl;
    icon.type = "image/svg+xml";
    icon.sizes = "any";
  }
  const roots = new Map();
  const themeObserver = new MutationObserver(() => {
    for (const root of roots.keys()) { decorateActivity(root);decorateMessageNavigation(root); }
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-pi-web-theme"] });
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
  function syncThinking(root) {
    if (root.host?.localName !== "chat-view") return;
    const chat = root.host;
    const last = chat.messages?.at(-1);
    const active = chat.status?.isStreaming === true;
    const thinking = active && (last?.role === "assistant" && last.parts?.at(-1)?.type === "thinking");
    const summaries = [...root.querySelectorAll("details.part:not(.skill-invocation) > summary")]
      .filter(summary => summary.textContent.trim().toLowerCase() === "thinking");
    const current = thinking ? summaries.at(-1) : undefined;
    for (const summary of summaries) {
      summary.setAttribute("data-studio-reasoning", "");
      if (summary === current) summary.setAttribute("data-studio-thinking", "");
      else summary.removeAttribute("data-studio-thinking");
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
            clearMessageNavigation(observed);
            observed.removeEventListener("click", rememberTools, true);
            observed.adoptedStyleSheets = observed.adoptedStyleSheets.filter(s => s !== sheet);
            roots.delete(observed);
          }
        }
      }
      decorateNavigation(root);
      decorateModels(root);
      if (root.host?.localName === "app-navigation-panel") {
        for (const list of root.querySelectorAll("project-list, workspace-list, session-list")) {
          if (list.shadowRoot) decorateNavigation(list.shadowRoot);
        }
      }
      syncThinking(root);
      decorateActivity(root);
      decorateMessageNavigation(root);
      installToolsButton();
    });
    roots.set(root, observer);
    observer.observe(root, { childList: true, subtree: true, characterData: ["project-list", "workspace-list", "session-list", "model-picker", "prompt-editor", "chat-view", "tool-execution-view"].includes(root.host?.localName), ...(["project-list", "workspace-list", "session-list", "prompt-editor", "conversation-meter", "tool-execution-view"].includes(root.host?.localName) ? { attributes: true, attributeFilter: ["class", "aria-label", "style"] } : {}) });
    decorateNavigation(root);
    decorateModels(root);
    syncThinking(root);
    decorateActivity(root);
    decorateMessageNavigation(root);
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
  const navigationTimer = setInterval(() => {
    for (const root of roots.keys()) decorateNavigation(root);
  }, 60000);
  let layoutTimer = setTimeout(syncLayout, 500);
  // A pre-paint bootstrap can hold the shell until styles and fonts are ready.
  const readyTimer = setTimeout(async () => {
    await document.fonts.ready;
    if (disposed) return;
    syncLayout();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.documentElement.removeAttribute("data-studio-loading");
    }));
  }, 550);
  function onResize() {
    clearTimeout(layoutTimer);
    layoutTimer = setTimeout(syncLayout, 100);
  }
  window.addEventListener("resize", onResize);
  function dispose() {
    if (disposed) return;
    disposed = true;
    themeObserver.disconnect();
    clearTimeout(layoutTimer);
    clearInterval(navigationTimer);
    clearTimeout(readyTimer);
    document.documentElement.removeAttribute("data-studio-loading");
    window.removeEventListener("resize", onResize);
    for (const [root, observer] of roots) {
      observer.disconnect();
      clearNavigation(root);
      clearModels(root);
      clearActivity(root);
      clearMessageNavigation(root);
      root.removeEventListener("click", rememberTools, true);
      for (const summary of root.querySelectorAll("[data-studio-reasoning]")) {
        summary.removeAttribute("data-studio-thinking");
        summary.removeAttribute("data-studio-reasoning");
      }
      if (root instanceof ShadowRoot) root.adoptedStyleSheets = root.adoptedStyleSheets.filter(s => s !== sheet);
    }
    roots.clear();
    for (const { icon, attributes } of originalIcons) {
      if (icon.href !== iconUrl) continue;
      for (const [name, value] of attributes) {
        if (value === null) icon.removeAttribute(name);
        else icon.setAttribute(name, value);
      }
    }
    addedIcon?.remove();
    document.fonts.delete(font);
    toolsButton?.remove();
    signal.removeEventListener('abort', dispose);
  }
  signal.addEventListener('abort', dispose, { once: true });
  return dispose;
}
