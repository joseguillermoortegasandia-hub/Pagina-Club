'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [loading,setLoading] = useState(false);
  const [message,setMessage] = useState('');
  const [kind,setKind] = useState<'error'|'ok'>('error');

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setMessage('');
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/login', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ actionNumber:form.get('actionNumber'), password:form.get('password') }) });
    const data = await res.json().catch(()=>({})); setLoading(false);
    if (!res.ok) { setKind('error'); setMessage(data.error || 'No se pudo iniciar sesión.'); return; }
    router.push('/'); router.refresh();
  }

  async function reset() {
    const actionNumber = (document.querySelector('[name=actionNumber]') as HTMLInputElement)?.value;
    if (!actionNumber) { setKind('error'); setMessage('Escribe primero tu número de acción.'); return; }
    setLoading(true);
    const res = await fetch('/api/auth/reset', {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({actionNumber})});
    setLoading(false); setKind(res.ok?'ok':'error'); setMessage(res.ok?'Si la cuenta existe, recibirás un correo de recuperación.':'No se pudo procesar la solicitud.');
  }

  return <form onSubmit={login}>
    <div className="field"><label>Número de acción</label><input name="actionNumber" inputMode="numeric" autoComplete="username" placeholder="Ingresa tu número de acción" required /></div>
    <div className="field"><label>Contraseña</label><input name="password" type="password" autoComplete="current-password" placeholder="Ingresa tu contraseña" required /></div>
    {message && <div className={`form-message ${kind}`}>{message}</div>}
    <button className="btn btn-primary" disabled={loading}>{loading?'Ingresando…':'Ingresar'}</button>
    <button type="button" onClick={reset} className="btn" style={{width:'100%',marginTop:8,background:'transparent',color:'#359f20'}} disabled={loading}>¿Olvidaste tu clave?</button>
  </form>;
}
