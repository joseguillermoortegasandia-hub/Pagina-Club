import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SectionHead } from '@/components/ui/Section';
import { TeamBadge } from '@/components/ui/TeamBadge';
import { getMatches, getSportBySlug, getStandings, getTeams } from '@/lib/data';
import { formatDateTime } from '@/lib/format';

export default async function SportDetailPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const sport=await getSportBySlug(slug); if(!sport) notFound();
  const [teams, standings, matches]=await Promise.all([getTeams(sport.id),getStandings(sport.id),getMatches(sport.id)]);
  const team=(id:string)=>teams.find(t=>t.id===id); const next=matches.find(m=>m.status==='scheduled'); const recent=matches.filter(m=>m.status==='finished').slice(0,5);
  return <div className="page"><div className="page-head"><div className="page-title"><h1>{sport.icon} {sport.name}</h1><p>Primera División · Temporada 2026</p></div></div>
    <div className="tabs"><span>Resumen</span><span className="active">Tabla de Posiciones</span><span>Calendario</span><span>Resultados</span><span>Equipos</span><span>Roster</span><span>Estadísticas</span></div>
    <div className="sport-detail-grid"><section className="card"><SectionHead icon="▤" title="Tabla de Posiciones" action={<span className="tag">Temporada 2026</span>}/><div className="table-wrap"><table className="data-table"><thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DG</th><th>PTS</th></tr></thead><tbody>{standings.map((s,i)=>{const t=team(s.team_id);return <tr key={s.team_id}><td>{s.rank||i+1}</td><td><Link href={t?`/equipos/${t.slug}`:'#'} className="team-inline"><TeamBadge team={t} size="sm"/><b>{t?.name||'Equipo'}</b></Link></td><td>{s.played}</td><td>{s.won}</td><td>{s.drawn}</td><td>{s.lost}</td><td>{s.goals_for||0}</td><td>{s.goals_against||0}</td><td>{s.goal_difference||0}</td><td className="points">{s.points}</td></tr>})}</tbody></table></div></section>
      <aside>{next&&<section className="card fixture-card"><SectionHead icon="▦" title="Próximo Partido"/><div className="muted" style={{textAlign:'center'}}>{formatDateTime(next.scheduled_at)}</div><div className="fixture-teams"><div><TeamBadge team={team(next.home_team_id!)} /><b style={{display:'block'}}>{team(next.home_team_id!)?.name}</b></div><b>VS</b><div><TeamBadge team={team(next.away_team_id!)} /><b style={{display:'block'}}>{team(next.away_team_id!)?.name}</b></div></div><Link className="btn btn-outline" style={{width:'100%'}} href="/transmisiones/live">Ver detalles del partido ›</Link></section>}
      <section className="card" style={{marginTop:16}}><SectionHead icon="↻" title="Resultados anteriores"/><div className="results-list">{recent.map(m=><div className="result-row" key={m.id}><small>{new Date(m.scheduled_at).toLocaleDateString('es-VE')}</small><div><b>vs {team(m.home_team_id===teams[0]?.id?m.away_team_id!:m.home_team_id!)?.name}</b><small className="muted" style={{display:'block'}}>Liga</small></div><div className="result-score">{m.home_score} - {m.away_score}</div></div>)}</div></section></aside>
    </div>
  </div>;
}
