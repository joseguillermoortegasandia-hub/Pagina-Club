(function(){
  const root=document.getElementById('app');
  let state=null;
  let profile=null;
  let logged=false;
  let streamUnsub=()=>{};

  function routeFromHash(){ return (location.hash.replace(/^#\/?/,'')||'inicio').replace(/^\//,''); }
  function go(route){ const next='#/'+route; if(location.hash===next) render(); else location.hash=next; }

  async function boot(){
    try{
      const session=await window.AppAPI.currentSession();
      if(session){logged=true;profile=session.profile;state=await window.AppAPI.loadState();if(!location.hash||routeFromHash()==='login')location.hash='#/inicio';render();}
      else{logged=false;root.className='';root.innerHTML=window.Views.login();bindPage();}
    }catch(err){console.error(err);logged=false;root.className='';root.innerHTML=window.Views.login();bindPage();setLoginError(err.message);}
  }

  async function refreshState(){ state=await window.AppAPI.loadState(); render(); }

  function render(){
    streamUnsub();streamUnsub=()=>{};
    if(!logged){root.className='';root.innerHTML=window.Views.login();bindPage();return;}
    const route=routeFromHash();
    if(route==='login'){go('inicio');return;}
    root.className='';root.innerHTML=window.Views.render(route,state,profile);bindPage();window.scrollTo({top:0,behavior:'instant'});
    if(route==='transmisiones'){
      initLivePlayer();
      streamUnsub=window.AppAPI.subscribeStreams(async()=>{try{state=await window.AppAPI.loadState();root.innerHTML=window.Views.render('transmisiones',state,profile);bindPage();initLivePlayer();}catch(e){console.error(e);}});
    }
  }

  function bindPage(){
    document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',ev=>{ev.preventDefault();const route=el.dataset.route;if(route)go(route);}));
    document.querySelectorAll('[data-action="logout"]').forEach(el=>el.addEventListener('click',logout));
    document.querySelectorAll('[data-action="close-modal"]').forEach(el=>el.addEventListener('click',closeModal));
    document.querySelectorAll('[data-action="forgot"]').forEach(el=>el.addEventListener('click',()=>toast('Solicita a administración el restablecimiento de tu clave.')));
    document.querySelectorAll('[data-action="mobile-menu"]').forEach(el=>el.addEventListener('click',openMobileMenu));
    document.querySelectorAll('[data-admin-create]').forEach(el=>el.addEventListener('click',()=>openAdminModal(el.dataset.adminCreate)));
    document.querySelectorAll('[data-copy]').forEach(el=>el.addEventListener('click',()=>copyValue(el.dataset.copy)));
    document.querySelectorAll('[data-news-filter]').forEach(el=>el.addEventListener('click',()=>filterNews(el.dataset.newsFilter,el)));
    const loginForm=document.getElementById('loginForm');if(loginForm)loginForm.addEventListener('submit',handleLogin);
    const adminForm=document.getElementById('adminForm');if(adminForm)adminForm.addEventListener('submit',handleAdminForm);
    const chatForm=document.getElementById('chatForm');if(chatForm)chatForm.addEventListener('submit',handleChat);
    // Enlace útil desde la tabla: doble clic abre el perfil del equipo de ejemplo.
    document.querySelectorAll('.team-cell').forEach(el=>el.addEventListener('dblclick',()=>go('equipo/leones')));
  }

  async function handleLogin(ev){
    ev.preventDefault(); const fd=new FormData(ev.currentTarget); const btn=ev.currentTarget.querySelector('button[type="submit"]');
    btn.disabled=true;btn.textContent='Ingresando…';setLoginError('');
    try{const res=await window.AppAPI.login(fd.get('actionNumber'),fd.get('password'));profile=res.profile;logged=true;state=await window.AppAPI.loadState();go('inicio');}
    catch(err){setLoginError(err.message||'No se pudo iniciar sesión.');btn.disabled=false;btn.textContent='Ingresar';}
  }
  function setLoginError(msg){const el=document.getElementById('loginError');if(!el)return;el.textContent=msg||'';el.classList.toggle('show',!!msg);}

  async function logout(){try{await window.AppAPI.logout();}finally{logged=false;profile=null;state=null;location.hash='#/login';root.innerHTML=window.Views.login();bindPage();}}

  function openAdminModal(kind){
    if(!window.Views.isAdmin(profile)){toast('Tu usuario no tiene permisos de edición.','error');return;}
    document.body.insertAdjacentHTML('beforeend',window.Views.adminModal(kind,state));bindPage();
  }
  function closeModal(){document.getElementById('modalBackdrop')?.remove();}

  async function handleAdminForm(ev){
    ev.preventDefault(); const form=ev.currentTarget; const kind=form.dataset.kind; const fd=new FormData(form); const payload=Object.fromEntries(fd.entries()); payload.is_featured=fd.get('is_featured')==='on';
    const submit=form.querySelector('button[type="submit"]');submit.disabled=true;submit.textContent='Guardando…';
    try{
      if(kind==='sport') await window.AppAPI.createSport(payload,state);
      else if(kind==='team') await window.AppAPI.createTeam(payload,state);
      else if(kind==='news') await window.AppAPI.createNews(payload,state);
      else if(kind==='activity') await window.AppAPI.createActivity(payload,state);
      else if(kind==='user') await window.AppAPI.createUser(payload,state);
      else if(kind==='stream'){
        if(payload.provider==='mux'){
          const result=await window.AppAPI.createMuxStream(payload,state);closeModal();document.body.insertAdjacentHTML('beforeend',window.Views.muxCredentials(result));bindPage();toast('Canal Mux creado. Copia la Stream Key en OBS.','success');if(window.CLUB_CONFIG.MODE==='supabase')state=await window.AppAPI.loadState();return;
        }
        await window.AppAPI.createManualStream(payload,state);
      }
      if(window.CLUB_CONFIG.MODE==='supabase') state=await window.AppAPI.loadState();
      closeModal();toast('Cambios guardados correctamente.','success');render();
    }catch(err){console.error(err);toast(err.message||'No se pudo guardar.','error');submit.disabled=false;submit.textContent='Guardar';}
  }

  function filterNews(category,button){
    document.querySelectorAll('[data-news-filter]').forEach(b=>b.classList.remove('active'));button.classList.add('active');
    document.querySelectorAll('[data-news-category]').forEach(card=>{card.style.display=(category==='Todas'||card.dataset.newsCategory===category)?'':'none';});
  }

  function handleChat(ev){ev.preventDefault();const input=ev.currentTarget.elements.message;const value=input.value.trim();if(!value)return;const list=document.querySelector('.chat-list');list.insertAdjacentHTML('beforeend',`<div class="chat-message"><span class="avatar">YO</span><div><b>Tú</b><p>${escapeHtml(value)}</p></div></div>`);input.value='';list.scrollTop=list.scrollHeight;}

  function initLivePlayer(){
    const video=document.getElementById('liveVideo');if(!video)return;const src=video.dataset.hls;if(!src)return;
    if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=src;return;}
    if(window.Hls && window.Hls.isSupported()){
      const hls=new window.Hls({enableWorker:true,lowLatencyMode:true});hls.loadSource(src);hls.attachMedia(video);hls.on(window.Hls.Events.ERROR,(_,data)=>{if(data.fatal)console.warn('HLS fatal error',data);});
    }else{video.outerHTML=`<div class="empty" style="color:white">Este navegador no admite HLS. Abre la página en Safari/Chrome actualizado o configura Mux Player.</div>`;}
  }

  function openMobileMenu(){
    const admin=window.Views.isAdmin(profile)?'<button class="card card-pad" data-route="admin" style="border:0;text-align:left">⚙ Administración</button>':'';
    document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modalBackdrop"><div class="modal"><div class="modal-head"><h2>Menú</h2><button class="modal-close" data-action="close-modal">×</button></div><div class="modal-body"><div class="grid"><button class="card card-pad" data-route="transmisiones" style="border:0;text-align:left">▶ Transmisiones</button><button class="card card-pad" data-route="galeria" style="border:0;text-align:left">▧ Galería</button><button class="card card-pad" data-route="directorio" style="border:0;text-align:left">♧ Directorio</button><button class="card card-pad" data-route="cuenta" style="border:0;text-align:left">♙ Mi Cuenta</button>${admin}<button class="card card-pad" data-action="logout" style="border:0;text-align:left;color:#b92831">⇥ Cerrar sesión</button></div></div></div></div>`);bindPage();
  }

  async function copyValue(selector){const el=document.querySelector(selector);if(!el)return;try{await navigator.clipboard.writeText(el.value||el.textContent);toast('Copiado al portapapeles.','success');}catch(_){el.select?.();document.execCommand('copy');toast('Copiado.','success');}}

  function toast(message,type='success'){let stack=document.getElementById('toastStack');if(!stack){stack=document.createElement('div');stack.className='toast-stack';stack.id='toastStack';document.body.appendChild(stack);}const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=message;stack.appendChild(el);setTimeout(()=>el.remove(),3800);}
  function escapeHtml(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

  window.addEventListener('hashchange',()=>{if(logged)render();else if(routeFromHash()!=='login')location.hash='#/login';});
  if('serviceWorker' in navigator && location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
  boot();
})();
