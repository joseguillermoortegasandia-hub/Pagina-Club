import Link from 'next/link';
import { SectionHead } from '@/components/ui/Section';
import { TeamBadge } from '@/components/ui/TeamBadge';
import { getActivities, getMatches, getNews, getTeams } from '@/lib/data';
import { formatDateTime } from '@/lib/format';
import { requireSession } from '@/lib/auth';

export default async function HomePage() {
  const [{ club, profile }, activities, matches, news, teams] = await Promise.all([
    requireSession(), getActivities(), getMatches(), getNews(), getTeams()
  ]);
  const upcoming = matches.filter(m=>m.status==='scheduled').slice(0,2);
  const team = (id?:string|null)=>teams.find(t=>t.id===id);
  return <div className="page">
    <section className="hero">
      <div className="hero-content"><h1>¡Bienvenido de vuelta!</h1><p>Hola {profile.full_name.split(' ')[0]}, entérate de todo lo que pasa en {club.name} y sigue de cerca tus deportes.</p><Link href="/calendario" className="btn btn-primary">▦ Ver calendario</Link></div>
      <div className="membership-card"><span>Tu membresía</span><b>Familiar Premium</b><small>Socio activo · Acción #{profile.action_number}</small><strong>✓ Al día</strong></div>
    </section>

    <div className="home-grid">
      <section className="card list-card"><SectionHead icon="▦" title="Actividades de la semana" action={<Link className="link-green" href="/calendario">Ver calendario ›</Link>}/>
        {activities.slice(0,3).map(a=><div className="activity-row" key={a.id}><div className="date-box"><b>{new Date(a.starts_at).getDate()}</b>{new Intl.DateTimeFormat('es-VE',{month:'short'}).format(new Date(a.starts_at)).toUpperCase()}</div><div><b>{a.title}</b><small className="muted" style={{display:'block',marginTop:4}}>{formatDateTime(a.starts_at)} · {a.venue}</small></div><span className="tag">Inscrito</span></div>)}
      </section>
      <section className="card list-card"><SectionHead icon="⚽" title="Próximos partidos" action={<Link className="link-green" href="/deportes/futbol">Ver todos ›</Link>}/>
        {upcoming.map(m=><div className="match-row" key={m.id}><div className="team-inline"><TeamBadge team={team(m.home_team_id)} size="sm"/><b>{team(m.home_team_id)?.name}</b></div><div><b>VS</b><small className="muted" style={{display:'block'}}>{formatDateTime(m.scheduled_at)}</small></div><div className="team-inline away"><b>{team(m.away_team_id)?.name}</b><TeamBadge team={team(m.away_team_id)} size="sm"/></div></div>)}
      </section>
      <section className="card list-card"><SectionHead icon="▣" title="Noticias destacadas" action={<Link className="link-green" href="/noticias">Ver todas ›</Link>}/>
        {news.slice(0,3).map(n=><Link href="/noticias" className="news-row" key={n.id}><img src={n.image_url||'/logo.svg'} alt="" style={{width:76,height:58,objectFit:'cover',borderRadius:8}}/><div><b>{n.title}</b><small className="muted" style={{display:'block',marginTop:4}}>{n.category}</small></div><span>›</span></Link>)}
      </section>
    </div>

    <div className="quick-actions">
      {[['▦','Calendario','/calendario'],['⚽','Deportes','/deportes'],['▶','En vivo','/transmisiones/live'],['▣','Noticias','/noticias'],['♙','Mi cuenta','/mi-cuenta']].map(([i,t,h])=><Link className="card quick-action" href={h} key={t}><span>{i}</span><small>{t}</small></Link>)}
    </div>
    <section className="card announcements"><SectionHead icon="◉" title="Anuncios importantes" />
      <div className="announcement"><span className="tag">Importante</span><div><b>Actualización de torneos y horarios</b><small className="muted" style={{display:'block'}}>Revisa el calendario antes de asistir a tu próxima actividad.</small></div><span className="muted">Hoy</span></div>
      <div className="announcement"><span className="tag">Evento</span><div><b>Fiesta anual del club</b><small className="muted" style={{display:'block'}}>Próximamente publicaremos información de reservas.</small></div><span className="muted">Esta semana</span></div>
    </section>
  </div>;
}
