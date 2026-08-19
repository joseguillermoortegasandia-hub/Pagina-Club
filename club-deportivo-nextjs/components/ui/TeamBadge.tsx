import type { Team } from '@/types/domain';

export function TeamBadge({ team, size='md' }: { team?: Team | null; size?: 'sm'|'md'|'lg' }) {
  const label = team?.logo_text || team?.short_name || team?.name?.slice(0,2).toUpperCase() || 'CD';
  return <span className={`team-badge ${size}`} style={{'--team-color':team?.primary_color || '#06294a'} as React.CSSProperties}>{label}</span>;
}
