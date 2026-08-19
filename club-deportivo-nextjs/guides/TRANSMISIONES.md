# Transmisiones en vivo · OBS + Mux + Next.js

Flujo:

```text
Cámara -> OBS -> RTMPS -> Mux -> Mux Player dentro de Next.js -> Socios
```

El backend crea Live Streams en Mux mediante `/api/admin/streams`. Los tokens de Mux existen únicamente en variables de entorno del servidor.

El administrador recibe una Stream Key al crear el canal. Esa clave equivale a una contraseña del directo y no debe compartirse públicamente.

OBS recomendado:

- Servicio: Personalizado
- Server: `rtmps://global-live.mux.com:443/app`
- Stream Key: la entregada por el panel

El webhook `/api/mux/webhook` valida `mux-signature` con HMAC SHA-256 antes de cambiar el estado del stream.

Para deportes donde unos segundos importan, prueba `reduced` y `low` latency antes de elegir. Baja latencia es más sensible a las condiciones de red.
