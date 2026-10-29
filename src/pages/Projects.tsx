import { useMemo, useState } from 'react';
import { projects, projectsForRole, type Category } from '../content/projects';
import { useRole } from '../components/Layout';
import { RoleSelector } from '../components/RoleSelector';
import { ProjectCard } from '../components/ProjectCard';
import { Section } from '../components/ui';
import { IconReset } from '../components/Icons';

const order: Category[] = ['Data Analysis', 'Data Science', 'Business Analysis', 'Data Engineering', 'Financial Analytics', 'Forecasting', 'Python', 'R', 'Excel', 'TypeScript', 'Visualisation'];
// Only offer filters that at least one project actually supports.
const available = order.filter((c) => projects.some((p) => p.categories.includes(c)));

export default function ProjectsPage() {
  const { role, setRole } = useRole();
  const [cats, setCats] = useState<Category[]>([]);
  const list = useMemo(() => projectsForRole(role).filter((p) => cats.every((c) => p.categories.includes(c))), [role, cats]);
  const toggle = (c: Category) => setCats((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  const clear = () => { setCats([]); setRole('all'); };

  return (
    <>
      <Section eyebrow="Projects" title="Case studies" intro="Each card leads to a full case study with interactive charts.">
        <div className="flex flex-col gap-5">
          <RoleSelector />
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-faint">Filter by category (all selected must match)</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
              {available.map((c) => (
                <button key={c} type="button" aria-pressed={cats.includes(c)} onClick={() => toggle(c)}
                  className={`chip !py-1 !text-xs ${cats.includes(c) ? '!text-fg !border-accent/60 !bg-raised' : 'hover:!text-fg'}`}>{c}</button>
              ))}
              {(cats.length > 0 || role !== 'all') && <button type="button" onClick={clear} className="chip !py-1 !text-xs !text-accent"><IconReset className="h-3.5 w-3.5" /> Reset filters</button>}
            </div>
            <p className="mt-3 text-sm text-muted" aria-live="polite">Showing {list.length} of {projects.length} projects.</p>
          </div>
        </div>
        {list.length ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => <ProjectCard key={p.slug} p={p} />)}
          </div>
        ) : (
          <div className="mt-8 card p-8 text-center">
            <p className="font-semibold">No project matches every selected filter.</p>
            <p className="mt-1 text-sm text-muted">Remove a category or reset the filters.</p>
            <button type="button" onClick={clear} className="btn btn-ghost mt-4">Reset filters</button>
          </div>
        )}
      </Section>
    </>
  );
}
