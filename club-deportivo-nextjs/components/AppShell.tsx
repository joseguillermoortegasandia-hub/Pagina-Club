import Link from 'next/link';
import type { Club, Profile } from '@/types/domain';
import { canManage } from '@/lib/auth';
import { BottomNav, SidebarNav } from '@/components/Navigation';

export function AppShell({ club, profile, children, demo=false }: { club: Club; profile: Profile; children: React.ReactNode; demo?: boolean }) {
  return <div className="app-shell" style={{'--navy':club.primary_color || '#06294a','--green':club.accent_color || '#4fbe2f'} as React.CSSProperties}>
    <aside className="sidebar">
      <Link href="/" className="brand">
        <img src={club.logo_url || '/logo.svg'} alt={club.name} width={62} height={72} />
        <div><strong>{club.name.toUpperCase()}</strong><small>DESDE {club.since || '1945'}</small></div>
      </Link>
      <SidebarNav canAdmin={canManage(profile.role)} />
      <form action="/api/auth/logout" method="post" className="logout-form"><button type="submit">↪ Cerrar sesión</button></form>
    </aside>
    <main className="main-shell">
      <header className="topbar">
        <div className="topbar-spacer" />
        {demo && <span className="demo-pill">MODO DEMO</span>}
        <span className="notification">●</span>
        <div className="profile-mini"><span className="avatar">{profile.full_name.slice(0,1)}</span><div><strong>{profile.full_name}</strong><small>Acción #{profile.action_number}</small></div></div>
      </header>
      <header className="mobile-top">
        <Link href="/" className="mobile-brand"><img src={club.logo_url || '/logo.svg'} alt="logo" width={44} height={50}/><div><strong>{club.name}</strong><small>DESDE {club.since || '1945'}</small></div></Link>
        <span className="avatar">{profile.full_name.slice(0,1)}</span>
      </header>
      {children}
      <BottomNav />
    </main>
  </div>;
}
