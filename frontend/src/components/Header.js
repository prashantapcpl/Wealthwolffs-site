import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown, User, LogOut, Shield } from 'lucide-react';

const LOGO_URL = '/logo-white.png';

const aboutItems = [
  { label: 'Who are we', href: '#who-are-we' },
  { label: 'Why Wealthwolffs', href: '#why-wealthwolffs' },
  { label: 'Founder', href: '#founder' },
  { label: 'Careers', href: '#careers' },
  { label: 'Media', href: '#media' },
  { label: 'Testimonials', href: '#testimonials' },
];

const productItems = [
  { label: 'WolffsInstaAlerts', href: '/products/wolffsinstaalerts' },
  { label: 'WolffsInstaTrade', href: '/products/wolffsinstatrade' },
  { label: 'Wolffs Academy', href: '/academy' },
];

function DropdownMenu({ label, items, onNavigate }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 text-sm font-medium text-[#0A192F] hover:text-[#003B5C] transition-colors py-2 px-1"
        data-testid={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-0 py-2 bg-white border border-[#E2E8F0] shadow-lg min-w-[200px] z-50">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => { onNavigate(item.href); setOpen(false); }}
              className="block w-full text-left px-4 py-2.5 text-sm text-[#475569] hover:text-[#003B5C] hover:bg-[#F9F8F6] transition-colors"
              data-testid={`dropdown-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleNav = (href) => {
    if (href.startsWith('/')) {
      navigate(href);
    } else if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="glass-header fixed top-0 left-0 right-0 z-50" data-testid="main-header">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - clicking goes to landing/home page */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2" data-testid="header-logo">
            <img src={LOGO_URL} alt="Wealthwolffs" className="h-10 w-10 object-contain" />
          </button>

          {/* 4 main buttons - always visible, no hamburger */}
          <nav className="flex items-center gap-4 sm:gap-6" data-testid="desktop-nav">
            <DropdownMenu label="About Us" items={aboutItems} onNavigate={handleNav} />
            <button onClick={() => handleNav('#solutions')} className="text-sm font-medium text-[#0A192F] hover:text-[#003B5C] transition-colors py-2" data-testid="nav-solutions">
              Solutions
            </button>
            <DropdownMenu label="Products" items={productItems} onNavigate={handleNav} />
            <button onClick={() => handleNav('#contact')} className="text-sm font-medium text-[#0A192F] hover:text-[#003B5C] transition-colors py-2" data-testid="nav-contact">
              Contact Us
            </button>
          </nav>

          {/* Auth area */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" onMouseEnter={() => setUserMenuOpen(true)} onMouseLeave={() => setUserMenuOpen(false)}>
                <button className="flex items-center gap-2 text-sm font-medium text-[#0A192F]" data-testid="user-menu-btn">
                  {user.picture ? (
                    <img src={user.picture} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span className="max-w-[100px] truncate hidden sm:block">{user.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-0 py-2 bg-white border border-[#E2E8F0] shadow-lg min-w-[180px] z-50">
                    <div className="px-4 py-2 border-b border-[#E2E8F0]">
                      <p className="text-xs text-[#475569]">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <button onClick={() => navigate('/admin')} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#475569] hover:text-[#003B5C] hover:bg-[#F9F8F6]" data-testid="admin-link">
                        <Shield className="w-4 h-4" /> Admin Panel
                      </button>
                    )}
                    <button onClick={logout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#475569] hover:text-red-600 hover:bg-[#F9F8F6]" data-testid="logout-btn">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={login} className="btn-primary text-xs tracking-[0.1em] uppercase px-5 py-2" data-testid="login-btn">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
