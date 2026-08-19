import Link from 'next/link';
import { getSports } from '@/lib/data';

export const metadata={title:'Deportes'};
export default async function SportsPage(){
  const sports=await getSports();
  return <div className="page"><div className="page-head"><div className="page-title"><h1>⚽ Deportes</h1><p>Explora las disciplinas disponibles, torneos, posiciones y actividades.</p></div></div>
    <div className="sports-grid">{sports.map(s=><article className="card sport-card" key={s.id}><div className="sport-photo"><img src={s.image_url||'/logo.svg'} alt={s.name}/></div><div className="sport-content"><div className="sport-icon">{s.icon||'🏆'}</div><h3>{s.name}</h3><p>{s.description}</p><div className="sport-stats"><div className="sport-stat"><b>{s.team_count||0}</b>Equipos</div><div className="sport-stat"><b>{s.match_count||0}</b>Partidos</div><div className="sport-stat"><b>{s.player_count||0}</b>Jugadores</div></div><div className="sport-actions"><Link href={s.slug==='tenis'?'/torneos/t1':`/deportes/${s.slug}`} className="btn btn-primary">Ver torneo</Link><Link href={`/deportes/${s.slug}`} className="btn btn-outline">Posiciones</Link></div></div></article>)}</div>
  </div>;
}
