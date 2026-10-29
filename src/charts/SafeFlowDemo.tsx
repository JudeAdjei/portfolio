import { useMemo, useState } from 'react';
import { Area, Bar, BarChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart } from 'recharts';
import { C, ChartPanel, ChartTooltip, axisProps, gridProps } from './common';
import { Note, Segmented } from '../components/ui';
import { IconReset } from '../components/Icons';

// A faithful re-implementation of SafeFlow's `generateSampleData` and `runMonteCarlo`
// (src/services/analyticsService.ts). Changes: a seeded RNG so results are repeatable,
// and dates measured relative to the simulation start (the app uses the system clock).
type Invoice = { due: number; amount: number; paid: boolean; daysLate?: number };

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleInvoices(seed: number): Invoice[] {
  const rnd = mulberry32(seed);
  const out: Invoice[] = [];
  for (let i = 0; i < 500; i++) {
    const issue = -Math.floor(rnd() * 365);            // issued within the last year (day 0 = simulation start)
    const due = issue + 30;                            // 30-day terms
    const paid = rnd() > 0.2;                          // ~80% already paid
    let daysLate: number | undefined;
    if (paid) daysLate = Math.floor(Math.max(-5, Math.pow(rnd(), 2) * 40 - 5)); // long right tail
    out.push({ due, amount: Math.floor(rnd() * 5000) + 100, paid, daysLate });
  }
  return out;
}

function simulate(inv: Invoice[], runs: number, horizon: number, shock: number, seed: number) {
  const rnd = mulberry32(seed + 1);
  const open = inv.filter((i) => !i.paid);
  const delays = inv.filter((i) => i.paid && i.daysLate !== undefined).map((i) => i.daysLate!);
  const mean = delays.reduce((a, b) => a + b, 0) / delays.length || 5;
  const sd = Math.sqrt(delays.reduce((a, d) => a + (d - mean) ** 2, 0) / delays.length) || 10;
  const byDay: number[][] = Array.from({ length: horizon + 1 }, () => []);
  for (let r = 0; r < runs; r++) {
    const daily = new Array(horizon + 1).fill(0);
    for (const o of open) {
      const u1 = rnd() || 1e-12, u2 = rnd();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); // Box–Muller
      const pay = o.due + Math.round((mean + z * sd) * shock);
      if (pay >= 0 && pay <= horizon) daily[pay] += o.amount;
    }
    let cum = 0;
    for (let d = 0; d <= horizon; d++) { cum += daily[d]; byDay[d].push(cum); }
  }
  const q = (a: number[], p: number) => a[Math.floor(runs * p)] ?? a[a.length - 1];
  const series = byDay.map((v, d) => { const s = [...v].sort((a, b) => a - b); return { day: d, p10: q(s, 0.1), p50: q(s, 0.5), p90: q(s, 0.9), band: [q(s, 0.1), q(s, 0.9)] as [number, number] }; });
  const final = byDay[horizon];
  const min = Math.min(...final), max = Math.max(...final);
  const w = (max - min) / 20 || 1;
  const hist = Array.from({ length: 20 }, (_, i) => {
    const lo = min + i * w, hi = lo + w;
    return { bin: `£${Math.round(lo / 1000)}k–${Math.round(hi / 1000)}k`, count: final.filter((v) => v >= lo && (i === 19 ? v <= hi : v < hi)).length };
  });
  return { series, hist, openCount: open.length, openValue: open.reduce((a, b) => a + b.amount, 0), mean, sd };
}

const gbp = (v: number) => `£${Math.round(v).toLocaleString('en-GB')}`;

export function SafeFlowDemo() {
  const [runs, setRuns] = useState<'500' | '1000' | '2000'>('1000');
  const [horizon, setHorizon] = useState<'30' | '60' | '90'>('90');
  const [shock, setShock] = useState(1);
  const [view, setView] = useState<'fan' | 'dist'>('fan');
  const [seed, setSeed] = useState(2026);
  const invoices = useMemo(() => sampleInvoices(seed), [seed]);
  const res = useMemo(() => simulate(invoices, +runs, +horizon, shock, seed), [invoices, runs, horizon, shock, seed]);
  const last = res.series[res.series.length - 1];
  const reset = () => { setRuns('1000'); setHorizon('90'); setShock(1); setView('fan'); setSeed(2026); };

  return (
    <ChartPanel
      title="Try the simulation engine"
      desc="This re-runs SafeFlow's own Monte Carlo logic in your browser. Each run draws a payment delay for every open invoice from the distribution of past delays, then adds up cash received day by day."
      controls={<button type="button" onClick={reset} className="btn btn-ghost !py-1.5 !text-xs"><IconReset className="h-4 w-4" /> Reset</button>}
      foot={<Note>Runs on 500 sample invoices from SafeFlow’s built-in demo dataset.</Note>}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Segmented label="Simulation runs" value={runs} onChange={setRuns} options={[{ id: '500', label: '500 runs' }, { id: '1000', label: '1,000' }, { id: '2000', label: '2,000' }]} />
          <Segmented label="Horizon" value={horizon} onChange={setHorizon} options={[{ id: '30', label: '30 days' }, { id: '60', label: '60' }, { id: '90', label: '90' }]} />
          <label htmlFor="sf-shock" className="flex items-center gap-2 text-xs text-muted">
            Late-payment shock ×{shock.toFixed(1)}
            <input id="sf-shock" type="range" min={0.5} max={3} step={0.1} value={shock} onChange={(e) => setShock(+e.target.value)} className="w-32 accent-[rgb(var(--accent))]" />
          </label>
          <button type="button" className="btn btn-ghost !py-1.5 !text-xs" onClick={() => setSeed((s) => s + 1)}>New sample</button>
          <Segmented label="Chart view" value={view} onChange={setView} options={[{ id: 'fan', label: 'Cash-in fan' }, { id: 'dist', label: 'Final-day distribution' }]} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[['Open invoices', `${res.openCount}`, gbp(res.openValue) + ' outstanding'], ['Median cash-in', gbp(last.p50), `by day ${horizon}`], ['Pessimistic (P10)', gbp(last.p10), '10% of runs fall below'], ['Optimistic (P90)', gbp(last.p90), '10% of runs exceed']].map(([l, v, s]) => (
            <div key={l} className="rounded-xl border border-line bg-bg/40 p-3 min-w-0"><div className="text-xs text-muted">{l}</div><div className="font-display text-xl font-bold num">{v}</div><div className="text-[11px] text-faint">{s}</div></div>
          ))}
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {view === 'fan' ? (
              <ComposedChart data={res.series} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="day" {...axisProps} tickFormatter={(d) => `D${d}`} minTickGap={24} />
                <YAxis {...axisProps} width={56} tickFormatter={(v) => `£${Math.round(v / 1000)}k`} />
                <Tooltip content={<ChartTooltip labelFmt={(d: number) => `Day ${d}`} fmt={(v: any) => (Array.isArray(v) ? `${gbp(v[0])} – ${gbp(v[1])}` : gbp(v))} />} />
                <Area dataKey="band" name="P10–P90 range" stroke="none" fill={C.s1} fillOpacity={0.22} isAnimationActive={false} />
                <Line dataKey="p50" name="Median (P50)" stroke={C.s1} strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line dataKey="p10" name="P10" stroke={C.s4} strokeWidth={1.5} strokeDasharray="4 3" dot={false} isAnimationActive={false} />
              </ComposedChart>
            ) : (
              <BarChart data={res.hist} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="bin" {...axisProps} interval={3} tick={{ fontSize: 10 }} />
                <YAxis {...axisProps} width={40} allowDecimals={false} />
                <Tooltip content={<ChartTooltip fmt={(v: number) => `${v} runs`} />} cursor={{ fill: 'rgb(var(--raised))' }} />
                <Bar dataKey="count" name="Runs" fill={C.s2} radius={[3, 3, 0, 0]} isAnimationActive={false} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted">Delay model fitted from paid invoices in this sample: mean {res.mean.toFixed(1)} days late, SD {res.sd.toFixed(1)} days, normal draws scaled by the shock factor.</p>
      </div>
    </ChartPanel>
  );
}

