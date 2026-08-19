'use client';
import { useEffect,useState } from 'react';
import { createClient } from '@/lib/supabase/browser';

export function LiveChat({streamId,userId,userName,demo}:{streamId:string;userId:string;userName:string;demo:boolean}){
 const [messages,setMessages]=useState<any[]>(demo?[{id:1,full_name:'Carlos M.',body:'¡Vamos Leones! 🔥'},{id:2,full_name:'Ana Sofía',body:'Gran primera parte 💪'},{id:3,full_name:'Diego R.',body:'Qué atajada del arquero 😮'}]:[]);const [text,setText]=useState('');
 useEffect(()=>{if(demo)return;const supabase=createClient();supabase.from('live_chat_messages').select('id,body,created_at,profile:profiles(full_name)').eq('stream_id',streamId).order('created_at').limit(50).then(({data})=>setMessages((data||[]).map((m:any)=>({...m,full_name:m.profile?.full_name||'Socio'}))));const ch=supabase.channel(`chat-${streamId}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'live_chat_messages',filter:`stream_id=eq.${streamId}`},payload=>setMessages(x=>[...x,{...payload.new,full_name:'Socio'}])).subscribe();return()=>{void supabase.removeChannel(ch)}},[streamId,demo]);
 async function send(e:React.FormEvent){e.preventDefault();if(!text.trim())return;if(demo){setMessages(x=>[...x,{id:Date.now(),full_name:userName,body:text}]);setText('');return}const supabase=createClient();await supabase.from('live_chat_messages').insert({stream_id:streamId,user_id:userId,body:text.trim()});setText('')}
 return <div className="live-card chat"><h3>Chat en Vivo</h3><div className="chat-list">{messages.map((m:any)=><div className="chat-row" key={m.id}><span className="avatar" style={{width:30,height:30}}>{String(m.full_name||'S').slice(0,1)}</span><div><b>{m.full_name||'Socio'}</b><div>{m.body}</div></div></div>)}</div><form className="chat-input" onSubmit={send}><input value={text} onChange={e=>setText(e.target.value)} maxLength={300} placeholder="Escribe un mensaje…"/><button className="btn btn-primary">➤</button></form></div>
}
