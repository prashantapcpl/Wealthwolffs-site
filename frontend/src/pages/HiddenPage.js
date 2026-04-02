import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function HiddenPage() {
  const { pageId } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/pages/${pageId}`);
        if (res.ok) {
          setPage(await res.json());
        } else {
          setError('Page not found');
        }
      } catch {
        setError('Failed to load page');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [pageId]);

  return (
    <div className="min-h-screen bg-white" data-testid="hidden-page">
      <Header />
      <main className="pt-20 py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#003B5C] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {error && (
            <div className="text-center py-20">
              <h1 className="text-2xl font-medium text-[#0A192F] mb-2">Page Not Found</h1>
              <p className="text-[#475569]">This page does not exist or the link may be incorrect.</p>
            </div>
          )}
          {page && (
            <div data-testid="hidden-page-content">
              <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#0A192F] mb-8">{page.title}</h1>
              <div className="prose prose-lg max-w-none text-[#475569] leading-relaxed whitespace-pre-wrap">{page.content}</div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
