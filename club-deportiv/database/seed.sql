-- ============================================================
-- DATOS INICIALES / DEMO DEL CLUB
-- Ejecutar DESPUÉS de schema.sql
-- ============================================================

insert into public.clubs(id,name,slug,since,primary_color,accent_color,timezone)
values ('11111111-1111-1111-1111-111111111111','Club Deportivo','club-deportivo','1945','#06294a','#4fbe2f','America/Caracas')
on conflict (id) do update set name=excluded.name, slug=excluded.slug, since=excluded.since;

insert into public.sports(id,club_id,name,slug,icon,description,image_url,category_count,team_count,match_count,player_count,sort_order) values
('20000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','Fútbol','futbol','⚽','Ligas internas, torneos y categorías formativas.','https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80',6,12,48,210,1),
('20000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','Tenis','tenis','🎾','Torneos individuales y dobles para todas las categorías.','https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80',8,8,64,96,2),
('20000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','Pádel','padel','🏓','Torneos internos y ligas por nivel.','https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&w=900&q=80',10,10,36,72,3),
('20000000-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','Baloncesto','baloncesto','🏀','Ligas competitivas y formativas.','https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',3,6,30,90,4),
('20000000-0000-0000-0000-000000000005','11111111-1111-1111-1111-111111111111','Voleibol','voleibol','🏐','Equipos mixtos y femeninos.','https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=900&q=80',2,6,28,84,5),
('20000000-0000-0000-0000-000000000006','11111111-1111-1111-1111-111111111111','Natación','natacion','🏊','Clases, entrenamientos y competencias acuáticas.','https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=900&q=80',15,6,120,210,6),
('20000000-0000-0000-0000-000000000007','11111111-1111-1111-1111-111111111111','Béisbol','beisbol','⚾','Academia y torneos locales.','https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=900&q=80',4,4,22,55,7),
('20000000-0000-0000-0000-000000000008','11111111-1111-1111-1111-111111111111','Gimnasio','gimnasio','🏋️','Programas de entrenamiento y clases dirigidas.','https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',12,0,45,320,8)
on conflict (id) do update set name=excluded.name,description=excluded.description,image_url=excluded.image_url,team_count=excluded.team_count,match_count=excluded.match_count,player_count=excluded.player_count;

insert into public.leagues(id,club_id,sport_id,name,category,season_label) values
('30000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','Liga de Fútbol','Primera','Temporada 2026'),
('30000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000002','Liga de Tenis','Primera','Temporada 2026')
on conflict (id) do update set name=excluded.name,season_label=excluded.season_label;

insert into public.teams(id,club_id,sport_id,league_id,name,slug,short_name,logo_text,category,coach_name,primary_color,secondary_color,description,founded_year) values
('40000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Club Deportivo','club-deportivo','CD','CD','Primera','Miguel Torres','#06294a','#4fbe2f','Equipo principal del club.',1945),
('40000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Los Leones','los-leones','LEO','🦁','Sub-15','Carlos Ramírez','#06294a','#e6b93e','Equipo comprometido con el desarrollo integral de nuestros jugadores.',2010),
('40000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Atlético del Valle','atletico-del-valle','ADV','A','Primera','Luis Mena','#e33f43','#ffffff',null,2009),
('40000000-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Sporting Unidos','sporting-unidos','SU','SU','Primera','Mario León','#245eea','#ffffff',null,2011),
('40000000-0000-0000-0000-000000000005','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Unión Central','union-central','UC','UC','Primera','Andrés Ríos','#1a1a1a','#ffffff',null,2008),
('40000000-0000-0000-0000-000000000006','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Deportivo Norte','deportivo-norte','DN','DN','Primera','Javier Peña','#2786e6','#ffffff',null,2013),
('40000000-0000-0000-0000-000000000007','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Real San Martín','real-san-martin','RSM','R','Primera','Tomás Gil','#35754b','#ffffff',null,2006),
('40000000-0000-0000-0000-000000000008','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Juventud FC','juventud-fc','JUV','J','Primera','Pedro Lara','#b69a00','#111111',null,2014),
('40000000-0000-0000-0000-000000000009','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Deportivo Sur','deportivo-sur','DS','DS','Primera','Raúl Salas','#a43737','#ffffff',null,2012),
('40000000-0000-0000-0000-000000000010','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Libertad FC','libertad-fc','LIB','L','Primera','José Mora','#333333','#ffffff',null,2010),
('40000000-0000-0000-0000-000000000011','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Estrella Roja','estrella-roja','ER','★','Primera','Luis Ortiz','#d8222a','#ffffff',null,2015),
('40000000-0000-0000-0000-000000000012','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Nueva Generación','nueva-generacion','NG','NG','Primera','Sergio Díaz','#4c9dd7','#ffffff',null,2018),
('40000000-0000-0000-0000-000000000013','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Atlético Horizonte','atletico-horizonte','AH','AH','Primera','Rafael Pérez','#ee7b10','#111111',null,2016)
on conflict (id) do update set name=excluded.name,coach_name=excluded.coach_name,primary_color=excluded.primary_color;

insert into public.competitions(id,club_id,sport_id,league_id,name,category,format,location,start_date,end_date,status) values
('50000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Liga Apertura 2026','Primera','Liga','Club Deportivo','2026-07-01','2026-11-30','active'),
('50000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','Torneo Apertura 2026','Primera','Eliminación directa','Canchas de Tenis','2026-08-01','2026-09-15','active')
on conflict (id) do update set name=excluded.name,status=excluded.status;

insert into public.standings(id,club_id,sport_id,league_id,competition_id,team_id,rank,played,won,drawn,lost,gf,ga,points) values
('51000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001',1,10,7,2,1,22,8,23),
('51000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000003',2,10,6,3,1,18,7,21),
('51000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000004',3,10,6,2,2,17,9,20),
('51000000-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000005',4,10,5,3,2,16,10,18),
('51000000-0000-0000-0000-000000000005','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000006',5,10,4,3,3,14,12,15),
('51000000-0000-0000-0000-000000000006','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000007',6,10,4,2,4,11,12,14),
('51000000-0000-0000-0000-000000000007','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000008',7,10,3,3,4,13,15,12),
('51000000-0000-0000-0000-000000000008','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000009',8,10,3,2,5,9,14,11)
on conflict (competition_id,team_id) do update set rank=excluded.rank,played=excluded.played,won=excluded.won,drawn=excluded.drawn,lost=excluded.lost,gf=excluded.gf,ga=excluded.ga,points=excluded.points;

insert into public.matches(id,club_id,sport_id,league_id,competition_id,home_team_id,away_team_id,scheduled_at,venue,home_score,away_score,status) values
('60000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000004','2026-08-22 10:00:00-04','Cancha Principal',null,null,'scheduled'),
('60000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000003','2026-08-23 12:00:00-04','Cancha Principal',null,null,'scheduled'),
('60000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000003','2026-08-15 10:00:00-04','Cancha Principal',2,1,'finished'),
('60000000-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000003','2026-08-18 15:00:00-04','Cancha Principal',1,0,'live')
on conflict (id) do update set home_score=excluded.home_score,away_score=excluded.away_score,status=excluded.status,scheduled_at=excluded.scheduled_at;

insert into public.players(id,club_id,team_id,number,name,position,age,status) values
('61000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','40000000-0000-0000-0000-000000000002',1,'Mateo González','ARQ',14,'Activo'),
('61000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','40000000-0000-0000-0000-000000000002',4,'Santiago Vargas','DEF',15,'Activo'),
('61000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','40000000-0000-0000-0000-000000000002',5,'Diego Hernández','DEF',14,'Activo'),
('61000000-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','40000000-0000-0000-0000-000000000002',7,'Alejandro Ruiz','MED',15,'Activo'),
('61000000-0000-0000-0000-000000000005','11111111-1111-1111-1111-111111111111','40000000-0000-0000-0000-000000000002',10,'Emiliano Torres','MED',14,'Activo'),
('61000000-0000-0000-0000-000000000006','11111111-1111-1111-1111-111111111111','40000000-0000-0000-0000-000000000002',11,'Nicolás Castro','DEL',15,'Activo')
on conflict (id) do update set name=excluded.name,position=excluded.position,age=excluded.age;

insert into public.news(id,club_id,title,excerpt,category,image_url,is_featured,published_at) values
('70000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','Torneo Interno de Tenis 2026: ¡Éxito total en nuestra sede!','Más de 80 jugadores participaron en una semana llena de competencia, compañerismo y grandes partidos.','Deportes','https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=82',true,'2026-08-17 12:00:00-04'),
('70000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','Escuela de Fútbol – Nuevos horarios y categorías','Conoce los nuevos horarios y categorías para nuestras escuelas de fútbol.','Deportes','https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80',false,'2026-08-15 12:00:00-04'),
('70000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','Mantenimiento en Piscina Semiolímpica','La piscina permanecerá cerrada por mantenimiento programado.','Mantenimiento','https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=900&q=80',false,'2026-08-14 12:00:00-04'),
('70000000-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','Clase abierta de Yoga en el Parque','Te invitamos a nuestra clase abierta del sábado.','Eventos','https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=80',false,'2026-08-12 12:00:00-04'),
('70000000-0000-0000-0000-000000000005','11111111-1111-1111-1111-111111111111','Actualización de tarifas 2026','Consulta las nuevas tarifas de membresía y servicios del club.','Comunicados',null,false,'2026-08-10 12:00:00-04')
on conflict (id) do update set title=excluded.title,excerpt=excluded.excerpt,published_at=excluded.published_at;

insert into public.activities(id,club_id,title,kind,starts_at,ends_at,location) values
('80000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','Yoga en el Parque','activity','2026-08-19 07:00:00-04','2026-08-19 08:00:00-04','Área de Yoga'),
('80000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','Entrenamiento Funcional','activity','2026-08-20 18:30:00-04','2026-08-20 19:30:00-04','Gimnasio Principal'),
('80000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','Clases de Natación','activity','2026-08-21 17:00:00-04','2026-08-21 18:00:00-04','Piscina Semiolímpica'),
('80000000-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','Liga de Fútbol','game','2026-08-22 10:00:00-04','2026-08-22 12:00:00-04','Cancha Principal')
on conflict (id) do update set title=excluded.title,starts_at=excluded.starts_at,location=excluded.location;

insert into public.directory_entries(id,club_id,name,position,email,phone,sort_order) values
('a0000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','María Gómez','Presidenta Liga de Fútbol','futbol@clubdeportivo.com','+58 414 000 1001',1),
('a0000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','Carlos Ruiz','Presidente Liga de Tenis','tenis@clubdeportivo.com','+58 414 000 1002',2),
('a0000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','Laura Martínez','Coordinación de Natación','natacion@clubdeportivo.com','+58 414 000 1003',3),
('a0000000-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','José Mendoza','Coordinación Deportiva','deportes@clubdeportivo.com','+58 414 000 1004',4)
on conflict (id) do update set name=excluded.name,position=excluded.position,email=excluded.email;

insert into public.gallery_items(id,club_id,sport_id,team_id,image_url,caption) values
('b0000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80','Entrenamiento Sub-15'),
('b0000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80','Partido de Liga'),
('b0000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','20000000-0000-0000-0000-000000000006',null,'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=900&q=80','Natación del club')
on conflict (id) do update set image_url=excluded.image_url,caption=excluded.caption;

insert into public.streams(id,club_id,match_id,league_id,title,provider,external_url,status,viewers_count) values
('90000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','60000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000001','Los Leones vs Atlético del Valle','hls','https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8','active',523)
on conflict (id) do update set title=excluded.title,external_url=excluded.external_url,status=excluded.status;

-- Nota: seed.sql NO crea usuarios de Auth. Sigue database/first-admin.sql.
