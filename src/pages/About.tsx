import { Link } from 'react-router-dom';
import { links, profile, skillGroups, timeline } from '../content/site';
import { projects, roleMeta } from '../content/projects';
import { useRole } from '../components/Layout';
import { RoleSelector } from '../components/RoleSelector';
import { CopyButton, ExtLink, Section } from '../components/ui';
import { IconLinkedIn, IconMail } from '../components/Icons';

const titleOf = (slug: string) => projects.find((p) => p.slug === slug)?.title ?? slug;

export function SkillsGrid() {
  const { role } = useRole();
  const groups = role === 'all' ? skillGroups : [...skillGroups].sort((a, b) => Number(b.roles.includes(role)) - Number(a.roles.includes(role)));
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.map((g) => {
        const dim = role !== 'all' && !g.roles.includes(role);
        return (
          <div key={g.group} className={`card p-5 transition-opacity ${dim ? 'opacity-55' : ''}`}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold">{g.group}</h3>
              {role !== 'all' && !dim && <span className="chip !text-accent !border-accent/40">Relevant to {roleMeta[role].label}</span>}
            </div>
            <ul className="mt-3 flex flex-col gap-2.5">
              {g.skills.map((s) => (
                <li key={s.name} className="text-sm">
                  <span className="text-fg">{s.name}</span>
                  {s.evidence.length > 0 && (
                    <span className="mt-1 flex flex-wrap gap-1.5">
                      {s.evidence.map((e) => (
                        <Link key={e} to={`/projects/${e}`} className="chip !text-[11px] hover:!text-accent hover:!border-accent/50">{titleOf(e)}</Link>
                      ))}
                      {s.note && <span className="text-[11px] text-faint self-center">{s.note}</span>}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default function About() {
  return (
    <>
      <Section eyebrow="About" title={profile.name}>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-5">
            <p className="text-xl text-fg/90 prose-body">{profile.about}</p>
            <dl className="card grid gap-4 p-5 sm:grid-cols-2">
              <div><dt className="text-xs uppercase tracking-wider text-faint">Location</dt><dd className="mt-1 text-fg">{profile.location}</dd></div>
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-wider text-faint">Email</dt>
                <dd className="mt-1 flex flex-wrap items-center gap-2"><span className="select-all break-all font-mono text-sm text-fg">{profile.email}</span><CopyButton text={profile.email} label="Copy" /></dd>
              </div>
              <div className="sm:col-span-2 flex flex-wrap gap-2">
                <ExtLink href={links.linkedin} className="btn btn-ghost !py-1.5 !text-xs"><IconLinkedIn className="h-4 w-4" /> LinkedIn</ExtLink>
                <Link to="/contact" className="btn btn-ghost !py-1.5 !text-xs"><IconMail className="h-4 w-4" /> Send a message</Link>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="text-lg font-bold">Timeline</h3>
            <ol className="mt-4 relative border-l border-line pl-5 flex flex-col gap-5">
              {timeline.map((t) => (
                <li key={t.title} className="relative">
                  <span className={`absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-bg ${t.kind === 'education' ? 'bg-violet' : t.kind === 'work' ? 'bg-amber' : 'bg-accent'}`} aria-hidden="true" />
                  <p className="font-mono text-xs text-faint">{t.when} · {t.kind}</p>
                  <p className="font-semibold text-fg">{t.title}</p>
                  <p className="text-sm text-muted">{t.org}</p>
                  <p className="mt-1 text-sm text-muted">{t.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>
      <Section eyebrow="Skills" title="Skills, linked to projects" intro="Choose a role to bring the most relevant groups forward.">
        <div className="mb-6"><RoleSelector compact /></div>
        <SkillsGrid />
      </Section>
    </>
  );
}
