import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/App.css';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_unified-kyc-platform/artifacts/pfh0lco5_wolff%20logo.png';

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
      // Scramble effect for "Science"
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
      {/* Logo */}
      <div
        className="mb-12 transition-all duration-700"
        style={{ opacity: showText ? 1 : 0, transform: showText ? 'translateY(0)' : 'translateY(20px)' }}
      >
        <img
          src={LOGO_URL}
          alt="Wealthwolffs"
          className="w-28 h-28 sm:w-36 sm:h-36 object-contain"
          data-testid="landing-logo"
        />
      </div>

      {/* Main headline */}
      <div className="text-center px-6 max-w-4xl">
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#0A192F] leading-tight transition-all duration-700"
          style={{ opacity: showText ? 1 : 0, transform: showText ? 'translateY(0)' : 'translateY(20px)' }}
          data-testid="landing-headline"
        >
          Wealthwolffs understands the Financial{' '}
          <span className="science-text text-3xl sm:text-4xl lg:text-5xl" data-testid="science-text">
            {scienceText || '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'}
          </span>
        </h1>

        {/* Subtext */}
        <p
          className="mt-4 text-lg sm:text-xl text-[#475569] font-light tracking-wide transition-all duration-700"
          style={{ opacity: showSubtext ? 1 : 0, transform: showSubtext ? 'translateY(0)' : 'translateY(15px)' }}
          data-testid="landing-subtext"
        >
          like no one else.
        </p>

        {/* Enter button */}
        <div
          className="mt-12 transition-all duration-700"
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

      {/* Bottom decoration line */}
      <div className="absolute bottom-8 flex items-center gap-3">
        <div className="w-12 h-px bg-[#C4A47C]"></div>
        <span className="text-xs tracking-[0.2em] text-[#C4A47C] font-medium uppercase">Since 2020</span>
        <div className="w-12 h-px bg-[#C4A47C]"></div>
      </div>
    </div>
  );
}
