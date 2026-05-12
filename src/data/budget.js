// ─────────────────────────────────────────────────────────────────────────────
// தமிழ்நாடு பட்ஜெட் தரவு — src/data/budget.js
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO UPDATE: Each year after budget presentation, update:
//   1. YEAR and SUMMARY fields
//   2. Each ministry's allocated / spent / released figures
//   3. Run: git add . && git commit -m "Update FY 2026-27 budget data" && git push
// ─────────────────────────────────────────────────────────────────────────────

export const YEAR = "2025–26";
export const LAST_UPDATED = "மே 2025"; // Update this when you refresh data

export const SUMMARY = {
  totalBudget:     274130,  // ₹ crore
  revenueReceipts: 332325,  // ₹ crore
  fiscalDeficit:     3.3,   // % of GSDP
  revenueDeficit:    1.2,   // % of GSDP
  totalDebt:       929000,  // ₹ crore (March 2026 projection)
  debtGSDP:          26.4,  // %
  debtRepayment:    47040,  // ₹ crore this year
  annualInterest:   63500,  // ₹ crore
  avgInterestRate:    7.2,  // %
  gsdp:           3520000,  // ₹ crore (estimated)
};

// accountabilityScore: 0-100 based on utilisation, CAG findings, transparency
// utilization: spent/allocated × 100
// redFlags: number of CAG/audit issues flagged
export const MINISTRIES = [
  {
    id: "finance",
    name: "நிதி & கடன் சேவை",
    english: "Finance & Debt Service",
    allocated: 45200, spent: 38400, released: 42000,
    schemes: 0, redFlags: 1, accountabilityScore: 72,
    color: "#C8963E", sector: "நிர்வாகம்",
    note: "கடன் திரும்பச் செலுத்துதல் மற்றும் வட்டி செலுத்துதல் — மாறாத கட்டாய செலவு",
  },
  {
    id: "education",
    name: "கல்வி",
    english: "School Education",
    allocated: 42300, spent: 35800, released: 40100,
    schemes: 12, redFlags: 2, accountabilityScore: 78,
    color: "#2E7D6B", sector: "சமூகம்",
    note: "CM காலை உணவு திட்டம் (₹600 கோடி) உட்பட. ஆசிரியர் காலி பணியிடங்கள் கவலை.",
  },
  {
    id: "social",
    name: "சமூக நலன்",
    english: "Social Welfare & Women's Rights",
    allocated: 24100, spent: 19200, released: 22500,
    schemes: 18, redFlags: 1, accountabilityScore: 81,
    color: "#5B4A8A", sector: "சமூகம்",
    note: "நலத் திட்டங்கள் நிதி விடுவிப்பு சிறப்பாக உள்ளது.",
  },
  {
    id: "pwd",
    name: "பொதுப் பணிகள்",
    english: "Public Works Department",
    allocated: 26500, spent: 18700, released: 21000,
    schemes: 8, redFlags: 4, accountabilityScore: 58,
    color: "#1B5FA8", sector: "உள்கட்டமைப்பு",
    note: "⚠️ CAG: ஒப்பந்தக்காரர் தாமதம், குறைந்த பயன்பாடு. 4 திட்டங்கள் காலாவதி.",
  },
  {
    id: "rural",
    name: "கிராம வளர்ச்சி",
    english: "Rural Development & Panchayat Raj",
    allocated: 20400, spent: 15600, released: 18900,
    schemes: 22, redFlags: 2, accountabilityScore: 74,
    color: "#4CAF82", sector: "வளர்ச்சி",
    note: "MGNREGS நிதி விடுவிப்பு மத்திய அரசு தாமதம் காரணமாக பாதிப்பு.",
  },
  {
    id: "health",
    name: "சுகாதாரம் & குடும்ப நலன்",
    english: "Health & Family Welfare",
    allocated: 22100, spent: 16900, released: 20400,
    schemes: 15, redFlags: 1, accountabilityScore: 80,
    color: "#C0392B", sector: "சமூகம்",
    note: "மருத்துவமனை உள்கட்டமைப்பு முன்னேற்றம் நல்லது. மருந்து கொள்முதல் வெளிப்படை தேவை.",
  },
  {
    id: "energy",
    name: "ஆற்றல் (TANGEDCO)",
    english: "Energy / TANGEDCO",
    allocated: 17300, spent: 14100, released: 16800,
    schemes: 4, redFlags: 5, accountabilityScore: 44,
    color: "#E67E22", sector: "உள்கட்டமைப்பு",
    note: "🔴 TANGEDCO நஷ்டம் ₹11,955 கோடி (2021-22). மாநில கடன் சுமையில் முக்கிய காரணம்.",
  },
  {
    id: "urban",
    name: "நகர்ப்புற வளர்ச்சி",
    english: "Municipal Administration & Urban Dev",
    allocated: 14200, spent: 9800,  released: 11500,
    schemes: 10, redFlags: 3, accountabilityScore: 62,
    color: "#2980B9", sector: "உள்கட்டமைப்பு",
    note: "⚠️ சென்னை வெள்ள நிவாரண திட்டங்கள் — நிதி பயன்பாடு 69% மட்டுமே.",
  },
  {
    id: "agri",
    name: "வேளாண்மை & தொடர்பு",
    english: "Agriculture & Allied Services",
    allocated: 16600, spent: 12400, released: 15200,
    schemes: 20, redFlags: 1, accountabilityScore: 76,
    color: "#27AE60", sector: "வேளாண்மை",
    note: "விவசாயி நலத் திட்டங்கள் பெரும்பாலும் சரியாக செயல்படுகின்றன.",
  },
  {
    id: "police",
    name: "காவல்துறை & உள்துறை",
    english: "Police & Home Affairs",
    allocated: 12100, spent: 10200, released: 11800,
    schemes: 3, redFlags: 0, accountabilityScore: 88,
    color: "#7F8C8D", sector: "நிர்வாகம்",
    note: "நிதி பயன்பாடு ஒப்பீட்டளவில் சிறப்பாக உள்ளது.",
  },
  {
    id: "water",
    name: "நீர் வளங்கள்",
    english: "Water Resources",
    allocated: 9500,  spent: 6200,  released: 7800,
    schemes: 6, redFlags: 2, accountabilityScore: 65,
    color: "#16A085", sector: "உள்கட்டமைப்பு",
    note: "சென்னை நீர் விநியோக திட்டம் ₹2,423 கோடி — செயல்படுத்தல் கண்காணிக்கப்படுகிறது.",
  },
  {
    id: "industries",
    name: "தொழில் & வணிகம்",
    english: "Industries & Commerce",
    allocated: 6100,  spent: 3900,  released: 5200,
    schemes: 7, redFlags: 1, accountabilityScore: 68,
    color: "#8E44AD", sector: "வளர்ச்சி",
    note: "TN Semiconductor Mission 2030 — ஆரம்ப கட்டம்.",
  },
  {
    id: "transport",
    name: "போக்குவரத்து (TNSTC)",
    english: "Transport / TNSTC",
    allocated: 7000,  spent: 4800,  released: 6100,
    schemes: 5, redFlags: 3, accountabilityScore: 55,
    color: "#D35400", sector: "உள்கட்டமைப்பு",
    note: "⚠️ TNSTC நஷ்டம் தொடர்கிறது. இலவச பேருந்து திட்டம் — நிதி ஆதாரம் அவசியம்.",
  },
  {
    id: "revenue",
    name: "வருவாய் & பேரிடர்",
    english: "Revenue & Disaster Management",
    allocated: 5100,  spent: 3700,  released: 4600,
    schemes: 4, redFlags: 1, accountabilityScore: 72,
    color: "#2C3E50", sector: "நிர்வாகம்",
    note: "பேரிடர் நிவாரண நிதி விடுவிப்பு பெரும்பாலும் தாமதமாகிறது.",
  },
  {
    id: "others",
    name: "மற்றவை",
    english: "Other Departments",
    allocated: 5630,  spent: 3200,  released: 4800,
    schemes: 9, redFlags: 0, accountabilityScore: 70,
    color: "#95A5A6", sector: "மற்றவை",
    note: "பல்வேறு சிறு துறைகள்.",
  },
];

export const SECTORS = {
  "சமூகம்":          "#2E7D6B",
  "உள்கட்டமைப்பு":  "#1B5FA8",
  "வளர்ச்சி":        "#8E44AD",
  "வேளாண்மை":       "#27AE60",
  "நிர்வாகம்":       "#C8963E",
  "மற்றவை":          "#95A5A6",
};
