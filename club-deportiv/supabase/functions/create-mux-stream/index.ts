import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.replace(/^Bearer\s+/i, '')
    if (!token) throw new Error('No autorizado')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const muxTokenId = Deno.env.get('MUX_TOKEN_ID')
    const muxTokenSecret = Deno.env.get('MUX_TOKEN_SECRET')
    if (!muxTokenId || !muxTokenSecret) throw new Error('Faltan MUX_TOKEN_ID / MUX_TOKEN_SECRET en los secretos de la función')

    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
    const { data: authData, error: authError } = await admin.auth.getUser(token)
    if (authError || !authData.user) throw new Error('Sesión inválida')

    const { data: caller, error: callerError } = await admin.from('profiles').select('id,club_id,role').eq('id', authData.user.id).single()
    if (callerError || !caller) throw new Error('Perfil no encontrado')

    const body = await req.json()
    const title = String(body.title || 'Transmisión en vivo').trim()
    const matchId = body.match_id || null
    let leagueId: string | null = null

    if (matchId) {
      const { data: match, error: matchError } = await admin.from('matches').select('id,club_id,league_id').eq('id', matchId).single()
      if (matchError || !match || match.club_id !== caller.club_id) throw new Error('Partido no encontrado')
      leagueId = match.league_id
    }

    const broadRoles = ['super_admin', 'club_admin', 'editor', 'manager']
    let allowed = broadRoles.includes(caller.role)
    if (!allowed && caller.role === 'league_president' && leagueId) {
      const { data: assignment } = await admin.from('league_managers').select('league_id').eq('league_id', leagueId).eq('user_id', caller.id).maybeSingle()
      allowed = !!assignment
    }
    if (!allowed) throw new Error('No tienes permiso para crear esta transmisión')

    const basic = btoa(`${muxTokenId}:${muxTokenSecret}`)
    const muxResponse = await fetch('https://api.mux.com/video/v1/live-streams', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${basic}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playback_policies: ['public'],
        new_asset_settings: { playback_policies: ['public'] },
        latency_mode: 'reduced',
      }),
    })
    const muxJson = await muxResponse.json()
    if (!muxResponse.ok) throw new Error(muxJson?.error?.messages?.join(', ') || 'Mux no pudo crear el Live Stream')

    const live = muxJson.data
    const playbackId = live.playback_ids?.[0]?.id || null
    const { data: row, error: insertError } = await admin.from('streams').insert({
      club_id: caller.club_id,
      match_id: matchId,
      league_id: leagueId,
      title,
      provider: 'mux',
      mux_live_stream_id: live.id,
      playback_id: playbackId,
      status: 'idle',
      created_by: caller.id,
    }).select().single()
    if (insertError) throw insertError

    await admin.from('audit_log').insert({
      club_id: caller.club_id,
      user_id: caller.id,
      action: 'create_mux_stream',
      entity: 'streams',
      entity_id: row.id,
      details: { mux_live_stream_id: live.id, playback_id: playbackId },
    })

    return Response.json({
      stream: row,
      credentials: {
        server_url: 'rtmps://global-live.mux.com:443/app',
        stream_key: live.stream_key,
        playback_id: playbackId,
      },
    }, { headers: cors })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Error inesperado' }, { status: 400, headers: cors })
  }
})
