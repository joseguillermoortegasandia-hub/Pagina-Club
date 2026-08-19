import { hasSupabase } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import {
  demoActivities, demoGallery, demoMatches, demoNews, demoPlayers, demoSports, demoStandings, demoStream, demoTeams
} from '@/lib/demo-data';
import type { Activity, Match, NewsItem, Player, Sport, Standing, Stream, Team } from '@/types/domain';

async function db() { return createClient(); }

export async function getSports(): Promise<Sport[]> {
  if (!hasSupabase()) return demoSports;
  const supabase = await db();
  const { data, error } = await supabase.from('sports').select('*').eq('active', true).order('sort_order');
  if (error) throw error;
  return (data || []) as Sport[];
}

export async function getSportBySlug(slug: string): Promise<Sport | null> {
  if (!hasSupabase()) return demoSports.find(s => s.slug === slug) || null;
  const supabase = await db();
  const { data } = await supabase.from('sports').select('*').eq('slug', slug).maybeSingle();
  return data as Sport | null;
}

export async function getTeams(sportId?: string): Promise<Team[]> {
  if (!hasSupabase()) return sportId ? demoTeams.filter(t => t.sport_id === sportId) : demoTeams;
  const supabase = await db();
  let query = supabase.from('teams').select('*').eq('active', true).order('name');
  if (sportId) query = query.eq('sport_id', sportId);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Team[];
}

export async function getTeamBySlug(slug: string): Promise<Team | null> {
  if (!hasSupabase()) return demoTeams.find(t => t.slug === slug) || null;
  const supabase = await db();
  const { data } = await supabase.from('teams').select('*').eq('slug', slug).maybeSingle();
  return data as Team | null;
}

export async function getPlayers(teamId: string): Promise<Player[]> {
  if (!hasSupabase()) return demoPlayers.filter(p => p.team_id === teamId);
  const supabase = await db();
  const { data, error } = await supabase.from('players').select('*').eq('team_id', teamId).order('number');
  if (error) throw error;
  return (data || []) as Player[];
}

export async function getStandings(sportId?: string): Promise<Standing[]> {
  if (!hasSupabase()) return demoStandings;
  const supabase = await db();
  let query = supabase.from('standings').select('*').order('rank');
  if (sportId) query = query.eq('sport_id', sportId);
  const { data, error } = await query.limit(30);
  if (error) throw error;
  return (data || []).map((x: any) => ({ ...x, goals_for:x.gf, goals_against:x.ga, goal_difference:x.gd })) as Standing[];
}

export async function getMatches(sportId?: string): Promise<Match[]> {
  if (!hasSupabase()) return sportId ? demoMatches.filter(m => m.sport_id === sportId) : demoMatches;
  const supabase = await db();
  let query = supabase.from('matches').select('*').order('scheduled_at', { ascending:false });
  if (sportId) query = query.eq('sport_id', sportId);
  const { data, error } = await query.limit(40);
  if (error) throw error;
  return (data || []) as Match[];
}

export async function getNews(): Promise<NewsItem[]> {
  if (!hasSupabase()) return demoNews;
  const supabase = await db();
  const { data, error } = await supabase.from('news').select('*').order('published_at', { ascending:false }).limit(30);
  if (error) throw error;
  return (data || []).map((x: any) => ({ ...x, featured:x.is_featured, status:'published' })) as NewsItem[];
}

export async function getActivities(): Promise<Activity[]> {
  if (!hasSupabase()) return demoActivities;
  const supabase = await db();
  const { data, error } = await supabase.from('activities').select('*').order('starts_at').limit(30);
  if (error) throw error;
  return (data || []).map((x: any) => ({ ...x, venue:x.location })) as Activity[];
}

export async function getGallery() {
  if (!hasSupabase()) return demoGallery.map(([title,url],i) => ({ id:`g-${i}`, title, image_url:url }));
  const supabase = await db();
  const { data, error } = await supabase.from('gallery_items').select('*').order('created_at', { ascending:false }).limit(30);
  if (error) throw error;
  return data || [];
}

export async function getDirectory() {
  if (!hasSupabase()) return [
    {id:'d1',name:'Administración',position:'Gerencia General',email:'administracion@club.com',phone:'+58 000 000 0000'},
    {id:'d2',name:'Carlos Ramírez',position:'Presidente Liga de Fútbol',email:'futbol@club.com',phone:'+58 000 000 0001'},
    {id:'d3',name:'María Gómez',position:'Presidenta Liga de Tenis',email:'tenis@club.com',phone:'+58 000 000 0002'}
  ];
  const supabase = await db();
  const { data, error } = await supabase.from('directory_entries').select('*').eq('active', true).order('sort_order');
  if (error) throw error;
  return data || [];
}

export async function getStream(id?: string): Promise<Stream | null> {
  if (!hasSupabase()) return demoStream;
  const supabase = await db();
  let query = supabase.from('streams').select('*');
  if (id && id !== 'live') query = query.eq('id', id);
  else query = query.in('status', ['active','idle']).order('created_at', { ascending:false });
  const { data } = await query.limit(1).maybeSingle();
  return data as Stream | null;
}

export function teamName(id?: string | null) { return demoTeams.find(t => t.id === id)?.name || 'Equipo'; }

export async function getMatch(id?: string | null): Promise<Match | null> {
  if (!id) return demoMatches.find(m=>m.status==='live') || null;
  if (!hasSupabase()) return demoMatches.find(m=>m.id===id) || demoMatches.find(m=>m.status==='live') || null;
  const supabase=await db(); const {data}=await supabase.from('matches').select('*').eq('id',id).maybeSingle(); return data as Match|null;
}

export async function getMatchEvents(matchId?: string | null) {
  if (!matchId || !hasSupabase()) return [
    {id:1,minute:"45+1'",event_type:'Tarjeta Amarilla',detail:'Atlético Club · J. Martínez'},
    {id:2,minute:"37'",event_type:'Gol',detail:'Los Leones · F. Ramírez'},
    {id:3,minute:"28'",event_type:'Cambio',detail:'Atlético Club'},
    {id:4,minute:"15'",event_type:'Tarjeta Amarilla',detail:'Los Leones · P. Gómez'},
    {id:5,minute:"8'",event_type:'Tiro de Esquina',detail:'Los Leones'}
  ];
  const supabase=await db(); const {data}=await supabase.from('match_events').select('*').eq('match_id',matchId).order('id',{ascending:false}); return data||[];
}

export async function getMatchStats(matchId?: string | null) {
  if (!matchId || !hasSupabase()) return { possession:[58,42], shots_on_target:[7,3], shots:[12,6], passes:[189,132], accuracy:[86,74], fouls:[5,6], corners:[4,2] };
  const supabase=await db(); const {data}=await supabase.from('match_stats').select('*').eq('match_id',matchId);
  const by=(key:string)=>{const x=(data||[]).find((r:any)=>r.stat_key===key);return x?[Number(x.home_value),Number(x.away_value)]:[]};
  return {possession:by('possession'),shots_on_target:by('shots_on_target'),shots:by('shots'),passes:by('passes'),accuracy:by('accuracy'),fouls:by('fouls'),corners:by('corners')};
}
