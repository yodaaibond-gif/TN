# TN Budget Watch · தமிழ்நாடு பட்ஜெட் கண்காணிப்பு

**Public accountability tracker for Tamil Nadu government finances — open source, Tamil language, free to host.**

> பணம் எங்கே போகிறது? வீணடிப்பு எங்கே? CAG என்ன சொல்கிறது?

**Live site:** `https://YOUR-USERNAME.github.io/tn-budget/`

---

## What this tracks

| Feature | Description |
|---------|-------------|
| 👁️ Ministry Watch | All 15 departments — allocated vs spent vs utilisation % |
| 🚩 Red Flags | CAG audit findings with severity, status, source links |
| 🗑️ Waste Tracker | PSU losses, unspent funds, failed schemes |
| 🔴 Interest Clock | ₹20,135/second ticking live — ₹63,500 Cr/year |
| 💰 Debt Composition | 7 lender types, rates, interest per second each |
| ⚡ AI Analyst | Ask anything in Tamil — powered by Claude |
| 🔗 Sources | Every number linked to its government source |

---

## Deploy to GitHub Pages (Free, 6 steps)

### 1. Create repository
- Go to github.com → **New repository**
- Name it **`tn-budget`** (must match `vite.config.js base`)
- Set **Public** → Create

### 2. Open the project
```bash
cd tn-budget
```

### 3. Push to GitHub
```bash
git init
git add .
git commit -m "Launch TN Budget Watch"
git remote add origin https://github.com/YOUR-USERNAME/tn-budget.git
git push -u origin main
```

### 4. Enable GitHub Pages
- Repository → **Settings** → **Pages**
- Source: **GitHub Actions** → Save

### 5. Wait 2 minutes
Watch the **Actions** tab — green tick = deployed ✅

### 6. Visit your site
```
https://YOUR-USERNAME.github.io/tn-budget/
```

Every `git push` auto-deploys. No manual steps needed ever again.

---

## Update data (no coding needed)

All data is in `src/data/` — plain JavaScript objects anyone can edit:

| File | What to update |
|------|---------------|
| `budget.js` | Ministry allocations each year |
| `audit.js` | New CAG findings, PSU losses |
| `lenders.js` | Debt composition and rates |
| `sources.js` | Reference URLs |

See [CONTRIBUTING.md](CONTRIBUTING.md) for step-by-step instructions.

---

## Local development

```bash
npm install
npm run dev
# Open http://localhost:5173/tn-budget/
```

---

## Project structure

```
tn-budget/
├── src/
│   ├── data/
│   │   ├── budget.js       ← Ministry data (update annually)
│   │   ├── audit.js        ← CAG findings (update on new reports)
│   │   ├── lenders.js      ← Debt composition
│   │   └── sources.js      ← Reference links
│   ├── App.jsx             ← Full UI (rarely needs editing)
│   └── main.jsx            ← React entry point
├── .github/workflows/
│   └── deploy.yml          ← Auto-deploy on push
├── public/favicon.svg
├── index.html
├── vite.config.js          ← ⚠️ Set base to your repo name
└── package.json
```

---

## Data sources

| Source | URL |
|--------|-----|
| TN Budget 2025-26 | https://tnbudget.tn.gov.in/ |
| PRS India | https://prsindia.org/budgets/states/tamil-nadu-budget-analysis-2025-26 |
| CAG Reports | https://cag.gov.in/en/audit-report?page=1&state=Tamil+Nadu |
| NITI Aayog | https://www.niti.gov.in/sites/default/files/2025-03/Macro-and-Fiscal-Landscape-of-the-State-of-Tamil-Nadu.pdf |
| RBI State Finances | https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=State+Finances+%3a+A+Study+of+Budgets |
| 16th Finance Commission | https://fincomindia.nic.in/asset/doc/commission-reports/16th-FC/studies/evaluation/Tamil%20Nadu.pdf |

---

## Disclaimer

Expenditure figures are estimates based on historical patterns. CAG findings sourced from official reports. This is an independent civic project — not affiliated with the Government of Tamil Nadu.

*Built with React + Vite + Recharts. Deployed free on GitHub Pages.*
