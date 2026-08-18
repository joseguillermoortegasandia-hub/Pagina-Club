(function(){
  const cfg = window.CLUB_CONFIG || {};
  const STORAGE_KEY = 'club_deportivo_demo_state_v2';
  let client = null;
  let profile = null;
  let realtimeChannel = null;

  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function normalizeAction(value){ return String(value || '').replace(/\D/g,''); }
  function syntheticEmail(action){ return `${cfg.CLUB_SLUG || 'club'}.accion.${normalizeAction(action)}@club.local`; }

  function readDemo(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : clone(window.DEMO_DATA);
    } catch (_) { return clone(window.DEMO_DATA); }
  }
  function saveDemo(state){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

  function makeSupabase(){
    if(client) return client;
    if(!window.supabase || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return null;
    client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
      auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:true}
    });
    return client;
  }

  async function login(actionNumber,password){
    const action = normalizeAction(actionNumber);
    if(cfg.MODE !== 'supabase'){
      if(action === String(cfg.DEMO_ACTION_NUMBER || '12345') && password === String(cfg.DEMO_PASSWORD || 'demo123')){
        profile = clone(window.DEMO_DATA.users[0]);
        sessionStorage.setItem('club_demo_logged','1');
        return {user:{id:profile.id,email:profile.email},profile};
      }
      throw new Error('Número de acción o contraseña incorrectos. Usa las credenciales demo indicadas debajo del formulario.');
    }

    const sb = makeSupabase();
    if(!sb) throw new Error('Falta configurar SUPABASE_URL y SUPABASE_ANON_KEY en config.js.');
    const {data,error} = await sb.auth.signInWithPassword({email:syntheticEmail(action), password});
    if(error) throw error;
    const {data:p,error:pe} = await sb.from('profiles').select('*').eq('id',data.user.id).single();
    if(pe) throw pe;
    profile = p;
    return {user:data.user,profile:p};
  }

  async function logout(){
    if(cfg.MODE === 'supabase'){
      const sb=makeSupabase(); if(sb) await sb.auth.signOut();
    }
    sessionStorage.removeItem('club_demo_logged'); profile=null;
  }

  async function currentSession(){
    if(cfg.MODE !== 'supabase'){
      if(sessionStorage.getItem('club_demo_logged')==='1'){
        profile=clone(window.DEMO_DATA.users[0]); return {user:{id:profile.id},profile};
      }
      return null;
    }
    const sb=makeSupabase(); if(!sb) return null;
    const {data:{session}}=await sb.auth.getSession();
    if(!session) return null;
    const {data:p}=await sb.from('profiles').select('*').eq('id',session.user.id).single();
    profile=p; return {user:session.user,profile:p};
  }

  async function fetchAll(table, options={}){
    const sb=makeSupabase();
    let q=sb.from(table).select(options.select || '*');
    if(options.order) q=q.order(options.order,{ascending:options.ascending ?? true});
    if(options.limit) q=q.limit(options.limit);
    const {data,error}=await q;
    if(error) throw error;
    return data || [];
  }

  async function loadCloud(){
    const [clubs,sports,teams,standings,matches,news,activities,players,streams,contacts,gallery] = await Promise.all([
      fetchAll('clubs'),fetchAll('sports',{order:'sort_order'}),fetchAll('teams'),fetchAll('standings',{order:'rank'}),fetchAll('matches',{order:'scheduled_at',ascending:false}),fetchAll('news',{order:'published_at',ascending:false}),fetchAll('activities',{order:'starts_at'}),fetchAll('players'),fetchAll('streams',{order:'created_at',ascending:false}),fetchAll('directory_entries',{order:'name'}),fetchAll('gallery_items',{order:'created_at',ascending:false})
    ]);
    let users=[];
    if(profile && ['super_admin','club_admin'].includes(profile.role)){
      try{ users=await fetchAll('profiles',{order:'full_name'}); }catch(_){ users=[]; }
    }
    const club=clubs.find(c=>c.slug===cfg.CLUB_SLUG) || clubs[0] || window.DEMO_DATA.club;
    const normalizedSports=sports.map(s=>({...s,teams:s.team_count ?? s.teams ?? 0,matches:s.match_count ?? s.matches ?? 0,players:s.player_count ?? s.players ?? 0,categories:s.category_count ?? s.categories ?? 0,image:s.image_url || ''}));
    const normalizedTeams=teams.map(t=>({...t,logo:t.logo_text || t.short_name || t.name?.slice(0,2).toUpperCase(),short:t.short_name || '',coach:t.coach_name,description:t.description,secondary:t.secondary_color}));
    const normalizedNews=news.map(n=>({...n,date:(n.published_at||n.created_at||'').slice(0,10),image:n.image_url,featured:n.is_featured}));
    const normalizedActivities=activities.map(a=>({...a,date:(a.starts_at||'').slice(0,10),time:a.starts_at?new Date(a.starts_at).toLocaleTimeString('es-VE',{hour:'2-digit',minute:'2-digit'}):'',place:a.location,kind:a.kind||'activity'}));
    const normalizedStreams=streams.map(s=>({...s,external_url:s.external_url||'',status:s.status==='active'?'active':s.status}));
    const normalizedContacts=contacts.map(c=>({...c,role:c.position}));
    const normalizedGallery=gallery.map(g=>({...g,url:g.image_url,title:g.caption}));
    return {
      ...clone(window.DEMO_DATA), club,
      sports:normalizedSports.length?normalizedSports:window.DEMO_DATA.sports,
      teams:normalizedTeams.length?normalizedTeams:window.DEMO_DATA.teams,
      standings:standings.length?standings:window.DEMO_DATA.standings,
      matches:matches.length?matches:window.DEMO_DATA.matches,
      news:normalizedNews.length?normalizedNews:window.DEMO_DATA.news,
      activities:normalizedActivities.length?normalizedActivities:window.DEMO_DATA.activities,
      players:players.length?players:window.DEMO_DATA.players,
      streams:normalizedStreams.length?normalizedStreams:window.DEMO_DATA.streams,
      users:users.length?users:window.DEMO_DATA.users,
      contacts:normalizedContacts.length?normalizedContacts:window.DEMO_DATA.contacts,
      gallery:normalizedGallery.length?normalizedGallery:window.DEMO_DATA.gallery
    };
  }

  async function loadState(){
    if(cfg.MODE !== 'supabase') return readDemo();
    try{return await loadCloud();}
    catch(err){
      console.error('Supabase load error',err);
      throw new Error(`No se pudieron cargar los datos de Supabase: ${err.message}`);
    }
  }

  async function createSport(payload,state){
    const clean={name:payload.name,slug:payload.slug||slugify(payload.name),description:payload.description||'',icon:payload.icon||'🏆',image_url:payload.image_url||'',active:true,sort_order:(state.sports?.length||0)+1};
    if(cfg.MODE!=='supabase'){
      const item={id:'sport-'+Date.now(),...clean,image:clean.image_url,teams:0,matches:0,players:0,categories:0}; state.sports.push(item);saveDemo(state);return item;
    }
    const sb=makeSupabase(); const {data,error}=await sb.from('sports').insert(clean).select().single();if(error)throw error;return data;
  }

  async function createNews(payload,state){
    const clean={title:payload.title,excerpt:payload.excerpt||'',body:payload.body||'',category:payload.category||'Comunicados',image_url:payload.image_url||'',is_featured:!!payload.is_featured,published_at:new Date().toISOString()};
    if(cfg.MODE!=='supabase'){
      const item={id:'news-'+Date.now(),...clean,image:clean.image_url,date:clean.published_at.slice(0,10),featured:clean.is_featured};state.news.unshift(item);saveDemo(state);return item;
    }
    const sb=makeSupabase();const {data,error}=await sb.from('news').insert(clean).select().single();if(error)throw error;return data;
  }

  async function createTeam(payload,state){
    const clean={sport_id:payload.sport_id,name:payload.name,slug:payload.slug||slugify(payload.name),short_name:(payload.short_name||payload.name.slice(0,3)).toUpperCase(),category:payload.category||'Primera',coach_name:payload.coach_name||'',description:payload.description||'',primary_color:payload.primary_color||'#06294a',secondary_color:payload.secondary_color||'#e6b93e'};
    if(cfg.MODE!=='supabase'){
      const item={id:'team-'+Date.now(),...clean,short:clean.short_name,logo:clean.short_name,coach:clean.coach_name,color:clean.primary_color,secondary:clean.secondary_color};state.teams.push(item);saveDemo(state);return item;
    }
    const sb=makeSupabase();const {data,error}=await sb.from('teams').insert(clean).select().single();if(error)throw error;return data;
  }

  async function createActivity(payload,state){
    const clean={title:payload.title,kind:payload.kind||'activity',starts_at:new Date(`${payload.date}T${payload.time||'12:00'}:00`).toISOString(),location:payload.location||'',description:payload.description||''};
    if(cfg.MODE!=='supabase'){
      const item={id:'activity-'+Date.now(),...clean,date:payload.date,time:payload.time,place:clean.location};state.activities.push(item);saveDemo(state);return item;
    }
    const sb=makeSupabase();const {data,error}=await sb.from('activities').insert(clean).select().single();if(error)throw error;return data;
  }

  async function createUser(payload,state){
    if(cfg.MODE!=='supabase'){
      const item={id:'user-'+Date.now(),full_name:payload.full_name,action_number:payload.action_number,role:payload.role,email:payload.email||syntheticEmail(payload.action_number),status:'Activo'};state.users.push(item);saveDemo(state);return {user:item};
    }
    const sb=makeSupabase();
    const {data,error}=await sb.functions.invoke('create-user',{body:payload});
    if(error)throw error; return data;
  }

  async function createManualStream(payload,state){
    const clean={title:payload.title,provider:payload.provider||'hls',external_url:payload.external_url||'',playback_id:payload.playback_id||'',status:payload.status||'idle',viewers_count:0};
    if(cfg.MODE!=='supabase'){
      const item={id:'stream-'+Date.now(),...clean};state.streams.unshift(item);saveDemo(state);return item;
    }
    const sb=makeSupabase();const {data,error}=await sb.from('streams').insert(clean).select().single();if(error)throw error;return data;
  }

  async function createMuxStream(payload,state){
    if(cfg.MODE!=='supabase'){
      const fake={stream:{id:'stream-'+Date.now(),title:payload.title,provider:'mux',playback_id:'DEMO_PLAYBACK_ID',status:'idle'},credentials:{server_url:'rtmps://global-live.mux.com:443/app',stream_key:'demo-stream-key-no-usar-en-produccion'}};
      state.streams.unshift(fake.stream);saveDemo(state);return fake;
    }
    const sb=makeSupabase(); const {data,error}=await sb.functions.invoke('create-mux-stream',{body:{title:payload.title,match_id:payload.match_id||null}});if(error)throw error;return data;
  }

  function slugify(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}

  function subscribeStreams(onChange){
    if(cfg.MODE!=='supabase') return ()=>{};
    const sb=makeSupabase();
    if(!sb) return ()=>{};
    if(realtimeChannel) sb.removeChannel(realtimeChannel);
    realtimeChannel=sb.channel('club-streams').on('postgres_changes',{event:'*',schema:'public',table:'streams'},payload=>onChange(payload)).subscribe();
    return ()=>{ if(realtimeChannel){sb.removeChannel(realtimeChannel);realtimeChannel=null;} };
  }

  async function uploadMedia(file,folder='general'){
    if(cfg.MODE!=='supabase') throw new Error('La subida real de archivos solo está disponible en modo Supabase.');
    const sb=makeSupabase();
    const safe=(file.name||'archivo').replace(/[^a-zA-Z0-9._-]/g,'-');
    const path=`${profile.club_id}/${folder}/${Date.now()}-${safe}`;
    const {error}=await sb.storage.from('club-media').upload(path,file,{upsert:false});if(error)throw error;
    const {data}=sb.storage.from('club-media').getPublicUrl(path);return data.publicUrl;
  }

  window.AppAPI={login,logout,currentSession,loadState,createSport,createNews,createTeam,createActivity,createUser,createManualStream,createMuxStream,subscribeStreams,uploadMedia,syntheticEmail,get profile(){return profile;},get client(){return makeSupabase();}};
})();
