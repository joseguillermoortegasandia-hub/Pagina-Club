-- ============================================================
-- PRIMER ADMINISTRADOR
-- 1) En Supabase > Authentication > Users > Add user crea:
--    Email: club-deportivo.accion.12345@club.local
--    Password: elige una contraseña segura
--    Marca el email como confirmado.
-- 2) Ejecuta este SQL. Busca el usuario por ese correo y crea su perfil.
-- ============================================================
insert into public.profiles(id,club_id,action_number,full_name,notification_email,role,status)
select
  id,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '12345',
  'Administrador Principal',
  null,
  'club_admin'::public.app_role,
  'Activo'
from auth.users
where email='club-deportivo.accion.12345@club.local'
on conflict (id) do update set
  club_id=excluded.club_id,
  action_number=excluded.action_number,
  full_name=excluded.full_name,
  role=excluded.role,
  status=excluded.status;

-- Verificación:
select p.id,p.full_name,p.action_number,p.role,c.name as club
from public.profiles p join public.clubs c on c.id=p.club_id
where p.action_number='12345';
