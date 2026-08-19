export const isDemoMode = () => process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
export const hasSupabase = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
export const hasSupabaseAdmin = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
export const hasMux = () => Boolean(process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET);
export const defaultClubSlug = () => process.env.NEXT_PUBLIC_DEFAULT_CLUB_SLUG || 'club-deportivo';
