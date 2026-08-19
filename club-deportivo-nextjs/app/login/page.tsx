import Image from 'next/image';
import { LoginForm } from '@/components/LoginForm';

export const metadata = { title:'Iniciar sesión' };
export default function LoginPage() {
  return <main className="login-page">
    <section className="login-visual"><div className="login-brand">
      <Image src="/logo.svg" alt="Club Deportivo" width={150} height={170}/>
      <h1>Bienvenido al portal de <b>tu club</b></h1>
      <p>Resultados, torneos, equipos, actividades y transmisiones en vivo desde un solo lugar.</p>
    </div></section>
    <section className="login-panel"><div className="login-card">
      <h2>Iniciar Sesión</h2><LoginForm />
      <div className="login-help">🔒 Acceso exclusivo para socios</div>
      {process.env.NEXT_PUBLIC_DEMO_MODE !== 'false' && <div className="login-demo"><b>Demo:</b> acción <b>12345</b> · clave <b>demo123</b></div>}
    </div></section>
  </main>;
}
