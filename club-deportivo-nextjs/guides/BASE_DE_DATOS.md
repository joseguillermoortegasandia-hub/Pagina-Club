# Base de datos · Supabase PostgreSQL

## Orden exacto

1. Crear proyecto Supabase.
2. `SQL Editor` -> ejecutar `database/schema.sql` completo.
3. Ejecutar `database/seed.sql` para datos iniciales.
4. Crear el administrador desde `Authentication > Users`.
5. Editar correo/acción en `database/first-admin.sql` y ejecutarlo.
6. Colocar URL, Publishable Key y Secret Key en `.env.local`.
7. Cambiar `NEXT_PUBLIC_DEMO_MODE=false` solamente cuando la autenticación real esté comprobada.

## Modelo principal

`clubs -> sports -> leagues -> competitions -> teams -> players -> matches -> standings`

Contenido: `news`, `activities`, `gallery_items`, `directory_entries`.

Video: `streams` almacena el ID del Live Stream y Playback ID de Mux. La Stream Key no se guarda en esta tabla.

Seguridad: todas las entidades incluyen `club_id` y las políticas RLS consultan el club del usuario autenticado.

## Nuevo club

Usa `database/new-club-template.sql`, crea un admin en Auth y registra su perfil con el `club_id` nuevo. Después agrega un registro en `club_domains`.

## Nota sobre imágenes

El bucket `club-media` está configurado como público porque se usa para logos, noticias y fotografías que el portal debe servir directamente. No lo uses para documentos privados, cédulas, contratos o archivos sensibles. Si necesitas documentos privados, crea un bucket separado privado y entrega archivos mediante URLs firmadas.
