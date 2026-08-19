import { NextResponse } from 'next/server';
import { defaultClubSlug, hasSupabase, hasSupabaseAdmin, isDemoMode } from '@/lib/env';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

async function resolveClubId(request: Request, requestedSlug?: string) {
  const admin = createAdminClient();
  const host = new URL(request.url).hostname.replace(/^www\./,'');
  if (host !== 'localhost' && host !== '127.0.0.1') {
    const domainResult = await admin.from('club_domains').select('club_id').eq('domain',host).eq('verified',true).maybeSingle();
    if (domainResult.data?.club_id) return domainResult.data.club_id as string;
  }
  const slug = requestedSlug || defaultClubSlug();
  const { data } = await admin.from('clubs').select('id').eq('slug',slug).eq('active',true).maybeSingle();
  return data?.id as string | undefined;
}

export async function POST(request: Request) {
  const body = await request.json().catch(()=>({}));
  const actionNumber = String(body.actionNumber || '').trim();
  const password = String(body.password || '');
  if (!actionNumber || !password) return NextResponse.json({error:'Número de acción y contraseña son obligatorios.'},{status:400});

  if (!hasSupabase()) {
    if (isDemoMode() && actionNumber === '12345' && password === 'demo123') return NextResponse.json({ok:true,demo:true});
    return NextResponse.json({error:'Supabase no está configurado.'},{status:503});
  }
  if (!hasSupabaseAdmin()) return NextResponse.json({error:'Falta SUPABASE_SECRET_KEY en el servidor.'},{status:503});

  try {
    const admin = createAdminClient();
    const clubId = await resolveClubId(request, body.clubSlug);
    if (!clubId) return NextResponse.json({error:'Credenciales inválidas.'},{status:401});
    const { data: profile } = await admin.from('profiles').select('notification_email,status').eq('club_id',clubId).eq('action_number',actionNumber).maybeSingle();
    if (!profile?.notification_email || profile.status === 'Inactivo') return NextResponse.json({error:'Credenciales inválidas.'},{status:401});

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email:profile.notification_email, password });
    if (error) return NextResponse.json({error:'Credenciales inválidas.'},{status:401});
    return NextResponse.json({ok:true});
  } catch (error) {
    console.error(error);
    return NextResponse.json({error:'No se pudo iniciar sesión.'},{status:500});
  }
}
