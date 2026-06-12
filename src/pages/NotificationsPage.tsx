import React from 'react';
import { useEZShift } from '../context/EZShiftContext';
import { Layout } from '../components/layout/Layout';
import { 
  Bell, 
  MapPin, 
  CheckCircle, 
  FileText, 
  Sparkles, 
  X, 
  BellRing,
  ExternalLink,
  Inbox
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
  const { notifications, markAllNotificationsAsRead } = useEZShift();

  const getIcon = (type: string) => {
    switch (type) {
      case 'New Shift':
        return <MapPin className="h-5 w-5 text-blue-600" />;
      case 'Shift Confirmed':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'Document Verified':
        return <FileText className="h-5 w-5 text-indigo-600" />;
      case 'Approval Received':
        return <Sparkles className="h-5 w-5 text-amber-600" />;
      default:
        return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  const getUnreadIndicator = (isRead: boolean) => {
    if (!isRead) {
      return (
        <span className="h-2.5 w-2.5 bg-blue-600 rounded-full shrink-0 border border-white inline-block shadow-sm" />
      );
    }
    return null;
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Header Block */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
              <BellRing className="h-5 w-5 text-blue-600" />
              <span>System Alerts & Notifications</span>
            </h1>
            <p className="text-xs text-slate-500">
              Stay updated on direct job assignments, credential verifications, and onboarding actions.
            </p>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Mark All as Read
          </button>
        </div>

        {/* Notifications Index */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-150">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                notif.isRead ? 'bg-white' : 'bg-blue-50/20'
              }`}
            >
              <div className="flex gap-4 items-start">
                {/* Visual Category Icon */}
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  notif.type === 'New Shift' ? 'bg-blue-50 border-blue-100' :
                  notif.type === 'Shift Confirmed' ? 'bg-emerald-50 border-emerald-100' :
                  notif.type === 'Document Verified' ? 'bg-indigo-50 border-indigo-100' :
                  'bg-amber-50 border-amber-100'
                }`}>
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1 font-sans">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm tracking-tight ${notif.isRead ? 'font-semibold text-slate-800' : 'font-extrabold text-slate-900'}`}>
                      {notif.title}
                    </h4>
                    {getUnreadIndicator(notif.isRead)}
                  </div>
                  
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    {notif.body}
                  </p>

                  <div className="text-[10px] text-slate-400 font-medium font-mono pt-1">
                    {notif.timestamp} • Category: <strong className="text-slate-500">{notif.type}</strong>
                  </div>
                </div>
              </div>

              {notif.actionUrl && (
                <Link
                  to={notif.actionUrl}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline border border-slate-200 hover:border-slate-300 bg-white px-2.5 py-1.5 rounded-lg shrink-0 transition-all font-sans"
                >
                  <span>Go</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <Inbox className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium">Notification box empty.</p>
              <p className="text-xs text-slate-400 mt-0.5">We will alert you when new local shifts or clearance approvals trigger.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
