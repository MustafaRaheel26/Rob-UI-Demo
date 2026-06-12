import React, { useState, useMemo } from 'react';
import { useEZShift } from '../context/EZShiftContext';
import { Layout } from '../components/layout/Layout';
import { 
  Users, 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  UserPlus, 
  PlusCircle, 
  ArrowUpRight,
  Zap,
  Volume2,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Shift } from '../types/shift';
import { User } from '../types/user';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';

export default function AdminDashboard() {
  const { 
    users, 
    shifts, 
    verifyDocument, 
    approveWorker, 
    rejectWorker, 
    notifyWorkersAboutShift, 
    boostShiftRate 
  } = useEZShift();

  const [reviewingWorker, setReviewingWorker] = useState<User | null>(null);

  // Recharts Chart Mock Data
  const fillRateChartData = [
    { name: 'Mon', rate: 74 },
    { name: 'Tue', rate: 82 },
    { name: 'Wed', rate: 89 },
    { name: 'Thu', rate: 85 },
    { name: 'Fri', rate: 92 },
    { name: 'Sat', rate: 95 },
    { name: 'Sun', rate: 100 },
  ];

  const activeWorkersChartData = [
    { name: 'Week 1', workers: 42 },
    { name: 'Week 2', workers: 48 },
    { name: 'Week 3', workers: 55 },
    { name: 'Week 4', workers: 64 },
  ];

  // Dynamic calculations
  const activeHHAs = useMemo(() => users.filter(u => u.role === 'Worker' && u.status === 'Approved').length, [users]);
  const openShiftsCount = useMemo(() => shifts.filter(s => s.status === 'Open').length, [shifts]);
  const pendingApprovals = useMemo(() => users.filter(u => u.role === 'Worker' && u.status === 'Pending Approval'), [users]);
  const totalShiftsCount = shifts.length;
  const fillRatePercentage = useMemo(() => {
    if (totalShiftsCount === 0) return 0;
    const filled = shifts.filter(s => s.status === 'Accepted' || s.status === 'Completed').length;
    return Math.round((filled / totalShiftsCount) * 100);
  }, [shifts, totalShiftsCount]);

  // Handle single action boosts
  const [boostedId, setBoostedId] = useState<string | null>(null);
  const [notifiedId, setNotifiedId] = useState<string | null>(null);

  const handleBoost = (shiftId: string) => {
    boostShiftRate(shiftId);
    setBoostedId(shiftId);
    setTimeout(() => setBoostedId(null), 1000);
  };

  const handleNotify = (shiftId: string) => {
    notifyWorkersAboutShift(shiftId);
    setNotifiedId(shiftId);
    setTimeout(() => setNotifiedId(null), 1000);
  };

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Admin Hub Dashboard</span>
              <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wider">Control Panel</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Welcome, coordinator Rob. Track registered Home Health Aides, post shifts, approve documents, and audit platform economics.
            </p>
          </div>
        </div>

        {/* Top KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Active HHAs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Aides (HHAs)</span>
              <span className="text-3xl font-black text-slate-900">{activeHHAs}</span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
                <TrendingUp className="h-3 w-3" /> +12% this week
              </span>
            </div>
            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
              <Users className="h-5 w-5" />
            </div>
          </div>

          {/* Open Shifts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Open Agency Shifts</span>
              <span className="text-3xl font-black text-slate-930">{openShiftsCount} Active</span>
              <span className="text-[10px] text-slate-400 block mt-1">Ready for staffing matches</span>
            </div>
            <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
              <Calendar className="h-5 w-5" />
            </div>
          </div>

          {/* Pending Approvals Count */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pending Approvals</span>
              <span className={`text-3xl font-black ${pendingApprovals.length > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
                {pendingApprovals.length}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Requires review check</span>
            </div>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${
              pendingApprovals.length > 0 ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-500'
            }`}>
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>

          {/* Fill Rate */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Shift Fill Rate</span>
              <span className="text-3xl font-black text-slate-900">{fillRatePercentage}%</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">Standard goal: &gt;85%</span>
            </div>
            <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Fill rate timeline bar-chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="font-bold text-slate-900 text-sm">Weekly Shift Fill Rates</h4>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">Platform facilitation</span>
            </div>
            <div className="h-64 font-sans">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fillRateChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={11} stroke="#94A3B8" />
                  <YAxis ticks={[0, 20, 40, 60, 80, 100]} fontSize={11} stroke="#94A3B8" />
                  <Tooltip formatter={(value) => [`${value}%`, 'Fill Rate']} />
                  <Bar dataKey="rate" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Workers line chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="font-bold text-slate-900 text-sm">Approved Weekly Active HHAs</h4>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">Month-on-Month</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeWorkersChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={11} stroke="#94A3B8" />
                  <YAxis fontSize={11} stroke="#94A3B8" />
                  <Tooltip formatter={(value) => [`${value} Aides`, 'Approved Handlers']} />
                  <Line type="monotone" dataKey="workers" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pending Approvals Sections */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-ping" />
            <span>Review Registration Applications ({pendingApprovals.length})</span>
          </h2>

          {pendingApprovals.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-6 text-center text-slate-400">
              <ShieldCheck className="h-7 w-7 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold">No pending candidate approvals.</p>
              <p className="text-[11px] text-slate-400">All registered Home Health Aides are currently processed and verified.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingApprovals.map((worker) => {
                return (
                  <div key={worker.id} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-amber-50 text-amber-700 font-bold text-[9px] px-2 py-0.5 rounded border border-amber-150 uppercase tracking-wider">
                          Pending Approval
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {worker.county} County
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-950 text-sm leading-tight">{worker.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">{worker.phone} • {worker.email}</p>

                      {/* Checklist Summary */}
                      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Credentials Checklist</span>
                        
                        <div className="space-y-1.5 text-[11px]">
                          {Object.entries(worker.documents).map(([key, doc]: [string, any]) => (
                            <div key={key} className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded">
                              <span className="text-slate-600 text-[10px] truncate">{doc.name}</span>
                              <span className={`font-bold text-[9px] ${
                                doc.status === 'Verified' ? 'text-emerald-600' :
                                doc.status === 'Uploaded' ? 'text-blue-600 animate-pulse' :
                                'text-slate-400'
                              }`}>
                                {doc.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex gap-2">
                      <button
                        onClick={() => setReviewingWorker(worker)}
                        className="flex-1 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer text-center"
                      >
                        Review Docs
                      </button>

                      <button
                        onClick={() => approveWorker(worker.id)}
                        disabled={worker.completionPercentage < 100}
                        className={`flex-1 py-1.5 text-white font-bold rounded-lg text-[11px] transition-colors cursor-pointer text-center ${
                          worker.completionPercentage < 100 
                            ? 'bg-slate-300 cursor-not-allowed text-slate-500' 
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                        title={worker.completionPercentage < 100 ? "Must upload 100% of credentials first" : "Approve worker"}
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detailed credential verification review panel MODAL overlay */}
        {reviewingWorker && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1.5px]">
            <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative">
              <button 
                onClick={() => setReviewingWorker(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-extrabold text-lg"
              >
                &times;
              </button>

              <div className="border-b border-slate-100 pb-4">
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">Credentials Pack</span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-1">{reviewingWorker.name}</h3>
                <p className="text-xs text-slate-500">{reviewingWorker.county} County • Onboarding Completed: {reviewingWorker.completionPercentage}%</p>
              </div>

              <div className="py-5 space-y-4 max-h-[350px] overflow-y-auto">
                {Object.entries(reviewingWorker.documents).map(([key, doc]: [string, any]) => (
                  <div key={key} className="bg-slate-50/50 p-3 rounded-xl border border-slate-150 flex items-center justify-between text-xs">
                    <div className="space-y-0.5 truncate">
                      <span className="font-bold text-slate-800 text-xs block">{doc.name}</span>
                      {doc.fileName ? (
                        <p className="text-[10px] text-slate-500 font-mono truncate">{doc.fileName}</p>
                      ) : (
                        <p className="text-[10px] text-slate-450 italic">No document file received yet</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {doc.status === 'Uploaded' ? (
                        <button
                          onClick={() => {
                            verifyDocument(reviewingWorker.id, key as keyof User['documents']);
                            // Trigger updating the state copy in the modal so changes appear instantly
                            setReviewingWorker(prev => {
                              if (!prev) return null;
                              const updatedDocs = {
                                ...prev.documents,
                                [key]: { ...prev.documents[key as keyof User['documents']], status: 'Verified' as const }
                              };
                              return {
                                ...prev,
                                documents: updatedDocs,
                                completionPercentage: Math.round((Object.values(updatedDocs).filter((d: any) => d.status === 'Verified').length / 4) * 100)
                              };
                            });
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-2.5 py-1 rounded transition-colors uppercase tracking-wider"
                        >
                          Verify Doc
                        </button>
                      ) : doc.status === 'Verified' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Verified
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Awaiting upload</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4 flex gap-3 justify-end">
                <button
                  onClick={() => setReviewingWorker(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
                >
                  Close reviewer
                </button>
                <button
                  onClick={() => {
                    approveWorker(reviewingWorker.id);
                    setReviewingWorker(null);
                  }}
                  disabled={reviewingWorker.completionPercentage < 100}
                  className={`px-4 py-2 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer ${
                    reviewingWorker.completionPercentage < 100 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shifts Table Management Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-black text-slate-900 text-sm">Shift Facilitation & Staffing Records</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Below are all historical and currently active agency shifts posted on the EZ-Shift database.</p>
            </div>
            
            <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-full shrink-0 border border-blue-100">
              {shifts.length} active records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-500 border-collapse">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase border-b border-slate-150">
                <tr>
                  <th className="p-4">Agency</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Hours</th>
                  <th className="p-4">Rate</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shifts.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{s.agencyName}</td>
                    <td className="p-4 text-slate-600">{s.location} ({s.county})</td>
                    <td className="p-4 font-mono font-medium text-slate-600">{s.date}</td>
                    <td className="p-4">{s.hours} hrs</td>
                    <td className="p-4 font-bold text-slate-900">${s.payRate}/hr</td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        s.status === 'Open' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        s.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                        'bg-slate-150 text-slate-600 border-slate-300'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      {s.status === 'Open' ? (
                        <>
                          <button
                            onClick={() => handleNotify(s.id)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded text-[10px] font-bold tracking-tight inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Volume2 className="h-3 w-3" />
                            <span>{notifiedId === s.id ? 'SMS Out!' : 'Alert'}</span>
                          </button>

                          <button
                            onClick={() => handleBoost(s.id)}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-2 py-1 rounded text-[10px] font-bold tracking-tight inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Zap className="h-3 w-3 text-amber-500 fill-amber-100" />
                            <span>{boostedId === s.id ? '+$2 Added!' : 'Boost'}</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic font-medium">Fully Staffed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
