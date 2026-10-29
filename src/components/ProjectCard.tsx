import { Link } from 'react-router-dom';
import type { Project } from '../content/projects';
import mc from '../data/excelMc.json';
import { IconArrow, IconExternal } from './Icons';
import { ExtLink, TeamBadge } from './ui';

function NpvPreview() {
  const max = Math.max(...mc.npvBins.map((b) => b.count));
  return (
    <div className="h-full w-full flex flex-col justify-end p-4">
      <div className="flex items-end gap-[2px] h-[70%]" aria-hidden="true">
        {mc.npvBins.map((b) => (
          <div key={b.from} className="flex-1 rounded-t-[3px] bg-accent/80" style={{ height: `${(b.count / max) * 100}%` }} />
        ))}
      </div>
      <p className="mt-2 text-[11px] font-mono text-muted">Real data · 1,000 simulated NPVs ($k), workbook Q3a</p>
    </div>
  );
}

function DiagramPreview({ kind }: { kind: 'ops' | 'sales' }) {
  const steps = kind === 'ops' ? ['Induct', 'Verify label', 'Sort to chute', 'Escalate exceptions'] : ['Daily sales', 'Trend & branch compare', 'Break-even view', 'Decision'];
  return (
    <div className="h-full w-full flex flex-col justify-center gap-2 p-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {steps.map((s, i) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className="rounded-md border border-line bg-bg/60 px-2 py-1 text-[11px] text-fg">{s}</span>
            {i < steps.length - 1 && <IconArrow className="h-3.5 w-3.5 text-accent" />}
          </span>
        ))}
      </div>
      <p className="text-[11px] font-mono text-faint">Process overview</p>
    </div>
  );
}

export function ProjectCard({ p, featured = false }: { p: Project; featured?: boolean }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition-colors hover:border-accent/60 min-w-0">
      <div className={`relative ${featured ? 'aspect-[16/8]' : 'aspect-[16/9]'} max-w-full overflow-hidden border-b border-line bg-raised`}>
        {p.image ? (
          <img src={p.image} alt={p.imageAlt} loading="lazy" className="h-full w-full object-cover object-left-top bg-white" />
        ) : p.visual === 'npv' ? (
          <NpvPreview />
        ) : (
          <DiagramPreview kind={p.visual === 'ops' ? 'ops' : 'sales'} />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <TeamBadge team={p.team} />
          <span className="text-xs text-faint">{p.kind}</span>
        </div>
        <h3 className="text-xl font-bold">{p.title}</h3>
        <p className="text-sm text-muted">{p.problem}</p>
        <div className="rounded-lg border-l-2 border-accent bg-accent/5 px-3 py-2 text-sm">
          <span className="font-semibold text-fg">Key result. </span>
          <span className="text-muted">{p.finding}</span>
        </div>
        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {p.tech.map((t) => <li key={t} className="chip">{t}</li>)}
        </ul>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Link to={`/projects/${p.slug}`} className="btn btn-primary" aria-label={`View case study: ${p.title}`}>
            View case study <IconArrow className="h-4 w-4" />
          </Link>
          {p.links?.map((l) => (
            <ExtLink key={l.url} href={l.url} className="btn btn-ghost">{l.label} <IconExternal className="h-4 w-4" /></ExtLink>
          ))}
        </div>
      </div>
    </article>
  );
}
