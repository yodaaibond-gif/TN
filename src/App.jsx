import { useState, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { YEAR, LAST_UPDATED, SUMMARY, MINISTRIES, SECTORS } from "./data/budget.js";
import { CAG_FINDINGS, PSU_LOSSES, UNSPENT_FUNDS } from "./data/audit.js";
import { LENDERS, ANNUAL_INTEREST_CR, TOTAL_DEBT_CR, AVG_RATE } from "./data/lenders.js";
import { SOURCES } from "./data/sources.js";

// ─── வட்டி கணக்கீடு ────────────────────────────────────────────────────────
const PER_SEC = (ANNUAL_INTEREST_CR * 1e7) / (365 * 24 * 3600);
const totalRedFlags   = MINISTRIES.reduce((a, m) => a + m.redFlags, 0);
const totalUnspent    = MINISTRIES.reduce((a, m) => a + (m.allocated - m.spent), 0);
const totalAllocated  = MINISTRIES.reduce((a, m) => a + m.allocated, 0);
const totalSpent      = MINISTRIES.reduce((a, m) => a + m.spent, 0);
const totalPSULoss    = PSU_LOSSES.reduce((a, p) => a + p.loss_cr, 0);
const totalCAGAmount  = CAG_FINDINGS.reduce((a, f) => a + f.amount_cr, 0);
const avgScore        = Math.round(MINISTRIES.reduce((a, m) => a + m.accountabilityScore, 0) / MINISTRIES.length);

// ─── உதவி ──────────────────────────────────────────────────────────────────
const fmtRs  = (n) => "₹" + Math.floor(n).toLocaleString("en-IN");
const fmtCr  = (n) => "₹" + Number(n).toLocaleString("en-IN") + " கோடி";
const score2color = (s) => s >= 80 ? "#27AE60" : s >= 65 ? "#E67E22" : "#C0392B";
const score2label = (s) => s >= 80 ? "சிறப்பு ✅" : s >= 65 ? "கவனி ⚠️" : "எச்சரிக்கை 🔴";
const sev2color   = (s) => s === "critical" ? "#C0392B" : s === "high" ? "#E67E22" : s === "medium" ? "#F39C12" : "#7F8C8D";
const sev2label   = (s) => s === "critical" ? "🔴 அவசரம்" : s === "high" ? "🟠 அதிகம்" : s === "medium" ? "🟡 நடுத்தரம்" : "⚪ குறைவு";

// ─── நேரலை வட்டி கடிகாரம் ─────────────────────────────────────────────────
function VattiKadigaram() {
  const [elapsed, setElapsed] = useState(0);
  const [tick, setTick]       = useState(false);
  const start = useRef(Date.now());
  const raf   = useRef(null);
  const last  = useRef(0);
  useEffect(() => {
    const loop = () => {
      const s = (Date.now() - start.current) / 1000;
      setElapsed(s);
      const f = Math.floor(s);
      if (f !== last.current) { last.current = f; setTick(t => !t); }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);
  const accrued = elapsed * PER_SEC;
  return (
    <div style={{ background:"linear-gradient(135deg,#1A0800,#0D1020)", border:"1px solid rgba(255,80,0,0.4)", borderLeft:"4px solid #FF4500", borderRadius:14, padding:"20px 24px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse 70% 50% at 50% 50%,rgba(255,69,0,0.08),transparent 70%)", animation:"breathe 2.5s ease-in-out infinite" }}/>
      <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
          <div style={{ width:9,height:9,borderRadius:"50%",background:"#FF4500",boxShadow:"0 0 12px #FF4500",animation:"blink 1s step-end infinite" }}/>
          <span style={{ fontSize:10,letterSpacing:3,color:"#FF6B35",textTransform:"uppercase",fontFamily:"'DM Mono',monospace",fontWeight:700 }}>வட்டி அளவீடு — நேரலை</span>
          <span style={{ marginLeft:"auto",fontFamily:"'DM Mono',monospace",fontSize:10,color:"rgba(255,80,0,0.4)" }}>{Math.floor(elapsed)}வி</span>
        </div>
        <div style={{ fontSize:11,color:"rgba(255,100,50,0.5)",marginBottom:6 }}>நீங்கள் திறந்தது முதல் திரண்ட வட்டி</div>
        <div style={{ fontSize:36,fontFamily:"'DM Mono',monospace",fontWeight:700,color:tick?"#FF6B00":"#FF4500",textShadow:"0 0 30px rgba(255,69,0,0.5)",transition:"color 0.08s",letterSpacing:-1 }}>
          {fmtRs(accrued)}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginTop:14 }}>
          {[
            {l:"வினாடி",  v:fmtRs(PER_SEC)},
            {l:"நிமிடம்", v:fmtRs(PER_SEC*60)},
            {l:"மணி",     v:`₹${(ANNUAL_INTEREST_CR/365/24).toFixed(2)}கோ`},
            {l:"நாள்",    v:`₹${(ANNUAL_INTEREST_CR/365).toFixed(1)}கோ`},
          ].map(r=>(
            <div key={r.l} style={{ background:"rgba(255,69,0,0.08)",border:"1px solid rgba(255,69,0,0.2)",borderRadius:8,padding:"8px",textAlign:"center" }}>
              <div style={{ fontSize:11,fontWeight:700,color:"#FF7040",fontFamily:"'DM Mono',monospace" }}>{r.v}</div>
              <div style={{ fontSize:9,color:"rgba(255,100,50,0.4)",marginTop:2 }}>{r.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Accountability Score Badge ────────────────────────────────────────────
function ScoreBadge({ score, size="md" }) {
  const color = score2color(score);
  const fs = size === "lg" ? 28 : size === "sm" ? 14 : 20;
  return (
    <div style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:size==="lg"?64:size==="sm"?36:48,height:size==="lg"?64:size==="sm"?36:48,borderRadius:"50%",border:`2px solid ${color}`,background:`${color}22`,flexShrink:0 }}>
      <span style={{ fontSize:fs,fontWeight:800,color,fontFamily:"'DM Mono',monospace" }}>{score}</span>
    </div>
  );
}

// ─── Tooltip ───────────────────────────────────────────────────────────────
function TN_Tooltip({ active, payload, label }) {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background:"#0D1B2E",border:"1px solid #2A3F58",borderRadius:10,padding:"10px 14px",fontSize:12 }}>
      <div style={{ color:"#C8963E",fontWeight:700,marginBottom:5 }}>{label}</div>
      {payload.map(p=>(
        <div key={p.name} style={{ display:"flex",gap:10,justifyContent:"space-between",color:p.color }}>
          <span style={{ color:"#8A9BB0" }}>{p.name}:</span>
          <span style={{ fontFamily:"'DM Mono',monospace" }}>₹{p.value?.toLocaleString("en-IN")} கோ</span>
        </div>
      ))}
    </div>
  );
}

// ─── AI அரட்டை ─────────────────────────────────────────────────────────────
function AIArattai() {
  const [msgs, setMsgs]     = useState([{ role:"assistant", text:"வணக்கம்! தமிழ்நாடு பட்ஜெட் கணக்கு, CAG கண்டுபிடிப்புகள், வீணடிப்பு, அல்லது கடன் சுமை பற்றி எதுவும் கேளுங்கள்." }]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const ctx = `Tamil Nadu Budget Accountability Platform 2025-26 — respond in Tamil:
SUMMARY: Total Budget ₹2,74,130 Cr, Total Debt ₹9,29,000 Cr (26.4% GSDP), Interest ₹63,500 Cr/yr = ₹20,135/sec.
CAG FINDINGS: Total flagged amount ₹${totalCAGAmount.toLocaleString("en-IN")} Cr across ${CAG_FINDINGS.length} issues. PSU total loss ₹${totalPSULoss.toLocaleString("en-IN")} Cr. TANGEDCO loss ₹11,955 Cr.
UNSPENT FUNDS: ₹${totalUnspent.toLocaleString("en-IN")} Cr allocated but not spent across all ministries.
RED FLAGS: ${totalRedFlags} red flags across ${MINISTRIES.length} ministries. Average accountability score: ${avgScore}/100.
Lowest scores: Energy/TANGEDCO (44), Transport (55), PWD (58).
LENDERS: Market borrowings (SDL) 52% at 7.8%, Central Govt 15% at 6.5%, World Bank/ADB 4% at 2.5% (lowest).`;

  async function ketku() {
    if (!input.trim()||loading) return;
    const q = input.trim(); setInput("");
    setMsgs(prev => [...prev,{role:"user",text:q}]);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`நீங்கள் தமிழ்நாடு அரசு பட்ஜெட் கணக்கு வல்லுனர். தமிழில் மட்டுமே பதிலளிக்கவும்.\n${ctx}`,
          messages:[{role:"user",content:q}] }),
      });
      const data = await res.json();
      setMsgs(prev => [...prev,{role:"assistant",text:data.content?.find(b=>b.type==="text")?.text||"பதில் கிடைக்கவில்லை."}]);
    } catch { setMsgs(prev => [...prev,{role:"assistant",text:"இணைப்பு பிழை."}]); }
    setLoading(false);
  }

  return (
    <div style={{ display:"flex",flexDirection:"column",height:380,background:"rgba(255,255,255,0.02)",border:"1px solid #1E3050",borderRadius:14,overflow:"hidden" }}>
      <div style={{ padding:"12px 18px",borderBottom:"1px solid #1E3050",display:"flex",alignItems:"center",gap:8 }}>
        <div style={{ width:8,height:8,borderRadius:"50%",background:"#2ECC71",boxShadow:"0 0 8px #2ECC71" }}/>
        <span style={{ fontSize:13,color:"#C8963E",fontWeight:700,fontFamily:"'Noto Serif Tamil',serif" }}>AI கணக்கு ஆய்வாளர்</span>
        <span style={{ fontSize:10,color:"#3A5070",marginLeft:"auto",fontFamily:"'DM Mono',monospace" }}>Claude · தமிழ்</span>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:8 }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"88%",fontSize:13,color:"#D0DFF0",lineHeight:1.75,whiteSpace:"pre-wrap",
              background:m.role==="user"?"#1B5FA8":"rgba(255,255,255,0.05)",
              border:m.role==="assistant"?"1px solid #1E3050":"none",
              borderRadius:m.role==="user"?"16px 16px 4px 16px":"4px 16px 16px 16px",padding:"8px 13px" }}>{m.text}</div>
          </div>
        ))}
        {loading && <div style={{ display:"flex",gap:5,padding:"8px 12px" }}>{[0,1,2].map(i=><div key={i} style={{ width:7,height:7,borderRadius:"50%",background:"#C8963E",animation:`pulse 1.2s ease ${i*0.2}s infinite` }}/>)}</div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{ padding:"10px 12px",borderTop:"1px solid #1E3050",display:"flex",gap:8 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ketku()}
          placeholder="உ.தா: எந்த துறையில் அதிக வீணடிப்பு? TANGEDCO ஏன் நஷ்டம்?"
          style={{ flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid #2A3F58",borderRadius:9,padding:"9px 12px",color:"#D0DFF0",fontSize:13,outline:"none",fontFamily:"inherit" }}/>
        <button onClick={ketku} disabled={loading} style={{ background:loading?"#1E3050":"#C8963E",color:loading?"#4A6080":"#07111F",border:"none",borderRadius:9,padding:"9px 16px",fontWeight:700,cursor:loading?"not-allowed":"pointer",fontSize:15 }}>→</button>
      </div>
    </div>
  );
}

// ─── முதன்மை பயன்பாடு ──────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");

  const tabs = [
    { id:"home",        label:"🏠 முகப்பு" },
    { id:"watch",       label:"👁️ கண்காணிப்பு" },
    { id:"redflags",    label:"🚩 எச்சரிக்கைகள்" },
    { id:"waste",       label:"🗑️ வீணடிப்பு" },
    { id:"interest",    label:"🔴 வட்டி" },
    { id:"debt",        label:"💰 கடன்" },
    { id:"ai",          label:"⚡ AI ஆய்வு" },
    { id:"sources",     label:"🔗 ஆதாரங்கள்" },
  ];

  const sectorData = Object.entries(
    MINISTRIES.reduce((acc,m)=>{ acc[m.sector]=(acc[m.sector]||0)+m.allocated; return acc; },{})
  ).map(([name,value])=>({ name, value, color:SECTORS[name] }));

  return (
    <div style={{ minHeight:"100vh", background:"#070E1A", color:"#D0DFF0", fontFamily:"'Noto Sans Tamil','IBM Plex Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Tamil:wght@700;800&family=Noto+Sans+Tamil:wght@400;500;600&family=DM+Mono&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#070E1A}::-webkit-scrollbar-thumb{background:#1E3050;border-radius:4px}
        @keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
        @keyframes breathe{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .tbtn:hover{background:rgba(200,150,62,0.08)!important}
        .row:hover{background:rgba(255,255,255,0.035)!important}
        a{color:inherit}
      `}</style>

      {/* ══ HEADER ══ */}
      <div style={{ background:"linear-gradient(180deg,#0B1828 0%,#070E1A 100%)", borderBottom:"1px solid #1A2D44", padding:"0 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"18px 0 0" }}>

          {/* Top bar */}
          <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:18 }}>
            <div style={{ width:52, height:52, borderRadius:13, background:"linear-gradient(135deg,#C8963E,#E8B84B)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:900, color:"#07111F", flexShrink:0, fontFamily:"'Noto Serif Tamil',serif" }}>த</div>
            <div>
              <div style={{ fontSize:10, letterSpacing:3, color:"#C8963E", textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:3 }}>தமிழ்நாடு அரசு — பொது கணக்கு கண்காணிப்பு</div>
              <h1 style={{ fontSize:22, fontFamily:"'Noto Serif Tamil',serif", fontWeight:800, color:"#EAF0F8", lineHeight:1.3 }}>பட்ஜெட் கண்காணிப்பு தளம் {YEAR}</h1>
              <div style={{ fontSize:11, color:"#3A5878", marginTop:3 }}>பணம் எங்கே போகிறது · வீணடிப்பு · CAG எச்சரிக்கைகள் · குடிமக்கள் கண்காணிப்பு</div>
            </div>

            {/* Live badges */}
            <div style={{ marginLeft:"auto", display:"flex", flexDirection:"column", gap:6, alignItems:"flex-end" }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(255,69,0,0.1)", border:"1px solid rgba(255,69,0,0.3)", borderRadius:8, padding:"5px 12px" }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:"#FF4500", animation:"blink 1s step-end infinite" }}/>
                <span style={{ fontSize:10, color:"#FF6B35", letterSpacing:1, fontFamily:"'DM Mono',monospace" }}>₹{Math.round(PER_SEC).toLocaleString("en-IN")}/வி வட்டி</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(192,57,43,0.1)", border:"1px solid rgba(192,57,43,0.25)", borderRadius:8, padding:"5px 12px" }}>
                <span style={{ fontSize:10, color:"#E74C3C", fontFamily:"'DM Mono',monospace" }}>🚩 {totalRedFlags} எச்சரிக்கைகள் · {CAG_FINDINGS.filter(f=>f.status==="open").length} திறந்த CAG</span>
              </div>
              <div style={{ fontSize:10, color:"#1E3050", fontFamily:"'DM Mono',monospace" }}>கடைசி புதுப்பிப்பு: {LAST_UPDATED}</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:1, overflowX:"auto" }}>
            {tabs.map(t=>(
              <button key={t.id} className="tbtn" onClick={()=>setTab(t.id)} style={{
                padding:"9px 16px", border:"none", cursor:"pointer", fontSize:12, fontWeight:600, whiteSpace:"nowrap",
                background:tab===t.id?"rgba(200,150,62,0.15)":"transparent",
                color:tab===t.id?"#C8963E":"#4A6080",
                borderBottom:tab===t.id?"2px solid #C8963E":"2px solid transparent",
                borderRadius:"7px 7px 0 0", transition:"all 0.2s", fontFamily:"inherit",
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"24px 24px 48px", animation:"fadeUp 0.3s ease" }}>

        {/* ── HOME ── */}
        {tab==="home" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

            {/* Hero stat cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:12 }}>
              {[
                { l:"மொத்த பட்ஜெட்",      v:`₹2,74,130 கோ`, sub:"நி.ஆ. 2025–26",                c:"#C8963E" },
                { l:"மொத்த கடன்",          v:`₹9.29 லட்சம்`, sub:"GSDP-இன் 26.4%",              c:"#C0392B" },
                { l:"வட்டி / ஆண்டு",      v:`₹63,500 கோ`,   sub:"வினாடிக்கு ₹20,135",          c:"#FF4500" },
                { l:"CAG கண்டுபிடிப்புகள்", v:`₹${totalCAGAmount.toLocaleString("en-IN")} கோ`, sub:`${CAG_FINDINGS.length} வழக்குகள்`, c:"#E74C3C" },
                { l:"PSU மொத்த நஷ்டம்",   v:fmtCr(totalPSULoss), sub:"2021-22 மதிப்பீடு",      c:"#E67E22" },
                { l:"செலவிடப்படாத நிதி",  v:fmtCr(totalUnspent), sub:"ஒதுக்கப்பட்டு பயன்படுத்தப்படாதது", c:"#F39C12" },
                { l:"பொறுப்புக்கணக்கு மதிப்பெண்", v:`${avgScore}/100`, sub:"அனைத்து துறைகளின் சராசரி", c:score2color(avgScore) },
              ].map(c=>(
                <div key={c.l} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${c.c}33`, borderTop:`3px solid ${c.c}`, borderRadius:11, padding:"14px 16px" }}>
                  <div style={{ fontSize:9, letterSpacing:1, color:"#5A7090", marginBottom:6, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>{c.l}</div>
                  <div style={{ fontSize:17, fontWeight:800, color:c.c, fontFamily:"'Noto Serif Tamil',serif", lineHeight:1.3 }}>{c.v}</div>
                  <div style={{ fontSize:10, color:"#3A5070", marginTop:4 }}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Interest clock */}
            <VattiKadigaram/>

            {/* What this platform does */}
            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1A2D44", borderRadius:14, padding:"22px 24px" }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#C8963E", fontFamily:"'Noto Serif Tamil',serif", marginBottom:16 }}>இந்த தளம் என்ன செய்கிறது?</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12 }}>
                {[
                  { icon:"👁️", t:"கண்காணிப்பு",     b:"ஒவ்வொரு துறையின் ஒதுக்கீடு vs செலவு vs பயன்பாட்டு விகிதம் — நேர்மையாக காட்டுகிறது" },
                  { icon:"🚩", t:"எச்சரிக்கை",        b:"CAG தணிக்கை கண்டுபிடிப்புகள், கணக்கு தொகுக்கப்படாத தொகைகள், திட்ட தோல்விகள்" },
                  { icon:"🗑️", t:"வீணடிப்பு கண்டுபிடிப்பு", b:"ஒதுக்கப்பட்டு பயன்படுத்தப்படாத நிதி, PSU நஷ்டங்கள், காலாவதி திட்டங்கள்" },
                  { icon:"🔴", t:"வட்டி சுமை",         b:"வினாடிக்கு ₹20,135 வட்டி செலுத்துகிறோம் — நேர்முக கணக்கீடு" },
                  { icon:"📊", t:"ஒப்பீட்டு பகுப்பாய்வு", b:"எந்த துறை சிறப்பாக செயல்படுகிறது? எங்கே கவலை? 0-100 மதிப்பெண்" },
                  { icon:"🤝", t:"திறந்த மூல",          b:"GitHub-ல் திறந்திருக்கிறது. எவரும் தரவை புதுப்பிக்கலாம், சரிபார்க்கலாம்" },
                ].map(f=>(
                  <div key={f.t} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1A2D44", borderRadius:10, padding:"14px 16px" }}>
                    <div style={{ fontSize:22, marginBottom:8 }}>{f.icon}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#C8D8E8", marginBottom:6 }}>{f.t}</div>
                    <div style={{ fontSize:12, color:"#5A7090", lineHeight:1.65 }}>{f.b}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick alerts */}
            <div style={{ background:"rgba(192,57,43,0.05)", border:"1px solid rgba(192,57,43,0.2)", borderRadius:14, padding:"18px 22px" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#E74C3C", fontFamily:"'Noto Serif Tamil',serif", marginBottom:12 }}>🚨 இப்போதுள்ள முக்கிய கவலைகள்</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {CAG_FINDINGS.filter(f=>f.severity==="critical").map(f=>(
                  <div key={f.id} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"10px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(192,57,43,0.15)", borderRadius:9, borderLeft:"3px solid #C0392B" }}>
                    <span style={{ fontSize:16, flexShrink:0 }}>🔴</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#E74C3C", marginBottom:3 }}>{f.title}</div>
                      <div style={{ fontSize:11, color:"#5A7090" }}>{f.ministry} · {f.year} · {fmtCr(f.amount_cr)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── MINISTRY WATCH ── */}
        {tab==="watch" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#C8963E", fontFamily:"'Noto Serif Tamil',serif" }}>துறை வாரியாக கண்காணிப்பு — பொறுப்புக்கணக்கு மதிப்பெண்</div>
              <div style={{ fontSize:12, color:"#3A5070" }}>🟢 80+ சிறப்பு &nbsp; 🟠 65–79 கவனி &nbsp; 🔴 0–64 எச்சரிக்கை</div>
            </div>

            {[...MINISTRIES].sort((a,b)=>a.accountabilityScore-b.accountabilityScore).map((m,i)=>{
              const util = Math.round((m.spent/m.allocated)*100);
              const unspent = m.allocated - m.spent;
              return (
                <div key={m.id} className="row" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #111E30", borderLeft:`4px solid ${score2color(m.accountabilityScore)}`, borderRadius:11, padding:"16px 18px", transition:"background 0.15s" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"auto 1fr 90px 90px 90px auto", gap:14, alignItems:"center" }}>

                    <ScoreBadge score={m.accountabilityScore} size="md"/>

                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                        <span style={{ fontSize:13, fontWeight:700, color:"#C8D8E8" }}>{m.name}</span>
                        {m.redFlags > 0 && <span style={{ fontSize:10, padding:"2px 7px", background:"rgba(192,57,43,0.15)", border:"1px solid rgba(192,57,43,0.3)", borderRadius:10, color:"#E74C3C" }}>🚩 {m.redFlags}</span>}
                        <span style={{ fontSize:10, padding:"2px 8px", background:`${score2color(m.accountabilityScore)}22`, borderRadius:10, color:score2color(m.accountabilityScore) }}>{score2label(m.accountabilityScore)}</span>
                      </div>
                      <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:4, height:6, overflow:"hidden", marginBottom:5 }}>
                        <div style={{ width:`${util}%`, background:util>=80?"#27AE60":util>=65?"#E67E22":"#C0392B", height:"100%", borderRadius:4, transition:"width 0.8s" }}/>
                      </div>
                      <div style={{ fontSize:11, color:"#3A5070" }}>{m.note}</div>
                    </div>

                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:10, color:"#3A5070", marginBottom:2 }}>ஒதுக்கீடு</div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#C8963E", fontFamily:"'DM Mono',monospace" }}>₹{m.allocated.toLocaleString("en-IN")}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:10, color:"#3A5070", marginBottom:2 }}>செலவு</div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#2E7D6B", fontFamily:"'DM Mono',monospace" }}>₹{m.spent.toLocaleString("en-IN")}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:10, color:"#3A5070", marginBottom:2 }}>பயன்படாதது</div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#E67E22", fontFamily:"'DM Mono',monospace" }}>₹{unspent.toLocaleString("en-IN")}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:18, fontWeight:800, color:util>=80?"#27AE60":util>=65?"#E67E22":"#C0392B", fontFamily:"'DM Mono',monospace" }}>{util}%</div>
                      <div style={{ fontSize:9, color:"#3A5070" }}>பயன்பாடு</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── RED FLAGS ── */}
        {tab==="redflags" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              {[
                { l:"மொத்த வழக்குகள்",  v:CAG_FINDINGS.length, c:"#E74C3C" },
                { l:"திறந்த வழக்குகள்", v:CAG_FINDINGS.filter(f=>f.status==="open").length, c:"#C0392B" },
                { l:"ஆய்வில் உள்ளது",   v:CAG_FINDINGS.filter(f=>f.status==="under_review").length, c:"#E67E22" },
                { l:"மொத்த தொகை",       v:fmtCr(totalCAGAmount), c:"#FF6B35" },
              ].map(c=>(
                <div key={c.l} style={{ background:"rgba(192,57,43,0.05)", border:`1px solid ${c.c}33`, borderTop:`3px solid ${c.c}`, borderRadius:11, padding:"14px 16px" }}>
                  <div style={{ fontSize:9, letterSpacing:1, color:"#5A7090", marginBottom:6, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>{c.l}</div>
                  <div style={{ fontSize:22, fontWeight:800, color:c.c, fontFamily:"'Noto Serif Tamil',serif" }}>{c.v}</div>
                </div>
              ))}
            </div>

            {CAG_FINDINGS.map(f=>(
              <div key={f.id} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1A2D44", borderLeft:`4px solid ${sev2color(f.severity)}`, borderRadius:12, padding:"18px 20px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:12 }}>
                  <div style={{ flexShrink:0 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:sev2color(f.severity), marginBottom:4 }}>{sev2label(f.severity)}</div>
                    <div style={{ fontSize:10, padding:"2px 8px", borderRadius:6, border:"1px solid #1A2D44", color:f.status==="open"?"#C0392B":f.status==="under_review"?"#E67E22":"#27AE60", background:"rgba(255,255,255,0.02)" }}>
                      {f.status==="open"?"திறந்துள்ளது":f.status==="under_review"?"ஆய்வில்":"முடிந்தது"}
                    </div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#EAF0F8", marginBottom:6 }}>{f.title}</div>
                    <div style={{ fontSize:12, color:"#6A8AA8", lineHeight:1.7, marginBottom:10 }}>{f.detail}</div>
                    <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                      <span style={{ fontSize:11, color:"#3A5070" }}>🏢 {f.ministry}</span>
                      <span style={{ fontSize:11, color:"#3A5070" }}>📅 {f.year}</span>
                      <span style={{ fontSize:12, fontWeight:700, color:"#FF6B35", fontFamily:"'DM Mono',monospace" }}>{fmtCr(f.amount_cr)}</span>
                      <a href={f.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#2E7D6B", textDecoration:"none" }}>📄 {f.source} ↗</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── WASTE TRACKER ── */}
        {tab==="waste" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

            {/* PSU Losses */}
            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1A2D44", borderRadius:14, padding:"20px" }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#E74C3C", fontFamily:"'Noto Serif Tamil',serif", marginBottom:4 }}>🏭 அரசு நிறுவன (PSU) நஷ்டங்கள் — 2021-22</div>
              <div style={{ fontSize:12, color:"#3A5070", marginBottom:16 }}>மொத்தம் {fmtCr(totalPSULoss)} — இந்த நஷ்டம் மாநில கடனில் சேர்க்கப்படுகிறது</div>
              <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                {PSU_LOSSES.map((p,i)=>{
                  const pct = ((p.loss_cr/totalPSULoss)*100).toFixed(1);
                  return (
                    <div key={p.name} style={{ display:"grid", gridTemplateColumns:"120px 1fr 100px 60px", gap:14, alignItems:"center", padding:"11px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid #0E1A28", borderRadius:8 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"#C8D8E8" }}>{p.name}</div>
                      <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:4, height:6, overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`, background:p.color, height:"100%", borderRadius:4 }}/>
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#E74C3C", fontFamily:"'DM Mono',monospace", textAlign:"right" }}>{fmtCr(p.loss_cr)}</div>
                      <div style={{ fontSize:12, color:"#5A7090", textAlign:"right", fontFamily:"'DM Mono',monospace" }}>{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unspent funds */}
            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1A2D44", borderRadius:14, padding:"20px" }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#F39C12", fontFamily:"'Noto Serif Tamil',serif", marginBottom:4 }}>💤 ஒதுக்கப்பட்டு பயன்படுத்தப்படாத நிதி</div>
              <div style={{ fontSize:12, color:"#3A5070", marginBottom:16 }}>மொத்தம் {fmtCr(totalUnspent)} — ஒதுக்கப்பட்டு செலவிடப்படாத தொகை</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={UNSPENT_FUNDS.map(u=>({ name:u.ministry.split(" ")[0], ஒதுக்கீடு:u.allocated, செலவு:u.spent, பயன்படாதது:u.unspent }))} margin={{ bottom:50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A2E45"/>
                  <XAxis dataKey="name" tick={{ fill:"#5A7090",fontSize:10,fontFamily:"'Noto Sans Tamil',sans-serif" }} angle={-30} textAnchor="end" interval={0}/>
                  <YAxis tick={{ fill:"#5A7090",fontSize:10 }} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
                  <Tooltip content={<TN_Tooltip/>}/>
                  <Bar dataKey="ஒதுக்கீடு" fill="#C8963E44" radius={[3,3,0,0]} stroke="#C8963E" strokeWidth={1}/>
                  <Bar dataKey="செலவு"    fill="#2E7D6B"   radius={[3,3,0,0]}/>
                  <Bar dataKey="பயன்படாதது" fill="#E67E22" radius={[3,3,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Context */}
            <div style={{ background:"rgba(243,156,18,0.05)", border:"1px solid rgba(243,156,18,0.2)", borderRadius:12, padding:"16px 20px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#F39C12", marginBottom:8 }}>⚠️ குறிப்பு: பயன்படாத நிதி எப்போதும் "சேமிப்பு" இல்லை</div>
              <div style={{ fontSize:12, color:"#6A8AA8", lineHeight:1.75 }}>
                ஒதுக்கப்பட்ட நிதி செலவிடப்படாமல் இருந்தால், அந்த திட்டம் நடைபெறவில்லை என்று அர்த்தம்.
                பள்ளி பராமரிப்புக்கு நிதி இருந்தும் கட்டிடம் சீர்திருத்தப்படவில்லை,
                வெள்ள நிவாரணத்திற்கு நிதி இருந்தும் சென்னை மூழ்குகிறது —
                இவை "சேமிப்பு" அல்ல, <strong style={{color:"#F39C12"}}>செயல்திறன் இழப்பு.</strong>
              </div>
            </div>
          </div>
        )}

        {/* ── INTEREST ── */}
        {tab==="interest" && (
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <VattiKadigaram/>
            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1A2D44", borderRadius:14, overflow:"hidden" }}>
              <div style={{ padding:"14px 20px", borderBottom:"1px solid #1A2D44", fontSize:14, fontWeight:700, color:"#C8963E", fontFamily:"'Noto Serif Tamil',serif" }}>வினாடி முதல் ஆண்டு வரை</div>
              {[
                ["1 வினாடி",  PER_SEC,                 "ஒரு சாதாரண குடும்ப நாள் வருமானம்"],
                ["1 நிமிடம்", PER_SEC*60,              "ஒரு சிறு தொழிலின் நாள் வருவாய்"],
                ["1 மணி",     PER_SEC*3600,            "ஒரு சட்டமன்ற தொகுதி மாத வளர்ச்சி நிதி"],
                ["1 நாள்",    PER_SEC*86400,           "CM காலை உணவு × 290 நாட்கள்"],
                ["1 வாரம்",   PER_SEC*604800,          "ஒரு மாவட்டம் மொத்த மாத பட்ஜெட்"],
                ["1 மாதம்",   ANNUAL_INTEREST_CR*1e7/12,"தொழில் & வணிக ஆண்டு பட்ஜெட்"],
                ["1 ஆண்டு",   ANNUAL_INTEREST_CR*1e7,  "கல்வி பட்ஜெட்டை விட 50% அதிகம்"],
              ].map(([p,rs,comp],i)=>(
                <div key={p} style={{ display:"grid", gridTemplateColumns:"90px 1fr 120px 1.5fr", gap:12, padding:"12px 20px", borderBottom:"1px solid #0E1A28", background:i===6?"rgba(255,69,0,0.06)":"transparent" }}>
                  <span style={{ fontSize:13, color:i===6?"#FF6B35":"#8A9BB0" }}>{p}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:i===6?"#FF4500":"#C8D8E8", fontFamily:"'DM Mono',monospace" }}>{fmtRs(rs)}</span>
                  <span style={{ fontSize:12, color:"#5A7090", fontFamily:"'DM Mono',monospace" }}>₹{(rs/1e7).toFixed(rs<1e7?4:0)} கோ</span>
                  <span style={{ fontSize:11, color:"#3A5070" }}>{comp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DEBT ── */}
        {tab==="debt" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
              {[
                { l:"மொத்த கடன்",          v:`₹${(TOTAL_DEBT_CR/100000).toFixed(2)} லட்சம் கோடி`, c:"#C0392B" },
                { l:"சராசரி வட்டி விகிதம்", v:`${AVG_RATE}%`, c:"#E67E22" },
                { l:"வட்டி / ஆண்டு",       v:fmtCr(ANNUAL_INTEREST_CR), c:"#FF4500" },
              ].map(c=>(
                <div key={c.l} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${c.c}33`, borderTop:`3px solid ${c.c}`, borderRadius:11, padding:"16px 18px" }}>
                  <div style={{ fontSize:9, letterSpacing:1, color:"#5A7090", marginBottom:6, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>{c.l}</div>
                  <div style={{ fontSize:22, fontWeight:800, color:c.c, fontFamily:"'Noto Serif Tamil',serif" }}>{c.v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", height:14, borderRadius:7, overflow:"hidden", gap:2 }}>
              {LENDERS.map(l=><div key={l.name} style={{ width:`${l.pct}%`, background:l.color }} title={`${l.name}: ${l.pct}%`}/>)}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 0.7fr 0.8fr 1fr 1fr", gap:10, padding:"8px 16px", fontSize:10, letterSpacing:1, color:"#1E3050", textTransform:"uppercase", fontFamily:"'DM Mono',monospace", borderBottom:"1px solid #0E1A28" }}>
                <span>கடன் வழங்குனர்</span><span style={{textAlign:"right"}}>தொகை</span><span style={{textAlign:"center"}}>பங்கு</span><span style={{textAlign:"center"}}>வட்டி%</span><span style={{textAlign:"right"}}>வட்டி/ஆண்டு</span><span style={{textAlign:"right"}}>வட்டி/வினாடி</span>
              </div>
              {LENDERS.map(l=>(
                <div key={l.name} className="row" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 0.7fr 0.8fr 1fr 1fr", gap:10, alignItems:"center", padding:"13px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid #0E1A28", borderRadius:9, borderLeft:`3px solid ${l.color}`, transition:"background 0.15s" }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#C8D8E8" }}>{l.icon} {l.name}</div>
                    <div style={{ fontSize:10, color:"#3A5070", marginTop:2 }}>{l.who}</div>
                  </div>
                  <div style={{ textAlign:"right", fontSize:12, fontWeight:700, color:l.color, fontFamily:"'DM Mono',monospace" }}>₹{l.amount_cr.toLocaleString("en-IN")}<span style={{fontSize:9,color:"#3A5070"}}> கோ</span></div>
                  <div style={{ textAlign:"center", fontSize:14, fontWeight:800, color:l.color, fontFamily:"'DM Mono',monospace" }}>{l.pct}%</div>
                  <div style={{ textAlign:"center", fontSize:16, fontWeight:800, fontFamily:"'DM Mono',monospace", color:l.rate<4?"#27AE60":l.rate<7?"#E67E22":"#C0392B" }}>{l.rate}%</div>
                  <div style={{ textAlign:"right", fontSize:12, fontWeight:700, color:"#FF6B35", fontFamily:"'DM Mono',monospace" }}>₹{l.interest_cr.toLocaleString("en-IN")}<span style={{fontSize:9,color:"#3A5070"}}> கோ</span></div>
                  <div style={{ textAlign:"right", fontSize:12, fontWeight:700, color:"#FF4500", fontFamily:"'DM Mono',monospace" }}>{fmtRs(l.interest_cr*1e7/(365*24*3600))}<span style={{fontSize:9,color:"#3A5070"}}>/வி</span></div>
                </div>
              ))}
              {/* Totals */}
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 0.7fr 0.8fr 1fr 1fr", gap:10, alignItems:"center", padding:"13px 16px", background:"rgba(200,150,62,0.08)", border:"1px solid rgba(200,150,62,0.2)", borderRadius:9 }}>
                <div style={{ fontSize:13, fontWeight:800, color:"#C8963E" }}>மொத்தம்</div>
                <div style={{ textAlign:"right", fontSize:13, fontWeight:800, color:"#C8963E", fontFamily:"'DM Mono',monospace" }}>₹{TOTAL_DEBT_CR.toLocaleString("en-IN")}<span style={{fontSize:9}}> கோ</span></div>
                <div style={{ textAlign:"center", fontSize:13, fontWeight:800, color:"#C8963E", fontFamily:"'DM Mono',monospace" }}>100%</div>
                <div style={{ textAlign:"center", fontSize:13, fontWeight:800, color:"#E67E22", fontFamily:"'DM Mono',monospace" }}>{AVG_RATE}%</div>
                <div style={{ textAlign:"right", fontSize:13, fontWeight:800, color:"#FF6B35", fontFamily:"'DM Mono',monospace" }}>₹{LENDERS.reduce((a,l)=>a+l.interest_cr,0).toLocaleString("en-IN")}<span style={{fontSize:9}}> கோ</span></div>
                <div style={{ textAlign:"right", fontSize:13, fontWeight:800, color:"#FF4500", fontFamily:"'DM Mono',monospace" }}>{fmtRs(PER_SEC)}<span style={{fontSize:9}}>/வி</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ── AI ── */}
        {tab==="ai" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <AIArattai/>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["எந்த துறையில் அதிக வீணடிப்பு?","TANGEDCO ஏன் நஷ்டம்?","வட்டி சுமை குறைக்க என்ன செய்யலாம்?","CAG-ல் அதிக எச்சரிக்கை எந்த துறை?"].map(q=>(
                <div key={q} style={{ fontSize:12, padding:"5px 13px", background:"rgba(200,150,62,0.07)", border:"1px solid rgba(200,150,62,0.2)", borderRadius:20, color:"#C8963E", cursor:"default" }}>{q}</div>
              ))}
            </div>
          </div>
        )}

        {/* ── SOURCES ── */}
        {tab==="sources" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1A2D44", borderRadius:14, padding:"18px 22px" }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#C8963E", fontFamily:"'Noto Serif Tamil',serif", marginBottom:8 }}>தரவு ஆதாரங்கள் & சான்றுகள்</div>
              <div style={{ fontSize:13, color:"#5A7090", lineHeight:1.7 }}>இந்த தளத்தில் உள்ள அனைத்து எண்களும் கீழ்க்கண்ட அரசு மற்றும் சுதந்திர ஆதாரங்களிலிருந்து தொகுக்கப்பட்டவை. தரவை சரிபார்க்க நேரடியாக ஆதாரங்களை கிளிக் செய்யுங்கள்.</div>
            </div>
            {SOURCES.map(cat=>(
              <div key={cat.category} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1A2D44", borderRadius:14, overflow:"hidden" }}>
                <div style={{ padding:"13px 20px", borderBottom:"1px solid #1A2D44", display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:16 }}>{cat.icon}</span>
                  <span style={{ fontSize:14, fontWeight:700, color:cat.color, fontFamily:"'Noto Serif Tamil',serif" }}>{cat.category}</span>
                </div>
                {cat.items.map((item,i)=>(
                  <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                    style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 20px", borderBottom:i<cat.items.length-1?"1px solid #0A1520":"none", textDecoration:"none", transition:"background 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:cat.color, marginBottom:3 }}>{item.label}</div>
                      <div style={{ fontSize:11, color:"#5A7090", marginBottom:5 }}>{item.desc}</div>
                      <div style={{ fontSize:10, color:"#1E3050", fontFamily:"'DM Mono',monospace" }}>{item.url}</div>
                    </div>
                    <span style={{ fontSize:16, color:"#1E3050", flexShrink:0 }}>↗</span>
                  </a>
                ))}
              </div>
            ))}

            <div style={{ background:"rgba(255,150,0,0.05)", border:"1px solid rgba(255,150,0,0.15)", borderRadius:12, padding:"16px 20px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#C8963E", marginBottom:8 }}>🤝 தரவை புதுப்பிக்க உதவுங்கள்</div>
              <div style={{ fontSize:12, color:"#6A8AA8", lineHeight:1.75 }}>
                இந்த திட்டம் GitHub-ல் திறந்த மூல. <strong style={{color:"#C8963E"}}>src/data/</strong> கோப்புகளை மட்டும் புதுப்பித்தால் போதும்.<br/>
                புதிய CAG அறிக்கை வந்தால் → <strong style={{color:"#C8963E"}}>audit.js</strong> புதுப்பிக்கவும்.<br/>
                புதிய பட்ஜெட் வந்தால் → <strong style={{color:"#C8963E"}}>budget.js</strong> புதுப்பிக்கவும்.<br/>
                Pull request அனுப்பவும் — அனைவரும் வரவேற்கப்படுகிறார்கள்.
              </div>
            </div>
          </div>
        )}

        {/* ── Persistent footer ── */}
        <div style={{ marginTop:32, paddingTop:16, borderTop:"1px solid #0E1A28", display:"flex", flexWrap:"wrap", gap:"6px 16px", alignItems:"center" }}>
          <span style={{ fontSize:10, color:"#1E3050", fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>ஆதாரங்கள்:</span>
          {[
            {l:"PRS India",  u:"https://prsindia.org/budgets/states/tamil-nadu-budget-analysis-2025-26"},
            {l:"CAG",        u:"https://cag.gov.in/en/audit-report?page=1&state=Tamil+Nadu"},
            {l:"TN Budget",  u:"https://tnbudget.tn.gov.in/"},
            {l:"NITI Aayog", u:"https://www.niti.gov.in/sites/default/files/2025-03/Macro-and-Fiscal-Landscape-of-the-State-of-Tamil-Nadu.pdf"},
            {l:"RBI",        u:"https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=State+Finances+%3a+A+Study+of+Budgets"},
          ].map(s=>(
            <a key={s.l} href={s.u} target="_blank" rel="noopener noreferrer"
              style={{ fontSize:10, color:"#2A4060", fontFamily:"'DM Mono',monospace", textDecoration:"none", padding:"2px 8px", borderRadius:4, border:"1px solid #141E2E" }}
              onMouseEnter={e=>{ e.currentTarget.style.color="#C8963E"; e.currentTarget.style.borderColor="#C8963E44"; }}
              onMouseLeave={e=>{ e.currentTarget.style.color="#2A4060"; e.currentTarget.style.borderColor="#141E2E"; }}
            >{s.l} ↗</a>
          ))}
          <span style={{ fontSize:10, color:"#141E2E", marginLeft:"auto", fontFamily:"'DM Mono',monospace" }}>திறந்த மூல · github.com · {LAST_UPDATED}</span>
        </div>
      </div>
    </div>
  );
}
