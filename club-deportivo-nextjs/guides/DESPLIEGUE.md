# Despliegue recomendado

1. GitHub privado.
2. Vercel conectado al repositorio.
3. Variables de entorno configuradas en Vercel.
4. Supabase separado para producción.
5. Mux Environment de producción.
6. Dominio del cliente agregado a Vercel y `club_domains`.
7. `NEXT_PUBLIC_DEMO_MODE=false`.
8. Webhook Mux apuntando al dominio productivo.
9. Ejecutar build, tests y preflight antes de publicar.

No pongas secretos en GitHub ni variables `NEXT_PUBLIC_*`.
