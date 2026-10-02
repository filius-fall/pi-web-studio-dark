// Presentation overrides for Pi Web v1.202610.0. All rules are theme-scoped.
export function appearanceCss(s) {
  const icon = name => new URL(`./icons/${name}.svg`, import.meta.url).href;
  const brain = new URL("./brain.svg", import.meta.url).href;
  return `
    ${s} { font-family: "Pi Studio Sans", system-ui, sans-serif !important; -webkit-font-smoothing: antialiased; --pi-control-font-family: "Pi Studio Sans", system-ui, sans-serif; }
    ${s} button, ${s} input, ${s} select, ${s} textarea { font-family: "Pi Studio Sans", system-ui, sans-serif !important; }
    ${s} button { transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease; }
    ${s} button:focus-visible { outline: 2px solid var(--pi-accent); outline-offset: 2px; }
    ${s} * { scrollbar-width: thin; scrollbar-color: #ffffff26 transparent; }
    ${s} .studio-tools-toggle { display: none; position: absolute; top: 12px; right: 18px; z-index: 8; border: 1px solid #ffffff18; border-radius: 7px; background: #242426; color: #d4d4dc; padding: 6px 10px; font-size: 12px; cursor: pointer; }
    @media (min-width: 1181px) {
      ${s} .shell.workspace-panel-collapsed ~ .studio-tools-toggle { display: inline-flex; }
      ${s} .shell.workspace-panel-collapsed chat-view { padding-top: 38px; box-sizing: border-box; }
    }
    ${s} .shell { --navigation-panel-size: 272px; --workspace-panel-size: minmax(280px, 28vw); }
    ${s} aside, ${s} .mobile-navigation-panel { background: #000000; }
    :host(app-navigation-panel)${s} { background: #000000; --pi-bg: #000000; --pi-surface: #090c12; --pi-surface-hover: #0d1420; --pi-border: #232323; --pi-border-muted: #151515; }
    ${s} project-list { flex: 0 1 auto; max-height: 30%; }
    ${s} workspace-list { flex: 0 1 auto; max-height: 22%; }
    ${s} session-list { flex: 1 1 0; }
    :host(app-navigation-panel)${s} header { display: grid; grid-template-columns: 1fr auto; padding: 12px; gap: 8px; }
    :host(app-navigation-panel)${s} header strong { grid-column: 1 / -1; font-size: 11px; letter-spacing: .06em; color: #a8a8b2; }
    ${s} .header-actions { min-width: 0; gap: 6px; }
    ${s} .header-actions machine-switcher { min-width: 0; }
    ${s} .chat { padding: 28px clamp(16px, 4vw, 52px) 24px; line-height: 1.7; }
    ${s} .msg { max-width: 800px; margin: 0 auto 36px; font-size: 16px; }
    :host(formatted-text)${s} { font-size: inherit; min-width: 0; }
    :host(formatted-text)${s} .formatted { font-size: inherit; line-height: 1.8; color: #d5d5db; letter-spacing: .005em; font-kerning: normal; }
    :host(formatted-text)${s} p, :host(formatted-text)${s} ul, :host(formatted-text)${s} ol, :host(formatted-text)${s} blockquote, :host(formatted-text)${s} .table-scroll, :host(formatted-text)${s} .code-block-wrapper { margin: 0 0 1.15em; }
    :host(formatted-text)${s} .formatted > :last-child { margin-bottom: 0; }
    :host(formatted-text)${s} strong { color: #eeeeF2; font-weight: 650; }
    :host(formatted-text)${s} ul, :host(formatted-text)${s} ol { padding-left: 1.5em; }
    :host(formatted-text)${s} li { padding-left: .2em; }
    :host(formatted-text)${s} li + li { margin-top: .55em; }
    :host(formatted-text)${s} li::marker { color: #94949f; }
    :host(formatted-text)${s} li > p { margin-bottom: .5em; }
    :host(formatted-text)${s} li > :last-child { margin-bottom: 0; }
    :host(formatted-text)${s} li > ul, :host(formatted-text)${s} li > ol { margin-top: .5em; }
    :host(formatted-text)${s} h1, :host(formatted-text)${s} h2, :host(formatted-text)${s} h3, :host(formatted-text)${s} h4, :host(formatted-text)${s} h5, :host(formatted-text)${s} h6 { color: #f0f0f3; font-weight: 650; line-height: 1.4; letter-spacing: -.015em; margin: 1.5em 0 .65em; }
    :host(formatted-text)${s} .formatted > :is(h1, h2, h3, h4, h5, h6):first-child { margin-top: 0; }
    :host(formatted-text)${s} h1 { font-size: 26px; }
    :host(formatted-text)${s} h2 { font-size: 22px; }
    :host(formatted-text)${s} h3 { font-size: 19px; }
    :host(formatted-text)${s} h4, :host(formatted-text)${s} h5, :host(formatted-text)${s} h6 { font-size: 16px; }
    :host(formatted-text)${s} a { color: #7daeff; text-decoration: underline; text-decoration-color: #7daeff55; text-underline-offset: .22em; text-decoration-thickness: 1px; overflow-wrap: anywhere; transition: color 140ms ease, text-decoration-color 140ms ease; }
    :host(formatted-text)${s} a:hover { color: #acd0ff; text-decoration-color: currentColor; }
    :host(formatted-text)${s} a:focus-visible { outline: 2px solid #7daeff; outline-offset: 3px; border-radius: 3px; }
    :host(formatted-text)${s} a[href^="http"]::after { content: '\\00a0↗'; font-size: .75em; text-decoration: none; }
    :host(formatted-text)${s} code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; font-size: .88em; line-height: inherit; letter-spacing: 0; border: 1px solid #ffffff0d; border-radius: 6px; padding: .12em .35em; background: #ffffff06; color: #e1e1e8; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
    :host(formatted-text)${s} a code { color: inherit; }
    :host(formatted-text)${s} .code-block-wrapper { border: 1px solid #ffffff12; border-radius: 12px; background: #101114; overflow: hidden; }
    :host(formatted-text)${s} .code-block-wrapper::before { content: attr(data-studio-language); display: flex; align-items: center; min-height: 40px; padding: 0 16px; border-bottom: 1px solid #ffffff0c; background: #17181c; color: #a5a5af; font-size: 11px; font-weight: 500; letter-spacing: .035em; }
    :host(formatted-text)${s} .code-block-wrapper pre, :host(formatted-text)${s} pre { border: 0; border-radius: 0; background: transparent; padding: 18px 20px; margin: 0; line-height: 1.7; tab-size: 2; }
    :host(formatted-text)${s} pre code { display: block; font-size: 13.5px; line-height: 1.7; border: 0; border-radius: 0; padding: 0; background: transparent; white-space: pre; overflow-wrap: normal; box-decoration-break: slice; }
    :host(formatted-text)${s} .code-copy-button { top: 5px; right: 8px; width: 30px; height: 30px; border: 0; border-radius: 6px; background: transparent; color: #9c9ca7; }
    :host(formatted-text)${s} .code-copy-button:hover, :host(formatted-text)${s} .code-copy-button:focus-visible { color: #eeeef2; background: #ffffff0a; }
    :host(formatted-text)${s} blockquote { border-left: 2px solid #628dff66; padding: 2px 0 2px 18px; color: #aaaab6; }
    :host(formatted-text)${s} hr { margin: 1.6em 0; border: 0; border-top: 1px solid #ffffff0c; }
    :host(formatted-text)${s} .table-scroll { border: 1px solid #ffffff0d; border-radius: 10px; }
    :host(formatted-text)${s} th, :host(formatted-text)${s} td { border: 0; border-bottom: 1px solid #ffffff0c; padding: 12px 16px; text-align: start; line-height: 1.65; }
    :host(formatted-text)${s} th { background: #ffffff03; color: #b6b6c0; font-size: 13px; font-weight: 600; }
    :host(formatted-text)${s} tr:last-child td { border-bottom: 0; }
    ${s} .msg.assistant, ${s} .msg.tool-image-output { border: 0; border-radius: 0; background: transparent; padding: 0; }
    ${s} .msg.user { border: 1px solid #ffffff0d; border-radius: 16px; background: #1c1c1c; padding: 14px 18px; }
    ${s} .msg > .msg-header { position: static; min-height: 20px; margin: 0 0 10px; padding: 0; border: 0; border-radius: 0; box-shadow: none; background: transparent; }
    ${s} .msg.user > .msg-header { background: transparent; border: 0; }
    ${s} .msg-header .label { font-size: 11px; font-weight: 600; text-transform: none; letter-spacing: .02em; }
    ${s} .msg.assistant > .msg-header .label { color: #f4f4f5; }
    ${s} .msg.user > .msg-header .label { color: #b4b4bd; }
    ${s} .msg-meta { opacity: 1 !important; color: #93939c; font-size: 11px; }
    ${s} .msg-action { border-color: transparent; background: transparent; }
    ${s} .msg.event-group, ${s} .msg.event-group.live { border: 0; border-left: 0; border-radius: 0; background: transparent; color: var(--pi-text-secondary); }
    ${s} .msg.event-group > summary, ${s} .msg.event-group.live > summary { position: static; padding: 6px 10px; background: transparent; border-color: #ffffff12; color: #a8a8b2; border-radius: 9px 9px 0 0; font-size: 12px; }
    ${s} .group-msg > .msg-header { position: static; background: transparent; border-color: #ffffff0d; box-shadow: none; }
    ${s} .msg.tool, ${s} .msg.bash, ${s} .msg.skill { border-color: #ffffff18; background: #1c1c1c; border-radius: 10px; }
    ${s} .msg.tool-execution-shell, ${s} .msg.ask-user-record-shell { border: 0; background: transparent; padding: 0; }
    ${s} .msg.tool-execution-shell { margin-bottom: 8px; }
    ${s} .activity-dock { border: 0; border-radius: 6px 6px 0 0; background: #191919; }
    ${s} .activity-dock.active { color: #00bff3; background: #151515; }
    ${s} .activity-indicator.session, ${s} .activity-indicator.sending { background: #00bff3; }
    ${s} .tool-card, ${s} .tool-card.pending, ${s} .tool-card.running, ${s} .tool-card.success { border: 0; border-top: 1px solid #ffffff0c; border-radius: 0; background: transparent; padding: 10px 0; gap: 0; }
    ${s} .tool-card { position: relative; gap: 0; }
    ${s} .tool-header { min-height: 28px; box-sizing: border-box; }
    ${s} .tool-card:has(> .text-body) .tool-header { padding-right: 36px; }
    ${s} .tool-header, ${s} .tool-title, ${s} .tool-meta { align-items: center; }
    ${s} .status-label { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
    ${s} .tool-title { gap: 8px; font-size: 13px; line-height: 20px; }
    ${s} .status-icon { display: inline-flex; align-items: center; justify-content: center; flex: 0 0 14px; width: 14px; height: 20px; line-height: 1; box-sizing: border-box; }
    ${s} .tool-title strong { color: #a0a0a5; font-weight: 500; }
    ${s} .tool-title .summary, ${s} .tool-title .path { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    ${s} .tool-title .summary { flex: 0 1 auto; color: #929298; }
    ${s} .tool-meta, ${s} .status-label { color: #89898f; font-size: 10px; letter-spacing: 0; text-transform: none; }
    ${s} .tool-card.running .status-icon, ${s} .tool-card.pending .status-icon, ${s} .tool-card.running .status-label { color: #00bff3; }
    ${s} .tool-card.success .status-icon { color: #34d399; }
    ${s} .tool-card.error .status-icon, ${s} .tool-card.error .status-label { color: var(--pi-danger); }
    ${s} .tool-card { animation: studio-tool-enter 160ms ease-out both; }
    ${s} .tool-card.running .status-icon, ${s} .tool-card.pending .status-icon { font-size: 0; }
    ${s} .tool-card.running .status-icon::before, ${s} .tool-card.pending .status-icon::before { content: ""; display: block; flex: 0 0 12px; width: 12px; height: 12px; box-sizing: border-box; border: 1.5px solid #00bff3; border-right-color: transparent; border-radius: 50%; animation: studio-tool-spin 900ms linear infinite; }
    ${s} .text-body[open] .detail-target, ${s} .text-body[open] .detail-result, ${s} .diff-details[open] .diff { animation: studio-details-enter 180ms ease-out both; }
    ${s} .activity-dock { gap: 10px; padding: 6px 12px; line-height: 18px; }
    ${s} .activity-dock.active .dot { position: relative; width: 4px; height: 4px; margin: 0 8px; opacity: 1; animation: studio-working-pulse 1200ms ease-in-out infinite; }
    ${s} .activity-dock.active .dot::before, ${s} .activity-dock.active .dot::after { content: ""; position: absolute; top: 0; width: 4px; height: 4px; border-radius: 50%; background: currentColor; animation: studio-working-pulse 1200ms ease-in-out infinite; }
    ${s} .activity-dock.active .dot::before { left: -7px; animation-delay: -200ms; }
    ${s} .activity-dock.active .dot::after { left: 7px; animation-delay: 200ms; }
    ${s} details.part:not(.skill-invocation) > summary { line-height: 20px; color: #929298; }
    ${s} summary[data-studio-reasoning] { width: fit-content; max-width: 100%; display: flex; align-items: center; gap: 9px; color: #929298; list-style: none; text-transform: capitalize; }
    ${s} summary[data-studio-reasoning]::-webkit-details-marker { display: none; }
    ${s} summary[data-studio-reasoning]::before { content: ""; flex: 0 0 20px; width: 20px; height: 20px; background: #929298; mask: url("${brain}") center / contain no-repeat; }
    ${s} summary[data-studio-thinking]::before { animation: studio-brain-breathe 2400ms ease-in-out infinite; }
    ${s} summary[data-studio-reasoning]::after { content: ""; flex: 0 0 10px; width: 10px; height: 10px; margin-left: 2px; opacity: .5; background: #929298; mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='m3 4.5 3 3 3-3' stroke='black' fill='none' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat; }
    ${s} details[open] > summary[data-studio-reasoning]::after { transform: rotate(180deg); }
    ${s} details.part[open] > formatted-text { animation: studio-details-enter 180ms ease-out both; }
    ${s} .text-body, ${s} .diff-details { border-top: 0; padding-top: 2px; }
    ${s} .diff-details > summary { color: #929298; font-size: 12px; }
    ${s} .text-body { margin: 0; padding: 0; }
    ${s} .text-body[open] { padding-top: 8px; }
    ${s} .text-body > summary { position: absolute; top: 10px; right: 0; z-index: 1; display: flex; align-items: center; justify-content: flex-end; width: 100%; height: 28px; box-sizing: border-box; padding: 0 10px; color: #929298; font-size: 0; list-style: none; border-radius: 5px; cursor: pointer; }
    ${s} .text-body > summary::-webkit-details-marker { display: none; }
    ${s} .text-body > summary::before { content: ""; width: 7px; height: 7px; box-sizing: border-box; border: solid currentColor; border-width: 0 1.5px 1.5px 0; transform: translateY(-2px) rotate(45deg); transition: transform 160ms ease; }
    ${s} .text-body[open] > summary::before { transform: translateY(2px) rotate(225deg); }
    ${s} .text-body > summary:hover { color: #e8e8ed; background: #ffffff04; }
    ${s} .text-body > summary:focus-visible { outline: 2px solid var(--pi-accent); outline-offset: 2px; }
    ${s} .msg.event-group > summary { color: #929298; padding: 6px 0; }
    ${s} .msg.event-group > summary .label { text-transform: none; font-weight: 400; }
    ${s} .group-body { padding-left: 0; padding-right: 0; }

    ${s} .action-row { margin: 3px 0; border-radius: 10px; overflow: clip; }
    ${s} .action-main, ${s} .action-menu-toggle { border: 0; border-radius: 0; background: transparent; font-size: 13px; }
    ${s} .action-main { padding-top: 8px; padding-bottom: 8px; }
    ${s} .action-row.selected .action-main, ${s} .action-row.selected .action-menu-toggle { border: 0; background: #0b1019; color: #fafafa; }
    ${s} .action-row.selected { box-shadow: none; }
    ${s} .action-row.selected .action-main { background: #0b1019; box-shadow: none; }
    ${s} .action-row:not(.selected):hover .action-main, ${s} .action-menu-toggle:hover { background: #080e18; }
    ${s} .action-name { font-size: 13px; line-height: 1.5; }
    ${s} .action-main small { font-size: 11px; line-height: 1.5; margin-top: 2px; color: #9c9ca6; }
    ${s} .action-menu-toggle { min-width: 28px; }
    .studio-session-meta { display: none; }
    ${s} .action-row { grid-template-columns: minmax(0, 1fr); margin: 4px 0; }
    ${s} .action-main { padding: 10px 12px 10px calc(12px + var(--depth, 0) * 12px); }
    ${s} .action-menu { position: absolute; right: 5px; bottom: 5px; z-index: 2; }
    ${s} .action-menu-toggle { min-width: 24px; width: 24px; height: 24px; border-radius: 5px; opacity: 0; }
    ${s} .action-row:hover .action-menu-toggle, ${s} .action-row:focus-within .action-menu-toggle, ${s} .action-row:has(.action-menu-panel) .action-menu-toggle { opacity: 1; }
    ${s} .action-row.selected .action-menu-toggle { background: transparent; }
    ${s} .action-name { display: block; font-size: 14px; line-height: 21px; max-height: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    ${s} .action-main[data-studio-badge] { padding-left: 44px; }
    ${s} .action-main[data-studio-badge]::before { content: attr(data-studio-badge); position: absolute; left: 12px; top: 10px; width: 22px; height: 22px; display: grid; place-items: center; border-radius: 6px; color: var(--studio-badge-color); background: color-mix(in srgb, var(--studio-badge-color) 14%, transparent); font-size: 10px; font-weight: 650; }
    ${s} .action-main small { color: #727278; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    ${s} .action-activity { top: 14px; right: 12px; width: 12px; height: 12px; }
    ${s} .action-activity .activity-indicator.session, ${s} .action-activity .activity-indicator.sending, ${s} .action-activity .activity-indicator.terminal { width: 12px; height: 12px; box-sizing: border-box; border: 1.5px solid #00bff3; border-right-color: transparent; background: transparent; border-radius: 50%; animation: studio-tool-spin 900ms linear infinite; }
    :host(session-list)${s} .action-main { padding: 12px 12px 16px calc(12px + var(--depth, 0) * 12px); }
    :host(session-list)${s} .action-main.selecting { padding-left: calc(34px + var(--depth, 0) * 12px); }
    :host(session-list)${s} .session-checkbox { top: 17px; }
    :host(session-list)${s} .action-name { color: #929298; }
    :host(session-list)${s} .action-row.selected .action-name, :host(session-list)${s} .action-row.unread .action-name, :host(session-list)${s} .action-main:has(.studio-session-state[data-active="true"]) .action-name { color: #e8e8ed; font-weight: 500; }
    :host(session-list)${s} .action-main > small, :host(session-list)${s} .action-activity { display: none; }
    ${s} .studio-session-meta { display: flex; align-items: center; gap: 7px; min-width: 0; margin-bottom: 7px; font-size: 11px; line-height: 22px; color: #85858b; }
    ${s} .studio-project-badge { flex: 0 0 22px; width: 22px; height: 22px; display: grid; place-items: center; border-radius: 6px; color: var(--studio-badge-color); background: color-mix(in srgb, var(--studio-badge-color) 14%, transparent); font-size: 10px; font-weight: 650; }
    ${s} .studio-project-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    ${s} .studio-session-state { flex: 0 0 auto; display: inline-flex; align-items: center; gap: 5px; margin-left: auto; white-space: nowrap; }
    ${s} .studio-session-state[data-active="true"], ${s} .studio-session-state[data-unread="true"] { color: #00bff3; }
    ${s} .studio-session-state[data-active="true"]::before { content: ""; width: 11px; height: 11px; box-sizing: border-box; border: 1.5px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: studio-tool-spin 900ms linear infinite; }
    @media (hover: none) { ${s} .action-menu-toggle { opacity: 1; } }

    ${s} section > h2 { font-size: 11px; font-weight: 500; letter-spacing: .05em; box-shadow: none; background: transparent; padding-top: 8px; padding-bottom: 8px; }
    ${s} .section-toggle { text-transform: none; letter-spacing: 0; }
    ${s} .section-title { font-weight: 600; }
    ${s} .tabs button { border-color: transparent; background: transparent; font-size: 12px; padding: 6px 9px; }
    ${s} .tabs button.selected { border-color: #ffffff12; background: #0b1019; color: #fafafa; }
    ${s} .markdown-editor .cm-editor, ${s} textarea { border-radius: 16px; border-color: #ffffff12; background: #191919; font-size: 14px; }
    ${s} .markdown-editor .cm-editor.cm-focused, ${s} textarea:focus { outline: none; border-color: #628dff; }
    ${s} .editor-wrap { border-radius: 12px; }
    ${s} .notification-tray { background: #1c1c1c; max-height: min(180px, 24vh); }
    ${s} .notification-header { background: #1c1c1c; min-height: 34px; }
    ${s} .notification-heading { font-size: 12px; font-weight: 500; }
    ${s} .notification-row { font-size: 12px; line-height: 1.5; }
    .studio-model-name, .studio-model-current, .studio-mobile-model-controls { display: none; }
    ${s} [data-studio-brand] { position: relative; }
    ${s} [data-studio-brand]::before { content: ""; position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 22px; height: 22px; background: #e8e8ed; mask: var(--studio-brand-icon) center / contain no-repeat; pointer-events: none; }
    ${s} [data-studio-brand="openai"] { --studio-brand-icon: url("${icon('openai')}"); }
    ${s} [data-studio-brand="zai"] { --studio-brand-icon: url("${icon('zai')}"); }
    ${s} [data-studio-brand="gemini"]::before { mask: none; background: url("${icon('gemini-color')}") center / contain no-repeat; }
    ${s} [data-studio-brand="deepseek"]::before { mask: none; background: url("${icon('deepseek-color')}") center / contain no-repeat; }
    ${s} [data-studio-brand="grok"] { --studio-brand-icon: url("${icon('grok')}"); }
    ${s} [data-studio-brand="kimi"]::before { mask: none; background: url("${icon('kimi-color')}") center / contain no-repeat; }
    ${s} [data-studio-brand="claude"]::before { mask: none; background: url("${icon('claude-color')}") center / contain no-repeat; }
    ${s} [data-studio-brand="muse"]::before { mask: none; background: url("${icon('meta-brand-color')}") center / contain no-repeat; }
    ${s} [data-studio-brand="nemotron"]::before { mask: none; background: url("${icon('nvidia-color')}") center / contain no-repeat; }
    ${s} [data-studio-brand="qwen"]::before { mask: none; background: url("${icon('qwen-color')}") center / contain no-repeat; }
    ${s} [data-studio-brand="minimax"]::before { mask: none; background: url("${icon('minimax-color')}") center / contain no-repeat; }
    ${s} [data-studio-brand="mimo"] { --studio-brand-icon: url("${icon('xiaomimimo')}"); }
    ${s} [data-studio-brand="hunyuan"]::before { mask: none; background: url("${icon('hunyuan-color')}") center / contain no-repeat; }
    ${s} [data-studio-brand="generic"]::before { mask: none; content: "AI"; display: grid; place-items: center; background: #252528; border-radius: 6px; font-size: 10px; color: #a0a0a5; }
    :host(model-picker)${s} modal-surface { --modal-surface-width: min(560px, calc(100vw - 48px)); --modal-surface-max-height: min(620px, calc(100vh - 64px)); --modal-surface-radius: 18px; }
    :host(model-picker)${s} header { padding: 18px 20px 12px; border: 0; }
    :host(model-picker)${s} header strong { font-size: 17px; font-weight: 600; }
    :host(model-picker)${s} header button { width: 28px; height: 28px; border-radius: 7px; }
    :host(model-picker)${s} .scope-toggle { margin: 0 20px; width: fit-content; padding: 3px; background: #191919; border: 1px solid #ffffff0d; border-radius: 9px; }
    :host(model-picker)${s} .scope-toggle button { flex: none; font-size: 12px; padding: 6px 14px; }
    :host(model-picker)${s} .scope-toggle button[aria-pressed="true"] { background: #2a2a2d; }
    :host(model-picker)${s} .search-row { margin: 14px 20px 6px; }
    :host(model-picker)${s} input.search { font-size: 13px; border-radius: 10px; padding: 10px 12px; background: #191919; border-color: #ffffff16; }
    :host(model-picker)${s} .default-help { padding: 7px 20px; font-size: 11px; color: #85858b; }
    :host(model-picker)${s} .default-help strong { font-size: 0; }
    :host(model-picker)${s} .default-help strong::after { content: "Star a model to use it for new sessions"; font-size: 11px; font-weight: 400; }
    :host(model-picker)${s} .options { margin: 0 10px 12px; }
    :host(model-picker)${s} .default-row, :host(model-picker)${s} .catalog-row { margin: 3px 0; border: 0; border-radius: 10px; overflow: hidden; }
    :host(model-picker)${s} .default-row:has(> button.selected), :host(model-picker)${s} .catalog-row.selected { background: #242426; }
    :host(model-picker)${s} .default-row:hover, :host(model-picker)${s} .catalog-row:hover { background: #1c1c1e; }
    :host(model-picker)${s} .options button[data-studio-brand] { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-content: center; gap: 3px 10px; min-height: 60px; padding: 10px 12px 10px 50px; font-size: 13px; border: 0; background: transparent; }
    :host(model-picker)${s} button[data-studio-brand] > span:not(.studio-model-name):not(.studio-model-current) { display: none; }
    :host(model-picker)${s} .studio-model-name { display: block; grid-column: 1; grid-row: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
    :host(model-picker)${s} button[data-studio-brand] small { grid-column: 1; grid-row: 2; font-size: 11px; margin: 0; color: #85858b; }
    :host(model-picker)${s} .studio-model-current { display: block; grid-column: 2; grid-row: 1 / 3; align-self: center; background: #628dff18; color: #9fb6ff; border-radius: 5px; padding: 3px 7px; font-size: 10px; }
    :host(model-picker)${s} .default-pin { color: #75757b; width: 32px !important; height: 32px !important; }
    :host(model-picker)${s} .default-pin[aria-pressed="true"] { color: #9fb6ff; }
    :host(prompt-editor)${s} { max-width: 800px; width: var(--studio-composer-width, calc(100% - 40px)); margin: 0 auto; margin-left: var(--studio-composer-left, auto); box-sizing: border-box; padding: 10px 0 6px; }
    :host(prompt-editor)${s} footer { position: relative; padding: 10px; border: 1px solid #ffffff10; border-radius: 20px; background: #191919; gap: 8px; }
    :host(prompt-editor)${s} footer:focus-within { border-color: #44444a; }
    :host(prompt-editor)${s} footer.shell-mode { border-color: var(--pi-success-border); background: #15231d; }
    :host(prompt-editor)${s} .editor-wrap { position: static; display: flex; flex-direction: column; gap: 0; }
    :host(prompt-editor)${s} .attachments { order: -1; margin-top: 0; margin-bottom: 10px; gap: 8px; }
    :host(prompt-editor)${s} .attachment-chip { width: 68px; height: 68px; border-radius: 10px; }
    :host(prompt-editor)${s} .attachment-remove { width: 22px; height: 22px; border-radius: 7px; background: #121212cc; color: #eee; }
    :host(prompt-editor)${s} .attachment-delivery { flex: 1 1 180px; align-self: center; font-size: 11px; color: #929298; }
    :host(prompt-editor)${s} .attachment-delivery select { display: block; max-width: 100%; padding: 5px 22px 5px 8px; font-size: 11px; border: 1px solid #ffffff10; border-radius: 6px; background-color: #202020; }
    :host(prompt-editor)${s} select[data-studio-delivery-native] { display: none; }
    :host(prompt-editor)${s} .studio-delivery-toggle { display: inline-flex; align-items: center; gap: 12px; max-width: 100%; padding: 7px 10px; border: 1px solid #ffffff16; border-radius: 8px; background: #232323; color: #e8e8ed; font-size: 12px; text-align: left; cursor: pointer; }
    :host(prompt-editor)${s} .studio-delivery-toggle::after { content: ''; width: 7px; height: 7px; flex-shrink: 0; border-right: 1.5px solid #999; border-bottom: 1.5px solid #999; transform: translateY(-2px) rotate(45deg); }
    :host(prompt-editor)${s} .studio-delivery-menu { position: fixed; inset: auto; margin: 0; padding: 5px; box-sizing: border-box; border: 1px solid #ffffff18; border-radius: 12px; background: #202020; color: #e8e8ed; color-scheme: dark; box-shadow: 0 10px 32px #0008; }
    :host(prompt-editor)${s} .studio-delivery-menu::backdrop { background: transparent; }
    :host(prompt-editor)${s} .studio-delivery-menu button { display: block; width: 100%; padding: 10px 12px; border: 0; border-radius: 8px; background: transparent; color: inherit; text-align: left; cursor: pointer; }
    :host(prompt-editor)${s} .studio-delivery-menu button:hover, :host(prompt-editor)${s} .studio-delivery-menu button:focus-visible { background: #2d2d2d; }
    :host(prompt-editor)${s} .studio-delivery-menu button[aria-checked="true"] { background: #172b49; }
    :host(prompt-editor)${s} .studio-delivery-menu button:disabled { opacity: .45; cursor: default; }
    :host(prompt-editor)${s} .studio-delivery-menu strong, :host(prompt-editor)${s} .studio-delivery-menu small { display: block; font-size: 12px; line-height: 1.5; }
    :host(prompt-editor)${s} .studio-delivery-menu strong { font-weight: 500; }
    :host(prompt-editor)${s} .studio-delivery-menu small { margin-top: 3px; color: #aaaab2; font-size: 11px; }
    :host(prompt-editor)${s} .attachment-delivery::after { content: attr(data-studio-help); display: block; margin-top: 4px; line-height: 1.4; }
    :host(prompt-editor)${s} .markdown-editor .cm-editor, :host(prompt-editor)${s} .markdown-editor .cm-editor.cm-focused { border: 0; border-radius: 0; background: transparent; min-height: 24px; outline: none; }
    :host(prompt-editor)${s} .markdown-editor .cm-content { min-height: 24px; padding: 6px 0; font-size: 15px; line-height: 1.6; }
    :host(prompt-editor)${s} .cm-placeholder { font-size: 15px; color: #85858b; }
    :host(prompt-editor)${s} .cm-cursor { border-left: 1.5px solid #ededf0; }
    :host(prompt-editor)${s} .mode-hint { position: static; display: table; max-width: 100%; margin-top: 6px; }
    :host(prompt-editor)${s} .actions { gap: 8px; }
    :host(prompt-editor)${s} .compact-status { gap: 6px; margin-right: 36px; }
    :host(prompt-editor)${s} .compact-status > button { height: 32px; border: 0; border-radius: 6px; background: transparent; color: #b4b4bd; }
    :host(prompt-editor)${s} .select-model[data-studio-brand] { font-size: 0; padding: 0 22px 0 28px; max-width: min(34vw, 260px); }
    :host(prompt-editor)${s} .select-model[data-studio-brand]::before { left: 0; width: 20px; height: 20px; }
    :host(prompt-editor)${s} .select-model[data-studio-label]::after { content: attr(data-studio-label); font-size: 13px; }
    :host(prompt-editor)${s} .select-thinking[data-studio-reasoning] { width: auto; padding: 0 20px 0 10px; border-left: 1px solid #ffffff10; border-radius: 0; }
    :host(prompt-editor)${s} .select-thinking[data-studio-reasoning] svg { display: none; }
    :host(prompt-editor)${s} .select-thinking[data-studio-reasoning]::after { content: attr(data-studio-reasoning); font-size: 12px; }
    :host(prompt-editor)${s} .select-model, :host(prompt-editor)${s} .select-thinking { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='m3 4.5 3 3 3-3' stroke='%23929298' fill='none' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") !important; background-repeat: no-repeat !important; background-size: 12px !important; background-position: right 4px center !important; }
    :host(prompt-editor)${s} .editor-attach { right: 100px; bottom: 10px; width: 32px; height: 32px; border: 0; background: transparent; color: #a0a0a5; }
    :host(prompt-editor)${s} footer:has(.steer-button) .editor-attach { right: 144px; }
    :host(prompt-editor)${s} .send-button { order: 4; border-radius: 50%; border: 0; width: 34px; height: 34px; background: #3868ee; color: #fff; }
    :host(prompt-editor)${s} .send-button:not(:disabled) { color: #fff; }
    :host(prompt-editor)${s} .send-button .prompt-action-icon { display: none; }
    :host(prompt-editor)${s} .send-button::before { content: ""; width: 18px; height: 18px; background: currentColor; mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 20V4m-6 6 6-6 6 6' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / contain no-repeat; }
    :host(prompt-editor)${s} .send-button:disabled { opacity: .4; }
    :host(prompt-editor)${s} .stop-button { order: 3; border-radius: 50%; border: 0; width: 34px; height: 34px; }
    :host(prompt-editor)${s} .stop-button:not(:disabled) { background: #e8404a; color: #fff; }
    :host(prompt-editor)${s} .stop-button:disabled { background: #232326; color: #65656b; }
    :host(prompt-editor)${s} .steer-button { order: 2; }

    .studio-tool-label, .studio-inline-activity, .studio-ticks { display: none; }
    ${s} .tool-card[data-studio-active="true"] .tool-title > strong,
    ${s} .tool-card[data-studio-active="true"] .tool-title > .summary,
    ${s} .tool-card[data-studio-active="true"] .tool-title > .path { display: none; }
    ${s} .tool-card[data-studio-active="true"] .studio-tool-label { display: inline; color: #a0a0a5; }
    ${s} .activity-dock { display: none; }
    ${s} .studio-inline-activity { display: flex; align-items: center; gap: 9px; max-width: 800px; margin: 16px auto 8px; color: #a0a0a5; font-size: 13px; line-height: 20px; }
    ${s} .studio-inline-spinner { flex: 0 0 12px; width: 12px; height: 12px; box-sizing: border-box; border: 1.5px solid #00bff3; border-right-color: transparent; border-radius: 50%; animation: studio-tool-spin 900ms linear infinite; }
    ${s} .studio-inline-activity[data-thinking="true"] .studio-inline-spinner { flex-basis: 20px; width: 20px; height: 20px; border: 0; border-radius: 0; background: #929298; mask: url("${brain}") center / contain no-repeat; animation: studio-brain-breathe 2400ms ease-in-out infinite; }
    :host(conversation-meter)${s} { display: none; }
    .studio-message-nav, .studio-message-preview { display: none; }
    ${s} .studio-message-nav { position: absolute; z-index: 12; top: 24px; bottom: 24px; left: 6px; width: 22px; display: flex; flex-direction: column; justify-content: center; align-items: center; pointer-events: auto; }
    ${s} .studio-message-nav[hidden], ${s} .studio-message-preview[hidden], ${s} .studio-message-earlier[hidden] { display: none; }
    ${s} .studio-message-markers { flex: 0 1 auto; width: 22px; max-height: 100%; overflow-y: auto; scrollbar-width: none; }
    ${s} .studio-message-markers::-webkit-scrollbar { display: none; }
    ${s} .studio-message-markers button { position: relative; display: block; width: 22px; height: 12px; min-height: 12px; padding: 0; margin: 0; border: 0; background: transparent; cursor: pointer; }
    ${s} .studio-message-markers button::before { content: ""; position: absolute; left: 6px; top: 4px; height: 3px; width: 8px; border-radius: 2px; background: #343a44; transition: width 140ms ease, background-color 140ms ease; }
    ${s} .studio-message-markers button[aria-current="true"]::before { width: 12px; background: #91b2ff; }
    ${s} .studio-message-markers button:hover::before, ${s} .studio-message-markers button:focus-visible::before { width: 16px; background: #c8d8ff; }
    ${s} .studio-message-earlier { flex: 0 0 24px; width: 22px; height: 24px; padding: 0; border: 0; background: transparent; color: #91b2ff; font-size: 14px; }
    ${s} .studio-message-preview { display: block; position: absolute; z-index: 13; left: 36px; max-width: min(360px, calc(100% - 58px)); box-sizing: border-box; padding: 12px 16px; border: 1px solid #ffffff14; border-radius: 14px; background: #16191f; color: #e8e8ed; box-shadow: 0 8px 24px #00000055; font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; pointer-events: none; }
    :host(app-navigation-panel)${s} header button { background: #070b12; border-color: #142033; }
    :host(machine-switcher)${s} .machine-switcher-button { background: #070b12; border-color: #142033; }
    :host(machine-switcher)${s} .machine-icon { filter: brightness(0) saturate(100%) invert(58%) sepia(70%) saturate(2100%) hue-rotate(197deg) brightness(103%) contrast(101%); }
    :host(machine-switcher)${s} .machine-icon.dimmed { opacity: .4; }
    :host(machine-switcher)${s} .machine-status.online { color: #82a8ff; }
    :host(app-navigation-panel)${s} { --pi-text: #e8efff; --pi-muted: #889bb8; }
    ${s} .studio-project-name, ${s} .section-title { color: #899dbf; }
    :host(prompt-editor)${s} .attachment-chip-image { width: 72px; height: 72px; }
    @media (prefers-reduced-motion: reduce) {
      ${s} .studio-message-markers button::before { transition: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      ${s} .studio-inline-spinner { animation: none !important; }
    }

    .studio-session-controls, .studio-session-menu-actions, .studio-session-notice { display: none; }
    ${s} .studio-session-controls { position: absolute; right: 32px; bottom: 6px; display: flex; align-items: center; gap: 2px; z-index: 2; }
    ${s} .studio-session-controls button { display: grid; place-items: center; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 5px; background: transparent; color: #8b9bbb; opacity: 0; }
    ${s} .studio-session-controls button[hidden], ${s} .studio-session-menu-actions button[hidden] { display: none; }
    ${s} .action-row:hover .studio-session-controls button, ${s} .action-row:focus-within .studio-session-controls button, ${s} .studio-session-pin[aria-pressed="true"] { opacity: 1; }
    ${s} .studio-session-pin[aria-pressed="true"] { color: #82a8ff; }
    ${s} .studio-session-controls button:hover { background: #628dff18; color: #c8d8ff; }
    ${s} .studio-session-controls button:disabled { color: #505a6c; cursor: default; }
    ${s} .studio-session-controls button::before { content: ""; width: 14px; height: 14px; background: currentColor; }
    ${s} .studio-session-pin::before { mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='m16 3 5 5-5 2-3 5-3-3-3-3 5-3 2-5ZM10 12l-7 9' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / contain no-repeat; }
    ${s} .studio-session-done::before, ${s} .studio-session-state[data-archived="true"]::before { mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='9' fill='none' stroke='black' stroke-width='1.8'/%3E%3Cpath d='m8 12 3 3 5-6' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / contain no-repeat; }
    ${s} .studio-session-done[data-restore="true"]::before { mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='m8 4-5 5 5 5M3 9h11a6 6 0 0 1 0 12h-4' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / contain no-repeat; }
    ${s} .studio-session-done[data-pending="true"]::before { mask: none; width: 12px; height: 12px; border: 1.5px solid currentColor; border-right-color: transparent; border-radius: 50%; background: transparent; animation: studio-tool-spin 900ms linear infinite; }
    :host(session-list)${s} .action-name { padding-right: 62px; }
    ${s} .studio-session-state[data-archived="true"] { color: #82a8ff; }
    ${s} .studio-session-state[data-archived="true"]::before { content: ""; width: 12px; height: 12px; background: currentColor; }
    ${s} .studio-session-menu-actions { display: block; }
    ${s} .action-menu-panel:has(.studio-session-menu-actions) > button[title="Archive session"] { display: none; }
    :host(session-list)${s} .subheading .section-toggle span { font-size: 0; }
    :host(session-list)${s} .subheading .section-toggle span::after { content: "▸ Done"; font-size: 12px; }
    :host(session-list)${s} .subheading .section-toggle[aria-expanded="true"] span::after { content: "▾ Done"; }
    ${s} .studio-session-notice { display: block; padding: 8px 12px; color: #9bb8ff; font-size: 12px; }
    @media (hover: none) { ${s} .studio-session-controls button { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { ${s} .studio-session-done[data-pending="true"]::before { animation: none; } }

    @media (max-width: 760px) {
      ${s} .context-chip { font-size: 12px; padding: 3px 7px; }
      ${s} .context-bar { padding: 4px 0; }
      ${s} .mobile-tabs { padding: 4px 6px; gap: 4px; }
      :host(app-mobile-main-tabs)${s} button { font-size: 12px; min-height: 36px; padding: 6px 8px; }
      ${s} .mobile-tabs button { font-size: 12px; padding: 6px 8px; }
      ${s} .notification-tray { max-height: 140px; }
      ${s} .chat { padding: 20px 14px; }
      ${s} .msg { margin-bottom: 24px; }
      ${s} .msg.user { padding: 12px 14px; }
      ${s} textarea, ${s} .markdown-editor .cm-editor { font-size: 16px; }
      ${s} .action-main { padding-top: 10px; padding-bottom: 10px; }
    }
    .studio-mobile-header, .studio-mobile-home-intro { display: none; }
    @media (max-width: 760px) {
      ${s} main.chat-view { background: #080808; }
      ${s} app-mobile-main-tabs, ${s} status-bar { display: none; }
      :host(app-context-bar)${s} .context-bar { display: none; }
      :host(app-context-bar)${s} .studio-mobile-header { position: relative; display: grid; grid-template-columns: 40px minmax(0, 1fr) 40px 40px; align-items: center; gap: 4px; padding: 8px 10px; min-height: 44px; background: #121212; }
      ${s} .studio-mobile-header button { display: grid; align-items: center; justify-content: center; min-width: 0; min-height: 40px; padding: 6px; border: 0; border-radius: 10px; color: #eee; background: transparent; }
      ${s} .studio-mobile-header button[hidden], ${s} .studio-mobile-header img[hidden] { display: none; }
      ${s} .studio-mobile-home-icon { width: 24px; height: 24px; justify-self: center; }
      ${s} .studio-mobile-home-intro { display: block; padding: 20px 18px 8px; background: #000; }
      ${s} .studio-mobile-home-intro strong { font-size: 22px; color: #eee; }
      ${s} .studio-mobile-home-intro p { margin: 6px 0 0; color: #929298; font-size: 12px; line-height: 1.5; }
      ${s} .studio-mobile-header svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
      ${s} .studio-mobile-header .studio-mobile-location { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; text-align: left; gap: 3px; }
      ${s} .studio-mobile-header strong, ${s} .studio-mobile-header small { display: block; width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      ${s} .studio-mobile-header strong { font-size: 16px; font-weight: 600; }
      ${s} .studio-mobile-header small { font-size: 11px; color: #99999f; }
      ${s} .studio-mobile-menu { position: absolute; z-index: 40; top: calc(100% - 2px); right: 10px; width: min(280px, calc(100vw - 20px)); max-height: 65dvh; overflow-y: auto; padding: 6px; border: 1px solid #ffffff16; border-radius: 14px; background: #191919; box-shadow: 0 12px 36px #0008; }
      ${s} .studio-mobile-menu[hidden] { display: none; }
      ${s} .studio-mobile-menu button { display: flex; width: 100%; justify-content: flex-start; text-align: left; min-height: 42px; padding: 9px 12px; font-size: 13px; }
      ${s} .studio-mobile-menu button:hover { background: #628dff18; }
      ${s} .studio-mobile-menu button:disabled, ${s} .studio-mobile-header > button:disabled { color: #666; }
      :host(app-navigation-panel)${s} header strong { display: none; }
      :host(chat-view)${s} { background: #080808; border-radius: 22px 22px 0 0; }
      ${s} .chat { padding: 20px 18px 18px; line-height: 1.75; }
      ${s} .msg { font-size: 16px; margin-bottom: 30px; overflow-wrap: anywhere; }
      :host(formatted-text)${s} .formatted { line-height: 1.75; }
      :host(formatted-text)${s} h1 { font-size: 24px; }
      :host(formatted-text)${s} h2 { font-size: 21px; }
      :host(formatted-text)${s} .code-block-wrapper pre { padding: 14px 16px; }
      :host(formatted-text)${s} pre code { font-size: 13px; }
      :host(formatted-text)${s} th, :host(formatted-text)${s} td { padding: 10px 12px; }
      ${s} .msg.assistant > .msg-header { display: none; }
      ${s} .msg.user { display: flex; flex-direction: column; width: fit-content; max-width: 92%; margin-left: auto; margin-right: 0; padding: 14px 16px; border: 0; border-radius: 20px; background: #181818; }
      ${s} .msg.user > .msg-header { order: 2; min-height: 16px; margin: 10px 0 0; justify-content: flex-end; }
      ${s} .msg.user:has(.chat-image) { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 8px; }
      ${s} .msg.user:has(.chat-image) > :not(.chat-image) { grid-column: 1 / -1; }
      ${s} .msg.user .chat-image { order: -1; max-width: 124px; margin-bottom: 10px; --pi-image-max-height: 140px; --pi-image-radius: 10px; }
      ${s} .msg.user .msg-header .label, ${s} .msg.user .msg-action:not([aria-label="Copy user message"]) { display: none; }
      ${s} .msg.user .msg-meta { max-width: 150px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 10px; }
      ${s} .msg-header-trailing { gap: 6px; }
      ${s} .msg.user .msg-actions { opacity: 1; }
      ${s} .studio-message-nav, ${s} .studio-message-preview { display: none; }
      ${s} .event-group { border: 0; }
      ${s} .event-group > summary { font-size: 12px; }
      ${s} .studio-inline-activity { font-size: 12px; padding: 6px 0; }
      :host(prompt-editor)${s} { width: calc(100% - 24px); max-width: none; margin: 0 12px; padding: 8px 0 max(10px, env(safe-area-inset-bottom)); background: #080808; }
      :host(prompt-editor)${s} footer { display: block; padding: 2px 48px 2px 42px; min-height: 44px; border-radius: 25px; border-color: #ffffff08; background: #1b1b1b; }
      :host(prompt-editor)${s} .editor-wrap { width: 100%; }
      :host(prompt-editor)${s} .markdown-editor .cm-content { font-size: 16px; line-height: 1.5; min-height: 24px; padding: 10px 0; }
      :host(prompt-editor)${s} .cm-placeholder { font-size: 16px; }
      :host(prompt-editor)${s} .cm-scroller { max-height: min(160px, 30dvh); overflow-y: auto; }
      :host(prompt-editor)${s} .compact-status { display: none; }
      :host(prompt-editor)${s} .studio-mobile-model-controls { display: flex; align-items: center; gap: 8px; margin: -6px 2px 4px; min-width: 0; }
      :host(prompt-editor)${s} .studio-mobile-model-controls button { display: flex; align-items: center; gap: 8px; min-width: 0; min-height: 44px; padding: 0 20px 0 8px; border: 0; border-radius: 8px; background: transparent; color: #b6b6bf; font-size: 12px; cursor: pointer; }
      :host(prompt-editor)${s} .studio-mobile-model-controls button:hover { background: #ffffff08; }
      :host(prompt-editor)${s} .studio-mobile-model-controls button::after { content: ''; width: 6px; height: 6px; flex-shrink: 0; border-right: 1.5px solid #888; border-bottom: 1.5px solid #888; transform: translateY(-2px) rotate(45deg); }
      :host(prompt-editor)${s} .studio-mobile-model-controls span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      :host(prompt-editor)${s} .studio-mobile-model { flex: 1 1 0; padding-left: 32px !important; }
      :host(prompt-editor)${s} .studio-mobile-model::before { left: 6px; width: 18px; height: 18px; }
      :host(prompt-editor)${s} .studio-mobile-reasoning { flex: 0 1 auto; max-width: 48%; }
      :host(prompt-editor)${s} .actions { position: absolute; right: 6px; bottom: 6px; display: flex; gap: 5px; }
      :host(prompt-editor)${s} .send-button, :host(prompt-editor)${s} .stop-button { width: 36px; height: 36px; min-width: 36px; }
      :host(prompt-editor)${s} .stop-button:disabled { display: none; }
      :host(prompt-editor)${s} .editor-attach, :host(prompt-editor)${s} footer:has(.steer-button) .editor-attach { left: 6px; right: auto; bottom: 6px; width: 32px; height: 36px; }
      :host(prompt-editor)${s} .editor-attach svg { display: none; }
      :host(prompt-editor)${s} .editor-attach::before { content: "+"; font-size: 27px; line-height: 1; color: #e8e8ed; }
      :host(prompt-editor)${s} .steer-button { display: none; }
      :host(prompt-editor)${s} footer:has(.stop-button:not(:disabled)) { padding-right: 90px; }
      :host(prompt-editor)${s} footer[data-studio-text="false"]:has(.stop-button:not(:disabled)) { padding-right: 48px; }
      :host(prompt-editor)${s} footer[data-studio-text="false"]:has(.stop-button:not(:disabled)) .send-button { display: none; }
      :host(prompt-editor)${s} .attachments { gap: 6px; margin: 8px 0 6px; }
      :host(prompt-editor)${s} .attachment-chip { width: 56px; height: 56px; }
      :host(prompt-editor)${s} .attachment-delivery { flex-basis: 100%; }
      :host(prompt-editor)${s} .attachment-delivery::after { font-size: 10px; }
      :host(prompt-editor)${s} footer:has(.attachments) { border-radius: 20px; }
      :host(model-picker)${s} modal-surface { --modal-surface-backdrop-padding: 16px 12px; --modal-surface-width: calc(100vw - 24px); }
    }
    @supports (background-clip: text) {
      ${s} .tool-card.running .tool-title strong, ${s} .tool-card.running .tool-title .summary, ${s} summary[data-studio-thinking], ${s} .activity-dock.active .activity-text, ${s} .studio-tool-label, ${s} .studio-inline-label {
        background-image: linear-gradient(100deg, #929298 0%, #929298 38%, #e8e8ed 48%, #80d8f2 52%, #929298 62%, #929298 100%);
        background-size: 250% 100%; background-clip: text; -webkit-background-clip: text; color: transparent !important;
        animation: studio-text-sheen 3200ms ease-in-out infinite;
      }
    }
    @keyframes studio-brain-breathe { 0%, 100% { opacity: .5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }
    @keyframes studio-text-sheen { from { background-position: 100% 0; } to { background-position: -100% 0; } }
    @keyframes studio-tool-spin { to { transform: rotate(360deg); } }
    @keyframes studio-tool-enter { from { opacity: 0; } to { opacity: 1; } }
    @keyframes studio-details-enter { from { opacity: 0; transform: translateY(-2px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes studio-working-pulse { 0%, 100% { opacity: .45; transform: scale(.85); } 50% { opacity: 1; transform: scale(1); } }
    @media (prefers-reduced-motion: reduce) {
      ${s} button, ${s} .text-body > summary::before { transition: none; }
      ${s} .action-activity .activity-indicator, ${s} .studio-session-state::before { animation: none !important; }
      ${s} .tool-card.running .tool-title strong, ${s} .tool-card.running .tool-title .summary, ${s} summary[data-studio-thinking], ${s} .activity-dock.active .activity-text, ${s} .studio-tool-label, ${s} .studio-inline-label { animation: none !important; background: none; color: #a0a0a5 !important; }
      ${s} summary[data-studio-thinking], ${s} .activity-dock.active .activity-text, ${s} .studio-tool-label, ${s} .studio-inline-label { color: #00bff3 !important; }
      ${s} .tool-card, ${s} .status-icon, ${s} .status-icon::before, ${s} .detail-target, ${s} .detail-result, ${s} .diff, ${s} .activity-dock .dot, ${s} .activity-dock .dot::before, ${s} .activity-dock .dot::after, ${s} summary[data-studio-thinking]::before, ${s} summary[data-studio-thinking]::after, ${s} details.part[open] > formatted-text { animation: none !important; }
    }
  `;
}
