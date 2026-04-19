import type { PropsWithChildren } from 'react';

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <section className="panel empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
    </section>
  );
}

export function ErrorState({ title, text }: { title: string; text: string }) {
  return (
    <section className="panel error-state">
      <h3>{title}</h3>
      <p>{text}</p>
    </section>
  );
}

export function Badge({ children, tone = 'neutral' }: PropsWithChildren<{ tone?: 'neutral' | 'live' | 'warn' }>) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
