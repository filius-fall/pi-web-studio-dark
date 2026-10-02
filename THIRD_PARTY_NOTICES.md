# Third-party notices

Reviewed on 2026-10-02. Studio Dark is an independent community plugin.
Its original code and original SVG artwork are covered by [LICENSE](LICENSE).
The following components retain their upstream copyright and license terms.

| Component and repository files | Copyright / source | License notice |
| --- | --- | --- |
| Vitesse Black palette and retained earlier palette variants in `browser/index*.js` | 2020 Primer; 2021 Anthony Fu. [Vitesse theme](https://github.com/antfu/vscode-theme-vitesse), derived from the Primer theme. | [MIT](LICENSE.vitesse) |
| `browser/dm-sans.woff2` | 2014 The DM Sans Project Authors. Embedded metadata identifies DM Sans 9pt, version 4.004. [DM Sans](https://github.com/google/fonts/tree/main/ofl/dmsans). | [SIL OFL 1.1](LICENSE.dm-sans) |
| All SVGs in `browser/icons/` | 2023 LobeHub. Unmodified files from `@lobehub/icons-static-svg` version 1.95.1, [Lobe Icons](https://github.com/lobehub/lobe-icons). | [MIT](LICENSE.icons) |
| `browser/pi-icon.svg` | 2026 Earendil Inc. and contributors. Unmodified `src/favicon.svg` from [Pi website source](https://github.com/earendil-works/pi-website/tree/2f5e410b97474d0a34ec2500aa1aa58d6c3f992c). | [MIT](LICENSE.pi) |
| Pi Web UI depicted in `docs/screenshots/` | 2026 Federico Jaramillo Martinez. [Pi Web](https://pi-web.dev), version 1.202610.0. Screenshots were captured with demonstration content. Pi Web application code is not bundled in this plugin. | [MIT](LICENSE.pi-web) |

## Redistribution

Keep the original copyright notices and license texts when distributing copies
or substantial portions. The original plugin code is MIT licensed; the font
remains OFL licensed, and the MIT license does not replace its terms.

DM Sans can be bundled with software and documents, including commercial
products. It cannot be sold by itself. Modified font distributions must follow
the OFL, including any applicable reserved-name requirements. This plugin
does not change the bundled font file.

## Model marks and trademarks

The SVG package's MIT license covers its distributed files, not a blanket
license to the underlying companies' trademarks. Names and logos are used as
small labels identifying the model family in the picker and composer. They
are not Studio Dark's product branding, and do not imply sponsorship,
partnership, certification, or endorsement.

The icon mappings are OpenAI, Z.ai (GLM), Google (Gemini), DeepSeek, xAI (Grok),
Moonshot AI (Kimi), Anthropic (Claude), Meta (Muse), Nvidia (Nemotron), Qwen,
MiniMax, Xiaomi (MiMo), and Tencent Hunyuan (HY3/HY4). Meta, Nvidia, and Hunyuan
marks identify the respective provider families rather than a dedicated
model-specific logo. Pi identifies the compatible host ecosystem.

Marks remain the property of their respective owners. Preserve their shapes
and proportions, avoid representing this plugin as an official product, and
follow applicable owner guidelines. For example, [OpenAI's brand guidelines](https://openai.com/brand/)
restrict logo use to related services and prohibit implying endorsement.
This repository does not transfer trademark rights or certify compliance
with every brand policy for every downstream use.

## Provenance and review limits

[Asset provenance](docs/asset-provenance.json) records bundled third-party asset
paths, versions or source revisions, hashes, and retained notices. All model
SVGs were compared byte-for-byte with the published icon package. The Pi
favicon was compared with its pinned source file. The font's embedded
copyright and license URL were checked against the included OFL notice.

No proprietary application source or supplied reference screenshots are
bundled. Public screenshots use sample conversations. Installing this plugin
does not license Pi Web itself or grant access to model-provider services;
their own installation requirements, licenses, and service terms still apply.

This review checks the identified components and retained notices. It is not
a legal opinion or a guarantee that no copyright, trademark, patent, privacy,
or other claim can arise. Review additional assets and dependencies whenever
you extend or redistribute the plugin.
