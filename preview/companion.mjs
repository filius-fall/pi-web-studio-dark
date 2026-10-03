import { Type } from 'typebox';
import { runBrowser } from './core.mjs';
const actions = ['open','inspect','click','fill','type','press','scroll','resize','screenshot','back','forward','reload','evaluate','close'];
export default function companion(pi) {
  pi.registerTool({
    name: 'web_preview',
    label: 'Web preview',
    description: 'Control the browser shared with this Pi session’s Studio Preview panel. Open a page, inspect visible elements, click/fill current references, run page JavaScript, and return screenshots. localhost is the selected machine, not the user’s phone.',
    promptGuidelines: ['Inspect before clicking; use the returned element references and inspect again after page changes. Follow user authorization before submitting forms, publishing, buying, or deleting. This browser is isolated from the user’s personal browser profile.'],
    parameters: Type.Object({
      action: Type.Union(actions.map(action => Type.Literal(action))),
      url: Type.Optional(Type.String()), ref: Type.Optional(Type.String()), selector: Type.Optional(Type.String()),
      text: Type.Optional(Type.String()), key: Type.Optional(Type.String()), script: Type.Optional(Type.String()),
      x: Type.Optional(Type.Integer()), y: Type.Optional(Type.Integer()),
      width: Type.Optional(Type.Integer()), height: Type.Optional(Type.Integer()), fullPage: Type.Optional(Type.Boolean()),
    }),
    async execute(_id, params, signal, _onUpdate, ctx) {
      const result = await runBrowser({ cwd: ctx.cwd, sessionId: ctx.sessionManager.getSessionId() }, params.action, params, signal);
      if (params.action === 'screenshot') return { content: [{ type: 'text', text: `Screenshot of ${result.url}` }, { type: 'image', data: result.data, mimeType: result.mimeType }], details: { url: result.url } };
      const text = JSON.stringify(result);
      if (text.length > 50000) throw new Error('Browser result exceeds the text limit. Return a smaller result.');
      return { content: [{ type: 'text', text }], details: result };
    },
  });
}
