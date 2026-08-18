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

    const url = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

    const { data: authData, error: authError } = await admin.auth.getUser(token)
    if (authError || !authData.user) throw new Error('Sesión inválida')

    const { data: caller, error: callerError } = await admin.from('profiles').select('id,club_id,role').eq('id', authData.user.id).single()
    if (callerError || !caller) throw new Error('Perfil no encontrado')
    if (!['super_admin', 'club_admin'].includes(caller.role)) throw new Error('No tienes permiso para crear usuarios')

    const body = await req.json()
    const actionNumber = String(body.action_number || '').replace(/\D/g, '')
    const password = String(body.password || '')
    const fullName = String(body.full_name || '').trim()
    const role = String(body.role || 'member')
    if (!actionNumber || !fullName || password.length < 8) throw new Error('Nombre, número de acción y contraseña de al menos 8 caracteres son obligatorios')

    const allowedRoles = ['club_admin', 'league_president', 'editor', 'manager', 'member']
    if (!allowedRoles.includes(role)) throw new Error('Rol no válido')

    const { data: club, error: clubError } = await admin.from('clubs').select('slug').eq('id', caller.club_id).single()
    if (clubError || !club) throw new Error('Club no encontrado')
    const syntheticEmail = `${club.slug}.accion.${actionNumber}@club.local`

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: syntheticEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, action_number: actionNumber, club_id: caller.club_id, role },
    })
    if (createError || !created.user) throw createError || new Error('No se pudo crear el usuario')

    const { error: profileError } = await admin.from('profiles').insert({
      id: created.user.id,
      club_id: caller.club_id,
      action_number: actionNumber,
      full_name: fullName,
      notification_email: body.email || null,
      role,
      status: 'Activo',
    })

    if (profileError) {
      await admin.auth.admin.deleteUser(created.user.id)
      throw profileError
    }

    await admin.from('audit_log').insert({
      club_id: caller.club_id,
      user_id: caller.id,
      action: 'create_user',
      entity: 'profiles',
      entity_id: created.user.id,
      details: { action_number: actionNumber, role },
    })

    return Response.json({ user: { id: created.user.id, full_name: fullName, action_number: actionNumber, role } }, { headers: cors })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Error inesperado' }, { status: 400, headers: cors })
  }
})
