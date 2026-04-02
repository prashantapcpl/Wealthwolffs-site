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

  const handleNav = (href) => {
    navigate('/home');
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <div className="landing-hero" data-testid="landing-page">
      {/* Top nav bar with logo + 4 buttons */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-700"
        style={{ opacity: showText ? 1 : 0 }}
        data-testid="landing-nav"
      >
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="Wealthwolffs" className="h-10 w-10 object-contain" />
          <span className="text-sm font-semibold text-[#0A192F] tracking-wide">WEALTHWOLFFS</span>
        </div>
        <nav className="flex items-center gap-4 sm:gap-6" data-testid="landing-nav-buttons">
          <button onClick={() => handleNav('#who-are-we')} className="text-xs sm:text-sm font-medium text-[#0A192F] hover:text-[#003B5C] transition-colors tracking-wide" data-testid="landing-nav-about">About Us</button>
          <button onClick={() => handleNav('#solutions')} className="text-xs sm:text-sm font-medium text-[#0A192F] hover:text-[#003B5C] transition-colors tracking-wide" data-testid="landing-nav-solutions">Solutions</button>
          <button onClick={() => handleNav('#solutions')} className="text-xs sm:text-sm font-medium text-[#0A192F] hover:text-[#003B5C] transition-colors tracking-wide" data-testid="landing-nav-products">Products</button>
          <button onClick={() => handleNav('#contact')} className="text-xs sm:text-sm font-medium text-[#0A192F] hover:text-[#003B5C] transition-colors tracking-wide" data-testid="landing-nav-contact">Contact Us</button>
        </nav>
      </div>

      {/* Center content */}
      <div className="text-center px-6 max-w-6xl">
        {/* Logo large */}
        <div
          className="mb-6 transition-all duration-700"
          style={{ opacity: showText ? 1 : 0, transform: showText ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <img
            src={LOGO_URL}
            alt="Wealthwolffs"
            className="w-20 h-20 sm:w-28 sm:h-28 object-contain mx-auto"
            data-testid="landing-logo"
          />
        </div>

        {/* "Wealthwolffs understands the Financial" */}
        <p
          className="text-lg sm:text-2xl md:text-3xl text-[#0A192F] font-medium tracking-wide mb-2 transition-all duration-700"
          style={{ opacity: showText ? 1 : 0, transform: showText ? 'translateY(0)' : 'translateY(15px)', fontFamily: 'Cabinet Grotesk, IBM Plex Sans, sans-serif' }}
        >
          Wealthwolffs understands the{' '}
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
