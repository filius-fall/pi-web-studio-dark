// The host owns machine/workspace routing; this panel uses its package-paired peer.
const icons = {
  back: '<path d="m14 6-6 6 6 6"/>', forward: '<path d="m10 6 6 6-6 6"/>',
  reload: '<path d="M20 7v5h-5M19 12a7 7 0 1 1-2-5"/>',
  camera: '<rect x="3" y="6" width="18" height="15" rx="3"/><path d="m8 6 2-3h4l2 3"/><circle cx="12" cy="13" r="3"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
};
const icon = key => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[key]}</svg>`;
class StudioPreview extends HTMLElement {
  constructor() {
    super();this.attachShadow({ mode: 'open' });this.busy = false;this.timer = null;this.generation = 0;
    this.shadowRoot.innerHTML = `<style>
      :host{display:flex;flex-direction:column;height:100%;min-height:320px;color:#d8d8e2;font:13px system-ui,sans-serif;background:#18181b}
      *{box-sizing:border-box} .toolbar{display:flex;gap:6px;padding:12px;align-items:center;border-bottom:1px solid #ffffff12;flex-wrap:wrap}
      button,input,select{font:inherit;color:inherit;border:1px solid #ffffff14;background:#25252a;border-radius:8px;min-height:32px}
      button{cursor:pointer;padding:6px 8px}button:hover{background:#303038}button:disabled{opacity:.4;cursor:default}
      button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #7198ff;outline-offset:2px}
      input{flex:1;min-width:120px;padding:6px 10px}svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;vertical-align:middle}
      .screen{overflow:auto;flex:1;display:grid;place-items:start center;padding:12px;background:#111113;min-height:0}.screen:focus-visible{outline:2px solid #7198ff;outline-offset:-2px}
      [hidden]{display:none!important}
      img{display:block;width:100%;height:auto;border-radius:6px;box-shadow:0 8px 32px #0004;cursor:crosshair;user-select:none}
      .empty{margin:auto;max-width:320px;text-align:center;line-height:1.8;color:#9393a5}.empty strong{display:block;color:#e5e5ed;font-size:18px;margin-bottom:8px}
      .status{padding:10px 14px;font-size:11px;color:#9797aa;border-top:1px solid #ffffff0b;line-height:1.6;overflow-wrap:anywhere}.status[data-error]{color:#eea5b0}
      select{padding:4px} .typing{display:flex;gap:6px;padding:8px 12px;border-top:1px solid #ffffff0b}.typing input{min-width:80px}
    </style><div class="toolbar">
      <button data-action="back" title="Back" aria-label="Back">${icon('back')}</button><button data-action="forward" title="Forward" aria-label="Forward">${icon('forward')}</button><button data-action="reload" title="Reload" aria-label="Reload">${icon('reload')}</button>
      <input class="url" type="text" aria-label="Preview URL" placeholder="http://localhost:3000" spellcheck="false"><button class="open">Open</button>
      <select aria-label="Viewport"><option value="1280,800">Desktop</option><option value="390,800">Mobile</option></select>
      <button class="capture" title="Save screenshot" aria-label="Save screenshot">${icon('camera')}</button><button data-action="close" title="Close browser" aria-label="Close browser">${icon('close')}</button>
    </div><div class="screen" tabindex="0" aria-label="Interactive web preview"><div class="empty"><strong>Your app, in view</strong>Open a running app or website. You and the agent share this session’s browser.<br>Click the preview to interact; use the field below to type.</div><img hidden alt="Live page from the shared preview browser" draggable="false"></div>
    <div class="typing"><input aria-label="Type into focused page field" placeholder="Type into the focused page field…"><button>Type</button><button class="enter">Enter ↵</button></div><div class="status" role="status">Select a saved session to start.</div>`;
    this.$ = selector => this.shadowRoot.querySelector(selector);
    this.$('.open').onclick = () => this.perform('open', { url: this.$('.url').value });
    this.$('.url').onkeydown = event => { if (event.key === 'Enter') this.$('.open').click(); };
    for (const button of this.shadowRoot.querySelectorAll('[data-action]')) button.onclick = () => this.perform(button.dataset.action);
    this.$('select').onchange = () => { const [width,height] = this.$('select').value.split(',').map(Number);void this.perform('resize',{width,height}); };
    this.$('.capture').onclick = () => this.perform('screenshot', {}, result => {
      const bytes = Uint8Array.from(atob(result.data), character => character.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: result.mimeType }));
      const link = document.createElement('a');link.href = url;link.download = 'preview.png';link.click();setTimeout(() => URL.revokeObjectURL(url),1000);
    });
    this.$('img').onclick = event => { const box = event.target.getBoundingClientRect();if (!this.viewport) return;
      void this.perform('click',{x:Math.min(this.viewport.width-1,Math.max(0,Math.floor((event.clientX-box.left)*this.viewport.width/box.width))),y:Math.min(this.viewport.height-1,Math.max(0,Math.floor((event.clientY-box.top)*this.viewport.height/box.height)))}); };
    this.$('.screen').onkeydown = event => {
      if (!this.viewport || event.ctrlKey || event.metaKey || event.altKey) return;
      if (['Tab','Enter','Escape','Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageDown','PageUp'].includes(event.key)) {
        event.preventDefault();void this.perform('press',{key:(event.shiftKey?'Shift+':'')+event.key});
      } else if (event.key.length === 1) { event.preventDefault();void this.perform('type',{text:event.key}); }
    };
    this.$('.screen').addEventListener('wheel',event=>{if(!this.viewport||this.busy)return;event.preventDefault();void this.perform('scroll',{y:Math.max(-2000,Math.min(2000,Math.round(event.deltaY)))});},{passive:false});
    this.$('.typing button').onclick = () => {const input=this.$('.typing input');const text=input.value;void this.perform('type',{text},()=>{input.value='';});};
    this.$('.enter').onclick = () => this.perform('press',{key:'Enter'});
  }
  set context(value) {
    const key = `${value.machine.id}:${value.workspace.id}:${value.state?.selectedSession?.id || ''}`;
    this._context=value;
    if(this.key!==key){this.key=key;this.generation++;this.controller?.abort();this.busy=false;this.viewport=null;this.$('img').hidden=true;this.$('.empty').hidden=false;this.schedule(0);}
  }
  connectedCallback(){this.schedule(0);}
  disconnectedCallback(){clearTimeout(this.timer);this.generation++;this.controller?.abort();}
  message(text,error=false){this.$('.status').textContent=text;this.$('.status').toggleAttribute('data-error',error);}
  async request(action,input){
    const context=this._context,session=context?.state?.selectedSession;
    if(!session?.id||session.pending)throw Error('Select a saved session before opening Preview.');
    if(!context.peer?.request)throw Error('Enable Studio Preview on this machine, then restart Pi Web when sessions are idle.');
    return context.peer.request(action,{...input,sessionId:session.id},{signal:this.controller.signal});
  }
  async perform(action,input={},consume){
    if(this.busy||!this.isConnected)return;this.busy=true;clearTimeout(this.timer);
    const generation=this.generation;this.controller=new AbortController();
    try{const result=await this.request(action,input);if(generation!==this.generation)return;
      consume?.(result);this.message(action==='close'?'Browser closed.':'Shared browser · '+(result.url||'Ready'));await this.frame();
    }catch(error){if(generation===this.generation&&error.name!=='AbortError')this.message(error.message,true);}
    finally{if(generation===this.generation){this.busy=false;this.schedule();}}
  }
  async frame(){
    const generation=this.generation,result=await this.request('frame',{});if(generation!==this.generation)return;
    this.viewport=result.open?result.viewport:null;this.$('img').hidden=!result.open;this.$('.empty').hidden=!!result.open;
    if(result.open){this.$('img').src=`data:${result.mimeType};base64,${result.data}`;if(this.shadowRoot.activeElement!==this.$('.url'))this.$('.url').value=result.url;this.message('Shared browser · '+result.viewport.width+' × '+result.viewport.height+' · '+this._context.machine.name);}
  }
  schedule(delay=1500){clearTimeout(this.timer);if(!this.isConnected)return;this.timer=setTimeout(async()=>{
    if(document.hidden||!this.getClientRects().length||!this._context?.state?.selectedSession?.id){this.schedule();return;}
    if(this.busy){this.schedule();return;}const generation=this.generation;this.busy=true;this.controller=new AbortController();
    try{await this.frame();}catch(error){if(generation===this.generation&&error.name!=='AbortError')this.message(error.message,true);}finally{if(generation===this.generation){this.busy=false;this.schedule(this.viewport?1500:5000);}}
  },delay);}
}
export default {
  apiVersion:4,name:'Studio Preview',
  activate({html,svg,runtimePluginId}) {
    if(!customElements.get('studio-web-preview'))customElements.define('studio-web-preview',StudioPreview);
    return {contributions:{actions:[{id:'open-preview',title:'Open Web Preview',run:context=>context.selectWorkspaceTool(`${runtimePluginId}:workspace.preview`)}],workspacePanels:[{
      id:'workspace.preview',title:'Preview',order:30,icon:svg`<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 9h18" stroke="currentColor"/></svg>`,
      render:context=>html`<studio-web-preview .context=${context}></studio-web-preview>`,
    }]}};
  },
};
