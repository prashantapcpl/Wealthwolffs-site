import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Bell, TrendingUp, Zap, BarChart3, Shield, Globe, Lock, Wallet, LineChart } from 'lucide-react';

const products = {
  wolffsinstaalerts: {
    name: 'WolffsInstaAlerts',
    tagline: 'Real-time market intelligence, delivered instantly.',
    description: 'WolffsInstaAlerts is your gateway to real-time financial market alerts. Get instant notifications on market movements, stock price triggers, sector rotations, and investment opportunities curated by our expert analysts. Never miss a trading opportunity again.',
    features: [
      { icon: Bell, title: 'Instant Notifications', desc: 'Real-time alerts for price movements, breakouts, and market shifts delivered to your device.' },
      { icon: TrendingUp, title: 'Expert Analysis', desc: 'Each alert comes with analyst commentary and actionable insights for informed decisions.' },
      { icon: Zap, title: 'Custom Triggers', desc: 'Set personalized alert triggers based on your portfolio, watchlist, and investment strategy.' },
      { icon: Shield, title: 'Risk Alerts', desc: 'Get warned about potential risks, market corrections, and portfolio vulnerabilities.' },
    ],
    ctaText: 'Go to WolffsInstaAlerts',
    ctaLink: 'https://www.wolffsinstaalerts.com',
  },
  wolffsinstatrade: {
    name: 'WolffsInstaTrade',
    tagline: 'Execute trades with precision and confidence.',
    description: 'WolffsInstaTrade provides a seamless trading experience with advanced charting, one-click execution, and AI-powered trade recommendations. Built for both seasoned traders and beginners looking to navigate the markets with professional-grade tools.',
    features: [
      { icon: BarChart3, title: 'Advanced Charting', desc: 'Professional-grade charts with technical indicators, drawing tools, and multi-timeframe analysis.' },
      { icon: Zap, title: 'One-Click Trading', desc: 'Execute trades instantly with our streamlined interface designed for speed and accuracy.' },
      { icon: Globe, title: 'Multi-Market Access', desc: 'Trade across Indian and international markets from a single unified platform.' },
      { icon: Shield, title: 'Risk Management', desc: 'Built-in stop-loss, take-profit, and position sizing tools to protect your capital.' },
    ],
    ctaText: 'Go to WolffsInstaTrade',
    ctaLink: 'https://www.wolffsinstatrade.in',
  },
  wolffsstreet: {
    name: 'WolffsStreet',
    tagline: 'Exclusive hedged solutions for HNI clients.',
    description: 'WolffsStreet is our premium, invite-only platform designed exclusively for High Net-Worth Individuals. We offer bespoke hedged investment strategies that combine capital protection with aggressive growth targets, managed by our senior portfolio team with decades of institutional experience.',
    features: [
      { icon: Lock, title: 'Exclusive Access', desc: 'Invite-only platform for HNI clients with dedicated portfolio managers and priority support.' },
      { icon: Shield, title: 'Hedged Strategies', desc: 'Proprietary hedging models that protect capital while delivering superior risk-adjusted returns.' },
      { icon: Wallet, title: 'Bespoke Portfolios', desc: 'Customized investment portfolios tailored to your specific wealth goals, risk tolerance, and timeline.' },
      { icon: LineChart, title: 'Institutional Grade', desc: 'Access the same strategies used by top institutional investors, pension funds, and sovereign wealth funds.' },
    ],
    ctaText: 'Go to WolffsStreet',
    ctaLink: 'https://www.wolffsstreet.com',
  },
};

export default function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = products[productId];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-[#0A192F] mb-4">Product Not Found</h1>
          <button onClick={() => navigate('/home')} className="btn-primary text-sm px-6 py-3">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid={`product-page-${productId}`}>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-24 md:py-32 bg-[#F9F8F6]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <p className="overline mb-4">Product</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#0A192F] mb-6" data-testid="product-title">
              {product.name}
            </h1>
            <p className="text-lg sm:text-xl text-[#475569] max-w-2xl mb-8">{product.tagline}</p>
            <a
              href={product.ctaLink}
              className="btn-primary inline-flex items-center gap-2 text-sm tracking-[0.1em] uppercase px-8 py-4"
              data-testid="product-cta"
            >
              {product.ctaText} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Description */}
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl">
              <p className="overline mb-4">Overview</p>
              <p className="text-base sm:text-lg leading-relaxed text-[#475569]">{product.description}</p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 md:py-32 bg-[#F9F8F6]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <p className="overline mb-4">Features</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0A192F] mb-12">
              What makes it powerful
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.features.map((f, i) => (
                <div key={i} className="bg-white border border-[#E2E8F0] p-8 card-lift" data-testid={`product-feature-${i}`}>
                  <f.icon className="w-8 h-8 text-[#003B5C] mb-4" />
                  <h3 className="text-lg font-medium text-[#0A192F] mb-2">{f.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 md:py-32 text-center">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h2 className="text-2xl sm:text-3xl font-medium text-[#0A192F] mb-6">Ready to get started?</h2>
            <a href={product.ctaLink} className="btn-primary inline-flex items-center gap-2 text-sm tracking-[0.1em] uppercase px-10 py-4" data-testid="product-bottom-cta">
              {product.ctaText} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
