# Studio Dark for Pi Web

Dark appearance and compact layout for Pi Web v1.202610.0.

- DM Sans, charcoal surfaces, restrained blue highlights.
- Flat assistant messages, neutral user messages, compact expandable events.
- Compact navigation rows; Projects and Workspaces size to content, Sessions fills the remaining space.
- Desktop workspace pane initially closed, with your open/closed preference remembered per browser, reopened with Files & terminal or the native edge toggle.
- Bounded, scrollable notification tray preserves full warning content.
- Thin scrollbars, readable metadata, responsive padding, reduced-motion support.

Reload the page. Existing Vitesse Black selections use this update automatically
(the theme ID remains `vitesse:black`). New browsers: Actions → Select Theme →
Studio Dark. Theme choice and panel preference are browser-local.

Installed on all three machines via `~/.pi-web/plugins/vitesse`.
This uses the theme API and a scoped browser presentation layer. CSS classes
and the panel-toggle labels must be reviewed after Pi Web upgrades.
No backend or installed application files are patched. Provider settings and
session data are not changed. Disposal removes styles, observers, font, and
injected controls. Disconnected message roots are released by the observer.

DM Sans is served locally under the included SIL OFL license. Earlier palette
versions are preserved in browser/index.before-contrast.js and
browser/index.before-studio.js. Remove the plugin symlink and reload to uninstall.
