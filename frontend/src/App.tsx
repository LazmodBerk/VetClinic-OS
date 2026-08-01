import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Syringe, Users, DollarSign, Settings as SettingsIcon, Bell, Package, FileText, Menu, X, MessageSquare, Tractor, Smartphone, Home, CheckCircle2, Clock, Brain, Moon, Sun } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Appointments } from './pages/Appointments';
import { Patients } from './pages/Patients';
import { Vaccines } from './pages/Vaccines';
import { Inventory } from './pages/Inventory';
import { Accounting } from './pages/Accounting';
import { Reports } from './pages/Reports';
import { Communication } from './pages/Communication';
import { Farm } from './pages/Farm';
import { Toaster, toast } from 'sonner';
import { Settings } from './pages/Settings';
import { Portal } from './pages/Portal';
import { AiInsights } from './pages/AiInsights';
import { AiAssistant } from './pages/AiAssistant';
import { AppProvider, useAppContext } from './context/AppContext';
import { Logo } from './components/Logo';
import { PatientProfile } from './pages/PatientProfile';
import { LandingPage } from './pages/LandingPage';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Müşteriler', href: '/patients', icon: Users },
  { name: 'Tıbbi Kayıtlar', href: '/reports', icon: FileText },
  { name: 'Aşı Takvimi', href: '/vaccines', icon: Syringe },
  { name: 'Randevular', href: '/appointments', icon: Calendar },
  { name: 'Stok Yönetimi', href: '/inventory', icon: Package },
  { name: 'Faturalar', href: '/accounting', icon: DollarSign },
  { name: 'İletişim & SMS', href: '/communication', icon: MessageSquare },
  { name: 'AI Asistan', href: '/ai-assistant', icon: Brain },
  { name: 'AI İş Zekası', href: '/ai-insights', icon: Brain },
  { name: 'Ayarlar', href: '/settings', icon: SettingsIcon },
];

function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useAppContext();
  
  // Global Notifications State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Pamuk için Karma Aşı vakti geldi.', time: '10 dk önce', read: false },
    { id: 2, text: 'Yarın 3 operasyon randevunuz var.', time: '1 saat önce', read: false },
    { id: 3, text: 'Kuduz aşısı stokları kritik seviyede (5 doz kaldı).', time: 'Dün', read: false },
  ]);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setIsNotifOpen(false);
    toast.success('Tüm bildirimler okundu olarak işaretlendi.');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-[#F8F9FA]'} font-sans selection:bg-[#95D5B2] selection:text-[#1B4332] transition-colors duration-300`}>
      <Toaster position="top-center" richColors theme={theme} />
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar for Desktop & Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 flex-col bg-[#1B4332] border-r border-[#1B4332] transition-transform duration-300 shadow-xl flex md:static md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-[#2a5a45]">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="h-9 w-9 rounded-xl overflow-hidden shadow-lg ring-2 ring-white/10">
              <Logo className="h-9 w-9" />
            </div>
            <h1 className="text-xl font-serif font-bold text-white tracking-wide">CanVet</h1>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-white/70 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col px-4 py-6 overflow-y-auto space-y-1 custom-scrollbar">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-[#95D5B2]/20 text-[#95D5B2] shadow-inner border border-[#95D5B2]/10'
                    : 'text-gray-300 hover:bg-[#2a5a45] hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-[#95D5B2]' : 'text-gray-400 group-hover:text-white'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#2a5a45] bg-[#122c21]/30">
          <Link to="/portal" target="_blank" className="flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 hover:text-[#95D5B2] transition-colors mb-4 border border-white/5 shadow-sm backdrop-blur-sm">
            <Smartphone className="h-4 w-4" />
            Hasta Portalı'nı Aç
          </Link>
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#2a5a45] transition-colors cursor-pointer border border-transparent hover:border-[#95D5B2]/20">
            <div className="h-10 w-10 rounded-full bg-[#95D5B2] flex items-center justify-center text-[#1B4332] font-bold shadow-md ring-2 ring-white/10">
              Dr
            </div>
            <div>
              <p className="text-sm font-medium text-white">Ahmet Yılmaz</p>
              <p className="text-xs text-[#95D5B2]">Veteriner Hekim</p>
            </div>
          </div>
        </div>
      </aside>


      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Global Top Bar (Mobile Menu Toggle + Global Actions) */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 lg:px-8 transition-colors">
          <div className="flex items-center md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 mr-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded-xl overflow-hidden shadow-sm">
                <Logo className="h-8 w-8" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">CanVet</span>
            </Link>
          </div>
          
          <div className="hidden md:block text-sm font-medium text-gray-500">
            {/* Optional breadcrumbs or empty space */}
          </div>

          <div className="flex items-center space-x-2 relative" ref={notifRef}>
            <button 
              onClick={() => navigate('/website')} 
              className="flex items-center justify-center rounded-full px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 shadow-sm border border-green-200 transition-colors text-xs font-bold mr-2"
              title="Siteye Git"
            >
              Web Sitesi
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center justify-center rounded-full p-2 bg-white text-gray-400 hover:text-[#1B4332] shadow-sm border border-gray-200 transition-colors"
              title="Ana Sayfaya Dön"
            >
              <Home className="h-5 w-5" aria-hidden="true" />
            </button>
            
            <button 
              onClick={toggleTheme} 
              className="flex items-center justify-center rounded-full p-2 bg-white dark:bg-slate-800 text-gray-400 hover:text-[#1B4332] dark:hover:text-[#95D5B2] shadow-sm border border-gray-200 dark:border-slate-700 transition-colors"
              title="Temayı Değiştir"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
            </button>
            
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)} 
              className={`flex items-center justify-center rounded-full p-2 transition-colors relative ${isNotifOpen ? 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200' : 'bg-white dark:bg-slate-800 text-gray-400 hover:text-gray-500 shadow-sm border border-gray-200 dark:border-slate-700'}`}
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#E07A5F] ring-2 ring-white dark:ring-slate-800"></span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Bildirimler</h3>
                  {unreadCount > 0 && (
                    <span className="bg-[#95D5B2]/20 text-[#1B4332] text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} Yeni</span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? notifications.map(notif => (
                    <div key={notif.id} className={`p-4 border-b border-gray-50 flex gap-3 ${notif.read ? 'opacity-60' : 'bg-[#95D5B2]/10'}`}>
                      <div className={`mt-0.5 flex-shrink-0 h-2 w-2 rounded-full ${notif.read ? 'bg-gray-300' : 'bg-[#1B4332]'}`}></div>
                      <div>
                        <p className={`text-sm ${notif.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>{notif.text}</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center"><Clock className="h-3 w-3 mr-1" /> {notif.time}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-gray-500 text-sm">Bildiriminiz yok.</div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-100 bg-gray-50 flex flex-col gap-1">
                  <button 
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0}
                    className="w-full py-2 text-sm font-medium text-[#1B4332] hover:text-[#122c21] hover:bg-[#95D5B2]/10 rounded-xl transition-colors disabled:opacity-50 disabled:hover:bg-transparent flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Tümünü Okundu İşaretle
                  </button>
                  <button 
                    onClick={() => {
                      setIsNotifOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <SettingsIcon className="h-4 w-4" /> Tüm Bildirim Ayarlarına Git
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50/30 dark:bg-slate-900/50 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/appointments" element={<MainLayout><Appointments /></MainLayout>} />
        <Route path="/patients" element={<MainLayout><Patients /></MainLayout>} />
        <Route path="/patients/:id" element={<MainLayout><PatientProfile /></MainLayout>} />
        <Route path="/vaccines" element={<MainLayout><Vaccines /></MainLayout>} />
        <Route path="/communication" element={<MainLayout><Communication /></MainLayout>} />
        <Route path="/inventory" element={<MainLayout><Inventory /></MainLayout>} />
        <Route path="/accounting" element={<MainLayout><Accounting /></MainLayout>} />
        <Route path="/farm" element={<MainLayout><Farm /></MainLayout>} />
        <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
        <Route path="/ai-assistant" element={<MainLayout><AiAssistant /></MainLayout>} />
        <Route path="/ai-insights" element={<MainLayout><AiInsights /></MainLayout>} />
        <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
        
        {/* Standalone Portal Route without MainLayout */}
        <Route path="/portal" element={<Portal />} />
        <Route path="/website" element={<LandingPage />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
