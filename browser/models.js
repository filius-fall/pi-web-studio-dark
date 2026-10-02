import { decorateAttachmentDelivery, clearAttachmentDeliveryMenu } from './attachment-delivery.js';
const attachmentSelects = new WeakSet();
export function modelBrand(value) {
  function identify(name) {
    if (/gemini/.test(name)) return 'gemini';
    if (/glm|\bzai\b|z-ai/.test(name)) return 'zai';
    if (/deepseek/.test(name)) return 'deepseek';
    if (/grok|\bxai\b|x-ai/.test(name)) return 'grok';
    if (/kimi|moonshot/.test(name)) return 'kimi';
    if (/claude|anthropic/.test(name)) return 'claude';
    if (/muse/.test(name)) return 'muse';
    if (/nemotron|nemtron|nvidia/.test(name)) return 'nemotron';
    if (/qwen|qwq/.test(name)) return 'qwen';
    if (/minimax/.test(name)) return 'minimax';
    if (/mimo|xiaomi/.test(name)) return 'mimo';
    if (/hunyuan|(?:^|[-_/])hy[-_]?[34](?:[-_.:]|$)/.test(name)) return 'hunyuan';
    if (/gpt|openai|chatgpt/.test(name)) return 'openai';
    return undefined;
  }
  const name = value.toLowerCase();
  // A model's family takes precedence over an API gateway or routing provider.
  return identify(name.split('/').at(-1)) ?? identify(name) ?? 'generic';
}
function modelName(value) {
  const id = value.split('/').at(-1);
  if (/^gpt-/i.test(id)) return id.replace(/^gpt-/i, 'GPT-').replace(/-(sol|luna|mini|nano|flash)$/i, (_, suffix) => ` ${suffix[0].toUpperCase()}${suffix.slice(1)}`);
  if (/^glm-/i.test(id)) return id.replace(/^glm-/i, 'GLM-').replace(/-flash$/i, ' Flash');
  if (/^gemini-/i.test(id)) return id.replace(/^gemini-/i, 'Gemini ').replace(/-(flash|pro)$/i, (_, suffix) => ` ${suffix[0].toUpperCase()}${suffix.slice(1)}`);
  if (/^deepseek-/i.test(id)) return id.replace(/^deepseek-/i, 'DeepSeek ').replace(/-(flash|pro)$/i, (_, suffix) => ` ${suffix[0].toUpperCase()}${suffix.slice(1)}`);
  return id;
}
function setText(element, value) {
  if (element.textContent !== value) element.textContent = value;
}
export function decorateModels(root) {
  if (root.host?.localName === 'prompt-editor') {
    const footer = root.querySelector('footer');
    if (footer) footer.dataset.studioText = String((root.host.draft ?? '').trim().length > 0 || (root.host.attachments?.length ?? 0) > 0);
    const placeholder = root.querySelector('.cm-placeholder');
    if (placeholder) setText(placeholder, document.documentElement.dataset.piWebTheme === 'vitesse:black' ? 'Ask Pi…' : 'Message pi... Use / for commands, @ for tracked files, @ space for all files, # for models');
    const button = root.querySelector('.select-model');
    const model = root.host.status?.model;
    if (button && model?.id) {
      button.dataset.studioBrand = modelBrand(`${model.provider}/${model.id}`);
      button.dataset.studioLabel = modelName(model.id);
    }
    const thinking = root.querySelector('.select-thinking');
    if (thinking) {
      const level = root.host.status?.thinkingLevel;
      const label = level === 'xhigh' ? 'Extra high' : typeof level === 'string' ? level[0].toUpperCase() + level.slice(1) : 'Default';
      thinking.dataset.studioReasoning = `Reasoning: ${label}`;
    }
    const delivery = root.querySelector('.attachment-delivery');
    const select = delivery?.querySelector('select');
    if (select && document.documentElement.dataset.piWebTheme !== 'vitesse:black') clearAttachmentDelivery(root);
    if (select && document.documentElement.dataset.piWebTheme === 'vitesse:black') {
      if (!delivery.hasAttribute('data-studio-delivery-title')) delivery.dataset.studioDeliveryTitle = delivery.title;
      if (!attachmentSelects.has(select)) {
        attachmentSelects.add(select);
        select.addEventListener('change', () => { Promise.resolve(root.host.updateComplete).then(() => decorateModels(root)); });
      }
      const inline = select.querySelector('option[value="inline"]');
      const folder = select.querySelector('option[value="folder"]');
      if (inline) inline.label = inline.disabled ? 'Send images with message (images only)' : 'Send images with message';
      if (folder) folder.label = 'Save files to workspace';
      const path = root.host.attachmentsFolder ?? '.pi-web/attachments';
      const help = select.value === 'inline' ? 'The model sees these images directly.' : `Saved on the selected machine in ${path}; Pi receives their paths.`;
      delivery.dataset.studioHelp = help;
      delivery.title = help;
      decorateAttachmentDelivery(select);
    }
    return;
  }
  if (root.host?.localName !== 'model-picker') return;
  const values = root.host.visibleRows?.() ?? [];
  const buttons = [...root.querySelectorAll('.options > button, .default-row > button:not(.default-pin), .catalog-row > button.membership')];
  for (const [index, button] of buttons.entries()) {
    const value = values[index]?.value;
    if (!value) continue;
    button.dataset.studioBrand = modelBrand(value);
    button.dataset.studioCurrent = String(value === root.host.selectedValue);
    let label = button.querySelector('.studio-model-name');
    if (!label) {
      label = document.createElement('span');
      label.className = 'studio-model-name';
      button.append(label);
    }
    setText(label, modelName(value));
    let current = button.querySelector('.studio-model-current');
    if (value === root.host.selectedValue && !current) {
      current = document.createElement('span');current.className = 'studio-model-current';current.textContent = 'Current';button.append(current);
    } else if (value !== root.host.selectedValue) current?.remove();
  }
}
function clearAttachmentDelivery(root) {
  const delivery = root.querySelector('.attachment-delivery');
  if (!delivery) return;
  const select = delivery.querySelector('select');
  if (select) clearAttachmentDeliveryMenu(select);
  for (const option of delivery.querySelectorAll('option')) option.removeAttribute('label');
  if (delivery.hasAttribute('data-studio-delivery-title')) delivery.title = delivery.dataset.studioDeliveryTitle;
  delivery.removeAttribute('data-studio-delivery-title');delivery.removeAttribute('data-studio-help');
}
export function clearModels(root) {
  clearAttachmentDelivery(root);
  const placeholder = root.querySelector('.cm-placeholder');
  if (placeholder) setText(placeholder, 'Message pi... Use / for commands, @ for tracked files, @ space for all files, # for models');
  root.querySelector('footer')?.removeAttribute('data-studio-text');
  for (const element of root.querySelectorAll('.studio-model-name, .studio-model-current')) element.remove();
  for (const element of root.querySelectorAll('[data-studio-brand], [data-studio-reasoning]')) {
    for (const name of ['data-studio-brand', 'data-studio-label', 'data-studio-current', 'data-studio-reasoning']) element.removeAttribute(name);
  }
}
