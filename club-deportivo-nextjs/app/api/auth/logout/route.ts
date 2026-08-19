import { NextResponse } from 'next/server';
import { hasSupabase } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  if (hasSupabase()) { const supabase = await createClient(); await supabase.auth.signOut(); }
  return NextResponse.redirect(new URL('/login', request.url), 303);
}
