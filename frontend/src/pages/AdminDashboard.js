import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Users, MessageSquare, FileText, BarChart3, Eye, Trash2, Shield, ChevronLeft, Plus, Newspaper, Star, Link2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function AdminSidebar({ active, setActive }) {
  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'enquiries', label: 'Enquiries', icon: MessageSquare },
    { key: 'news', label: 'News/Media', icon: Newspaper },
    { key: 'testimonials', label: 'Testimonials', icon: Star },
    { key: 'pages', label: 'Hidden Pages', icon: Link2 },
  ];
  return (
    <aside className="w-56 bg-[#0A192F] min-h-screen fixed left-0 top-0 z-40" data-testid="admin-sidebar">
      <div className="p-4 border-b border-white/10">
        <p className="text-white text-sm font-semibold tracking-wide">WEALTHWOLFFS</p>
        <p className="text-white/40 text-xs">Admin Panel</p>
      </div>
      <nav className="py-4">
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${active === item.key ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            data-testid={`admin-nav-${item.key}`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white border border-[#E2E8F0] p-6" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-[#475569] uppercase tracking-wider">{label}</p>
        <Icon className="w-4 h-4 text-[#C4A47C]" />
      </div>
      <p className="text-3xl font-medium text-[#0A192F]">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [news, setNews] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [hiddenPages, setHiddenPages] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/home');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user?.role === 'admin') loadData();
  }, [user, active]);

  const fetchAuth = async (url, opts = {}) => {
    return fetch(`${BACKEND_URL}${url}`, { ...opts, credentials: 'include' });
  };

  const loadData = async () => {
    if (active === 'dashboard') {
      const r = await fetchAuth('/api/admin/stats');
      if (r.ok) setStats(await r.json());
    } else if (active === 'users') {
      const r = await fetchAuth('/api/admin/users');
      if (r.ok) setUsers(await r.json());
    } else if (active === 'enquiries') {
      const r = await fetchAuth('/api/admin/enquiries');
      if (r.ok) setEnquiries(await r.json());
    } else if (active === 'news') {
      const r = await fetchAuth('/api/admin/news');
      if (r.ok) setNews(await r.json());
      else { const r2 = await fetch(`${BACKEND_URL}/api/news`); if (r2.ok) setNews(await r2.json()); }
    } else if (active === 'testimonials') {
      const r = await fetch(`${BACKEND_URL}/api/testimonials`);
      if (r.ok) setTestimonials(await r.json());
    } else if (active === 'pages') {
      const r = await fetchAuth('/api/admin/pages');
      if (r.ok) setHiddenPages(await r.json());
    }
  };

  const updateEnquiryStatus = async (id, status) => {
    await fetchAuth(`/api/admin/enquiries/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    loadData();
  };

  const updateUserRole = async (userId, role) => {
    await fetchAuth(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    loadData();
  };

  const deleteItem = async (type, id) => {
    await fetchAuth(`/api/admin/${type}/${id}`, { method: 'DELETE' });
    loadData();
  };

  const createItem = async (type, data) => {
    await fetchAuth(`/api/admin/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setShowForm(false);
    loadData();
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#003B5C] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#F9F8F6]" data-testid="admin-dashboard">
      <AdminSidebar active={active} setActive={setActive} />
      <main className="ml-56 p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-medium text-[#0A192F]">
              {active === 'dashboard' && 'Dashboard'}
              {active === 'users' && 'User Management'}
              {active === 'enquiries' && 'Enquiries'}
              {active === 'news' && 'News & Media'}
              {active === 'testimonials' && 'Testimonials'}
              {active === 'pages' && 'Hidden Pages'}
            </h1>
            <p className="text-sm text-[#475569]">Welcome back, {user?.name}</p>
          </div>
          <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#003B5C]" data-testid="admin-back-home">
            <ChevronLeft className="w-4 h-4" /> Back to Site
          </button>
        </div>

        {/* Dashboard */}
        {active === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Total Users" value={stats.total_users || 0} icon={Users} />
            <StatCard label="Total Enquiries" value={stats.total_enquiries || 0} icon={MessageSquare} />
            <StatCard label="New Enquiries" value={stats.new_enquiries || 0} icon={FileText} />
          </div>
        )}

        {/* Users */}
        {active === 'users' && (
          <div className="bg-white border border-[#E2E8F0]">
            <table className="w-full text-sm" data-testid="admin-users-table">
              <thead className="bg-[#F9F8F6] border-b border-[#E2E8F0]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-[#475569] text-xs uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-[#475569] text-xs uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-[#475569] text-xs uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-[#475569] text-xs uppercase tracking-wider">Joined</th>
                  <th className="text-left px-4 py-3 font-medium text-[#475569] text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.user_id} className="border-b border-[#E2E8F0] last:border-0" data-testid={`user-row-${u.user_id}`}>
                    <td className="px-4 py-3 text-[#0A192F]">{u.name}</td>
                    <td className="px-4 py-3 text-[#475569]">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium ${u.role === 'admin' ? 'bg-[#003B5C] text-white' : 'bg-[#F0EBE1] text-[#0A192F]'}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-[#475569] text-xs">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => updateUserRole(u.user_id, u.role === 'admin' ? 'user' : 'admin')} className="text-xs text-[#003B5C] hover:underline" data-testid={`toggle-role-${u.user_id}`}>
                        {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Enquiries */}
        {active === 'enquiries' && (
          <div className="bg-white border border-[#E2E8F0]">
            <table className="w-full text-sm" data-testid="admin-enquiries-table">
              <thead className="bg-[#F9F8F6] border-b border-[#E2E8F0]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-[#475569] text-xs uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-[#475569] text-xs uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-[#475569] text-xs uppercase tracking-wider">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-[#475569] text-xs uppercase tracking-wider">Message</th>
                  <th className="text-left px-4 py-3 font-medium text-[#475569] text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-[#475569] text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-[#475569] text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map(e => (
                  <tr key={e.enquiry_id} className="border-b border-[#E2E8F0] last:border-0" data-testid={`enquiry-row-${e.enquiry_id}`}>
                    <td className="px-4 py-3 text-[#0A192F]">{e.name}</td>
                    <td className="px-4 py-3 text-[#475569]">{e.email}</td>
                    <td className="px-4 py-3 text-[#475569]">{e.phone || '-'}</td>
                    <td className="px-4 py-3 text-[#475569] max-w-[200px] truncate">{e.message}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium ${e.status === 'new' ? 'bg-[#C4A47C] text-white' : 'bg-[#F0EBE1] text-[#0A192F]'}`}>{e.status}</span>
                    </td>
                    <td className="px-4 py-3 text-[#475569] text-xs">{new Date(e.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {e.status === 'new' && (
                        <button onClick={() => updateEnquiryStatus(e.enquiry_id, 'reviewed')} className="text-xs text-[#003B5C] hover:underline" data-testid={`review-enquiry-${e.enquiry_id}`}>
                          Mark Reviewed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* News */}
        {active === 'news' && (
          <div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs tracking-[0.1em] uppercase px-6 py-2.5 mb-6 inline-flex items-center gap-2" data-testid="add-news-btn">
              <Plus className="w-4 h-4" /> Add Article
            </button>
            {showForm && <NewsForm onSubmit={(d) => createItem('news', d)} />}
            <div className="bg-white border border-[#E2E8F0]">
              {news.map(n => (
                <div key={n.article_id} className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] last:border-0" data-testid={`news-row-${n.article_id}`}>
                  <div>
                    <p className="text-sm font-medium text-[#0A192F]">{n.title}</p>
                    <p className="text-xs text-[#475569]">{n.source} | {new Date(n.created_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => deleteItem('news', n.article_id)} className="text-red-500 hover:text-red-700" data-testid={`delete-news-${n.article_id}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials */}
        {active === 'testimonials' && (
          <div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs tracking-[0.1em] uppercase px-6 py-2.5 mb-6 inline-flex items-center gap-2" data-testid="add-testimonial-btn">
              <Plus className="w-4 h-4" /> Add Testimonial
            </button>
            {showForm && <TestimonialForm onSubmit={(d) => createItem('testimonials', d)} />}
            <div className="bg-white border border-[#E2E8F0]">
              {testimonials.map(t => (
                <div key={t.testimonial_id} className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] last:border-0" data-testid={`testimonial-row-${t.testimonial_id}`}>
                  <div>
                    <p className="text-sm font-medium text-[#0A192F]">{t.name} - {t.designation}</p>
                    <p className="text-xs text-[#475569] truncate max-w-lg">"{t.quote}"</p>
                  </div>
                  <button onClick={() => deleteItem('testimonials', t.testimonial_id)} className="text-red-500 hover:text-red-700" data-testid={`delete-testimonial-${t.testimonial_id}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden Pages */}
        {active === 'pages' && (
          <div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs tracking-[0.1em] uppercase px-6 py-2.5 mb-6 inline-flex items-center gap-2" data-testid="add-page-btn">
              <Plus className="w-4 h-4" /> Create Hidden Page
            </button>
            {showForm && <HiddenPageForm onSubmit={(d) => createItem('pages', d)} />}
            <div className="bg-white border border-[#E2E8F0]">
              {hiddenPages.map(p => (
                <div key={p.page_id} className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] last:border-0" data-testid={`page-row-${p.page_id}`}>
                  <div>
                    <p className="text-sm font-medium text-[#0A192F]">{p.title}</p>
                    <p className="text-xs text-[#475569]">Link: /page/{p.page_id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => window.open(`/page/${p.page_id}`, '_blank')} className="text-[#003B5C] hover:text-[#002A42]" data-testid={`view-page-${p.page_id}`}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteItem('pages', p.page_id)} className="text-red-500 hover:text-red-700" data-testid={`delete-page-${p.page_id}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function NewsForm({ onSubmit }) {
  const [data, setData] = useState({ title: '', summary: '', source: '', image_url: '', link: '' });
  return (
    <div className="bg-white border border-[#E2E8F0] p-6 mb-6" data-testid="news-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input placeholder="Title" value={data.title} onChange={e => setData({...data, title: e.target.value})} className="px-3 py-2 border border-[#E2E8F0] text-sm" data-testid="news-title-input" />
        <input placeholder="Source" value={data.source} onChange={e => setData({...data, source: e.target.value})} className="px-3 py-2 border border-[#E2E8F0] text-sm" data-testid="news-source-input" />
      </div>
      <textarea placeholder="Summary" value={data.summary} onChange={e => setData({...data, summary: e.target.value})} className="w-full px-3 py-2 border border-[#E2E8F0] text-sm mb-4" rows={3} data-testid="news-summary-input" />
      <input placeholder="Link URL (optional)" value={data.link} onChange={e => setData({...data, link: e.target.value})} className="w-full px-3 py-2 border border-[#E2E8F0] text-sm mb-4" data-testid="news-link-input" />
      <button onClick={() => onSubmit(data)} className="btn-primary text-xs px-6 py-2" data-testid="news-submit-btn">Save Article</button>
    </div>
  );
}

function TestimonialForm({ onSubmit }) {
  const [data, setData] = useState({ name: '', designation: '', quote: '' });
  return (
    <div className="bg-white border border-[#E2E8F0] p-6 mb-6" data-testid="testimonial-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input placeholder="Name" value={data.name} onChange={e => setData({...data, name: e.target.value})} className="px-3 py-2 border border-[#E2E8F0] text-sm" data-testid="testimonial-name-input" />
        <input placeholder="Designation" value={data.designation} onChange={e => setData({...data, designation: e.target.value})} className="px-3 py-2 border border-[#E2E8F0] text-sm" data-testid="testimonial-designation-input" />
      </div>
      <textarea placeholder="Quote" value={data.quote} onChange={e => setData({...data, quote: e.target.value})} className="w-full px-3 py-2 border border-[#E2E8F0] text-sm mb-4" rows={3} data-testid="testimonial-quote-input" />
      <button onClick={() => onSubmit(data)} className="btn-primary text-xs px-6 py-2" data-testid="testimonial-submit-btn">Save Testimonial</button>
    </div>
  );
}

function HiddenPageForm({ onSubmit }) {
  const [data, setData] = useState({ title: '', content: '' });
  return (
    <div className="bg-white border border-[#E2E8F0] p-6 mb-6" data-testid="hidden-page-form">
      <input placeholder="Page Title" value={data.title} onChange={e => setData({...data, title: e.target.value})} className="w-full px-3 py-2 border border-[#E2E8F0] text-sm mb-4" data-testid="page-title-input" />
      <textarea placeholder="Page Content" value={data.content} onChange={e => setData({...data, content: e.target.value})} className="w-full px-3 py-2 border border-[#E2E8F0] text-sm mb-4" rows={6} data-testid="page-content-input" />
      <button onClick={() => onSubmit(data)} className="btn-primary text-xs px-6 py-2" data-testid="page-submit-btn">Create Page</button>
    </div>
  );
}
