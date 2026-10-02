import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { theme } from '../browser/index.js';
const args = process.argv.slice(2);
const index = args.indexOf('--html');
if (index < 0 || !args[index + 1]) {
  console.error('Usage: node scripts/install-startup.mjs --html /path/to/pi-web/dist/client/index.html [--remove]');
  process.exit(1);
}
const path = resolve(args[index + 1]);
const original = await readFile(path, 'utf8');
const begin = '<!-- studio-dark-startup -->';
const end = '<!-- /studio-dark-startup -->';
const pattern = /\n[ \t]*<!-- studio-dark-startup -->[\s\S]*?<!-- \/studio-dark-startup -->\n?/g;
const clean = original.replace(pattern, '');
if (!clean.includes('<pi-web-app>') || !clean.includes('<script type="module"')) throw new Error('Unsupported Pi Web client HTML; no changes made.');
const remove = args.includes('--remove');
const block = `\n    ${begin}
    <style>
      html[data-studio-loading] { background: #121212; color-scheme: dark; }
      html[data-studio-loading] body { background: #121212; }
      html[data-studio-loading] pi-web-app { visibility: hidden; }
    </style>
    <script>
      (() => {
        try {
          const preference = JSON.parse(localStorage.getItem('pi-web-app-theme') || 'null');
          if (preference?.themeId !== 'vitesse:black') return;
          const root = document.documentElement;
          root.dataset.studioLoading = '';
          root.dataset.piWebTheme = 'vitesse:black';
          for (const [key, value] of Object.entries(${JSON.stringify(theme.tokens)})) root.style.setProperty(key, value);
          // Fail open if the plugin is removed or fails to load.
          setTimeout(() => root.removeAttribute('data-studio-loading'), 4000);
        } catch { /* Storage may be disabled. */ }
      })();
    </script>
    ${end}\n`;
const updated = remove ? clean : clean.replace('    <script type="module"', block + '    <script type="module"');
if (updated !== original) {
  // Preserve the original on the first installation; repeat installs are idempotent.
  if (!remove && !original.includes(begin)) await writeFile(path + '.studio-dark-backup', original, { flag: 'wx' }).catch(error => { if (error.code !== 'EEXIST') throw error; });
  await writeFile(path, updated);
}
console.log(`${remove ? 'Removed' : 'Installed'} Studio Dark startup hook: ${path}`);
