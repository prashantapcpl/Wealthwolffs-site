import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/App.css';

const LOGO_URL = '/logo-white.png';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [scienceText, setScienceText] = useState('');
  const targetText = 'Science';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  useEffect(() => {
    const t1 = setTimeout(() => setShowText(true), 300);
    const t2 = setTimeout(() => {
      let iteration = 0;
      const interval = setInterval(() => {
        setScienceText(
          targetText.split('').map((char, i) => {
            if (i < iteration) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('')
        );
        iteration += 1 / 3;
        if (iteration >= targetText.length) {
          setScienceText(targetText);
          clearInterval(interval);
        }
      }, 40);
    }, 800);
    const t3 = setTimeout(() => setShowSubtext(true), 1800);
    const t4 = setTimeout(() => setShowButton(true), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div className="landing-hero" data-testid="landing-page">
      {/* Top left - Logo + Company full name */}
      <div
        className="absolute top-0 left-0 z-10 flex items-center gap-4 px-6 md:px-12 py-5 transition-all duration-700"
        style={{ opacity: showText ? 1 : 0 }}
      >
        <button onClick={() => navigate('/')} className="flex items-center gap-4" data-testid="landing-logo-btn">
          <img src={LOGO_URL} alt="Wealthwolffs" className="h-24 w-24 sm:h-28 sm:w-28 object-contain" />
          <div className="flex flex-col">
            <span className="text-lg sm:text-2xl font-semibold text-[#0A192F] tracking-wide leading-tight">WEALTHWOLFFS</span>
            <span className="text-[10px] sm:text-xs text-[#475569] tracking-[0.15em] uppercase leading-tight mt-0.5">Global Hedged Solutions</span>
          </div>
        </button>
      </div>

      {/* Center content */}
      <div className="text-center px-6 max-w-6xl mt-16 sm:mt-20">
        {/* "We at Wealthwolffs understand the Financial" */}
        <p
          className="text-lg sm:text-2xl md:text-3xl text-[#0A192F] font-medium tracking-wide mb-2 transition-all duration-700"
          style={{ opacity: showText ? 1 : 0, transform: showText ? 'translateY(0)' : 'translateY(15px)', fontFamily: 'Cabinet Grotesk, IBM Plex Sans, sans-serif' }}
        >
          We at Wealthwolffs understand the{' '}
          <span className="text-[#003B5C]" style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500 }}>Financial</span>
        </p>

        {/* Science - Two Sigma style massive text */}
        <h1
          className="landing-science-word transition-all duration-700"
          style={{ opacity: showText ? 1 : 0, transform: showText ? 'scale(1)' : 'scale(0.9)' }}
          data-testid="landing-headline"
        >
          <span className="science-letters" data-testid="science-text">
            {(scienceText || 'Science').split('').map((char, i) => (
              <span
                key={i}
                className="science-letter"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {char}
              </span>
            ))}
          </span>
        </h1>

        {/* Subtext */}
        <p
          className="mt-2 text-base sm:text-lg md:text-xl text-[#475569] font-light tracking-wide transition-all duration-700"
          style={{ opacity: showSubtext ? 1 : 0, transform: showSubtext ? 'translateY(0)' : 'translateY(15px)', fontFamily: 'IBM Plex Sans, sans-serif' }}
          data-testid="landing-subtext"
        >
          like no one else.
        </p>

        {/* Enter button */}
        <div
          className="mt-8 transition-all duration-700"
          style={{ opacity: showButton ? 1 : 0, transform: showButton ? 'translateY(0)' : 'translateY(15px)' }}
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
