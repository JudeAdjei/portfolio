import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { CaseSection } from './ProjectDetail';
import { CreditCardExplorer } from '../charts/CreditCardCharts';
import { AppleExplorer } from '../charts/AppleCharts';
import { SafeFlowDemo } from '../charts/SafeFlowDemo';
import { ExcelExplorer } from '../charts/ExcelCharts';
import { ExternalCta, Figure, Kpi, Note } from '../components/ui';
import { IconArrow } from '../components/Icons';
import balancesImg from '../assets/diss-balances.webp';
import explImg from '../assets/diss-explanatory.webp';
import betasImg from '../assets/diss-betas.webp';
import cusumImg from '../assets/diss-cusum.webp';
import safeImg from '../assets/safeflow-landing.webp';
import { links } from '../content/site';

const Explore = ({ children }: { children: React.ReactNode }) => (
  <section className="border-t border-line/70 py-10">
    <p className="eyebrow mb-2">Interactive</p>
    <h2 className="mb-5 text-2xl font-bold">Explore the results</h2>
    {children}
  </section>
);

// ── Project 1 ─────────────────────────────────────────────────────────────────
function Dissertation() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi value="315" label="months modelled" sub="Mar 2000 – May 2026" />
        <Kpi value="−0.240" label="β, claimant count" sub="strongest determinant, p < 0.0001" />
        <Kpi value="Last" label="card interest rate" sub="ranked 4th of 4 in both models" />
        <Kpi value="16.6%" label="variation explained" sub="Model 2 R²; Model 1: 12.4%" />
      </div>
      <Explore><CreditCardExplorer /></Explore>

      <CaseSection n="01" title="The problem">
        <p>UK card balances are growing at over 12% a year while the share of balances paying interest falls. Account-level studies say borrowers respond strongly to the rate they pay; another literature documents sticky prices and switching costs that would hide that response in national totals.</p>
        <p><strong>Research question:</strong> to what extent do macroeconomic factors explain monthly variation in the growth of UK credit card borrowing? It had not been tested on UK aggregate data at a monthly frequency. The answer matters to lenders, to the FCA's work on persistent debt and to the Bank of England: a price effect and an income effect call for different remedies.</p>
      </CaseSection>

      <CaseSection n="02" title="Data">
        <p>Six published monthly series, merged on calendar month. Raw file January 2000 to July 2026; after differencing, lagging and the end-of-sample publication lag, the estimation sample is 315 months (March 2000 – May 2026).</p>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Series</th><th>Code</th><th>Publisher</th><th>Used as</th></tr></thead>
            <tbody>
              <tr><td>Card balances outstanding (£m, SA)</td><td className="font-mono">LPMVZRJ</td><td>Bank of England</td><td>100 × Δln → dependent variable</td></tr>
              <tr><td>Representative card interest rate</td><td className="font-mono">IUMCCTL</td><td>Bank of England</td><td>First difference</td></tr>
              <tr><td>Bank Rate, monthly average</td><td className="font-mono">IUMABEDR</td><td>Bank of England</td><td>First difference</td></tr>
              <tr><td>CPI annual inflation</td><td className="font-mono">D7G7</td><td>ONS (MM23)</td><td>Level (already a rate of change)</td></tr>
              <tr><td>Unemployment rate, 16+ (SA)</td><td className="font-mono">MGSX</td><td>ONS (LMS)</td><td>First difference · Model 1</td></tr>
              <tr><td>Claimant count (000s, SA)</td><td className="font-mono">BCJD</td><td>ONS (UNEM)</td><td>First difference · Model 2</td></tr>
            </tbody>
          </table>
        </div>
      </CaseSection>

      <CaseSection n="03" title="Preparation & quality checks">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Loaded the two-row-header file (names, then publisher codes), parsed dates and coerced every series to numeric so bad values surface as missing rather than failing silently.</li>
          <li>Checked for missing values, duplicate months and implausible observations; none were found after merging.</li>
          <li>Built the dependent variable as a log difference and cross-checked it against a plain percentage change.</li>
          <li>Flagged two extreme months (Feb 2003: −8.5%, Jan 2010: +16.0%). They were kept and tested, not silently dropped; a 16% one-month jump in national balances is most likely a reporting artefact.</li>
          <li>Dated the three crisis windows from documented events, never from where the model fitted badly.</li>
        </ul>
      </CaseSection>

      <CaseSection n="04" title="Exploratory analysis">
        <p>Balances trend persistently, so they cannot be modelled in levels. Growth fluctuates around 0.28% a month (about 3.4% a year) with heavy tails (kurtosis 49.8), and the pandemic shows as a cluster of sharp falls.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Figure src={balancesImg} alt="Credit card balances 2000–2026 with crisis periods shaded" caption="Fig 4.1 · Balances outstanding in £bn, with the financial crisis, COVID-19 and cost-of-living windows shaded." />
          <Figure src={explImg} alt="Card rate, Bank Rate, CPI inflation and unemployment rate over time" caption="Fig 4.3 · The four explanatory variables in levels. The card rate barely moves for long stretches while Bank Rate crosses almost its whole range." />
        </div>
      </CaseSection>

      <CaseSection n="05" title="Modelling approach">
        <p>An explanatory (not predictive) regression estimated by OLS, with Newey–West standard errors (12 lags) because monthly financial errors are neither equal-sized nor independent:</p>
        <pre className="card overflow-x-auto p-4 font-mono text-xs text-fg">{`ΔlnCC(t) = α + β1·ΔAPR(t) + β2·ΔBankRate(t) + β3·CPI(t) + β4·ΔLabour(t)
          + γ1·GFC(t) + γ2·COVID(t) + γ3·COL(t) + β5·ΔlnCC(t−1) + ε(t)`}</pre>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Stationarity first:</strong> ADF tests on every series; levels fail, differences pass (e.g. dependent variable ADF −3.918, p = 0.002).</li>
          <li><strong>Multicollinearity:</strong> no correlation above 0.33; highest VIF 3.10 (CPI).</li>
          <li><strong>Two labour-market measures:</strong> Model 1 uses the LFS unemployment rate, Model 2 the claimant count. Both are reported so the effect of that choice is visible.</li>
          <li><strong>Ranking:</strong> standardised coefficients put the four determinants on a common scale.</li>
        </ul>
      </CaseSection>

      <CaseSection n="06" title="Diagnostics & robustness">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Residuals: Durbin–Watson 1.982, Ljung–Box(12) p = 0.362, Breusch–Pagan p = 0.455. Jarque–Bera fails, driven by the two extreme months.</li>
          <li>Delayed response: both rates at lags 0–3, tested jointly. No delayed effect for either.</li>
          <li>Stability: Chow tests reject at Sep 2008, Mar 2020 and Oct 2021 because the level shifts; the slope-interaction test (p = 0.286) and CUSUM (p = 0.367) do not.</li>
          <li>Seasonality: some residual seasonality survives adjustment (p = 0.046), but the apparent January spike is one unusual year.</li>
        </ul>
        <div className="grid gap-4 md:grid-cols-2">
          <Figure src={cusumImg} alt="CUSUM of OLS residuals within 5% bands" caption="Fig 4.5 · CUSUM stays inside the 5% bands: no evidence of parameter drift." />
          <Figure src={betasImg} alt="Standardised coefficients under the two labour market measures" caption="Fig 4.7 · Standardised coefficients under both labour-market measures." />
        </div>
      </CaseSection>

      <CaseSection n="07" title="Findings">
        <ol className="list-decimal pl-5 space-y-1.5">
          <li><strong>Labour market conditions were the strongest determinant</strong> once measured by the claimant count (β = −0.240, p &lt; 0.0001): a rise of 100,000 claimants is associated with monthly growth about 0.54 percentage points lower.</li>
          <li><strong>Inflation ranked second and was negative</strong> (Model 2: β = −0.154, p = 0.064; Model 1: p = 0.020), consistent with precautionary restraint rather than borrowing to cover higher prices.</li>
          <li><strong>The price of card credit ranked last in both models</strong> (p = 0.949 and 0.836), the most robust result of the study.</li>
          <li><strong>No delayed response</strong> to either rate over one to three months.</li>
          <li><strong>Relationships held through all three crises</strong>; what changed was the level of borrowing (COVID-19 months averaged about 2 points lower growth).</li>
        </ol>
      </CaseSection>

      <CaseSection n="08" title="Why it matters">
        <p><strong>For policymakers:</strong> Bank Rate crossed almost its whole range in this period without the card rate following, and no price association is detectable. Competition and disclosure remedies look better matched to the cost of card credit than the policy rate.</p>
        <p><strong>For lenders and risk teams:</strong> relationships calibrated before a shock did not need re-specifying after it; the labour-market signal is the most directly usable input for monitoring card growth.</p>
      </CaseSection>
    </>
  );
}

// ── Project 2 ─────────────────────────────────────────────────────────────────
function SafeFlow() {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <figure className="card overflow-hidden">
          <img src={safeImg} alt="SafeFlow landing page" className="w-full h-auto" />
          <figcaption className="p-3 text-xs text-muted">Screenshot of the running app in Google AI Studio.</figcaption>
        </figure>
        <div className="flex flex-col gap-3 text-muted">
          <p><strong className="text-fg">What it is:</strong> a cash-flow and risk analytics platform for UK micro-SMEs. Instead of a single forecast, it shows a range of outcomes for when open invoices will be paid, using a Monte Carlo engine.</p>
          <p><strong className="text-fg">How it was built:</strong> designed and directed by Jude in Google AI Studio, with Gemini as an AI coding assistant, as a React + TypeScript app.</p>
          <ExternalCta href={links.safeflow}>Open SafeFlow in Google AI Studio</ExternalCta>
        </div>
      </div>
      <Explore><SafeFlowDemo /></Explore>
      <CaseSection n="01" title="Problem & objective">
        <p>Small firms fail on timing more than on profit: invoices are issued, but customers pay late and unpredictably. The objective was a tool that turns an invoice ledger into a probabilistic view of cash coming in, with stress scenarios a manager can test.</p>
      </CaseSection>
      <CaseSection n="02" title="Data">
        <p>Invoice-level records with ID, customer, issue date, due date, payment date, amount, status and days late. Users can upload their own CSV; the app also ships a generator of 500 synthetic invoices (30-day terms, about 80% paid, a long right tail of lateness). No real client data is used in this portfolio.</p>
      </CaseSection>
      <CaseSection n="03" title="Method">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Estimate the mean and standard deviation of days late from invoices already paid.</li>
          <li>For each of 1,000 runs, draw a delay for every open invoice (normal via Box–Muller), scale it by a shock factor, and place the cash on its predicted day.</li>
          <li>Accumulate cash day by day over a 90-day horizon and report the 10th, 50th and 90th percentiles, plus a histogram of final-day outcomes.</li>
          <li>Scenario tab: sliders and manual inputs for late-payment increase, default risk and economic downturn, compared against the baseline over 60 days, with a liquidity status and a reserve-threshold check (from the app’s change log).</li>
        </ul>
      </CaseSection>
      <CaseSection n="04" title="Features">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Recharts dashboards; risk metrics typed as VaR (95%), shortfall probability and a liquidity score.</li>
          <li>CSV import (PapaParse) and exports to PDF, PowerPoint, Excel and CSV.</li>
          <li>Gemini-powered narrative insights; free and Pro tiers with gated report downloads; light and dark themes; zoom controls.</li>
        </ul>
      </CaseSection>
    </>
  );
}

// ── Project 3 ─────────────────────────────────────────────────────────────────
function Apple() {
  return (
    <>
      <Note>Group project with Asare Boatemaa Rejoice, Ofori Harrison and Owusu Acheampong Bekoe Benjamin · KNUST Department of Statistics and Actuarial Science · supervised by Ms Wilhemina Adoma Pels, 2023.</Note>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi value="523" label="weekly prices" sub="18 Mar 2013 – 16 Mar 2023" />
        <Kpi value="$22.98" label="RMSE, ARIMA(2,1,2)" sub="20-week hold-out" />
        <Kpi value="15.17%" label="MAPE, ARIMA(2,1,2)" sub="vs 16.48% for ARIMA(1,1,1)" />
        <Kpi value="sGARCH(1,1)" label="volatility model" sub="only variant passing all checks" />
      </div>
      <Explore><AppleExplorer /></Explore>
      <CaseSection n="01" title="Question">
        <p>Forecast Apple’s weekly opening price for 20 weeks, measure the risk around that forecast, and translate prices into market capitalisation. Data: weekly opening prices from Yahoo Finance, analysed in R.</p>
      </CaseSection>
      <CaseSection n="02" title="Method">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Trend (Mann–Kendall), seasonality (Welch, isSeasonal) and rolling-variance checks.</li>
          <li>94/6 train–test split (503 / 20 weeks) to avoid leakage; Box–Cox transform (λ = −0.267) to stabilise variance.</li>
          <li>ADF, KPSS and Phillips–Perron tests; one difference achieves stationarity.</li>
          <li>Candidates from ACF/PACF and an exhaustive auto.arima search; selection on AIC/AICc and hold-out RMSE and MAPE.</li>
          <li>ARCH-LM confirms time-varying variance; four GARCH(1,1) variants fitted to log returns with Student-t errors.</li>
        </ul>
      </CaseSection>
      <CaseSection n="03" title="Findings">
        <p>ARIMA(2,1,2) with drift had the lowest AIC and the best hold-out accuracy; its residuals pass the zero-mean and Ljung–Box checks but are not normal. sGARCH(1,1) was the only volatility model with significant parameters and clean residual diagnostics, and it forecasts weekly volatility rising from 3.1% to 3.6%.</p>
      </CaseSection>
    </>
  );
}

// ── Project 4 ─────────────────────────────────────────────────────────────────
function Excel() {
  return (
    <>
      <Explore><ExcelExplorer /></Explore>
      <CaseSection n="01" title="Context">
        <p>A timed assessment for the MSc module BU7045 Quantitative Techniques for Financial Analysis, answered entirely in Excel. It shows the spreadsheet side of the toolkit: simulation with data tables, NPV and IRR, cost–volume–profit analysis, payroll and commission calculations, live FX pulls with STOCKHISTORY, and Analysis ToolPak statistics.</p>
      </CaseSection>
      <CaseSection n="02" title="What it demonstrates">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Risk appraisal:</strong> turning a single NPV into a distribution and reading the risk of loss from it.</li>
          <li><strong>Break-even thinking:</strong> the same logic behind the dynamic break-even reports described at Pep’s Restaurant.</li>
          <li><strong>Inference:</strong> choosing the right test (equal vs unequal variances) before comparing means.</li>
        </ul>
      </CaseSection>
    </>
  );
}

// ── Project 5 ─────────────────────────────────────────────────────────────────
function Peps() {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Kpi value="60%" label="sales revenue performance increase" sub="driven by daily sales-trend analysis" />
        <Kpi value="Nov 2024 – Oct 2025" label="Sales Analyst" sub="Pep’s Restaurant, Bogoso, Ghana" />
        <Kpi value="Branch" label="comparisons" sub="pricing, staffing, cost control" />
      </div>
      <CaseSection n="01" title="Business question">
        <p>Which branches and trading patterns drive revenue, and how can management see quickly whether a branch is covering its costs?</p>
      </CaseSection>
      <CaseSection n="02" title="What I did">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Identified and analysed daily sales trends.</li>
          <li>Developed dynamic break-even reports and a dashboard so management could make decisions faster.</li>
          <li>Built dynamic reports comparing branch performance on pricing, staffing and cost control.</li>
        </ul>
      </CaseSection>
      <CaseSection n="03" title="KPIs in scope">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>KPI</th><th>Question it answers</th></tr></thead>
            <tbody>
              <tr><td>Daily revenue & trend</td><td>Are sales rising or falling, and on which days?</td></tr>
              <tr><td>Revenue by branch</td><td>Which branches lead or lag?</td></tr>
              <tr><td>Contribution & break-even point</td><td>How much must each branch sell to cover fixed costs?</td></tr>
              <tr><td>Staffing cost vs sales</td><td>Is staffing matched to demand?</td></tr>
              <tr><td>Pricing vs volume</td><td>Did price changes help or hurt revenue?</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm">Try the same break-even method in the <Link to="/projects/excel-quant-techniques" className="text-accent underline underline-offset-2">interactive break-even model</Link>.</p>
      </CaseSection>
    </>
  );
}

// ── Project 6 ─────────────────────────────────────────────────────────────────
function RoyalMail() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Kpi value="500+" label="parcels sorted per hour" sub="sustained throughput" />
        <Kpi value="80%" label="improvement in operational rate flow" sub="overall line performance" />
        <Kpi value="27%" label="reduction in total lost time" sub="label verification & destination checks" />
        <Kpi value="9%" label="fewer chute blockages" sub="quick response to bottlenecks" />
        <Kpi value="18%" label="less starvation time" sub="quick response to bottlenecks" />
        <Kpi value="200+" label="unaccounted parcels escalated per shift" sub="for traceability" />
      </div>
      <CaseSection n="01" title="The work">
        <p>Mail Sorter at Royal Mail since October 2025, working alongside the MSc. The job is a live throughput system: parcels arrive, are verified, sorted to chutes and dispatched, and every exception costs time downstream.</p>
      </CaseSection>
      <CaseSection n="02" title="Where analytical thinking shows">
        <div className="flex flex-wrap items-center gap-2" aria-label="Process diagram">
          {['Induct', 'Verify label & destination', 'Sort to chute', 'Watch for blockage / starvation', 'Escalate exceptions'].map((s, i, a) => (
            <span key={s} className="flex items-center gap-2"><span className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-fg">{s}</span>{i < a.length - 1 && <IconArrow className="h-4 w-4 text-accent" />}</span>
          ))}
        </div>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Throughput:</strong> holding a sustained rate is about removing variance, not working faster.</li>
          <li><strong>Bottlenecks:</strong> blockage (too much arriving) and starvation (nothing arriving) are opposite failures of the same flow.</li>
          <li><strong>Exceptions:</strong> catching unaccounted items at the point they appear is cheaper than tracing them later, the same principle as data validation at ingestion.</li>
        </ul>
      </CaseSection>
    </>
  );
}

export const caseStudies: Record<string, ComponentType> = {
  'uk-credit-card-borrowing': Dissertation,
  safeflow: SafeFlow,
  'apple-forecasting': Apple,
  'excel-quant-techniques': Excel,
  'peps-sales-performance': Peps,
  'royal-mail-operations': RoyalMail,
};
