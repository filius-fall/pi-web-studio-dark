# Studio Dark for Pi Web

Dark appearance and compact layout for Pi Web v1.202610.0.

A local browser plugin for [Pi Web](https://pi-web.dev). It changes presentation and
layout while preserving Pi Web's agent, sessions, and provider configuration.

- Official Pi browser tab icon, served locally with the plugin.
- DM Sans, near-black navigation, dark-gray chat, white text, and blue working indicators.
- Flat assistant messages, neutral user messages, compact expandable events and tool calls.
- Tool calls use one compact row with a status icon, truncated command, and inline down/up chevron. Click the row to reveal the full command and output; diffs keep their native controls.
- Project badges, clear session cards, hover/focus menus, and working/unread/age indicators.
- Compact navigation rows; Projects and Workspaces size to content, Sessions fills the remaining space.
- Desktop workspace pane initially closed, with your open/closed preference remembered per browser, reopened with Files & terminal or the native edge toggle.
- Bounded, scrollable notification tray preserves full warning content.
- Aligned status icons, blue tool-call spinners, and a slow moving highlight across running tool text.
- Active thinking and working indicators, gentle entry and details animations, with reduced-motion support.
- Compact model picker with provider logos, readable names, current-model badges, and native default controls.
- One rounded composer panel with model and reasoning labels, attachments, send, and stop controls.
- Active tools expand their command/output, then collapse on completion; manually expanded calls keep your choice.
- Working/thinking status appears below the latest response; informational session updates stay out of the composer.
- Vertical conversation-position ticks replace the horizontal meter.
- Thin scrollbars, readable metadata, and responsive padding.

## Screenshots

Screenshots use sample projects and conversation content.

![Desktop chat with compact tool calls](docs/screenshots/desktop.png)

Expanded tool command and output:

![Expanded tool details](docs/screenshots/tool-details.png)

Model selection with provider logos and current/default indicators:

![Model picker](docs/screenshots/model-picker.png)

## Install

Requires an existing Pi Web installation with plugin API v4. Tested with
Pi Web `1.202610.0` in Chromium at desktop and phone widths. Other browser
engines are not yet validated; the stylesheet uses `:host-context`.

```sh
git clone <repository-url> "$HOME/pi-web-studio-dark"
mkdir -p "$HOME/.pi-web/plugins"
ln -s "$HOME/pi-web-studio-dark" "$HOME/.pi-web/plugins/vitesse"
```

Replace `<repository-url>` with this repository's clone URL.

If `PI_WEB_DATA_DIR` is set, use its `plugins` directory instead of
`~/.pi-web/plugins`. If a `vitesse` plugin is already installed, update that
installation rather than overwriting its link.

No build step, npm install, or session-daemon restart is needed. Reload Pi Web,
then choose **Actions → Select Theme → Studio Dark**.

Existing Vitesse Black selections use this update automatically
(the theme ID remains `vitesse:black`). New browsers: Actions → Select Theme →
Studio Dark. Theme choice and panel preference are browser-local.

Install on each gateway whose URL you use directly. Theme selection is saved
per browser and gateway URL; select it once on your phone too.

### Avoid the initial theme flash

The optional startup hook applies the selected palette before the app renders,
then reveals the shell after the plugin and font are ready. It only runs when
Studio Dark is already selected in that browser. On each gateway:

```sh
node scripts/install-startup.mjs --html /path/to/pi-web/dist/client/index.html
```

Use the `dist/client/index.html` inside your installed `@jmfederico/pi-web`
package. The installer keeps a backup and can be repeated. Reapply this hook
after updating Pi Web. Remove it with the same command plus `--remove`.
If the plugin fails to load, the normal app becomes visible after four seconds.

## Update and remove

```sh
git -C "$HOME/pi-web-studio-dark" pull --ff-only
```

Reload Pi Web after updating. To uninstall, remove only the plugin link and
reload:

```sh
unlink "$HOME/.pi-web/plugins/vitesse"
```

## Compatibility and licenses

This uses the theme API and a scoped browser presentation layer. CSS classes
and the panel-toggle labels must be reviewed after Pi Web upgrades.
The optional startup hook adds a small pre-paint block to the installed client HTML; no server execution code is changed. Provider settings and
session data are not changed. Disposal removes styles, observers, font, and
injected controls. Disconnected message roots are released by the observer.

DM Sans is served locally under the included SIL OFL license. Earlier palette
versions are preserved in browser/index.before-contrast.js and
browser/index.before-studio.js. The plugin is MIT licensed; palette attribution
and font licenses are in `LICENSE.vitesse` and `LICENSE.dm-sans`.

The browser tab icon is the upstream [Pi favicon](https://pi.dev/favicon.svg),
provided through the [Pi brand assets](https://pi.dev/press-kit).

Provider logos are bundled from Lobe Icons static SVG package v1.95.1 under
the included `LICENSE.icons`. Brand marks belong to their respective owners.
