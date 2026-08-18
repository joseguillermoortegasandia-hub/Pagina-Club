# Transmisiones en vivo — Mux + OBS + Portal

La forma más limpia para el proyecto es no intentar convertir tu servidor web en un servidor de video. El navegador no debe recibir la señal directamente de OBS.

## Arquitectura recomendada

```text
Cámara / capturadora
       ↓
      OBS
       ↓ RTMPS + Stream Key
      Mux
       ↓ HLS adaptativo
  Portal del club
       ↓
     Socios
```

Mux se encarga de recibir la señal, transcodificarla en diferentes calidades y distribuirla. El portal únicamente reproduce el `playback_id`.

## Opción A — Mux (recomendada)

### Paso 1 — Crear cuenta/proyecto en Mux

1. Crea tu cuenta Mux.
2. En el dashboard crea un **Access Token** con permisos de Video Read/Write.
3. Guarda:

```text
MUX_TOKEN_ID
MUX_TOKEN_SECRET
```

No pongas estas claves en `config.js` ni en Git.

### Paso 2 — Desplegar la función que crea canales

Desde la raíz del proyecto:

```bash
npx supabase login
npx supabase link --project-ref TU_PROJECT_REF
npx supabase functions deploy create-mux-stream
```

Configura los secretos:

```bash
npx supabase secrets set MUX_TOKEN_ID=TU_TOKEN_ID
npx supabase secrets set MUX_TOKEN_SECRET=TU_TOKEN_SECRET
```

Supabase proporciona a sus Edge Functions las variables de su propio proyecto, incluida la URL y la clave de servicio necesaria para tareas de servidor.

### Paso 3 — Crear una transmisión desde la web

Entra como administrador:

```text
Administración
→ Acciones rápidas
→ Programar transmisión
→ Proveedor: Mux
→ Guardar
```

La aplicación llama a `create-mux-stream`.

La función solicita a Mux un Live Stream y te devuelve:

```text
Server URL
Stream Key
Playback ID
```

El `Playback ID` se guarda en SQL. La Stream Key se muestra al administrador y debe tratarse como una contraseña.

### Paso 4 — Configurar OBS

En OBS:

```text
Settings / Ajustes
→ Stream
→ Service: Custom
```

Server:

```text
rtmps://global-live.mux.com:443/app
```

Stream Key:

```text
LA_STREAM_KEY_QUE_TE_DIO_EL_PANEL
```

Después pulsa **Start Streaming / Iniciar transmisión**.

Mux recomienda H.264 para video y AAC para audio. Empieza con 1080p/30 fps si la conexión de subida y el equipo lo soportan; si la red es más limitada, usa 720p/30 fps.

### Paso 5 — Reproducción dentro del portal

El portal construye una URL HLS:

```text
https://stream.mux.com/PLAYBACK_ID.m3u8
```

`js/app.js` usa reproducción HLS nativa en Safari y **hls.js** en los navegadores que lo necesitan.

No tienes que pegar la Stream Key en el reproductor. El espectador utiliza el Playback ID.

## Paso 6 — Detectar automáticamente cuándo comenzó o terminó

Mux envía webhooks, por ejemplo:

```text
video.live_stream.active
video.live_stream.disconnected
video.live_stream.idle
```

El proyecto incluye:

```text
supabase/functions/mux-webhook/index.ts
```

Despliégala:

```bash
npx supabase functions deploy mux-webhook --no-verify-jwt
```

La URL será similar a:

```text
https://TU_PROJECT_REF.supabase.co/functions/v1/mux-webhook
```

En Mux Dashboard crea un webhook apuntando a esa URL.

Mux te dará un **Webhook Signing Secret**. Guárdalo en Supabase:

```bash
npx supabase secrets set MUX_WEBHOOK_SECRET=TU_WEBHOOK_SECRET
```

La función incluida verifica el header `mux-signature` mediante HMAC SHA-256 antes de aceptar el evento.

Cuando Mux notifica `active`, la función actualiza:

```sql
streams.status = 'active'
```

Cuando deja de transmitir, actualiza el estado nuevamente.

`js/services.js` se suscribe con Supabase Realtime a la tabla `streams`, por lo que la pantalla puede refrescar el estado sin que el socio tenga que recargar manualmente.

## Paso 7 — Seguridad importante

### Nunca expongas

```text
MUX_TOKEN_SECRET
SUPABASE_SERVICE_ROLE_KEY
Stream Key de OBS
MUX_WEBHOOK_SECRET
```

Estas credenciales solo deben vivir en Edge Functions / secretos del servidor.

### Sí puede estar en el navegador

```text
Supabase Publishable/anon key
Playback ID público de Mux
URL HLS pública
```

Siempre que tus datos de Supabase tengan RLS correctamente configurado.

## Opción B — YouTube Live

Si quieres algo más sencillo al inicio:

1. El club transmite desde OBS a YouTube Live.
2. En el panel de administración seleccionas `YouTube`.
3. Guardas el enlace/embed del directo en `streams.external_url`.
4. Puedes adaptar `renderLive()` en `js/views.js` para mostrar un `<iframe>` cuando `provider === 'youtube'`.

Ventaja: administración sencilla.

Desventaja: menos control sobre experiencia, branding, privacidad y flujo del video.

## Opción C — cualquier proveedor HLS

Si un proveedor te entrega directamente algo como:

```text
https://servidor.com/canal/partido.m3u8
```

selecciona `HLS / m3u8` en el panel y guarda esa URL. El reproductor actual ya la reproduce.

## Latencia

Mux ofrece modos de latencia distintos. En su documentación actual, el modo `reduced` busca aproximadamente 10–15 segundos y el modo `low` puede bajar hacia unos 5 segundos, dependiendo de la red y ubicación del espectador.

El código de `create-mux-stream` usa:

```json
{"latency_mode":"reduced"}
```

porque es un buen punto de partida para deportes sin asumir los compromisos de un modo todavía más agresivo.

## Recomendación para el club

Primera versión:

```text
OBS + Mux + HLS + Webhooks + Supabase Realtime
```

Más adelante puedes agregar:

- marcador manejado por anotador en tiempo real;
- chat persistente;
- estadísticas en vivo desde mesa técnica;
- replay/VOD automático del partido;
- simulcast hacia YouTube/Facebook;
- transmisiones privadas mediante playback firmado.

## Fuentes oficiales

- https://www.mux.com/docs/guides/start-live-streaming
- https://www.mux.com/docs/guides/configure-broadcast-software
- https://www.mux.com/docs/core/listen-for-webhooks
- https://www.mux.com/docs/core/verify-webhook-signatures
- https://supabase.com/docs/guides/functions
- https://supabase.com/docs/guides/functions/secrets
- https://supabase.com/docs/guides/realtime/postgres-changes
