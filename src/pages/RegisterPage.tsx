import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useEZShift } from '../context/EZShiftContext';
import { Activity, ShieldAlert, Heart, MapPin, ArrowRight } from 'lucide-react';
import { User } from '../types/user';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerWorker } = useEZShift();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    county: 'Bergen' as User['county']
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setErrorMsg('All fields are required.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        registerWorker({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          county: formData.county
        });
        setLoading(false);
        navigate('/onboarding');
      } catch (err) {
        setLoading(false);
        setErrorMsg('Registration failed. Please check your details.');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
            <Activity className="h-4 w-4" />
          </div>
          <span>EZ-Shift Home</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
          <Heart className="h-3 w-3 text-red-500 fill-red-500" /> HHA On-Demand Portal
        </span>
        <h2 className="mt-4 text-3xl font-black text-slate-950 tracking-tight">
          Join EZ-Shift Staffing
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Create an account to browse high-pay shifts in local New Jersey counties.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs flex items-start gap-1.5">
                <ShieldAlert className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Sarah Jenkins"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="sarah.j@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="(201) 555-0143"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="county" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                NJ Primary County
              </label>
              <div className="relative">
                <select
                  id="county"
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none outline-none"
                >
                  <option value="Bergen">Bergen</option>
                  <option value="Hudson">Hudson</option>
                  <option value="Essex">Essex</option>
                  <option value="Passaic">Passaic</option>
                  <option value="Morris">Morris</option>
                </select>
                <div className="absolute right-3.5 top-3 text-slate-400 pointer-events-none">
                  <MapPin className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Assigned Role:</span>
              <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-2.5 py-1 rounded uppercase tracking-wide">
                Home Health Aide (HHA)
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-100 hover:translate-y-[-0.5px]"
              >
                <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>Already registered? </span>
            <button 
              onClick={() => {
                setFormData({
                  name: 'Sarah Jenkins',
                  email: 'sarah.j@example.com',
                  phone: '(201) 555-0143',
                  password: 'password123',
                  county: 'Bergen'
                });
              }}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Fill demo (Sarah Jenkins)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
