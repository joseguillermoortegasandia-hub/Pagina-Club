import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { defaultClubSlug, hasSupabase, hasSupabaseAdmin } from '@/lib/env';

export async function POST(request: Request) {
  const body = await request.json().catch(()=>({}));
  if (!hasSupabase() || !hasSupabaseAdmin()) return NextResponse.json({ok:true});
  try {
    const admin = createAdminClient();
    const { data: club } = await admin.from('clubs').select('id').eq('slug',body.clubSlug || defaultClubSlug()).maybeSingle();
    if (club?.id) {
      const { data: profile } = await admin.from('profiles').select('notification_email').eq('club_id',club.id).eq('action_number',String(body.actionNumber||'')).maybeSingle();
      if (profile?.notification_email) {
        const supabase = await createClient();
        const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
        await supabase.auth.resetPasswordForEmail(profile.notification_email,{redirectTo:`${origin}/mi-cuenta?reset=1`});
      }
    }
  } catch (error) { console.error(error); }
  return NextResponse.json({ok:true}); // respuesta deliberadamente genérica para evitar enumerar cuentas
}
