-- DUPLICA ESTE ARCHIVO PARA CADA CLIENTE NUEVO.
-- Cambia SOLO los valores marcados TODO.
-- No reutilices números de acción entre clubes si comparten un dominio de login global.

insert into public.clubs(name,slug,since,primary_color,accent_color,timezone)
values ('TODO NOMBRE CLUB','todo-slug','TODO AÑO','#06294a','#4fbe2f','America/Caracas')
returning id;

-- Después de conocer el UUID devuelto, registra el dominio.
-- Debe apuntar a Vercel y luego marcarse verified=true cuando esté comprobado.
-- insert into public.club_domains(club_id,domain,verified)
-- values ('TODO CLUB UUID','portal.tuclub.com',true);
