'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/browser';

export function AccountClient({demo}:{demo:boolean}){
 const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(false);
 async function updatePassword(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const form=new FormData(e.currentTarget);const password=String(form.get('password')||'');if(password.length<8){setMsg('Usa al menos 8 caracteres.');return}if(demo){setMsg('En modo demo no se cambia la contraseña.');return}setLoading(true);try{const supabase=createClient();const {error}=await supabase.auth.updateUser({password});setMsg(error?error.message:'Contraseña actualizada.')}catch(err:any){setMsg(err.message)}finally{setLoading(false)}}
 return <div className="settings"><h3>Seguridad</h3><form onSubmit={updatePassword}><div className="field"><label>Nueva contraseña</label><input name="password" type="password" minLength={8} placeholder="Mínimo 8 caracteres"/></div><button className="btn btn-primary" disabled={loading}>{loading?'Guardando…':'Cambiar contraseña'}</button>{msg&&<div className="form-message ok">{msg}</div>}</form><h3 style={{marginTop:28}}>Preferencias</h3><div className="setting-row"><span>Notificaciones de partidos</span><b style={{color:'#359f20'}}>Activadas</b></div><div className="setting-row"><span>Noticias del club</span><b style={{color:'#359f20'}}>Activadas</b></div><div className="setting-row"><span>Recordatorios de eventos</span><b style={{color:'#359f20'}}>Activados</b></div></div>
}
