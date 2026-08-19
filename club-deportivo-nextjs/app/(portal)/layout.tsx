import { AppShell } from '@/components/AppShell';
import { requireSession } from '@/lib/auth';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { club, profile, isDemo } = await requireSession();
  return <AppShell club={club} profile={profile} demo={isDemo}>{children}</AppShell>;
}
