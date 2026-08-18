import { createClient } from 'npm:@supabase/supabase-js@2'

function hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('')
}
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}
async function verifyMux(raw: string, header: string, secret: string) {
  const parts = Object.fromEntries(header.split(',').map(p => p.trim().split('=')))
  const timestamp = parts.t
  const signature = parts.v1
  if (!timestamp || !signature) return false
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp))
  if (!Number.isFinite(age) || age > 300) return false
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${raw}`))
  return safeEqual(hex(digest), signature)
}

Deno.serve(async (req) => {
  try {
    const raw = await req.text()
    const signature = req.headers.get('mux-signature') || ''
    const secret = Deno.env.get('MUX_WEBHOOK_SECRET') || ''
    if (!secret || !(await verifyMux(raw, signature, secret))) return new Response('Invalid signature', { status: 401 })

    const event = JSON.parse(raw)
    const liveId = event?.data?.id
    if (!liveId) return new Response('ok')

    const url = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })

    if (event.type === 'video.live_stream.active') {
      await admin.from('streams').update({ status: 'active', started_at: new Date().toISOString(), ended_at: null }).eq('mux_live_stream_id', liveId)
    } else if (event.type === 'video.live_stream.disconnected') {
      await admin.from('streams').update({ status: 'disconnected' }).eq('mux_live_stream_id', liveId)
    } else if (event.type === 'video.live_stream.idle') {
      await admin.from('streams').update({ status: 'idle', ended_at: new Date().toISOString() }).eq('mux_live_stream_id', liveId)
    }

    return new Response('ok', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Webhook error', { status: 500 })
  }
})
