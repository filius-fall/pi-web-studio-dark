// Status is authoritative. Activity labels may lag behind the completed run.
export function sessionIsBusy(host) {
  if (host.isSendingPrompt) return true;
  if (host.status) return Boolean(host.status.isStreaming || host.status.isBashRunning || host.status.isCompacting);
  return host.activity?.phase === 'active';
}
