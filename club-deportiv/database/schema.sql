-- ============================================================
-- CLUB DEPORTIVO - ESQUEMA POSTGRESQL / SUPABASE
-- Ejecutar completo en Supabase > SQL Editor > New query > Run
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- Tipos ----------
do $$ begin
  create type public.app_role as enum ('super_admin','club_admin','league_president','editor','manager','member');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.match_status as enum ('scheduled','live','finished','postponed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.stream_status as enum ('idle','active','disconnected','finished','error');
exception when duplicate_object then null; end $$;

-- ---------- Núcleo ----------
create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  since text,
  logo_url text,
  primary_color text not null default '#06294a',
  accent_color text not null default '#4fbe2f',
  timezone text not null default 'America/Caracas',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  club_id uuid not null references public.clubs(id) on delete cascade,
  action_number text not null,
  full_name text not null,
  notification_email text,
  phone text,
  avatar_url text,
  role public.app_role not null default 'member',
  status text not null default 'Activo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, action_number)
);
create index if not exists profiles_club_idx on public.profiles(club_id);

-- Funciones de seguridad. SECURITY DEFINER evita recursión de RLS en profiles.
create or replace function public.current_user_club_id()
returns uuid language sql stable security definer set search_path=public as $$
  select club_id from public.profiles where id = auth.uid() limit 1;
$$;

create or replace function public.current_user_role()
returns public.app_role language sql stable security definer set search_path=public as $$
  select role from public.profiles where id = auth.uid() limit 1;
$$;

create or replace function public.can_manage_club()
returns boolean language sql stable security definer set search_path=public as $$
  select coalesce(public.current_user_role() in ('super_admin','club_admin'), false);
$$;

create or replace function public.can_edit_content()
returns boolean language sql stable security definer set search_path=public as $$
  select coalesce(public.current_user_role() in ('super_admin','club_admin','editor','manager'), false);
$$;

-- ---------- Deportes, ligas y equipos ----------
create table if not exists public.sports (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null default public.current_user_club_id() references public.clubs(id) on delete cascade,
  name text not null,
  slug text not null,
  icon text default '🏆',
  description text,
  image_url text,
  category_count int not null default 0,
  team_count int not null default 0,
  match_count int not null default 0,
  player_count int not null default 0,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, slug)
);

create table if not exists public.leagues (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null default public.current_user_club_id() references public.clubs(id) on delete cascade,
  sport_id uuid not null references public.sports(id) on delete cascade,
  name text not null,
  category text,
  season_label text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.league_managers (
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (league_id, user_id)
);

create or replace function public.can_manage_league(target_league uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select public.can_manage_club()
  or exists (
    select 1 from public.league_managers lm
    join public.leagues l on l.id=lm.league_id
    where lm.user_id=auth.uid()
      and lm.league_id=target_league
      and l.club_id=public.current_user_club_id()
  );
$$;

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null default public.current_user_club_id() references public.clubs(id) on delete cascade,
  sport_id uuid not null references public.sports(id) on delete cascade,
  league_id uuid references public.leagues(id) on delete set null,
  name text not null,
  slug text not null,
  short_name text,
  logo_url text,
  logo_text text,
  category text,
  coach_name text,
  description text,
  founded_year int,
  primary_color text default '#06294a',
  secondary_color text default '#e6b93e',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, slug)
);

create or replace function public.can_manage_team(target_team uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select public.can_manage_club()
  or exists (
    select 1 from public.teams t
    where t.id=target_team and t.club_id=public.current_user_club_id()
      and t.league_id is not null and public.can_manage_league(t.league_id)
  );
$$;

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null default public.current_user_club_id() references public.clubs(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  number int,
  name text not null,
  position text,
  age int,
  photo_url text,
  status text not null default 'Activo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Torneos, partidos y estadísticas ----------
create table if not exists public.competitions (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null default public.current_user_club_id() references public.clubs(id) on delete cascade,
  sport_id uuid not null references public.sports(id) on delete cascade,
  league_id uuid references public.leagues(id) on delete set null,
  name text not null,
  category text,
  format text,
  surface text,
  location text,
  start_date date,
  end_date date,
  status text not null default 'active',
  bracket jsonb not null default '[]'::jsonb,
  rules_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null default public.current_user_club_id() references public.clubs(id) on delete cascade,
  sport_id uuid not null references public.sports(id) on delete cascade,
  league_id uuid references public.leagues(id) on delete set null,
  competition_id uuid references public.competitions(id) on delete set null,
  home_team_id uuid references public.teams(id) on delete set null,
  away_team_id uuid references public.teams(id) on delete set null,
  scheduled_at timestamptz not null,
  venue text,
  home_score int,
  away_score int,
  status public.match_status not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists matches_club_date_idx on public.matches(club_id, scheduled_at desc);

create table if not exists public.standings (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null default public.current_user_club_id() references public.clubs(id) on delete cascade,
  sport_id uuid not null references public.sports(id) on delete cascade,
  league_id uuid references public.leagues(id) on delete cascade,
  competition_id uuid references public.competitions(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  rank int not null,
  played int not null default 0,
  won int not null default 0,
  drawn int not null default 0,
  lost int not null default 0,
  gf int not null default 0,
  ga int not null default 0,
  gd int generated always as (gf-ga) stored,
  points int not null default 0,
  updated_at timestamptz not null default now(),
  unique (competition_id, team_id)
);

create table if not exists public.match_events (
  id bigint generated by default as identity primary key,
  club_id uuid not null default public.current_user_club_id() references public.clubs(id) on delete cascade,
  match_id uuid not null references public.matches(id) on delete cascade,
  minute text,
  event_type text not null,
  team_id uuid references public.teams(id) on delete set null,
  player_id uuid references public.players(id) on delete set null,
  detail text,
  created_at timestamptz not null default now()
);

create table if not exists public.match_stats (
  id bigint generated by default as identity primary key,
  club_id uuid not null default public.current_user_club_id() references public.clubs(id) on delete cascade,
  match_id uuid not null references public.matches(id) on delete cascade,
  stat_key text not null,
  label text not null,
  home_value numeric not null default 0,
  away_value numeric not null default 0,
  suffix text,
  updated_at timestamptz not null default now(),
  unique(match_id, stat_key)
);

-- ---------- Contenido ----------
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null default public.current_user_club_id() references public.clubs(id) on delete cascade,
  sport_id uuid references public.sports(id) on delete set null,
  league_id uuid references public.leagues(id) on delete set null,
  title text not null,
  excerpt text,
  body text,
  category text not null default 'Comunicados',
  image_url text,
  is_featured boolean not null default false,
  published_at timestamptz default now(),
  created_by uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null default public.current_user_club_id() references public.clubs(id) on delete cascade,
  sport_id uuid references public.sports(id) on delete set null,
  league_id uuid references public.leagues(id) on delete set null,
  title text not null,
  description text,
  kind text not null default 'activity',
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  created_by uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null default public.current_user_club_id() references public.clubs(id) on delete cascade,
  sport_id uuid references public.sports(id) on delete set null,
  team_id uuid references public.teams(id) on delete set null,
  image_url text not null,
  caption text,
  created_by uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.directory_entries (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null default public.current_user_club_id() references public.clubs(id) on delete cascade,
  name text not null,
  position text,
  email text,
  phone text,
  avatar_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Transmisiones ----------
-- Nunca guardes MUX_TOKEN_SECRET ni la Stream Key en esta tabla.
create table if not exists public.streams (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null default public.current_user_club_id() references public.clubs(id) on delete cascade,
  match_id uuid references public.matches(id) on delete set null,
  league_id uuid references public.leagues(id) on delete set null,
  title text not null,
  provider text not null default 'mux', -- mux | youtube | hls
  mux_live_stream_id text unique,
  playback_id text,
  external_url text,
  status public.stream_status not null default 'idle',
  viewers_count int not null default 0,
  started_at timestamptz,
  ended_at timestamptz,
  created_by uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists streams_club_status_idx on public.streams(club_id,status);

-- ---------- Auditoría ----------
create table if not exists public.audit_log (
  id bigint generated by default as identity primary key,
  club_id uuid references public.clubs(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity text,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------- updated_at ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at=now(); return new; end $$;

do $$
declare t text;
begin
  foreach t in array array['clubs','profiles','sports','leagues','teams','players','competitions','matches','standings','match_stats','news','activities','directory_entries','streams'] loop
    execute format('drop trigger if exists trg_touch_updated_at on public.%I',t);
    execute format('create trigger trg_touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()',t);
  end loop;
end $$;

-- ---------- RLS ----------
alter table public.clubs enable row level security;
alter table public.profiles enable row level security;
alter table public.sports enable row level security;
alter table public.leagues enable row level security;
alter table public.league_managers enable row level security;
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.competitions enable row level security;
alter table public.matches enable row level security;
alter table public.standings enable row level security;
alter table public.match_events enable row level security;
alter table public.match_stats enable row level security;
alter table public.news enable row level security;
alter table public.activities enable row level security;
alter table public.gallery_items enable row level security;
alter table public.directory_entries enable row level security;
alter table public.streams enable row level security;
alter table public.audit_log enable row level security;

-- Lectura: un usuario autenticado solo ve su club.
do $$
declare t text;
begin
  foreach t in array array['sports','leagues','teams','players','competitions','matches','standings','match_events','match_stats','news','activities','gallery_items','directory_entries','streams'] loop
    execute format('drop policy if exists club_read on public.%I',t);
    execute format('create policy club_read on public.%I for select to authenticated using (club_id = public.current_user_club_id())',t);
  end loop;
end $$;

drop policy if exists club_self_read on public.clubs;
create policy club_self_read on public.clubs for select to authenticated using (id=public.current_user_club_id());

drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated using (club_id=public.current_user_club_id());
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles for update to authenticated using (id=auth.uid()) with check (id=auth.uid() and club_id=public.current_user_club_id());

-- Administración del club.
drop policy if exists clubs_admin_update on public.clubs;
create policy clubs_admin_update on public.clubs for update to authenticated using (id=public.current_user_club_id() and public.can_manage_club()) with check (id=public.current_user_club_id());

drop policy if exists sports_admin_all on public.sports;
create policy sports_admin_all on public.sports for all to authenticated using (club_id=public.current_user_club_id() and public.can_manage_club()) with check (club_id=public.current_user_club_id() and public.can_manage_club());

-- Ligas: admin o presidente asignado.
drop policy if exists leagues_manage on public.leagues;
create policy leagues_manage on public.leagues for all to authenticated using (club_id=public.current_user_club_id() and public.can_manage_league(id)) with check (club_id=public.current_user_club_id() and (public.can_manage_club() or (id is not null and public.can_manage_league(id))));

drop policy if exists league_managers_read on public.league_managers;
create policy league_managers_read on public.league_managers for select to authenticated using (exists(select 1 from public.leagues l where l.id=league_id and l.club_id=public.current_user_club_id()));
drop policy if exists league_managers_admin on public.league_managers;
create policy league_managers_admin on public.league_managers for all to authenticated using (public.can_manage_club()) with check (public.can_manage_club());

-- Equipos y jugadores: admin o presidente de su liga.
drop policy if exists teams_manage on public.teams;
create policy teams_manage on public.teams for all to authenticated using (club_id=public.current_user_club_id() and (public.can_manage_club() or (league_id is not null and public.can_manage_league(league_id)))) with check (club_id=public.current_user_club_id() and (public.can_manage_club() or (league_id is not null and public.can_manage_league(league_id))));

drop policy if exists players_manage on public.players;
create policy players_manage on public.players for all to authenticated using (club_id=public.current_user_club_id() and (public.can_manage_club() or public.can_manage_team(team_id))) with check (club_id=public.current_user_club_id() and (public.can_manage_club() or public.can_manage_team(team_id)));

-- Tablas asociadas a liga: admin o presidente asignado.
do $$
declare t text;
begin
  foreach t in array array['competitions','matches','standings','streams'] loop
    execute format('drop policy if exists league_write on public.%I',t);
    execute format('create policy league_write on public.%I for all to authenticated using (club_id=public.current_user_club_id() and (public.can_edit_content() or (league_id is not null and public.can_manage_league(league_id)))) with check (club_id=public.current_user_club_id() and (public.can_edit_content() or (league_id is not null and public.can_manage_league(league_id))))',t);
  end loop;
end $$;

-- Estadísticas/eventos: permisos por el partido relacionado.
drop policy if exists match_events_write on public.match_events;
create policy match_events_write on public.match_events for all to authenticated using (
  club_id=public.current_user_club_id() and exists(select 1 from public.matches m where m.id=match_id and (public.can_edit_content() or (m.league_id is not null and public.can_manage_league(m.league_id))))
) with check (
  club_id=public.current_user_club_id() and exists(select 1 from public.matches m where m.id=match_id and (public.can_edit_content() or (m.league_id is not null and public.can_manage_league(m.league_id))))
);

drop policy if exists match_stats_write on public.match_stats;
create policy match_stats_write on public.match_stats for all to authenticated using (
  club_id=public.current_user_club_id() and exists(select 1 from public.matches m where m.id=match_id and (public.can_edit_content() or (m.league_id is not null and public.can_manage_league(m.league_id))))
) with check (
  club_id=public.current_user_club_id() and exists(select 1 from public.matches m where m.id=match_id and (public.can_edit_content() or (m.league_id is not null and public.can_manage_league(m.league_id))))
);

-- Contenido general: administración/editor/gestor, o presidente de la liga indicada.
do $$
declare t text;
begin
  foreach t in array array['news','activities'] loop
    execute format('drop policy if exists content_write on public.%I',t);
    execute format('create policy content_write on public.%I for all to authenticated using (club_id=public.current_user_club_id() and (public.can_edit_content() or (league_id is not null and public.can_manage_league(league_id)))) with check (club_id=public.current_user_club_id() and (public.can_edit_content() or (league_id is not null and public.can_manage_league(league_id))))',t);
  end loop;
end $$;

drop policy if exists gallery_write on public.gallery_items;
create policy gallery_write on public.gallery_items for all to authenticated using (club_id=public.current_user_club_id() and public.can_edit_content()) with check (club_id=public.current_user_club_id() and public.can_edit_content());

drop policy if exists directory_write on public.directory_entries;
create policy directory_write on public.directory_entries for all to authenticated using (club_id=public.current_user_club_id() and public.can_manage_club()) with check (club_id=public.current_user_club_id() and public.can_manage_club());

-- Auditoría solo para administradores; inserts por usuarios autorizados.
drop policy if exists audit_admin_read on public.audit_log;
create policy audit_admin_read on public.audit_log for select to authenticated using (club_id=public.current_user_club_id() and public.can_manage_club());
drop policy if exists audit_insert on public.audit_log;
create policy audit_insert on public.audit_log for insert to authenticated with check (club_id=public.current_user_club_id() and user_id=auth.uid());

-- ---------- Storage ----------
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('club-media','club-media',true,10485760,array['image/jpeg','image/png','image/webp','image/svg+xml'])
on conflict (id) do update set public=excluded.public, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists club_media_read on storage.objects;
create policy club_media_read on storage.objects for select to authenticated using (bucket_id='club-media' and (storage.foldername(name))[1]=public.current_user_club_id()::text);
drop policy if exists club_media_insert on storage.objects;
create policy club_media_insert on storage.objects for insert to authenticated with check (bucket_id='club-media' and (storage.foldername(name))[1]=public.current_user_club_id()::text and public.can_edit_content());
drop policy if exists club_media_update on storage.objects;
create policy club_media_update on storage.objects for update to authenticated using (bucket_id='club-media' and (storage.foldername(name))[1]=public.current_user_club_id()::text and public.can_edit_content());
drop policy if exists club_media_delete on storage.objects;
create policy club_media_delete on storage.objects for delete to authenticated using (bucket_id='club-media' and (storage.foldername(name))[1]=public.current_user_club_id()::text and public.can_edit_content());

-- ---------- Realtime para el estado de transmisiones ----------
do $$ begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='streams') then
    alter publication supabase_realtime add table public.streams;
  end if;
exception when undefined_object then null; end $$;

-- Permisos básicos del API. RLS sigue siendo la capa de seguridad real.
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- Fin del esquema.
