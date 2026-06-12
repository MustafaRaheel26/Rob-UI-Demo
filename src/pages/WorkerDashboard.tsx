import React, { useState } from 'react';
import { useEZShift } from '../context/EZShiftContext';
import { Layout } from '../components/layout/Layout';
import { ShiftCard } from '../components/cards/ShiftCard';
import { 
  CheckCircle2, 
  Calendar, 
  Bell, 
  FileText, 
  MessageSquare, 
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const { currentUser, shifts, notifications, conversations } = useEZShift();
  
  if (!currentUser) return null;

  // Filter Shifts
  const currentWorkerId = currentUser.id;
  const myUpcomingShifts = shifts.filter(s => s.status === 'Accepted' && s.workerId === currentWorkerId);
  const openShiftsInCounty = shifts.filter(s => s.status === 'Open' && s.county === currentUser.county);
  const otherOpenShifts = shifts.filter(s => s.status === 'Open' && s.county !== currentUser.county);
  const openShiftsTotal = [...openShiftsInCounty, ...otherOpenShifts];

  // Document verification count
  const totalVerifiedDocs = Object.values(currentUser.documents).filter((d: any) => d.status === 'Verified').length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved':
        return {
          bg: 'bg-emerald-50 border-emerald-200',
          text: 'text-emerald-800',
          dot: 'bg-emerald-500'
        };
      case 'Pending Approval':
        return {
          bg: 'bg-amber-50 border-amber-200',
          text: 'text-amber-800',
          dot: 'bg-amber-500'
        };
      case 'Rejected':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          dot: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-200',
          text: 'text-slate-800',
          dot: 'bg-slate-500'
        };
    }
  };

  const statusStyle = getStatusStyle(currentUser.status);

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">
              Good morning, {currentUser.name}! 👋
            </h1>
            <p className="text-sm text-slate-500">
              Welcome back. You are registered in <strong className="text-slate-700">{currentUser.county} County</strong>. Below are shifts active in your neighborhood today.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Account status:</span>
            <div className={`px-3 py-1.5 rounded-full border flex items-center gap-2 font-bold text-xs ${statusStyle.bg} ${statusStyle.text}`}>
              <span className={`h-2 w-2 rounded-full animate-pulse ${statusStyle.dot}`} />
              <span>{currentUser.status}</span>
            </div>
          </div>
        </div>

        {/* Top KPIs Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Status KPI */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Approval Rating</span>
              <span className="text-lg font-black text-slate-900">{currentUser.status}</span>
            </div>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${
              currentUser.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          {/* Upcoming Shifts Count KPI */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Upcoming Shifts</span>
              <span className="text-2xl font-black text-slate-900">{myUpcomingShifts.length} Assigned</span>
            </div>
            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
              <Calendar className="h-5 w-5" />
            </div>
          </div>

          {/* Docs status KPI */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Docs Verified</span>
              <span className="text-2xl font-black text-slate-900">{totalVerifiedDocs} of 4</span>
            </div>
            <Link to="/onboarding" className="h-10 w-10 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold transition-colors">
              <FileText className="h-5 w-5" />
            </Link>
          </div>

          {/* Notifications count KPI */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">System Alerts</span>
              <span className="text-2xl font-black text-slate-900">
                {notifications.filter(n => !n.isRead).length} Unread
              </span>
            </div>
            <Link to="/notifications" className="h-10 w-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center font-bold transition-colors">
              <Bell className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Warning block if user is not fully verified */}
        {currentUser.status !== 'Approved' && (
          <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-3 items-start sm:items-center">
              <div className="h-10 w-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">Action Required: Upload All Remaining Documents!</h5>
                <p className="text-xs text-slate-500 mt-0.5">Your profile is currently limited. In order to accept agency shifts and represent EZ-Shift, your credentials packet must be 100% complete.</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/onboarding')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition-colors whitespace-nowrap self-stretch sm:self-auto text-center"
            >
              Check Checklist ({currentUser.completionPercentage}%) &rarr;
            </button>
          </div>
        )}

        {/* Shifts Columns Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Shifts Display Columns */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Assigned shifts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                  <span>My Upcoming Assigned Shifts ({myUpcomingShifts.length})</span>
                </h2>
              </div>

              {myUpcomingShifts.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-8 text-center text-slate-500">
                  <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium">No upcoming shifts assigned yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Accept shifts in the open listings below to fill your active care schedule.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myUpcomingShifts.map((shift) => (
                    <ShiftCard key={shift.id} shift={shift} />
                  ))}
                </div>
              )}
            </div>

            {/* Open shifts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                  <span>Open Staffing Shifts Near You ({openShiftsTotal.length})</span>
                </h2>
                <Link to="/map" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5">
                  See Map View &rarr;
                </Link>
              </div>

              {openShiftsTotal.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
                  <p className="text-sm font-medium">All shifts are currently staffed!</p>
                  <p className="text-xs text-slate-400 mt-1">Head to the Map panel to search other counties nearby.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {openShiftsTotal.map((shift) => (
                    <ShiftCard key={shift.id} shift={shift} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel widgets */}
          <div className="space-y-6">
            
            {/* Quick Messages preview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span>Recent Chat Channels</span>
                </h4>
                <Link to="/messages" className="text-xs font-bold text-blue-600 hover:underline">
                  Open Chat
                </Link>
              </div>

              <div className="space-y-3.5">
                {conversations.slice(0, 3).map((conv) => (
                  <Link 
                    key={conv.id} 
                    to="/messages" 
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-8 w-8 bg-blue-100 text-blue-600 text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                        {conv.workerName.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold text-slate-800 block truncate">{conv.workerName}</span>
                        <span className="text-[11px] text-slate-500 truncate block">{conv.lastMessageText}</span>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span className="text-[9px] text-slate-400 block">{conv.lastMessageTime}</span>
                      {conv.unreadCount > 0 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 inline-block mt-0.5" />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick system alerts list */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Bell className="h-4 w-4 text-indigo-500" />
                  <span>Notifications</span>
                </h4>
                <Link to="/notifications" className="text-xs font-bold text-blue-600 hover:underline">
                  Inbox
                </Link>
              </div>

              <div className="space-y-3">
                {notifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className="flex gap-2.5 items-start text-xs border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                    <span className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${notif.isRead ? 'bg-slate-300' : 'bg-blue-600'}`} />
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 block">{notif.title}</span>
                      <p className="text-slate-500 leading-normal">{notif.body}</p>
                      <span className="text-[10px] text-slate-400 font-medium font-mono">{notif.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
