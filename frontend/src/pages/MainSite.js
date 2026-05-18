import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, TrendingUp, Shield, BarChart3, Globe, Building2, Banknote, PiggyBank, Landmark, LineChart, Newspaper, ChevronLeft, ChevronRight, Users, Target, Award, Briefcase, Sparkles, ArrowUpRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const ABOUT_IMAGE = 'https://images.pexels.com/photos/7433840/pexels-photo-7433840.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';

const solutions = [
  { icon: TrendingUp, title: 'Investing Long Term', desc: '5 to 10 years strategic wealth building with diversified portfolios for maximum long-term growth.', num: '01' },
  { icon: LineChart, title: 'Investing Short Term', desc: '6 months to 15 months tactical investments designed for quick, reliable returns.', num: '02' },
  { icon: PiggyBank, title: 'Mutual Funds Investment Planning', desc: 'Curated mutual fund portfolios aligned with your risk appetite and financial goals.', num: '03' },
  { icon: Landmark, title: 'Retirement Fund Planning', desc: 'Secure your golden years with strategic retirement corpus planning and management.', num: '04' },
  { icon: Shield, title: 'Hedge Strategies', desc: '110% safe returns better than traditional FDs. Our proprietary hedging models protect and grow capital.', num: '05' },
  { icon: Building2, title: 'Govt & Corporate Bonds', desc: 'Stable, predictable income through carefully selected government and corporate bond investments.', num: '06' },
  { icon: Banknote, title: 'SWP - Systematic Withdrawal Plans', desc: 'Create a regular income stream from your investments with tax-efficient systematic withdrawals.', num: '07' },
  { icon: Globe, title: 'Foreign Investor in India', desc: 'Navigate Indian markets with ease. Complete advisory for international investors entering India.', num: '08' },
  { icon: BarChart3, title: 'Indian Investor in Foreign Equities', desc: 'Diversify globally. Access international markets and capitalize on worldwide opportunities.', num: '09' },
];

const partners = ['NSDL', 'CDSL', 'NSE', 'BSE', 'SEBI', 'AMFI', 'RBI', 'IRDAI'];

const whyWealthwolffs = [
  { icon: Shield, title: 'Proprietary Hedge Models', desc: 'Our in-house risk models ensure capital protection while maximizing returns beyond traditional instruments.' },
  { icon: Users, title: 'Personalized Advisory', desc: 'Every client gets a dedicated relationship manager with strategies tailored to individual financial goals.' },
  { icon: Target, title: 'Research-Driven Approach', desc: 'Deep market analysis and data-driven decisions power every investment recommendation we make.' },
  { icon: Award, title: 'Proven Track Record', desc: 'Consistent outperformance since 2020 across diverse market conditions and economic cycles.' },
];

// ── CITY MAP VISUALIZATION ────────────────────────────────────────────────────
const CITIES = [
  { name:'NEW YORK',  index:'S&P 500',  baseVal:5234,  px:0.10, py:0.10, type:'gold' },
  { name:'LONDON',    index:'FTSE 100', baseVal:7842,  px:0.38, py:0.06, type:'gold' },
  { name:'TOKYO',     index:'NIKKEI',   baseVal:38750, px:0.72, py:0.08, type:'gold' },
  { name:'DUBAI',     index:'DFM',      baseVal:4127,  px:0.60, py:0.22, type:'gold' },
  { name:'MUMBAI',    index:'NIFTY 50', baseVal:22480, px:0.75, py:0.35, type:'gold' },
  { name:'NEW DELHI', index:'SENSEX',   baseVal:73950, px:0.82, py:0.24, type:'blue' },
  { name:'SINGAPORE', index:'STI',      baseVal:3312,  px:0.88, py:0.50, type:'gold' },
  { name:'HONG KONG', index:'HSI',      baseVal:17840, px:0.82, py:0.40, type:'gold' },
];

const CONNECTIONS = [
  [0,1],[1,3],[1,2],[3,4],[4,5],[5,3],[4,7],[7,6],[5,7],[0,3],[2,5],[6,4]
];

function GlobalMap() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    const streams = CONNECTIONS.map(pair => ({
      pair, p: Math.random(), speed: 0.0025 + Math.random() * 0.002
    }));
    let liveVals = CITIES.map(c => c.baseVal);
    let wwSize = 10;
    const WW_SPEED = 0.10;
    let t = 0;
    let raf;

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    window.addEventListener('resize', resize);

    function pos(city) {
      const MAP_H = H * 0.56;
      return { x: city.px * W, y: city.py * MAP_H };
    }

    function drawWW() {
      ctx.save();
      ctx.font = `800 ${wwSize}px Sora,sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const tw = ctx.measureText('WEALTHWOLFFS').width;
      if (tw >= W * 0.98) { wwSize = 10; } else { wwSize += WW_SPEED; }
      const alpha = Math.max(0.008, 0.07 - (tw / W) * 0.063);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#003B5C';
      ctx.fillText('WEALTHWOLFFS', W / 2, H * 0.27);
      ctx.restore();
    }

    function draw() {
      t += 0.012;

      if (Math.floor(t * 10) % 4 === 0)
        liveVals = liveVals.map(v => v * (1 + (Math.random() - 0.498) * 0.001));

      const MAP_H = H * 0.56;
      const LIST_TOP = H * 0.585;

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#FAF8F4');
      bg.addColorStop(1, '#F0EBE0');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Dot grid
      ctx.fillStyle = 'rgba(0,59,92,0.03)';
      for (let gx = 0; gx < W; gx += 18)
        for (let gy = 0; gy < MAP_H; gy += 18) {
          ctx.beginPath(); ctx.arc(gx, gy, 0.5, 0, Math.PI * 2); ctx.fill();
        }

      drawWW();

      // Connections
      CONNECTIONS.forEach((pair, pi) => {
        const p1 = pos(CITIES[pair[0]]);
        const p2 = pos(CITIES[pair[1]]);
        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2 - dist * 0.25;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(mx, my, p2.x, p2.y);
        ctx.strokeStyle = 'rgba(196,164,124,0.22)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        const s = streams[pi]; s.p += s.speed; if (s.p > 1) s.p = 0;
        const tp = s.p;

        for (let tr = 0; tr < 7; tr++) {
          const ttp = Math.max(0, tp - 0.05 * (tr / 7));
          const bx = (1-ttp)**2*p1.x + 2*(1-ttp)*ttp*mx + ttp**2*p2.x;
          const by = (1-ttp)**2*p1.y + 2*(1-ttp)*ttp*my + ttp**2*p2.y;
          ctx.beginPath(); ctx.arc(bx, by, 1.4*(1-tr/7), 0, Math.PI*2);
          ctx.fillStyle = `rgba(196,164,124,${0.55*(1-tr/7)})`; ctx.fill();
        }
        const bx = (1-tp)**2*p1.x + 2*(1-tp)*tp*mx + tp**2*p2.x;
        const by = (1-tp)**2*p1.y + 2*(1-tp)*tp*my + tp**2*p2.y;
        ctx.beginPath(); ctx.arc(bx, by, 2.5, 0, Math.PI*2);
        ctx.fillStyle = '#C4A47C';
        ctx.shadowColor = '#C4A47C'; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
      });

      // City nodes
      CITIES.forEach((city, i) => {
        const { x, y } = pos(city);
        const pulse = (Math.sin(t * 2 + i * 1.2) + 1) / 2;
        const nc = city.type === 'blue' ? '#003B5C' : '#C4A47C';
        const ng = city.type === 'blue' ? '#004F80' : '#B8923A';
        const r = 5;

        ctx.beginPath(); ctx.arc(x, y, r+4+pulse*3, 0, Math.PI*2);
        ctx.strokeStyle = `${nc}18`; ctx.lineWidth = 1; ctx.stroke();

        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
        ctx.fillStyle = nc; ctx.shadowColor = ng;
        ctx.shadowBlur = 10 + pulse * 6; ctx.fill(); ctx.shadowBlur = 0;

        ctx.beginPath(); ctx.arc(x, y, r*0.38, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.fill();

        const nearRight = x > W * 0.62;
        const nearTop   = y < MAP_H * 0.14;
        const align = nearRight ? 'right' : 'left';
        const lx    = nearRight ? x - r - 5 : x + r + 5;
        const nameY = nearTop   ? y + r + 9  : y - r - 7;
        const idxY  = nearTop   ? y + r + 18 : y - r - 17;

        ctx.font = '600 7.5px IBM Plex Mono,monospace';
        ctx.textAlign = align;
        ctx.fillStyle = 'rgba(0,59,92,0.82)';
        ctx.fillText(city.name, lx, nameY);

        ctx.font = '400 7px IBM Plex Mono,monospace';
        ctx.fillStyle = 'rgba(196,164,124,0.85)';
        ctx.fillText(city.index, lx, idxY);
      });

      // Divider
      ctx.strokeStyle = 'rgba(196,164,124,0.28)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(W*0.04, LIST_TOP-3); ctx.lineTo(W*0.96, LIST_TOP-3); ctx.stroke();

      ctx.font = '500 7px IBM Plex Mono,monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(196,164,124,0.6)';
      ctx.fillText('LIVE INDICES', W*0.05, LIST_TOP-9);

      // Index list
      const listH = H - LIST_TOP - H*0.01;
      const rowH  = listH / CITIES.length;

      CITIES.forEach((city, i) => {
        const ry  = LIST_TOP + i * rowH + rowH * 0.65;
        const val = liveVals[i];
        const chg = ((val - city.baseVal) / city.baseVal * 100).toFixed(2);
        const isUp = parseFloat(chg) >= 0;
        const nc   = city.type === 'blue' ? '#003B5C' : '#C4A47C';

        if (i % 2 === 0) {
          ctx.fillStyle = 'rgba(0,59,92,0.018)';
          ctx.fillRect(W*0.03, ry - rowH*0.52, W*0.94, rowH*0.92);
        }

        ctx.beginPath(); ctx.arc(W*0.065, ry-1, 2.8, 0, Math.PI*2);
        ctx.fillStyle = nc; ctx.fill();

        ctx.font = '600 8px IBM Plex Mono,monospace';
        ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(0,59,92,0.82)';
        ctx.fillText(city.name, W*0.11, ry);

        ctx.font = '400 6.5px IBM Plex Mono,monospace';
        ctx.fillStyle = 'rgba(0,59,92,0.38)';
        ctx.fillText(city.index, W*0.11, ry + 9);

        ctx.font = '500 8px IBM Plex Mono,monospace';
        ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(0,59,92,0.65)';
        ctx.fillText(val.toFixed(0), W*0.78, ry);

        ctx.font = '600 7.5px IBM Plex Mono,monospace';
        ctx.fillStyle = isUp ? 'rgba(0,140,70,0.9)' : 'rgba(190,40,55,0.9)';
        ctx.fillText(`${isUp ? '▲' : '▼'}${Math.abs(chg)}%`, W*0.97, ry);
      });

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width:'100%', height:'100%', display:'block' }}
    />
  );
}

// ── HERO HEADLINE with fade-in only ──────────────────────────────────────────
function HeroHeadline() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);
  return (
    <h1
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0A192F] leading-[1.1] mb-4 sm:mb-5"
      style={{ fontFamily:'Sora,sans-serif', opacity: visible ? 1 : 0, transition:'opacity 0.8s ease' }}
      data-testid="landing-headline"
    >
      Building Generational<br />
      <span className="text-[#003B5C]">Wealth</span> Through<br />
      <span style={{ color:'#C4A47C', fontStyle:'italic' }}>Financial</span>{' '}
      <span style={{ color:'#003B5C' }}>Science</span>
    </h1>
  );
}

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

function Section({ id, children, className = '' }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <section id={id} ref={ref} className={`section-fade ${visible ? 'visible' : ''} ${className}`} data-testid={`section-${id}`}>
      {children}
    </section>
  );
}

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const interval = setInterval(() => {
          current += step;
          if (current >= target) { setCount(target); clearInterval(interval); }
          else setCount(current);
        }, 30);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function SolutionsCarousel() {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };
  return (
    <div className="relative">
      <div className="absolute -top-16 right-0 flex gap-2">
        <button onClick={() => scroll(-1)} className="w-10 h-10 border border-[#E2E8F0] flex items-center justify-center hover:bg-[#F9F8F6] transition-colors" data-testid="solutions-scroll-left">
          <ChevronLeft className="w-5 h-5 text-[#003B5C]" />
        </button>
        <button onClick={() => scroll(1)} className="w-10 h-10 border border-[#E2E8F0] flex items-center justify-center hover:bg-[#F9F8F6] transition-colors" data-testid="solutions-scroll-right">
          <ChevronRight className="w-5 h-5 text-[#003B5C]" />
        </button>
      </div>
      <div ref={scrollRef} className="flex gap-5 overflow-x-auto solutions-scroll pb-4 -mx-2 px-2" data-testid="solutions-carousel">
        {solutions.map((s, i) => (
          <div key={i} className="flex-none w-[280px] bg-white border border-[#E2E8F0] card-lift relative overflow-hidden" data-testid={`solution-card-${i}`}>
            <span className="absolute top-2 right-3 text-5xl font-extrabold text-[#003B5C]/[0.04]" style={{ fontFamily:'Sora,sans-serif' }}>{s.num}</span>
            <div className="p-6 relative z-10">
              <div className="icon-circle mb-4"><s.icon className="w-6 h-6 text-[#003B5C]" /></div>
              <h3 className="text-base font-medium text-[#0A192F] mb-2">{s.title}</h3>
              <p className="text-sm text-[#475569] leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/testimonials`).then(r => r.json()).then(setTestimonials).catch(() => {});
  }, []);
  if (testimonials.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((t, i) => (
        <div key={i} className="bg-white border border-[#E2E8F0] p-8 card-lift relative" data-testid={`testimonial-${i}`}>
          <span className="absolute top-4 right-6 text-6xl leading-none text-[#C4A47C]/20" style={{ fontFamily:'Playfair Display,serif' }}>"</span>
          <div className="relative z-10">
            <p className="text-sm text-[#475569] leading-relaxed mb-6 italic" style={{ fontFamily:'Playfair Display,serif' }}>"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003B5C] to-[#C4A47C] flex items-center justify-center text-white text-sm font-semibold">{t.name?.charAt(0)}</div>
              <div>
                <p className="text-sm font-medium text-[#0A192F]">{t.name}</p>
                <p className="text-xs text-[#C4A47C]">{t.designation}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MediaSection() {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/news`).then(r => r.json()).then(setArticles).catch(() => {});
  }, []);
  if (articles.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {articles.map((a, i) => (
        <div key={i} className="bg-white border border-[#E2E8F0] card-lift group relative overflow-hidden" data-testid={`news-article-${i}`}>
          <div className="gradient-bar"></div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#C4A47C]/10 flex items-center justify-center">
                <Newspaper className="w-3 h-3 text-[#C4A47C]" />
              </div>
              <span className="text-xs text-[#C4A47C] font-medium">{a.source || 'Wealthwolffs'}</span>
            </div>
            <h3 className="text-base font-medium text-[#0A192F] mb-2 group-hover:text-[#003B5C] transition-colors">{a.title}</h3>
            <p className="text-sm text-[#475569] leading-relaxed mb-3">{a.summary}</p>
            {a.link && (
              <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#003B5C] hover:underline inline-flex items-center gap-1">
                Read More <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
            <p className="text-xs text-[#475569]/60 mt-2">{new Date(a.created_at).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/enquiries`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
      if (res.ok) { setSubmitted(true); setForm({name:'',email:'',phone:'',message:''}); }
    } catch {} finally { setLoading(false); }
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-xl" data-testid="contact-form">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#0A192F] mb-1.5 uppercase tracking-wider">Name</label>
          <input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-4 py-3 border border-[#E2E8F0] bg-white text-sm text-[#0A192F] focus:ring-2 focus:ring-[#C4A47C] focus:outline-none transition-all" placeholder="Your full name" data-testid="contact-name" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#0A192F] mb-1.5 uppercase tracking-wider">Email</label>
            <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full px-4 py-3 border border-[#E2E8F0] bg-white text-sm text-[#0A192F] focus:ring-2 focus:ring-[#C4A47C] focus:outline-none transition-all" placeholder="your@email.com" data-testid="contact-email" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#0A192F] mb-1.5 uppercase tracking-wider">Phone</label>
            <input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full px-4 py-3 border border-[#E2E8F0] bg-white text-sm text-[#0A192F] focus:ring-2 focus:ring-[#C4A47C] focus:outline-none transition-all" placeholder="+91 XXXXX XXXXX" data-testid="contact-phone" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#0A192F] mb-1.5 uppercase tracking-wider">Message</label>
          <textarea required rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="w-full px-4 py-3 border border-[#E2E8F0] bg-white text-sm text-[#0A192F] focus:ring-2 focus:ring-[#C4A47C] focus:outline-none transition-all resize-none" placeholder="How can we help you?" data-testid="contact-message" />
        </div>
      </div>
      {submitted && <p className="mt-4 text-sm text-green-600" data-testid="contact-success">Thank you! We'll get back to you shortly.</p>}
      <button type="submit" disabled={loading} className="mt-6 btn-primary text-xs tracking-[0.1em] uppercase px-8 py-3 disabled:opacity-50 inline-flex items-center gap-2" data-testid="contact-submit">
        {loading ? 'Sending...' : <><Sparkles className="w-4 h-4" /> Send Enquiry</>}
      </button>
    </form>
  );
}

export default function MainSite() {
  return (
    <div className="min-h-screen bg-white" data-testid="main-site">
      <Header />

      {/* ── HERO ── */}
      <section className="pt-20 md:pt-24">
        <div className="relative bg-[#F9F8F6] overflow-hidden" data-testid="hero-section">
          <div className="geo-circle w-64 h-64 -top-20 -right-20 opacity-50 hidden sm:block"></div>
          <div className="geo-circle w-40 h-40 bottom-10 -left-10 opacity-30 hidden sm:block"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col lg:flex-row items-stretch relative z-10">

            {/* Left text — py padding */}
            <div className="flex-1 w-full py-10 sm:py-14 md:py-20 pr-0 lg:pr-10">
              <p className="overline text-xs sm:text-sm mb-3">Welcome to Wealthwolffs</p>
              <HeroHeadline />
              <p className="text-sm sm:text-base md:text-lg text-[#475569] leading-relaxed max-w-lg mb-6 sm:mb-8">
                Wealthwolffs Global Hedged Solutions delivers institutional-grade investment strategies to grow, protect, and sustain your wealth across generations.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <button onClick={() => document.querySelector('#solutions')?.scrollIntoView({behavior:'smooth'})} className="btn-primary text-xs tracking-[0.1em] uppercase px-6 sm:px-8 py-3 sm:py-3.5 inline-flex items-center justify-center gap-2" data-testid="hero-explore-btn">
                  Explore Solutions <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'})} className="btn-secondary text-xs tracking-[0.1em] uppercase px-6 sm:px-8 py-3 sm:py-3.5" data-testid="hero-contact-btn">
                  Get in Touch
                </button>
              </div>
              <div className="flex gap-6 sm:gap-8 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#E2E8F0]">
                <div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#003B5C] stat-number" style={{fontFamily:'Sora,sans-serif'}}><AnimatedCounter target={10} suffix="+" /></p>
                  <p className="text-[10px] sm:text-xs text-[#475569] mt-1">Years Experience</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#003B5C] stat-number" style={{fontFamily:'Sora,sans-serif'}}><AnimatedCounter target={250} suffix="+" /></p>
                  <p className="text-[10px] sm:text-xs text-[#475569] mt-1">Happy Clients</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#003B5C] stat-number" style={{fontFamily:'Sora,sans-serif'}}><AnimatedCounter target={10} suffix="+" /></p>
                  <p className="text-[10px] sm:text-xs text-[#475569] mt-1">Solutions Offered</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#003B5C] stat-number" style={{fontFamily:'Sora,sans-serif'}}><AnimatedCounter target={100} suffix=" Cr.+" /></p>
                  <p className="text-[10px] sm:text-xs text-[#475569] mt-1">AUM Handled</p>
                </div>
              </div>
            </div>

            {/* Right — GlobalMap fills full height of hero */}
            <div className="flex-1 hidden lg:flex relative min-h-[480px]"
              style={{ borderLeft:'1px solid rgba(196,164,124,0.2)' }}>
              <div style={{ position:'absolute', inset:0 }}>
                <GlobalMap />
              </div>
              {/* Accent corner frame */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#C4A47C]/15 pointer-events-none -z-0"></div>
            </div>

          </div>
        </div>
      </section>

      <div className="gradient-bar"></div>

      {/* ── WHO ARE WE ── */}
      <Section id="who-are-we" className="py-14 md:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <p className="overline text-sm mb-3">About Us</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-5">Who Are We</h2>
              <p className="text-base text-[#475569] leading-relaxed mb-4">Wealthwolffs Global Hedged Solutions is a premier financial advisory and investment management firm established in 2020. We combine cutting-edge quantitative strategies with deep market expertise to deliver superior risk-adjusted returns for our clients.</p>
              <p className="text-base text-[#475569] leading-relaxed">Our team of seasoned professionals brings together decades of experience across global financial markets, hedge fund strategies, and wealth management.</p>
            </div>
            <div className="relative">
              <div className="dot-grid">
                <img src={ABOUT_IMAGE} alt="Team Meeting" className="w-full h-[280px] sm:h-[350px] lg:h-[400px] object-cover relative z-10" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-[#003B5C]/10 -z-0 hidden lg:block"></div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── SOLUTIONS ── */}
      <Section id="solutions" className="py-14 md:py-20 bg-[#F9F8F6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <p className="overline text-sm mb-3">Our Solutions</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-10">Solutions & Services</h2>
          <SolutionsCarousel />
        </div>
      </Section>

      {/* ── PARTNERS ── */}
      <section className="py-8 sm:py-12 border-y border-[#E2E8F0] overflow-hidden" data-testid="partners-strip">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-4 sm:mb-6">
          <p className="overline text-sm text-center">Our Associated Partners</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="partners-scroll flex gap-10 sm:gap-16 items-center whitespace-nowrap">
            {[...partners,...partners,...partners].map((p,i) => (
              <span key={i} className="text-base sm:text-lg font-semibold text-[#0A192F]/20 tracking-wider uppercase">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY WEALTHWOLFFS ── */}
      <Section id="why-wealthwolffs" className="py-14 md:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <p className="overline text-sm mb-3">Why Choose Us</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-8">Why Wealthwolffs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {whyWealthwolffs.map((item,i) => (
              <div key={i} className="bg-white border border-[#E2E8F0] p-5 sm:p-6 card-lift" data-testid={`why-card-${i}`}>
                <div className="icon-circle mb-4 pulse-ring"><item.icon className="w-6 h-6 text-[#003B5C]" /></div>
                <h3 className="text-base font-medium text-[#0A192F] mb-2">{item.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FOUNDER ── */}
      <Section id="founder" className="py-14 md:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="overline text-sm mb-3">Leadership</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-6">Our Founder</h2>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#003B5C]/10 to-[#C4A47C]/10 border border-[#E2E8F0] flex items-center justify-center mx-auto mb-6 pulse-ring">
              <Briefcase className="w-10 h-10 text-[#003B5C]" />
            </div>
            <p className="text-base text-[#475569] leading-relaxed">Founded with a vision to democratize institutional-grade investment strategies, Wealthwolffs has grown from a boutique advisory into a comprehensive financial solutions provider.</p>
          </div>
        </div>
      </Section>

      {/* ── CAREERS ── */}
      <Section id="careers" className="py-14 md:py-20 bg-[#F9F8F6] relative overflow-hidden">
        <div className="geo-circle w-48 h-48 -bottom-10 -right-10 opacity-40"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <p className="overline text-sm mb-3">Join Our Team</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-6">Careers at Wealthwolffs</h2>
            <p className="text-base text-[#475569] leading-relaxed mb-6">We're always looking for talented individuals passionate about financial markets and technology.</p>
            <button onClick={() => document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'})} className="btn-primary text-xs tracking-[0.1em] uppercase px-8 py-3 inline-flex items-center gap-2" data-testid="careers-cta">
              Get in Touch <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Section>

      {/* ── MEDIA ── */}
      <Section id="media" className="py-14 md:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <p className="overline text-sm mb-3">In The News</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-8">Media & Insights</h2>
          <MediaSection />
        </div>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section id="testimonials" className="py-14 md:py-20 bg-[#F9F8F6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <p className="overline text-sm mb-3">Testimonials</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-8">What Our Customers Say</h2>
          <TestimonialsSection />
        </div>
      </Section>

      {/* ── CONTACT ── */}
      <Section id="contact" className="py-14 md:py-20 bg-[#F9F8F6] relative overflow-hidden">
        <div className="geo-circle w-72 h-72 -top-20 -right-20 opacity-30"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="overline text-sm mb-3">Get in Touch</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-6">Contact Us</h2>
              <p className="text-base text-[#475569] leading-relaxed mb-8">Have questions about our investment solutions? Reach out and our team will get back to you within 24 hours.</p>
              <ContactForm />
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="text-center relative">
                <div className="absolute inset-0 flex items-center justify-center"><div className="w-60 h-60 rounded-full border border-[#C4A47C]/10"></div></div>
                <div className="absolute inset-0 flex items-center justify-center"><div className="w-44 h-44 rounded-full border border-[#003B5C]/10"></div></div>
                <img src="/logo-white.png" alt="Wealthwolffs" className="w-36 h-36 object-contain mx-auto mb-6 relative z-10" />
                <p className="text-sm font-medium text-[#0A192F] relative z-10">Wealthwolffs Global Hedged Solutions</p>
                <p className="text-xs text-[#C4A47C] mt-2 relative z-10">Building Wealth. Protecting Futures.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}