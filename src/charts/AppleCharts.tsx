import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { C, ChartPanel, ChartTooltip, axisProps, gridProps } from './common';
import { Figure, Segmented, Source, Tabs } from '../components/ui';
import priceImg from '../assets/aapl-prices.webp';
import fcImg from '../assets/aapl-forecast.webp';
import retImg from '../assets/aapl-returns.webp';

const accuracy = [
  { model: 'ARIMA(2,1,2) with drift', rmse: 22.98463, mape: 15.16809 },
  { model: 'ARIMA(1,1,1) with drift', rmse: 24.87277, mape: 16.48328 },
];
const ic = [
  ['ARIMA(2,1,2) with drift', '−2822.01', '−2821.84', '−2796.70'],
  ['ARIMA(2,1,1) with drift', '−2817.03', '−2456.18', '−2427.03'],
  ['ARIMA(0,1,1) with drift', '−2818.06', '−2818.02', '−2781.00'],
  ['ARIMA(1,1,0) with drift', '−2818.87', '−2818.82', '−2701.00'],
  ['ARIMA(3,1,1) with drift', '−2815.14', '−2814.97', '−2789.83'],
  ['ARIMA(1,1,3) with drift', '−2815.51', '−2815.34', '−2790.19'],
  ['ARIMA(2,1,0) with drift', '−2453.56', '−2453.48', '−2438.77'],
  ['ARIMA(1,1,1) with drift', '−2453.09', '−2453.01', '−2801.47'],
];
const sigma = [0.03111, 0.0316, 0.03206, 0.03249, 0.03288, 0.03325, 0.03359, 0.0339, 0.0342, 0.03447, 0.03473, 0.03497, 0.0352, 0.0354, 0.0356, 0.03578, 0.03595, 0.03611, 0.03626, 0.0364].map((s, i) => ({ h: `T+${i + 1}`, sigma: s }));
const garch = [
  { model: 'sGARCH(1,1)', params: 'μ 0.0053 (p 0.001) · α 0.0718 (p 0.029) · β 0.8683 (p < 0.001) · shape 7.26', issue: 'All key parameters significant; Ljung–Box and ARCH-LM on residuals pass', pass: true },
  { model: 'eGARCH(1,1)', params: 'α −0.0710 (p 0.285) · β 0.9163 · γ 0.1666 (p 0.008)', issue: 'α not significant; residual ACF shows correlation', pass: false },
  { model: 'GJR-GARCH(1,1)', params: 'α 0.0270 (p 0.392) · β 0.8082 · γ 0.1199 (p 0.110)', issue: 'α and γ not significant', pass: false },
  { model: 'apARCH(1,1)', params: 'α 0.0863 (p 0.028) · β 0.8195 · γ 0.4288 (p 0.112) · δ 1.576', issue: 'γ not significant', pass: false },
];

export function AppleExplorer() {
  const [tab, setTab] = useState<'select' | 'vol' | 'diag' | 'figs'>('select');
  const [metric, setMetric] = useState<'rmse' | 'mape'>('rmse');
  return (
    <div className="flex flex-col gap-4">
      <Tabs label="Apple chart views" value={tab} onChange={setTab} tabs={[
        { id: 'select', label: 'Model performance' }, { id: 'vol', label: 'Volatility' }, { id: 'diag', label: 'Diagnostics' }, { id: 'figs', label: 'Original figures' },
      ]} />
      {tab === 'select' && (
        <ChartPanel
          title="Hold-out forecast accuracy"
          desc="Models were fitted on the first 503 weeks (Box–Cox transformed, λ = −0.267) and scored on the last 20 weeks, back on the price scale. RMSE is in US dollars; MAPE is a percentage."
          controls={<Segmented label="Metric" value={metric} onChange={setMetric} options={[{ id: 'rmse', label: 'RMSE ($)' }, { id: 'mape', label: 'MAPE (%)' }]} />}
          foot={<Source>Group thesis, Table 4.7 (test set: 20 weekly observations). Information criteria from Table 4.6, as reported.</Source>}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accuracy} layout="vertical" margin={{ top: 4, right: 24, bottom: 0, left: 8 }}>
                  <CartesianGrid stroke="var(--grid)" horizontal={false} />
                  <XAxis type="number" {...axisProps} domain={[0, metric === 'rmse' ? 30 : 20]} />
                  <YAxis type="category" dataKey="model" width={168} {...axisProps} tick={{ fontSize: 11 }} />
                  <Tooltip content={<ChartTooltip fmt={(v: number) => (metric === 'rmse' ? `$${v.toFixed(5)}` : `${v.toFixed(5)} %`)} />} cursor={{ fill: 'rgb(var(--raised))' }} />
                  <Bar dataKey={metric} name={metric === 'rmse' ? 'RMSE' : 'MAPE'} radius={[0, 4, 4, 0]} maxBarSize={28} isAnimationActive={false}>
                    {accuracy.map((a, i) => <Cell key={a.model} fill={i === 0 ? C.s1 : 'rgb(var(--faint))'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Candidate model</th><th>AIC</th><th>AICc</th><th>BIC</th></tr></thead>
                <tbody>{ic.map((r) => <tr key={r[0]}><td className="whitespace-nowrap">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </ChartPanel>
      )}
      {tab === 'vol' && (
        <ChartPanel
          title="Forecast volatility from sGARCH(1,1)"
          desc="Conditional standard deviation of weekly log returns for the 20 weeks after March 2023. It rises steadily from 3.1% to 3.6% per week as volatility reverts toward its long-run level."
          foot={<Source>Group thesis, Tables 4.11–4.17 and 4.19. Mean model ARMA(0,0), Student-t errors. Variance equation σ²ₜ = 0.000089 + 0.0718 ε²ₜ₋₁ + 0.8683 σ²ₜ₋₁.</Source>}
        >
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sigma} margin={{ top: 8, right: 12, bottom: 0, left: -4 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="h" {...axisProps} interval={3} />
                  <YAxis {...axisProps} width={52} domain={[0.03, 0.037]} tickFormatter={(v) => `${(v * 100).toFixed(1)}%`} />
                  <Tooltip content={<ChartTooltip fmt={(v: number) => `σ = ${v.toFixed(5)} (${(v * 100).toFixed(2)}% per week)`} />} />
                  <Line dataKey="sigma" name="Forecast σ" stroke={C.s2} strokeWidth={2} dot={{ r: 3, fill: 'var(--s2)', stroke: 'rgb(var(--surface))', strokeWidth: 1.5 }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex flex-col gap-2">
              {garch.map((g) => (
                <li key={g.model} className="rounded-lg border border-line p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{g.model}</span>
                    <span className={`chip ${g.pass ? '!text-good !border-good/40' : '!text-warn !border-warn/40'}`}>{g.pass ? 'Selected' : 'Rejected'}</span>
                  </div>
                  <p className="mt-1 text-xs font-mono text-muted break-words">{g.params}</p>
                  <p className="mt-1 text-xs text-muted">{g.issue}</p>
                </li>
              ))}
            </ul>
          </div>
        </ChartPanel>
      )}
      {tab === 'diag' && (
        <ChartPanel title="Stationarity and residual checks" desc="Prices trend upward (Mann–Kendall τ = 0.866, p < 0.001) and are non-stationary in levels; one difference fixes it. The selected ARIMA's residuals have zero mean and no autocorrelation, but are not normal." foot={<Source>Group thesis, Tables 4.2, 4.4, 4.5, 4.8 and 4.10.</Source>}>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Unit-root test</th><th>Level p</th><th>1st difference p</th></tr></thead>
                <tbody>
                  <tr><td>ADF (H₀: unit root)</td><td>0.4536</td><td>0.01</td></tr>
                  <tr><td>Phillips–Perron (H₀: unit root)</td><td>0.361</td><td>0.01</td></tr>
                  <tr><td>KPSS (H₀: stationary)</td><td>0.01</td><td>0.10</td></tr>
                </tbody>
              </table>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Check on ARIMA(2,1,2) residuals</th><th>p</th><th>Reading</th></tr></thead>
                <tbody>
                  <tr><td>One-sample t-test (mean = 0)</td><td>0.9921</td><td><span className="chip !text-good !border-good/40">Pass</span></td></tr>
                  <tr><td>Ljung–Box</td><td>0.8453</td><td><span className="chip !text-good !border-good/40">Pass</span></td></tr>
                  <tr><td>Shapiro–Wilk (normality)</td><td>3.3e−9</td><td><span className="chip !text-warn !border-warn/40">Non-normal</span></td></tr>
                  <tr><td>ARCH-LM on prices (χ² = 505.6, 12 df)</td><td>&lt; 2.2e−16</td><td><span className="chip !text-warn !border-warn/40">ARCH effects</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </ChartPanel>
      )}
      {tab === 'figs' && (
        <div className="grid gap-4 md:grid-cols-3">
          <Figure src={priceImg} alt="Weekly Apple opening prices 2013–2023" caption="Fig 4.1 · Weekly opening price, 18 Mar 2013 – 16 Mar 2023 (523 weeks)." />
          <Figure src={retImg} alt="Weekly log returns" caption="Fig 4.9 · Weekly log returns used for the GARCH models." />
          <Figure src={fcImg} alt="ARIMA(2,1,2) 20-week forecast with 80% and 95% intervals" caption="Fig 4.16 · 20-week ARIMA(2,1,2) forecast with 80% and 95% intervals." />
        </div>
      )}
    </div>
  );
}
