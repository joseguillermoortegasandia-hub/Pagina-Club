# Checklist para dejar Club Deportivo listo para vender

Esta lista separa lo que ya está programado de lo que debes hacer tú porque requiere crear cuentas, aceptar términos, usar credenciales privadas, verificar dominios o tomar decisiones comerciales/legales.

## Fase 1 — Preparar tu computadora

1. Instala Node.js 20.9 o superior.
2. Descomprime el proyecto y ábrelo completo en VS Code.
3. En la terminal:

```bash
npm install
cp .env.example .env.local
npm run dev
```

4. Prueba `http://localhost:3000` en modo demo.
5. Acción demo: `12345`; contraseña: `demo123`.

## Fase 2 — Crear Supabase

Esto requiere tu cuenta de Supabase; no debe hacerlo otra persona con tus credenciales.

1. Crea un proyecto en Supabase.
2. Guarda la contraseña de la base de datos en un gestor de contraseñas.
3. Abre `SQL Editor`.
4. Ejecuta TODO `database/schema.sql`.
5. Ejecuta TODO `database/seed.sql` para crear el club de prueba y datos iniciales.
6. En `Authentication > Users`, crea el primer administrador con un correo REAL que controles y una contraseña fuerte.
7. Abre `database/first-admin.sql` y sustituye **todas** las apariciones de `admin@tuclub.com` por el correo que acabas de crear.
8. Si no quieres que su número de acción sea `12345`, cambia también ese valor.
9. Ejecuta `database/first-admin.sql`.
10. En `Project Settings/API`, copia:
   - Project URL
   - Publishable Key
   - Secret Key del servidor
11. Pégalos en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
```

**Nunca** pongas `SUPABASE_SECRET_KEY` en una variable `NEXT_PUBLIC_` ni la pegues en código del navegador.

## Fase 3 — SMTP / recuperación de contraseña

Para producción no dependas del correo de prueba de Supabase.

1. Contrata/configura un proveedor SMTP (Resend, Postmark, SendGrid, Amazon SES u otro).
2. En Supabase configura `Authentication > Email / SMTP` según el proveedor.
3. Configura tu remitente, por ejemplo `no-reply@tudominio.com`.
4. Prueba “Olvidaste tu clave” con un usuario real.
5. Comprueba spam, SPF, DKIM y DMARC en tu dominio.

## Fase 4 — Crear Mux para el video en vivo

1. Crea tu cuenta de Mux.
2. En Mux crea un Environment de producción.
3. Genera un Access Token con permisos de lectura/escritura para Mux Video.
4. Copia Token ID y Token Secret en `.env.local`:

```env
MUX_TOKEN_ID=...
MUX_TOKEN_SECRET=...
```

5. En el portal entra como administrador > `Administración` > `Crear transmisión Mux`.
6. El sistema devolverá una sola vez:
   - Server: `rtmps://global-live.mux.com:443/app`
   - Stream Key
   - Playback ID
7. En OBS: `Ajustes > Emisión > Servicio: Personalizado`.
8. Pega Server y Stream Key.
9. Nunca publiques la Stream Key en WhatsApp abierto, redes, GitHub ni capturas públicas.
10. Inicia OBS y verifica que el stream cambie a `active`.

## Fase 5 — Webhook de Mux

1. Primero despliega una versión en Vercel para tener una URL pública.
2. En Mux crea un webhook apuntando a:

```text
https://TU-DOMINIO.com/api/mux/webhook
```

3. Copia el Signing Secret del webhook.
4. Agrégalo como `MUX_WEBHOOK_SIGNING_SECRET` en Vercel y `.env.local`.
5. Redeploy.
6. Haz una transmisión de prueba y confirma que la tabla `streams` cambia entre `idle`, `active` y `disconnected`.

## Fase 6 — GitHub

1. Crea un repositorio privado.
2. NO subas `.env.local`.
3. Ejecuta:

```bash
git init
git add .
git commit -m "Plataforma Club Deportivo"
git branch -M main
git remote add origin URL_DE_TU_REPO
git push -u origin main
```

4. Revisa en GitHub que no exista ningún token/secret en el historial.

## Fase 7 — Vercel

1. Crea tu cuenta/equipo de Vercel.
2. Importa el repositorio de GitHub.
3. Vercel detectará Next.js.
4. En `Settings > Environment Variables`, agrega todas las variables de `.env.local` excepto comentarios.
5. En producción usa:

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

6. Deploy.
7. Ejecuta `npm run build` localmente antes de cada release importante.

## Fase 8 — Dominio y multi-club

Para tu primer club puedes usar un dominio como `portal.clubnombre.com`.

1. Compra/usa un dominio que controles.
2. Agrégalo en Vercel.
3. Crea los registros DNS que Vercel indique.
4. En Supabase agrega el dominio a `club_domains`:

```sql
insert into public.club_domains(club_id,domain,verified)
values ('UUID_DEL_CLUB','portal.clubnombre.com',true);
```

5. Para vender a otro club, crea otro registro en `clubs`, otro dominio en `club_domains` y usuarios con ese nuevo `club_id`.
6. No dupliques el código: la misma aplicación atiende varios clubes y RLS separa los datos.

## Fase 9 — Personalizar un club nuevo

1. Duplica `database/new-club-template.sql`.
2. Cambia nombre, slug, colores, año y zona horaria.
3. Ejecuta el SQL.
4. Crea el administrador de ese club en Supabase Auth.
5. Inserta su `profiles.club_id` con el UUID correcto.
6. Desde Administración crea deportes, noticias, usuarios y contenido.
7. Sube logo/fotos desde Multimedia.
8. Añade el dominio del cliente.

## Fase 10 — Pruebas obligatorias antes de cobrar a un cliente

```bash
npm run typecheck
npm run lint
npm run build
npx playwright install
npm run test:e2e
npm run preflight
```

Prueba manualmente además:

- login correcto e incorrecto;
- recuperación de contraseña;
- socio no puede entrar a administración;
- presidente de fútbol no puede editar otra liga;
- administrador puede crear usuario/deporte/noticia;
- subir logos/fotos;
- móvil Android/iPhone;
- PC Chrome/Edge/Safari si está disponible;
- marcador Realtime en dos dispositivos simultáneos;
- chat en vivo;
- OBS -> Mux -> portal;
- desconectar y reconectar OBS;
- 404 y errores de red;
- cerrar sesión;
- usuarios de Club A no pueden leer Club B.

## Fase 11 — Seguridad y operación

Antes del primer cliente real:

1. Desactiva `NEXT_PUBLIC_DEMO_MODE`.
2. Configura rate limiting/WAF para `/api/auth/login`, `/api/auth/reset` y rutas administrativas.
3. Activa MFA para tus cuentas de Supabase, Vercel, GitHub y Mux.
4. Activa backups de base de datos adecuados a tu plan.
5. Define quién puede restaurar backups.
6. Añade monitoreo de errores (por ejemplo Sentry) y alertas de uptime.
7. Crea ambientes separados `development` y `production`; no pruebes cambios peligrosos sobre datos del cliente.
8. Rota cualquier secreto que haya sido compartido por error.
9. Haz una prueba de restauración de backup, no solo una prueba de creación.
10. Define procedimiento para altas/bajas de administradores y presidentes de liga.

## Fase 12 — Legal/comercial (requiere decisiones tuyas y, idealmente, asesoría profesional)

Antes de vender debes decidir:

- nombre comercial del producto;
- precio de instalación;
- mensualidad;
- quién paga Mux y sobreconsumos;
- límites de almacenamiento/video/usuarios;
- soporte incluido y tiempos de respuesta;
- propiedad de fotos/videos/datos;
- términos de servicio;
- política de privacidad;
- tratamiento de datos de menores si aparecen jugadores juveniles;
- política de retención/eliminación de datos;
- contrato de servicio y nivel de disponibilidad prometido.

No copies una política legal genérica sin revisarla para los países donde venderás.

## Fase 13 — Lo que yo ya dejé programado

- interfaz responsive desktop/teléfono;
- Next.js App Router + TypeScript;
- modo demo;
- login por número de acción;
- Supabase Auth SSR;
- PostgreSQL + RLS multi-tenant;
- roles y permisos;
- deportes, equipos, jugadores, posiciones, partidos, noticias, actividades, galería y directorio;
- panel de administración;
- creación de usuarios desde servidor;
- subida de imágenes a Supabase Storage;
- Mux Live Stream creation;
- Mux Player;
- webhook firmado;
- marcador y eventos con Supabase Realtime;
- chat en vivo con Realtime;
- pruebas Playwright base;
- script `preflight` para detectar configuración incompleta.

## Fase 14 — Qué todavía debes validar en el mundo real

Ningún código puede dejarse “perfecto” sin probarlo con las cuentas, dominio, red, cámara, OBS, usuarios y volumen reales. Antes de venderlo como servicio estable haz un piloto con un club durante varias jornadas deportivas y corrige los problemas operativos que aparezcan.
