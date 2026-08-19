# Club Deportivo · Plataforma Next.js

Portal deportivo multi-tenant preparado para venderse a distintos clubes. Mantiene la identidad visual azul marino + verde, es responsive y utiliza:

- Next.js 16.3.1 + App Router + TypeScript
- Supabase PostgreSQL + Auth + Storage + Realtime + RLS
- Mux para transmisiones en vivo
- Vercel como despliegue recomendado
- Playwright para pruebas desktop/móvil

## 1. Probar la interfaz sin base de datos

Requisitos: Node.js 20.9 o superior.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Deja `NEXT_PUBLIC_DEMO_MODE=true` y abre `http://localhost:3000`.

Credenciales demo:

```text
Acción: 12345
Clave: demo123
```

## 2. Pasar a producción

Sigue `CHECKLIST_VENTA.md` de principio a fin. No publiques con modo demo activo.

## Estructura

```text
app/                   rutas y API del proyecto
components/            UI, panel, login, live y navegación
lib/                   Supabase, autorización y consultas
database/schema.sql    esquema PostgreSQL + RLS + Realtime
database/seed.sql      datos de ejemplo
database/first-admin.sql primer administrador
database/new-club-template.sql alta de nuevos clientes
guides/                 documentación operativa
public/                 logo y manifest
tests/                  smoke tests Playwright
```

## Seguridad ya implementada

- RLS por `club_id` para evitar mezclar clubes.
- Roles: super admin, administrador de club, presidente de liga, editor, gestor y socio.
- `SUPABASE_SECRET_KEY`, tokens de Mux y webhook secret solo se usan del lado servidor.
- Login visible por número de acción; internamente Supabase Auth sigue usando email + contraseña.
- Webhook de Mux validado con HMAC SHA-256 y tolerancia de tiempo.
- La Stream Key de Mux no se almacena en la tabla pública del portal: se devuelve una sola vez al administrador al crear el canal.
- Recuperación de contraseña con respuesta genérica para reducir enumeración de usuarios.

## Antes de vender

Como mínimo: `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:e2e` y `npm run preflight`.

## Documentación oficial útil

- Next.js: https://nextjs.org/docs/app
- Supabase + Next.js: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- Supabase SSR Auth: https://supabase.com/docs/guides/auth/server-side/nextjs
- Mux Live Streaming: https://www.mux.com/docs/guides/start-live-streaming
- Mux webhooks: https://www.mux.com/docs/core/verify-webhook-signatures
- Vercel + Next.js: https://vercel.com/docs/frameworks/full-stack/nextjs
