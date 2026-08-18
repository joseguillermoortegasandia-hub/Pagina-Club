# Club Deportivo — Portal Web Responsive

Proyecto listo para abrir en **Visual Studio Code**. Replica la identidad visual de los mockups: azul marino, verde, blanco, tarjetas limpias, sidebar en escritorio y navegación inferior en teléfono.

## Qué incluye

- Login por **número de acción + contraseña**.
- Inicio del socio con actividades, próximos partidos, noticias y acciones rápidas.
- Catálogo de deportes ampliable sin tocar el frontend.
- Tabla de posiciones, resultados, calendario, equipos, roster y estadísticas.
- Perfil de equipo.
- Torneo de eliminación directa con cuadro/bracket.
- Centro de partido y **transmisión en vivo HLS/Mux**.
- Noticias con filtros.
- Calendario mensual.
- Galería y directorio.
- Mi cuenta.
- Panel de administración con creación de deportes, equipos, noticias, actividades, usuarios y transmisiones.
- Modo demo con `localStorage`.
- Modo producción con **Supabase/PostgreSQL + Auth + Storage + Realtime + Edge Functions**.
- SQL completo con RLS y roles.
- Edge Functions para crear usuarios y canales Mux sin exponer claves privadas.
- Diseño responsive / PWA básico.

## 1. Probarlo inmediatamente

No necesitas instalar Node para el modo demo.

1. Descomprime la carpeta.
2. Ábrela en VS Code: **File > Open Folder**.
3. Abre una terminal en VS Code.
4. En Windows, si tienes Python:

```bash
py -m http.server 5500
```

En macOS/Linux:

```bash
python3 -m http.server 5500
```

5. Abre en el navegador:

```text
http://localhost:5500
```

6. Credenciales de prueba:

```text
Número de acción: 12345
Contraseña: demo123
```

También puedes usar la extensión **Live Server** de VS Code y abrir `index.html` con ella.

## 2. Rutas/pantallas disponibles

La navegación normal te lleva por las pantallas principales. También puedes probar directamente:

```text
#/inicio
#/deportes
#/deporte/futbol
#/equipo/leones
#/torneo/tenis
#/transmisiones
#/noticias
#/calendario
#/galeria
#/directorio
#/cuenta
#/admin
```

En escritorio hay sidebar. En teléfono se transforma en barra inferior + menú móvil.

## 3. Pasarlo de demo a base de datos real

Lee en este orden:

1. `guides/BASE_DE_DATOS.md`
2. `database/schema.sql`
3. `database/seed.sql`
4. `database/first-admin.sql`
5. `guides/TRANSMISIONES_EN_VIVO.md`

Luego cambia `config.js`:

```js
window.CLUB_CONFIG = {
  MODE: 'supabase',
  CLUB_SLUG: 'club-deportivo',
  SUPABASE_URL: 'https://TU_PROJECT_REF.supabase.co',
  SUPABASE_ANON_KEY: 'TU_PUBLISHABLE_KEY',
  DEMO_ACTION_NUMBER: '12345',
  DEMO_PASSWORD: 'demo123',
  DEFAULT_TIMEZONE: 'America/Caracas'
};
```

> La clave pública/publishable sí puede estar en el frontend. La seguridad real se aplica con RLS. **Nunca** pongas `service_role`, `MUX_TOKEN_SECRET` ni una Stream Key en `config.js`.

## 4. Estructura

```text
club-deportivo-vscode/
├── index.html
├── config.js
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   ├── services.js
│   ├── views.js
│   └── app.js
├── assets/
│   └── logo.svg
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── first-admin.sql
├── supabase/
│   ├── config.toml
│   └── functions/
│       ├── create-user/
│       ├── create-mux-stream/
│       └── mux-webhook/
├── guides/
│   ├── BASE_DE_DATOS.md
│   ├── TRANSMISIONES_EN_VIVO.md
│   └── DESPLIEGUE.md
└── docs/referencias/
    └── mockups de referencia
```

## 5. Cómo funciona el login por número de acción

Supabase Auth usa email/contraseña internamente. El socio **nunca necesita conocer ese email**. El frontend transforma:

```text
Club: club-deportivo
Acción: 12345
```

en:

```text
club-deportivo.accion.12345@club.local
```

Y autentica ese usuario con su contraseña. El número de acción también queda guardado en `public.profiles`.

Esto permite mantener la experiencia que quieres: **Número de acción + clave**, pero usando un sistema de autenticación sólido.

## 6. Roles

- `super_admin`: plataforma completa.
- `club_admin`: administra todo el club.
- `league_president`: solo las ligas que tenga asignadas en `league_managers`.
- `editor`: noticias, actividades y contenido.
- `manager`: gestión operativa y transmisiones.
- `member`: socio de consulta.

Las políticas SQL de `schema.sql` aplican estas restricciones en PostgreSQL, no solo escondiendo botones en el frontend.

## 7. Transmisiones

El proyecto soporta tres proveedores:

- **Mux**: recomendado para una plataforma profesional.
- **YouTube**: opción fácil si el club ya transmite allí.
- **HLS/m3u8**: permite conectar cualquier proveedor que entregue una URL HLS válida.

Para Mux, el flujo es:

```text
OBS / encoder
      ↓ RTMPS
     Mux
      ↓ HLS
Portal web
      ↓
Socios
```

La Edge Function `create-mux-stream` guarda solamente el `playback_id` y el ID del Live Stream. La **Stream Key se devuelve al administrador una sola vez y no debe guardarse públicamente**.

## 8. Imágenes y logos

`schema.sql` crea el bucket `club-media` de Supabase Storage. La convención es:

```text
club-media/<club_id>/logos/...
club-media/<club_id>/noticias/...
club-media/<club_id>/galeria/...
```

Las políticas RLS impiden que un editor de un club modifique los archivos de otro club.

## 9. Referencias oficiales

- Supabase + Next/web concepts: https://supabase.com/docs
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Storage: https://supabase.com/docs/guides/storage
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Supabase Realtime: https://supabase.com/docs/guides/realtime/postgres-changes
- Mux Live Streaming: https://www.mux.com/docs/guides/start-live-streaming
- Mux + OBS: https://www.mux.com/docs/guides/configure-broadcast-software
- Mux Webhook signatures: https://www.mux.com/docs/core/verify-webhook-signatures

## Importante antes de producción

El modo demo es para probar el diseño y los flujos. Para un club real debes activar Supabase, ejecutar el SQL, crear el primer administrador y desplegar las Edge Functions. También debes cambiar textos, logo, imágenes y datos de prueba por los del club cliente.
