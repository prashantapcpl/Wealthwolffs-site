import '@/App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import LandingPage from '@/pages/LandingPage';
import MainSite from '@/pages/MainSite';
import ProductPage from '@/pages/ProductPage';
import AcademyPage from '@/pages/AcademyPage';
import AdminDashboard from '@/pages/AdminDashboard';
import HiddenPage from '@/pages/HiddenPage';
import AuthCallback from '@/pages/AuthCallback';

function AppRouter() {
  const location = useLocation();

  // Check URL fragment for session_id - detect BEFORE routes render
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<MainSite />} />
      <Route path="/products/:productId" element={<ProductPage />} />
      <Route path="/academy" element={<AcademyPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/page/:pageId" element={<HiddenPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
