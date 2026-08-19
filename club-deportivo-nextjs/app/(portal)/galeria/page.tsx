import { getGallery } from '@/lib/data';
export const metadata={title:'Galería'};
export default async function GalleryPage(){const items=await getGallery();return <div className="page"><div className="page-head"><div className="page-title"><h1>▧ Galería</h1><p>Momentos, equipos e instalaciones del club.</p></div></div><div className="gallery-grid-page">{items.map((g:any)=><article className="gallery-item" key={g.id}><img src={g.image_url||'/logo.svg'} alt={g.title||'Galería'}/><div className="gallery-caption">{g.title||g.caption||'Club Deportivo'}</div></article>)}</div></div>}
