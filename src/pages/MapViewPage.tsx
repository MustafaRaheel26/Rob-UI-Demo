import React, { useState, useMemo } from 'react';
import { useEZShift } from '../context/EZShiftContext';
import { Layout } from '../components/layout/Layout';
import { 
  MapPin, 
  Map as MapIcon, 
  Filter, 
  SlidersHorizontal, 
  DollarSign, 
  Calendar, 
  Clock, 
  Compass, 
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Shift } from '../types/shift';
import { Link } from 'react-router-dom';

export default function MapViewPage() {
  const { shifts, currentUser, acceptShift } = useEZShift();
  const [selectedCounty, setSelectedCounty] = useState<string>('All');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string>('All');
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter local state list
  const filteredShifts = useMemo(() => {
    return shifts.filter(s => {
      const countyMatch = selectedCounty === 'All' || s.county === selectedCounty;
      const timeMatch = selectedTimeOfDay === 'All' || s.timeOfDay === selectedTimeOfDay;
      return countyMatch && timeMatch && s.status === 'Open';
    });
  }, [shifts, selectedCounty, selectedTimeOfDay]);

  // Handle click of a pin node
  const handlePinClick = (shift: Shift) => {
    setSelectedShift(shift);
    setErrorMsg(null);
  };

  const handleAccept = () => {
    if (!selectedShift || !currentUser) return;

    if (currentUser.role === 'Admin') {
      setErrorMsg("Admins cannot accept staffing shifts.");
      return;
    }

    if (currentUser.status !== 'Approved') {
      setErrorMsg("Your account is pending approvals. Visit the 'Onboarding Docs' checklist to complete verification.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      acceptShift(selectedShift.id);
      setLoading(false);
      // Update selectedShift to reflect change
      setSelectedShift(prev => prev ? { ...prev, status: 'Accepted' } : null);
    }, 850);
  };

  // Coordinates array to match mock NJ map coordinate grid
  const pinCoordinates: Record<string, { top: string; left: string }> = {
    'shift_1': { top: '35%', left: '55%' },
    'shift_2': { top: '55%', left: '72%' },
    'shift_3': { top: '65%', left: '42%' },
    'shift_4': { top: '22%', left: '38%' },
    'shift_5': { top: '48%', left: '20%' },
    'shift_6': { top: '52%', left: '68%' },
    'shift_7': { top: '28%', left: '58%' },
  };

  return (
    <Layout>
      <div className="space-y-6 h-full flex flex-col">
        
        {/* Title, Filters & Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-blue-600" />
              <span>Interactive Shift Locator</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Browse and select on-demand Home Care agency shifts geolocated across Northern New Jersey.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* County filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">County</span>
              <select
                value={selectedCounty}
                onChange={(e) => {
                  setSelectedCounty(e.target.value);
                  setSelectedShift(null);
                }}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Counties</option>
                <option value="Bergen">Bergen</option>
                <option value="Hudson">Hudson</option>
                <option value="Essex">Essex</option>
                <option value="Passaic">Passaic</option>
                <option value="Morris">Morris</option>
              </select>
            </div>

            {/* TimeofDay Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Shift Time</span>
              <select
                value={selectedTimeOfDay}
                onChange={(e) => {
                  setSelectedTimeOfDay(e.target.value);
                  setSelectedShift(null);
                }}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Hours</option>
                <option value="Day">Day Shifts</option>
                <option value="Evening">Evening Shifts</option>
                <option value="Night">Overnight</option>
              </select>
            </div>
          </div>
        </div>

        {/* Map Grid and Interactive Panel Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
          
          {/* Mock Interactive Map Canvas Area */}
          <div className="lg:col-span-2 bg-[#E1EDFA] border border-slate-200 rounded-2xl relative overflow-hidden shadow-inner flex flex-col justify-between">
            {/* Compass overlay */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-md border border-slate-100 flex items-center gap-2 z-10 pointer-events-none text-slate-700">
              <Compass className="h-4 w-4 animate-spin text-indigo-500" style={{ animationDuration: '4s' }} />
              <span className="text-[11px] font-bold tracking-wider uppercase font-mono">NJ Compass Map</span>
            </div>

            {/* Map Cartographic Visual representation of road lanes / coordinates */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Bergen Hudson Essex Passaic line grid dividers */}
              <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                {/* Horizontal / diagonal lines representing NJ highways */}
                <path d="M0,150 Q200,220 500,200 T1000,400" fill="none" stroke="#F8FAFC" strokeWidth="8" />
                <path d="M0,150 Q200,220 500,200 T1000,400" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5" />

                <path d="M350,0 Q250,300 550,600" fill="none" stroke="#F8FAFC" strokeWidth="6" />
                <path d="M350,0 Q250,300 550,600" fill="none" stroke="#94A3B8" strokeWidth="1.5" />

                {/* County boundaries */}
                <line x1="250" y1="0" x2="350" y2="600" stroke="#EF4444" strokeWidth="1" strokeDasharray="8 8" opacity="0.4" />
                <line x1="0" y1="350" x2="1000" y2="350" stroke="#EF4444" strokeWidth="1" strokeDasharray="8 8" opacity="0.4" />
              </svg>

              {/* County labels overlay */}
              <span className="absolute top-[28%] left-[28%] text-[10px] tracking-widest font-black uppercase text-blue-900/40">Passaic Quadrant</span>
              <span className="absolute top-[32%] left-[62%] text-[10px] tracking-widest font-black uppercase text-blue-900/40">Bergen Area</span>
              <span className="absolute top-[62%] left-[68%] text-[10px] tracking-widest font-black uppercase text-blue-900/40">Hudson River Basin</span>
              <span className="absolute top-[70%] left-[32%] text-[10px] tracking-widest font-black uppercase text-blue-900/40">Essex Core</span>
              <span className="absolute top-[48%] left-[10%] text-[10px] tracking-widest font-black uppercase text-blue-900/40">Morris Zone</span>
            </div>

            {/* Shift Pin Markers overlay */}
            <div className="absolute inset-0">
              {filteredShifts.map((shift) => {
                const coord = pinCoordinates[shift.id] || { top: '50%', left: '50%' };
                const isSelected = selectedShift?.id === shift.id;
                
                return (
                  <button
                    key={shift.id}
                    onClick={() => handlePinClick(shift)}
                    className="absolute transition-all duration-200 transform hover:scale-125 focus:outline-none"
                    style={{ 
                      top: coord.top, 
                      left: coord.left,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="relative group flex flex-col items-center">
                      
                      {/* Price Tag Bubble overlay on hover / active */}
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold shadow-md border animate-bounce ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-blue-700' 
                          : 'bg-white text-slate-800 border-slate-200 hover:bg-blue-50'
                      }`}>
                        ${shift.payRate}/hr
                      </span>

                      {/* Map pin vector marker */}
                      <MapPin className={`h-6 w-6 mt-0.5 filter drop-shadow-md ${
                        isSelected ? 'text-blue-600 fill-blue-100' : 'text-slate-700 fill-white'
                      }`} />
                    </div>
                  </button>
                );
              })}

              {filteredShifts.length === 0 && (
                <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center text-slate-600 pointer-events-none">
                  <div className="bg-white p-4 rounded-full border border-slate-200 shadow-sm mb-3">
                    <Info className="h-6 w-6 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-800">No shifts match filter selection</h4>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">Try switching to &quot;All Counties&quot; or resetting the Shift Time selector to search our listings.</p>
                </div>
              )}
            </div>

            {/* Bottom Status panel */}
            <div className="bg-white/95 backdrop-blur-sm p-3.5 border-t border-slate-200/80 z-10 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">
                Showing <strong>{filteredShifts.length}</strong> available open shifts out of {shifts.filter(s => s.status === 'Open').length} total
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-600" /> Open
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-400" /> Filtered
                </span>
              </div>
            </div>
          </div>

          {/* Map Side Detail Drawer Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
            {selectedShift ? (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded uppercase border border-blue-100 mb-1.5 inline-block">
                        {selectedShift.county} County
                      </span>
                      <h3 className="font-extrabold text-slate-950 text-lg tracking-tight">
                        {selectedShift.agencyName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{selectedShift.location}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedShift(null)}
                      className="text-slate-400 hover:text-slate-600 font-semibold p-1"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="space-y-3.5 mt-5 text-slate-700 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 bg-slate-50 text-slate-500 rounded-lg flex items-center justify-center border border-slate-100">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Date of Shift</span>
                        <span className="font-semibold text-slate-800">{selectedShift.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 bg-slate-50 text-slate-500 rounded-lg flex items-center justify-center border border-slate-100">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Shift Time Slots</span>
                        <span className="font-semibold text-slate-800">{selectedShift.shiftTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center border border-blue-200">
                          <DollarSign className="h-4 w-4 font-bold" />
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold uppercase">Hourly Rate</span>
                          <span className="font-black text-slate-900">${selectedShift.payRate}/hr</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Payout</span>
                        <span className="font-extrabold text-blue-700">${selectedShift.shiftValue}</span>
                        <span className="text-[10px] text-slate-400 block">({selectedShift.hours} hours)</span>
                      </div>
                    </div>

                    {selectedShift.notes && (
                      <div className="bg-indigo-50/40 p-3 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 italic leading-relaxed">
                        &ldquo;{selectedShift.notes}&rdquo;
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 space-y-3.5 border-t border-slate-100">
                  {errorMsg && (
                    <div className="p-3 bg-amber-50 rounded-lg text-[11px] text-amber-800 border border-amber-100 flex items-start gap-1.5 leading-snug">
                      <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span>{errorMsg}</span>
                        {currentUser?.status !== 'Approved' && (
                          <Link to="/onboarding" className="block font-bold underline mt-1 text-blue-600">
                            Upload Checklist &rarr;
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedShift.status === 'Open' ? (
                    <button
                      onClick={handleAccept}
                      disabled={loading}
                      className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        loading ? 'opacity-75' : ''
                      }`}
                    >
                      <span>{loading ? 'Securing Shift Contract...' : 'Accept Shift Agreement'}</span>
                    </button>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-1.5 py-3 px-4 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-xl text-xs font-bold">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span>Assigned to You</span>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 text-center">
                    Accepting shift auto-notifies the posting agency. 10% platform facilitation billing applied.
                  </p>
                </div>
              </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                  <div className="bg-slate-50 p-4 rounded-full border border-slate-100 mb-4 text-slate-400">
                    <SlidersHorizontal className="h-6 w-6 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">No Location Selected</h4>
                  <p className="text-xs text-slate-400 max-w-[200px] mx-auto mt-1">Click any price pin on the Northern New Jersey map to review details and accept the shift.</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
