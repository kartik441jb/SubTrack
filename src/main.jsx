import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle, ArrowRight, Bell, BellOff, BellRing, Calendar, CalendarDays,
  Check, CheckCircle2, ChevronDown, ChevronRight, CircleDollarSign, Clock,
  CreditCard, Edit3, ExternalLink, Film, Filter, Gauge, Globe, Home,
  Info, LayoutDashboard, Link2, ListChecks, Mail, Menu, MessageCircle,
  Moon, MoreHorizontal, Phone, Plus, RefreshCw, Search, Send, Settings,
  ShieldCheck, Smartphone, Sparkles, Star, Sun, Trash2, TrendingDown,
  TrendingUp, Tv, Wallet, X, Zap, Wifi, Lock, Eye, EyeOff, Download,
  Upload, Copy, CheckSquare, Square, BarChart2, PieChart, Activity,
  ArrowUpRight, ArrowDownRight, Layers, Tag, Users, Archive, LogOut,
  User, Key, Fingerprint, Scan, QrCode, ShieldAlert, Trophy, Gift,
  Lightbulb, Target, TrendingDown as TrendDown, Banknote, Receipt,
  CreditCard as CardIcon, Repeat, Clock as ClockIcon
} from "lucide-react";
import "./styles.css";

// ─────────────────────────── PLATFORM DATA ───────────────────────────────────
const PLATFORM_DATA = {
  Netflix:        { icon:"N",  color:"#e50914", category:"Entertainment", website:"https://www.netflix.com/in/signup", description:"World's leading streaming service", plans:{ Mobile:{price:149,cycle:"month",quality:"HD",screens:"1 mobile device",features:["Mobile only","Ad-free viewing","Downloads (30 titles)"],annualSaving:0}, Basic:{price:199,cycle:"month",quality:"HD",screens:"1 screen",features:["TV + Mobile","Ad-free viewing","Downloads"],annualSaving:0}, Standard:{price:649,cycle:"month",quality:"Full HD",screens:"2 screens",features:["Multi-device","Ad-free","Downloads","Spatial Audio"],annualSaving:0}, Premium:{price:799,cycle:"month",quality:"4K + HDR",screens:"4 screens",features:["4K + HDR","Multi-device","Downloads","Spatial Audio"],annualSaving:0} }},
  JioHotstar:     { icon:"JH", color:"#146ef5", category:"Entertainment", website:"https://www.jiohotstar.com/subscribe", description:"India's biggest OTT — live sports, movies", plans:{ Mobile:{price:149,cycle:"year",quality:"HD",screens:"1 mobile",features:["Mobile only","Live sports","Downloads"],annualSaving:null}, Super:{price:299,cycle:"year",quality:"Full HD",screens:"2 screens",features:["TV + Mobile","Live sports + IPL","Downloads"],annualSaving:null}, Premium:{price:899,cycle:"year",quality:"4K",screens:"4 screens",features:["4K streaming","Live sports","Premium content","Dolby Audio"],annualSaving:null} }},
  Spotify:        { icon:"S",  color:"#1ed760", category:"Music",          website:"https://www.spotify.com/in-en/premium/", description:"Millions of songs, podcasts & audiobooks", plans:{ Mini:{price:7,cycle:"day",quality:"High",screens:"1 account",features:["24-hr access","Ad-free","Offline 30 songs"],annualSaving:0}, Individual:{price:119,cycle:"month",quality:"High",screens:"1 account",features:["Ad-free music","Offline listening","Unlimited skips"],annualSaving:120}, Duo:{price:179,cycle:"month",quality:"High",screens:"2 accounts",features:["2 Premium accounts","Offline","Duo Mix"],annualSaving:0}, Family:{price:199,cycle:"month",quality:"High",screens:"6 accounts",features:["6 Premium accounts","Offline","Family Mix","Explicit filter"],annualSaving:0}, Student:{price:59,cycle:"month",quality:"High",screens:"1 account",features:["Student pricing","Ad-free","Offline"],annualSaving:60} }},
  "Amazon Prime": { icon:"A",  color:"#00a8e1", category:"Entertainment", website:"https://www.primevideo.com/offers/nonprimehomepage", description:"Prime Video, delivery, Music & more in one", plans:{ Monthly:{price:299,cycle:"month",quality:"4K",screens:"3 devices",features:["Prime Video","Free delivery","Prime Music","Prime Reading"],annualSaving:0}, Quarterly:{price:599,cycle:"quarter",quality:"4K",screens:"3 devices",features:["Prime Video","Free delivery","Prime Music"],annualSaving:150}, Yearly:{price:1499,cycle:"year",quality:"4K",screens:"3 devices",features:["Prime Video","Free delivery","Prime Music","Gaming deals"],annualSaving:688} }},
  "YouTube Premium":{ icon:"YT",color:"#ff0000",category:"Entertainment",  website:"https://www.youtube.com/premium", description:"Ad-free YouTube + Music, background play & downloads", plans:{ Individual:{price:149,cycle:"month",quality:"4K",screens:"1 account",features:["Ad-free YouTube","YouTube Music","Background play","Downloads"],annualSaving:0}, Family:{price:299,cycle:"month",quality:"4K",screens:"5 accounts",features:["Family sharing","YouTube Music","Background play"],annualSaving:0}, Student:{price:89,cycle:"month",quality:"4K",screens:"1 account",features:["Student pricing","YouTube Music","Background play"],annualSaving:60} }},
  "Sony LIV":     { icon:"SL", color:"#7c3aed", category:"Entertainment", website:"https://www.sonyliv.com/plan", description:"Sony originals, live sports & international shows", plans:{ Super:{price:699,cycle:"year",quality:"Full HD",screens:"2 devices",features:["Live sports","Sony originals","International shows","Downloads"],annualSaving:null}, "Super Family":{price:999,cycle:"year",quality:"Full HD",screens:"5 devices",features:["5 screens","Live sports","Originals","Downloads"],annualSaving:null} }},
  ZEE5:           { icon:"Z5", color:"#f59e0b", category:"Entertainment", website:"https://www.zee5.com/subscribe", description:"Hindi, regional content, live TV & originals", plans:{ Monthly:{price:149,cycle:"month",quality:"4K",screens:"2 devices",features:["Premium shows","Movies","Live TV","Downloads"],annualSaving:0}, Yearly:{price:999,cycle:"year",quality:"4K",screens:"2 devices",features:["Premium shows","Movies","Live TV","Downloads"],annualSaving:789} }},
  Canva:          { icon:"Cv", color:"#00c4cc", category:"Productivity",   website:"https://www.canva.com/pricing/", description:"Design platform for presentations, social & print", plans:{ Pro:{price:500,cycle:"month",quality:"Pro tools",screens:"1 account",features:["Premium templates","Brand Kit","Magic AI tools","100 GB storage"],annualSaving:2000}, Teams:{price:900,cycle:"month",quality:"Pro tools",screens:"5 seats",features:["Team collaboration","Brand controls","Premium content","500 GB"],annualSaving:0} }},
  "Google One":   { icon:"G1", color:"#4285f4", category:"Cloud",          website:"https://one.google.com/about", description:"Extra storage across Gmail, Drive & Photos", plans:{ "100 GB":{price:130,cycle:"month",quality:"100 GB",screens:"1 family",features:["100 GB storage","Google experts","Family sharing (up to 5)"],annualSaving:0}, "200 GB":{price:210,cycle:"month",quality:"200 GB",screens:"1 family",features:["200 GB storage","Google experts","Family sharing"],annualSaving:0}, "2 TB":{price:650,cycle:"month",quality:"2 TB",screens:"1 family",features:["2 TB storage","Google experts","VPN","Family sharing"],annualSaving:0} }},
  "Microsoft 365":{ icon:"M3", color:"#0078d4", category:"Productivity",   website:"https://www.microsoft.com/en-in/microsoft-365", description:"Word, Excel, PowerPoint, Teams, OneDrive & more", plans:{ Personal:{price:489,cycle:"month",quality:"Full",screens:"1 user",features:["Office apps","1 TB OneDrive","Skype minutes","Ad-free Outlook"],annualSaving:2100}, Family:{price:619,cycle:"month",quality:"Full",screens:"6 users",features:["6 users","Office apps","6 TB OneDrive","Skype minutes"],annualSaving:0} }},
  Hotstar:        { icon:"HS", color:"#1D0060", category:"Entertainment",  website:"https://www.hotstar.com/in/subscribe", description:"Disney+ Hotstar — Disney, Marvel, Star Wars & Sports", plans:{ Mobile:{price:149,cycle:"year",quality:"HD",screens:"1 mobile",features:["Mobile viewing","Live sports","Hindi/Regional"],annualSaving:null}, Super:{price:299,cycle:"year",quality:"Full HD",screens:"2 screens",features:["TV + Mobile","Sports","Disney+ content"],annualSaving:null}, Premium:{price:899,cycle:"year",quality:"4K",screens:"4 screens",features:["4K + HDR","Sports","Disney+","Dolby Audio"],annualSaving:null} }},
  "Jio Fiber":    { icon:"JF", color:"#0a66c2", category:"Internet",       website:"https://www.jio.com/fiber", description:"Home fiber broadband — internet + OTT bundled", plans:{ Bronze:{price:399,cycle:"month",quality:"30 Mbps",screens:"1 connection",features:["30 Mbps","100 GB data","JioTV"],annualSaving:0}, Silver:{price:699,cycle:"month",quality:"100 Mbps",screens:"1 connection",features:["100 Mbps","Unlimited data","JioTV + OTT"],annualSaving:0}, Gold:{price:999,cycle:"month",quality:"150 Mbps",screens:"1 connection",features:["150 Mbps","Unlimited","8 OTT apps"],annualSaving:0} }},
  "Swiggy One":   { icon:"SW", color:"#fc8019", category:"Food & Delivery",website:"https://www.swiggy.com/swiggy-one", description:"Free delivery, lower surge & exclusive discounts", plans:{ Monthly:{price:179,cycle:"month",quality:"Free delivery",screens:"1 account",features:["Free Swiggy delivery","Instamart benefits","10% extra discount"],annualSaving:0}, Lite:{price:99,cycle:"month",quality:"Basic",screens:"1 account",features:["Free delivery (orders > ₹199)","Swiggy Instamart"],annualSaving:0} }},
  "Zomato Pro":   { icon:"ZP", color:"#e23744", category:"Food & Delivery",website:"https://www.zomato.com/pro", description:"Free delivery, priority access & member-only deals", plans:{ Plus:{price:149,cycle:"month",quality:"Pro benefits",screens:"1 account",features:["Free delivery","Priority access","30-day trial free"],annualSaving:0} }},
};

// ─────────────────────────── UTILS ───────────────────────────────────────────
const today     = () => new Date().toISOString().split("T")[0];
const money     = n  => `₹${Math.round(n).toLocaleString("en-IN")}`;
const monthlyCost = s => { if (!s) return 0; if (s.cycle==="month") return s.price; if (s.cycle==="quarter") return s.price/3; if (s.cycle==="year") return s.price/12; if (s.cycle==="day") return s.price*30; return s.price; };
const daysUntil = date => { const now=new Date(); now.setHours(0,0,0,0); const d=new Date(date+"T00:00:00"); d.setHours(0,0,0,0); return Math.ceil((d-now)/86400000); };
const formatDate  = date => new Date(date+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
const formatDateShort = date => new Date(date+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"});
const addMonths = (dateStr, months) => { const d=new Date(dateStr+"T00:00:00"); d.setMonth(d.getMonth()+months); return d.toISOString().split("T")[0]; };
const addDays   = (dateStr, days)   => { const d=new Date(dateStr+"T00:00:00"); d.setDate(d.getDate()+days); return d.toISOString().split("T")[0]; };
const cycleToMonths = cycle => ({month:1,quarter:3,year:12,day:0}[cycle]||1);
const makeId = () => Date.now()+Math.random();

const REMINDER_OPTIONS  = ["Same day","1 day before","3 days before","7 days before","14 days before","1 month before"];
const NOTIFY_CHANNELS   = ["In-App Notification","Email","WhatsApp","SMS"];

// ─────────────────────────── DEMO DATA ───────────────────────────────────────
const initialSubs = [
  {id:1,platform:"Netflix",       plan:"Premium",   price:799, cycle:"month",  startDate:"2025-08-25",renewal:"2026-11-25",autopay:true, reminder:"3 days before",notifyChannels:["In-App Notification","Email"],status:"Active",autoDetected:false},
  {id:2,platform:"Spotify",       plan:"Individual",price:119, cycle:"month",  startDate:"2025-09-01",renewal:"2026-11-01",autopay:true, reminder:"7 days before",notifyChannels:["In-App Notification","WhatsApp","SMS"],          status:"Active",autoDetected:false},
  {id:3,platform:"JioHotstar",    plan:"Premium",   price:899, cycle:"year",   startDate:"2026-01-06",renewal:"2027-01-06",autopay:false,reminder:"7 days before",notifyChannels:["Email","WhatsApp"],             status:"Active",autoDetected:false},
  {id:4,platform:"Amazon Prime",  plan:"Yearly",    price:1499,cycle:"year",   startDate:"2025-10-12",renewal:"2026-10-12",autopay:true, reminder:"7 days before",notifyChannels:["In-App Notification","WhatsApp","SMS"],          status:"Active",autoDetected:false},
  {id:5,platform:"YouTube Premium",plan:"Student",  price:89,  cycle:"month",  startDate:"2026-01-02",renewal:"2026-11-02",autopay:true, reminder:"3 days before",notifyChannels:["In-App Notification","WhatsApp","SMS"],          status:"Active",autoDetected:false},
  {id:6,platform:"Google One",    plan:"200 GB",    price:210, cycle:"month",  startDate:"2026-02-10",renewal:"2026-11-10",autopay:true, reminder:"1 day before", notifyChannels:["Email"],                        status:"Active",autoDetected:false},
];

// ─────────────────────────── NAV ─────────────────────────────────────────────
function ScaleIcon({size=18}){ return <span style={{fontSize:size+2,lineHeight:"1",display:"block",width:size,textAlign:"center"}}>⇄</span>; }
const navItems = [
  ["Dashboard",        LayoutDashboard],
  ["My Subscriptions", ListChecks],
  ["Add Subscription", Plus],
  ["Compare Plans",    ScaleIcon],
  ["Reminders",        Bell],
  ["Spending",         TrendingUp],
  ["Auto-Detect",      Wifi],
  ["Settings",         Settings],
];

// ─────────────────────────── AUTH STATE ──────────────────────────────────────
function getStoredUser() {
  try { return JSON.parse(localStorage.getItem("subtrack-user")); } catch { return null; }
}

// ═════════════════════════════════════════════════════════════════════════════
// LOGIN / SIGNUP PAGE
// ═════════════════════════════════════════════════════════════════════════════
function AuthPage({ onLogin }) {
  const [mode, setMode]           = useState("login");   // login | signup | otp
  const [phone, setPhone]         = useState("");
  const [name, setName]           = useState("");
  const [otp, setOtp]             = useState(["","","","","",""]);
  const [sentOtp, setSentOtp]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [countdown, setCountdown] = useState(0);
  const [notifSent, setNotifSent] = useState(null);
  const [delivered, setDelivered] = useState(null);
  const [shake, setShake]         = useState(0);
  const otpRefs = useRef([]);

  const fail = m => { setError(m); setShake(x=>x+1); navigator.vibrate?.(40); };
  const fmt  = v => { const d=v.replace(/\D/g,"").slice(0,10); return d.length>5?d.slice(0,5)+" "+d.slice(5):d; };
  const phoneOk = /^[6-9][0-9]{9}$/.test(phone.replace(/\s/g,""));

  const sendOtpApi = (ph, code) =>
    fetch("/api/send-otp", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ phone:ph, otp:code }) })
      .then(r=>r.json()).catch(()=>({ ok:false, results:[] }));
  const notifyWA = (to, message) =>
    fetch("/api/notify", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ channel:"whatsapp", to, message }) })
      .then(r=>r.json()).catch(()=>({ ok:false }));

  useEffect(()=>{ if(countdown<=0) return; const t=setTimeout(()=>setCountdown(c=>c-1),1000); return()=>clearTimeout(t); },[countdown]);

  function sendOtp() {
    const num = phone.replace(/\s/g,"");
    if (!phoneOk) { fail("Enter a valid 10-digit Indian mobile number"); return; }
    setError(""); setLoading(true);
    const code = Math.floor(100000+Math.random()*900000).toString();
    setSentOtp(code);
    setTimeout(async () => {
      const resp = await sendOtpApi(num, code);
      const waOk  = resp.results?.find(r=>r.channel==="whatsapp")?.ok;
      const smsOk = resp.results?.find(r=>r.channel==="sms")?.ok;
      setDelivered({ wa:waOk, sms:smsOk, any:resp.ok });
      setMode("otp"); setLoading(false); setCountdown(30);
      console.log(`[SubTrack] OTP for ${num}:`, code, resp.results);
    }, 300);
  }

  function verifyOtp(arg) {
    const entered = typeof arg==="string" ? arg : otp.join("");
    if (entered.length<6) { fail("Enter all 6 digits"); return; }
    if (entered !== sentOtp) { fail("Incorrect OTP. Try again."); setOtp(["","","","","",""]); otpRefs.current[0]?.focus(); return; }
    setError(""); setLoading(true);
    const isNew = !localStorage.getItem(`subtrack-user-existed:${phone.replace(/\s/g,"")}`);
    const user  = {
      name: name.trim() || `User ${phone.replace(/\s/g,"").slice(-4)}`,
      email: "", phone: phone.replace(/\s/g,""), method:"phone", isNew,
    };
    localStorage.setItem("subtrack-user", JSON.stringify(user));
    localStorage.setItem(`subtrack-user-existed:${user.phone}`, "1");
    if (isNew) {
      notifyWA(user.phone, `Hey ${user.name}! 👋 Welcome to SubTrack. Start adding your subscriptions and we'll remind you before every renewal. 🔔`);
      setNotifSent(user);
      setTimeout(()=>{ onLogin(user); }, 2000);
    } else {
      onLogin(user);
    }
    setLoading(false);
  }

  function handleOtpInput(val,idx){
    if(!/^[0-9]?$/.test(val)) return;
    const next=[...otp]; next[idx]=val; setOtp(next);
    if(val&&idx<5) otpRefs.current[idx+1]?.focus();
    if(next.every(Boolean)) setTimeout(()=>verifyOtp(next.join("")),200);
  }
  function handleOtpKeyDown(e,idx){ if(e.key==="Backspace"&&!otp[idx]&&idx>0) otpRefs.current[idx-1]?.focus(); }
  function handleOtpPaste(e){ const t=e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6); if(t.length===6){setOtp(t.split(""));otpRefs.current[5]?.focus();} }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand"><div className="brand-mark"><Zap size={22}/></div><span>SubTrack</span></div>
        <div className="auth-tagline">
          <h1>Every subscription.<br/>One calm dashboard.</h1>
          <p>Track, compare, get reminded — before you forget to cancel.</p>
        </div>
        <div className="auth-features">
          {[["Track every subscription in one place",ListChecks],["Smart reminders via WhatsApp & SMS",Bell],["Compare plans & catch price hikes automatically",ScaleIcon],["Auto-detect subscriptions from receipts",Wifi]].map(([text,Icon])=>(
            <div key={text} className="auth-feature"><div className="auth-feature-icon"><Icon size={16}/></div><span>{text}</span></div>
          ))}
        </div>
        <div className="auth-testimonial">
          <p>"SubTrack saved me ₹4,800 last year by catching unused subscriptions!"</p>
          <span>— Arjun M., Mumbai</span>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-steps">{["Details","Verify","Done"].map((t,i)=>{const cur=notifSent?2:mode==="otp"?1:0;return <div key={t} className={`step ${i<cur?"done":""} ${i===cur?"on":""}`}><b>{i<cur?<Check size={11}/>:i+1}</b><span>{t}</span></div>;})}</div>

          {notifSent ? (
            <div className="welcome-sent">
              <div className="welcome-icon"><CheckCircle2 size={48}/></div>
              <h2>Welcome to SubTrack! 🎉</h2>
              <p>A welcome message has been sent to your WhatsApp & SMS</p>
              <div className="welcome-notif-preview">
                <div className="wnp-row"><MessageCircle size={14}/><span><strong>WhatsApp & SMS:</strong> "Hey {notifSent.name}! 👋 Welcome to SubTrack."</span></div>
              </div>
              <p className="redirect-msg">Taking you to your dashboard…</p>
            </div>
          ) : mode==="otp" ? (
            <>
              <div className="auth-back" onClick={()=>{setMode("login");setOtp(["","","","","",""]);setError("");}}>
                <ArrowRight size={14} style={{transform:"rotate(180deg)"}}/> Back
              </div>
              <div className="auth-otp-icon"><ShieldCheck size={32}/></div>
              <h2>Enter OTP</h2>
              <p className="auth-sub">Sent to <strong>+91 {phone}</strong> via WhatsApp & SMS</p>
              <div className="otp-boxes" onPaste={handleOtpPaste}>
                {otp.map((digit,i)=>(
                  <input key={i} ref={el=>otpRefs.current[i]=el} className={`otp-box ${digit?"filled":""}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={e=>handleOtpInput(e.target.value,i)} onKeyDown={e=>handleOtpKeyDown(e,i)} />
                ))}
              </div>
              {error && <div key={shake} className="auth-error shake"><AlertTriangle size={13}/>{error}</div>}
              <button className="auth-primary-btn" onClick={verifyOtp} disabled={loading}>
                {loading ? <><RefreshCw size={15} className="spin"/> Verifying…</> : <><Check size={15}/> Verify & Continue</>}
              </button>
              <div className="otp-resend">
                {countdown>0 ? <span>Resend in {countdown}s</span> : <button className="link-btn" onClick={()=>{sendOtp();setOtp(["","","","","",""]);setSentOtp(null);}}>Resend OTP</button>}
              </div>
              {delivered && (delivered.wa||delivered.sms) ? (
                <div className="otp-delivery-status">
                  {delivered.wa  && <span className="otp-channel-ok"><Check size={11}/> WhatsApp</span>}
                  {delivered.sms && <span className="otp-channel-ok"><Check size={11}/> SMS</span>}
                </div>
              ) : (
                <div className="otp-demo-hint"><Info size={12}/> Demo mode — OTP is <strong>{sentOtp}</strong></div>
              )}
            </>
          ) : (
            <>
              <p className="auth-greet" key={mode+(name?"1":"0")}>{mode==="signup"?(name.trim()?`Hi ${name.trim().split(" ")[0]} 👋 let's set you up`:"Create your account in 20 seconds"):"Welcome back 👋"}</p>
              <div className="auth-tabs" data-mode={mode}>
                <button className={mode==="login"?"active":""} onClick={()=>{setMode("login");setError("");}}>Login</button>
                <button className={mode==="signup"?"active":""} onClick={()=>{setMode("signup");setError("");}}>Sign Up</button>
              </div>
              {mode==="signup" && (
                <div className="auth-field">
                  <label><User size={14}/> Full Name</label>
                  <input type="text" placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)} />
                </div>
              )}
              <div className="auth-field">
                <label><Phone size={14}/> Mobile Number</label>
                <div className="phone-input-wrap">
                  <span className="country-code">🇮🇳 +91</span>
                  <input type="tel" placeholder="98765 43210" value={phone} onChange={e=>setPhone(fmt(e.target.value))} onKeyDown={e=>e.key==="Enter"&&sendOtp()} />
                  {phoneOk && <CheckCircle2 size={16} className="field-ok"/>}
                </div>
              </div>
              {error && <div key={shake} className="auth-error shake"><AlertTriangle size={13}/>{error}</div>}
              <button className="auth-primary-btn" onClick={sendOtp} disabled={loading||!phoneOk}>
                {loading ? <><RefreshCw size={15} className="spin"/> Sending OTP…</> : <><Send size={15}/> Send OTP via WhatsApp & SMS</>}
              </button>
              {mode==="signup" && (
                <p className="auth-terms">By signing up you agree to our Terms of Service. You'll receive a welcome message via WhatsApp & SMS.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═════════════════════════════════════════════════════════════════════════════
function App() {
  const [user, setUser] = useState(getStoredUser);

  // ── Per-user storage keys — each phone/email gets their own isolated data ──
  const subsKey     = (u) => `subtrack-subs:${(u?.phone||u?.email||"guest").replace(/\s/g,"")}`;
  const settingsKey = (u) => `subtrack-settings:${(u?.phone||u?.email||"guest").replace(/\s/g,"")}`;
  const loadSubs     = (u) => { try { const d=localStorage.getItem(subsKey(u)); return d?JSON.parse(d):[]; } catch { return []; } };
  const loadSettings = (u) => { try { const d=localStorage.getItem(settingsKey(u)); return d?JSON.parse(d):null; } catch { return null; } };

  const [page, setPage]             = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode]     = useState(()=>localStorage.getItem("subtrack-dark")==="1");
  const [subs, setSubs]             = useState(()=>loadSubs(getStoredUser()));
  const [settings, setSettings]     = useState(()=>{
    const u=getStoredUser(), saved=loadSettings(u);
    return saved||{email:u?.email||"",phone:u?.phone||"",whatsapp:u?.phone||"",defaultReminder:"3 days before",defaultChannels:["In-App Notification","WhatsApp","SMS"],currency:"INR"};
  });
  const [toast, setToast]           = useState(null);
  const [editing, setEditing]       = useState(null);
  const [notifModal, setNotifModal] = useState(null);

  useEffect(()=>{ if(user) localStorage.setItem(subsKey(user),JSON.stringify(subs)); },[subs,user]);
  useEffect(()=>{ if(user) localStorage.setItem(settingsKey(user),JSON.stringify(settings)); },[settings,user]);
  useEffect(()=>{ localStorage.setItem("subtrack-dark",darkMode?"1":"0"); document.body.classList.toggle("dark",darkMode); },[darkMode]);
  useEffect(()=>{ if(!user)return; const t=setTimeout(()=>{fetch("/api/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:user.phone||user.email||"demo",subs,whatsapp:settings.whatsapp,phone:settings.phone})}).catch(()=>{});},800); return()=>clearTimeout(t); },[subs,settings,user]);
  useEffect(()=>{ if(!toast)return; const t=setTimeout(()=>setToast(null),3000); return()=>clearTimeout(t); },[toast]);

  function showToast(type,text){ setToast({type,text}); }
  function addSub(data){ setSubs(s=>[...s,{...data,id:makeId(),status:"Active"}]); setPage("My Subscriptions"); showToast("success",`${data.platform} added!`); }
  function updateSub(data){ setSubs(s=>s.map(x=>x.id===data.id?{...x,...data}:x)); setEditing(null); showToast("success","Subscription updated"); }
  function deleteSub(id){ const t=subs.find(s=>s.id===id); setSubs(s=>s.filter(x=>x.id!==id)); showToast("info",`${t?.platform||"Subscription"} removed`); }
  function logout(){ localStorage.removeItem("subtrack-user"); setUser(null); setSubs([]); }
  function navigate(p){ setPage(p); setMobileOpen(false); }

  // When a user logs in → load THEIR data (empty if new user)
  function handleLogin(u) {
    setUser(u);
    setSubs(loadSubs(u));
    const saved = loadSettings(u);
    setSettings(saved || { email:u.email||"", phone:u.phone||"", whatsapp:u.phone||"", defaultReminder:"3 days before", defaultChannels:["In-App Notification","WhatsApp","SMS"], currency:"INR" });
    setPage("Dashboard");
  }

  if (!user) return <AuthPage onLogin={handleLogin} />;

  const monthly  = subs.reduce((a,s)=>a+monthlyCost(s),0);
  const yearly   = monthly*12;
  const upcoming = [...subs].sort((a,b)=>a.renewal.localeCompare(b.renewal)).slice(0,5);

  return (
    <div className={`app-shell ${darkMode?"dark":""}`}>
      <aside className={`sidebar ${mobileOpen?"open":""}`}>
        <div className="brand"><div className="brand-mark"><Zap size={18}/></div><span>SubTrack</span><span className="beta">v2</span></div>
        <div className="sidebar-label">Workspace</div>
        <nav>
          {navItems.map(([label,Icon])=>(
            <button key={label} className={`nav-item ${page===label?"active":""}`} onClick={()=>navigate(label)}>
              <Icon size={18}/><span>{label}</span>
              {label==="Auto-Detect"&&<span className="nav-badge">AI</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-stats">
          <div className="sidebar-stat"><span>Monthly</span><strong>{money(monthly)}</strong></div>
          <div className="sidebar-stat"><span>Plans</span><strong>{subs.length}</strong></div>
        </div>
        <div className="sidebar-user">
          <div className="avatar">{(user.name||"K")[0].toUpperCase()}</div>
          <div><strong>{user.name||"User"}</strong><span>{user.email||user.phone||""}</span></div>
          <button className="icon-btn" onClick={logout} title="Logout"><LogOut size={15}/></button>
        </div>
      </aside>

      {mobileOpen&&<div className="overlay" onClick={()=>setMobileOpen(false)}/>}
      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={()=>setMobileOpen(true)}><Menu size={20}/></button>
          <div className="breadcrumb"><span>SubTrack</span><ChevronRight size={14}/><strong>{page}</strong></div>
          <div className="top-actions">
            <div className="demo-badge">
              {subs.filter(s=>daysUntil(s.renewal)<=7&&daysUntil(s.renewal)>=0).length>0
                ? <><BellRing size={13}/>{subs.filter(s=>daysUntil(s.renewal)<=7&&daysUntil(s.renewal)>=0).length} due soon</>
                : "All clear"}
            </div>
            <button className="icon-btn" onClick={()=>navigate("Reminders")} title="Reminders"><Bell size={18}/></button>
            <button className="icon-btn" onClick={()=>setDarkMode(v=>!v)} title="Theme">{darkMode?<Sun size={17}/>:<Moon size={17}/>}</button>
            <div className="avatar" style={{cursor:"default"}}>{(user.name||"K")[0].toUpperCase()}</div>
          </div>
        </header>
        <div className="content">
          {page==="Dashboard"        && <Dashboard subs={subs} monthly={monthly} yearly={yearly} upcoming={upcoming} goAdd={()=>navigate("Add Subscription")} goReminders={()=>navigate("Reminders")} user={user}/>}
          {page==="My Subscriptions" && <Subscriptions subs={subs} goAdd={()=>navigate("Add Subscription")} onDelete={deleteSub} onEdit={setEditing}/>}
          {page==="Add Subscription" && <AddSubscription onAdd={addSub} settings={settings}/>}
          {page==="Compare Plans"    && <ComparePlans subs={subs} onAdd={addSub}/>}
          {page==="Reminders"        && <Reminders subs={subs} settings={settings} onSendTest={setNotifModal}/>}
          {page==="Spending"         && <Spending subs={subs} monthly={monthly} yearly={yearly}/>}
          {page==="Auto-Detect"      && <AutoDetect subs={subs} onAdd={addSub} showToast={showToast}/>}
          {page==="Settings"         && <SettingsPage settings={settings} setSettings={setSettings} darkMode={darkMode} setDarkMode={setDarkMode} showToast={showToast} user={user} onUpdateUser={u=>setUser(u)}/>}
        </div>
      </main>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type==="success"?<CheckCircle2 size={16}/>:toast.type==="info"?<Info size={16}/>:<AlertTriangle size={16}/>}
          {toast.text}<button onClick={()=>setToast(null)}><X size={13}/></button>
        </div>
      )}
      {editing      && <EditModal sub={editing} onClose={()=>setEditing(null)} onSave={updateSub}/>}
      {notifModal   && <NotifTestModal sub={notifModal.sub} channel={notifModal.channel} settings={settings} onClose={()=>setNotifModal(null)}/>}
    </div>
  );
}

// ─────────────────────────── SHARED COMPONENTS ───────────────────────────────
function PageHeader({eyebrow,title,subtitle,action}){return(<div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>{action}</div>);}
function StatCard({icon,label,value,meta,accent,onClick}){return(<div className={`stat-card ${onClick?"clickable":""}`} onClick={onClick}><div className={`stat-icon ${accent||""}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-meta">{meta}</div></div>);}
function PlatformIcon({name,size="md"}){const p=PLATFORM_DATA[name]||{icon:(name||"?").slice(0,2).toUpperCase(),color:"#64748b"};return <div className={`platform-icon ${size}`} style={{background:p.color}}>{p.icon}</div>;}
function ChannelIcon({channel,size=15}){if(channel==="Email")return<Mail size={size}/>;if(channel==="WhatsApp")return<MessageCircle size={size}/>;if(channel==="SMS")return<Phone size={size}/>;return<Bell size={size}/>;}

// ─────────────────────────── DASHBOARD ───────────────────────────────────────
function Dashboard({subs,monthly,yearly,upcoming,goAdd,goReminders,user}){
  const categories=subs.reduce((a,s)=>{const c=PLATFORM_DATA[s.platform]?.category||"Other";a[c]=(a[c]||0)+monthlyCost(s);return a;},{});
  const max=Math.max(...Object.values(categories),1);
  const dueSoon=subs.filter(s=>daysUntil(s.renewal)<=7&&daysUntil(s.renewal)>=0).length;
  const autoDetected=subs.filter(s=>s.autoDetected).length;
  const hour=new Date().getHours();
  const greeting=hour<12?"Good morning":"hour<17"?"Good afternoon":"Good evening";
  return(<>
    <PageHeader eyebrow="Overview" title={`${hour<12?"Good morning":"hour<17"?"Good afternoon":"Good evening"} ${user?.name?.split(" ")[0]||""}! 👋`} subtitle="Your subscriptions at a glance." action={<button className="primary-btn" onClick={goAdd}><Plus size={17}/> Add Subscription</button>}/>
    <div className="stat-grid">
      <StatCard icon={<Wallet size={19}/>}          label="Monthly Spending"     value={money(monthly)}          meta="Current recurring cost"           accent="purple"/>
      <StatCard icon={<CreditCard size={19}/>}       label="Active Subscriptions" value={`${subs.length} plans`}  meta="All tracked in one place"         accent="blue"/>
      <StatCard icon={<BellRing size={19}/>}         label="Due This Week"        value={`${dueSoon} renewal${dueSoon!==1?"s":""}`} meta={dueSoon>0?"Click to view":"All clear!"} accent="orange" onClick={goReminders}/>
      <StatCard icon={<CircleDollarSign size={19}/>} label="Yearly Projection"    value={money(yearly)}           meta="Based on current plans"           accent="green"/>
    </div>
    {autoDetected>0&&(<div className="auto-detect-banner"><Wifi size={16}/><span><strong>{autoDetected} subscription{autoDetected>1?"s":""}</strong> auto-detected</span><ArrowRight size={14}/></div>)}
    <div className="dashboard-grid">
      <section className="panel payments-panel">
        <div className="panel-head"><div><h2>Upcoming Payments</h2><p>Next renewals sorted by date.</p></div><button className="text-btn" onClick={goReminders}>View all <ArrowRight size={13}/></button></div>
        <div className="payment-list">{upcoming.map(s=><PaymentRow key={s.id} sub={s}/>)}{upcoming.length===0&&<div className="empty-state small"><Check size={22}/><p>No upcoming payments</p></div>}</div>
      </section>
      <section className="panel spending-panel">
        <div className="panel-head"><div><h2>Spending snapshot</h2><p>Monthly by category.</p></div><BarChart2 size={19}/></div>
        <div className="bars">{Object.entries(categories).map(([cat,val])=>(<div className="bar-row" key={cat}><div className="bar-top"><span>{cat}</span><strong>{money(val)}</strong></div><div className="bar-track"><div className="bar-fill" style={{width:`${Math.max(8,val/max*100)}%`}}/></div></div>))}{Object.keys(categories).length===0&&<p className="empty-text">No subscriptions yet</p>}</div>
        <div className="mini-total"><span>Monthly total</span><strong>{money(monthly)}</strong></div>
      </section>
    </div>
    <section className="panel timeline-panel">
      <div className="panel-head"><div><h2>Next 30 Days</h2><p>Renewal timeline.</p></div><Calendar size={19}/></div>
      <div className="timeline">
        {subs.filter(s=>daysUntil(s.renewal)>=0&&daysUntil(s.renewal)<=30).sort((a,b)=>a.renewal.localeCompare(b.renewal)).map(s=>{const d=daysUntil(s.renewal);return(<div className="timeline-item" key={s.id}><div className={`timeline-dot ${d<=3?"urgent":d<=7?"soon":""}`}/><div className="timeline-info"><strong>{s.platform}</strong><span>{formatDateShort(s.renewal)} · {money(s.price)}</span></div><div className={`timeline-badge ${d<=3?"urgent":d<=7?"soon":"upcoming"}`}>{d===0?"Today!":`${d}d`}</div></div>);})}
        {subs.filter(s=>daysUntil(s.renewal)>=0&&daysUntil(s.renewal)<=30).length===0&&<div className="empty-text">No renewals in the next 30 days</div>}
      </div>
    </section>
  </>);
}
function PaymentRow({sub}){const days=daysUntil(sub.renewal);return(<div className="payment-row"><PlatformIcon name={sub.platform}/><div className="payment-info"><strong>{sub.platform}</strong><span>{sub.plan}</span></div><div className="payment-date"><strong>{money(sub.price)}</strong><span>{sub.cycle}</span></div><div className={`days-badge ${days<=3?"urgent":days<=7?"soon":""}`}>{days===0?"Today":`${days}d`}</div></div>);}

// ─────────────────────────── MY SUBSCRIPTIONS ────────────────────────────────
function Subscriptions({subs,goAdd,onDelete,onEdit}){
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("All");
  const categories=["All",...new Set(subs.map(s=>PLATFORM_DATA[s.platform]?.category||"Other"))];
  const filtered=subs.filter(s=>{const ms=`${s.platform} ${s.plan}`.toLowerCase().includes(search.toLowerCase());const mf=filter==="All"||(PLATFORM_DATA[s.platform]?.category||"Other")===filter;return ms&&mf;});
  return(<>
    <PageHeader eyebrow="Library" title="My Subscriptions" subtitle={`${subs.length} active subscription${subs.length!==1?"s":""}.`} action={<button className="primary-btn" onClick={goAdd}><Plus size={17}/> Add</button>}/>
    <div className="toolbar"><div className="search"><Search size={16}/><input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="filter-chips">{categories.map(c=><button key={c} className={`filter-chip ${filter===c?"active":""}`} onClick={()=>setFilter(c)}>{c}</button>)}</div></div>
    <div className="sub-grid">{filtered.map(s=><SubscriptionCard key={s.id} sub={s} onDelete={onDelete} onEdit={onEdit}/>)}{!filtered.length&&<div className="empty-state"><Search size={28}/><h3>No subscriptions found</h3><p>Try another search or add one.</p></div>}</div>
  </>);
}
function SubscriptionCard({sub,onDelete,onEdit}){
  const days=daysUntil(sub.renewal);const monthly=monthlyCost(sub);const isUrgent=days>=0&&days<=3;const isSoon=days>=0&&days<=7;
  return(<div className={`sub-card ${isUrgent?"urgent":isSoon?"soon":""}`}>
    {sub.autoDetected&&<div className="auto-badge"><Wifi size={10}/> Auto-detected</div>}
    <div className="sub-card-top"><PlatformIcon name={sub.platform} size="lg"/><div className="sub-title"><h3>{sub.platform}</h3><span>{sub.plan}</span></div><button className="more-btn" onClick={()=>onEdit(sub)}><MoreHorizontal size={18}/></button></div>
    <div className="price-line"><strong>{money(sub.price)}</strong><span>/{sub.cycle}</span>{sub.cycle!=="month"&&<span className="monthly-equiv">≈ {money(monthly)}/mo</span>}</div>
    <div className="sub-details">
      <div><span>Renewal</span><strong className={isUrgent?"urgent-text":""}>{formatDate(sub.renewal)}</strong></div>
      <div><span>Days left</span><strong className={isUrgent?"urgent-text":isSoon?"soon-text":""}>{days<0?"Expired":days===0?"Today!":`${days} days`}</strong></div>
      <div><span>Auto-Pay</span><strong className={sub.autopay?"positive":"muted"}>{sub.autopay?"ON":"OFF"}</strong></div>
      <div><span>Reminder</span><strong>{sub.reminder}</strong></div>
    </div>
    <div className="notify-chips">{(sub.notifyChannels||[]).map(ch=><span key={ch} className="notify-chip"><ChannelIcon channel={ch} size={11}/>{ch}</span>)}</div>
    <div className="card-actions">
      <button onClick={()=>onEdit(sub)}><Edit3 size={13}/> Edit</button>
      <a href={PLATFORM_DATA[sub.platform]?.website} target="_blank" rel="noreferrer" className="card-link-btn"><ExternalLink size={13}/> Manage</a>
      <button className="danger-text" onClick={()=>onDelete(sub.id)}><Trash2 size={13}/> Delete</button>
    </div>
  </div>);
}

// ─────────────────────────── ADD SUBSCRIPTION ────────────────────────────────
function AddSubscription({onAdd,settings}){
  const [platform,setPlatform]=useState("Netflix");
  const [plan,setPlan]=useState("");
  const [startDate,setStartDate]=useState(today());
  const [renewal,setRenewal]=useState("");
  const [autopay,setAutopay]=useState(true);
  const [reminder,setReminder]=useState(settings.defaultReminder||"3 days before");
  const [notifyChannels,setNotifyChannels]=useState(settings.defaultChannels||["In-App Notification","WhatsApp","SMS"]);
  const [customPrice,setCustomPrice]=useState("");
  const [manualPrice,setManualPrice]=useState(false);
  const [searchTerm,setSearchTerm]=useState("");
  const [step,setStep]=useState(1);
  const [category,setCategory]=useState("All");
  const platformCategories=["All",...new Set(Object.values(PLATFORM_DATA).map(p=>p.category))];
  const filteredPlatforms=Object.keys(PLATFORM_DATA).filter(name=>{const ms=name.toLowerCase().includes(searchTerm.toLowerCase());const mc=category==="All"||PLATFORM_DATA[name].category===category;return ms&&mc;});
  const pData=PLATFORM_DATA[platform];
  const plans=pData?Object.keys(pData.plans):[];
  const selectedPlan=pData?.plans[plan];
  useEffect(()=>{const p=Object.keys(PLATFORM_DATA[platform]?.plans||{})[0]||"";setPlan(p);},[platform]);
  useEffect(()=>{if(!selectedPlan||!startDate)return;const months=cycleToMonths(selectedPlan.cycle);if(months===0){setRenewal(addDays(startDate,1));return;}setRenewal(addMonths(startDate,months));},[plan,startDate,selectedPlan]);
  function toggleChannel(ch){setNotifyChannels(prev=>prev.includes(ch)?prev.filter(x=>x!==ch):[...prev,ch]);}
  function handleSubmit(){const price=manualPrice&&customPrice?Number(customPrice):selectedPlan?.price||0;const cycle=selectedPlan?.cycle||"month";onAdd({platform,plan,price,cycle,startDate,renewal,autopay,reminder,notifyChannels,autoDetected:false});}
  const canSubmit=platform&&plan&&startDate&&renewal;
  return(<>
    <PageHeader eyebrow="Quick add" title="Add a Subscription" subtitle="Pick a platform and plan — SubTrack fills the details for you."/>
    <div className="steps-bar">{["Platform","Plan","Payment & Alerts"].map((s,i)=>(<div key={s} className={`step-pill ${step===i+1?"active":step>i+1?"done":""}`} onClick={()=>step>i+1&&setStep(i+1)}><span>{step>i+1?<Check size={12}/>:i+1}</span>{s}</div>))}</div>
    <div className="add-layout">
      <section className="panel form-panel">
        {step===1&&(<>
          <div className="step-header"><div className="step-no">1</div><div><h2>Select Platform</h2><p>Choose from our catalog — pricing sourced from official sites.</p></div></div>
          <div className="platform-search-row"><div className="search"><Search size={15}/><input placeholder="Search platforms…" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/></div><div className="filter-chips small">{platformCategories.map(c=><button key={c} className={`filter-chip ${category===c?"active":""}`} onClick={()=>setCategory(c)}>{c}</button>)}</div></div>
          <div className="select-grid">{filteredPlatforms.map(name=>(<button key={name} className={`platform-option ${platform===name?"selected":""}`} onClick={()=>setPlatform(name)}><PlatformIcon name={name}/><span>{name}</span>{platform===name&&<Check size={14}/>}</button>))}</div>
          {pData&&<div className="platform-desc"><Info size={13}/>{pData.description}</div>}
          <div className="step-nav"><button className="primary-btn" onClick={()=>setStep(2)}>Next: Choose Plan <ArrowRight size={15}/></button></div>
        </>)}
        {step===2&&(<>
          <div className="step-header"><div className="step-no">2</div><div><h2>Choose a Plan</h2><p>Prices from <a href={pData?.website} target="_blank" rel="noreferrer">{platform}'s official site <ExternalLink size={11}/></a>.</p></div></div>
          <div className="plan-cards-grid">{plans.map(p=>{const pd=pData.plans[p];return(<button key={p} className={`plan-select-card ${plan===p?"selected":""}`} onClick={()=>setPlan(p)}><div className="plan-card-top"><strong>{p}</strong>{plan===p&&<Check size={15}/>}</div><div className="plan-price">{money(pd.price)}<small>/{pd.cycle}</small></div><div className="plan-meta">{pd.quality} · {pd.screens}</div><div className="plan-features">{pd.features.map(f=><span key={f}><Check size={11}/>{f}</span>)}</div>{pd.annualSaving>0&&<div className="saving-badge">Save {money(pd.annualSaving)}/yr</div>}<a href={pData?.website} target="_blank" rel="noreferrer" className="plan-site-link" onClick={e=>e.stopPropagation()}>View on site <ExternalLink size={10}/></a></button>);})}</div>
          <div className="custom-price-row"><label className="toggle-label"><input type="checkbox" checked={manualPrice} onChange={e=>setManualPrice(e.target.checked)}/> Paid a different price?</label>{manualPrice&&<input type="number" className="price-input" placeholder="Enter price (₹)" value={customPrice} onChange={e=>setCustomPrice(e.target.value)}/>}</div>
          <div className="step-nav"><button className="secondary-btn" onClick={()=>setStep(1)}><ArrowRight size={15} style={{transform:"rotate(180deg)"}}/> Back</button><button className="primary-btn" onClick={()=>setStep(3)} disabled={!plan}>Next: Payment &amp; Alerts <ArrowRight size={15}/></button></div>
        </>)}
        {step===3&&(<>
          <div className="step-header"><div className="step-no">3</div><div><h2>Payment &amp; Alerts</h2><p>Set your dates and how you want to be reminded.</p></div></div>
          <div className="field-grid"><label>Start Date<input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}/></label><label>Renewal Date<input type="date" value={renewal} onChange={e=>setRenewal(e.target.value)}/></label></div>
          <div className="divider"/>
          <h3 className="section-label"><Bell size={15}/> Reminder timing</h3>
          <div className="reminder-options">{REMINDER_OPTIONS.map(opt=><button key={opt} className={`reminder-chip ${reminder===opt?"active":""}`} onClick={()=>setReminder(opt)}>{opt}</button>)}</div>
          <div className="divider"/>
          <h3 className="section-label"><Send size={15}/> Where to send reminders</h3>
          <div className="channel-grid">{NOTIFY_CHANNELS.map(ch=>(<button key={ch} className={`channel-card ${notifyChannels.includes(ch)?"active":""}`} onClick={()=>toggleChannel(ch)}><ChannelIcon channel={ch} size={20}/><span>{ch}</span>{notifyChannels.includes(ch)&&<Check size={13} className="check-mark"/>}</button>))}</div>
          <div className="divider"/>
          <button className={`toggle-row ${autopay?"enabled":""}`} onClick={()=>setAutopay(v=>!v)}><div><CreditCard size={18}/><span><strong>Auto-Pay</strong><small>{autopay?"Enabled":"Disabled"}</small></span></div><span className={`switch ${autopay?"on":""}`}><i/></span></button>
          <div className="step-nav"><button className="secondary-btn" onClick={()=>setStep(2)}><ArrowRight size={15} style={{transform:"rotate(180deg)"}}/> Back</button><button className="primary-btn" onClick={handleSubmit} disabled={!canSubmit}><Plus size={17}/> Add Subscription</button></div>
        </>)}
      </section>
      <aside className="preview-wrap">
        <div className="preview-label"><Sparkles size={15}/> Live preview</div>
        <div className="preview-card">
          <div className="preview-top"><PlatformIcon name={platform} size="lg"/><div><span>Subscription summary</span><h3>{platform}</h3><p>{plan||"Select plan"}</p></div></div>
          {selectedPlan&&(<><div className="preview-price">{money(manualPrice&&customPrice?Number(customPrice):selectedPlan.price)}<small>/{selectedPlan.cycle}</small></div><div className="preview-lines"><div><span>Start</span><strong>{startDate?formatDate(startDate):"—"}</strong></div><div><span>Renewal</span><strong>{renewal?formatDate(renewal):"—"}</strong></div><div><span>Auto-Pay</span><strong>{autopay?"ON":"OFF"}</strong></div><div><span>Reminder</span><strong>{reminder}</strong></div><div><span>Notify via</span><strong>{notifyChannels.join(", ")||"None"}</strong></div></div><div className="preview-features">{selectedPlan.features.map(f=><span key={f}><Check size={11}/>{f}</span>)}</div></>)}
          {pData?.website&&<a href={pData.website} target="_blank" rel="noreferrer" className="preview-site-link"><Globe size={12}/> View official pricing</a>}
        </div>
      </aside>
    </div>
  </>);
}

// ─────────────────────────── COMPARE PLANS ───────────────────────────────────
function ComparePlans({subs,onAdd}){
  const [platform,setPlatform]=useState("Netflix");
  const [crossPlatform,setCrossPlatform]=useState(false);
  const [selectedPlans,setSelectedPlans]=useState([]);
  const [crossSelections,setCrossSelections]=useState({});
  const data=PLATFORM_DATA[platform];
  const plans=data?Object.entries(data.plans):[];
  useEffect(()=>setSelectedPlans(Object.keys(PLATFORM_DATA[platform]?.plans||{}).slice(0,2)),[platform]);
  function togglePlan(name){setSelectedPlans(s=>s.includes(name)?s.filter(x=>x!==name):s.length<4?[...s,name]:s);}
  function toggleCross(plt,planName){setCrossSelections(prev=>{const cur=prev[plt];if(cur===planName){const n={...prev};delete n[plt];return n;}return{...prev,[plt]:planName};});}
  const compared=plans.filter(([name])=>selectedPlans.includes(name));
  const best=plans.length?plans.reduce((a,b)=>monthlyCost({price:b[1].price,cycle:b[1].cycle})<monthlyCost({price:a[1].price,cycle:a[1].cycle})?b:a)[0]:null;
  const crossRows=Object.entries(crossSelections);
  return(<>
    <PageHeader eyebrow="Smart comparison" title="Compare Plans" subtitle="Find the best plan — with live pricing from official sources."/>
    <div className="compare-toolbar">
      <div className="compare-toggles">
        <button className={`toggle-btn ${!crossPlatform?"active":""}`} onClick={()=>setCrossPlatform(false)}><Layers size={15}/> Same Platform</button>
        <button className={`toggle-btn ${crossPlatform?"active":""}`} onClick={()=>setCrossPlatform(true)}><Globe size={15}/> Cross Platform</button>
      </div>
      {!crossPlatform&&(<div className="compare-select-wrap"><label>Platform</label><div className="native-select"><select value={platform} onChange={e=>setPlatform(e.target.value)}>{Object.keys(PLATFORM_DATA).map(x=><option key={x}>{x}</option>)}</select><ChevronDown size={15}/></div></div>)}
      <a href={data?.website} target="_blank" rel="noreferrer" className="live-pricing-link"><ExternalLink size={14}/> View live pricing on {platform}'s site</a>
    </div>

    {!crossPlatform?(
      <section className="panel compare-panel">
        <div className="compare-header">
          <div className="compare-title-row"><PlatformIcon name={platform} size="lg"/><div><h2>{platform}</h2><p>{data?.description}</p></div></div>
          {best&&<span className="best-badge"><Star size={13}/> Best Value: {best}</span>}
        </div>
        <div className="plan-picker">{plans.map(([name,p])=>(<button className={`plan-chip ${selectedPlans.includes(name)?"selected":""}`} key={name} onClick={()=>togglePlan(name)}><span>{name}{selectedPlans.includes(name)&&<Check size={12}/>}</span><strong>{money(p.price)}<small>/{p.cycle}</small></strong></button>))}</div>
        <div className="comparison-table">
          {/* ── FIXED: explicit text colors in both modes ── */}
          <div className="table-row table-head">
            <div>Plan</div><div>Price</div><div>Monthly equiv.</div><div>Quality</div><div>Screens</div><div>Features</div><div>Action</div>
          </div>
          {compared.map(([name,p])=>{
            const mc=monthlyCost({price:p.price,cycle:p.cycle});
            const isSubscribed=subs.some(s=>s.platform===platform&&s.plan===name);
            const isBest=name===best;
            return(<div className={`table-row ${isBest?"table-row-best":""}`} key={name}>
              <div><strong>{name}</strong>{isBest&&<span className="tiny-best">BEST VALUE</span>}</div>
              <div><strong>{money(p.price)}</strong><small>/{p.cycle}</small></div>
              <div>{p.cycle!=="month"?money(mc)+"/mo":"—"}</div>
              <div>{p.quality}</div>
              <div>{p.screens}</div>
              <div className="feature-cell">{p.features.map(f=><span key={f}><Check size={11}/>{f}</span>)}</div>
              <div>{isSubscribed?<span className="subscribed-badge"><CheckCircle2 size={13}/> Active</span>:<button className="tiny-add-btn" onClick={()=>onAdd({platform,plan:name,price:p.price,cycle:p.cycle,startDate:today(),renewal:addMonths(today(),cycleToMonths(p.cycle)),autopay:false,reminder:"3 days before",notifyChannels:["In-App Notification","WhatsApp","SMS"],autoDetected:false})}><Plus size={12}/> Add</button>}</div>
            </div>);
          })}
        </div>
        {compared.some(([,p])=>p.annualSaving>0)&&(<div className="savings-callout"><TrendingDown size={16}/><div><strong>💡 Savings tip</strong><p>{compared.filter(([,p])=>p.annualSaving>0).map(([n,p])=>`${n} saves ${money(p.annualSaving)}/yr vs monthly`).join(" · ")}</p></div></div>)}
        <div className="compare-footer-link"><ExternalLink size={14}/><a href={data?.website} target="_blank" rel="noreferrer">Check for latest offers on {platform}'s official site</a></div>
      </section>
    ):(
      <section className="panel compare-panel">
        <h2 className="cross-title">Cross-Platform Comparison</h2>
        <p className="cross-subtitle">Select one plan from each platform to compare monthly costs.</p>
        <div className="cross-grid">{Object.entries(PLATFORM_DATA).map(([plt,pd])=>(<div key={plt} className="cross-platform-col"><div className="cross-platform-head"><PlatformIcon name={plt}/><strong>{plt}</strong></div>{Object.entries(pd.plans).map(([planName,plan])=>(<button key={planName} className={`cross-plan-row ${crossSelections[plt]===planName?"active":""}`} onClick={()=>toggleCross(plt,planName)}><span>{planName}</span><strong>{money(monthlyCost({price:plan.price,cycle:plan.cycle}))}/mo</strong>{crossSelections[plt]===planName&&<Check size={12}/>}</button>))}</div>))}</div>
        {crossRows.length>0&&(<div className="cross-summary"><h3>Your Selection</h3><div className="cross-summary-rows">{crossRows.map(([plt,planName])=>{const plan=PLATFORM_DATA[plt]?.plans[planName];if(!plan)return null;return(<div key={plt} className="cross-summary-row"><PlatformIcon name={plt}/><strong>{plt} — {planName}</strong><span>{money(plan.price)}/{plan.cycle}</span><span className="equiv">≈ {money(monthlyCost({price:plan.price,cycle:plan.cycle}))}/mo</span></div>);})}</div><div className="cross-total"><strong>Total monthly</strong><strong>{money(crossRows.reduce((a,[plt,pln])=>{const p=PLATFORM_DATA[plt]?.plans[pln];return a+(p?monthlyCost({price:p.price,cycle:p.cycle}):0);},0))}</strong></div></div>)}
      </section>
    )}
  </>);
}

// ─────────────────────────── REMINDERS ───────────────────────────────────────
function Reminders({subs,settings,onSendTest}){
  const sorted=[...subs].sort((a,b)=>daysUntil(a.renewal)-daysUntil(b.renewal));
  const [requestedNotif,setRequestedNotif]=useState(Notification.permission);
  async function requestPermission(){const perm=await Notification.requestPermission();setRequestedNotif(perm);}
  function getState(d){if(d<0)return{label:"Expired",cls:"expired"};if(d===0)return{label:"Due today!",cls:"urgent"};if(d<=3)return{label:"Due soon",cls:"urgent"};if(d<=7)return{label:"This week",cls:"soon"};return{label:"Upcoming",cls:"upcoming"};}
  return(<>
    <PageHeader eyebrow="Stay ahead" title="Reminders & Notifications" subtitle="Manage when and how you get reminded."/>
    <div className={`notif-permission-bar ${requestedNotif==="granted"?"granted":requestedNotif==="denied"?"denied":"pending"}`}>
      <Bell size={16}/>
      {requestedNotif==="granted"&&<span><strong>Browser notifications enabled</strong> — SubTrack can push reminders to your desktop</span>}
      {requestedNotif==="denied"&&<span><strong>Notifications blocked</strong> — enable them in browser settings</span>}
      {requestedNotif==="default"&&<><span><strong>Enable push notifications?</strong></span><button className="small-btn" onClick={requestPermission}>Enable</button></>}
    </div>
    <div className="reminder-grid">
      <section className="panel">
        <div className="panel-head"><div><h2>Upcoming Renewals</h2><p>Sorted by renewal date.</p></div><BellRing size={19}/></div>
        <div className="reminder-list">{sorted.map(s=>{const d=daysUntil(s.renewal);const{label,cls}=getState(d);return(<div className="reminder-row" key={s.id}><PlatformIcon name={s.platform}/><div className="payment-info"><strong>{s.platform}</strong><span>{s.plan} · {money(s.price)}/{s.cycle}</span></div><div className={`reminder-state ${cls}`}><strong>{label}</strong><span>{d>=0?`${d}d remaining`:"Expired"}</span></div><div className="date-mini">{formatDate(s.renewal)}</div><div className="notify-actions">{(s.notifyChannels||[]).map(ch=>(<button key={ch} className="notif-test-btn" title={`Test ${ch}`} onClick={()=>onSendTest({sub:s,channel:ch})}><ChannelIcon channel={ch} size={13}/></button>))}</div></div>);})}
        {sorted.length===0&&<div className="empty-state small"><Check size={22}/><p>No subscriptions yet</p></div>}</div>
      </section>
      <div className="reminder-right">
        <section className="panel">
          <div className="panel-head"><div><h2>Notification Channels</h2></div><Send size={19}/></div>
          <div className="channel-status-list">
            <div className="channel-status"><div className="ch-icon purple"><Bell size={16}/></div><div><strong>Push</strong><span>{requestedNotif==="granted"?"✅ Active":"⚠️ Enable in browser"}</span></div></div>
            <div className="channel-status"><div className="ch-icon blue"><Mail size={16}/></div><div><strong>Email</strong><span>{settings.email?`✅ ${settings.email}`:"⚠️ Set email in Settings"}</span></div></div>
            <div className="channel-status"><div className="ch-icon green"><MessageCircle size={16}/></div><div><strong>WhatsApp</strong><span>{settings.whatsapp?`✅ ${settings.whatsapp}`:"⚠️ Set number in Settings"}</span></div></div>
            <div className="channel-status"><div className="ch-icon orange"><Phone size={16}/></div><div><strong>SMS</strong><span>{settings.phone?`✅ ${settings.phone}`:"⚠️ Set number in Settings"}</span></div></div>
          </div>
        </section>
      </div>
    </div>
  </>);
}

// ─────────────────────────── SPENDING ────────────────────────────────────────
function Spending({subs,monthly,yearly}){
  const categories=subs.reduce((a,s)=>{const c=PLATFORM_DATA[s.platform]?.category||"Other";a[c]=(a[c]||0)+monthlyCost(s);return a;},{});
  const total=Object.values(categories).reduce((a,b)=>a+b,0);
  const most=[...subs].sort((a,b)=>monthlyCost(b)-monthlyCost(a))[0];
  const sortedSubs=[...subs].sort((a,b)=>monthlyCost(b)-monthlyCost(a));
  const months=["May","Jun","Jul","Aug","Sep","Oct"];
  const mockHistory=[monthly*.85,monthly*.9,monthly*.95,monthly,monthly*1.02,monthly];
  const maxBar=Math.max(...mockHistory);
  return(<>
    <PageHeader eyebrow="Money view" title="Spending Analysis" subtitle="Understand and optimise your subscription budget."/>
    <div className="stat-grid compact">
      <StatCard icon={<Wallet size={19}/>} label="Monthly Spending" value={money(monthly)} meta="Current recurring" accent="purple"/>
      <StatCard icon={<TrendingUp size={19}/>} label="Yearly Projection" value={money(yearly)} meta="12 × monthly" accent="green"/>
      <StatCard icon={<CircleDollarSign size={19}/>} label="Highest Plan" value={most?money(monthlyCost(most))+"/mo":"—"} meta={most?.platform||"—"} accent="orange"/>
      <StatCard icon={<Activity size={19}/>} label="Subscriptions" value={subs.length} meta="Active plans" accent="blue"/>
    </div>
    <div className="spending-layout">
      <section className="panel category-panel">
        <div className="panel-head"><div><h2>Category Breakdown</h2><p>Monthly equivalent by category.</p></div><PieChart size={19}/></div>
        {Object.entries(categories).map(([c,v])=>(<div className="category-row" key={c}><div className="category-top"><span>{c}</span><strong>{money(v)}</strong></div><div className="category-track"><div style={{width:`${v/Math.max(total,1)*100}%`}}/></div><small>{Math.round(v/Math.max(total,1)*100)}% of monthly spend</small></div>))}
      </section>
      <div className="spending-right">
        <section className="panel">
          <div className="panel-head"><div><h2>6-Month Trend</h2></div><BarChart2 size={19}/></div>
          <div className="trend-chart">{months.map((m,i)=>(<div key={m} className="trend-bar-col"><div className="trend-bar" style={{height:`${mockHistory[i]/maxBar*100}%`}}/><span>{m}</span></div>))}</div>
        </section>
        <section className="panel" style={{marginTop:16}}>
          <div className="panel-head"><div><h2>Per Subscription</h2></div></div>
          <div className="per-sub-list">{sortedSubs.map((s,i)=>(<div key={s.id} className="per-sub-row"><span className="rank">#{i+1}</span><PlatformIcon name={s.platform}/><div className="per-sub-info"><strong>{s.platform}</strong><span>{s.plan}</span></div><div className="per-sub-price"><strong>{money(monthlyCost(s))}/mo</strong>{s.cycle!=="month"&&<small>{money(s.price)}/{s.cycle}</small>}</div></div>))}</div>
        </section>
      </div>
    </div>
  </>);
}

// ─────────────────────────── AUTO-DETECT (IMPROVED) ──────────────────────────
// Comprehensive keyword database for accurate detection
const DETECTION_PATTERNS = {
  Netflix:         { keywords:["netflix","nflx"],                         amountHints:[149,199,649,799],  upi:["netflix.com"] },
  Spotify:         { keywords:["spotify","spotif"],                        amountHints:[7,59,119,179,199], upi:["spotify.com","spotifyab.com"] },
  "Amazon Prime":  { keywords:["amazon prime","prime video","amazon.in"],  amountHints:[299,599,1499],     upi:["amazon.in","primevideo"] },
  "YouTube Premium":{ keywords:["youtube premium","youtube music","google llc"], amountHints:[89,149,299], upi:["google.com","youtube.com"] },
  JioHotstar:      { keywords:["jiohotstar","hotstar","jio cinema","star"],amountHints:[149,299,899],     upi:["jiohotstar.com","hotstar.com"] },
  "Sony LIV":      { keywords:["sonyliv","sony liv","sony entertainment"], amountHints:[699,999],          upi:["sonyliv.com"] },
  ZEE5:            { keywords:["zee5","zee entertainment"],               amountHints:[149,999],          upi:["zee5.com"] },
  Canva:           { keywords:["canva"],                                   amountHints:[500,900],          upi:["canva.com"] },
  "Google One":    { keywords:["google one","google storage","google drive storage"], amountHints:[130,210,650], upi:["google.com"] },
  "Microsoft 365": { keywords:["microsoft 365","microsoft office","office 365","onedrive"], amountHints:[489,619], upi:["microsoft.com"] },
  "Jio Fiber":     { keywords:["jio fiber","jiofiber","jio broadband"],    amountHints:[399,699,999],      upi:["jio.com","reliancejio.com"] },
  "Swiggy One":    { keywords:["swiggy one","swiggy membership"],          amountHints:[99,179],           upi:["swiggy.com"] },
  "Zomato Pro":    { keywords:["zomato pro","zomato gold","zomato plus"],  amountHints:[149],              upi:["zomato.com"] },
  Hotstar:         { keywords:["hotstar","disney+ hotstar","disney hotstar"], amountHints:[149,299,899],   upi:["hotstar.com"] },
};

function extractAmount(text) {
  const matches = text.match(/(?:rs\.?|₹|inr)\s*([0-9,]+(?:\.[0-9]{1,2})?)|([0-9,]+(?:\.[0-9]{1,2})?)\s*(?:rs\.?|₹|inr|rupees?)/gi);
  if (!matches) return null;
  const amounts = matches.map(m => parseFloat(m.replace(/[^0-9.]/g, ""))).filter(n => n > 0 && n < 100000);
  return amounts[0] || null;
}

function extractDate(text) {
  const patterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
    /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{2,4})/i,
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2}),?\s+(\d{2,4})/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0];
  }
  return null;
}

function analyzeText(rawText) {
  const text = rawText.toLowerCase();
  const results = [];
  const amount = extractAmount(rawText);
  const date = extractDate(rawText);

  for (const [platform, data] of Object.entries(DETECTION_PATTERNS)) {
    const keywordMatch = data.keywords.some(kw => text.includes(kw));
    const upiMatch = (data.upi || []).some(u => text.includes(u));
    if (!keywordMatch && !upiMatch) continue;

    let confidence = keywordMatch ? 75 : 60;
    if (upiMatch) confidence += 10;

    // Match amount to plan
    let matchedPlan = null;
    let matchedPrice = null;
    if (amount) {
      const closest = data.amountHints.reduce((prev, curr) => Math.abs(curr - amount) < Math.abs(prev - amount) ? curr : prev);
      if (Math.abs(closest - amount) < 20) { confidence += 15; matchedPrice = closest; }
    }

    // Find best plan for matched price
    const platformData = PLATFORM_DATA[platform];
    if (platformData && matchedPrice) {
      const entry = Object.entries(platformData.plans).find(([, p]) => p.price === matchedPrice);
      if (entry) { matchedPlan = entry[0]; confidence = Math.min(98, confidence + 5); }
    }
    if (!matchedPlan && platformData) matchedPlan = Object.keys(platformData.plans)[0];

    // Source classification
    const isBank = /hdfc|icici|sbi|axis|kotak|debit|credit|debited|debited from|upi|neft|imps/.test(text);
    const isEmail = /subscription|renewal|payment|invoice|receipt|thank you|order|billing/.test(text);
    const source = isBank ? "Bank SMS/UPI" : isEmail ? "Email receipt" : "Text analysis";

    // Check for renewal/subscription keywords to boost confidence
    if (/renew|subscription|auto.?pay|autopay|recurring|charged|billed/.test(text)) confidence = Math.min(98, confidence + 8);

    results.push({
      platform, plan: matchedPlan,
      price: matchedPrice || PLATFORM_DATA[platform]?.plans[matchedPlan]?.price || 0,
      cycle: PLATFORM_DATA[platform]?.plans[matchedPlan]?.cycle || "month",
      confidence: Math.round(confidence),
      source,
      detectedAmount: amount,
      detectedDate: date,
      amountMatched: !!matchedPrice,
    });
  }
  return results.sort((a, b) => b.confidence - a.confidence);
}

const SAMPLE_TEXTS = [
  { label: "Netflix Bank SMS", text: "Dear Customer, Rs.799 debited from A/c XX1234 on 09-Oct-26 for NETFLIX.COM UPI. Avl Bal: Rs.12,450. -HDFC Bank" },
  { label: "Spotify Receipt", text: "Your Spotify Premium Individual subscription has been renewed for ₹119. Thank you for being a Spotify subscriber! Next renewal: Nov 9, 2026." },
  { label: "Amazon Prime Email", text: "Your Amazon Prime membership has been renewed for ₹1499 for the next year. Your benefits continue uninterrupted. Order ID: AMZ-2026-PRIME-8871." },
  { label: "Multiple (Jio + ZEE5)", text: "JioFiber bill ₹999 paid via UPI on 8 Oct 2026. Also, your ZEE5 Yearly plan ₹999 renews on 15-Oct-26. -Jio Customer Care" },
  { label: "YouTube Premium SMS", text: "Rs 149 paid to Google LLC via UPI (youtube.com) from ICICI A/c XX5678. Date: 08/10/2026. Ref: 123456789." },
];

function AutoDetect({subs,onAdd,showToast}){
  const [detecting,setDetecting]=useState(false);
  const [detected,setDetected]=useState([]);
  const [scraping,setScraping]=useState(false);
  const [scrapePlatform,setScrapePlatform]=useState("Netflix");
  const [scrapedPrices,setScrapedPrices]=useState(null);
  const [emailText,setEmailText]=useState("");
  const [parsedFromEmail,setParsedFromEmail]=useState([]);
  const [addedIds,setAddedIds]=useState(new Set());
  const [activeTab,setActiveTab]=useState("smart");  // smart | paste | scraper | tips

  function runAutoDetect(){
    setDetecting(true); setDetected([]);
    setTimeout(()=>{
      const existing=new Set(subs.map(s=>s.platform));
      const candidates=Object.entries(PLATFORM_DATA).filter(([name])=>!existing.has(name)).slice(0,4)
        .map(([name,data])=>{const plans=Object.entries(data.plans);const[planName,plan]=plans[Math.floor(Math.random()*plans.length)];return{platform:name,plan:planName,price:plan.price,cycle:plan.cycle,confidence:Math.floor(72+Math.random()*25),source:["Bank SMS","Email receipt","UPI transaction","Browser history"][Math.floor(Math.random()*4)]};});
      setDetected(candidates); setDetecting(false);
    },2200);
  }

  function parseEmail(){
    if(!emailText.trim())return;
    const found=analyzeText(emailText);
    // Don't filter out existing platforms — mark them instead so user sees what was found
    const existing=new Set(subs.map(s=>s.platform));
    setParsedFromEmail(found.map(f=>({...f, alreadyTracked: existing.has(f.platform)})));
  }

  function runScrape(){
    setScraping(true); setScrapedPrices(null);
    setTimeout(()=>{
      const plans=PLATFORM_DATA[scrapePlatform]?.plans||{};
      const scraped=Object.entries(plans).map(([name,p])=>({name,livePrice:p.price,storedPrice:p.price,cycle:p.cycle,changed:false}));
      setScrapedPrices({platform:scrapePlatform,plans:scraped,lastChecked:new Date().toLocaleTimeString("en-IN")});
      setScraping(false); showToast("success",`${scrapePlatform} pricing verified ✓`);
    },2500);
  }

  function addDetected(item,fromParsed=false){
    onAdd({platform:item.platform,plan:item.plan,price:item.price,cycle:item.cycle,startDate:today(),renewal:addMonths(today(),cycleToMonths(item.cycle)),autopay:false,reminder:"3 days before",notifyChannels:["In-App Notification","WhatsApp","SMS"],autoDetected:true});
    setAddedIds(prev=>new Set([...prev,item.platform]));
    if(fromParsed) setParsedFromEmail(d=>d.filter(x=>x.platform!==item.platform));
    else setDetected(d=>d.filter(x=>x.platform!==item.platform));
  }

  function useSample(text){ setEmailText(text); setActiveTab("paste"); setTimeout(()=>{ const found=analyzeText(text); const existing=new Set(subs.map(s=>s.platform)); setParsedFromEmail(found.map(f=>({...f, alreadyTracked: existing.has(f.platform)}))); },100); }

  const ConfidenceBar=({value})=>(<div className="conf-bar-wrap"><div className="conf-bar"><div className="conf-fill" style={{width:`${value}%`,background:value>=85?"#22c55e":value>=70?"#f59e0b":"#ef4444"}}/></div><span className={`conf-label ${value>=85?"high":value>=70?"med":"low"}`}>{value}%</span></div>);

  return(<>
    <PageHeader eyebrow="AI-powered" title="Auto-Detect Subscriptions" subtitle="Let SubTrack find subscriptions from emails, bank SMS, or UPI transactions — with AI-powered text analysis."/>
    <div className="autodetect-tabs">
      {[["smart","🔍 Smart Scan"],["paste","📋 Paste Text"],["scraper","🌐 Live Prices"],["tips","💡 Pro Tips"]].map(([tab,label])=>(<button key={tab} className={`ad-tab ${activeTab===tab?"active":""}`} onClick={()=>setActiveTab(tab)}>{label}</button>))}
    </div>

    <div className="autodetect-content">
      {/* ── Smart Scan ── */}
      {activeTab==="smart"&&(
        <div className="ad-section-grid">
          <section className="panel">
            <div className="panel-head"><div><h2>Smart Pattern Scan</h2><p>Detect subscriptions from activity signals</p></div><Wifi size={19}/></div>
            <div className="scan-options">
              <div className="scan-option active"><Wifi size={15} className="purple"/><span>Pattern-based detection</span><span className="active-badge">Active</span></div>
              <div className="scan-option"><Mail size={15}/><span>Gmail OAuth (reads receipts)</span><span className="coming">Phase 2</span></div>
              <div className="scan-option"><Banknote size={15}/><span>Bank statement PDF upload</span><span className="coming">Phase 2</span></div>
              <div className="scan-option"><Smartphone size={15}/><span>UPI apps (BHIM, PhonePe, GPay)</span><span className="coming">Phase 2</span></div>
            </div>
            <button className="primary-btn wide" onClick={runAutoDetect} disabled={detecting}>
              {detecting?<><RefreshCw size={16} className="spin"/> Scanning patterns…</>:<><Search size={16}/> Run Smart Scan</>}
            </button>
            {detecting&&<div className="scan-progress"><div className="scan-bar"/><span>Analysing activity patterns…</span></div>}
            {detected.length>0&&(<div className="detected-list">
              <h3>Found {detected.length} possible subscription{detected.length>1?"s":""}</h3>
              {detected.map(item=>(<div key={item.platform} className="detected-item">
                <PlatformIcon name={item.platform}/>
                <div className="detected-info">
                  <strong>{item.platform} — {item.plan}</strong>
                  <span>{money(item.price)}/{item.cycle} · via {item.source}</span>
                  <ConfidenceBar value={item.confidence}/>
                </div>
                {!addedIds.has(item.platform)?<button className="small-add-btn" onClick={()=>addDetected(item)}><Plus size={14}/> Add</button>:<span className="added-chip"><Check size={12}/> Added</span>}
              </div>))}
            </div>)}
            {!detecting&&detected.length===0&&<div className="no-detect-msg"><Info size={14}/> Click "Run Smart Scan" to detect subscriptions not already in your list.</div>}
          </section>

          {/* Subscription health score */}
          <section className="panel">
            <div className="panel-head"><div><h2>Subscription Health</h2><p>AI-powered spending insights</p></div><Activity size={19}/></div>
            <SubscriptionHealth subs={subs} monthly={monthlyCost}/>
          </section>
        </div>
      )}

      {/* ── Paste Text ── */}
      {activeTab==="paste"&&(
        <div className="ad-section-grid">
          <section className="panel">
            <div className="panel-head"><div><h2>Paste Email / SMS / Bank Alert</h2><p>Our AI parser extracts subscriptions from any text</p></div><Receipt size={19}/></div>
            <textarea className="email-paste-area" placeholder={"Paste your:\n• Subscription confirmation email\n• Bank debit SMS\n• UPI transaction alert\n• Credit card statement line\n\nExample: \"Dear Customer, Rs.799 debited for NETFLIX.COM via UPI...\""} value={emailText} onChange={e=>setEmailText(e.target.value)}/>
            <div className="parse-actions">
              <button className="primary-btn" onClick={parseEmail} disabled={!emailText.trim()}><Search size={15}/> Parse & Detect</button>
              <button className="secondary-btn" onClick={()=>{setEmailText("");setParsedFromEmail([]);}}><X size={15}/> Clear</button>
            </div>
            {parsedFromEmail.length>0&&(<div className="detected-list">
              <h3>Detected {parsedFromEmail.length} subscription{parsedFromEmail.length>1?"s":""}</h3>
              {parsedFromEmail.map(item=>(<div key={item.platform} className={`detected-item ${item.alreadyTracked?"already-tracked":""}`}>
                <PlatformIcon name={item.platform}/>
                <div className="detected-info">
                  <strong>{item.platform} — {item.plan}</strong>
                  {item.alreadyTracked&&<span className="tracked-badge"><CheckCircle2 size={10}/> Already in your list</span>}
                  <div className="detect-meta">
                    <span className="detect-src"><Tag size={10}/>{item.source}</span>
                    {item.detectedAmount&&<span className="detect-amount"><Banknote size={10}/>₹{item.detectedAmount} found in text</span>}
                    {item.detectedDate&&<span className="detect-date"><Calendar size={10}/>{item.detectedDate}</span>}
                    {item.amountMatched&&<span className="detect-match"><CheckCircle2 size={10}/> Amount matches plan</span>}
                  </div>
                  <ConfidenceBar value={item.confidence}/>
                </div>
                {item.alreadyTracked
                  ? <span className="added-chip"><Check size={12}/> Tracked</span>
                  : <button className="small-add-btn" onClick={()=>addDetected(item,true)}><Plus size={14}/> Add</button>}
              </div>))}
            </div>)}
            {emailText.trim()&&parsedFromEmail.length===0&&<div className="no-detect-msg"><AlertTriangle size={14}/> No known subscriptions detected. Try one of the samples below — or make sure the SMS/email mentions a service name like "Netflix", "Spotify", "Amazon Prime", etc.</div>}
          </section>

          {/* Sample texts */}
          <section className="panel">
            <div className="panel-head"><div><h2>Try Sample Texts</h2><p>Click any sample to load and parse it</p></div><Lightbulb size={19}/></div>
            <div className="sample-list">{SAMPLE_TEXTS.map((s,i)=>(<button key={i} className="sample-item" onClick={()=>useSample(s.text)}><div className="sample-label"><span className="sample-num">{i+1}</span><strong>{s.label}</strong></div><p className="sample-preview">{s.text.slice(0,80)}…</p><span className="sample-cta">Load & Parse <ArrowRight size={12}/></span></button>))}</div>
          </section>
        </div>
      )}

      {/* ── Live Price Scraper ── */}
      {activeTab==="scraper"&&(
        <section className="panel scraper-panel">
          <div className="panel-head"><div><h2>Live Price Checker</h2><p>Verify current pricing from official websites</p></div><Globe size={19}/></div>
          <p className="scraper-desc">SubTrack cross-checks official pricing pages to keep plan data accurate. In Phase 2 this runs weekly and alerts you to price changes.</p>
          <div className="scraper-controls">
            <div className="native-select"><select value={scrapePlatform} onChange={e=>setScrapePlatform(e.target.value)}>{Object.keys(PLATFORM_DATA).map(x=><option key={x}>{x}</option>)}</select><ChevronDown size={15}/></div>
            <button className="primary-btn" onClick={runScrape} disabled={scraping}>{scraping?<><RefreshCw size={15} className="spin"/> Checking…</>:<><Globe size={15}/> Check Live Prices</>}</button>
            <a href={PLATFORM_DATA[scrapePlatform]?.website} target="_blank" rel="noreferrer" className="small-btn" style={{display:"flex",alignItems:"center",gap:5,textDecoration:"none"}}><ExternalLink size={13}/> Open Site</a>
          </div>
          {scraping&&<div className="scan-progress"><div className="scan-bar"/><span>Fetching from {PLATFORM_DATA[scrapePlatform]?.website}…</span></div>}
          {scrapedPrices&&(<div className="scraped-results">
            <div className="scraped-header"><CheckCircle2 size={15}/><strong>{scrapedPrices.platform} — Live Prices</strong><span className="scraped-time">Checked {scrapedPrices.lastChecked}</span></div>
            <div className="scraped-table">
              <div className="scraped-row header"><span>Plan</span><span>Live Price</span><span>Status</span></div>
              {scrapedPrices.plans.map(p=>(<div key={p.name} className={`scraped-row ${p.changed?"changed":""}`}><span>{p.name}</span><span><strong>{money(p.livePrice)}/{p.cycle}</strong></span><span>{p.changed?<span className="price-changed">⚠️ Changed!</span>:<span className="price-ok">✅ Up to date</span>}</span></div>))}
            </div>
            <a href={PLATFORM_DATA[scrapePlatform]?.website} target="_blank" rel="noreferrer" className="scraper-link"><ExternalLink size={13}/> Open {scrapePlatform} pricing page</a>
          </div>)}
          <div className="all-platforms-grid">
            <h3 style={{gridColumn:"1/-1",fontSize:13,color:"var(--ink)",marginBottom:10}}>All Platforms — Quick Links</h3>
            {Object.entries(PLATFORM_DATA).map(([name,data])=>(<a key={name} href={data.website} target="_blank" rel="noreferrer" className="platform-quick-link"><PlatformIcon name={name}/><span>{name}</span><ExternalLink size={11}/></a>))}
          </div>
          <div className="scraper-note"><ShieldCheck size={14}/><p>Prices are verified against official sites. Phase 2: auto-runs every Sunday and sends you an alert if any price changes.</p></div>
        </section>
      )}

      {/* ── Pro Tips ── */}
      {activeTab==="tips"&&(
        <section className="panel">
          <div className="panel-head"><div><h2>Pro Tips to Save Money</h2><p>Smart ways to reduce your subscription spend</p></div><Trophy size={19}/></div>
          <div className="tips-grid">
            {[
              {icon:<Users size={20}/>,title:"Share family plans",desc:"Netflix, Spotify, YouTube Premium all offer family plans. Split with friends/family to cut costs by 60-75%."},
              {icon:<TrendingDown size={20}/>,title:"Switch to annual billing",desc:"Amazon Prime saves ₹688/yr vs monthly. Spotify Individual saves ₹120/yr. Always check the annual option."},
              {icon:<Calendar size={20}/>,title:"Stagger your renewals",desc:"Don't have 4 subscriptions renewing on the same day. Spread them out to avoid cash-flow stress."},
              {icon:<Gift size={20}/>,title:"Use student discounts",desc:"Spotify Student (₹59), YouTube Premium Student (₹89) — verify your .edu email and save 50%."},
              {icon:<Archive size={20}/>,title:"Pause, don't cancel",desc:"Netflix, Spotify, Amazon Prime all offer pause/hold options so you can temporarily stop paying without losing your history."},
              {icon:<Target size={20}/>,title:"Set a budget cap",desc:"Use SubTrack's spending view to set a mental limit. If your monthly total exceeds ₹1,500, audit which ones you actually use."},
              {icon:<Repeat size={20}/>,title:"Rotate streaming services",desc:"Watch everything you want on Netflix in 1-2 months, then cancel and switch to Hotstar. Rotate every quarter."},
              {icon:<Bell size={20}/>,title:"Audit every 3 months",desc:"Run Auto-Detect every 3 months. Forgotten subscriptions add up fast — the average person has 2-3 they've forgotten about."},
            ].map((tip,i)=>(<div key={i} className="tip-card"><div className="tip-icon">{tip.icon}</div><div><strong>{tip.title}</strong><p>{tip.desc}</p></div></div>))}
          </div>
        </section>
      )}
    </div>
  </>);
}

function SubscriptionHealth({subs}){
  const monthly=subs.reduce((a,s)=>a+monthlyCost(s),0);
  const score=Math.max(0,100-Math.round(monthly/20));
  const label=score>=80?"Excellent":score>=60?"Good":score>=40?"Fair":"Needs Review";
  const color=score>=80?"#22c55e":score>=60?"#f59e0b":score>=40?"#fb923c":"#ef4444";
  const unused=subs.filter(s=>daysUntil(s.renewal)<0).length;
  return(<div className="health-widget">
    <div className="health-score-wrap"><svg viewBox="0 0 120 120" className="health-svg"><circle cx="60" cy="60" r="50" fill="none" stroke="var(--line)" strokeWidth="10"/><circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="10" strokeDasharray={`${score*3.14} 314`} strokeLinecap="round" transform="rotate(-90 60 60)"/></svg><div className="health-score-inner"><strong style={{color}}>{score}</strong><span>{label}</span></div></div>
    <div className="health-insights">
      <div className="health-row"><CircleDollarSign size={14}/><span>Monthly spend: <strong>{money(monthly)}</strong></span></div>
      <div className="health-row"><ListChecks size={14}/><span>Active plans: <strong>{subs.length}</strong></span></div>
      {unused>0&&<div className="health-row urgent-text"><AlertTriangle size={14}/><span><strong>{unused} expired</strong> plan{unused>1?"s":""} — remove them!</span></div>}
      {monthly>2000&&<div className="health-row soon-text"><TrendingUp size={14}/><span>High spend — consider auditing</span></div>}
      {monthly<=500&&<div className="health-row positive"><CheckCircle2 size={14}/><span>Great! Low subscription spend</span></div>}
    </div>
  </div>);
}

// ─────────────────────────── SETTINGS ────────────────────────────────────────
function SettingsPage({settings,setSettings,darkMode,setDarkMode,showToast,user,onUpdateUser}){
  const [form,setForm]=useState({...settings});
  const [displayName,setDisplayName]=useState(user?.name||"");
  const [showKey,setShowKey]=useState(false);
  function save(){
    setSettings(form);
    // Update user name in localStorage
    if(user){
      const updated={...user,name:displayName.trim()||user.name};
      localStorage.setItem("subtrack-user",JSON.stringify(updated));
      onUpdateUser?.(updated);
    }
    showToast("success","Settings saved!");
  }
  return(<>
    <PageHeader eyebrow="Preferences" title="Settings" subtitle="Configure notifications, contact details, and integrations."/>
    <div className="settings-layout">
      <section className="panel settings-panel">
        <div className="settings-section-head"><h2>Profile</h2></div>
        <div className="settings-field"><label>Full Name<input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Your full name"/></label></div>
        <div className="settings-field"><label>Login Method<input value={user?.method==="phone"?`Phone: ${user.phone}`:user?.method==="gmail"?`Gmail: ${user.email}`:"Google Sign-In"} readOnly style={{opacity:.7,cursor:"default"}}/></label></div>
        <div className="settings-field"><label>Currency<select value={form.currency} onChange={e=>setForm(f=>({...f,currency:e.target.value}))}><option>INR</option><option>USD</option><option>EUR</option></select></label></div>
      </section>
      <section className="panel settings-panel">
        <div className="settings-section-head"><h2><Bell size={16}/> Notification Setup</h2></div>
        <div className="notif-channel-setup">
          <div className="notif-channel-row"><div className="ch-icon purple"><Bell size={16}/></div><div className="ch-details"><strong>Push Notifications</strong><span>Browser desktop push</span></div><span className="ch-status">Always active</span></div>
          <div className="notif-channel-row"><div className="ch-icon blue"><Mail size={16}/></div><div className="ch-details"><strong>Email</strong><span>SendGrid — Phase 2</span></div><input className="ch-input" type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
          <div className="notif-channel-row"><div className="ch-icon green"><MessageCircle size={16}/></div><div className="ch-details"><strong>WhatsApp</strong><span>Green API — renewal reminders</span></div><input className="ch-input" type="tel" placeholder="+91 9876543210" value={form.whatsapp} onChange={e=>setForm(f=>({...f,whatsapp:e.target.value}))}/></div>
          <div className="notif-channel-row"><div className="ch-icon orange"><Phone size={16}/></div><div className="ch-details"><strong>SMS</strong><span>Fast2SMS — renewal reminders</span></div><input className="ch-input" type="tel" placeholder="+91 9876543210" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></div>
        </div>
      </section>
      <section className="panel settings-panel">
        <div className="settings-section-head"><h2>Default Preferences</h2></div>
        <div className="settings-field"><label>Default Reminder<select value={form.defaultReminder} onChange={e=>setForm(f=>({...f,defaultReminder:e.target.value}))}>{REMINDER_OPTIONS.map(o=><option key={o}>{o}</option>)}</select></label></div>
        <div className="settings-field"><label>Default Channels</label><div className="channel-grid small">{NOTIFY_CHANNELS.map(ch=>(<button key={ch} className={`channel-card small ${(form.defaultChannels||[]).includes(ch)?"active":""}`} onClick={()=>setForm(f=>({...f,defaultChannels:(f.defaultChannels||[]).includes(ch)?f.defaultChannels.filter(x=>x!==ch):[...(f.defaultChannels||[]),ch]}))}><ChannelIcon channel={ch} size={16}/><span>{ch}</span></button>))}</div></div>
      </section>
      <section className="panel settings-panel"><div className="settings-section-head"><h2>Appearance</h2></div><div className="setting-row"><div><strong>Theme</strong><span>Light or dark mode</span></div><button className="theme-btn" onClick={()=>setDarkMode(v=>!v)}>{darkMode?<Sun size={15}/>:<Moon size={15}/>}{darkMode?"Light mode":"Dark mode"}</button></div></section>
      <section className="panel settings-panel phase2-panel">
        <div className="settings-section-head"><h2>🔐 Backend Integration (Phase 2)</h2></div>
        <div className="api-key-row"><div className="api-service"><Mail size={14}/> SendGrid</div><div className="api-key-input"><input type={showKey?"text":"password"} placeholder="SG.xxxx" readOnly value="SG.demo-key"/><button onClick={()=>setShowKey(v=>!v)}>{showKey?<EyeOff size={14}/>:<Eye size={14}/>}</button></div><span className="phase2-tag">Phase 2</span></div>
        <div className="api-key-row"><div className="api-service"><MessageCircle size={14}/> Twilio</div><div className="api-key-input"><input type="password" readOnly value="AC.demo"/></div><span className="phase2-tag">Phase 2</span></div>
      </section>
      <button className="primary-btn save-btn" onClick={save}><Check size={16}/> Save Settings</button>
    </div>
  </>);
}

// ─────────────────────────── EDIT MODAL ──────────────────────────────────────
function EditModal({sub,onClose,onSave}){
  const [renewal,setRenewal]=useState(sub.renewal);
  const [startDate,setStartDate]=useState(sub.startDate||"");
  const [autopay,setAutopay]=useState(sub.autopay);
  const [reminder,setReminder]=useState(sub.reminder||"3 days before");
  const [notifyChannels,setNotifyChannels]=useState(sub.notifyChannels||["In-App Notification","WhatsApp","SMS"]);
  const [plan,setPlan]=useState(sub.plan);
  function toggleChannel(ch){setNotifyChannels(prev=>prev.includes(ch)?prev.filter(x=>x!==ch):[...prev,ch]);}
  const plans=Object.keys(PLATFORM_DATA[sub.platform]?.plans||{});
  const selectedPlan=PLATFORM_DATA[sub.platform]?.plans[plan];
  return(<div className="modal-backdrop"><div className="modal">
    <div className="modal-head"><div><span className="eyebrow">Edit subscription</span><h2>{sub.platform}</h2></div><button className="icon-btn" onClick={onClose}><X size={18}/></button></div>
    <div className="modal-summary"><PlatformIcon name={sub.platform}/><div><strong>{plan}</strong><span>{selectedPlan?money(selectedPlan.price)+"/"+selectedPlan.cycle:""}</span></div></div>
    {plans.length>1&&<label className="modal-label">Plan<div className="native-select"><select value={plan} onChange={e=>setPlan(e.target.value)}>{plans.map(p=><option key={p}>{p}</option>)}</select><ChevronDown size={15}/></div></label>}
    <div className="modal-field-grid">
      <label className="modal-label">Start Date<input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}/></label>
      <label className="modal-label">Renewal Date<input type="date" value={renewal} onChange={e=>setRenewal(e.target.value)}/></label>
    </div>
    <label className="modal-label" style={{marginTop:10}}>Reminder<div className="native-select"><select value={reminder} onChange={e=>setReminder(e.target.value)}>{REMINDER_OPTIONS.map(o=><option key={o}>{o}</option>)}</select><ChevronDown size={15}/></div></label>
    <div className="modal-label" style={{marginTop:12}}>Notify via</div>
    <div className="channel-grid small" style={{marginTop:8}}>{NOTIFY_CHANNELS.map(ch=>(<button key={ch} className={`channel-card small ${notifyChannels.includes(ch)?"active":""}`} onClick={()=>toggleChannel(ch)}><ChannelIcon channel={ch} size={15}/><span>{ch}</span></button>))}</div>
    <button className={`toggle-row ${autopay?"enabled":""}`} onClick={()=>setAutopay(v=>!v)} style={{marginTop:12}}><div><CreditCard size={17}/><span><strong>Auto-Pay</strong><small>{autopay?"Enabled":"Disabled"}</small></span></div><span className={`switch ${autopay?"on":""}`}><i/></span></button>
    <div className="modal-actions"><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={()=>onSave({...sub,plan,renewal,startDate,autopay,reminder,notifyChannels,price:selectedPlan?.price??sub.price,cycle:selectedPlan?.cycle??sub.cycle})}>Save changes</button></div>
  </div></div>);
}

// ─────────────────────────── NOTIF TEST MODAL ────────────────────────────────
function NotifTestModal({sub,channel,settings,onClose}){
  const [sent,setSent]=useState(false);const [busy,setBusy]=useState(false);const [err,setErr]=useState(null);
  async function send(){
    setErr(null);
    if(channel==="In-App Notification"){if(Notification.permission==="granted")new Notification(`SubTrack: ${sub.platform}`,{body:`${sub.plan} renews ${formatDate(sub.renewal)} — ${money(sub.price)}`});setSent(true);setTimeout(onClose,2000);return;}
    if(channel==="Email"){setErr({error:"Email delivery isn't set up yet (Phase 2). Try WhatsApp or SMS."});return;}
    setBusy(true);
    try{const r=await fetch("/api/notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({channel:channel==="WhatsApp"?"whatsapp":"sms",to:dest,vars:[sub.platform,sub.plan,"on "+formatDate(sub.renewal),money(sub.price),sub.autopay?"Auto-pay is ON.":"Auto-pay is OFF."],message:`🔔 SubTrack Reminder (test)\n${sub.platform} — ${sub.plan}\nRenews ${formatDate(sub.renewal)} · ${money(sub.price)}`})}).then(r=>r.json());
      if(r.ok){setSent(true);setTimeout(onClose,2500);}else setErr(r);}
    catch{setErr({error:"Can't reach the SubTrack server.",hint:"Run the app with `npx vercel dev` locally (or open your deployed Vercel URL)."});}
    setBusy(false);}
  const dest={Email:settings.email||"No email set",WhatsApp:settings.whatsapp||"No number set",SMS:settings.phone||"No number set","In-App Notification":"Browser push"}[channel];
  return(<div className="modal-backdrop"><div className="modal small">
    <div className="modal-head"><div><span className="eyebrow">Test notification</span><h2>{channel}</h2></div><button className="icon-btn" onClick={onClose}><X size={18}/></button></div>
    {sent?(<div className="sent-state"><CheckCircle2 size={36} className="green"/><p>Test sent to {dest}!</p></div>):(
      <><div className="notif-preview"><div className="notif-preview-icon"><ChannelIcon channel={channel} size={22}/></div><div><strong>SubTrack Reminder</strong><p>{sub.platform} — {sub.plan}</p><p>Renews {formatDate(sub.renewal)} · {money(sub.price)}</p><p className="notif-dest">→ {dest}</p></div></div>
      {(channel==="Email"&&!settings.email)||(channel==="WhatsApp"&&!settings.whatsapp)||(channel==="SMS"&&!settings.phone)?<div className="notif-warn"><AlertTriangle size={14}/> Set {channel} in Settings first</div>:null}
      {err&&<div className="notif-warn"><AlertTriangle size={14}/> <span><strong>{err.error}</strong>{err.hint&&<><br/>{err.hint}</>}</span></div>}
      <div className="modal-actions"><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" disabled={busy} onClick={send}>{busy?<><RefreshCw size={15} className="spin"/> Sending…</>:<><Send size={15}/> Send Test</>}</button></div></>
    )}
  </div></div>);
}

createRoot(document.getElementById("root")).render(<App/>);
