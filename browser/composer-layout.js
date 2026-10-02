// Keep the composer on the actual conversation column, including scrollbar space.
export function createComposerLayout() {
  let chat, editor, scroller;
  const observer = new ResizeObserver(sync);
  function clear() {
    editor?.style.removeProperty('--studio-composer-width');
    editor?.style.removeProperty('--studio-composer-left');
  }
  function sync() {
    if (!editor || !scroller) return;
    if (document.documentElement.dataset.piWebTheme !== 'vitesse:black') { clear();return; }
    const message = scroller.querySelector('.msg');
    const box = scroller.getBoundingClientRect();
    const style = getComputedStyle(scroller);
    const available = scroller.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const width = message?.getBoundingClientRect().width ?? Math.min(850, available);
    const left = message?.getBoundingClientRect().left ?? box.left + parseFloat(style.paddingLeft) + (available - width) / 2;
    if (box.width <= 0 || width <= 0) { clear();return; }
    const parent = editor.parentElement.getBoundingClientRect();
    for (const [name, value] of [['--studio-composer-width', `${width}px`], ['--studio-composer-left', `${left - parent.left}px`]]) {
      if (editor.style.getPropertyValue(name) !== value) editor.style.setProperty(name, value);
    }
  }
  return {
    decorate(root) {
      if (root.host?.localName !== 'pi-web-app') return;
      const nextChat = root.querySelector('chat-view'), nextEditor = root.querySelector('prompt-editor');
      const nextScroller = nextChat?.shadowRoot?.querySelector('.chat');
      if (chat !== nextChat || editor !== nextEditor || scroller !== nextScroller) {
        clear();observer.disconnect();chat = nextChat;editor = nextEditor;scroller = nextScroller;
        if (scroller) observer.observe(scroller);
      }
      sync();
    },
    sync,
    dispose() { observer.disconnect();clear(); }
  };
}
