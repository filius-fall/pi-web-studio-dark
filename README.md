# Studio Dark for Pi Web

Dark appearance and compact layout for Pi Web v1.202610.0.

A local browser plugin for [Pi Web](https://pi-web.dev). It changes presentation and
layout while preserving Pi Web's agent, sessions, and provider configuration.

- DM Sans, charcoal surfaces, restrained blue highlights.
- Flat assistant messages, neutral user messages, compact expandable events.
- Compact navigation rows; Projects and Workspaces size to content, Sessions fills the remaining space.
- Desktop workspace pane initially closed, with your open/closed preference remembered per browser, reopened with Files & terminal or the native edge toggle.
- Bounded, scrollable notification tray preserves full warning content.
- Thin scrollbars, readable metadata, responsive padding, reduced-motion support.

## Install

Requires an existing Pi Web installation with plugin API v4. Tested with
Pi Web `1.202610.0` in Chromium at desktop and phone widths. Other browser
engines are not yet validated; the stylesheet uses `:host-context`.

```sh
git clone https://github.com/filius-fall/pi-web-studio-dark.git "$HOME/pi-web-studio-dark"
mkdir -p "$HOME/.pi-web/plugins"
ln -s "$HOME/pi-web-studio-dark" "$HOME/.pi-web/plugins/vitesse"
```

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
No backend or installed application files are patched. Provider settings and
session data are not changed. Disposal removes styles, observers, font, and
injected controls. Disconnected message roots are released by the observer.

DM Sans is served locally under the included SIL OFL license. Earlier palette
versions are preserved in browser/index.before-contrast.js and
browser/index.before-studio.js. The plugin is MIT licensed; palette attribution
and font licenses are in `LICENSE.vitesse` and `LICENSE.dm-sans`.

## Maintainer checkout

Keep the installed checkout in place because the plugin link points to it.
This project uses two publishing remotes:

```sh
git push github main
git push gitea main
```

GitHub is the public distribution repository; Gitea is a private copy.
Publishing code does not automatically deploy updates to other machines.
