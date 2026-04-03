import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, TrendingUp, Shield, BarChart3, Globe, Building2, Banknote, PiggyBank, Landmark, LineChart, Quote, Newspaper, ChevronLeft, ChevronRight, Users, Target, Award, Briefcase, Sparkles, ArrowUpRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const HERO_IMAGE = 'https://images.pexels.com/photos/6915077/pexels-photo-6915077.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';
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
            {/* Watermark number */}
            <span className="absolute top-2 right-3 text-5xl font-extrabold text-[#003B5C]/[0.04]" style={{ fontFamily: 'Sora, sans-serif' }}>{s.num}</span>
            <div className="p-6 relative z-10">
              <div className="icon-circle mb-4">
                <s.icon className="w-6 h-6 text-[#003B5C]" />
              </div>
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
          {/* Large decorative quote */}
          <span className="absolute top-4 right-6 text-6xl leading-none text-[#C4A47C]/20" style={{ fontFamily: 'Playfair Display, serif' }}>"</span>
          <div className="relative z-10">
            <p className="text-sm text-[#475569] leading-relaxed mb-6 italic" style={{ fontFamily: 'Playfair Display, serif' }}>
              "{t.quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003B5C] to-[#C4A47C] flex items-center justify-center text-white text-sm font-semibold">
                {t.name?.charAt(0)}
              </div>
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
          {/* Top gradient bar */}
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
            <p className="text-xs text-[#475569]/60 mt-2">{new Date(a.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', message: '' });
      }
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl" data-testid="contact-form">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#0A192F] mb-1.5 uppercase tracking-wider">Name</label>
          <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-[#E2E8F0] bg-white text-sm text-[#0A192F] focus:ring-2 focus:ring-[#C4A47C] focus:outline-none transition-all" placeholder="Your full name" data-testid="contact-name" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#0A192F] mb-1.5 uppercase tracking-wider">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border border-[#E2E8F0] bg-white text-sm text-[#0A192F] focus:ring-2 focus:ring-[#C4A47C] focus:outline-none transition-all" placeholder="your@email.com" data-testid="contact-email" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#0A192F] mb-1.5 uppercase tracking-wider">Phone</label>
            <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 border border-[#E2E8F0] bg-white text-sm text-[#0A192F] focus:ring-2 focus:ring-[#C4A47C] focus:outline-none transition-all" placeholder="+91 XXXXX XXXXX" data-testid="contact-phone" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#0A192F] mb-1.5 uppercase tracking-wider">Message</label>
          <textarea required rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-4 py-3 border border-[#E2E8F0] bg-white text-sm text-[#0A192F] focus:ring-2 focus:ring-[#C4A47C] focus:outline-none transition-all resize-none" placeholder="How can we help you?" data-testid="contact-message" />
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

      {/* Hero Welcome */}
      <section className="pt-20 md:pt-24">
        <div className="relative py-10 sm:py-14 md:py-20 bg-[#F9F8F6] overflow-hidden" data-testid="hero-section">
          {/* Decorative geometric elements */}
          <div className="geo-circle w-64 h-64 -top-20 -right-20 opacity-50 hidden sm:block"></div>
          <div className="geo-circle w-40 h-40 bottom-10 -left-10 opacity-30 hidden sm:block"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#003B5C]/[0.02] to-[#C4A47C]/[0.02] rounded-full pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
            <div className="flex-1 w-full">
              <p className="overline text-xs sm:text-sm mb-3">Welcome to Wealthwolffs</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0A192F] leading-[1.1] mb-4 sm:mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>
                Building Generational<br />
                <span className="text-[#003B5C]">Wealth</span> Through{' '}
                <span className="science-text">Science</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-[#475569] leading-relaxed max-w-lg mb-6 sm:mb-8">
                Wealthwolffs Global Hedged Solutions delivers institutional-grade investment strategies to grow, protect, and sustain your wealth across generations.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <button onClick={() => document.querySelector('#solutions')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary text-xs tracking-[0.1em] uppercase px-6 sm:px-8 py-3 sm:py-3.5 inline-flex items-center justify-center gap-2" data-testid="hero-explore-btn">
                  Explore Solutions <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="btn-secondary text-xs tracking-[0.1em] uppercase px-6 sm:px-8 py-3 sm:py-3.5" data-testid="hero-contact-btn">
                  Get in Touch
                </button>
              </div>
              {/* Stats with animated counters */}
              <div className="flex gap-6 sm:gap-8 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#E2E8F0]">
                <div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#003B5C] stat-number" style={{ fontFamily: 'Sora, sans-serif' }}><AnimatedCounter target={5} suffix="+" /></p>
                  <p className="text-[10px] sm:text-xs text-[#475569] mt-1">Years Experience</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#003B5C] stat-number" style={{ fontFamily: 'Sora, sans-serif' }}><AnimatedCounter target={500} suffix="+" /></p>
                  <p className="text-[10px] sm:text-xs text-[#475569] mt-1">Happy Clients</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#003B5C] stat-number" style={{ fontFamily: 'Sora, sans-serif' }}><AnimatedCounter target={9} suffix="+" /></p>
                  <p className="text-[10px] sm:text-xs text-[#475569] mt-1">Solutions Offered</p>
                </div>
              </div>
            </div>
            <div className="flex-1 hidden lg:block relative">
              <div className="dot-grid">
                <img src={HERO_IMAGE} alt="Financial District" className="w-full h-[480px] object-cover relative z-10" />
              </div>
              {/* Accent frame */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-[#C4A47C]/20 -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated gradient divider */}
      <div className="gradient-bar"></div>

      {/* Who Are We */}
      <Section id="who-are-we" className="py-14 md:py-20 relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <p className="overline text-sm mb-3">About Us</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-5">
                Who Are We
              </h2>
              <p className="text-base text-[#475569] leading-relaxed mb-4">
                Wealthwolffs Global Hedged Solutions is a premier financial advisory and investment management firm established in 2020. We combine cutting-edge quantitative strategies with deep market expertise to deliver superior risk-adjusted returns for our clients.
              </p>
              <p className="text-base text-[#475569] leading-relaxed">
                Our team of seasoned professionals brings together decades of experience across global financial markets, hedge fund strategies, and wealth management. We believe in the power of financial science to transform lives and build lasting legacies.
              </p>
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

      {/* Solutions - moved right after About Us */}
      <Section id="solutions" className="py-14 md:py-20 bg-[#F9F8F6] relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <p className="overline text-sm mb-3">Our Solutions</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-10">
            Solutions & Services
          </h2>
          <SolutionsCarousel />
        </div>
      </Section>

      {/* Partners Strip */}
      <section className="py-8 sm:py-12 border-y border-[#E2E8F0] overflow-hidden" data-testid="partners-strip">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-4 sm:mb-6">
          <p className="overline text-sm text-center">Our Associated Partners</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="partners-scroll flex gap-10 sm:gap-16 items-center whitespace-nowrap">
            {[...partners, ...partners, ...partners].map((p, i) => (
              <span key={i} className="text-base sm:text-lg font-semibold text-[#0A192F]/20 tracking-wider uppercase">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Wealthwolffs */}
      <Section id="why-wealthwolffs" className="py-14 md:py-20 relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <p className="overline text-sm mb-3">Why Choose Us</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-8">
            Why Wealthwolffs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {whyWealthwolffs.map((item, i) => (
              <div key={i} className="bg-white border border-[#E2E8F0] p-5 sm:p-6 card-lift" data-testid={`why-card-${i}`}>
                <div className="icon-circle mb-4 pulse-ring">
                  <item.icon className="w-6 h-6 text-[#003B5C]" />
                </div>
                <h3 className="text-base font-medium text-[#0A192F] mb-2">{item.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Founder */}
      <Section id="founder" className="py-14 md:py-20 relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="overline text-sm mb-3">Leadership</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-6">
              Our Founder
            </h2>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#003B5C]/10 to-[#C4A47C]/10 border border-[#E2E8F0] flex items-center justify-center mx-auto mb-6 pulse-ring">
              <Briefcase className="w-10 h-10 text-[#003B5C]" />
            </div>
            <p className="text-base text-[#475569] leading-relaxed">
              Founded with a vision to democratize institutional-grade investment strategies, Wealthwolffs has grown from a boutique advisory into a comprehensive financial solutions provider. Our founder's deep expertise in quantitative finance and hedge fund management drives our commitment to delivering superior results for every client.
            </p>
          </div>
        </div>
      </Section>

      {/* Careers */}
      <Section id="careers" className="py-14 md:py-20 bg-[#F9F8F6] relative overflow-hidden">
        <div className="geo-circle w-48 h-48 -bottom-10 -right-10 opacity-40"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <p className="overline text-sm mb-3">Join Our Team</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-6">
              Careers at Wealthwolffs
            </h2>
            <p className="text-base text-[#475569] leading-relaxed mb-6">
              We're always looking for talented individuals who are passionate about financial markets and technology. Join us to work on cutting-edge investment strategies and make a meaningful impact on people's financial futures.
            </p>
            <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary text-xs tracking-[0.1em] uppercase px-8 py-3 inline-flex items-center gap-2" data-testid="careers-cta">
              Get in Touch <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Section>

      {/* Media / News */}
      <Section id="media" className="py-14 md:py-20 relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <p className="overline text-sm mb-3">In The News</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-8">
            Media & Insights
          </h2>
          <MediaSection />
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials" className="py-14 md:py-20 bg-[#F9F8F6] relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <p className="overline text-sm mb-3">Testimonials</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-8">
            What Our Customers Say
          </h2>
          <TestimonialsSection />
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" className="py-14 md:py-20 bg-[#F9F8F6] relative overflow-hidden">
        <div className="geo-circle w-72 h-72 -top-20 -right-20 opacity-30"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="overline text-sm mb-3">Get in Touch</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-6">
                Contact Us
              </h2>
              <p className="text-base text-[#475569] leading-relaxed mb-8">
                Have questions about our investment solutions? Want to discuss your financial goals? Reach out to us and our team will get back to you within 24 hours.
              </p>
              <ContactForm />
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="text-center relative">
                {/* Decorative rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-60 h-60 rounded-full border border-[#C4A47C]/10"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-44 h-44 rounded-full border border-[#003B5C]/10"></div>
                </div>
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
