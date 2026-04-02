import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const LOGO_URL = '/logo-white.png';

const socialLinks = [
  { name: 'Twitter', icon: 'fa-x-twitter', url: '#' },
  { name: 'Facebook', icon: 'fa-facebook-f', url: '#' },
  { name: 'Instagram', icon: 'fa-instagram', url: '#' },
  { name: 'Threads', icon: 'fa-threads', url: '#' },
  { name: 'YouTube', icon: 'fa-youtube', url: '#' },
];

export default function Footer() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer-dark py-16 md:py-24" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={LOGO_URL} alt="Wealthwolffs" className="h-12 w-12 object-contain" />
              <div>
                <p className="text-white font-semibold text-sm tracking-wide">WEALTHWOLFFS</p>
                <p className="text-white/40 text-xs">Global Hedged Solutions</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Building generational wealth through financial science. Your trusted partner for innovative investment solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-[#C4A47C] text-xs font-semibold uppercase tracking-[0.2em] mb-4">Company</p>
            <div className="space-y-3">
              {['Who are we', 'Why Wealthwolffs', 'Founder', 'Careers'].map((item) => (
                <button key={item} onClick={() => scrollTo(`#${item.toLowerCase().replace(/\s+/g, '-')}`)} className="block text-sm text-white/60 hover:text-white transition-colors">
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <p className="text-[#C4A47C] text-xs font-semibold uppercase tracking-[0.2em] mb-4">Solutions</p>
            <div className="space-y-3">
              {['Long Term Investing', 'Short Term Investing', 'Mutual Funds', 'Hedge Strategies', 'Corporate Bonds'].map((item) => (
                <button key={item} onClick={() => scrollTo('#solutions')} className="block text-sm text-white/60 hover:text-white transition-colors">
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Products & Social */}
          <div>
            <p className="text-[#C4A47C] text-xs font-semibold uppercase tracking-[0.2em] mb-4">Products</p>
            <div className="space-y-3 mb-8">
              <button onClick={() => navigate('/products/wolffsinstaalerts')} className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors">
                WolffsInstaAlerts <ArrowUpRight className="w-3 h-3" />
              </button>
              <button onClick={() => navigate('/products/wolffsinstatrade')} className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors">
                WolffsInstaTrade <ArrowUpRight className="w-3 h-3" />
              </button>
              <button onClick={() => navigate('/academy')} className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors">
                Wolffs Academy <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-[#C4A47C] text-xs font-semibold uppercase tracking-[0.2em] mb-4">Follow Us</p>
            <div className="flex gap-3" data-testid="social-links">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/50 hover:text-white hover:border-[#C4A47C] transition-colors"
                  data-testid={`social-${s.name.toLowerCase()}`}
                  aria-label={s.name}
                >
                  <i className={`fa-brands ${s.icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">&copy; {new Date().getFullYear()} Wealthwolffs Global Hedged Solutions. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 text-xs hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/40 text-xs hover:text-white/70 transition-colors">Terms of Service</a>
            <a href="#" className="text-white/40 text-xs hover:text-white/70 transition-colors">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
