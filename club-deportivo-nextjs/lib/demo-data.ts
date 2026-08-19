import type { Activity, Club, Match, NewsItem, Player, Profile, Sport, Standing, Stream, Team } from '@/types/domain';

export const demoClub: Club = {
  id: '00000000-0000-0000-0000-000000000001', slug: 'club-deportivo', name: 'Club Deportivo', since: '1945',
  logo_url: '/logo.svg', primary_color: '#06294a', accent_color: '#4fbe2f', timezone: 'America/Caracas'
};

export const demoProfile: Profile = {
  id: 'demo-user', club_id: demoClub.id, action_number: '12345', full_name: 'Juan Pérez',
  notification_email: 'demo@club.local', role: 'club_admin', status: 'Activo'
};

export const demoSports: Sport[] = [
  { id:'football', name:'Fútbol', slug:'futbol', icon:'⚽', description:'Ligas internas, categorías formativas y torneos regionales.', image_url:'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=82', team_count:12, match_count:48, player_count:210, category_count:6 },
  { id:'tennis', name:'Tenis', slug:'tenis', icon:'🎾', description:'Torneos individuales y dobles para todas las categorías.', image_url:'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=82', team_count:8, match_count:64, player_count:96, category_count:8 },
  { id:'padel', name:'Pádel', slug:'padel', icon:'🏓', description:'Torneos internos, ranking y ligas por nivel.', image_url:'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&w=1000&q=82', team_count:10, match_count:36, player_count:72, category_count:10 },
  { id:'basketball', name:'Baloncesto', slug:'baloncesto', icon:'🏀', description:'Ligas competitivas y formativas para todas las edades.', image_url:'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=82', team_count:6, match_count:30, player_count:90, category_count:3 },
  { id:'volleyball', name:'Voleibol', slug:'voleibol', icon:'🏐', description:'Equipos mixtos y femeninos en ligas internas.', image_url:'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1000&q=82', team_count:6, match_count:28, player_count:84, category_count:2 },
  { id:'swimming', name:'Natación', slug:'natacion', icon:'🏊', description:'Clases, entrenamientos y competencias acuáticas.', image_url:'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1000&q=82', team_count:15, match_count:120, player_count:210, category_count:15 },
  { id:'baseball', name:'Béisbol', slug:'beisbol', icon:'⚾', description:'Academia, torneos locales y desarrollo de talento.', image_url:'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=1000&q=82', team_count:4, match_count:22, player_count:55, category_count:4 },
  { id:'gym', name:'Gimnasio', slug:'gimnasio', icon:'🏋️', description:'Programas de entrenamiento y clases dirigidas.', image_url:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=82', team_count:12, match_count:45, player_count:320, category_count:12 }
];

export const demoTeams: Team[] = [
  { id:'cd', sport_id:'football', name:'Club Deportivo', slug:'club-deportivo', short_name:'CD', logo_text:'CD', category:'Primera', coach_name:'Miguel Torres', primary_color:'#06294a' },
  { id:'leones', sport_id:'football', name:'Los Leones', slug:'los-leones', short_name:'LEO', logo_text:'🦁', category:'Sub-15', coach_name:'Carlos Ramírez', founded_year:2010, primary_color:'#06294a', secondary_color:'#e6b93e', description:'Equipo comprometido con el desarrollo integral de nuestros jugadores, fomentando el trabajo en equipo, la disciplina y los valores dentro y fuera de la cancha.' },
  { id:'atletico', sport_id:'football', name:'Atlético del Valle', slug:'atletico-del-valle', short_name:'ADV', logo_text:'A', category:'Primera', coach_name:'Luis Mena', primary_color:'#e33f43' },
  { id:'sporting', sport_id:'football', name:'Sporting Unidos', slug:'sporting-unidos', short_name:'SU', logo_text:'SU', category:'Primera', coach_name:'Mario León', primary_color:'#245eea' },
  { id:'union', sport_id:'football', name:'Unión Central', slug:'union-central', short_name:'UC', logo_text:'UC', category:'Primera', coach_name:'Andrés Ríos', primary_color:'#222222' },
  { id:'norte', sport_id:'football', name:'Deportivo Norte', slug:'deportivo-norte', short_name:'DN', logo_text:'DN', category:'Primera', coach_name:'Javier Peña', primary_color:'#2786e6' },
  { id:'sanmartin', sport_id:'football', name:'Real San Martín', slug:'real-san-martin', short_name:'RSM', logo_text:'R', category:'Primera', coach_name:'Tomás Gil', primary_color:'#35754b' },
  { id:'juventud', sport_id:'football', name:'Juventud FC', slug:'juventud-fc', short_name:'JUV', logo_text:'J', category:'Primera', coach_name:'Pedro Lara', primary_color:'#b69a00' }
];

export const demoStandings: Standing[] = [
  ['cd',10,7,2,1,22,8,23],['atletico',10,6,3,1,18,7,21],['sporting',10,6,2,2,17,9,20],['union',10,5,3,2,16,10,18],['norte',10,4,3,3,14,12,15],['sanmartin',10,4,2,4,11,12,14],['juventud',10,3,3,4,13,15,12]
].map((x, i) => ({ id:`st-${i}`, team_id:String(x[0]), rank:i+1, played:Number(x[1]), won:Number(x[2]), drawn:Number(x[3]), lost:Number(x[4]), goals_for:Number(x[5]), goals_against:Number(x[6]), goal_difference:Number(x[5])-Number(x[6]), points:Number(x[7]) }));

export const demoMatches: Match[] = [
  { id:'next-1', sport_id:'football', home_team_id:'cd', away_team_id:'sporting', scheduled_at:'2026-08-22T10:00:00-04:00', venue:'Cancha Principal', status:'scheduled' },
  { id:'next-2', sport_id:'football', home_team_id:'cd', away_team_id:'atletico', scheduled_at:'2026-08-23T12:00:00-04:00', venue:'Cancha Principal', status:'scheduled' },
  { id:'m1', sport_id:'football', home_team_id:'cd', away_team_id:'atletico', scheduled_at:'2026-08-15T10:00:00-04:00', venue:'Cancha Principal', status:'finished', home_score:2, away_score:1 },
  { id:'m2', sport_id:'football', home_team_id:'norte', away_team_id:'cd', scheduled_at:'2026-08-08T10:00:00-04:00', venue:'Cancha Norte', status:'finished', home_score:1, away_score:1 },
  { id:'m3', sport_id:'football', home_team_id:'cd', away_team_id:'sanmartin', scheduled_at:'2026-08-01T10:00:00-04:00', venue:'Cancha Principal', status:'finished', home_score:3, away_score:0 },
  { id:'live-1', sport_id:'football', home_team_id:'leones', away_team_id:'atletico', scheduled_at:'2026-08-19T15:00:00-04:00', venue:'Cancha Principal', status:'live', home_score:1, away_score:0 }
];

export const demoPlayers: Player[] = [
  {id:'p1',team_id:'leones',number:1,name:'Mateo González',position:'ARQ',age:14,status:'Activo'},
  {id:'p2',team_id:'leones',number:4,name:'Santiago Vargas',position:'DEF',age:15,status:'Activo'},
  {id:'p3',team_id:'leones',number:5,name:'Diego Hernández',position:'DEF',age:14,status:'Activo'},
  {id:'p4',team_id:'leones',number:7,name:'Alejandro Ruiz',position:'MED',age:15,status:'Activo'},
  {id:'p5',team_id:'leones',number:10,name:'Emiliano Torres',position:'MED',age:14,status:'Activo'},
  {id:'p6',team_id:'leones',number:11,name:'Nicolás Castro',position:'DEL',age:15,status:'Activo'}
];

export const demoNews: NewsItem[] = [
  {id:'n1',title:'Torneo Interno de Tenis 2026: ¡Éxito total en nuestra sede!',excerpt:'Más de 80 jugadores participaron en una semana llena de competencia, compañerismo y grandes partidos.',category:'Deportes',published_at:'2026-08-17T12:00:00Z',featured:true,status:'published',image_url:'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=84'},
  {id:'n2',title:'Escuela de Fútbol – Nuevos horarios y categorías',excerpt:'Conoce los nuevos horarios y categorías para nuestras escuelas de fútbol.',category:'Deportes',published_at:'2026-08-15T12:00:00Z',status:'published',image_url:'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80'},
  {id:'n3',title:'Mantenimiento en Piscina Semiolímpica',excerpt:'La piscina permanecerá cerrada por mantenimiento programado.',category:'Mantenimiento',published_at:'2026-08-14T12:00:00Z',status:'published',image_url:'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=900&q=80'},
  {id:'n4',title:'Clase abierta de Yoga en el Parque',excerpt:'Te invitamos a nuestra clase abierta del sábado.',category:'Eventos',published_at:'2026-08-12T12:00:00Z',status:'published',image_url:'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=80'},
  {id:'n5',title:'Actualización de tarifas 2026',excerpt:'Consulta las nuevas tarifas de membresía y servicios del club.',category:'Comunicados',published_at:'2026-08-10T12:00:00Z',status:'published',image_url:'/logo.svg'}
];

export const demoActivities: Activity[] = [
  {id:'a1',title:'Yoga en el Parque',starts_at:'2026-08-19T07:00:00-04:00',ends_at:'2026-08-19T08:00:00-04:00',venue:'Área de Yoga',kind:'activity'},
  {id:'a2',title:'Entrenamiento Funcional',starts_at:'2026-08-20T18:30:00-04:00',ends_at:'2026-08-20T19:30:00-04:00',venue:'Gimnasio Principal',kind:'activity'},
  {id:'a3',title:'Clases de Natación',starts_at:'2026-08-21T17:00:00-04:00',ends_at:'2026-08-21T18:00:00-04:00',venue:'Piscina Semiolímpica',kind:'activity'}
];

export const demoStream: Stream = {
  id:'stream-demo', title:'Los Leones vs Atlético Club', match_id:'live-1', provider:'mux', status:'active', playback_id:null,
  ingest_url:'rtmps://global-live.mux.com:443/app', scheduled_at:'2026-08-19T15:00:00-04:00', latency_mode:'reduced'
};

export const demoGallery = [
  ['Equipo Sub-15','https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=82'],
  ['Tenis','https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=900&q=82'],
  ['Piscina','https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=900&q=82'],
  ['Gimnasio','https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=82'],
  ['Fútbol','https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=82'],
  ['Yoga','https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=82']
];
