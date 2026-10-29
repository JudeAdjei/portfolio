import { useEffect, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects } from '../content/projects';
import { ExtLink, Note, TeamBadge } from '../components/ui';
import { IconArrow, IconExternal } from '../components/Icons';
import { caseStudies } from './caseStudies';
import NotFound from './NotFound';

export function CaseSection({ n, title, children }: { n?: string; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line/70 py-10 lg:grid-cols-[14rem_1fr]">
      <h2 className="text-xl font-bold lg:sticky lg:top-24 lg:self-start">
        {n && <span className="mb-1 block font-mono text-xs font-normal text-accent">{n}</span>}
        {title}
      </h2>
      <div className="min-w-0 flex flex-col gap-4 text-muted [&_strong]:text-fg">{children}</div>
    </section>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const idx = projects.findIndex((p) => p.slug === slug);
  const p = projects[idx];
  useEffect(() => { if (p) document.title = `${p.title} · Jude Adjei`; }, [p]);
  if (!p) return <NotFound />;
  const Body = caseStudies[p.slug];
  const next = projects[(idx + 1) % projects.length];

  return (
    <article className="gutter pb-10">
      <div className="mx-auto max-w-page">
        <nav aria-label="Breadcrumb" className="pt-8 text-sm text-muted">
          <Link to="/projects" className="hover:text-fg">Projects</Link> <span className="text-faint">/</span> <span className="text-fg">{p.title}</span>
        </nav>
        <header className="py-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2"><TeamBadge team={p.team} /><span className="text-sm text-faint">{p.kind}</span></div>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold">{p.title}</h1>
            <p className="mt-4 text-lg text-muted prose-body">{p.problem}</p>
          </div>
          <dl className="card grid gap-3 p-5 text-sm">
            <div><dt className="text-xs uppercase tracking-wider text-faint">Tools</dt><dd className="mt-1 flex flex-wrap gap-1.5">{p.tech.map((t) => <span key={t} className="chip">{t}</span>)}</dd></div>
            <div><dt className="text-xs uppercase tracking-wider text-faint">Context</dt><dd className="mt-1 text-muted">{p.evidence}</dd></div>
            {p.links?.length ? (
              <div className="flex flex-wrap gap-2 pt-1">{p.links.map((l) => <ExtLink key={l.url} href={l.url} className="btn btn-ghost !py-1.5 !text-xs">{l.label} <IconExternal className="h-4 w-4" /></ExtLink>)}</div>
            ) : null}
          </dl>
        </header>
        {Body ? <Body /> : <Note>Case study coming soon.</Note>}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-6">
          <Link to="/projects" className="btn btn-ghost">All projects</Link>
          <Link to={`/projects/${next.slug}`} className="btn btn-primary">Next: {next.title} <IconArrow className="h-4 w-4" /></Link>
        </div>
      </div>
    </article>
  );
}
