#!/usr/bin/env node
import { lstat, mkdir, readFile, realpath, symlink } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const source = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
function option(name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error(`${name} requires a path.`);
  return args[index + 1];
}
async function findHtml() {
  const supplied = option('--html');
  if (supplied) return resolve(supplied);
  // Follow the installed CLI first, so the startup hook uses its Node installation.
  for (const directory of (process.env.PATH || '').split(process.platform === 'win32' ? ';' : ':')) {
    try {
      let path = dirname(await realpath(join(directory, 'pi-web')));
      for (let count = 0; count < 6; count++) {
        try {
          const pkg = JSON.parse(await readFile(join(path, 'package.json'), 'utf8'));
          if (pkg.name === '@jmfederico/pi-web') return join(path, 'dist/client/index.html');
        } catch { /* Continue looking up the CLI's package directory. */ }
        const parent = dirname(path);if (parent === path) break;path = parent;
      }
    } catch { /* This PATH entry has no Pi Web CLI. */ }
  }
  try {
    const { stdout } = await run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['root', '-g']);
    const path = join(stdout.trim(), '@jmfederico/pi-web');
    const pkg = JSON.parse(await readFile(join(path, 'package.json'), 'utf8'));
    if (pkg.name === '@jmfederico/pi-web') return join(path, 'dist/client/index.html');
  } catch { /* Custom package installations can supply --html. */ }
}
async function main() {
  if (args.includes('--help')) {
    console.log('Usage: node scripts/install.mjs [--data-dir PATH] [--html PATH] [--no-startup]\nCreates the Studio Dark plugin link and installs the startup theme fix when Pi Web is found.');
    return;
  }
  const known = new Set(['--data-dir', '--html', '--no-startup']);
  for (let index = 0; index < args.length; index++) {
    if (!known.has(args[index])) throw new Error(`Unknown option: ${args[index]}`);
    if (args[index] !== '--no-startup') { option(args[index]);index++; }
  }
  const data = resolve(option('--data-dir') || process.env.PI_WEB_DATA_DIR || join(homedir(), '.pi-web'));
  const plugins = join(data, 'plugins'), target = join(plugins, 'vitesse');
  let existing;
  try { existing = await lstat(target); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (existing) {
    const same = existing.isSymbolicLink() && await realpath(target).catch(() => '') === await realpath(source);
    if (!same) throw new Error(`Another plugin already exists at ${target}. Update that installation or remove its link before retrying; nothing was overwritten.`);
    console.log(`Plugin already installed: ${target}`);
  } else {
    await mkdir(plugins, { recursive: true });
    await symlink(source, target, process.platform === 'win32' ? 'junction' : 'dir');
    console.log(`Installed Studio Dark: ${target}`);
  }
  if (!args.includes('--no-startup')) {
    const html = await findHtml();
    if (html) {
      try {
        const { stdout } = await run(process.execPath, [join(source, 'scripts/install-startup.mjs'), '--html', html]);
        console.log(stdout.trim());
      } catch (error) {
        console.warn(`Theme installed, but the optional startup fix was not applied: ${error.stderr?.trim() || error.message}`);
        console.warn('Use --html with your installed Pi Web client index.html, or --no-startup to skip it.');
      }
    } else console.log('Theme installed. Pi Web client HTML was not detected; the optional startup fix was skipped. Use --html PATH for a custom installation.');
  }
  console.log('Reload Pi Web, then choose Actions → Select Theme → Studio Dark. On mobile, use Session options → Actions. Select the theme once in each browser.');
}
main().catch(error => { console.error(error.message);process.exitCode = 1; });
