# Base de datos SQL — Paso a paso

La solución recomendada es **Supabase**, porque la base de datos sigue siendo PostgreSQL/SQL, pero además obtienes autenticación, almacenamiento de imágenes, API, Realtime y Edge Functions.

## Arquitectura

```text
Socio / Presidente / Administración
              ↓
        Portal web responsive
              ↓
       Supabase Auth + RLS
              ↓
      PostgreSQL (tablas SQL)
       ↙        ↓        ↘
 Storage     Realtime   Edge Functions
```

## Paso 1 — Crear el proyecto Supabase

1. Entra a Supabase y crea un proyecto nuevo.
2. Elige una contraseña fuerte para PostgreSQL y guárdala.
3. Espera a que el proyecto termine de aprovisionarse.
4. Abre **SQL Editor**.

## Paso 2 — Crear todas las tablas

1. Abre `database/schema.sql` en VS Code.
2. Copia el archivo completo.
3. Pégalo en **Supabase > SQL Editor > New query**.
4. Pulsa **Run**.

Esto crea:

- `clubs`
- `profiles`
- `sports`
- `leagues`
- `league_managers`
- `teams`
- `players`
- `competitions`
- `matches`
- `standings`
- `match_events`
- `match_stats`
- `news`
- `activities`
- `gallery_items`
- `directory_entries`
- `streams`
- `audit_log`

También crea:

- Roles SQL.
- Row Level Security (RLS).
- Políticas para separar clubes.
- Permisos de presidentes por liga.
- Bucket `club-media` de Storage.
- Realtime en `streams`.

## Paso 3 — Insertar el club y datos de ejemplo

1. Abre `database/seed.sql`.
2. Copia todo.
3. Ejecuta en SQL Editor.

El club de ejemplo usa:

```text
ID: 11111111-1111-1111-1111-111111111111
Slug: club-deportivo
```

Puedes conservarlo para pruebas y luego editar los datos desde la tabla `clubs`.

## Paso 4 — Crear el primer usuario administrador

El login visible será número de acción + contraseña, pero Supabase Auth necesita un identificador interno.

En **Authentication > Users > Add user** crea:

```text
Email: club-deportivo.accion.12345@club.local
Password: una contraseña segura
Auto confirm / Email confirmed: Sí
```

Después abre `database/first-admin.sql` y ejecútalo.

Ese SQL enlaza el usuario de Auth con:

```text
Número de acción: 12345
Rol: club_admin
Club: Club Deportivo
```

Ahora edita `config.js` y activa Supabase.

## Paso 5 — Obtener URL y Publishable Key

En el panel de Supabase abre el diálogo **Connect** / API de tu proyecto y copia:

- Project URL
- Publishable key (en proyectos antiguos puede aparecer como `anon` key)

Colócalos en `config.js`:

```js
MODE: 'supabase',
SUPABASE_URL: 'https://TU_PROJECT_REF.supabase.co',
SUPABASE_ANON_KEY: 'TU_PUBLISHABLE_KEY'
```

No pongas la `service_role` key en el navegador.

## Paso 6 — Probar el login real

Inicia el servidor local:

```bash
py -m http.server 5500
```

Abre:

```text
http://localhost:5500
```

Entra con:

```text
Acción: 12345
Clave: la contraseña que creaste en Supabase Auth
```

El frontend convierte automáticamente ese número en el email interno.

## Paso 7 — Crear más usuarios desde el propio panel

Para que el botón **Administración > Nuevo Usuario** funcione en producción necesitas desplegar la Edge Function `create-user`.

### Instalar/usar Supabase CLI

Desde la carpeta del proyecto:

```bash
npx supabase login
npx supabase link --project-ref TU_PROJECT_REF
npx supabase functions deploy create-user
```

La función:

1. Verifica el JWT del administrador.
2. Comprueba que sea `super_admin` o `club_admin`.
3. Crea el usuario en Supabase Auth.
4. Genera el email interno basado en club + número de acción.
5. Inserta `profiles`.
6. Registra la acción en `audit_log`.

## Paso 8 — Asignar un presidente a una liga

Primero crea el usuario con rol `league_president`. Después inserta una asignación:

```sql
insert into public.league_managers (league_id, user_id)
values (
  'ID-DE-LA-LIGA',
  'ID-DEL-USUARIO'
);
```

A partir de ahí las políticas RLS permiten que ese presidente edite equipos, partidos, posiciones y transmisiones de **esa liga**, pero no de las demás.

## Paso 9 — Subir logos e imágenes

El bucket `club-media` ya queda creado por `schema.sql`.

La ruta debe comenzar por el `club_id`:

```text
11111111-1111-1111-1111-111111111111/logos/logo-equipo.png
```

La función `AppAPI.uploadMedia()` en `js/services.js` ya contiene el código para subir archivos mediante Supabase Storage.

Para una pantalla de carga personalizada puedes llamar:

```js
const url = await AppAPI.uploadMedia(file, 'logos');
```

y guardar `url` en `teams.logo_url` o `news.image_url`.

## Paso 10 — Qué significa RLS

RLS significa **Row Level Security**. No confíes únicamente en ocultar botones con JavaScript.

Ejemplo:

- Un socio puede leer los datos de su club.
- Un presidente de fútbol puede modificar la liga que tenga asignada.
- No puede modificar tenis.
- Un administrador puede administrar todo el club.
- Los registros de otro club quedan fuera de su política SQL.

## Paso 11 — Copias de seguridad

Antes de pasar a producción:

- Guarda `schema.sql` en Git.
- Usa las copias/backup disponibles en tu plan de Supabase.
- Exporta periódicamente datos críticos.
- Nunca borres `auth.users` directamente desde tablas SQL para operaciones normales; usa las APIs de Auth.

## Fuentes oficiales

- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
- https://supabase.com/docs/guides/storage/security/access-control
- https://supabase.com/docs/guides/functions
- https://supabase.com/docs/guides/realtime/postgres-changes
