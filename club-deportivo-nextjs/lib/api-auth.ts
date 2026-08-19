import { getSessionContext, canManage, canManageClub } from '@/lib/auth';
import { hasSupabase } from '@/lib/env';

export async function getApiActor(level:'content'|'club'='content') {
  if (!hasSupabase()) return { error:'Conecta Supabase para guardar cambios reales.', status:503 as const };
  const context=await getSessionContext();
  if (!context) return { error:'No autenticado.', status:401 as const };
  const allowed=level==='club'?canManageClub(context.profile.role):canManage(context.profile.role);
  if(!allowed) return { error:'No tienes permisos para esta acción.', status:403 as const };
  return { context };
}
