// Keep new follow-ups durable in this browser until delivered through Pi Web’s
// native callback. Existing server-queued messages remain owned by Pi Web.
const roots = new Map();
let database;
function db() {
  database ||= new Promise((resolve,reject)=>{const request=indexedDB.open('pi-studio-message-queue',1);request.onupgradeneeded=()=>request.result.createObjectStore('messages',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
  return database;
}
async function storage(mode,action) {
  const database=await db();return new Promise((resolve,reject)=>{const transaction=database.transaction('messages',mode),request=action(transaction.objectStore('messages'));let result;
    request.onsuccess=()=>{result=request.result;};transaction.oncomplete=()=>resolve(result);transaction.onerror=()=>reject(transaction.error);transaction.onabort=()=>reject(transaction.error);});
}
const identity=host=>host.machineId&&host.sessionId?`${host.machineId}:${host.sessionId}`:null;
const active=host=>host.canSteer||host.isCompacting||host.sending||host.status?.isStreaming||host.status?.isBashRunning;
function paint(root,state) {
  let tray=root.querySelector('.studio-composer-queue');
  if(!tray){tray=document.createElement('div');tray.className='studio-composer-queue';tray.setAttribute('aria-label','Queued messages');root.prepend(tray);}
  const signature=JSON.stringify([state.session,!!root.host.sending,!!root.host.isCompacting,state.entries.map(entry=>[entry.id,!!entry.claimed,!!entry.failed])]);
  if(tray.dataset.signature===signature)return;tray.dataset.signature=signature;
  tray.replaceChildren();
  for(const entry of state.entries.filter(item=>item.session===state.session)) {
    const card=document.createElement('article');card.className='studio-queued-card';
    const text=document.createElement('p');text.textContent=entry.args[0];card.append(text);
    if(entry.args[2]?.length){const count=document.createElement('small');count.textContent=`${entry.args[2].length} attachment${entry.args[2].length===1?'':'s'}`;card.append(count);}
    const footer=document.createElement('div');footer.className='studio-queued-footer';
    const label=document.createElement('span');label.textContent=entry.failed?'Delivery failed · retry':entry.claimed?'Sending…':'Queued';footer.append(label);
    const send=document.createElement('button');send.type='button';send.className='studio-queue-send';send.textContent='↑';send.title='Send now — steer at the next model call';send.setAttribute('aria-label','Send queued message now');send.disabled=!!entry.claimed||!!root.host.sending||!!root.host.isCompacting;
    send.onclick=()=>void deliver(root,state,entry,true);footer.append(send);
    const remove=document.createElement('button');remove.type='button';remove.textContent='×';remove.title='Remove queued message';remove.setAttribute('aria-label','Remove queued message');remove.disabled=!!entry.claimed;
    remove.onclick=async()=>{try{await storage('readwrite',store=>store.delete(entry.id));state.entries=state.entries.filter(item=>item!==entry);paint(root,state);}catch{label.textContent='Could not remove · retry';}};footer.append(remove);card.append(footer);tray.append(card);
  }
  tray.hidden=!tray.childElementCount;
}
async function deliver(root,state,entry,now=false) {
  if(entry.claimed)return;
  const attempt=async()=>{
    const saved=await storage('readonly',store=>store.get(entry.id));
    if(!saved){state.entries=state.entries.filter(item=>item!==entry);paint(root,state);return;}
    if(saved.claimed&&!entry.failed)return;
    return deliverNative(root,state,entry,now);
  };
  // A second tab selecting the same session must not dispatch the same card.
  try { if(navigator.locks?.request)return await navigator.locks.request(`studio-queue:${entry.id}`,{ifAvailable:true},lock=>lock?attempt():undefined);await attempt(); }
  catch { entry.failed=true;paint(root,state); }
}
async function deliverNative(root,state,entry,now=false) {
  if(entry.claimed||identity(root.host)!==entry.session||typeof state.native!=='function')return;
  entry.claimed=true;entry.failed=false;paint(root,state);
  const args=[...entry.args];args[1]=now?'steer':undefined;
  // Persist the claim before dispatch, so reload never silently resends an
  // ambiguous request. A recovered claim is displayed for explicit retry.
  try{await storage('readwrite',store=>store.put(entry));if(identity(root.host)!==entry.session){entry.claimed=false;await storage('readwrite',store=>store.put(entry));return;}
    const app=document.querySelector('pi-web-app');
    const sessions=app?.sessions, selected=app?.state?.selectedSession;
    if(state.native===app?.handleSendPrompt&&typeof sessions?.deliverPromptToSession==='function'&&selected?.id===root.host.sessionId){
      const ok=await sessions.deliverPromptToSession(selected,args[0],args[1],args[2],args[3],args[4],root.host.machineId,{markSending:true},sessions.captureSessionErrorOwner(selected));
      if(!ok)throw Error('The native prompt request failed.');
    }else await state.native(...args);
    await storage('readwrite',store=>store.delete(entry.id));state.entries=state.entries.filter(item=>item!==entry);
  }catch{entry.claimed=false;entry.failed=true;await storage('readwrite',store=>store.put(entry)).catch(()=>{});}
  paint(root,state);
}
export function decorateMessageQueue(root) {
  if(root.host?.localName!=='prompt-editor')return;
  if(document.documentElement.dataset.piWebTheme!=='vitesse:black'){clearMessageQueue(root);return;}
  const host=root.host,session=identity(host);if(!session||typeof host.onSend!=='function')return;
  let state=roots.get(root);
  if(!state){
    state={session,native:host.onSend,entries:[],loaded:false,disposed:false};roots.set(root,state);
    state.wrapper=(...args)=>{
      if(!active(host)||args[1]==='steer'||(!args[0]?.trim()&&!args[2]?.length)||/^[!/]/.test((args[0]||'').trim()))return state.native(...args);
      const entry={id:crypto.randomUUID(),session:identity(host),args,time:Date.now(),claimed:false};
      // If durable storage fails, fall back to the native queue instead of losing
      // a draft that the native composer has already cleared.
      void storage('readwrite',store=>store.put(entry)).then(()=>{state.entries.push(entry);paint(root,state);}).catch(()=>state.native(...args));
    };
    void storage('readonly',store=>store.getAll()).then(entries=>{if(state.disposed)return;const merged=new Map(entries.map(entry=>[entry.id,{...entry,failed:!!entry.claimed||entry.failed,claimed:false}]));for(const entry of state.entries)merged.set(entry.id,entry);state.entries=[...merged.values()].sort((a,b)=>a.time-b.time);state.loaded=true;paint(root,state);}).catch(()=>{});
    state.timer=setInterval(()=>{if(state.disposed||!host.isConnected)return;state.session=identity(host);paint(root,state);const entry=state.entries.find(item=>item.session===state.session&&!item.claimed&&!item.failed);if(state.loaded&&entry&&!active(host))void deliver(root,state,entry);},1000);
  }
  state.session=session;
  if(host.onSend!==state.wrapper){state.native=host.onSend;host.onSend=state.wrapper;}
}
export function clearMessageQueue(root){const state=roots.get(root);if(!state)return;state.disposed=true;clearInterval(state.timer);if(root.host.onSend===state.wrapper)root.host.onSend=state.native;root.querySelector('.studio-composer-queue')?.remove();roots.delete(root);}
