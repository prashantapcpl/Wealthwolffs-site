import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/App.css';

const LOGO_URL = '/logo-white.png';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [financialText, setFinancialText] = useState('');
  const [scienceText, setScienceText] = useState('');
  const financialTarget = 'Financial';
  const scienceTarget = 'Science';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  const scramble = (target, setter) => {
    let iteration = 0;
    const interval = setInterval(() => {
      setter(
        target.split('').map((char, i) => {
          if (i < iteration) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      iteration += 1 / 3;
      if (iteration >= target.length) {
        setter(target);
        clearInterval(interval);
      }
    }, 40);
  };

  useEffect(() => {
    const t1 = setTimeout(() => setShowText(true), 300);
    const t2 = setTimeout(() => scramble(financialTarget, setFinancialText), 800);
    const t3 = setTimeout(() => scramble(scienceTarget, setScienceText), 1400);
    const t4 = setTimeout(() => setShowSubtext(true), 2200);
    const t5 = setTimeout(() => setShowButton(true), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  return (
    <div className="landing-hero" data-testid="landing-page">

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes floatGlow {
          0%   { transform: translateY(0px);   text-shadow: 0 0 8px rgba(196,164,124,0.4); }
          50%  { transform: translateY(-6px);  text-shadow: 0 0 18px rgba(196,164,124,0.8), 0 0 32px rgba(196,164,124,0.3); }
          100% { transform: translateY(0px);   text-shadow: 0 0 8px rgba(196,164,124,0.4); }
        }
        .wealthwolffs-gold {
          color: #C4A47C;
          font-weight: 700;
          display: inline-block;
          animation: floatGlow 3s ease-in-out infinite;
          letter-spacing: 0.02em;
        }
      `}</style>

      {/* Top left - Logo + Company full name */}
      <div
        className="absolute top-0 left-0 z-10 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 md:px-12 py-4 sm:py-5 transition-all duration-700"
        style={{ opacity: showText ? 1 : 0 }}
      >
        <button onClick={() => navigate('/')} className="flex items-center gap-3 sm:gap-4" data-testid="landing-logo-btn">
          <img src={LOGO_URL} alt="Wealthwolffs" className="h-16 w-16 sm:h-24 sm:w-24 md:h-28 md:w-28 object-contain" />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg md:text-2xl font-semibold text-[#0A192F] tracking-wide leading-tight">WEALTHWOLFFS</span>
            <span className="text-[8px] sm:text-[10px] md:text-xs text-[#475569] tracking-[0.15em] uppercase leading-tight mt-0.5">Global Hedged Solutions</span>
          </div>
        </button>
      </div>

      {/* Center content */}
      <div className="text-center px-4 sm:px-6 max-w-6xl mt-12 sm:mt-16 md:mt-20 w-full mx-auto flex flex-col items-center">

        {/* Intro line — 1.5x bigger, Wealthwolffs in gold + floating */}
        <p
          className="transition-all duration-700"
          style={{
            opacity: showText ? 1 : 0,
            transform: showText ? 'translateY(0)' : 'translateY(15px)',
            fontFamily: 'Cabinet Grotesk, IBM Plex Sans, sans-serif',
            fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)',
            fontWeight: 500,
            color: '#0A192F',
            letterSpacing: '0.04em',
            marginBottom: '0.5rem',
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          We at <span className="wealthwolffs-gold">Wealthwolffs</span> understand the
        </p>

        {/* FINANCIAL — 15% smaller, centered */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            transform: 'scale(0.85)',
            transformOrigin: 'center center',
            opacity: showText ? 1 : 0,
            transition: 'opacity 0.7s',
            lineHeight: 1,
          }}
        >
          <h1 className="landing-science-word" style={{ margin: 0, textAlign: 'center' }}>
            <span className="science-letters">
              {(financialText || 'Financial').split('').map((char, i) => (
                <span key={i} className="science-letter" style={{ animationDelay: `${i * 0.08}s` }}>
                  {char}
                </span>
              ))}
            </span>
          </h1>
        </div>

        {/* SCIENCE — 40% smaller, centered */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            transform: 'scale(0.6)',
            transformOrigin: 'center center',
            opacity: showText ? 1 : 0,
            transition: 'opacity 0.7s',
            lineHeight: 1,
            marginTop: '-3rem',
          }}
        >
          <h1
            className="landing-science-word"
            style={{ margin: 0, textAlign: 'center' }}
            data-testid="landing-headline"
          >
            <span className="science-letters" data-testid="science-text">
              {(scienceText || 'Science').split('').map((char, i) => (
                <span key={i} className="science-letter" style={{ animationDelay: `${i * 0.08}s` }}>
                  {char}
                </span>
              ))}
            </span>
          </h1>
        </div>

        {/* "like no one else" — 70% of intro line size */}
        <p
          className="transition-all duration-700"
          style={{
            opacity: showSubtext ? 1 : 0,
            transform: showSubtext ? 'translateY(0)' : 'translateY(15px)',
            fontFamily: 'IBM Plex Sans, sans-serif',
            fontSize: 'clamp(1.05rem, 2.45vw, 1.96rem)',
            fontWeight: 300,
            color: '#475569',
            letterSpacing: '0.06em',
            textAlign: 'center',
            marginTop: '1rem',
          }}
          data-testid="landing-subtext"
        >
          like no one else.
        </p>

        {/* Enter button */}
        <div
          className="mt-8 transition-all duration-700"
          style={{
            opacity: showButton ? 1 : 0,
            transform: showButton ? 'translateY(0)' : 'translateY(15px)',
            textAlign: 'center',
          }}
        >
          <button
            onClick={() => navigate('/home')}
            className="btn-primary text-sm tracking-[0.15em] uppercase px-10 py-4"
            data-testid="enter-site-btn"
          >
            Enter the Site
          </button>
        </div>
      </div>
    </div>
  );
}
