import { runBrowser, closeAll } from './core.mjs';
export default {
  apiVersion: 3,
  name: 'Studio Preview',
  activate() {
    return {
      peer: {
        async request(context) {
          context.signal.throwIfAborted();
          const input = context.input;
          if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid preview request.');
          return runBrowser({ cwd: context.workspace.path, sessionId: input.sessionId }, context.operation, input, context.signal);
        },
      },
      dispose: closeAll,
    };
  },
};
