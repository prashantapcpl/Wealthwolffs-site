import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, TrendingUp, Shield, BarChart3, Globe, Building2, Banknote, PiggyBank, Landmark, LineChart, Quote, Newspaper, ChevronLeft, ChevronRight, Users, Target, Award, Briefcase, Sparkles, ArrowUpRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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

// ── LIVE TRADING VISUALIZATION CANVAS ──────────────────────────────────────
function TradingViz() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Candle data
    const CANDLES = 28;
    let candles = [];
    let basePrice = 320;
    for (let i = 0; i < CANDLES; i++) {
      const open = basePrice + (Math.random() - 0.5) * 20;
      const close = open + (Math.random() - 0.5) * 24;
      const high = Math.max(open, close) + Math.random() * 10;
      const low = Math.min(open, close) - Math.random() * 10;
      candles.push({ open, close, high, low });
      basePrice = close;
    }

    // Neural nodes
    const LAYERS = [3, 5, 5, 3];
    let nodes = [];
    LAYERS.forEach((count, li) => {
      for (let ni = 0; ni < count; ni++) {
        nodes.push({ li, ni, count, pulse: Math.random() * Math.PI * 2 });
      }
    });

    // Floating tickers
    const tickers = [
      { sym: 'NIFTY', val: 22480, change: +1.2 },
      { sym: 'RELIANCE', val: 2847, change: +0.8 },
      { sym: 'TCS', val: 3920, change: -0.4 },
      { sym: 'HDFC', val: 1654, change: +2.1 },
      { sym: 'INFY', val: 1789, change: +0.6 },
    ];

    // Particles
    let particles = Array.from({ length: 40 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let tick = 0;
    let raf;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      if (W === 0 || H === 0) { raf = requestAnimationFrame(draw); return; }

      // Background
      ctx.fillStyle = '#050F1A';
      ctx.fillRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = 'rgba(196,164,124,0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,164,124,${p.alpha})`;
        ctx.fill();
      });

      // ── CANDLESTICK CHART (bottom 40% of canvas) ──
      const chartTop = H * 0.55;
      const chartH = H * 0.36;
      const chartLeft = W * 0.04;
      const chartRight = W * 0.96;
      const chartW = chartRight - chartLeft;

      // Evolve last candle
      if (tick % 3 === 0) {
        const last = candles[candles.length - 1];
        last.close += (Math.random() - 0.48) * 3;
        last.high = Math.max(last.high, last.close + Math.random() * 4);
        last.low = Math.min(last.low, last.close - Math.random() * 4);
        if (tick % 60 === 0) {
          candles.shift();
          const prev = candles[candles.length - 1].close;
          const o = prev + (Math.random() - 0.5) * 8;
          const c = o + (Math.random() - 0.5) * 16;
          candles.push({ open: o, close: c, high: Math.max(o, c) + Math.random() * 8, low: Math.min(o, c) - Math.random() * 8 });
        }
      }

      const allVals = candles.flatMap(c => [c.high, c.low]);
      const minV = Math.min(...allVals) - 10;
      const maxV = Math.max(...allVals) + 10;
      const toY = v => chartTop + chartH - ((v - minV) / (maxV - minV)) * chartH;

      const cw = (chartW / CANDLES) * 0.6;
      const gap = chartW / CANDLES;

      // Chart glow overlay
      const grad = ctx.createLinearGradient(0, chartTop, 0, chartTop + chartH);
      grad.addColorStop(0, 'rgba(196,164,124,0.04)');
      grad.addColorStop(1, 'rgba(0,80,130,0.08)');
      ctx.fillStyle = grad;
      ctx.fillRect(chartLeft, chartTop, chartW, chartH);

      candles.forEach((c, i) => {
        const x = chartLeft + i * gap + gap / 2;
        const bull = c.close >= c.open;
        const color = bull ? '#00E5A0' : '#FF4D6D';
        const bodyTop = toY(Math.max(c.open, c.close));
        const bodyH = Math.max(1, Math.abs(toY(c.open) - toY(c.close)));

        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(x, toY(c.high));
        ctx.lineTo(x, toY(c.low));
        ctx.stroke();

        // Body
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = color;
        ctx.fillRect(x - cw / 2, bodyTop, cw, bodyH);

        // Glow on last candle
        if (i === candles.length - 1) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;
          ctx.fillRect(x - cw / 2, bodyTop, cw, bodyH);
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
      });

      // Moving average line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(196,164,124,0.7)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(196,164,124,0.5)';
      ctx.shadowBlur = 6;
      const ma = 7;
      candles.forEach((c, i) => {
        if (i < ma) return;
        const avg = candles.slice(i - ma, i).reduce((s, cc) => s + cc.close, 0) / ma;
        const x = chartLeft + i * gap + gap / 2;
        i === ma ? ctx.moveTo(x, toY(avg)) : ctx.lineTo(x, toY(avg));
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Volume bars (very subtle at bottom)
      candles.forEach((c, i) => {
        const x = chartLeft + i * gap + gap / 2;
        const vol = 10 + Math.random() * 20;
        const bull = c.close >= c.open;
        ctx.fillStyle = bull ? 'rgba(0,229,160,0.15)' : 'rgba(255,77,109,0.15)';
        ctx.fillRect(x - cw / 2, chartTop + chartH - vol, cw, vol);
      });

      // ── NEURAL NETWORK (top 48% of canvas) ──
      const nnTop = H * 0.04;
      const nnH = H * 0.44;
      const nnLeft = W * 0.06;
      const nnRight = W * 0.94;

      const getNodePos = (n) => {
        const lx = nnLeft + (n.li / (LAYERS.length - 1)) * (nnRight - nnLeft);
        const ly = nnTop + ((n.ni + 0.5) / n.count) * nnH;
        return { x: lx, y: ly };
      };

      // Draw connections
      nodes.forEach(n => {
        if (n.li >= LAYERS.length - 1) return;
        const nextLayer = nodes.filter(m => m.li === n.li + 1);
        const pos1 = getNodePos(n);
        nextLayer.forEach(m => {
          const pos2 = getNodePos(m);
          const pulse = (Math.sin(tick * 0.04 + n.pulse) + 1) / 2;
          ctx.beginPath();
          ctx.moveTo(pos1.x, pos1.y);
          ctx.lineTo(pos2.x, pos2.y);
          ctx.strokeStyle = `rgba(196,164,124,${0.08 + pulse * 0.18})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Traveling dot
          if (Math.sin(tick * 0.06 + n.pulse * 2) > 0.7) {
            const t = (tick * 0.02 + n.pulse) % 1;
            const dx = pos1.x + (pos2.x - pos1.x) * t;
            const dy = pos1.y + (pos2.y - pos1.y) * t;
            ctx.beginPath();
            ctx.arc(dx, dy, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(196,164,124,0.9)';
            ctx.shadowColor = '#C4A47C';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });

      // Draw nodes
      nodes.forEach(n => {
        const { x, y } = getNodePos(n);
        const pulse = (Math.sin(tick * 0.05 + n.pulse) + 1) / 2;
        const r = 5 + pulse * 3;

        // Outer glow
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
        g.addColorStop(0, `rgba(196,164,124,${0.3 + pulse * 0.3})`);
        g.addColorStop(1, 'rgba(196,164,124,0)');
        ctx.beginPath();
        ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.li === 0 ? '#005082' : n.li === LAYERS.length - 1 ? '#C4A47C' : '#003B5C';
        ctx.shadowColor = n.li === LAYERS.length - 1 ? '#C4A47C' : '#005082';
        ctx.shadowBlur = 10 + pulse * 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // ── TICKER STRIP ──
      ctx.font = '500 11px IBM Plex Mono, monospace';
      tickers.forEach((t, i) => {
        const x = W * 0.04 + i * (W * 0.185);
        const y = H * 0.52;
        const up = t.change >= 0;

        // Background pill
        ctx.fillStyle = 'rgba(0,59,92,0.5)';
        ctx.beginPath();
        ctx.roundRect(x, y - 14, 82, 22, 3);
        ctx.fill();

        ctx.fillStyle = '#C4A47C';
        ctx.fillText(t.sym, x + 5, y);
        ctx.fillStyle = up ? '#00E5A0' : '#FF4D6D';
        ctx.fillText(`${up ? '▲' : '▼'} ${Math.abs(t.change)}%`, x + 5, y + 13);
      });

      tick++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '480px',
        borderRadius: '2px',
        display: 'block',
        border: '1px solid rgba(196,164,124,0.2)',
        boxShadow: '0 0 40px rgba(0,59,92,0.3), inset 0 0 60px rgba(0,0,0,0.4)',
      }}
    />
  );
}

// ── GLOBE + WOLF VISUALIZATION ─────────────────────────────────────────────
function GlobeWolfViz() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const cities = [
      { name: 'MUMBAI',    lat:  19.076 * Math.PI / 180, lon:  72.878 * Math.PI / 180 },
      { name: 'LONDON',    lat:  51.507 * Math.PI / 180, lon:  -0.128 * Math.PI / 180 },
      { name: 'NEW YORK',  lat:  40.713 * Math.PI / 180, lon: -74.006 * Math.PI / 180 },
      { name: 'SINGAPORE', lat:   1.352 * Math.PI / 180, lon: 103.820 * Math.PI / 180 },
    ];
    const connections = [[0,1],[1,2],[0,3],[1,3],[2,3],[0,2]];

    // Wolf head side profile (snout facing right), normalized coords
    const wolfShape = [
      [-0.32,-0.24],[-0.34,-0.08],[-0.32, 0.08],
      [-0.20,-0.82],[-0.08,-0.90],[ 0.02,-0.80],
      [-0.04,-0.68],[ 0.06,-0.70],
      [ 0.16,-0.84],[ 0.26,-0.92],[ 0.34,-0.82],
      [ 0.26,-0.70],[ 0.16,-0.66],
      [ 0.20,-0.56],[ 0.22,-0.46],
      [ 0.16,-0.42],
      [ 0.26,-0.34],[ 0.34,-0.24],[ 0.42,-0.12],
      [ 0.50,-0.02],[ 0.48, 0.08],
      [ 0.38, 0.12],[ 0.26, 0.14],
      [ 0.14, 0.22],[ 0.02, 0.22],
      [-0.08, 0.34],[-0.12, 0.46],
      [ 0.04, 0.56],[ 0.18, 0.52],[ 0.28, 0.44],
      [ 0.30, 0.30],[ 0.28, 0.18],
      [-0.24, 0.34],[-0.30, 0.18],
      [-0.26,-0.42],[-0.22,-0.60],
      [-0.10,-0.54],[ 0.04,-0.58],[ 0.12,-0.62],
      [ 0.16,-0.52],[ 0.22,-0.44],
      [ 0.28,-0.14],[ 0.34,-0.04],[ 0.30, 0.06],
      [ 0.04,-0.12],[ 0.12,-0.22],[ 0.20,-0.14],
      [-0.06, 0.10],[-0.16, 0.10],[-0.22, 0.02],
      [-0.12,-0.20],[-0.04,-0.28],[ 0.08,-0.38],
      [ 0.00, 0.14],[ 0.08, 0.10],[ 0.16, 0.06],
      [-0.10,-0.40],[-0.20,-0.28],[-0.26,-0.10],
      [-0.04, 0.38],[ 0.08, 0.40],
    ];

    const N = wolfShape.length;
    let particles = Array.from({ length: N }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 400),
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: 1.2 + Math.random() * 1.2,
      alpha: 0.35 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
    }));

    let rotY = 0, tick = 0, raf;

    const proj = (lat, lon, R, cx, cy) => {
      const x3 = R * Math.cos(lat) * Math.sin(lon + rotY);
      const y3 = R * Math.sin(lat);
      const z3 = R * Math.cos(lat) * Math.cos(lon + rotY);
      return { x: cx + x3, y: cy - y3, z: z3 };
    };

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      if (!W || !H) { raf = requestAnimationFrame(draw); return; }
      const cx = W * 0.5, cy = H * 0.5;
      const R = Math.min(W, H) * 0.41;

      ctx.fillStyle = '#060E1A';
      ctx.fillRect(0, 0, W, H);

      const atmo = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.4);
      atmo.addColorStop(0, 'rgba(0,59,92,0.14)');
      atmo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = atmo;
      ctx.fillRect(0, 0, W, H);

      rotY += 0.004;

      // Latitude lines
      for (let i = 1; i < 9; i++) {
        const lat = -Math.PI / 2 + (i / 9) * Math.PI;
        ctx.beginPath();
        let go = false;
        for (let j = 0; j <= 80; j++) {
          const p = proj(lat, (j / 80) * Math.PI * 2, R, cx, cy);
          if (p.z > -R * 0.05) { go ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); go = true; }
          else go = false;
        }
        ctx.strokeStyle = 'rgba(0,100,160,0.20)'; ctx.lineWidth = 0.5; ctx.stroke();
      }

      // Longitude lines
      for (let i = 0; i < 14; i++) {
        const lon = (i / 14) * Math.PI * 2;
        ctx.beginPath();
        let go = false;
        for (let j = 0; j <= 80; j++) {
          const p = proj(-Math.PI / 2 + (j / 80) * Math.PI, lon, R, cx, cy);
          if (p.z > -R * 0.05) { go ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); go = true; }
          else go = false;
        }
        ctx.strokeStyle = 'rgba(0,100,160,0.20)'; ctx.lineWidth = 0.5; ctx.stroke();
      }

      // Equator highlight
      ctx.beginPath();
      let go = false;
      for (let j = 0; j <= 120; j++) {
        const p = proj(0, (j / 120) * Math.PI * 2, R, cx, cy);
        if (p.z > 0) { go ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); go = true; }
        else go = false;
      }
      ctx.strokeStyle = 'rgba(196,164,124,0.18)'; ctx.lineWidth = 1; ctx.stroke();

      // City connection arcs
      connections.forEach(([a, b], ci) => {
        const cA = cities[a], cB = cities[b];
        const pulse = (Math.sin(tick * 0.022 + ci * 1.4) + 1) / 2;
        ctx.beginPath();
        let first = true;
        for (let t = 0; t <= 50; t++) {
          const f = t / 50;
          const p = proj(cA.lat + (cB.lat - cA.lat) * f, cA.lon + (cB.lon - cA.lon) * f, R * 1.015, cx, cy);
          if (p.z > -R * 0.1) { first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); first = false; }
          else first = true;
        }
        ctx.strokeStyle = `rgba(196,164,124,${0.12 + pulse * 0.42})`;
        ctx.lineWidth = 0.7 + pulse * 0.7;
        ctx.shadowColor = '#C4A47C'; ctx.shadowBlur = 2 + pulse * 8;
        ctx.stroke(); ctx.shadowBlur = 0;

        // Traveling signal dot
        const tt = ((tick * 0.01 + ci * 0.5) % 1);
        const tp = proj(cA.lat + (cB.lat - cA.lat) * tt, cA.lon + (cB.lon - cA.lon) * tt, R * 1.02, cx, cy);
        if (tp.z > 0) {
          ctx.beginPath(); ctx.arc(tp.x, tp.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#C4A47C'; ctx.shadowColor = '#C4A47C'; ctx.shadowBlur = 10;
          ctx.fill(); ctx.shadowBlur = 0;
        }
      });

      // City markers + labels
      cities.forEach((city, i) => {
        const p = proj(city.lat, city.lon, R, cx, cy);
        if (p.z < 0) return;
        const pulse = (Math.sin(tick * 0.05 + i * 1.5) + 1) / 2;
        const ringR = 4 + ((tick * 0.4 + i * 30) % 28);
        ctx.beginPath(); ctx.arc(p.x, p.y, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(196,164,124,${Math.max(0, 0.5 - ringR / 28 * 0.5)})`;
        ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(p.x, p.y, 3 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = '#C4A47C'; ctx.shadowColor = '#C4A47C'; ctx.shadowBlur = 8 + pulse * 10;
        ctx.fill(); ctx.shadowBlur = 0;
        ctx.font = '500 8px IBM Plex Mono, monospace';
        ctx.fillStyle = `rgba(196,164,124,${0.5 + pulse * 0.4})`;
        ctx.fillText(city.name, p.x + 8, p.y + 3);
      });

      // Wolf particle morph — cycle every ~9s at 60fps
      const CYCLE = 540;
      const phase = (tick % CYCLE) / CYCLE;
      let morphAmt = 0;
      if (phase > 0.28 && phase < 0.72) {
        const t = (phase - 0.28) / 0.44;
        morphAmt = t < 0.25 ? t / 0.25 : t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1;
        morphAmt = morphAmt * morphAmt * (3 - 2 * morphAmt); // smoothstep
      }

      const wS = H * 0.44;
      const wCX = cx, wCY = cy;

      particles.forEach((p, i) => {
        p.x += p.vx + Math.sin(tick * 0.008 + p.phase) * 0.25;
        p.y += p.vy + Math.cos(tick * 0.011 + p.phase) * 0.25;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        const tx = wCX + wolfShape[i][0] * wS;
        const ty = wCY + wolfShape[i][1] * wS;
        const dx = p.x + (tx - p.x) * morphAmt;
        const dy = p.y + (ty - p.y) * morphAmt;

        ctx.beginPath();
        ctx.arc(dx, dy, p.r * (1 + morphAmt * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,164,124,${p.alpha * (0.5 + morphAmt * 0.5)})`;
        ctx.shadowColor = '#C4A47C';
        ctx.shadowBlur = morphAmt > 0.2 ? morphAmt * 8 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Mesh lines connecting nearby particles when wolf is forming
      if (morphAmt > 0.35) {
        const la = (morphAmt - 0.35) / 0.65 * 0.22;
        ctx.lineWidth = 0.4;
        for (let i = 0; i < N; i++) {
          const px = particles[i].x + (wCX + wolfShape[i][0] * wS - particles[i].x) * morphAmt;
          const py = particles[i].y + (wCY + wolfShape[i][1] * wS - particles[i].y) * morphAmt;
          for (let j = i + 1; j < Math.min(i + 7, N); j++) {
            const qx = particles[j].x + (wCX + wolfShape[j][0] * wS - particles[j].x) * morphAmt;
            const qy = particles[j].y + (wCY + wolfShape[j][1] * wS - particles[j].y) * morphAmt;
            const d = Math.hypot(px - qx, py - qy);
            if (d < wS * 0.2) {
              ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(qx, qy);
              ctx.strokeStyle = `rgba(196,164,124,${la * (1 - d / (wS * 0.2))})`;
              ctx.stroke();
            }
          }
        }
      }

      tick++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
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
            <span className="absolute top-2 right-3 text-5xl font-extrabold text-[#003B5C]/[0.04]" style={{ fontFamily: 'Sora, sans-serif' }}>{s.num}</span>
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
          <span className="absolute top-4 right-6 text-6xl leading-none text-[#C4A47C]/20" style={{ fontFamily: 'Playfair Display, serif' }}>"</span>
          <div className="relative z-10">
            <p className="text-sm text-[#475569] leading-relaxed mb-6 italic" style={{ fontFamily: 'Playfair Display, serif' }}>"{t.quote}"</p>
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
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/enquiries`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { setSubmitted(true); setForm({ name: '', email: '', phone: '', message: '' }); }
    } catch {} finally { setLoading(false); }
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

// ── HERO HEADLINE ──────────────────────────────────────────────────────────
function HeroHeadline() {
  return (
    <h1
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0A192F] leading-[1.1] mb-4 sm:mb-5"
      style={{ fontFamily: 'Sora, sans-serif' }}
      data-testid="landing-headline"
    >
      Building Generational<br />
      <span className="text-[#003B5C]">Wealth</span> Through
      <br />
      <span style={{
        color: '#C4A47C',
        fontStyle: 'italic',
        animation: 'heroFadeIn 1s ease-out 0.4s both',
      }}>
        Financial
      </span>{' '}
      <span style={{
        color: '#003B5C',
        animation: 'heroFadeIn 1s ease-out 1s both',
      }}>
        Science
      </span>
    </h1>
  );
}

export default function MainSite() {
  return (
    <div className="min-h-screen bg-white" data-testid="main-site">
      <Header />

      {/* Hero */}
      <section className="pt-20 md:pt-24">
        <div className="relative py-10 sm:py-14 md:py-20 bg-[#F9F8F6] overflow-hidden" data-testid="hero-section">
          <div className="geo-circle w-64 h-64 -top-20 -right-20 opacity-50 hidden sm:block"></div>
          <div className="geo-circle w-40 h-40 bottom-10 -left-10 opacity-30 hidden sm:block"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
            {/* Left — text */}
            <div className="flex-1 w-full">
              <p className="overline text-xs sm:text-sm mb-3">Welcome to Wealthwolffs</p>
              <HeroHeadline />
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
              <div className="flex gap-6 sm:gap-8 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#E2E8F0]">
                <div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#003B5C] stat-number" style={{ fontFamily: 'Sora, sans-serif' }}><AnimatedCounter target={10} suffix="+" /></p>
                  <p className="text-[10px] sm:text-xs text-[#475569] mt-1">Years Experience</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#003B5C] stat-number" style={{ fontFamily: 'Sora, sans-serif' }}><AnimatedCounter target={250} suffix="+" /></p>
                  <p className="text-[10px] sm:text-xs text-[#475569] mt-1">Happy Clients</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#003B5C] stat-number" style={{ fontFamily: 'Sora, sans-serif' }}><AnimatedCounter target={10} suffix="+" /></p>
                  <p className="text-[10px] sm:text-xs text-[#475569] mt-1">Solutions Offered</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#003B5C] stat-number" style={{ fontFamily: 'Sora, sans-serif' }}><AnimatedCounter target={100} suffix=" Cr.+" /></p>
                  <p className="text-[10px] sm:text-xs text-[#475569] mt-1">AUM Handled</p>
                </div>
              </div>
            </div>

            {/* Right — Live Trading Visualization */}
            <div className="flex-1 hidden lg:block relative">
              <TradingViz />
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#C4A47C]/20 -z-0 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="gradient-bar"></div>

      {/* Who Are We */}
      <Section id="who-are-we" className="py-14 md:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <p className="overline text-sm mb-3">About Us</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-5">Who Are We</h2>
              <p className="text-base text-[#475569] leading-relaxed mb-4">
                Wealthwolffs Global Hedged Solutions is a premier financial advisory and investment management firm established in 2020. We combine cutting-edge quantitative strategies with deep market expertise to deliver superior risk-adjusted returns for our clients.
              </p>
              <p className="text-base text-[#475569] leading-relaxed">
                Our team of seasoned professionals brings together decades of experience across global financial markets, hedge fund strategies, and wealth management. We believe in the power of financial science to transform lives and build lasting legacies.
              </p>
            </div>
            <div className="relative">
              <div className="dot-grid">
                <div className="w-full h-[280px] sm:h-[350px] lg:h-[400px] relative z-10 overflow-hidden" style={{ border: '1px solid rgba(196,164,124,0.15)', boxShadow: '0 0 40px rgba(0,59,92,0.25), inset 0 0 60px rgba(0,0,0,0.3)' }}>
                  <GlobeWolfViz />
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-[#003B5C]/10 -z-0 hidden lg:block"></div>
            </div>
          </div>
        </div>
      </Section>

      {/* Solutions */}
      <Section id="solutions" className="py-14 md:py-20 bg-[#F9F8F6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <p className="overline text-sm mb-3">Our Solutions</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-10">Solutions & Services</h2>
          <SolutionsCarousel />
        </div>
      </Section>

      {/* Partners */}
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
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-8">Why Wealthwolffs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {whyWealthwolffs.map((item, i) => (
              <div key={i} className="bg-white border border-[#E2E8F0] p-5 sm:p-6 card-lift" data-testid={`why-card-${i}`}>
                <div className="icon-circle mb-4 pulse-ring"><item.icon className="w-6 h-6 text-[#003B5C]" /></div>
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-6">Our Founder</h2>
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-6">Careers at Wealthwolffs</h2>
            <p className="text-base text-[#475569] leading-relaxed mb-6">
              We're always looking for talented individuals who are passionate about financial markets and technology. Join us to work on cutting-edge investment strategies and make a meaningful impact on people's financial futures.
            </p>
            <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary text-xs tracking-[0.1em] uppercase px-8 py-3 inline-flex items-center gap-2" data-testid="careers-cta">
              Get in Touch <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Section>

      {/* Media */}
      <Section id="media" className="py-14 md:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <p className="overline text-sm mb-3">In The News</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-8">Media & Insights</h2>
          <MediaSection />
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials" className="py-14 md:py-20 bg-[#F9F8F6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <p className="overline text-sm mb-3">Testimonials</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-8">What Our Customers Say</h2>
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
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-6">Contact Us</h2>
              <p className="text-base text-[#475569] leading-relaxed mb-8">
                Have questions about our investment solutions? Want to discuss your financial goals? Reach out to us and our team will get back to you within 24 hours.
              </p>
              <ContactForm />
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="text-center relative">
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