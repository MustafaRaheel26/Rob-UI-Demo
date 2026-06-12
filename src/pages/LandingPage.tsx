import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEZShift } from '../context/EZShiftContext';
import { 
  Activity, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { loginAsAdmin, loginAsWorker } = useEZShift();

  const handleAdminQuickLogin = () => {
    loginAsAdmin();
    navigate('/admin');
  };

  const handleWorkerQuickLogin = () => {
    // Log in as our default approved worker
    const success = loginAsWorker('sarah.j@example.com');
    if (success) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-blue-200 shadow-md">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-950">EZ-Shift</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleAdminQuickLogin}
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors hidden sm:inline"
            >
              Admin Dashboard
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              HHA Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-150 py-16 lg:py-24 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `radial-gradient(#1e40af 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px'
        }} />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          
          {/* Custom tailoring badge for Rob */}
          <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-4 py-1.5 rounded-full mb-8 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-bold text-blue-700 tracking-wide uppercase">
              Demo Prepared For Rob
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-medium text-indigo-700">
              Custom EZ-Shift Prototype
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] mb-6">
            Find Shifts. <span className="text-blue-600">Fill Care.</span> Fast.
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            The instant, reliable match engine connecting local New Jersey Home Health Aides (HHAs) with urgent agency shifts. Zero dispatch lag. Fully mobile-friendly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px]"
            >
              <span>Get Started (Worker Signup)</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <button 
              onClick={handleWorkerQuickLogin}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px]"
            >
              <span>Test Approved HHA View</span>
            </button>
          </div>

          {/* Quick Admin direct shortcut */}
          <p className="text-xs text-slate-400 mt-6">
            Testing both roles? Complete the registration, or{' '}
            <button onClick={handleAdminQuickLogin} className="text-blue-600 font-semibold underline hover:text-blue-700 cursor-pointer">
              click here to jump straight to the Admin Hub
            </button>
          </p>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Staffing Reimagined for Home Care agencies & aides
            </h2>
            <p className="text-slate-500 mt-3 text-md max-w-xl mx-auto">
              Our automated portal helps licensed aides accept shifts instantly in Bergen, Hudson, Essex, Passaic, and Morris counties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cards */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-5 font-bold">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">County Filters</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Only browse assignments in your county. We support easy filtering through Bergen, Hudson, Essex, Passaic, and Morris.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-600 mt-4 inline-flex items-center gap-1">Near you &rarr;</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-5 font-bold">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Automated Credentials Checklist</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Upload HHA Certificate, CPR Card, and TB reports directly from your phone. Admin approves credentials instantly.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-600 mt-4 inline-flex items-center gap-1">Fast approval &rarr;</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-5 font-bold">
                  <DollarSign className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Precise Billing Reporting</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  All hours, shifts, and 10% platform service fees are logged on beautiful financial reports for agency invoicing and rapid HHA payout.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 mt-4 inline-flex items-center gap-1">Automatic math &rarr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Columns Section: For Workers and For Agencies */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Workers side */}
          <div className="bg-slate-55/40 p-8 rounded-2xl border border-slate-200 flex flex-col justify-between bg-gradient-to-br from-blue-50/50 to-white">
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-750 uppercase">For Workers</span>
              <h2 className="text-2xl font-black text-slate-950 mt-2 mb-4">Empowering Licensed HHAs</h2>
              <ul className="space-y-3.5 text-sm text-slate-650">
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Choose your own hours. Grab high-paying single shifts tailored in your neighborhood.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Interactive Map view—instantly filter open morning, evening or night shifts.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Secure messaging with administrators to verify locations and coordinate arrival.</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={() => navigate('/register')}
              className="mt-8 bg-blue-600 text-white font-bold self-start px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm"
            >
              Join as a Home Health Aide
            </button>
          </div>

          {/* Agencies info */}
          <div className="bg-slate-55/40 p-8 rounded-2xl border border-slate-200 flex flex-col justify-between bg-gradient-to-br from-indigo-50/50 to-white">
            <div>
              <span className="text-xs font-bold tracking-wider text-indigo-750 uppercase">For Home Care Agencies</span>
              <h2 className="text-2xl font-black text-slate-950 mt-2 mb-4">Eliminate Staffing Shortages</h2>
              <ul className="space-y-3.5 text-sm text-slate-651">
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Create complex shifts using the Post Shift tool—live 10% platform fee calculations.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Dramatically improve your slot fill rates by auto-alerting licensed county candidates instantly.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Beautiful billing center tracks invoice states and provides neat Excel/CSV export tables.</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={handleAdminQuickLogin}
              className="mt-8 bg-indigo-600 text-white font-bold self-start px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
            >
              Post & Manage Agency Shifts (Admin)
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1 rounded-md">
              <Activity className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-white text-md">EZ-Shift</span>
            <span className="text-[10px] text-slate-500 font-bold font-mono">NJ STAFFING CAPABLE</span>
          </div>

          <p className="text-xs">&copy; 2026 EZ-Shift Inc. All NJ licensing protocols strictly logged. Built with Supabase integration preparation.</p>
        </div>
      </footer>
    </div>
  );
}
