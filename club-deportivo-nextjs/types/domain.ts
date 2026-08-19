export type AppRole = 'super_admin' | 'club_admin' | 'league_president' | 'editor' | 'manager' | 'member';

export type Club = {
  id: string; name: string; slug: string; since?: string | null; logo_url?: string | null;
  primary_color?: string | null; accent_color?: string | null; timezone?: string | null;
};

export type Profile = {
  id: string; club_id: string; action_number: string; full_name: string; notification_email?: string | null;
  avatar_url?: string | null; role: AppRole; status?: string | null;
};

export type Sport = {
  id: string; club_id?: string; name: string; slug: string; icon?: string | null; description?: string | null;
  image_url?: string | null; category_count?: number; team_count?: number; match_count?: number; player_count?: number;
};

export type Team = {
  id: string; club_id?: string; sport_id: string; league_id?: string | null; name: string; slug: string;
  short_name?: string | null; logo_url?: string | null; logo_text?: string | null; category?: string | null;
  coach_name?: string | null; description?: string | null; founded_year?: number | null; primary_color?: string | null;
  secondary_color?: string | null;
};

export type Player = {
  id: string; team_id: string; number?: number | null; name: string; position?: string | null; age?: number | null;
  photo_url?: string | null; status?: string | null;
};

export type Match = {
  id: string; sport_id: string; league_id?: string | null; competition_id?: string | null; home_team_id?: string | null;
  away_team_id?: string | null; scheduled_at: string; venue?: string | null; status: 'scheduled'|'live'|'finished'|'postponed'|'cancelled';
  home_score?: number | null; away_score?: number | null; round_label?: string | null;
};

export type Standing = {
  id?: string; team_id: string; rank?: number | null; played: number; won: number; drawn: number; lost: number;
  goals_for?: number; goals_against?: number; goal_difference?: number; points: number;
};

export type NewsItem = {
  id: string; title: string; excerpt?: string | null; body?: string | null; category?: string | null; image_url?: string | null;
  published_at?: string | null; featured?: boolean | null; status?: string | null;
};

export type Activity = { id: string; title: string; starts_at: string; ends_at?: string | null; venue?: string | null; kind?: string | null };

export type Stream = {
  id: string; title: string; match_id?: string | null; provider?: string | null; status: string; playback_id?: string | null;
  mux_live_stream_id?: string | null; ingest_url?: string | null; stream_key?: string | null; scheduled_at?: string | null; latency_mode?: 'standard'|'reduced'|'low' | null;
};
