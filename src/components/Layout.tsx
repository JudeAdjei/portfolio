import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { links, profile, type RoleId } from '../content/site';
import { IconClose, IconGitHub, IconLinkedIn, IconMenu, IconMoon, IconSun } from './Icons';
import { ExtLink } from './ui';

// ── Role context: the selected career pathway reshapes Home, Projects and Skills ──
const RoleCtx = createContext<{ role: RoleId; setRole: (r: RoleId) => void }>({ role: 'all', setRole: () => {} });
export const useRole = () => useContext(RoleCtx);

function readRole(): RoleId {
  try {
    const r = localStorage.getItem('ja-role') as RoleId | null;
    if (r && ['all', 'analyst', 'scientist', 'business', 'engineer'].includes(r)) return r;
  } catch { /* storage unavailable */ }
  return 'all';
}

const nav = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/cv', label: 'CV' },
  { to: '/links', label: 'Links' },
  { to: '/contact', label: 'Contact' },
];

function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');
  const flip = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('ja-theme-v2', next); } catch { /* ignore */ }
    setTheme(next);
  };
  return (
    <button type="button" onClick={flip} className="btn btn-ghost !p-2" aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} title="Toggle theme">
      {theme === 'dark' ? <IconSun /> : <IconMoon />}
    </button>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-lg" aria-label="Jude Adjei, home">
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="rgb(var(--raised))" stroke="rgb(var(--line))" />
        <path d="M12 44 L24 32 L34 38 L52 18" stroke="rgb(var(--accent))" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="52" cy="18" r="5" fill="rgb(var(--violet))" />
      </svg>
      <span>Jude Adjei</span>
    </Link>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleId>(readRole);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  const setRole = (r: RoleId) => {
    setRoleState(r);
    try { localStorage.setItem('ja-role', r); } catch { /* ignore */ }
  };

  return (
    <RoleCtx.Provider value={{ role, setRole }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 btn btn-primary">Skip to content</a>
      <header className="sticky z-40 border-b border-line/70 bg-bg/85 backdrop-blur" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
        <div className="gutter">
          <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-4">
            <Logo />
            <nav aria-label="Main" className="hidden md:flex items-center gap-1">
              {nav.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => `rounded-lg px-3 py-2 text-sm ${isActive ? 'text-fg bg-raised' : 'text-muted hover:text-fg'}`}>
                  {n.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <ExtLink href={links.linkedin} className="btn btn-ghost !p-2 hidden sm:inline-flex" label="LinkedIn profile (opens in a new tab)"><IconLinkedIn /></ExtLink>
              <ExtLink href={links.github} className="btn btn-ghost !p-2 hidden sm:inline-flex" label="GitHub profile (opens in a new tab)"><IconGitHub /></ExtLink>
              <ThemeToggle />
              <button type="button" className="btn btn-ghost !p-2 md:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
                {open ? <IconClose /> : <IconMenu />}
              </button>
            </div>
          </div>
          {open && (
            <nav id="mobile-nav" aria-label="Mobile" className="md:hidden pb-4 grid gap-1">
              {nav.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => `rounded-lg px-3 py-2.5 ${isActive ? 'bg-raised text-fg' : 'text-muted'}`}>
                  {n.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="gutter border-t border-line/70 py-10 mt-10">
        <div className="mx-auto max-w-page flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-muted">
          <p>© {new Date().getFullYear()} {profile.name}. Charts use project data or published results; illustrative graphics are labelled.</p>
          <div className="flex flex-wrap gap-4">
            <ExtLink href={links.linkedin} className="hover:text-fg">LinkedIn</ExtLink>
            <ExtLink href={links.github} className="hover:text-fg">GitHub</ExtLink>
            <Link to="/contact" className="hover:text-fg">Contact</Link>
          </div>
        </div>
      </footer>
    </RoleCtx.Provider>
  );
}
