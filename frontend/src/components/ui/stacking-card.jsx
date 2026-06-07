import { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const CARD_W = 380;
const CARD_GAP = 32;
const STEP = CARD_W + CARD_GAP;
const AUTO_SPEED = 0.4; // px per frame — slow drift right → left

function SolutionCard({ solution }) {
  const Icon = solution.icon;
  return (
    <div
      className="flex-shrink-0 w-[380px] h-[460px] bg-white border border-[#E2E8F0] relative overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#003B5C]/10"
    >
      {/* Top accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-[#003B5C] to-[#C4A47C] flex-shrink-0" />

      {/* Watermark number */}
      <span
        className="absolute bottom-3 right-4 text-[96px] font-extrabold leading-none select-none pointer-events-none"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(0,59,92,0.04)' }}
      >
        {solution.num}
      </span>

      <div className="p-7 flex flex-col flex-1 relative z-10">
        {/* Icon circle */}
        <div
          className="w-14 h-14 rounded-full border border-[#E2E8F0] flex items-center justify-center mb-5 group-hover:border-[#003B5C]/30 group-hover:scale-110 transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, rgba(0,59,92,0.06), rgba(196,164,124,0.06))' }}
        >
          <Icon className="w-7 h-7 text-[#003B5C]" />
        </div>

        {/* Number overline */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7A5C35] mb-1.5">{solution.num}</p>

        {/* Title */}
        <h3
          className="text-[1.1rem] font-bold text-[#0A192F] mb-3 leading-snug"
          style={{ fontFamily: "'Cabinet Grotesk', 'IBM Plex Sans', sans-serif" }}
        >
          {solution.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#475569] leading-relaxed flex-1">{solution.desc}</p>

        {/* CTA */}
        <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center gap-2 text-[#003B5C] text-[11px] font-semibold uppercase tracking-[0.14em] group-hover:gap-3 transition-all duration-200">
          <span>Learn More</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}

export default function StackingCards({ solutions }) {
  const headerRef = useRef(null);
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const [entered, setEntered] = useState(false);

  // Duplicate the list so the auto-scroll can loop seamlessly
  const loop = [...solutions, ...solutions];

  // Continuous slow auto-scroll: right → left
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf;
    const tick = () => {
      if (!pausedRef.current) {
        track.scrollLeft += AUTO_SPEED;
        // When we've scrolled past the first set, jump back for a seamless loop
        const half = track.scrollWidth / 2;
        if (track.scrollLeft >= half) track.scrollLeft -= half;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [solutions.length]);

  // Manual step via the arrow buttons
  const scrollByStep = useCallback((dir) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * STEP, behavior: 'smooth' });
  }, []);

  // Animate header in on first enter
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setEntered(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-20 bg-[#F9F8F6] overflow-hidden">
      {/* Section header */}
      <div
        ref={headerRef}
        className="px-6 md:px-20 mb-8 transition-all duration-700"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(16px)',
        }}
      >
        <p className="overline text-xs mb-2">Our Solutions</p>
        <div className="flex items-end justify-between gap-6">
          <h2
            className="text-3xl md:text-4xl font-bold text-[#0A192F] leading-tight"
            style={{ fontFamily: "'Cabinet Grotesk', 'IBM Plex Sans', sans-serif" }}
          >
            Strategies built for{' '}
            <em style={{ fontFamily: "'Playfair Display', serif", color: '#C4A47C', fontStyle: 'italic' }}>
              every goal
            </em>
          </h2>

          {/* Manual scroll buttons */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              type="button"
              aria-label="Previous solution"
              onClick={() => scrollByStep(-1)}
              className="w-10 h-10 border border-[#E2E8F0] bg-white text-[#003B5C] flex items-center justify-center transition-colors hover:bg-[#003B5C] hover:text-white hover:border-[#003B5C]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Next solution"
              onClick={() => scrollByStep(1)}
              className="w-10 h-10 border border-[#E2E8F0] bg-white text-[#003B5C] flex items-center justify-center transition-colors hover:bg-[#003B5C] hover:text-white hover:border-[#003B5C]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards strip — auto-scrolls, pauses on hover */}
      <div className="relative">
        {/* Edge fades — hint more cards exist */}
        <div
          className="absolute inset-y-0 left-0 w-20 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #F9F8F6 0%, transparent 100%)' }}
        />
        <div
          className="absolute inset-y-0 right-0 w-20 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #F9F8F6 0%, transparent 100%)' }}
        />

        <div
          ref={trackRef}
          className="flex px-6 md:px-20 overflow-x-auto no-scrollbar"
          style={{ scrollbarWidth: 'none' }}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          {loop.map((solution, i) => (
            <div key={i} className="py-4" style={{ marginRight: `${CARD_GAP}px` }}>
              <SolutionCard solution={solution} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-20 mt-6">
        <p className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#475569]">
          Hover to pause · use the arrows to browse all {solutions.length} solutions
        </p>
      </div>
    </div>
  );
}
