import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import mc from '../data/excelMc.json';
import { C, ChartPanel, ChartTooltip, axisProps, gridProps } from './common';
import { Segmented, Source, Tabs } from '../components/ui';
import { IconReset } from '../components/Icons';

// Workbook-reported statistics (Section B - Q3a)
const wb = { mean: 454.3478, min: 60.5545, max: 886.6828, irrMean: 21.38, irrMin: 12.60, irrMax: 31.59, base: 405.1003, baseIrr: 20.73 };

function NpvView() {
  return (
    <ChartPanel
      title="Monte Carlo NPV of a software project"
      desc="A $1m project with average annual cash flow of $250k (SD $60k) over 10 years, discounted at 11.25%. Excel data tables re-drew the cash flows 1,000 times; the chart groups the simulated NPVs."
      foot={<Source>BU7045 workbook, Section B-Q3a: all 1,000 replications. Mean, min, max and risk of loss as reported by the workbook.</Source>}
    >
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mc.npvBins.map((b) => ({ ...b, label: `${b.from}–${b.to}` }))} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="label" {...axisProps} interval={2} tick={{ fontSize: 10 }} />
              <YAxis {...axisProps} width={40} allowDecimals={false} />
              <Tooltip content={<ChartTooltip labelFmt={(l: string) => `NPV $${l}k`} fmt={(v: number) => `${v} replications`} />} cursor={{ fill: 'rgb(var(--raised))' }} />
              <Bar dataKey="count" name="Replications" fill={C.s1} radius={[3, 3, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <tbody>
              <tr><th>Mean NPV</th><td>${wb.mean.toFixed(1)}k</td></tr>
              <tr><th>Range</th><td>${wb.min.toFixed(1)}k to ${wb.max.toFixed(1)}k</td></tr>
              <tr><th>Risk of loss (NPV &lt; 0)</th><td>0%</td></tr>
              <tr><th>Mean IRR</th><td>{wb.irrMean.toFixed(2)}% (range {wb.irrMin}–{wb.irrMax}%)</td></tr>
              <tr><th>Single deterministic run</th><td>NPV ${wb.base.toFixed(1)}k · IRR {wb.baseIrr}%</td></tr>
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted">Every replication clears the 11.25% cost of capital, so the decision is robust to cash-flow noise of this size.</p>
        </div>
      </div>
    </ChartPanel>
  );
}

function BreakEvenView() {
  const defaults = { price: 85, vc: 60, fc: 6000 };
  const [price, setPrice] = useState(defaults.price);
  const [vc, setVc] = useState(defaults.vc);
  const [fc, setFc] = useState(defaults.fc);
  const [view, setView] = useState<'cvp' | 'profit'>('cvp');
  const margin = price - vc;
  const bep = margin > 0 ? fc / margin : null;
  const maxU = Math.max(1000, bep ? Math.ceil((bep * 2) / 50) * 50 : 1000);
  const data = Array.from({ length: maxU / 50 + 1 }, (_, i) => { const u = i * 50; return { u, revenue: u * price, cost: fc + u * vc, profit: u * (price - vc) - fc }; });
  const reset = () => { setPrice(defaults.price); setVc(defaults.vc); setFc(defaults.fc); };
  const field = (id: string, label: string, v: number, set: (n: number) => void, step = 1) => (
    <label htmlFor={id} className="flex flex-col gap-1 text-xs text-muted">{label}
      <input id={id} type="number" min={0} step={step} value={v} onChange={(e) => set(Math.max(0, +e.target.value))} className="field !py-1.5 num w-28" />
    </label>
  );
  return (
    <ChartPanel
      title="Break-even model"
      desc="Defaults are the workbook’s inputs: price $85, variable cost $60 per unit, fixed cost $6,000. Change them to see how the break-even point moves."
      controls={<button type="button" onClick={reset} className="btn btn-ghost !py-1.5 !text-xs"><IconReset className="h-4 w-4" /> Reset to workbook</button>}
      foot={<Source>BU7045 workbook, Section B-Q3b (units 0–1,000 in steps of 50). Break-even = fixed cost ÷ (price − variable cost).</Source>}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          {field('be-price', 'Price per unit ($)', price, setPrice)}
          {field('be-vc', 'Variable cost per unit ($)', vc, setVc)}
          {field('be-fc', 'Fixed cost ($)', fc, setFc, 100)}
          <div className="rounded-xl border border-accent/40 bg-accent/5 px-4 py-2" aria-live="polite">
            <div className="text-xs text-muted">Break-even point</div>
            <div className="font-display text-2xl font-bold num">{bep === null ? 'Never' : `${Math.ceil(bep).toLocaleString('en-GB')} units`}</div>
            <div className="text-[11px] text-faint">{bep === null ? 'Price must exceed variable cost' : `Contribution $${margin} per unit`}</div>
          </div>
          <Segmented label="Break-even view" value={view} onChange={setView} options={[{ id: 'cvp', label: 'Revenue vs cost' }, { id: 'profit', label: 'Profit' }]} />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 8 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="u" {...axisProps} type="number" domain={[0, maxU]} tickFormatter={(v) => `${v}`} />
              <YAxis {...axisProps} width={56} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
              <Tooltip content={<ChartTooltip labelFmt={(u: number) => `${u} units`} fmt={(v: number) => `$${Math.round(v).toLocaleString('en-GB')}`} />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {bep !== null && <ReferenceLine x={bep} stroke="rgb(var(--muted))" strokeDasharray="4 3" label={{ value: `BEP ${Math.ceil(bep)}`, position: 'insideTopLeft', fill: 'rgb(var(--muted))', fontSize: 11 }} />}
              {view === 'cvp' ? (
                <>
                  <Line dataKey="revenue" name="Sales revenue" stroke={C.s1} strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line dataKey="cost" name="Total cost" stroke={C.s3} strokeWidth={2} dot={false} isAnimationActive={false} />
                </>
              ) : (
                <>
                  <ReferenceLine y={0} stroke="rgb(var(--faint))" />
                  <Line dataKey="profit" name="Net profit" stroke={C.s2} strokeWidth={2} dot={false} isAnimationActive={false} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartPanel>
  );
}

function StatsView() {
  return (
    <ChartPanel title="Regression and hypothesis tests" desc="Excel Analysis ToolPak on 20 years of company financial data (BAE Systems, easyJet, IAG, Jet2, Ryanair)." foot={<Source>BU7045 workbook, Section B-Q2.</Source>}>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-line p-4">
          <p className="eyebrow !text-[10px]">Multiple regression</p>
          <p className="mt-2 text-sm">Market value on fixed assets, issued capital and interest cover (n = 90).</p>
          <p className="mt-2 font-mono text-sm num">R² = 0.596 · adj. R² = 0.582<br />F = 42.31, p ≈ 6.8e−17</p>
          <p className="mt-2 text-xs text-muted">Fixed assets (p &lt; 0.001) and issued capital (p &lt; 0.001) significant; interest cover only at 10% (p = 0.065).</p>
        </div>
        <div className="rounded-xl border border-line p-4">
          <p className="eyebrow !text-[10px]">F-test and t-test</p>
          <p className="mt-2 text-sm">Return on total assets, BAE vs Ryanair (20 years each).</p>
          <p className="mt-2 font-mono text-sm num">F = 0.098, one-tail p = 2.4e−6<br />t = −0.747, two-tail p = 0.463</p>
          <p className="mt-2 text-xs text-muted">Variances differ, so the unequal-variance t-test was used; mean returns do not differ significantly.</p>
        </div>
        <div className="rounded-xl border border-line p-4">
          <p className="eyebrow !text-[10px]">One-way ANOVA</p>
          <p className="mt-2 text-sm">Return on capital employed across easyJet, Ryanair and Jet2.</p>
          <p className="mt-2 font-mono text-sm num">F = 1.815, p = 0.172<br />F crit = 3.159</p>
          <p className="mt-2 text-xs text-muted">No significant difference in mean ROCE between the three airlines at 5%.</p>
        </div>
      </div>
    </ChartPanel>
  );
}

export function ExcelExplorer() {
  const [tab, setTab] = useState<'npv' | 'be' | 'stats'>('npv');
  return (
    <div className="flex flex-col gap-4">
      <Tabs label="Excel project views" value={tab} onChange={setTab} tabs={[{ id: 'npv', label: 'Monte Carlo NPV' }, { id: 'be', label: 'Break-even' }, { id: 'stats', label: 'Regression & tests' }]} />
      {tab === 'npv' && <NpvView />}
      {tab === 'be' && <BreakEvenView />}
      {tab === 'stats' && <StatsView />}
    </div>
  );
}
