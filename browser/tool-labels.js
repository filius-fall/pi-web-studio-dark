// Presentation only: never change the tool's arguments or expanded details.
export function toolActionKind(execution) {
  const name = (execution.toolName || '').toLowerCase();
  if (/browser|playwright|puppeteer|preview/.test(name)) return 'browser';
  if (/(?:^|[_:.-])(?:bash|shell|exec_command|run_command|terminal)$/.test(name)) return 'terminal';
  if (/apply_patch|edit|write|create_file/.test(name)) return 'edit';
  if (/view_image|read_image/.test(name)) return 'image';
  if (/search|grep|find/.test(name)) return 'search';
  if (/read/.test(name)) return 'book';
  if (/wait|sleep/.test(name)) return 'clock';
  return 'tool';
}

export function toolActionName(execution) {
  const name = (execution.toolName || '').toLowerCase();
  const args = execution.args && typeof execution.args === 'object' ? execution.args : {};
  const command = typeof args.command === 'string' ? args.command : '';
  const summary = typeof execution.summary === 'string' ? execution.summary.trim() : '';
  const shell = /(?:^|[_:.-])(?:bash|shell|exec_command|run_command|terminal)$/.test(name);
  // Keep explicit descriptive summaries, but do not mistake input, paths, or
  // shell syntax for a human-readable label.
  if (summary && summary !== command && summary.length <= 64 &&
      /^(?:run|check|read|write|edit|update|inspect|open|capture|search|fetch|list|test|build|save|load|install|verify|compare)\b/i.test(summary) &&
      !/[\n{}<>/\\]|&&|\|\||[;$`=]/.test(summary) &&
      (!shell || !/^(?:cd|ls|cat|sed|grep|rg|find|git|npm|pnpm|yarn|node|python\d*|curl|ssh|tail|head|echo|printf)\b/.test(summary))) return summary;
  if (shell) return commandAction(command || summary);
  if (/browser|playwright|puppeteer|preview/.test(name)) {
    const action = typeof args.action === 'string' ? args.action : name;
    if (/screenshot|snapshot/.test(action)) return 'Capture page';
    if (/navigate|open|goto/.test(action)) return 'Open page';
    if (/click/.test(action)) return 'Click element';
    if (/fill|type/.test(action)) return 'Fill field';
    if (/evaluate|script/.test(action)) return 'Run browser script';
    if (/status|inspect/.test(action)) return 'Inspect page';
    return 'Use browser';
  }
  if (/view_image|read_image/.test(name)) return 'Read image';
  if (/search|grep|find/.test(name)) return 'Search files';
  if (/read/.test(name)) return 'Read file';
  if (/apply_patch|edit/.test(name)) return 'Edit file';
  if (/write|create_file/.test(name)) return 'Write file';
  if (/fetch|web/.test(name)) return 'Fetch page';
  if (/wait|sleep/.test(name)) return 'Wait for result';
  const readable = name.replace(/^mcp__(?:[^_]+)__/, '').replace(/[_:.-]+/g, ' ').trim();
  return readable && readable.length <= 32 ? readable[0].toUpperCase() + readable.slice(1) : 'Run tool';
}

export function activitySummary(executions) {
  const counts = new Map();
  for (const execution of executions) {
    const name = (execution.toolName || '').toLowerCase();
    const category = /browser|playwright|puppeteer|preview/.test(name) ? 'browser' :
      /(?:^|[_:.-])(?:bash|shell|exec_command|run_command|terminal)$/.test(name) ? 'command' :
      /apply_patch|edit|write|create_file/.test(name) ? 'file' :
      /view_image|read_image/.test(name) ? 'image' : /search|grep|find/.test(name) ? 'search' :
      /read/.test(name) ? 'read' : 'tool';
    counts.set(category, (counts.get(category) || 0) + 1);
  }
  const running = executions.some(e => ['pending', 'running'].includes(e.status));
  const phrases = [];
  for (const [category, count] of counts) {
    const times = count === 1 ? 'once' : `${count} times`;
    const phrase = category === 'command' ? `${running ? 'Running' : 'Ran'} ${count} command${count === 1 ? '' : 's'}` :
      category === 'browser' ? `${running ? 'Using' : 'Used'} browser ${times}` :
      category === 'file' ? `${running ? 'Editing' : 'Edited'} files ${times}` :
      category === 'image' ? `${running ? 'Reading' : 'Read'} ${count} image${count === 1 ? '' : 's'}` :
      category === 'search' ? `${running ? 'Searching' : 'Searched'} ${times}` :
      category === 'read' ? `${running ? 'Reading' : 'Read'} ${count} file${count === 1 ? '' : 's'}` :
      `${running ? 'Using' : 'Used'} ${count} tool${count === 1 ? '' : 's'}`;
    phrases.push(phrases.length ? phrase[0].toLowerCase() + phrase.slice(1) : phrase);
  }
  return phrases.length > 1 ? `${phrases.slice(0, -1).join(', ')} and ${phrases.at(-1)}` : phrases[0] || 'Activity';
}

function commandAction(command) {
  // Classify the main operation before supporting commands in a pipeline.
  if (/\bnohup\b/.test(command)) return 'Run background script';
  if (/(?:^|[\s;&|])(?:\.?\.?\/|\/)[^\s;&|]+\.(?:sh|bash)\b/.test(command)) return 'Run script';
  if (/\b(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?(?:test|check|lint|typecheck)\b|\b(?:pytest|vitest|jest)\b/.test(command)) return 'Run checks';
  if (/\b(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?build\b/.test(command)) return 'Build project';
  if (/\bgit\s+(?:-C\s+\S+\s+)?push\b/.test(command)) return 'Push changes';
  if (/\bgit\s+(?:-C\s+\S+\s+)?(?:diff|status|log|show)\b/.test(command)) return 'Inspect Git changes';
  if (/\bgit\s+(?:-C\s+\S+\s+)?(?:pull|fetch)\b/.test(command)) return 'Update checkout';
  if (/\bssh\b/.test(command)) return 'Run remote command';
  if (/\b(?:curl|wget)\b/.test(command)) return 'Fetch URL';
  if (/\b(?:python\d*|python\d*\.\d+)\b/.test(command)) return 'Run Python';
  if (/\bnode\b/.test(command)) return 'Run Node.js';
  if (/\b(?:rg|grep|find|cat|tail|head|sed)\b/.test(command) && /\.log\b|journalctl\b/.test(command)) return 'Check logs';
  if (/\bjournalctl\b/.test(command)) return 'Check logs';
  if (/\b(?:rg|grep|find)\b/.test(command)) return 'Search files';
  if (/\b(?:cat|head|tail|sed)\b/.test(command)) return 'Read file';
  if (/\bls\b/.test(command)) return 'List files';
  return 'Run command';
}
