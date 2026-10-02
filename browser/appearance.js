// Presentation overrides for Pi Web v1.202610.0. All rules are theme-scoped.
export function appearanceCss(s) {
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
    ${s} aside, ${s} .mobile-navigation-panel { background: #070707; }
    ${s} project-list { flex: 0 1 auto; max-height: 30%; }
    ${s} workspace-list { flex: 0 1 auto; max-height: 22%; }
    ${s} session-list { flex: 1 1 0; }
    :host(app-navigation-panel)${s} header { display: grid; grid-template-columns: 1fr auto; padding: 12px; gap: 8px; }
    :host(app-navigation-panel)${s} header strong { grid-column: 1 / -1; font-size: 11px; letter-spacing: .06em; color: #a8a8b2; }
    ${s} .header-actions { min-width: 0; gap: 6px; }
    ${s} .header-actions machine-switcher { min-width: 0; }
    ${s} .chat { padding: 28px clamp(16px, 4vw, 52px) 24px; line-height: 1.7; }
    ${s} .msg { max-width: 850px; margin: 0 auto 28px; font-size: 14px; }
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
    ${s} .activity-dock { border: 0; border-radius: 6px 6px 0 0; background: #191919; }
    ${s} .activity-dock.active { color: #00bff3; background: #151515; }
    ${s} .activity-indicator.session, ${s} .activity-indicator.sending { background: #00bff3; }
    ${s} .tool-card, ${s} .tool-card.pending, ${s} .tool-card.running, ${s} .tool-card.success { border: 0; border-top: 1px solid #ffffff0c; border-radius: 0; background: transparent; padding: 10px 0; gap: 6px; }
    ${s} .tool-title { gap: 8px; font-size: 13px; }
    ${s} .tool-title strong { color: #a0a0a5; font-weight: 500; }
    ${s} .tool-title .summary, ${s} .tool-title .path { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    ${s} .tool-title .summary { color: #929298; }
    ${s} .tool-meta, ${s} .status-label { color: #89898f; font-size: 10px; letter-spacing: 0; text-transform: none; }
    ${s} .tool-card.running .status-icon, ${s} .tool-card.pending .status-icon, ${s} .tool-card.running .status-label { color: #00bff3; }
    ${s} .tool-card.success .status-icon { color: #34d399; }
    ${s} .tool-card.error .status-icon, ${s} .tool-card.error .status-label { color: var(--pi-danger); }
    ${s} .text-body, ${s} .diff-details { border-top: 0; padding-top: 2px; }
    ${s} .text-body > summary, ${s} .diff-details > summary { color: #929298; font-size: 12px; }
    ${s} .msg.event-group > summary { color: #929298; padding: 6px 0; }
    ${s} .msg.event-group > summary .label { text-transform: none; font-weight: 400; }
    ${s} .group-body { padding-left: 0; padding-right: 0; }

    ${s} .action-row { margin: 3px 0; border-radius: 10px; overflow: clip; }
    ${s} .action-main, ${s} .action-menu-toggle { border: 0; border-radius: 0; background: transparent; font-size: 13px; }
    ${s} .action-main { padding-top: 8px; padding-bottom: 8px; }
    ${s} .action-row.selected .action-main, ${s} .action-row.selected .action-menu-toggle { border: 0; background: #202020; color: #fafafa; }
    ${s} .action-row.selected { box-shadow: none; }
    ${s} .action-row.selected .action-main { background: #202020; box-shadow: none; }
    ${s} .action-row:not(.selected):hover .action-main, ${s} .action-menu-toggle:hover { background: #191919; }
    ${s} .action-name { font-size: 13px; line-height: 1.5; }
    ${s} .action-main small { font-size: 11px; line-height: 1.5; margin-top: 2px; color: #9c9ca6; }
    ${s} .action-menu-toggle { min-width: 28px; }
    ${s} section > h2 { font-size: 11px; font-weight: 500; letter-spacing: .05em; box-shadow: none; background: transparent; padding-top: 8px; padding-bottom: 8px; }
    ${s} .section-toggle { text-transform: none; letter-spacing: 0; }
    ${s} .section-title { font-weight: 600; }
    ${s} .tabs button { border-color: transparent; background: transparent; font-size: 12px; padding: 6px 9px; }
    ${s} .tabs button.selected { border-color: #ffffff12; background: #202020; color: #fafafa; }
    ${s} .markdown-editor .cm-editor, ${s} textarea { border-radius: 16px; border-color: #ffffff12; background: #191919; font-size: 14px; }
    ${s} .markdown-editor .cm-editor.cm-focused, ${s} textarea:focus { outline: none; border-color: #628dff; }
    ${s} .editor-wrap { border-radius: 12px; }
    ${s} .notification-tray { background: #1c1c1c; max-height: min(180px, 24vh); }
    ${s} .notification-header { background: #1c1c1c; min-height: 34px; }
    ${s} .notification-heading { font-size: 12px; font-weight: 500; }
    ${s} .notification-row { font-size: 12px; line-height: 1.5; }
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
    @media (prefers-reduced-motion: reduce) {
      ${s} button { transition: none; }
    }
  `;
}
