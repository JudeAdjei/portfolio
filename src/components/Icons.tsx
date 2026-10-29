// Small inline icon set (stroke icons, 24px grid). No external icon font needed.
type P = { className?: string };
const base = (d: React.ReactNode, className = 'h-5 w-5') => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{d}</svg>
);
export const IconLinkedIn = ({ className }: P) => base(<><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" /></>, className);
export const IconGitHub = ({ className }: P) => base(<path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />, className);
export const IconFile = ({ className }: P) => base(<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>, className);
export const IconMail = ({ className }: P) => base(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>, className);
export const IconChart = ({ className }: P) => base(<><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-6" /></>, className);
export const IconSpark = ({ className }: P) => base(<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />, className);
export const IconBadge = ({ className }: P) => base(<><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7" /></>, className);
export const IconPen = ({ className }: P) => base(<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>, className);
export const IconArrow = ({ className }: P) => base(<path d="M5 12h14M13 6l6 6-6 6" />, className);
export const IconExternal = ({ className }: P) => base(<><path d="M14 4h6v6M20 4l-9 9" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></>, className);
export const IconSun = ({ className }: P) => base(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>, className);
export const IconMoon = ({ className }: P) => base(<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />, className);
export const IconMenu = ({ className }: P) => base(<path d="M4 6h16M4 12h16M4 18h16" />, className);
export const IconClose = ({ className }: P) => base(<path d="M6 6l12 12M18 6 6 18" />, className);
export const IconCopy = ({ className }: P) => base(<><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>, className);
export const IconCheck = ({ className }: P) => base(<path d="m5 12 5 5L20 7" />, className);
export const IconInfo = ({ className }: P) => base(<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" /></>, className);
export const IconUsers = ({ className }: P) => base(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" /></>, className);
export const IconReset = ({ className }: P) => base(<><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>, className);
