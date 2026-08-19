import Link from 'next/link';
export default function NotFound(){return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,textAlign:'center'}}><div><div style={{fontSize:70}}>404</div><h1>No encontramos esta sección</h1><p>El contenido pudo ser eliminado o todavía no existe.</p><Link className="btn btn-primary" href="/">Volver al inicio</Link></div></main>}
