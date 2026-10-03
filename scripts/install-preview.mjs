#!/usr/bin/env node
// Optional browser package; the ordinary theme installer stays dependency-free.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { lstat, realpath, unlink } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
const run=promisify(execFile),source=resolve(dirname(fileURLToPath(import.meta.url)),'../preview');
const args=process.argv.slice(2);
if(args.includes('--help')){console.log('Usage: node scripts/install-preview.mjs [--data-dir PATH]\nInstalls optional Chromium/browser dependencies, registers the Pi companion package, and registers the Pi Web panel. Activate server plugins when Pi Web is idle.');process.exit(0);}
let data=process.env.PI_WEB_DATA_DIR||join(homedir(),'.pi-web');
if(args.length){if(args.length!==2||args[0]!=='--data-dir')throw Error('Use --data-dir PATH.');data=resolve(args[1]);}
const target=join(data,'plugins/studio-preview');
try{const info=await lstat(target);if(!info.isSymbolicLink()||await realpath(target)!==await realpath(source))throw Error('A different Studio Preview plugin already exists; it was left untouched.');}catch(error){if(error.code!=='ENOENT')throw error;}
for(const [command,params] of [['npm',['ci','--prefix',source,'--ignore-scripts']],['node',[join(source,'node_modules/playwright/cli.js'),'install','chromium']],['pi',['install',source]]]){
  const result=await run(command,params,{maxBuffer:4*1024*1024});if(result.stdout.trim())console.log(result.stdout.trim());if(result.stderr.trim())console.error(result.stderr.trim());
}
// Installed Pi packages already advertise their Pi Web plugins. A second link
// creates a discovery conflict. Remove only our own verified legacy link.
try { if (await realpath(target) === await realpath(source)) await unlink(target); } catch (error) { if (error.code !== 'ENOENT') throw error; }
console.log('Studio Preview installed. Reload Pi Web; activate server plugins when sessions are idle. Start a new Pi session to discover web_preview. Provider settings and existing sessions were preserved.');
