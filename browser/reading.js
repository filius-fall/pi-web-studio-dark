// Label native code panels without changing their code or copy controls.
export function decorateReading(root) {
  if (root.host?.localName !== 'formatted-text') return;
  const names = { sh: 'Shell', bash: 'Bash', shell: 'Shell', js: 'JavaScript', javascript: 'JavaScript', ts: 'TypeScript', typescript: 'TypeScript', py: 'Python', python: 'Python', json: 'JSON', yaml: 'YAML', yml: 'YAML', html: 'HTML', css: 'CSS', sql: 'SQL', md: 'Markdown', markdown: 'Markdown', text: 'Plain text', plaintext: 'Plain text', diff: 'Diff' };
  for (const wrapper of root.querySelectorAll('.code-block-wrapper')) {
    const code = wrapper.querySelector('pre > code');
    const language = [...(code?.classList ?? [])].find(name => name.startsWith('language-'))?.slice(9);
    const label = language ? names[language.toLowerCase()] || language : 'Code';
    if (wrapper.dataset.studioLanguage !== label) wrapper.dataset.studioLanguage = label;
  }
}
