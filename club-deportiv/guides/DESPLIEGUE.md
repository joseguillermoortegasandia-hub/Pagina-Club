# Despliegue del frontend

El frontend de este paquete es estático; la parte de servidor vive en Supabase. Eso significa que puede publicarse en Vercel, Netlify, Cloudflare Pages o GitHub Pages.

## Vercel

1. Sube esta carpeta a un repositorio GitHub.
2. En Vercel crea **New Project** e importa el repositorio.
3. Framework Preset: `Other`.
4. Build Command: vacío.
5. Output Directory: `.`.
6. Deploy.
7. Verifica que `config.js` tenga los datos del proyecto Supabase de producción.

## Importante

`config.js` contiene solamente la URL pública y Publishable Key. No pongas allí secretos de Mux ni la Service Role de Supabase.

Para entornos de desarrollo/producción más sofisticados, la siguiente evolución natural del proyecto sería migrar el frontend a Next.js/Vite y gestionar variables de entorno durante el build. La base de datos y Edge Functions incluidas no necesitan cambiar para esa migración.
