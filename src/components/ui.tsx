import { useState, type ReactNode } from 'react';
import { IconCheck, IconCopy, IconExternal, IconInfo } from './Icons';

export function Section({ id, eyebrow, title, intro, children, className = '' }: { id?: string; eyebrow?: string; title?: ReactNode; intro?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`gutter py-10 sm:py-14 ${className}`}>
      <div className="mx-auto max-w-page">
        {(eyebrow || title) && (
          <header className="mb-8 max-w-3xl">
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
            {title && <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>}
            {intro && <div className="mt-4 text-muted prose-body">{intro}</div>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export function ExtLink({ href, children, className = '', label }: { href: string; children: ReactNode; className?: string; label?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>
      {children}
    </a>
  );
}

export function Note({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) {
  return (
    <div className={`flex gap-3 rounded-xl border p-3 text-sm ${tone === 'warn' ? 'border-warn/40 bg-warn/5' : 'border-accent/30 bg-accent/5'}`}>
      <IconInfo className={`h-5 w-5 shrink-0 ${tone === 'warn' ? 'text-warn' : 'text-accent'}`} />
      <div className="text-muted min-w-0">{children}</div>
    </div>
  );
}

export function Source({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-xs text-faint font-mono">Source: {children}</p>;
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      const el = document.getElementById('copy-fallback-' + label.replace(/\W/g, '')) as HTMLInputElement | null;
      el?.select();
    }
  };
  return (
    <span className="inline-flex items-center gap-2">
      <button type="button" onClick={copy} className="btn btn-ghost !py-1.5 !px-3 !text-xs" aria-live="polite">
        {done ? <IconCheck className="h-4 w-4 text-good" /> : <IconCopy className="h-4 w-4" />}
        {done ? 'Copied' : label}
      </button>
      <input id={'copy-fallback-' + label.replace(/\W/g, '')} readOnly value={text} className="sr-only" tabIndex={-1} aria-hidden="true" />
    </span>
  );
}

export function TeamBadge({ team }: { team: string }) {
  const tone = team === 'Group' ? 'text-violet border-violet/40' : team === 'Individual' ? 'text-teal border-teal/40' : 'text-amber border-amber/40';
  return <span className={`chip ${tone}`}>{team === 'Group' ? 'Group project' : team}</span>;
}

export function Kpi({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="card p-4 min-w-0">
      <div className="font-display text-3xl font-bold num text-fg">{value}</div>
      <div className="mt-1 text-sm text-fg/90">{label}</div>
      {sub && <div className="mt-1 text-xs text-faint">{sub}</div>}
    </div>
  );
}

export function Figure({ src, alt, caption }: { src: string; alt: string; caption: ReactNode }) {
  return (
    <figure className="card overflow-hidden">
      <div className="bg-white p-2"><img src={src} alt={alt} loading="lazy" className="mx-auto w-full h-auto" /></div>
      <figcaption className="p-3 text-xs text-muted">{caption}</figcaption>
    </figure>
  );
}

export function ExternalCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <ExtLink href={href} className="btn btn-ghost">
      {children} <IconExternal className="h-4 w-4" />
    </ExtLink>
  );
}

export function Segmented<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { id: T; label: string }[]; label: string }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Tabs<T extends string>({ value, onChange, tabs, label }: { value: T; onChange: (v: T) => void; tabs: { id: T; label: string }[]; label: string }) {
  return (
    <div className="seg" role="tablist" aria-label={label}>
      {tabs.map((t) => (
        <button key={t.id} type="button" role="tab" aria-selected={value === t.id} onClick={() => onChange(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
