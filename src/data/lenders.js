// ─────────────────────────────────────────────────────────────────────────────
// கடன் வழங்குனர் தரவு — src/data/lenders.js
// ─────────────────────────────────────────────────────────────────────────────

export const LENDERS = [
  { name:"சந்தை கடன்கள்",          english:"State Development Loans (SDL)", amount_cr:480000, pct:51.7, rate:7.8, interest_cr:37440, color:"#C8963E", icon:"🏦", who:"வங்கிகள், காப்பீட்டு நிறுவனங்கள் — பத்திரங்கள் வழியாக" },
  { name:"மத்திய அரசு கடன்கள்",    english:"Central Government Loans",       amount_cr:140000, pct:15.1, rate:6.5, interest_cr: 9100, color:"#2E7D6B", icon:"🏛️", who:"இந்திய அரசு நேரடியாக வழங்கும் கடன்கள்" },
  { name:"NABARD & நிதி நிறுவனங்கள்",english:"NABARD, LIC, NHB, REC",        amount_cr: 95000, pct:10.2, rate:7.5, interest_cr: 7125, color:"#1B5FA8", icon:"🏗️", who:"NABARD, LIC, NHB, REC — அரசு நிறுவனங்கள்" },
  { name:"சிறு சேமிப்பு நிதி",      english:"National Small Savings Fund",    amount_cr: 65000, pct: 7.0, rate:7.6, interest_cr: 4940, color:"#5B4A8A", icon:"📮", who:"அஞ்சலக சேமிப்பு, PPF, NSC — மக்கள் சேமிப்பு" },
  { name:"வருங்கால வைப்பு நிதி",    english:"Employee Provident Fund",        amount_cr: 42000, pct: 4.5, rate:7.1, interest_cr: 2982, color:"#27AE60", icon:"👷", who:"அரசு ஊழியர்களின் PF சேமிப்பு நிதி" },
  { name:"வெளிநாட்டு உதவி",         english:"World Bank / ADB",               amount_cr: 38000, pct: 4.1, rate:2.5, interest_cr:  950, color:"#16A085", icon:"🌐", who:"உலக வங்கி, ஆசிய வளர்ச்சி வங்கி — மானிய வட்டி" },
  { name:"மற்ற கடன்கள்",            english:"Others / WMA / OD",              amount_cr: 69000, pct: 7.4, rate:7.2, interest_cr: 4968, color:"#7F8C8D", icon:"📋", who:"RBI வழிகாட்டு, உள்நகர் வருவாய் கடன்கள்" },
];

export const ANNUAL_INTEREST_CR = 63500;
export const TOTAL_DEBT_CR      = 929000;
export const AVG_RATE           = 7.2;
