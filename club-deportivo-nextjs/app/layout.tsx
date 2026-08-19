import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default:'Club Deportivo', template:'%s | Club Deportivo' },
  description:'Portal deportivo para socios, equipos, ligas y transmisiones en vivo.',
  manifest:'/manifest.webmanifest'
};
export const viewport: Viewport = { themeColor:'#06294a', width:'device-width', initialScale:1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
