'use client';
import MuxPlayer from '@mux/mux-player-react';
export function LivePlayer({playbackId,title,latencyMode}:{playbackId?:string|null;title:string;latencyMode?:string|null}){
 if(playbackId)return <MuxPlayer playbackId={playbackId} streamType={latencyMode==='low'?'ll-live':'live'} metadata={{video_title:title}} accentColor="#4fbe2f" />;
 return <div className="demo-player"><div style={{background:'rgba(3,28,51,.85)',padding:'14px 18px',borderRadius:10,textAlign:'center'}}><b>Vista previa del directo</b><small style={{display:'block',marginTop:5}}>Conecta Mux para reproducir video real.</small></div></div>
}
