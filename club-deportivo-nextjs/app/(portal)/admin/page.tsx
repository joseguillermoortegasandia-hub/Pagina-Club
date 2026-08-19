import { redirect } from 'next/navigation';
import { AdminForms } from '@/components/admin/AdminForms';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { canManage, requireSession } from '@/lib/auth';
import { getMatches, getSports, getTeams } from '@/lib/data';
import { hasSupabase } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';

export const metadata={title:'Administración'};
export default async function AdminPage(){
 const session=await requireSession();if(!canManage(session.profile.role))redirect('/');
 const [sports,teams,matches]=await Promise.all([getSports(),getTeams(),getMatches()]);
 let profiles:any[]=[{id:'1',full_name:'Juan Pérez',action_number:'12345',role:'club_admin',status:'Activo'},{id:'2',full_name:'María Gómez',action_number:'1024',role:'league_president',status:'Activo'},{id:'3',full_name:'Carlos Ruiz',action_number:'2025',role:'editor',status:'Activo'}];
 let streams:any[]=[];let leagues:any[]=[{id:'demo-football-league',name:'Liga de Fútbol',sport_id:'football'},{id:'demo-tennis-league',name:'Liga de Tenis',sport_id:'tennis'}];
 if(hasSupabase()){const supabase=await createClient();const [p,s,l]=await Promise.all([supabase.from('profiles').select('*').order('full_name').limit(12),supabase.from('streams').select('*').order('created_at',{ascending:false}).limit(8),supabase.from('leagues').select('id,name,sport_id').eq('active',true).order('name')]);profiles=p.data||[];streams=s.data||[];leagues=l.data||[]}
 const teamName=(id?:string|null)=>teams.find(t=>t.id===id)?.name||'Equipo';
 const matchOptions=matches.map(m=>({id:m.id,label:`${teamName(m.home_team_id)} vs ${teamName(m.away_team_id)} · ${new Date(m.scheduled_at).toLocaleDateString('es-VE')}`}));
 return <div className="page"><div className="page-head"><div className="page-title"><h1>Administración</h1><p>Gestiona la plataforma del club. Los permisos se validan también en PostgreSQL mediante RLS.</p></div></div><div className="admin-kpis"><div className="card kpi">⚽ Deportes<b>{sports.length}</b></div><div className="card kpi">🏆 Ligas<b>{leagues.length}</b></div><div className="card kpi">♧ Equipos<b>{teams.length}</b></div><div className="card kpi">♙ Usuarios<b>{profiles.length}{session.isDemo?' demo':''}</b></div><div className="card kpi">◉ Transmisiones<b>{streams.length}</b></div></div><div className="admin-grid"><section className="card admin-panel"><div className="section-head"><h2>♙ Usuarios y Roles</h2></div>{profiles.map(p=><div className="admin-list-row" key={p.id}><div><b>{p.full_name}</b><small className="muted" style={{display:'block'}}>Acción #{p.action_number} · {p.status}</small></div><span className="role-pill">{p.role}</span></div>)}</section><section className="card admin-panel"><div className="section-head"><h2>⚽ Deportes</h2></div>{sports.map(s=><div className="admin-list-row" key={s.id}><div><b>{s.icon} {s.name}</b><small className="muted" style={{display:'block'}}>{s.team_count||0} equipos · {s.player_count||0} jugadores</small></div><span>›</span></div>)}</section></div><AdminForms role={session.profile.role} sports={sports.map(s=>({id:s.id,name:s.name}))} leagues={leagues} matches={matchOptions}/><div className="admin-forms"><MediaUploader clubId={session.club.id} demo={session.isDemo}/><section className="card admin-form"><h3>✓ Antes de producción</h3><p className="muted" style={{lineHeight:1.6}}>Desactiva el modo demo, configura Supabase + Mux, crea el dominio, activa SMTP, ejecuta las pruebas y revisa las políticas RLS. El archivo <b>CHECKLIST_VENTA.md</b> trae el recorrido completo.</p></section></div></div>;
}
