'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  ['Inicio','/','⌂'],['Deportes','/deportes','⚽'],['Noticias','/noticias','▣'],['Calendario','/calendario','▦'],
  ['Transmisiones','/transmisiones/live','▶'],['Galería','/galeria','▧'],['Directorio','/directorio','♧'],['Mi Cuenta','/mi-cuenta','♙']
] as const;

export function SidebarNav({ canAdmin=false }: { canAdmin?: boolean }) {
  const pathname = usePathname();
  return <nav className="side-nav">
    {nav.map(([label,href,icon]) => <Link key={href} className={pathname===href || (href !== '/' && pathname.startsWith(href)) ? 'active' : ''} href={href}><span>{icon}</span>{label}</Link>)}
    {canAdmin && <Link className={pathname.startsWith('/admin')?'active':''} href="/admin"><span>⚙</span>Administración</Link>}
  </nav>;
}

export function BottomNav() {
  const pathname = usePathname();
  const items = nav.slice(0,4);
  return <nav className="bottom-nav">
    {items.map(([label,href,icon]) => <Link key={href} className={pathname===href || (href !== '/' && pathname.startsWith(href)) ? 'active' : ''} href={href}><span>{icon}</span><small>{label}</small></Link>)}
    <Link href="/mi-cuenta" className={pathname.startsWith('/mi-cuenta')?'active':''}><span>☰</span><small>Más</small></Link>
  </nav>;
}
