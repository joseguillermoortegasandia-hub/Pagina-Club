(function(){
  const club = {
    id:'club-demo', slug:'club-deportivo', name:'Club Deportivo', since:'1945',
    primary_color:'#06294a', accent_color:'#4fbe2f', member_plan:'Familiar Premium'
  };

  const sports = [
    {id:'football',name:'Fútbol',slug:'futbol',icon:'⚽',description:'Compite en nuestras ligas internas y torneos regionales.',image:'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80',teams:12,matches:48,players:210,categories:6},
    {id:'tennis',name:'Tenis',slug:'tenis',icon:'🎾',description:'Torneos individuales y dobles para todas las categorías.',image:'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80',teams:8,matches:64,players:96,categories:8},
    {id:'padel',name:'Pádel',slug:'padel',icon:'🏓',description:'Disfruta del pádel con torneos internos y ligas por nivel.',image:'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&w=900&q=80',teams:10,matches:36,players:72,categories:10},
    {id:'basketball',name:'Baloncesto',slug:'baloncesto',icon:'🏀',description:'Ligas competitivas y formativas para todas las edades.',image:'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',teams:6,matches:30,players:90,categories:3},
    {id:'volleyball',name:'Voleibol',slug:'voleibol',icon:'🏐',description:'Equipos mixtos y femeninos en nuestras ligas internas.',image:'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=900&q=80',teams:6,matches:28,players:84,categories:2},
    {id:'swimming',name:'Natación',slug:'natacion',icon:'🏊',description:'Clases, entrenamientos y competencias acuáticas.',image:'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=900&q=80',teams:15,matches:120,players:210,categories:15},
    {id:'baseball',name:'Béisbol',slug:'beisbol',icon:'⚾',description:'Desarrolla tu talento en la academia y torneos locales.',image:'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=900&q=80',teams:4,matches:22,players:55,categories:4},
    {id:'gym',name:'Gimnasio',slug:'gimnasio',icon:'🏋️',description:'Programas de entrenamiento y clases dirigidas.',image:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',teams:12,matches:45,players:320,categories:12}
  ];

  const teams = [
    {id:'cd',sport_id:'football',name:'Club Deportivo',slug:'club-deportivo',short:'CD',logo:'CD',category:'Primera',coach:'Miguel Torres',color:'#06294a'},
    {id:'leones',sport_id:'football',name:'Los Leones',slug:'los-leones',short:'LEO',logo:'🦁',category:'Sub-15',coach:'Carlos Ramírez',founded:2010,color:'#06294a',secondary:'#e6b93e',description:'Equipo comprometido con el desarrollo integral de nuestros jugadores, fomentando el trabajo en equipo, la disciplina y los valores dentro y fuera de la cancha.'},
    {id:'atletico',sport_id:'football',name:'Atlético del Valle',slug:'atletico-del-valle',short:'ADV',logo:'A',category:'Primera',coach:'Luis Mena',color:'#e33f43'},
    {id:'sporting',sport_id:'football',name:'Sporting Unidos',slug:'sporting-unidos',short:'SU',logo:'SU',category:'Primera',coach:'Mario León',color:'#245eea'},
    {id:'union',sport_id:'football',name:'Unión Central',slug:'union-central',short:'UC',logo:'UC',category:'Primera',coach:'Andrés Ríos',color:'#1a1a1a'},
    {id:'norte',sport_id:'football',name:'Deportivo Norte',slug:'deportivo-norte',short:'DN',logo:'DN',category:'Primera',coach:'Javier Peña',color:'#2786e6'},
    {id:'sanmartin',sport_id:'football',name:'Real San Martín',slug:'real-san-martin',short:'RSM',logo:'R',category:'Primera',coach:'Tomás Gil',color:'#35754b'},
    {id:'juventud',sport_id:'football',name:'Juventud FC',slug:'juventud-fc',short:'JUV',logo:'J',category:'Primera',coach:'Pedro Lara',color:'#b69a00'},
    {id:'sur',sport_id:'football',name:'Deportivo Sur',slug:'deportivo-sur',short:'DS',logo:'DS',category:'Primera',coach:'Raúl Salas',color:'#a43737'},
    {id:'libertad',sport_id:'football',name:'Libertad FC',slug:'libertad-fc',short:'LIB',logo:'L',category:'Primera',coach:'José Mora',color:'#333'},
    {id:'estrella',sport_id:'football',name:'Estrella Roja',slug:'estrella-roja',short:'ER',logo:'★',category:'Primera',coach:'Luis Ortiz',color:'#d8222a'},
    {id:'nueva',sport_id:'football',name:'Nueva Generación',slug:'nueva-generacion',short:'NG',logo:'NG',category:'Primera',coach:'Sergio Díaz',color:'#4c9dd7'},
    {id:'horizonte',sport_id:'football',name:'Atlético Horizonte',slug:'atletico-horizonte',short:'AH',logo:'AH',category:'Primera',coach:'Rafael Pérez',color:'#ee7b10'}
  ];

  const standings = [
    ['cd',10,7,2,1,22,8,23],['atletico',10,6,3,1,18,7,21],['sporting',10,6,2,2,17,9,20],['union',10,5,3,2,16,10,18],['norte',10,4,3,3,14,12,15],['sanmartin',10,4,2,4,11,12,14],['juventud',10,3,3,4,13,15,12],['sur',10,3,2,5,9,14,11],['libertad',10,2,3,5,10,16,9],['estrella',10,2,2,6,8,17,8],['nueva',10,1,3,6,7,16,6],['horizonte',10,1,2,7,6,18,5]
  ].map((x,i)=>({rank:i+1,team_id:x[0],played:x[1],won:x[2],drawn:x[3],lost:x[4],gf:x[5],ga:x[6],points:x[7],gd:x[5]-x[6]}));

  const matches = [
    {id:'m-next-1',sport_id:'football',home_team_id:'cd',away_team_id:'sporting',scheduled_at:'2026-08-22T10:00:00-04:00',venue:'Cancha Principal',status:'scheduled'},
    {id:'m-next-2',sport_id:'football',home_team_id:'cd',away_team_id:'atletico',scheduled_at:'2026-08-23T12:00:00-04:00',venue:'Cancha Principal',status:'scheduled'},
    {id:'m1',sport_id:'football',home_team_id:'cd',away_team_id:'atletico',scheduled_at:'2026-08-15T10:00:00-04:00',venue:'Cancha Principal',status:'finished',home_score:2,away_score:1},
    {id:'m2',sport_id:'football',home_team_id:'norte',away_team_id:'cd',scheduled_at:'2026-08-08T10:00:00-04:00',venue:'Cancha Norte',status:'finished',home_score:1,away_score:1},
    {id:'m3',sport_id:'football',home_team_id:'cd',away_team_id:'sanmartin',scheduled_at:'2026-08-01T10:00:00-04:00',venue:'Cancha Principal',status:'finished',home_score:3,away_score:0},
    {id:'m4',sport_id:'football',home_team_id:'juventud',away_team_id:'cd',scheduled_at:'2026-07-25T10:00:00-04:00',venue:'Cancha Juvenil',status:'finished',home_score:2,away_score:0},
    {id:'m5',sport_id:'football',home_team_id:'union',away_team_id:'cd',scheduled_at:'2026-07-18T10:00:00-04:00',venue:'Cancha Central',status:'finished',home_score:0,away_score:1},
    {id:'live-1',sport_id:'football',home_team_id:'leones',away_team_id:'atletico',scheduled_at:'2026-08-18T15:00:00-04:00',venue:'Cancha Principal',status:'live',home_score:1,away_score:0}
  ];

  const news = [
    {id:'n1',title:'Torneo Interno de Tenis 2026: ¡Éxito total en nuestra sede!',excerpt:'Más de 80 jugadores participaron en una semana llena de competencia, compañerismo y grandes partidos.',category:'Deportes',date:'2026-08-17',featured:true,image:'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=82'},
    {id:'n2',title:'Escuela de Fútbol – Nuevos horarios y categorías',excerpt:'Conoce los nuevos horarios y categorías para nuestras escuelas de fútbol.',category:'Deportes',date:'2026-08-15',image:'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80'},
    {id:'n3',title:'Mantenimiento en Piscina Semiolímpica',excerpt:'La piscina permanecerá cerrada por mantenimiento programado.',category:'Mantenimiento',date:'2026-08-14',image:'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=900&q=80'},
    {id:'n4',title:'Clase abierta de Yoga en el Parque',excerpt:'Te invitamos a nuestra clase abierta del sábado. ¡No necesitas inscribirte!',category:'Eventos',date:'2026-08-12',image:'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=80'},
    {id:'n5',title:'Actualización de tarifas 2026',excerpt:'Consulta las nuevas tarifas de membresía y servicios del club.',category:'Comunicados',date:'2026-08-10',image:'./assets/logo.svg'},
    {id:'n6',title:'Resultados de la Liga de Tenis – Agosto 2026',excerpt:'Conoce los resultados y posiciones actuales de nuestros tenistas.',category:'Deportes',date:'2026-08-09',image:'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=900&q=80'}
  ];

  const activities = [
    {id:'a1',title:'Yoga en el Parque',date:'2026-08-19',time:'07:00 AM - 08:00 AM',place:'Área de Yoga',kind:'activity'},
    {id:'a2',title:'Entrenamiento Funcional',date:'2026-08-20',time:'06:30 PM - 07:30 PM',place:'Gimnasio Principal',kind:'activity'},
    {id:'a3',title:'Clases de Natación',date:'2026-08-21',time:'05:00 PM - 06:00 PM',place:'Piscina Semiolímpica',kind:'activity'},
    {id:'a4',title:'Liga de Fútbol',date:'2026-08-22',time:'10:00 AM',place:'Cancha Principal',kind:'game'},
    {id:'a5',title:'Torneo de Pádel',date:'2026-08-23',time:'03:00 PM',place:'Canchas de Pádel',kind:'game'},
    {id:'a6',title:'Asamblea de Socios',date:'2026-08-25',time:'06:00 PM',place:'Salón Principal',kind:'notice'}
  ];

  const players = [
    {id:'p1',team_id:'leones',number:1,name:'Mateo González',position:'ARQ',age:14,status:'Activo'},
    {id:'p2',team_id:'leones',number:4,name:'Santiago Vargas',position:'DEF',age:15,status:'Activo'},
    {id:'p3',team_id:'leones',number:5,name:'Diego Hernández',position:'DEF',age:14,status:'Activo'},
    {id:'p4',team_id:'leones',number:7,name:'Alejandro Ruiz',position:'MED',age:15,status:'Activo'},
    {id:'p5',team_id:'leones',number:10,name:'Emiliano Torres',position:'MED',age:14,status:'Activo'},
    {id:'p6',team_id:'leones',number:11,name:'Nicolás Castro',position:'DEL',age:15,status:'Activo'}
  ];

  const tournament = {
    id:'t1',sport_id:'tennis',name:'Torneo Apertura 2026',category:'Primera',format:'Eliminación directa',surface:'Polvo de ladrillo',location:'Club Deportivo – Canchas de Tenis',start:'2026-08-01',end:'2026-09-15',referee:'Carlos Méndez',champion:'Martín Suárez',
    rounds:[
      {name:'OCTAVOS',date:'1–18 AGO',matches:[['Martín Suárez','Diego Ramírez','6 6','2 1'],['Lucas Fernández','Tomás Gómez','6 3 6','3 6 4'],['Juan Pablo Ruiz','Matías Ortega','6 6','1 2'],['Federico Díaz','Santiago Morales','6 7','3 5'],['Nicolás Herrera','Agustín Torres','6 6','0 1'],['Ignacio Varela','Pablo Lemos','4 6 6','6 3 2'],['Matías Cabrera','Ezequiel Rojas','6 6','2 4'],['Andrés Medina','Bruno Castillo','6 6','1 0']]},
      {name:'CUARTOS',date:'24–25 AGO',matches:[['Martín Suárez','Lucas Fernández','6 6','2 4'],['Juan Pablo Ruiz','Federico Díaz','6 3 6','3 6 2'],['Nicolás Herrera','Ignacio Varela','6 4 6','3 6 2'],['Matías Cabrera','Andrés Medina','2 4','6 6']]},
      {name:'SEMIFINALES',date:'31 AGO–1 SEP',matches:[['Martín Suárez','Juan Pablo Ruiz','6 7','3 5'],['Nicolás Herrera','Andrés Medina','4 6 6','6 3 4']]},
      {name:'FINAL',date:'15 SEP',matches:[['Martín Suárez','Nicolás Herrera','6 6','4 2']]}
    ]
  };

  const teamGallery = [
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1570498839593-e565b39455fc?auto=format&fit=crop&w=700&q=80'
  ];

  const streams = [
    {id:'s1',match_id:'live-1',title:'Los Leones vs Atlético Club',provider:'hls',playback_id:'',external_url:'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',status:'active',viewers_count:523}
  ];

  const matchEvents = [
    {minute:"45+1'",type:'Tarjeta Amarilla',team:'Atlético Club',detail:'#8 J. Martínez',icon:'🟨'},
    {minute:"37'",type:'Gol',team:'Los Leones',detail:'#9 F. Ramírez',icon:'⚽'},
    {minute:"28'",type:'Cambio',team:'Atlético Club',detail:'D. López ↔ M. Sánchez',icon:'🔁'},
    {minute:"15'",type:'Tarjeta Amarilla',team:'Los Leones',detail:'#4 P. Gómez',icon:'🟨'},
    {minute:"8'",type:'Tiro de Esquina',team:'Los Leones',detail:'',icon:'🚩'}
  ];

  const matchStats = [
    {label:'Posesión',home:58,away:42,suffix:'%'},{label:'Tiros al Arco',home:7,away:3},{label:'Tiros Totales',home:12,away:6},{label:'Pases Completos',home:189,away:132},{label:'Precisión de Pases',home:86,away:74,suffix:'%'},{label:'Faltas',home:5,away:6},{label:'Corners',home:4,away:2},{label:'Fueras de Juego',home:1,away:0}
  ];

  const users = [
    {id:'u1',full_name:'Juan Pérez',action_number:'12345',role:'club_admin',email:'juan.perez@clubdeportivo.com',status:'Activo'},
    {id:'u2',full_name:'María Gómez',action_number:'22331',role:'league_president',email:'maria.gomez@clubdeportivo.com',status:'Activo'},
    {id:'u3',full_name:'Carlos Ruiz',action_number:'31124',role:'editor',email:'carlos.ruiz@clubdeportivo.com',status:'Activo'},
    {id:'u4',full_name:'Laura Martínez',action_number:'44219',role:'manager',email:'laura.martinez@clubdeportivo.com',status:'Activo'},
    {id:'u5',full_name:'Pedro Sánchez',action_number:'55201',role:'member',email:'pedro.sanchez@clubdeportivo.com',status:'Inactivo'}
  ];

  const contacts = [
    {name:'María Gómez',role:'Presidenta Liga de Fútbol',email:'futbol@clubdeportivo.com',phone:'+58 414 000 1001'},
    {name:'Carlos Ruiz',role:'Presidente Liga de Tenis',email:'tenis@clubdeportivo.com',phone:'+58 414 000 1002'},
    {name:'Laura Martínez',role:'Coordinación de Natación',email:'natacion@clubdeportivo.com',phone:'+58 414 000 1003'},
    {name:'José Mendoza',role:'Coordinación Deportiva',email:'deportes@clubdeportivo.com',phone:'+58 414 000 1004'},
    {name:'Ana Rivas',role:'Administración',email:'administracion@clubdeportivo.com',phone:'+58 414 000 1005'},
    {name:'Luis Peña',role:'Soporte y Comunicaciones',email:'soporte@clubdeportivo.com',phone:'+58 414 000 1006'}
  ];

  const gallery = [...teamGallery,
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&w=900&q=80'
  ].map((url,i)=>({id:'g'+(i+1),url,title:['Entrenamiento Sub-15','Partido de Liga','Equipo Los Leones','Celebración','Atajada del partido','Baloncesto interno','Natación del club','Torneo de Pádel'][i]}));

  window.DEMO_DATA = {club,sports,teams,standings,matches,news,activities,players,tournament,teamGallery,streams,matchEvents,matchStats,users,contacts,gallery};
})();
