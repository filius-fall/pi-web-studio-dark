// Compact mobile controls delegate navigation and model choices to Pi Web.
function text(element, value) { if (element.textContent !== value) element.textContent = value; }
function button(label, icon) {
  const b = document.createElement('button');b.type = 'button';b.title = label;b.setAttribute('aria-label', label);
  if (icon) b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icon}"/></svg>`;
  else b.textContent = label;
  return b;
}
export function createMobilePresentation() {
  const roots = new Set(), focused = new WeakSet(), waiters = new Set();
  let disposed = false;
  function decorate(root) {
    if (disposed) return;
    if (root.host?.localName === 'prompt-editor') {
      const p = root.host;
      if (!focused.has(p) && p.editor && root.querySelector(".cm-content")) {
        focused.add(p);
        function focusWhenVisible() {
          if (disposed || !p.isConnected || document.documentElement.dataset.piWebTheme !== 'vitesse:black') return;
          if (document.documentElement.hasAttribute('data-studio-loading')) {
            const waiter = new MutationObserver(() => {
              if (document.documentElement.hasAttribute('data-studio-loading')) return;
              waiter.disconnect();waiters.delete(waiter);requestAnimationFrame(focusWhenVisible);
            });
            waiters.add(waiter);waiter.observe(document.documentElement, { attributes: true, attributeFilter: ['data-studio-loading'] });return;
          }
          p.editor?.requestMeasure();
          // Avoid raising the phone keyboard or taking focus from another control.
          let current = document.activeElement;
          while (current?.shadowRoot?.activeElement) current = current.shadowRoot.activeElement;
          if (innerWidth > 760 && (navigator.maxTouchPoints === 0 || matchMedia('(pointer: fine)').matches) && (!current || current === document.body)) p.focusInput?.();
        }
        document.fonts.ready.then(() => requestAnimationFrame(focusWhenVisible));
      }
      return;
    }
    if (root.host?.localName !== 'app-context-bar') return;
    roots.add(root);
    const context = root.host, appRoot = context.getRootNode(), app = appRoot.host;
    let header = root.querySelector('.studio-mobile-header');
    if (!header) {
      header = document.createElement('div');header.className = 'studio-mobile-header';
      const back = button('Home', 'M19 12H5m7-7-7 7 7 7'), location = button('Choose session');location.className = 'studio-mobile-location';
      const title = document.createElement('strong'), subtitle = document.createElement('small');location.replaceChildren(title, subtitle);
      const files = button('Files', 'M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3Z'), more = button('Session options', 'M12 5h.01M12 12h.01M12 19h.01');more.setAttribute('aria-expanded', 'false');more.setAttribute('aria-controls', 'studio-mobile-menu');
      const menu = document.createElement('div');menu.className = 'studio-mobile-menu';menu.id = 'studio-mobile-menu';menu.hidden = true;menu.setAttribute('role', 'group');menu.setAttribute('aria-label', 'Session options');
      const close = () => { menu.hidden = true;more.setAttribute('aria-expanded', 'false'); };
      back.onclick = () => { close();app.selectNavigationTab?.('navigation'); };
      location.onclick = () => { close();context.onOpenSection?.('sessions'); };
      files.onclick = () => { close();const tab = app.availableNavigationTabs?.().find(tab => tab.label === 'Files');if (tab) app.selectNavigationTab?.(tab.id); };
      more.onclick = () => { menu.hidden = !menu.hidden;more.setAttribute('aria-expanded', String(!menu.hidden));if (!menu.hidden) menu.querySelector('button')?.focus(); };
      header.addEventListener('keydown', event => { if (event.key === 'Escape') { close();more.focus(); } });
      header.addEventListener('focusout', () => queueMicrotask(() => { if (!header.contains(root.activeElement)) close(); }));
      const entries = [
        ['Chat', () => app.selectNavigationTab?.('chat')],
        ['Model', () => appRoot.querySelector('prompt-editor')?.shadowRoot?.querySelector('.select-model')?.click()],
        ['Reasoning', () => appRoot.querySelector('prompt-editor')?.shadowRoot?.querySelector('.select-thinking')?.click()],
        ['Machine', () => context.onOpenSection?.('machines')],
        ['Project', () => context.onOpenSection?.('projects')],
        ['Workspace', () => context.onOpenSection?.('workspaces')],
        ['Navigation', () => app.showNavigation?.()],
        ['Actions', () => context.onShowActions?.()]
      ];
      for (const [label, action] of entries) {
        const b = button(label);b.dataset.action = label;b.onclick = () => { close();action(); };menu.append(b);
      }
      const homeIcon = document.createElement('img');homeIcon.className = 'studio-mobile-home-icon';homeIcon.src = new URL('./pi-icon.svg', import.meta.url).href;homeIcon.alt = '';
      header.append(homeIcon, back, location, files, more, menu);root.append(header);
    }
    const title = header.querySelector('strong'), subtitle = header.querySelector('small');
    const view = app.effectiveMainView?.(), tool = app.effectiveWorkspaceTool?.();
    const home = view === 'navigation';
    header.querySelector('[aria-label="Home"]').hidden = home;header.querySelector('.studio-mobile-home-icon').hidden = !home;
    const location = header.querySelector('.studio-mobile-location');location.setAttribute('aria-label', home ? 'Choose machine' : 'Choose session');location.onclick = () => context.onOpenSection?.(home ? 'machines' : 'sessions');
    const heading = home ? 'Pi Web' : view === 'workspace' ? (app.availableNavigationTabs?.().find(tab => tab.id === tool)?.label || 'Workspace') : context.session?.name || 'New session';
    text(title, heading);title.title = heading;
    text(subtitle, home ? 'Your machines and sessions' : [context.project?.name, context.machine?.name].filter(Boolean).join(' · ') || 'Pi Web');
    const panel = appRoot.querySelector('.mobile-navigation-panel');
    if (panel && !panel.querySelector('.studio-mobile-home-intro')) {
      const intro = document.createElement('div');intro.className = 'studio-mobile-home-intro';
      const heading = document.createElement('strong'), hint = document.createElement('p');heading.textContent = 'Your workspace';hint.textContent = 'Choose a machine, project, or session to continue.';intro.append(heading, hint);panel.prepend(intro);
    }
    header.querySelector('[aria-label="Files"]').disabled = !context.workspace || !app.availableNavigationTabs?.().some(tab => tab.label === 'Files');
    const p = appRoot.querySelector('prompt-editor');
    const model = p?.shadowRoot?.querySelector('.select-model')?.dataset.studioLabel;
    const reasoning = p?.shadowRoot?.querySelector('.select-thinking')?.dataset.studioReasoning;
    for (const [name, label, available] of [['Model', model ? `Model · ${model}` : 'Model', !!p], ['Reasoning', reasoning || 'Reasoning', !!p]]) {
      const b = header.querySelector(`[data-action="${name}"]`);text(b, label);b.disabled = !available;
    }
  }
  return { decorate, clear(root) { roots.delete(root);root.querySelector('.studio-mobile-header')?.remove(); }, dispose() { disposed = true;for (const waiter of waiters) waiter.disconnect();waiters.clear();for (const root of roots) { root.querySelector('.studio-mobile-header')?.remove();root.host.getRootNode().querySelector('.studio-mobile-home-intro')?.remove(); }roots.clear(); } };
}
