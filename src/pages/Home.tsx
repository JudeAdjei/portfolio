import { Link } from 'react-router-dom';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { links, profile, tools } from '../content/site';
import { projectsForRole, roleMeta } from '../content/projects';
import { ccRows, monthLabel, ChartTooltip } from '../charts/common';
import { ProjectCard } from '../components/ProjectCard';
import { RoleSelector } from '../components/RoleSelector';
import { LinkHub, hubItems } from '../components/LinkHub';
import { SkillsGrid } from './About';
import { useRole } from '../components/Layout';
import { ExtLink, Section } from '../components/ui';
import { IconArrow, IconGitHub, IconLinkedIn, IconMail } from '../components/Icons';
import { CvButton } from '../components/CvButton';

const heroData = ccRows.map((r) => ({ month: r.month, bn: +(r.balances / 1000).toFixed(2) }));

function HeroChart() {
  const last = heroData[heroData.length - 1];
  return (
    <div className="card relative overflow-hidden p-4 sm:p-5 rise">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow !text-[10px]">Real project data</p>
          <p className="mt-1 font-semibold">UK credit card balances outstanding</p>
          <p className="text-xs text-muted">£bn, seasonally adjusted · Bank of England LPMVZRJ</p>
        </div>
        <div className="text-right">
          <div className="font-display text-3xl font-bold num">£{last.bn.toFixed(1)}bn</div>
          <div className="text-xs text-muted">{monthLabel(last.month)}</div>
        </div>
      </div>
      <div className="mt-3 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={heroData} margin={{ top: 6, right: 4, bottom: 0, left: 4 }}>
            <defs>
              <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity={0.35} />
                <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" hide />
            <YAxis hide domain={[25, 85]} />
            <Tooltip content={<ChartTooltip labelFmt={monthLabel} fmt={(v: number) => `£${v.toFixed(1)}bn`} />} cursor={{ stroke: 'rgb(var(--muted))', strokeDasharray: '3 3' }} />
            <Area dataKey="bn" name="Balances" stroke="rgb(var(--accent))" strokeWidth={2} fill="url(#heroFill)" dot={false} isAnimationActive={true} animationDuration={1400} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 border-t border-line pt-3 text-xs">
        <div><div className="text-faint">Months</div><div className="font-mono num text-fg">316</div></div>
        <div><div className="text-faint">Range</div><div className="font-mono num text-fg">2000–2026</div></div>
        <div><div className="text-faint">From</div><Link to="/projects/uk-credit-card-borrowing" className="text-accent underline underline-offset-2">Dissertation</Link></div>
      </div>
    </div>
  );
}

export default function Home() {
  const { role } = useRole();
  const featured = projectsForRole(role).slice(0, 3);
  return (
    <>
      <section className="relative gutter overflow-hidden">
        <div className="relative mx-auto grid max-w-page gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div className="rise min-w-0">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-line bg-raised font-display text-2xl font-extrabold text-accent" aria-hidden="true">JA</div>
              <p className="text-sm text-muted">MSc Financial Technology & Business Analytics<br />University of Chester · {profile.location}</p>
            </div>
            <h1 className="mt-6 text-5xl sm:text-6xl font-extrabold">{profile.name}</h1>
            <p className="mt-4 font-mono text-sm text-accent leading-relaxed">{profile.headline}</p>
            <p className="mt-5 text-xl text-fg/90 prose-body">{profile.statement}</p>
            <p className="mt-4 text-muted prose-body">{profile.intro}</p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link to="/projects" className="btn btn-primary">Explore my projects <IconArrow className="h-4 w-4" /></Link>
              <CvButton />
              <ExtLink href={links.github} className="btn btn-ghost" label="View my GitHub (opens in a new tab)"><IconGitHub className="h-4 w-4" /> View my GitHub</ExtLink>
              <ExtLink href={links.linkedin} className="btn btn-ghost" label="Connect on LinkedIn (opens in a new tab)"><IconLinkedIn className="h-4 w-4" /> Connect on LinkedIn</ExtLink>
              <Link to="/contact" className="btn btn-ghost"><IconMail className="h-4 w-4" /> Contact me</Link>
            </div>
            <ul className="mt-7 flex flex-wrap gap-1.5" aria-label="Tools used in my projects">
              {tools.map((t) => <li key={t} className="chip">{t}</li>)}
            </ul>
          </div>
          <HeroChart />
        </div>
      </section>

      <Section eyebrow="Quick links" title="Everything in one place" className="!pt-4">
        <LinkHub items={hubItems.slice(0, 6)} />
        <Link to="/links" className="mt-4 inline-flex items-center gap-1 text-sm text-accent">All links <IconArrow className="h-4 w-4" /></Link>
      </Section>

      <Section eyebrow="Choose a pathway" title="See the work for the role you’re hiring" intro="The selector reorders projects and skills around one career path. It is remembered on the Projects and About pages too.">
        <RoleSelector />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <ProjectCard key={p.slug} p={p} />)}
        </div>
        <Link to="/projects" className="mt-6 inline-flex items-center gap-1 text-sm text-accent">All {projectsForRole(role).length} projects for {roleMeta[role].label.toLowerCase()} <IconArrow className="h-4 w-4" /></Link>
      </Section>

      <Section eyebrow="Skills" title="What I use, and where I used it" intro="Each skill links to the project that shows it.">
        <SkillsGrid />
      </Section>

      <Section className="!pb-6">
        <div className="card flex flex-col gap-5 p-6 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold">I would be happy to work with your team.</h2>
            <p className="mt-2 text-muted">Explore my projects or get in touch.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/contact" className="btn btn-primary">Get in touch</Link>
            <Link to="/projects" className="btn btn-ghost">See projects</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
