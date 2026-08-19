export function formatDate(value?: string | null) {
  if (!value) return '';
  return new Intl.DateTimeFormat('es-VE', { day:'2-digit', month:'short', year:'numeric' }).format(new Date(value));
}
export function formatDateTime(value?: string | null) {
  if (!value) return '';
  return new Intl.DateTimeFormat('es-VE', { weekday:'short', day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }).format(new Date(value));
}
export function slugify(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}
