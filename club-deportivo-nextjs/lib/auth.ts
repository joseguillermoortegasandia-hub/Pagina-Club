import { redirect } from 'next/navigation';
import { demoClub, demoProfile } from '@/lib/demo-data';
import { hasSupabase, isDemoMode } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import type { Club, Profile } from '@/types/domain';

export type SessionContext = { profile: Profile; club: Club; isDemo: boolean };

export async function getSessionContext(): Promise<SessionContext | null> {
  if (!hasSupabase()) {
    return isDemoMode() ? { profile: demoProfile, club: demoClub, isDemo: true } : null;
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const [{ data: profile }, { data: club }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userData.user.id).single(),
    supabase.from('clubs').select('*').limit(1).maybeSingle()
  ]);

  if (!profile) return null;
  let resolvedClub = club;
  if (!resolvedClub || resolvedClub.id !== profile.club_id) {
    const result = await supabase.from('clubs').select('*').eq('id', profile.club_id).single();
    resolvedClub = result.data;
  }
  if (!resolvedClub) return null;
  return { profile: profile as Profile, club: resolvedClub as Club, isDemo: false };
}

export async function requireSession() {
  const context = await getSessionContext();
  if (!context) redirect('/login');
  return context;
}

export function canManage(role: Profile['role']) {
  return ['super_admin','club_admin','league_president','editor','manager'].includes(role);
}

export function canManageClub(role: Profile['role']) {
  return ['super_admin','club_admin'].includes(role);
}
