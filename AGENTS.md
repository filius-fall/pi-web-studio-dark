# Agent instructions for Studio Dark

This repository is a browser theme plugin for an existing Pi Web installation.
Use the checked-in installer. Do not recreate its symlink or startup hook by hand.
Installation does not require npm install, a build, provider configuration, or
a session-daemon restart.

## Before installing

1. Identify the machine serving the Pi Web URL the user opens. Install there,
   not merely on a remote machine selected inside Pi Web. For multiple gateway
   URLs, install on each serving machine the user has asked you to configure.
2. Confirm Git, Node.js, and an existing Pi Web installation are available.
   This plugin is tested with Pi Web `1.202610.0`, plugin API v4, and Chromium.
   Do not install or upgrade Pi Web itself unless the user requested it.
3. Check whether the user already has a checkout. Preserve local changes and
   existing plugin links. Never overwrite another plugin or delete a checkout
   to make an installation succeed.
4. Determine the actual Pi Web data directory. The installer uses `--data-dir`
   first, then `PI_WEB_DATA_DIR`, then `$HOME/.pi-web`. Use the directory of the
   serving instance; do not assume another shell inherits its environment.

## Fresh installation

For Linux, macOS, or WSL with the default data directory, run:

```sh
git clone https://github.com/filius-fall/pi-web-studio-dark.git "$HOME/pi-web-studio-dark"
node "$HOME/pi-web-studio-dark/scripts/install.mjs"
```

If this repository is already checked out, run the installer from that checkout
instead of cloning again:

```sh
node scripts/install.mjs
```

For a custom instance, replace the example paths with verified absolute paths:

```sh
node scripts/install.mjs --data-dir /path/to/pi-web-data --html /path/to/pi-web/dist/client/index.html
```

`--html` must point to the installed `@jmfederico/pi-web` package's
`dist/client/index.html`, not a source checkout or an unrelated web page. The
installer normally detects it through the installed CLI or global npm package.

The default installer also adds an optional startup hook to this HTML to prevent
the initial theme flash. It keeps a `.studio-dark-backup` on first installation.
If the user wants only the plugin, run:

```sh
node scripts/install.mjs --no-startup
```

Keep the checkout in place: the plugin link points to it. The stable plugin ID
is `vitesse` and theme ID is `vitesse:black`, although the display name is
**Studio Dark**. Do not rename these IDs during installation.

## Verify and activate

1. Read the installer's output and exit status. An existing different plugin
   causes an error and is left untouched. Report that conflict rather than
   removing it automatically.
2. Verify `<data-directory>/plugins/vitesse` resolves to this checkout.
3. Distinguish a successful plugin install from a skipped or failed optional
   startup hook. Report the hook result accurately; use a verified `--html`
   path if automatic detection failed. Do not escalate privileges automatically.
4. Reload the user's gateway URL. Choose **Actions → Select Theme → Studio Dark**.
   On mobile, use **Session options → Actions → Select Theme**. Theme selection
   is browser-local and gateway-local; repeat in each browser/origin as needed.
   If browser automation is unavailable, give the user these exact steps.
5. If HTTP access is available, fetch `/pi-web-plugins/manifest.json` on that
   gateway and confirm it advertises plugin `vitesse`. This refreshes the asset
   catalog; it does not select the theme in the user's browser.
6. When browser access is available, check desktop and mobile rendering, model
   and reasoning controls, and an attachment preview. Avoid sending test
   messages or changing provider settings just to verify presentation.

Do not claim activation or visual verification unless you performed it. A
successful installer alone does not prove the user's browser selected the theme.

## Update

Inspect the existing checkout's status first. If it has local changes, preserve
them and resolve the update with the user instead of resetting or cleaning it.
For a clean checkout at the standard path:

```sh
git -C "$HOME/pi-web-studio-dark" pull --ff-only
node "$HOME/pi-web-studio-dark/scripts/install.mjs"
```

Use the original data-directory and HTML options for a custom instance. Reapply
the startup hook after Pi Web upgrades. Reload the gateway and refresh without
cache if necessary; verify that the serving machine has the updated checkout.
Do not rewrite Git remotes or restart session daemons to fix browser caching.

## Removal, only when requested

Select another theme first. Remove only the plugin link, using the actual data
directory. For the default:

```sh
unlink "$HOME/.pi-web/plugins/vitesse"
```

If the startup hook was installed, remove it before deleting the checkout:

```sh
node scripts/install-startup.mjs --html /path/to/pi-web/dist/client/index.html --remove
```

Reload Pi Web. Do not remove sessions, provider configuration, or the Pi Web
data directory.

## Repository changes

- Follow [CONTRIBUTING.md](CONTRIBUTING.md). Preserve native Pi Web behavior and
  scope presentation changes to `vitesse:black`.
- Keep [README.md](README.md) and these installation instructions consistent
  with the actual installer. Validate changed JavaScript with `node --check`
  and run `git diff --check`; test affected desktop/mobile behavior when relevant.
- Preserve third-party notices and licenses. New assets need source, license,
  copyright, and hashes in the existing provenance records. Do not imply brand
  endorsement or promise that legal claims are impossible.
- Use demonstration content for public screenshots. Never commit credentials,
  private conversations, personal deployment addresses, or machine-specific paths.
- Report what changed, what was verified, and any incomplete setup steps. Push
  or deploy only within the user's authorized scope.
