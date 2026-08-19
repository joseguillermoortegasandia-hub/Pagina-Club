'use client';
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,textAlign:'center'}}><div><h1>Ocurrió un error</h1><p>No pudimos cargar esta sección. Intenta nuevamente.</p><button className="btn btn-primary" onClick={reset}>Reintentar</button></div></main>}
