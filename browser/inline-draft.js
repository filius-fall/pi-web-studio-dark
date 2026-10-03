import { filePresentation } from './composer-content.js';
const states = new WeakMap();
const nativeClasses = new WeakMap();

export function draftTokens(text) {
  const tokens = [];
  for (const match of text.matchAll(/https?:\/\/[^\s<>"`]+/g)) {
    let value = match[0].replace(/[.,;!?]+$/, '');
    while (value.endsWith(')') && (value.match(/\)/g)?.length || 0) > (value.match(/\(/g)?.length || 0)) value = value.slice(0, -1);
    try {
      const url = new URL(value);
      if (url.username || url.password) continue;
      const path = url.pathname.split('/').filter(Boolean);
      const github = url.hostname === 'github.com' && path.length >= 2 && path.slice(0, 2).every(part => /^[\w.-]+$/.test(part));
      tokens.push({ from: match.index, to: match.index + value.length, value, label: github ? `${path[0]}/${path[1].replace(/\.git$/, '')}` : `${url.hostname}${url.pathname === '/' ? '' : url.pathname}`, icon: github ? 'github' : null, color: '#91b7ff', kind: 'link' });
    } catch { /* Incomplete links remain editable text. */ }
  }
  for (const match of text.matchAll(/(?:^|\s)@(?:"([^"\n]+)"|'([^'\n]+)'|([^\s]+))/g)) {
    const quoted = !!(match[1] || match[2]);
    const value = (match[1] || match[2] || match[3]).replace(quoted ? /$^/ : /[,;!?]+$/, '');
    const name = value.split('/').at(-1), presentation = filePresentation(name || '');
    if (!name || !name.includes('.') || presentation.label === 'File') continue;
    const from = match.index + match[0].indexOf('@'), to = quoted ? match.index + match[0].length : from + 1 + value.length;
    if (tokens.some(token => from < token.to && to > token.from)) continue;
    tokens.push({ from, to, value: text.slice(from, to), ...presentation, label: name, kind: 'file' });
  }
  return tokens.sort((a, b) => a.from - b.from);
}
export function hasInlineDraft(root) { return states.has(root); }
export function decorateInlineDraft(root) {
  const host = root.host, view = host?.view, compartment = host?.editableCompartment;
  if (!view || !compartment?.get || !compartment?.reconfigure || !view.constructor.decorations) return;
  // Use this editor’s own decoration classes; separate CodeMirror copies are incompatible.
  const Decoration = nativeClasses.get(view.constructor) || (view.docView?.decorations || []).map(set => {
    const value = set.iter().value;
    return value && Object.getPrototypeOf(value.constructor);
  }).find(type => typeof type?.replace === 'function' && typeof type?.mark === 'function');
  if (!Decoration) return;
  nativeClasses.set(view.constructor, Decoration);
  {
    if (!host.isConnected || document.documentElement.dataset.piWebTheme !== 'vitesse:black') return;
    const existing = states.get(root), original = compartment.get(view.state);
    if (existing?.view === view && existing.wrapped === original) return;
    class TokenWidget {
      constructor(token) { this.token = token; }
      get estimatedHeight() { return -1; }
      get lineBreaks() { return 0; }
      compare(other) { return other instanceof TokenWidget && this.eq(other); }
      updateDOM() { return false; }
      destroy() {}
      eq(other) { return this.token.value === other.token.value && this.token.from === other.token.from; }
      toDOM(editor) {
        const token = this.token, chip = document.createElement('span');
        chip.className = `studio-inline-token studio-inline-${token.kind}`;
        chip.title = `${token.value} · click to edit`;
        chip.setAttribute('aria-label', `${token.label}, click to edit`);
        const icon = document.createElement('span');icon.className = 'studio-inline-icon';icon.setAttribute('aria-hidden', 'true');icon.style.color = token.color;
        if (token.icon) { icon.dataset.icon = token.icon;icon.style.setProperty('--studio-inline-icon', `url("${new URL(`./file-icons/${token.icon}.svg`, import.meta.url).href}")`); }
        else icon.textContent = token.kind === 'file' ? token.extension.toUpperCase() : '↗';
        const label = document.createElement('span');label.textContent = token.label;
        chip.append(icon, label);
        chip.addEventListener('pointerdown', event => { event.preventDefault();editor.dispatch({ selection: { anchor: token.from + 1 } });editor.focus(); });
        return chip;
      }
      ignoreEvent() { return true; }
    }
    const decoration = view.constructor.decorations.of(editor => {
      const cursor = editor.state.selection.main, ranges = [];
      for (const token of draftTokens(editor.state.doc.toString())) {
        const editing = cursor.from <= token.to && cursor.to >= token.from;
        ranges.push(editing ? Decoration.mark({ class: 'studio-inline-editable', attributes: token.icon ? { 'data-studio-icon': token.icon, style: `--studio-inline-icon: url("${new URL(`./file-icons/${token.icon}.svg`, import.meta.url).href}")` } : {} }).range(token.from, token.to) : Decoration.replace({ widget: new TokenWidget(token) }).range(token.from, token.to));
      }
      return Decoration.set(ranges, true);
    });
    const wrapped = [original, decoration];
    try {
      view.dispatch({ effects: compartment.reconfigure(wrapped) });
      states.set(root, { view, compartment, original, wrapped });
      root.querySelector('.studio-draft-links')?.remove();
    } catch { /* Unsupported editor versions keep the native draft and preview chips. */ }
  }
}
export function clearInlineDraft(root) {
  const state = states.get(root);states.delete(root);
  if (state) try {
    if (state.compartment.get(state.view.state) === state.wrapped) state.view.dispatch({ effects: state.compartment.reconfigure(state.original) });
  } catch { /* The native editor may already be destroyed. */ }
}
