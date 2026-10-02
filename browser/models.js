function brand(value) {
  const name = value.toLowerCase();
  if (/gemini/.test(name)) return 'gemini';
  if (/glm|\bzai\b|z-ai/.test(name)) return 'zai';
  if (/deepseek/.test(name)) return 'deepseek';
  if (/gpt|openai|chatgpt/.test(name)) return 'openai';
  return 'generic';
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
    const button = root.querySelector('.select-model');
    const model = root.host.status?.model;
    if (button && model?.id) {
      button.dataset.studioBrand = brand(`${model.provider}/${model.id}`);
      button.dataset.studioLabel = modelName(model.id);
    }
    const thinking = root.querySelector('.select-thinking');
    if (thinking) {
      const level = root.host.status?.thinkingLevel;
      const label = level === 'xhigh' ? 'Extra high' : typeof level === 'string' ? level[0].toUpperCase() + level.slice(1) : 'Default';
      thinking.dataset.studioReasoning = `Reasoning: ${label}`;
    }
    return;
  }
  if (root.host?.localName !== 'model-picker') return;
  const values = root.host.visibleRows?.() ?? [];
  const buttons = [...root.querySelectorAll('.options > button, .default-row > button:not(.default-pin), .catalog-row > button.membership')];
  for (const [index, button] of buttons.entries()) {
    const value = values[index]?.value;
    if (!value) continue;
    button.dataset.studioBrand = brand(value);
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
export function clearModels(root) {
  for (const element of root.querySelectorAll('.studio-model-name, .studio-model-current')) element.remove();
  for (const element of root.querySelectorAll('[data-studio-brand], [data-studio-reasoning]')) {
    for (const name of ['data-studio-brand', 'data-studio-label', 'data-studio-current', 'data-studio-reasoning']) element.removeAttribute(name);
  }
}
