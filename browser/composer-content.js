const fileTypes = {
  py: ['python', 'Python', '#8ab5e0'], pyw: ['python', 'Python', '#8ab5e0'],
  js: ['javascript', 'JavaScript', '#eed86b'], jsx: ['javascript', 'JavaScript', '#eed86b'], mjs: ['javascript', 'JavaScript', '#eed86b'], cjs: ['javascript', 'JavaScript', '#eed86b'],
  ts: ['typescript', 'TypeScript', '#72aeea'], tsx: ['typescript', 'TypeScript', '#72aeea'],
  go: ['go', 'Go', '#63cbdc'], rs: ['rust', 'Rust', '#e5aa87'],
  c: ['c', 'C', '#92b9ed'], h: ['c', 'C header', '#92b9ed'],
  cpp: ['cplusplus', 'C++', '#92b9ed'], cc: ['cplusplus', 'C++', '#92b9ed'], cxx: ['cplusplus', 'C++', '#92b9ed'], hpp: ['cplusplus', 'C++ header', '#92b9ed'],
  md: ['markdown', 'Markdown', '#b8c7de'], markdown: ['markdown', 'Markdown', '#b8c7de'],
  pdf: [null, 'PDF', '#ed939f'], txt: [null, 'Text', '#b3bac8'],
  docx: [null, 'Word document', '#85afe8'], doc: [null, 'Word document', '#85afe8'],
  odt: [null, 'OpenDocument', '#91c9ac'],
};
export function filePresentation(name) {
  const extension = name.split('.').at(-1)?.toLowerCase() || '';
  const [icon, label, color] = fileTypes[extension] || [null, 'File', '#b3bac8'];
  return { extension, icon, label, color };
}
export function draftLinks(text) {
  const links = [], seen = new Set();
  for (const match of text.matchAll(/https?:\/\/[^\s<>"`]+/g)) {
    if (links.length === 8) break;
    let raw = match[0].replace(/[.,;!?]+$/, '');
    while (raw.endsWith(')') && (raw.match(/\)/g)?.length || 0) > (raw.match(/\(/g)?.length || 0)) raw = raw.slice(0, -1);
    try {
      const url = new URL(raw);
      if (url.username || url.password || seen.has(url.href)) continue;
      seen.add(url.href);
      const parts = url.pathname.split('/').filter(Boolean);
      const github = url.hostname === 'github.com' && parts.length >= 2 && parts.slice(0, 2).every(part => /^[\w.-]+$/.test(part));
      const label = github ? `${parts[0]}/${parts[1].replace(/\.git$/, '')}` : `${url.hostname}${url.pathname === '/' ? '' : url.pathname}`;
      links.push({ href: url.href, label, github });
    } catch { /* An incomplete URL remains ordinary draft text. */ }
  }
  return links;
}
export function decorateComposerContent(root) {
  if (root.host?.localName !== 'prompt-editor') return;
  if (document.documentElement.dataset.piWebTheme !== 'vitesse:black') { clearComposerContent(root); return; }
  for (const chip of root.querySelectorAll('.attachment-chip-file')) {
    const name = chip.getAttribute('title') || chip.querySelector('.attachment-file-name')?.textContent || '';
    const type = filePresentation(name), preview = chip.querySelector('.attachment-file-preview');
    if (!preview) continue;
    const key = `${name}:${type.icon}`;
    if (chip.dataset.studioFileKey === key) continue;
    chip.dataset.studioFileKey = key;
    preview.querySelector('.studio-file-badge')?.remove();
    const badge = document.createElement('span');badge.className = 'studio-file-badge';badge.setAttribute('aria-hidden', 'true');
    badge.style.color = type.color;
    if (type.icon) { badge.dataset.icon = type.icon;badge.style.setProperty('--studio-file-icon', `url("${new URL(`./file-icons/${type.icon}.svg`, import.meta.url).href}")`); }
    else badge.textContent = type.extension.toUpperCase().slice(0, 4) || 'FILE';
    preview.append(badge);
    let meta = chip.querySelector('.studio-file-meta');
    if (!meta) { meta = document.createElement('span');meta.className = 'studio-file-meta';meta.setAttribute('aria-hidden', 'true');chip.append(meta); }
    meta.textContent = type.label;
  }
  const editor = root.host.view;
  const links = draftLinks(editor?.state?.doc?.toString() || '');
  let tray = root.querySelector('.studio-draft-links');
  if (!links.length) { tray?.remove(); return; }
  const signature = JSON.stringify(links);
  if (tray?.dataset.signature === signature) return;
  if (!tray) { tray = document.createElement('div');tray.className = 'studio-draft-links';tray.setAttribute('aria-label', 'Links in your draft');root.querySelector('.editor-wrap')?.insertBefore(tray, root.querySelector('.markdown-editor')); }
  tray.dataset.signature = signature;
  tray.replaceChildren();
  for (const link of links) {
    const anchor = document.createElement('a');anchor.href = link.href;anchor.target = '_blank';anchor.rel = 'noopener noreferrer';anchor.title = link.href;
    const icon = document.createElement('span');icon.className = 'studio-draft-link-icon';icon.setAttribute('aria-hidden', 'true');
    if (link.github) { icon.dataset.github = '';icon.style.setProperty('--studio-file-icon', `url("${new URL('./file-icons/github.svg', import.meta.url).href}")`); }
    else icon.textContent = '↗';
    const label = document.createElement('span');label.textContent = link.label;
    anchor.append(icon, label);tray.append(anchor);
  }
}
export function clearComposerContent(root) {
  root.querySelector('.studio-draft-links')?.remove();
  root.querySelectorAll('.studio-file-badge, .studio-file-meta').forEach(node => node.remove());
  root.querySelectorAll('[data-studio-file-key]').forEach(node => delete node.dataset.studioFileKey);
}
