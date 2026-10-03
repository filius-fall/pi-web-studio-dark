import { chromium } from 'playwright';
import { realpath } from 'node:fs/promises';

const stateKey = Symbol.for('pi-web.studio-preview.v1');
const shared = globalThis[stateKey] ||= { browser: null, launching: null, sessions: new Map() };
const MAX_SESSIONS = 4;
const actions = new Set(['status','frame','open','inspect','click','fill','type','press','scroll','resize','screenshot','back','forward','reload','evaluate','close']);
const IDLE_MS = 10 * 60 * 1000;

export function browserUrl(value) {
  if (typeof value !== 'string' || value.length > 4096) throw new Error('Enter a web URL shorter than 4096 characters.');
  let text = value.trim();
  if (!text || (/^[a-z][a-z0-9+.-]*:/i.test(text) && !/^https?:/i.test(text) && !/^(localhost|127\.0\.0\.1):\d+/i.test(text))) throw new Error('Only HTTP or HTTPS pages are supported.');
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(text)) text = `${/^(localhost|127\.0\.0\.1|\[::1\])(?::|\/|$)/.test(text) ? 'http' : 'https'}://${text}`;
  const url = new URL(text);
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) throw new Error('Only HTTP or HTTPS pages without embedded credentials are supported.');
  return url.href;
}
function integer(value, fallback, min, max) {
  const result = value ?? fallback;
  if (!Number.isInteger(result) || result < min || result > max) throw new Error(`Expected a whole number from ${min} to ${max}.`);
  return result;
}
async function browser() {
  if (shared.browser?.isConnected()) return shared.browser;
  if (!shared.launching) {
    shared.launching = chromium.launch({ headless: true }).then(instance => {
      shared.browser = instance;
      instance.on('disconnected', () => { shared.browser = null;shared.sessions.clear(); });
      return instance;
    }).finally(() => { shared.launching = null; });
  }
  return shared.launching;
}
async function keyFor(scope) {
  if (!scope || typeof scope.cwd !== 'string' || typeof scope.sessionId !== 'string' || !scope.sessionId || scope.sessionId.length > 200) throw new Error('Select a saved Pi session before opening its browser.');
  return `${await realpath(scope.cwd)}\0${scope.sessionId}`;
}
function clearRefs(session) {
  for (const handle of session.refs.values()) void handle.dispose().catch(() => {});
  session.refs.clear();
}
async function remove(key, session) {
  if (shared.sessions.get(key) === session) shared.sessions.delete(key);clearRefs(session);clearTimeout(session.idleTimer);
  await session.context.close();
}
async function getUnlocked(scope, create = false) {
  const key = await keyFor(scope);
  for (const [oldKey, session] of shared.sessions) if (Date.now() - session.used > IDLE_MS) await remove(oldKey, session);
  let session = shared.sessions.get(key);
  if (!session && create) {
    if (shared.sessions.size >= MAX_SESSIONS) throw new Error('Four preview browsers are already open. Close an unused preview first.');
    const context = await (await browser()).newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: false });
    const page = await context.newPage();
    session = { context, page, used: Date.now(), refs: new Map(), generation: 0, logs: [], queue: Promise.resolve() };
    page.setDefaultTimeout(5000);page.setDefaultNavigationTimeout(7000);
    const log = entry => { session.logs.push(entry);if (session.logs.length > 100) session.logs.shift(); };
    page.on('console', message => log({ type: message.type(), text: message.text().slice(0, 2000) }));
    page.on('pageerror', error => log({ type: 'error', text: error.message.slice(0, 2000) }));
    page.on('framenavigated', frame => { if (frame === page.mainFrame()) clearRefs(session); });
    page.on('popup', popup => { log({ type: 'info', text: 'A popup was blocked. Open its URL explicitly in Preview.' });void popup.close(); });
    shared.sessions.set(key, session);
  }
  if (session) {
    session.used = Date.now();clearTimeout(session.idleTimer);
    session.idleTimer = setTimeout(() => { void session.queue.catch(() => {}).then(() => remove(key, session)).then(async () => { if (!shared.sessions.size) await shared.browser?.close(); }).catch(() => {}); }, IDLE_MS);
    session.idleTimer.unref();
  }
  return { key, session };
}
async function get(scope, create) {
  const previous = shared.admission || Promise.resolve();
  const next = previous.catch(() => {}).then(() => getUnlocked(scope, create));
  shared.admission = next;return next;
}
async function inspect(session) {
  clearRefs(session);const generation = ++session.generation;
  const elements = [];
  const handles = await session.page.locator('a[href],button,input:not([type=hidden]),textarea,select,[role="button"],[role="link"],[role="textbox"],[contenteditable="true"]').elementHandles();
  for (const handle of handles) {
    if (elements.length >= 150 || !await handle.isVisible()) { await handle.dispose();continue; }
    const info = await handle.evaluate(element => ({
      tag: element.tagName.toLowerCase(), role: element.getAttribute('role'),
      name: (element.getAttribute('aria-label') || element.labels?.[0]?.innerText || element.getAttribute('placeholder') || element.innerText || element.getAttribute('title') || '').trim().slice(0, 160),
      type: element.getAttribute('type'), disabled: Boolean(element.disabled),
    }));
    const ref = `s${generation}e${elements.length + 1}`;session.refs.set(ref, handle);elements.push({ ref, ...info });
  }
  const text = await session.page.locator('body').innerText().catch(() => '');
  return { url: session.page.url(), title: await session.page.title(), viewport: session.page.viewportSize(), text: text.slice(0, 16000), elements, console: session.logs.slice(-20) };
}
async function target(session, input) {
  if (typeof input.ref === 'string') {
    const handle = session.refs.get(input.ref);
    if (!handle) throw new Error('This element reference is stale. Inspect the page again.');
    return handle;
  }
  if (typeof input.selector === 'string' && input.selector.length <= 500) {
    const locator = session.page.locator(input.selector);
    if (await locator.count() !== 1) throw new Error('The selector must identify exactly one element. Inspect the page for a unique reference.');
    return locator;
  }
  throw new Error('Supply a reference from inspect or a unique CSS selector.');
}
export async function runBrowser(scope, action, input = {}, signal) {
  signal?.throwIfAborted();
  const controller=new AbortController(),abort=()=>controller.abort(signal.reason);
  signal?.addEventListener('abort',abort,{once:true});
  let timer;
  const deadline=new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new Error('Browser action timed out. Reopen the preview and try again.'));},8500);});
  try { return await Promise.race([runScopedBrowser(scope,action,input,controller.signal),deadline]); }
  finally { clearTimeout(timer);signal?.removeEventListener('abort',abort); }
}
async function runScopedBrowser(scope, action, input, signal) {
  signal?.throwIfAborted();
  if (!actions.has(action)) throw new Error('Unknown browser action.');
  const { key, session } = await get(scope, action === 'open');
  if(signal.aborted){if(session)await remove(key,session).catch(()=>{});signal.throwIfAborted();}
  if (!session) {
    if (action === 'status' || action === 'frame') return { open: false };
    throw new Error('No browser is open for this session. Use open with a URL first.');
  }
  const invalidate = () => { void remove(key, session).catch(() => {}); };
  signal?.addEventListener('abort', invalidate, { once: true });
  const task = session.queue.catch(() => {}).then(async () => {
    signal?.throwIfAborted();
    const page = session.page;
    switch (action) {
      case 'status': return { open: true, url: page.url(), viewport: page.viewportSize() };
      case 'frame': {
        const buffer = await page.screenshot({ type: 'jpeg', quality: 55, timeout: 5000 });
        if (buffer.length > 900000) throw new Error('Preview frame exceeds the image limit. Reduce the viewport size.');
        return { open: true, url: page.url(), viewport: page.viewportSize(), mimeType: 'image/jpeg', data: buffer.toString('base64') };
      }
      case 'open': await page.goto(browserUrl(input.url), { waitUntil: 'domcontentloaded' });break;
      case 'reload': await page.reload({ waitUntil: 'domcontentloaded' });break;
      case 'back': await page.goBack({ waitUntil: 'domcontentloaded' });break;
      case 'forward': await page.goForward({ waitUntil: 'domcontentloaded' });break;
      case 'inspect': return inspect(session);
      case 'click':
        if (input.x !== undefined || input.y !== undefined) await page.mouse.click(integer(input.x, 0, 0, page.viewportSize().width - 1), integer(input.y, 0, 0, page.viewportSize().height - 1));
        else await (await target(session, input)).click();
        break;
      case 'fill':
        if (typeof input.text !== 'string' || input.text.length > 20000) throw new Error('Fill requires text of at most 20000 characters.');
        await (await target(session, input)).fill(input.text);break;
      case 'type':
        if (typeof input.text !== 'string' || input.text.length > 20000) throw new Error('Type requires text of at most 20000 characters.');
        await page.keyboard.insertText(input.text);break;
      case 'press':
        if (typeof input.key !== 'string' || input.key.length > 80) throw new Error('Supply a keyboard key such as Enter or Control+A.');
        await page.keyboard.press(input.key);break;
      case 'scroll': await page.mouse.wheel(integer(input.x, 0, -2000, 2000), integer(input.y, 500, -2000, 2000));break;
      case 'resize': await page.setViewportSize({ width: integer(input.width, 1280, 320, 1920), height: integer(input.height, 800, 320, 1200) });break;
      case 'screenshot': {
        const buffer = await page.screenshot({ type: 'png', fullPage: input.fullPage === true, timeout: 10000 });
        if (buffer.length > 4000000) throw new Error('Screenshot exceeds 4 MB. Capture the visible viewport instead.');
        return { url: page.url(), mimeType: 'image/png', data: buffer.toString('base64') };
      }
      case 'evaluate':
        if (typeof input.script !== 'string' || input.script.length > 20000) throw new Error('Supply a page JavaScript expression of at most 20000 characters.');
        { const value = (await page.evaluate(input.script)) ?? null;
        if (JSON.stringify(value).length > 50000) throw new Error('Return a smaller page result.');
        return { value }; }
      case 'close': await remove(key, session);
        { const next=(shared.admission||Promise.resolve()).catch(()=>{}).then(async()=>{if(!shared.sessions.size)await shared.browser?.close();});shared.admission=next;await next; }
        return { open: false };
      default: throw new Error('Unknown browser action.');
    }
    clearRefs(session);
    return { open: true, url: page.url(), viewport: page.viewportSize() };
  });
  session.queue = task;
  try { return await task; }
  finally { signal?.removeEventListener('abort', invalidate); }
}
export async function closeAll() {
  for (const [key, session] of shared.sessions) await remove(key, session).catch(() => {});
  await shared.browser?.close();shared.browser = null;
}
