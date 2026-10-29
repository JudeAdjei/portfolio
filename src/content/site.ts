// ─────────────────────────────────────────────────────────────────────────────
// SITE CONTENT — edit this file to change links, bio, skills, timeline.
// Every claim here is sourced from Jude's CV or project files (see `source`).
// ─────────────────────────────────────────────────────────────────────────────

export type RoleId = 'all' | 'analyst' | 'scientist' | 'business' | 'engineer';

export const profile = {
  name: 'Jude Adjei',
  headline: 'Data Analyst | Data Scientist | Business Analyst | Aspiring Data Engineer',
  statement:
    'Transforming data into insights, forecasts, and business decisions through analytical thinking, statistical modelling, and data visualisation.',
  intro:
    'I solve problems with data. I enjoy uncovering the answers hidden in data and communicating them clearly to stakeholders to improve productivity.',
  about:
    'I am a data scientist and data analyst who turns data into actionable insight, with a strong background in statistics, financial technology and business analysis. I am also an aspiring data engineer.',
  location: 'England, United Kingdom',
  email: 'adjeijude24@gmail.com',
};

// Links. Set `url` to null to hide a card or show it as "coming soon".
export const links = {
  linkedin: 'https://www.linkedin.com/in/judeadjei/',
  linkedinActivity: 'https://www.linkedin.com/in/judeadjei/recent-activity/all/',
  github: 'https://github.com/J2ju',
  safeflow: 'https://lnkd.in/ev9ZTBPV',
  cvPdf: 'cv/Jude-Adjei-CV.pdf',
  blog: null as string | null, // add a URL when technical writing is published
  certificateUrl: 'https://coursera.org/share/9ac6662fc75770695316fe1f455ef8a1' as string | null,
};

// Optional form endpoint (e.g. Formspree). Set VITE_FORM_ENDPOINT at build time.
export const formEndpoint: string | undefined = import.meta.env.VITE_FORM_ENDPOINT || undefined;

export type TimelineItem = { when: string; title: string; org: string; kind: 'education' | 'work' | 'project'; detail: string; source: string };

export const timeline: TimelineItem[] = [
  { when: 'Oct 2025 – Oct 2026', title: 'MSc Financial Technology and Business Analytics', org: 'University of Chester', kind: 'education', detail: 'Modules include quantitative techniques for financial analysis; dissertation on UK credit card borrowing.', source: 'CV; BU7045 workbook; dissertation' },
  { when: 'Oct 2026', title: 'Dissertation: Macroeconomic determinants of UK credit card borrowing', org: 'University of Chester', kind: 'project', detail: 'Monthly time-series regression on Bank of England and ONS data, 2000–2026, built in Python.', source: 'Dissertation final draft' },
  { when: 'Oct 2025 – present', title: 'Mail Sorter', org: 'Royal Mail', kind: 'work', detail: 'High-throughput parcel sorting, label verification and exception escalation.', source: 'CV' },
  { when: 'Nov 2024 – Oct 2025', title: 'Sales Analyst', org: "Pep's Restaurant, Bogoso, Ghana", kind: 'work', detail: 'Daily sales-trend analysis, dynamic break-even reports and branch performance comparisons.', source: 'CV' },
  { when: 'Sep 2023', title: 'Final-year group thesis: Forecasting Apple Inc. stock prices and volatility', org: 'KNUST, Department of Statistics and Actuarial Science', kind: 'project', detail: 'Group project (4 authors) submitted for the BSc Statistics; ARIMA and GARCH modelling in R.', source: 'Group thesis & presentation' },
];

export type Skill = { name: string; evidence: string[]; note?: string };
export type SkillGroup = { group: string; roles: RoleId[]; skills: Skill[] };

// `evidence` holds project slugs that demonstrate the skill.
export const skillGroups: SkillGroup[] = [
  {
    group: 'Programming & analysis',
    roles: ['analyst', 'scientist', 'engineer'],
    skills: [
      { name: 'Python (pandas, NumPy, statsmodels)', evidence: ['uk-credit-card-borrowing'] },
      { name: 'R (forecast, tseries, rugarch, PerformanceAnalytics)', evidence: ['apple-forecasting'] },
      { name: 'Excel (Analysis ToolPak, data tables, NPV/IRR, STOCKHISTORY)', evidence: ['excel-quant-techniques'] },
      { name: 'TypeScript / React prototype (AI-assisted build)', evidence: ['safeflow'], note: 'Built in Google AI Studio with Gemini as a coding assistant' },
      { name: 'SQL', evidence: [] },
    ],
  },
  {
    group: 'Statistics & modelling',
    roles: ['scientist', 'analyst'],
    skills: [
      { name: 'OLS regression with Newey–West (HAC) errors', evidence: ['uk-credit-card-borrowing'] },
      { name: 'Unit-root testing (ADF, KPSS, Phillips–Perron)', evidence: ['uk-credit-card-borrowing', 'apple-forecasting'] },
      { name: 'Diagnostics (VIF, Durbin–Watson, Ljung–Box, Breusch–Pagan, Jarque–Bera)', evidence: ['uk-credit-card-borrowing'] },
      { name: 'Structural-break tests (Chow, CUSUM, interactions)', evidence: ['uk-credit-card-borrowing'] },
      { name: 'ARIMA, Box–Cox, GARCH-family volatility models', evidence: ['apple-forecasting'] },
      { name: 'Monte Carlo simulation', evidence: ['safeflow', 'excel-quant-techniques'] },
      { name: 'Hypothesis testing (t-test, F-test, ANOVA)', evidence: ['excel-quant-techniques'] },
    ],
  },
  {
    group: 'Visualisation & reporting',
    roles: ['analyst', 'business'],
    skills: [
      { name: 'Time-series and diagnostic charts', evidence: ['uk-credit-card-borrowing', 'apple-forecasting'] },
      { name: 'Interactive dashboards (Recharts)', evidence: ['safeflow'] },
      { name: 'KPI and break-even reporting', evidence: ['peps-sales-performance', 'excel-quant-techniques'] },
      { name: 'Performance dashboards', evidence: ['peps-sales-performance'] },
    ],
  },
  {
    group: 'Data & business practice',
    roles: ['business', 'engineer', 'analyst'],
    skills: [
      { name: 'Sourcing official data (Bank of England IADB, ONS series codes)', evidence: ['uk-credit-card-borrowing'] },
      { name: 'Data validation (missing values, duplicates, implausible values)', evidence: ['uk-credit-card-borrowing'] },
      { name: 'Reproducible, staged analysis scripts', evidence: ['uk-credit-card-borrowing'] },
      { name: 'CSV ingestion and report export (CSV, Excel, PDF, PPT)', evidence: ['safeflow'] },
      { name: 'Operational performance monitoring & exception handling', evidence: ['royal-mail-operations'] },
      { name: 'Stakeholder communication', evidence: ['peps-sales-performance', 'uk-credit-card-borrowing'] },
    ],
  },
];

export const tools = ['Python', 'R', 'Excel', 'pandas', 'statsmodels', 'ARIMA / GARCH', 'Monte Carlo', 'Recharts', 'TypeScript'];

export const certificates = [
  { name: 'Google Data Analytics Professional Certificate', issuer: 'Google', source: 'CV', url: links.certificateUrl },
];
