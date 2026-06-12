import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEZShift } from '../../context/EZShiftContext';
import { 
  Users, 
  Calendar, 
  Map, 
  MessageSquare, 
  Bell, 
  DollarSign, 
  PlusCircle, 
  LogOut, 
  Menu, 
  X, 
  ShieldAlert, 
  Activity,
  Home,
  FileCheck
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout, notifications, loginAsWorker, loginAsAdmin } = useEZShift();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If no user is logged in, this is wrapped but handles content cleanly
  if (!currentUser) {
    return <main className="min-h-screen bg-slate-50">{children}</main>;
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getWorkerLinks = () => [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Find Shifts (Map)', path: '/map', icon: Map },
    { name: 'Onboarding Docs', path: '/onboarding', icon: FileCheck },
    { name: 'Messages', path: '/messages', icon: MessageSquare, badge: 0 },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
  ];

  const getAdminLinks = () => [
    { name: 'Admin Hub', path: '/admin', icon: Users },
    { name: 'Post New Shift', path: '/post-shift', icon: PlusCircle },
    { name: 'Billing & Reports', path: '/billing', icon: DollarSign },
    { name: 'System Msg', path: '/messages', icon: MessageSquare },
    { name: 'System Alerts', path: '/notifications', icon: Bell, badge: unreadCount },
  ];

  const links = currentUser.role === 'Admin' ? getAdminLinks() : getWorkerLinks();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans">
      
      {/* Off-canvas sidebar for Desktop and Tablet screens */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">EZ-Shift</span>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">Find Shifts. Fill Care.</p>
            </div>
          </Link>
        </div>

        {/* User Identity Display */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${
              currentUser.role === 'Admin' ? 'bg-indigo-600' : 'bg-emerald-600'
            }`}>
              {currentUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-slate-800 truncate">{currentUser.name}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                  currentUser.role === 'Admin' ? 'bg-indigo-500' : 
                  currentUser.status === 'Approved' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
                <span className="text-[11px] font-medium text-slate-500 truncate">
                  {currentUser.role === 'Admin' ? 'Administrator' : `HHA • ${currentUser.status}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </div>
                {link.badge && link.badge > 0 ? (
                  <span className="bg-blue-600 text-white font-semibold text-[11px] px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-md">
            <Activity className="h-4 w-4" />
          </div>
          <span className="font-extrabold text-md text-slate-900 tracking-tight">EZ-Shift</span>
        </Link>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Link to="/notifications" className="relative p-1 text-slate-500">
              <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-blue-600 rounded-full border border-white" />
              <Bell className="h-5 w-5 text-slate-600" />
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md border border-slate-200 text-slate-600 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile sliding Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40 opacity-100 transition-opacity" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-[280px] max-w-sm bg-white h-full shadow-xl transition-all duration-300 z-50">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-lg text-slate-900">EZ-Shift Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="h-9 w-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="truncate">
                <h4 className="text-sm font-semibold text-slate-800">{currentUser.name}</h4>
                <p className="text-xs text-slate-500">{currentUser.role} • {currentUser.county}</p>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-slate-400" />
                      <span>{link.name}</span>
                    </div>
                    {link.badge && link.badge > 0 ? (
                      <span className="bg-blue-600 text-white font-semibold text-[11px] px-2 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-[calc(100vh-53px)] md:min-h-screen">
        
        {/* Demo warning tag block tailored for Rob */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold">
              Demo Prepared for Rob
            </span>
            <span className="text-xs font-semibold tracking-tight text-blue-50">
              Interactive EZ-Shift Prototype Mode
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-blue-100">
            <span className="hidden sm:inline">Role: <strong>{currentUser.role}</strong></span>
            <span className="hidden sm:inline">County: <strong>{currentUser.county}</strong></span>
            <span>
              Quick Role Switch: 
              <button 
                onClick={() => {
                  if (currentUser.role === 'Admin') {
                    // Switch to worker sarah
                    loginAsWorker('sarah.j@example.com');
                    navigate('/dashboard');
                  } else {
                    // Switch to admin
                    loginAsAdmin();
                    navigate('/admin');
                  }
                }}
                className="ml-1.5 underline hover:text-white font-bold bg-white/10 px-2 py-0.5 rounded"
              >
                Become {currentUser.role === 'Admin' ? 'HHA Sarah' : 'Admin'}
              </button>
            </span>
          </div>
        </div>

        {/* Content canvas container panel */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
