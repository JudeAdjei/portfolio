import { useMemo, useState } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, ErrorBar, Legend, Line, LineChart,
  ReferenceArea, ReferenceLine, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis,
} from 'recharts';
import { C, ChartPanel, ChartTooltip, axisProps, ccRows, gridProps, monthLabel, periods, yearTick } from './common';
import { Segmented, Source, Tabs } from '../components/ui';
import { IconReset } from '../components/Icons';

type IndicatorKey = 'balancesBn' | 'growth' | 'cpi' | 'dBank' | 'dApr' | 'dUnemp';
const indicators: Record<IndicatorKey, { label: string; unit: string; color: string; note: string }> = {
  balancesBn: { label: 'Card balances outstanding', unit: '£bn', color: C.s1, note: 'Level, seasonally adjusted (BoE LPMVZRJ)' },
  growth: { label: 'Monthly growth in balances', unit: '%', color: C.s2, note: 'Dependent variable: 100 × Δln(balances)' },
  cpi: { label: 'CPI inflation', unit: '%', color: C.s3, note: 'Annual rate, used in levels (ONS D7G7)' },
  dBank: { label: 'Change in Bank Rate', unit: 'pp', color: C.s4, note: 'Month-on-month change (BoE IUMABEDR)' },
  dApr: { label: 'Change in card interest rate', unit: 'pp', color: C.s1, note: 'Month-on-month change (BoE IUMCCTL)' },
  dUnemp: { label: 'Change in unemployment rate', unit: 'pp', color: C.s2, note: 'Month-on-month change (ONS MGSX)' },
};
const presets = [
  { id: 'all', label: 'All', from: 2000, to: 2026 },
  { id: '00s', label: '2000–09', from: 2000, to: 2009 },
  { id: '10s', label: '2010–19', from: 2010, to: 2019 },
  { id: '20s', label: '2020–26', from: 2020, to: 2026 },
] as const;
const years = Array.from({ length: 27 }, (_, i) => 2000 + i);
const EXTREME = ['2003-02', '2010-01'];

function useRange() {
  const [from, setFrom] = useState(2000);
  const [to, setTo] = useState(2026);
  const rows = useMemo(() => ccRows.filter((r) => +r.month.slice(0, 4) >= from && +r.month.slice(0, 4) <= to).map((r) => ({ ...r, balancesBn: r.balances / 1000 })), [from, to]);
  return { from, to, setFrom, setTo, rows };
}

function RangeControls({ r }: { r: ReturnType<typeof useRange> }) {
  const active = presets.find((p) => p.from === r.from && p.to === r.to)?.id ?? 'custom';
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Segmented label="Date range" value={active as string} onChange={(id) => { const p = presets.find((x) => x.id === id); if (p) { r.setFrom(p.from); r.setTo(p.to); } }} options={presets.map((p) => ({ id: p.id, label: p.label }))} />
      <label className="flex items-center gap-1 text-xs text-muted">From
        <select id="cc-from" className="field !w-auto !py-1 !text-xs" value={r.from} onChange={(e) => { const v = +e.target.value; r.setFrom(v); if (v > r.to) r.setTo(v); }}>
          {years.map((y) => <option key={y}>{y}</option>)}
        </select>
      </label>
      <label className="flex items-center gap-1 text-xs text-muted">To
        <select id="cc-to" className="field !w-auto !py-1 !text-xs" value={r.to} onChange={(e) => { const v = +e.target.value; r.setTo(v); if (v < r.from) r.setFrom(v); }}>
          {years.map((y) => <option key={y}>{y}</option>)}
        </select>
      </label>
    </div>
  );
}

// Recharts only renders its own element types as direct children, so this returns an array.
function bands(rows: { month: string }[], show: boolean) {
  if (!show || !rows.length) return [];
  const first = rows[0].month, last = rows[rows.length - 1].month;
  return Object.entries(periods).flatMap(([k, p]) => {
    const x1 = p.from < first ? first : p.from;
    const x2 = p.to > last ? last : p.to;
    if (x1 > last || x2 < first || x1 > x2) return [];
    return [<ReferenceArea key={k} x1={x1} x2={x2} fill={p.fill} fillOpacity={1} ifOverflow="hidden" />];
  });
}

// One tick per January, thinned so labels never crowd.
function yearTicks(rows: { month: string }[]) {
  const jans = rows.filter((r) => r.month.endsWith('-01')).map((r) => r.month);
  const step = jans.length > 16 ? 4 : jans.length > 8 ? 2 : 1;
  return jans.filter((_, i) => i % step === 0);
}

function BandLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-muted">
      {Object.values(periods).map((p) => (
        <span key={p.label} className="inline-flex items-center gap-1.5"><span className="h-3 w-4 rounded-sm border border-line" style={{ background: p.fill }} />{p.label} <span className="text-faint">{p.range}</span></span>
      ))}
    </div>
  );
}

// ── 1. Trends: small multiples, never two y-scales on one chart ─────────────────
function TrendsView() {
  const r = useRange();
  const [selected, setSelected] = useState<IndicatorKey[]>(['balancesBn', 'growth']);
  const [style, setStyle] = useState<'line' | 'area' | 'bar'>('line');
  const [bandsOn, setBands] = useState(true);
  const toggle = (k: IndicatorKey) => setSelected((s) => (s.includes(k) ? (s.length > 1 ? s.filter((x) => x !== k) : s) : [...s, k]));
  const reset = () => { r.setFrom(2000); r.setTo(2026); setSelected(['balancesBn', 'growth']); setStyle('line'); setBands(true); };

  return (
    <ChartPanel
      title="Indicators over time"
      desc="Pick one or more series. Each gets its own panel and axis on a shared timeline, so different units are never forced onto one scale."
      controls={<button type="button" onClick={reset} className="btn btn-ghost !py-1.5 !text-xs"><IconReset className="h-4 w-4" /> Reset</button>}
      foot={<><BandLegend /><Source>Bank of England IADB & ONS, Feb 2000 – May 2026 (316 months), as deposited with the dissertation.</Source></>}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Show or hide series">
          {(Object.keys(indicators) as IndicatorKey[]).map((k) => (
            <button key={k} type="button" aria-pressed={selected.includes(k)} onClick={() => toggle(k)}
              className={`chip !py-1 !text-xs transition-colors ${selected.includes(k) ? '!text-fg !border-accent/60 !bg-raised' : 'hover:!text-fg'}`}>
              <span className="h-2 w-2 rounded-full" style={{ background: selected.includes(k) ? indicators[k].color : 'transparent', border: `1px solid ${indicators[k].color}` }} />
              {indicators[k].label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <RangeControls r={r} />
          <Segmented label="Chart type" value={style} onChange={setStyle} options={[{ id: 'line', label: 'Line' }, { id: 'area', label: 'Area' }, { id: 'bar', label: 'Bars' }]} />
          <label className="flex items-center gap-2 text-xs text-muted"><input id="cc-bands" type="checkbox" checked={bandsOn} onChange={(e) => setBands(e.target.checked)} className="accent-[rgb(var(--accent))]" /> Shade crisis periods</label>
        </div>
        {selected.map((k) => {
          const ind = indicators[k];
          const Chart: any = style === 'bar' ? BarChart : style === 'area' ? AreaChart : LineChart;
          return (
            <div key={k} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold">{ind.label} <span className="font-normal text-faint">({ind.unit})</span></p>
                <p className="text-xs text-faint">{ind.note}</p>
              </div>
              <div className="h-48 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <Chart data={r.rows} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="month" ticks={yearTicks(r.rows)} tickFormatter={yearTick} {...axisProps} />
                    <YAxis {...axisProps} width={48} domain={['auto', 'auto']} />
                    {bands(r.rows, bandsOn)}
                    {k !== 'balancesBn' && <ReferenceLine y={0} stroke="rgb(var(--faint))" />}
                    <Tooltip content={<ChartTooltip labelFmt={monthLabel} fmt={(v: number) => `${v.toLocaleString('en-GB', { maximumFractionDigits: 3 })} ${ind.unit}`} />} cursor={{ stroke: 'rgb(var(--muted))', strokeDasharray: '3 3' }} />
                    {style === 'bar' && <Bar dataKey={k} name={ind.label} fill={ind.color} isAnimationActive={false} />}
                    {style === 'area' && <Area dataKey={k} name={ind.label} stroke={ind.color} fill={ind.color} fillOpacity={0.18} strokeWidth={2} dot={false} isAnimationActive={false} />}
                    {style === 'line' && <Line dataKey={k} name={ind.label} stroke={ind.color} strokeWidth={2} dot={false} isAnimationActive={false} />}
                  </Chart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </ChartPanel>
  );
}

// ── 2. Periods: compare borrowing growth across economic episodes ───────────────
function PeriodsView() {
  const [exclude, setExclude] = useState(false);
  const stats = useMemo(() => {
    const groups: Record<string, number[]> = { normal: [], gfc: [], covid: [], col: [] };
    ccRows.forEach((r) => { if (exclude && EXTREME.includes(r.month)) return; groups[r.period].push(r.growth); });
    const lab: Record<string, string> = { normal: 'Normal months', gfc: periods.gfc.label, covid: periods.covid.label, col: periods.col.label };
    return Object.entries(groups).map(([k, v]) => {
      const s = [...v].sort((a, b) => a - b);
      const mean = v.reduce((a, b) => a + b, 0) / v.length;
      return { key: k, label: lab[k], mean: +mean.toFixed(3), n: v.length, min: s[0], max: s[s.length - 1], median: s[Math.floor(s.length / 2)] };
    });
  }, [exclude]);
  const colors: Record<string, string> = { normal: 'rgb(var(--faint))', gfc: 'var(--s1)', covid: 'var(--s4)', col: 'var(--s3)' };
  return (
    <ChartPanel
      title="Borrowing growth by economic period"
      desc="Average month-on-month growth in card balances inside each documented crisis window versus all other months. Computed directly from the dataset."
      controls={<label className="flex items-center gap-2 text-xs text-muted"><input id="cc-exclude" type="checkbox" checked={exclude} onChange={(e) => setExclude(e.target.checked)} /> Exclude the two extreme months (Feb 2003, Jan 2010)</label>}
      foot={<Source>Author’s calculation from the deposited dataset; window dates from dissertation §3.3.2.</Source>}
    >
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="label" {...axisProps} interval={0} tick={{ fontSize: 11 }} />
              <YAxis {...axisProps} width={48} unit="%" domain={[-2, 1]} ticks={[-2, -1.5, -1, -0.5, 0, 0.5, 1]} />
              <ReferenceLine y={0} stroke="rgb(var(--faint))" />
              <Tooltip content={<ChartTooltip fmt={(v: number) => `${v.toFixed(3)} %`} />} cursor={{ fill: 'rgb(var(--raised))' }} />
              <Bar dataKey="mean" name="Mean monthly growth" radius={[4, 4, 0, 0]} maxBarSize={56} isAnimationActive={false}>
                {stats.map((s) => <Cell key={s.key} fill={colors[s.key]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Period</th><th>Months</th><th>Mean %</th><th>Median %</th><th>Min %</th><th>Max %</th></tr></thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.key}><td className="whitespace-nowrap">{s.label}</td><td>{s.n}</td><td>{s.mean.toFixed(3)}</td><td>{s.median.toFixed(3)}</td><td>{s.min.toFixed(2)}</td><td>{s.max.toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ChartPanel>
  );
}

// ── 3. Model: published coefficients (Table 4.5) and standardised betas ────────
const betas = [
  { term: 'Labour market (Δ)', m1: 0.0915, p1: 0.3006, m2: -0.2403, p2: '< 0.0001' },
  { term: 'CPI inflation', m1: -0.1897, p1: 0.0199, m2: -0.1542, p2: '0.0641' },
  { term: 'Bank Rate (Δ)', m1: 0.1093, p1: 0.08, m2: 0.0716, p2: '0.2117' },
  { term: 'Card interest rate (Δ)', m1: 0.0087, p1: 0.8361, m2: -0.0023, p2: '0.9494' },
];
const coefs = [
  { term: 'Card interest rate (Δ)', b: 0.0715, se: 0.3456, p: 0.8361 },
  { term: 'Bank Rate (Δ)', b: 1.0223, se: 0.5839, p: 0.08 },
  { term: 'CPI inflation', b: -0.1347, se: 0.0579, p: 0.0199 },
  { term: 'Unemployment rate (Δ)', b: 1.2408, se: 1.1987, p: 0.3006 },
  { term: 'GFC 2007–09', b: -0.2672, se: 0.3018, p: 0.3759 },
  { term: 'COVID-19 2020–21', b: -1.9587, se: 0.6465, p: 0.0024 },
  { term: 'Cost of living 2021–23', b: 0.8051, se: 0.3932, p: 0.0406 },
  { term: 'Lagged growth', b: 0.0754, se: 0.0783, p: 0.3359 },
].map((c) => ({ ...c, err: +(1.96 * c.se).toFixed(4) }));

function ModelView() {
  const [view, setView] = useState<'rank' | 'coef'>('rank');
  const [model, setModel] = useState<'both' | 'm1' | 'm2'>('both');
  return (
    <ChartPanel
      title={view === 'rank' ? 'Which determinant matters most?' : 'Model 1 coefficients with 95% intervals'}
      desc={view === 'rank'
        ? 'Standardised coefficients (β) put the four determinants on one scale. Model 1 measures the labour market with the LFS unemployment rate; Model 2, the specification the study relies on, uses the claimant count.'
        : 'Raw coefficients with Newey–West standard errors (12 lags). Bars show b ± 1.96 × SE; an interval crossing zero means the term is not significant at 5%.'}
      controls={
        <>
          <Segmented label="Model view" value={view} onChange={setView} options={[{ id: 'rank', label: 'Ranking (β)' }, { id: 'coef', label: 'Coefficients' }]} />
          {view === 'rank' && <Segmented label="Model" value={model} onChange={setModel} options={[{ id: 'both', label: 'Both' }, { id: 'm1', label: 'Model 1' }, { id: 'm2', label: 'Model 2' }]} />}
        </>
      }
      foot={<Source>Dissertation Tables 4.5, 4.6 and 4.13 (N = 315). Model 1 R² = 0.124; Model 2 R² = 0.166.</Source>}
    >
      {view === 'rank' ? (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={betas} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
                <CartesianGrid stroke="var(--grid)" horizontal={false} />
                <XAxis type="number" domain={[-0.3, 0.15]} ticks={[-0.3, -0.2, -0.1, 0, 0.1]} {...axisProps} />
                <YAxis type="category" dataKey="term" width={168} {...axisProps} interval={0} tick={{ fontSize: 11 }} />
                <ReferenceLine x={0} stroke="rgb(var(--faint))" />
                <Tooltip content={<ChartTooltip fmt={(v: number) => v.toFixed(4)} />} cursor={{ fill: 'rgb(var(--raised))' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {model !== 'm2' && <Bar dataKey="m1" name="Model 1 · LFS unemployment" fill={C.s1} radius={[0, 4, 4, 0]} maxBarSize={18} isAnimationActive={false} />}
                {model !== 'm1' && <Bar dataKey="m2" name="Model 2 · claimant count" fill={C.s3} radius={[0, 4, 4, 0]} maxBarSize={18} isAnimationActive={false} />}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Determinant</th><th>β M1</th><th>p</th><th>β M2</th><th>p</th></tr></thead>
              <tbody>{betas.map((b) => <tr key={b.term}><td>{b.term}</td><td>{b.m1.toFixed(4)}</td><td>{b.p1.toFixed(4)}</td><td>{b.m2.toFixed(4)}</td><td>{b.p2}</td></tr>)}</tbody>
            </table>
            <p className="mt-3 text-xs text-muted">The card rate ranks last in both models: the one result that does not depend on how the labour market is measured.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={coefs} layout="vertical" margin={{ top: 16, right: 16, bottom: 0, left: 8 }}>
                <CartesianGrid stroke="var(--grid)" horizontal={false} />
                <XAxis type="number" domain={[-3.5, 3.5]} ticks={[-3, -2, -1, 0, 1, 2, 3]} {...axisProps} />
                <YAxis type="category" dataKey="term" width={178} {...axisProps} interval={0} tick={{ fontSize: 11 }} />
                <ReferenceLine x={0} stroke="rgb(var(--faint))" />
                <Tooltip content={<ChartTooltip fmt={(v: number) => v.toFixed(4)} />} cursor={{ fill: 'rgb(var(--raised))' }} />
                <Scatter dataKey="b" name="Coefficient (b)" fill={C.s2} isAnimationActive={false}>
                  <ErrorBar dataKey="err" direction="x" width={6} stroke="rgb(var(--muted))" strokeWidth={1.5} />
                </Scatter>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Term</th><th>b</th><th>SE</th><th>p</th></tr></thead>
              <tbody>{coefs.map((c) => <tr key={c.term}><td>{c.term}</td><td>{c.b.toFixed(4)}</td><td>{c.se.toFixed(4)}</td><td className={c.p < 0.05 ? 'text-good font-semibold' : ''}>{c.p.toFixed(4)}</td></tr>)}</tbody>
            </table>
            <p className="mt-3 text-xs text-muted">Constant 0.6674 (SE 0.1616). Green p-values are below 0.05.</p>
          </div>
        </div>
      )}
    </ChartPanel>
  );
}

// ── 4. Fit & residuals (Model 1 reproduced from the deposited data) ────────────
function FitView() {
  const r = useRange();
  const [view, setView] = useState<'fit' | 'resid' | 'dist'>('fit');
  const [mark, setMark] = useState(true);
  const rows = r.rows.filter((x) => x.fitted !== null);
  const hist = useMemo(() => {
    const vals = ccRows.filter((x) => x.resid !== null).map((x) => x.resid as number);
    const edges: number[] = []; for (let e = -9; e <= 16; e += 1) edges.push(e);
    return edges.slice(0, -1).map((lo, i) => ({ bin: `${lo} to ${edges[i + 1]}`, mid: lo + 0.5, count: vals.filter((v) => v >= lo && v < edges[i + 1]).length }));
  }, []);
  const extremeRows = rows.filter((x) => EXTREME.includes(x.month));
  return (
    <ChartPanel
      title={view === 'fit' ? 'Actual vs fitted monthly growth' : view === 'resid' ? 'Residuals over time' : 'Residual distribution'}
      desc={view === 'fit'
        ? 'Model 1 explains about 12% of month-to-month movement (R² = 0.124). That is expected for monthly growth in a financial aggregate: the aim is interpretable coefficients, not forecasts.'
        : view === 'resid' ? 'What the model could not explain. Two months dominate: Feb 2003 and Jan 2010, which the dissertation treats as probable reporting artefacts and tests in a robustness check.'
        : 'Residuals cluster tightly around zero with two isolated outliers, which is why Jarque–Bera rejects normality (p < 0.0001) while the other diagnostics pass.'}
      controls={
        <>
          <Segmented label="Fit view" value={view} onChange={setView} options={[{ id: 'fit', label: 'Actual vs fitted' }, { id: 'resid', label: 'Residuals' }, { id: 'dist', label: 'Distribution' }]} />
          {view !== 'dist' && <label className="flex items-center gap-2 text-xs text-muted"><input id="cc-mark" type="checkbox" checked={mark} onChange={(e) => setMark(e.target.checked)} /> Mark extreme months</label>}
        </>
      }
      foot={
        <>
          {view !== 'dist' && <div className="mb-2"><RangeControls r={r} /></div>}
          <Source>Fitted values and residuals recomputed by re-estimating the published Model 1 on the deposited data; coefficients match Table 4.5 to four decimals. Durbin–Watson 1.982, Ljung–Box(12) p = 0.362, Breusch–Pagan p = 0.455 (Table 4.7).</Source>
        </>
      }
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {view === 'fit' ? (
            <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="month" ticks={yearTicks(rows)} tickFormatter={yearTick} {...axisProps} />
              <YAxis {...axisProps} width={48} unit="%" domain={[-10, 20]} ticks={[-10, -5, 0, 5, 10, 15, 20]} />
              <ReferenceLine y={0} stroke="rgb(var(--faint))" />
              <Tooltip content={<ChartTooltip labelFmt={monthLabel} fmt={(v: number) => `${v.toFixed(3)} %`} />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line dataKey="growth" name="Actual growth" stroke={C.s1} strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Line dataKey="fitted" name="Fitted (Model 1)" stroke={C.s3} strokeWidth={2} dot={false} isAnimationActive={false} />
              {mark && extremeRows.map((x) => <ReferenceLine key={x.month} x={x.month} stroke={C.bad} strokeDasharray="4 3" label={{ value: monthLabel(x.month), position: 'insideTopRight', fill: 'rgb(var(--bad))', fontSize: 10 }} />)}
            </ComposedChart>
          ) : view === 'resid' ? (
            <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="month" ticks={yearTicks(rows)} tickFormatter={yearTick} {...axisProps} />
              <YAxis {...axisProps} width={48} />
              <ReferenceLine y={0} stroke="rgb(var(--faint))" />
              <Tooltip content={<ChartTooltip labelFmt={monthLabel} fmt={(v: number) => `${v.toFixed(3)} pp`} />} cursor={{ fill: 'rgb(var(--raised))' }} />
              <Bar dataKey="resid" name="Residual" isAnimationActive={false}>
                {rows.map((x) => <Cell key={x.month} fill={mark && EXTREME.includes(x.month) ? C.bad : C.s2} />)}
              </Bar>
            </BarChart>
          ) : (
            <BarChart data={hist} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="bin" {...axisProps} interval={2} tick={{ fontSize: 10 }} />
              <YAxis {...axisProps} width={40} allowDecimals={false} />
              <Tooltip content={<ChartTooltip labelFmt={(l: string) => `Residual ${l} pp`} fmt={(v: number) => `${v} months`} />} cursor={{ fill: 'rgb(var(--raised))' }} />
              <Bar dataKey="count" name="Months" fill={C.s2} radius={[3, 3, 0, 0]} isAnimationActive={false} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}

// ── 5. Robustness: delayed response, stability, seasonality ────────────────────
const lags = [
  { lag: 'Same month', bank: 1.0223, pb: 0.08, card: 0.0715, pc: 0.8361 },
  { lag: '1 month', bank: 0.8051, pb: 0.1239, card: 0.5545, pc: 0.3094 },
  { lag: '2 months', bank: 0.533, pb: 0.2582, card: -0.2861, pc: 0.2028 },
  { lag: '3 months', bank: -0.1928, pb: 0.6442, card: -0.3975, pc: 0.1898 },
];
const stability = [
  { test: 'Interaction test', q: 'Do the four slopes differ in crisis months?', stat: '1.2583', p: '0.2864', verdict: 'Slopes stable', ok: true },
  { test: 'Chow · Sep 2008', q: 'Lehman collapse', stat: '4.4673', p: '0.0002', verdict: 'Break (intercept)', ok: false },
  { test: 'Chow · Mar 2020', q: 'First lockdown', stat: '14.4919', p: '< 0.0001', verdict: 'Break (intercept)', ok: false },
  { test: 'Chow · Oct 2021', q: 'Energy price shock', stat: '4.1029', p: '0.0006', verdict: 'Break (intercept)', ok: false },
  { test: 'CUSUM', q: 'Do parameters drift anywhere?', stat: '0.9187', p: '0.3674', verdict: 'No drift', ok: true },
];
const seasonal = [
  ['Jan', 0.9958], ['Feb', -0.0621], ['Mar', -0.0321], ['Apr', 0.0264], ['May', 0.4153], ['Jun', 0.0684],
  ['Jul', 0.4802], ['Aug', 0.3943], ['Sep', 0.448], ['Oct', 0.2936], ['Nov', 0.2878], ['Dec', 0.0882],
].map(([m, v]) => ({ m, v }));

function RobustView() {
  const [view, setView] = useState<'lags' | 'stability' | 'season'>('lags');
  return (
    <ChartPanel
      title={view === 'lags' ? 'Do households react with a delay?' : view === 'stability' ? 'Did the relationships survive the crises?' : 'Is there seasonality left after adjustment?'}
      desc={view === 'lags'
        ? 'Each rate entered at lags of 0–3 months. Tested jointly, neither adds anything: Bank Rate F = 1.452 (p = 0.217), card rate F = 0.854 (p = 0.492).'
        : view === 'stability' ? 'Chow tests reject because the level of borrowing jumps at each crisis, which the indicator variables absorb. The slope tests do not reject: the relationships held while the level moved.'
        : 'January looks like a festive spike, but one unusual year drives it: a January indicator is not significant (p = 0.428). A broad, shallow pattern remains (joint F = 1.846, p = 0.046).'}
      controls={<Segmented label="Robustness view" value={view} onChange={setView} options={[{ id: 'lags', label: 'Delayed response' }, { id: 'stability', label: 'Stability' }, { id: 'season', label: 'Seasonality' }]} />}
      foot={<Source>Dissertation Tables 4.8–4.12.</Source>}
    >
      {view === 'lags' && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lags} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="lag" {...axisProps} />
              <YAxis {...axisProps} width={44} />
              <ReferenceLine y={0} stroke="rgb(var(--faint))" />
              <Tooltip content={({ active, payload, label }: any) => active && payload?.length ? (
                <div className="rounded-lg border border-line bg-surface/95 px-3 py-2 text-xs num">
                  <div className="font-mono text-muted mb-1">{label}</div>
                  <div>Bank Rate b = {payload[0].payload.bank} (p = {payload[0].payload.pb})</div>
                  <div>Card rate b = {payload[0].payload.card} (p = {payload[0].payload.pc})</div>
                </div>) : null} cursor={{ fill: 'rgb(var(--raised))' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="bank" name="Bank Rate coefficient" fill={C.s4} radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false} />
              <Bar dataKey="card" name="Card rate coefficient" fill={C.s1} radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {view === 'stability' && (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Test</th><th>Question</th><th>Statistic</th><th>p</th><th>Verdict</th></tr></thead>
            <tbody>{stability.map((s) => (
              <tr key={s.test}><td className="whitespace-nowrap font-semibold">{s.test}</td><td className="min-w-[12rem]">{s.q}</td><td>{s.stat}</td><td>{s.p}</td>
                <td><span className={`chip ${s.ok ? '!text-good !border-good/40' : '!text-warn !border-warn/40'}`}>{s.verdict}</span></td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {view === 'season' && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seasonal} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="m" {...axisProps} interval={0} />
              <YAxis {...axisProps} width={44} unit="%" />
              <ReferenceLine y={0.282}stroke="rgb(var(--muted))" strokeDasharray="4 3" label={{ value: 'sample mean', position: 'right', fill: 'rgb(var(--muted))', fontSize: 10 }} />
              <Tooltip content={<ChartTooltip fmt={(v: number) => `${v.toFixed(4)} %`} />} cursor={{ fill: 'rgb(var(--raised))' }} />
              <Bar dataKey="v" name="Mean growth" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {seasonal.map((s) => <Cell key={s.m} fill={s.m === 'Jan' ? C.s3 : C.s1} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartPanel>
  );
}

export function CreditCardExplorer() {
  const [tab, setTab] = useState<'trends' | 'periods' | 'model' | 'fit' | 'robust'>('trends');
  return (
    <div className="flex flex-col gap-4">
      <Tabs label="Dissertation chart views" value={tab} onChange={setTab} tabs={[
        { id: 'trends', label: 'Trends' }, { id: 'periods', label: 'Comparison' }, { id: 'model', label: 'Model results' },
        { id: 'fit', label: 'Fit & residuals' }, { id: 'robust', label: 'Robustness' },
      ]} />
      <div role="tabpanel">
        {tab === 'trends' && <TrendsView />}
        {tab === 'periods' && <PeriodsView />}
        {tab === 'model' && <ModelView />}
        {tab === 'fit' && <FitView />}
        {tab === 'robust' && <RobustView />}
      </div>
    </div>
  );
}

