// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS — add a new object here to add a project card.
// `detail` names the case-study component in src/pages/caseStudies (optional;
// projects without one get the generic case-study layout).
// ─────────────────────────────────────────────────────────────────────────────
import type { RoleId } from './site';
import dissImg from '../assets/diss-balances.webp';
import aaplImg from '../assets/aapl-prices.webp';
import safeImg from '../assets/safeflow-landing.webp';

export type Category =
  | 'Data Analysis' | 'Data Science' | 'Business Analysis' | 'Data Engineering'
  | 'Financial Analytics' | 'Forecasting' | 'Python' | 'R' | 'Excel' | 'TypeScript' | 'Visualisation';

export type Project = {
  slug: string;
  title: string;
  kind: string;          // project type label
  team: 'Individual' | 'Group' | 'Professional experience';
  problem: string;
  finding: string;       // one verified finding/outcome
  findingSource: string;
  tech: string[];
  categories: Category[];
  roles: Exclude<RoleId, 'all'>[];
  rank: Record<Exclude<RoleId, 'all'>, number>; // lower = shown earlier in that role view
  image?: string;
  imageAlt?: string;
  visual?: 'npv' | 'ops' | 'sales';   // drawn preview when there is no image
  links?: { label: string; url: string }[];
  evidence: string;      // what the case study is built from
};

export const projects: Project[] = [
  {
    slug: 'uk-credit-card-borrowing',
    title: 'UK Credit Card Borrowing and the Macroeconomy',
    kind: 'MSc dissertation · Financial data analytics',
    team: 'Individual',
    problem: 'To what extent do macroeconomic factors explain monthly variation in the growth of UK credit card borrowing?',
    finding: 'The card interest rate ranked last under both labour-market measures; the claimant count was the strongest determinant (standardised β = −0.240, p < 0.0001).',
    findingSource: 'Dissertation, Tables 4.5–4.6 and 4.13',
    tech: ['Python', 'pandas', 'statsmodels', 'OLS + Newey–West', 'ADF', 'Chow / CUSUM'],
    categories: ['Data Analysis', 'Data Science', 'Data Engineering', 'Financial Analytics', 'Python', 'Visualisation'],
    roles: ['analyst', 'scientist', 'business', 'engineer'],
    rank: { analyst: 1, scientist: 1, business: 4, engineer: 1 },
    image: dissImg,
    imageAlt: 'UK credit card balances outstanding, 2000–2026, with the three crisis periods shaded',
    links: [{ label: 'View code on GitHub', url: 'https://github.com/J2ju/uk-credit-card-borrowing-analysis' }],
    evidence: 'Dissertation final draft, analysis script and the deposited regression dataset (316 monthly rows).',
  },
  {
    slug: 'safeflow',
    title: 'SafeFlow: SME Cash-Flow Risk Engine',
    kind: 'Web app prototype · Monte Carlo risk analytics',
    team: 'Individual',
    problem: 'UK micro-SMEs see invoices, not cash. When will open invoices actually be paid, and how bad could the next 60–90 days get?',
    finding: 'Simulates 1,000 payment-delay scenarios per run and reports P10 / P50 / P90 cumulative cash-in, with stress sliders for late payment, default risk and downturn.',
    findingSource: 'App source (analyticsService.ts, types.ts) inspected in Google AI Studio',
    tech: ['TypeScript', 'React', 'Recharts', 'Monte Carlo', 'Gemini API', 'Google AI Studio'],
    categories: ['Data Science', 'Business Analysis', 'Data Engineering', 'Financial Analytics', 'Forecasting', 'TypeScript', 'Visualisation'],
    roles: ['scientist', 'business', 'engineer', 'analyst'],
    rank: { analyst: 4, scientist: 3, business: 2, engineer: 2 },
    image: safeImg,
    imageAlt: 'SafeFlow landing page: Know your cash flow, master your risk',
    links: [{ label: 'Open the app (Google AI Studio)', url: 'https://lnkd.in/ev9ZTBPV' }],
    evidence: 'Live app and its source code in Google AI Studio (reached via Jude’s LinkedIn link).',
  },
  {
    slug: 'apple-forecasting',
    title: 'Forecasting Apple Stock Prices and Volatility',
    kind: 'BSc group thesis · Time-series forecasting',
    team: 'Group',
    problem: 'Can weekly Apple opening prices (Mar 2013 – Mar 2023) be forecast, and how much risk surrounds those forecasts?',
    finding: 'ARIMA(2,1,2) with drift beat ARIMA(1,1,1) on the 20-week hold-out (RMSE 22.98 vs 24.87); sGARCH(1,1) was the only GARCH variant to pass every diagnostic.',
    findingSource: 'Group thesis, Tables 4.7 and 4.11–4.17',
    tech: ['R', 'forecast', 'rugarch', 'Box–Cox', 'ARIMA', 'GARCH'],
    categories: ['Data Science', 'Financial Analytics', 'Forecasting', 'R', 'Visualisation'],
    roles: ['scientist', 'analyst'],
    rank: { analyst: 5, scientist: 2, business: 9, engineer: 9 },
    image: aaplImg,
    imageAlt: 'Weekly Apple opening share price, 2013–2023',
    links: [{ label: 'View code on GitHub', url: 'https://github.com/J2ju/apple-stock-forecasting-arima-garch' }],
    evidence: 'Group thesis (KNUST, 2023), presentation slides and the R script.',
  },
  {
    slug: 'excel-quant-techniques',
    title: 'Quantitative Techniques in Excel',
    kind: 'MSc assessment · Financial modelling',
    team: 'Individual',
    problem: 'Answer applied finance questions in Excel alone: a 1,000-run Monte Carlo NPV appraisal, a break-even model, regression and ANOVA on 20 years of company data.',
    finding: '1,000 simulated replications gave a mean NPV of $454.3k with no replication below zero; break-even sits at 240 units.',
    findingSource: 'BU7045 workbook, Sections B-Q3a and B-Q3b',
    tech: ['Excel', 'Data tables', 'NPV / IRR', 'Regression', 'ANOVA'],
    categories: ['Data Analysis', 'Business Analysis', 'Financial Analytics', 'Excel', 'Visualisation'],
    roles: ['analyst', 'business', 'scientist'],
    rank: { analyst: 3, scientist: 4, business: 3, engineer: 9 },
    visual: 'npv',
    evidence: 'BU7045 Quantitative Techniques for Financial Analysis workbook (July 2026).',
  },
  {
    slug: 'peps-sales-performance',
    title: "Sales Performance Reporting at Pep's Restaurant",
    kind: 'Professional experience · Business analytics',
    team: 'Professional experience',
    problem: 'Which branches, prices and staffing patterns drive sales, and how quickly can management see when a branch falls below break-even?',
    finding: 'Increased sales revenue performance by 60% by identifying and acting on daily sales trends.',
    findingSource: 'Professional experience',
    tech: ['Excel', 'Break-even analysis', 'KPI reporting', 'Dashboards'],
    categories: ['Data Analysis', 'Business Analysis', 'Visualisation'],
    roles: ['business', 'analyst'],
    rank: { analyst: 2, scientist: 9, business: 1, engineer: 9 },
    visual: 'sales',
    evidence: 'Sales Analyst role, November 2024 – October 2025.',
  },
  {
    slug: 'royal-mail-operations',
    title: 'Operational Flow at Royal Mail',
    kind: 'Professional experience · Operations',
    team: 'Professional experience',
    problem: 'Keep parcel flow moving at volume while catching the parcels that would otherwise go missing.',
    finding: 'Sorted 500+ parcels per hour, improved operational rate flow by 80% and cut lost time by 27%.',
    findingSource: 'Professional experience',
    tech: ['Throughput KPIs', 'Exception handling', 'Bottleneck response'],
    categories: ['Business Analysis', 'Data Analysis'],
    roles: ['business', 'analyst'],
    rank: { analyst: 6, scientist: 9, business: 5, engineer: 9 },
    visual: 'ops',
    evidence: 'Mail Sorter role, October 2025 – present.',
  },
];

export const roleMeta: Record<RoleId, { label: string; blurb: string }> = {
  all: { label: 'All roles', blurb: 'The strongest, best-evidenced work first.' },
  analyst: { label: 'Data Analyst', blurb: 'Cleaning and exploring data, Python, R and Excel, clear charts and written findings.' },
  scientist: { label: 'Data Scientist', blurb: 'Statistical modelling, time-series forecasting, diagnostics and simulation.' },
  business: { label: 'Business Analyst', blurb: 'Business questions, KPIs, break-even and operational performance, and recommendations.' },
  engineer: { label: 'Data Engineer', blurb: 'Data sourcing, validation, transformation and reproducible analysis pipelines.' },
};

export function projectsForRole(role: RoleId): Project[] {
  if (role === 'all') return projects;
  return projects.filter((p) => p.roles.includes(role)).sort((a, b) => a.rank[role] - b.rank[role]);
}
