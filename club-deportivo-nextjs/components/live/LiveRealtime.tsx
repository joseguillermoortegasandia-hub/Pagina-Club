'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/browser';
import type { Match } from '@/types/domain';

export function LiveMatchScore({initialMatch,demo}:{initialMatch:Match;demo:boolean}){
 const [match,setMatch]=useState(initialMatch);
 useEffect(()=>{if(demo||!process.env.NEXT_PUBLIC_SUPABASE_URL)return;const supabase=createClient();const channel=supabase.channel(`score-${initialMatch.id}`).on('postgres_changes',{event:'UPDATE',schema:'public',table:'matches',filter:`id=eq.${initialMatch.id}`},payload=>setMatch(payload.new as Match)).subscribe();return()=>{void supabase.removeChannel(channel)}},[initialMatch.id,demo]);
 return <div className="score-overlay"><span>{match.home_score??0}</span><strong>-</strong><span>{match.away_score??0}</span></div>;
}

export function LiveEvents({matchId,initialEvents,demo}:{matchId:string;initialEvents:any[];demo:boolean}){
 const [events,setEvents]=useState(initialEvents);
 useEffect(()=>{if(demo||!process.env.NEXT_PUBLIC_SUPABASE_URL)return;const supabase=createClient();const channel=supabase.channel(`events-${matchId}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'match_events',filter:`match_id=eq.${matchId}`},payload=>setEvents(current=>[payload.new,...current])).subscribe();return()=>{void supabase.removeChannel(channel)}},[matchId,demo]);
 return <div className="live-card live-panel"><h3>Eventos del Partido</h3>{events.slice(0,6).map((e:any)=><div className="event-line" key={e.id}><b>{e.minute}</b><span><b>{e.event_type}</b><small style={{display:'block',opacity:.7}}>{e.detail}</small></span></div>)}</div>;
}
