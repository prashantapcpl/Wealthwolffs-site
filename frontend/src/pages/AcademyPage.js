import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GraduationCap } from 'lucide-react';

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-white" data-testid="academy-page">
      <Header />
      <main className="pt-20 min-h-[70vh] flex items-center justify-center">
        <div className="text-center px-6 max-w-xl">
          <div className="w-20 h-20 rounded-full bg-[#F9F8F6] border border-[#E2E8F0] flex items-center justify-center mx-auto mb-8">
            <GraduationCap className="w-10 h-10 text-[#003B5C]" />
          </div>
          <p className="overline mb-4">Wolffs Academy</p>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#0A192F] mb-6" data-testid="academy-title">
            Coming Soon
          </h1>
          <p className="text-base text-[#475569] leading-relaxed mb-8">
            Wolffs Academy is being crafted to empower you with financial knowledge, expert-led courses, and practical investment skills. Stay tuned for something extraordinary.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-[#C4A47C]"></div>
            <span className="text-xs tracking-[0.2em] text-[#C4A47C] font-medium uppercase">Launching 2026</span>
            <div className="w-12 h-px bg-[#C4A47C]"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
