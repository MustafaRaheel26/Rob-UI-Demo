import React, { useState, useMemo } from 'react';
import { useEZShift } from '../context/EZShiftContext';
import { Layout } from '../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Calculator, 
  MapPin, 
  Calendar, 
  Clock, 
  Coins,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Shift } from '../types/shift';

export default function PostShiftPage() {
  const navigate = useNavigate();
  const { postShift } = useEZShift();

  const [formData, setFormData] = useState({
    agencyName: '',
    location: '',
    zipCode: '',
    county: 'Bergen' as Shift['county'],
    date: '',
    shiftTime: '08:00 AM - 04:00 PM',
    hours: 8,
    payRate: 25,
    notes: '',
    timeOfDay: 'Day' as Shift['timeOfDay']
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Live Calculations
  const shiftValue = useMemo(() => {
    return formData.hours * formData.payRate;
  }, [formData.hours, formData.payRate]);

  const platformFee = useMemo(() => {
    return shiftValue * 0.10;
  }, [shiftValue]);

  const totalAgencyCost = useMemo(() => {
    return shiftValue + platformFee;
  }, [shiftValue, platformFee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hours' || name === 'payRate' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agencyName || !formData.location || !formData.zipCode || !formData.date) {
      alert("Please complete all required fields.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      postShift({
        agencyName: formData.agencyName,
        location: formData.location,
        zipCode: formData.zipCode,
        county: formData.county,
        date: formData.date,
        shiftTime: formData.shiftTime,
        hours: formData.hours,
        payRate: formData.payRate,
        notes: formData.notes,
        timeOfDay: formData.timeOfDay
      });

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        navigate('/admin');
      }, 1000);
    }, 800);
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Page Title */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-blue-600" />
            <span>Post New HHA Staffing Assignment</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Post an urgent shift opportunity. Any approved candidates registered in this primary New Jersey county will receive real-time alert logs.
          </p>
        </div>

        {/* Form and sidebar layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Form Fields Column */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Agency Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Agency Name *
                  </label>
                  <select
                    name="agencyName"
                    required
                    value={formData.agencyName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-800"
                  >
                    <option value="">-- Select Agency --</option>
                    <option value="Anchor Home Care">Anchor Home Care</option>
                    <option value="Serene Senior Care">Serene Senior Care</option>
                    <option value="Valley Health Services">Valley Health Services</option>
                    <option value="Loving Care Agency">Loving Care Agency</option>
                    <option value="Golden Years Care">Golden Years Care</option>
                  </select>
                </div>

                {/* NJ County */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Staff Primary County *
                  </label>
                  <select
                    name="county"
                    required
                    value={formData.county}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-800"
                  >
                    <option value="Bergen">Bergen</option>
                    <option value="Hudson">Hudson</option>
                    <option value="Essex">Essex</option>
                    <option value="Passaic">Passaic</option>
                    <option value="Morris">Morris</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location Address *
                  </label>
                  <input
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Hackensack, NJ"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                {/* Zipcode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Zip Code *
                  </label>
                  <input
                    name="zipCode"
                    type="text"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="07601"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Shift Date *
                  </label>
                  <input
                    name="date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                {/* Shift Time Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-1">
                    Time Slots Description
                  </label>
                  <input
                    name="shiftTime"
                    type="text"
                    value={formData.shiftTime}
                    onChange={handleChange}
                    placeholder="08:00 AM - 04:00 PM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                {/* Time of Day Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Shift Time Category
                  </label>
                  <select
                    name="timeOfDay"
                    value={formData.timeOfDay}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-850"
                  >
                    <option value="Day">Day shift</option>
                    <option value="Evening">Evening shift</option>
                    <option value="Night">Overnight</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Hours */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Total Hours Selection
                  </label>
                  <input
                    name="hours"
                    type="number"
                    min="1"
                    max="24"
                    value={formData.hours}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                {/* Pay Rate */}
                <div>
                  <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-1">
                    Pay Rate ($ / hour)
                  </label>
                  <input
                    name="payRate"
                    type="number"
                    min="15"
                    max="100"
                    value={formData.payRate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assignment caregiver notes/guidelines
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="E.g. Hoyer lift experience requested; transfers assistant."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {success ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Shift Posted Successfully! Redirecting...</span>
                  </>
                ) : (
                  <span>{loading ? 'Adding Job Entry...' : 'Post and Dispatch Shift Alert'}</span>
                )}
              </button>
            </form>
          </div>

          {/* Real-time platform fee breakdown sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-xl p-5 flex flex-col justify-between min-h-[350px]">
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                  <Calculator className="h-5 w-5 text-indigo-400" />
                  <h4 className="font-bold tracking-tight text-sm">Finance & Billing Estimator</h4>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Hours calculation */}
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Pay formulation:</span>
                    <span className="font-mono">{formData.hours} hrs &times; ${formData.payRate}/hr</span>
                  </div>

                  {/* Shift Value */}
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-slate-300 font-medium">Shift Payout (Worker):</span>
                    <span className="text-base font-extrabold text-white">${shiftValue.toFixed(2)}</span>
                  </div>

                  {/* 10% platform fee */}
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <div className="space-y-0.5">
                      <span className="text-slate-300 font-medium block">EZ-Shift platform fee:</span>
                      <span className="text-[10px] text-slate-400 block italic">Calculated as 10% on gross shift valuation</span>
                    </div>
                    <span className="text-base font-extrabold text-blue-400">${platformFee.toFixed(2)}</span>
                  </div>

                  {/* Total Agency Cost */}
                  <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-white/15">
                    <span className="text-slate-200 font-bold text-sm">Estimated Invoice Value:</span>
                    <span className="text-xl font-black text-emerald-400">${totalAgencyCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Bottom informational badge */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 mt-6 flex gap-2 text-[11px] text-slate-300 leading-normal">
                <AlertCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                <p>EZ-Shift invoices agencies following shift acceptance & validation. Workers are paid out directly via direct deposit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
