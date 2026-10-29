# Jude Adjei · Data Portfolio

A React + TypeScript + Tailwind + Recharts portfolio and link hub. Every chart uses project data or published results; anything illustrative is labelled.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production site in dist/
npm run preview    # serve dist/ locally
```

Requires Node 18 or newer.

## Deploy (free tier)

The site uses hash-based routes (`/#/projects`), so it works on any static host with no rewrite rules.

**Netlify (recommended)**
1. Push this folder to a GitHub repository (for example `github.com/J2ju/portfolio`).
2. In Netlify: *Add new site → Import from Git → pick the repo*. `netlify.toml` already sets the build command (`npm run build`) and publish folder (`dist`).
3. Or, without Git: run `npm run build` and drag the `dist` folder onto app.netlify.com/drop.

**Vercel**: import the repo; framework preset “Vite”; output directory `dist`.

**GitHub Pages**: run `npm run build` and publish the `dist` folder (the build uses relative paths, so it works under `/<repo-name>/`).

### Contact form (Netlify Forms)
The form posts to Netlify Forms, so messages work as soon as the site is deployed on Netlify, with no extra account.
1. Deploy to Netlify (above).
2. In Netlify: *Site configuration → Forms → Form notifications → Add notification → Email notification*, and enter your email address.
3. Every message a visitor sends is then emailed to you and listed under *Forms* in Netlify.

On another host, set `VITE_FORM_ENDPOINT` to a JSON form endpoint such as Formspree instead (see `.env.example`).

### Custom domain
Buy a domain (for example `judeadjei.co.uk`), then in Netlify go to *Domain management → Add a domain* and follow the DNS instructions (an `A`/`ALIAS` record or Netlify DNS). HTTPS is issued automatically.

## Updating content

| What | Where |
|---|---|
| Name, headline, bio, email, links (LinkedIn, GitHub, blog, certificate URL) | `src/content/site.ts` |
| Skills, timeline, certificates, data-engineering evidence | `src/content/site.ts` |
| Project cards, role ordering, filters | `src/content/projects.ts` |
| Case-study text | `src/pages/caseStudies.tsx` |
| Charts | `src/charts/*.tsx` |
| CV file | replace `public/cv/Jude-Adjei-CV.pdf` (keep the name, or update `links.cvPdf`) |
| Images | `src/assets/` |

**Add a project**
1. Add an object to `projects` in `src/content/projects.ts` (slug, title, problem, one verified finding, tech, categories, roles, rank).
2. Optionally add a case-study component in `src/pages/caseStudies.tsx` and register it under the same slug.
3. Add a GitHub or demo link in its `links` array only when the link really exists.

**Update the dissertation charts**
The data lives in `src/data/creditCard.json` (month, balances, growth, rate changes, CPI, fitted values and residuals from Model 1). Regenerate it from the regression-ready dataset if the data are revised.

## Data provenance
- UK credit card data: the regression-ready dataset deposited with the dissertation (Bank of England IADB and ONS series). Model 1 was re-estimated from it and matches dissertation Table 4.5 to four decimals; fitted values and residuals come from that re-estimation.
- Model results, diagnostics and tables: the dissertation (Tables 4.1–4.14).
- Apple: the KNUST group thesis (2023) tables and figures. The weekly price file was not supplied, so the price figures are static images.
- SafeFlow: the app's own source code; the demo uses its synthetic sample-invoice generator.
- Excel project: the BU7045 workbook.
- Pep's Restaurant and Royal Mail: the CV only.
