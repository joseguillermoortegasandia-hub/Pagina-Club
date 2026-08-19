export function SectionHead({ icon, title, action }: { icon?: string; title: string; action?: React.ReactNode }) {
  return <div className="section-head"><h2>{icon && <span>{icon}</span>}{title}</h2>{action}</div>;
}
export function EmptyState({ text }: { text: string }) { return <div className="empty-state">{text}</div>; }
