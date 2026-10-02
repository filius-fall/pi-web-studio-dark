// Keep Pi Web's select as the source of truth, with a themed, light-dismiss menu.
const controls = new WeakMap();
export function decorateAttachmentDelivery(select) {
  let control = controls.get(select);
  if (!control) {
    const button = document.createElement('button');
    button.type = 'button';button.className = 'studio-delivery-toggle';
    button.setAttribute('aria-label', 'Attachment delivery');
    button.setAttribute('aria-haspopup', 'menu');button.setAttribute('aria-expanded', 'false');
    const menu = document.createElement('div');
    menu.className = 'studio-delivery-menu';menu.setAttribute('popover', 'auto');menu.setAttribute('role', 'menu');
    const items = ['inline', 'folder'].map(value => {
      const item = document.createElement('button');
      item.type = 'button';item.dataset.value = value;item.setAttribute('role', 'menuitemradio');
      const label = document.createElement('strong'), help = document.createElement('small');
      item.append(label, help);menu.append(item);
      item.addEventListener('click', () => {
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        menu.hidePopover();button.focus();
      });
      return item;
    });
    function open() {
      menu.showPopover();
      const box = button.getBoundingClientRect();
      const width = Math.min(320, innerWidth - 24);
      menu.style.width = `${width}px`;
      menu.style.left = `${Math.max(12, Math.min(box.left, innerWidth - width - 12))}px`;
      const height = menu.getBoundingClientRect().height;
      menu.style.top = `${Math.max(12, Math.min(box.bottom + 6, innerHeight - height - 12))}px`;
      (items.find(item => item.dataset.value === select.value && !item.disabled) ?? items.find(item => !item.disabled))?.focus();
    }
    button.addEventListener('click', () => menu.matches(':popover-open') ? menu.hidePopover() : open());
    button.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault();open(); }
    });
    menu.addEventListener('toggle', () => button.setAttribute('aria-expanded', String(menu.matches(':popover-open'))));
    menu.addEventListener('keydown', event => {
      const enabled = items.filter(item => !item.disabled);
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const current = enabled.indexOf(menu.getRootNode().activeElement);
        const index = event.key === 'Home' ? 0 : event.key === 'End' ? enabled.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length;
        enabled[index]?.focus();
      } else if (event.key === 'Escape') { event.preventDefault();menu.hidePopover();button.focus(); }
      else if (event.key === 'Tab') menu.hidePopover();
    });
    select.after(button, menu);select.dataset.studioDeliveryNative = '';
    control = { button, menu, items };controls.set(select, control);
  }
  const label = select.selectedOptions[0]?.label ?? 'Attachment delivery';
  if (control.button.textContent !== label) control.button.textContent = label;
  control.button.disabled = select.disabled;
  for (const item of control.items) {
    const option = select.querySelector(`option[value="${item.dataset.value}"]`);
    item.disabled = !option || option.disabled;
    item.setAttribute('aria-checked', String(item.dataset.value === select.value));
    const label = option?.label ?? item.dataset.value;
    const help = item.dataset.value === 'inline' ? 'The model sees the images directly.' : 'Save on the selected machine; Pi receives file paths.';
    if (item.firstChild.textContent !== label) item.firstChild.textContent = label;
    if (item.lastChild.textContent !== help) item.lastChild.textContent = help;
  }
}
export function clearAttachmentDeliveryMenu(select) {
  const control = controls.get(select);
  if (!control) return;
  control.menu.hidePopover();control.button.remove();control.menu.remove();
  select.removeAttribute('data-studio-delivery-native');controls.delete(select);
}
