import type { ReactNode } from 'react';
import raw from '../data/creditCard.json';

export const C = { s1: 'var(--s1)', s2: 'var(--s2)', s3: 'var(--s3)', s4: 'var(--s4)', accent: 'rgb(var(--accent))', violet: 'rgb(var(--violet))', muted: 'rgb(var(--muted))', grid: 'var(--grid)', line: 'rgb(var(--line))', bad: 'rgb(var(--bad))', good: 'rgb(var(--good))' };

export const axisProps = { stroke: 'rgb(var(--line))', tickLine: false } as const;
export const gridProps = { stroke: 'var(--grid)', strokeDasharray: '0', vertical: false } as const;

export function ChartTooltip({ active, payload, label, fmt, labelFmt }: any & { fmt?: (v: number, name: string) => string; labelFmt?: (l: any) => string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-surface/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <div className="mb-1 font-mono text-muted">{labelFmt ? labelFmt(label) : label}</div>
      {payload.filter((p: any) => p.value !== null && p.value !== undefined).map((p: any) => (
        <div key={p.dataKey + p.name} className="flex items-center gap-2 num">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color || p.stroke || p.fill }} />
          <span className="text-muted">{p.name}</span>
          <span className="ml-auto pl-3 font-semibold text-fg">{fmt ? fmt(p.value, p.name) : typeof p.value === 'number' ? p.value.toLocaleString('en-GB', { maximumFractionDigits: 3 }) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ChartPanel({ title, desc, controls, children, foot }: { title: string; desc?: ReactNode; controls?: ReactNode; children: ReactNode; foot?: ReactNode }) {
  return (
    <div className="card p-4 sm:p-5 min-w-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 max-w-2xl">
          <h4 className="font-display text-lg font-bold">{title}</h4>
          {desc && <p className="mt-1 text-sm text-muted">{desc}</p>}
        </div>
        {controls && <div className="flex flex-wrap items-center gap-2">{controls}</div>}
      </div>
      <div className="mt-4 min-w-0">{children}</div>
      {foot && <div className="mt-3">{foot}</div>}
    </div>
  );
}

// ── UK credit-card dataset (verified: reproduces dissertation Table 4.5, Model 1) ──
export type CcRow = { month: string; balances: number; growth: number; dApr: number; dBank: number; cpi: number; dUnemp: number; period: 'normal' | 'gfc' | 'covid' | 'col'; fitted: number | null; resid: number | null };
export const ccRows: CcRow[] = (raw.rows as any[]).map((r) => Object.fromEntries(raw.cols.map((c, i) => [c, r[i]])) as CcRow);

export const periods = {
  gfc: { label: 'Financial crisis', range: 'Aug 2007 – Jun 2009', from: '2007-08', to: '2009-06', fill: 'var(--band-gfc)' },
  covid: { label: 'COVID-19', range: 'Mar 2020 – Jun 2021', from: '2020-03', to: '2021-06', fill: 'var(--band-covid)' },
  col: { label: 'Cost of living', range: 'Oct 2021 – Dec 2023', from: '2021-10', to: '2023-12', fill: 'var(--band-col)' },
} as const;

export const monthLabel = (m: string) => {
  const [y, mo] = m.split('-');
  return new Date(Number(y), Number(mo) - 1, 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
};
export const yearTick = (m: string) => m.slice(0, 4);
