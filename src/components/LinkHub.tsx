import { Link } from 'react-router-dom';
import { links, profile } from '../content/site';
import { IconArrow, IconBadge, IconChart, IconExternal, IconFile, IconGitHub, IconLinkedIn, IconMail, IconPen, IconSpark, IconUsers } from './Icons';

type Item = { title: string; desc: string; icon: JSX.Element; to?: string; href?: string; status?: string };

export const hubItems: Item[] = [
  { title: 'LinkedIn', desc: 'Profile, experience and recent posts', icon: <IconLinkedIn />, href: links.linkedin },
  { title: 'GitHub', desc: 'github.com/J2ju · project code', icon: <IconGitHub />, href: links.github },
  { title: 'CV', desc: 'Read the CV online or open the PDF', icon: <IconFile />, to: '/cv' },
  { title: 'Featured projects', desc: 'Six case studies with interactive charts', icon: <IconChart />, to: '/projects' },
  { title: 'Credit card dissertation', desc: 'UK borrowing vs. the macroeconomy, 2000–2026', icon: <IconSpark />, to: '/projects/uk-credit-card-borrowing' },
  { title: 'Apple forecasting (group)', desc: 'ARIMA price and GARCH volatility models in R', icon: <IconUsers />, to: '/projects/apple-forecasting' },
  { title: 'SafeFlow app', desc: 'Monte Carlo cash-flow risk prototype', icon: <IconChart />, to: '/projects/safeflow' },
  { title: 'Business analytics experience', desc: "Sales reporting at Pep's · operations at Royal Mail", icon: <IconChart />, to: '/projects/peps-sales-performance' },
  { title: 'Google Data Analytics Certificate', desc: 'Professional Certificate · view credential', icon: <IconBadge />, href: links.certificateUrl ?? undefined, to: '/cv' },
  ...(links.blog ? [{ title: 'Technical writing', desc: 'Articles and notes', icon: <IconPen />, href: links.blog }] : []),
  { title: 'Email', desc: profile.email, icon: <IconMail />, to: '/contact' },
];

export function LinkHub({ items = hubItems }: { items?: Item[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => {
        const inner = (
          <>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-raised text-accent">{it.icon}</span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-semibold text-fg">
                {it.title}
                {it.status && <span className="chip !text-[10px] !py-0">{it.status}</span>}
              </span>
              <span className="block truncate text-sm text-muted">{it.desc}</span>
            </span>
            {it.href ? <IconExternal className="h-4 w-4 text-faint group-hover:text-accent" /> : <IconArrow className="h-4 w-4 text-faint group-hover:text-accent transition-transform group-hover:translate-x-0.5" />}
          </>
        );
        const cls = 'card group flex items-center gap-3 p-3.5 transition-colors hover:border-accent/60 hover:bg-raised/60';
        if (!it.to && !it.href) {
          return (
            <li key={it.title} className="min-w-0">
              <div className={`${cls} opacity-70`} aria-disabled="true">{inner}</div>
            </li>
          );
        }
        return (
          <li key={it.title} className="min-w-0">
            {it.href ? (
              <a href={it.href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`${it.title} (opens in a new tab)`}>{inner}</a>
            ) : (
              <Link to={it.to!} className={cls}>{inner}</Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
