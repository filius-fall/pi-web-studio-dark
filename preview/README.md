# Studio Preview

An optional Pi package and Pi Web plugin. Its isolated Chromium browser is shared
between the **Preview** workspace panel and the agent’s `web_preview` tool.
It runs on the selected machine, so `localhost` refers to that machine. The panel
shows screenshot frames; it works through Pi Web’s authenticated local/federated
plugin transport without exposing another HTTP port.

From the theme checkout, install on each machine where agents should browse:

```sh
node scripts/install-preview.mjs
```

For a non-default Pi Web data directory:

```sh
node scripts/install-preview.mjs --data-dir /path/to/pi-web-data
```

This opt-in installer uses `npm ci` with the checked-in lockfile, downloads
Playwright Chromium, registers this local Pi package using `pi install`, and
advertises the `studio-preview` panel through the installed package. It removes
only its own verified legacy plugin link to avoid duplicate discovery.
The theme installer alone does not install a browser or agent tools.

Enable **Studio Preview** in Pi Web’s native plugin settings. If your Pi Web
instance uses a separate agent profile, install this checkout’s `preview` directory
through its native package manager too. Reload Pi Web and choose **Actions → Open Web Preview**, or the **Preview**
workspace tab. If Pi Web reports an inactive backend, use its normal server
session-daemon restart when sessions are idle; a browser reload alone cannot
activate a server plugin. A new Pi session discovers `web_preview`;
existing sessions may require their native extension reload. Do not restart
active sessions or change provider configuration merely to activate this plugin.
Keep this checkout in place while installed.

Enter a running app URL and click **Open**. Click the page to interact, scroll to
move through it, and use the typing field/Enter control for text input. Keyboard
navigation works when the preview has focus. The toolbar supports back, forward,
reload, desktop/mobile viewports, downloading a screenshot, and closing the
browser. The panel polls while visible; hidden panels stop capturing frames.

The agent can open, inspect, click, fill, type, press keys, scroll, resize,
evaluate page JavaScript, capture screenshots, and close its browser:

```json
{"action":"open","url":"http://localhost:3000"}
```

```json
{"action":"inspect"}
```

Use returned element references for `click`/`fill`. References expire after
navigation or interaction, so inspect again. A unique CSS selector is also
accepted. Screenshots return image content directly to the agent. Page text,
console output, results, image sizes, and action durations are bounded.

Browsers are isolated by canonical workspace and Pi session ID. They use fresh
profiles, never the user’s personal cookies. Popups are closed and downloads
are disabled. Four contexts can be open at once; unused contexts close after
ten minutes. Chromium launches only on the first explicit open. This feature
adds browser CPU/memory use and disk space; it is separate from theme overhead.
Remote machines need Chromium’s OS libraries installed using their normal system
package manager. The installer never escalates privileges to install them.

Validation: `node preview/test.mjs` runs a local fixture and checks shared
panel/tool state, inspection, clicking/filling, screenshots, viewport changes,
session isolation, URL restrictions, cancellation, and closing. No model calls
or external website submissions are needed.

Dependencies are installed rather than redistributed in this repository:
Playwright/Playwright Core 1.63.0 (Apache-2.0), TypeBox 1.3.34 (MIT).
Their package distributions contain the applicable licenses/notices. Chromium
is downloaded by Playwright under its own third-party terms. Original plugin
code uses this repository’s MIT license.
