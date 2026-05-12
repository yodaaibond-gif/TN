# தரவை புதுப்பிப்பது எப்படி / How to Contribute

This project is open-source. Anyone can update the data — no coding knowledge needed for data updates.

## 📁 Only 4 files contain all data

```
src/data/
  budget.js   ← Ministry allocations, spending, scores
  audit.js    ← CAG findings, PSU losses, unspent funds
  lenders.js  ← Who TN borrows from, at what rate
  sources.js  ← Reference links
```

---

## 🔄 Annual Budget Update (every March)

When TN presents the new budget, update `src/data/budget.js`:

1. Change `YEAR` and `LAST_UPDATED`
2. Update `SUMMARY` fields (totalBudget, revenueReceipts, etc.)
3. Update each ministry's `allocated` and `released` values
4. Update `accountabilityScore` based on previous year's utilisation

```js
// Example update for Education ministry
{
  id: "education",
  name: "கல்வி",
  allocated: 45000,   // ← new year figure
  spent: 38000,       // ← update when actuals available
  released: 43000,
  ...
}
```

---

## 🚩 Adding a new CAG Finding

When CAG releases a new audit report, add to `src/data/audit.js`:

```js
{
  id: "cag-009",                    // next sequential number
  ministry: "துறை பெயர்",
  ministryId: "ministry_id",        // matches id in budget.js
  title: "சுருக்கமான தலைப்பு",
  detail: "விரிவான விளக்கம்...",
  amount_cr: 500,                   // amount flagged in crore
  year: "2024-25",
  severity: "high",                 // critical / high / medium / low
  status: "open",                   // open / under_review / resolved
  source: "CAG Report Name",
  sourceUrl: "https://cag.gov.in/...",
},
```

---

## 📤 How to submit your update

### Option A — GitHub website (no terminal needed)
1. Go to the file on GitHub (e.g. `src/data/budget.js`)
2. Click the ✏️ pencil icon (Edit)
3. Make your changes
4. Click **Propose changes** → **Create Pull Request**
5. Describe what you changed and why (paste source URL)

### Option B — GitHub Desktop
1. Fork the repository
2. Open in GitHub Desktop
3. Edit the file locally
4. Commit → Push → Create Pull Request

---

## ✅ What makes a good contribution

- **Source it** — always paste the URL where you found the number
- **One change at a time** — one PR for one update makes review easier
- **Note the date** — when was the figure published?
- **Tamil or English** — both are welcome in PR descriptions

---

## 🙋 Questions?

Open a GitHub Issue and ask. All questions are welcome.
