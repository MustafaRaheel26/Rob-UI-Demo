import React, { useState } from 'react';
import { Shift } from '../../types/shift';
import { useEZShift } from '../../context/EZShiftContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Navigation, 
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ShiftCardProps {
  shift: Shift;
  onViewDetails?: (shift: Shift) => void;
}

export const ShiftCard: React.FC<ShiftCardProps> = ({ shift, onViewDetails }) => {
  const { currentUser, acceptShift } = useEZShift();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAccept = async () => {
    if (!currentUser) return;

    if (currentUser.role === 'Admin') {
      setErrorMsg("Administrators cannot accept HHA shifts.");
      return;
    }

    if (currentUser.status !== 'Approved') {
      setErrorMsg("Your account is pending approval. Please complete your document onboarding to accept shifts.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    // Simulate real database transition
    setTimeout(() => {
      acceptShift(shift.id);
      setLoading(false);
    }, 800);
  };

  const getStatusColor = (status: Shift['status']) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const timeTagColor = (timeOfDay: Shift['timeOfDay']) => {
    switch (timeOfDay) {
      case 'Day': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Evening': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Night': return 'bg-purple-50 text-purple-700 border-purple-100';
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between transition-all hover:shadow-md hover:border-slate-300 ${
      shift.status === 'Accepted' ? 'border-l-4 border-l-emerald-500' : ''
    }`}>
      {/* Top Section */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(shift.status)}`}>
              {shift.status}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ml-1.5 ${timeTagColor(shift.timeOfDay)}`}>
              {shift.timeOfDay} Shift
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm text-slate-500 font-medium font-mono inline-block bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              {shift.distance} miles away
            </span>
          </div>
        </div>

        <h3 className="font-bold text-slate-900 text-lg tracking-tight mb-2 truncate">
          {shift.agencyName}
        </h3>

        <div className="space-y-2 mt-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="truncate">{shift.location} ({shift.county} County)</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <span>{shift.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">{shift.shiftTime}</span>
          </div>
        </div>

        {shift.notes && (
          <p className="mt-4 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg italic line-clamp-2">
            &ldquo;{shift.notes}&rdquo;
          </p>
        )}
      </div>

      {/* Pay Details & Action Section */}
      <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pay Rate</span>
            <span className="text-xl font-black text-slate-900 flex items-baseline">
              ${shift.payRate}
              <span className="text-xs text-slate-500 font-normal"> / hr</span>
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Est. Value</span>
            <span className="text-md font-bold text-slate-800">
              ${shift.shiftValue}
            </span>
            <span className="text-[9px] text-slate-400">
              ({shift.hours} hours)
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-2 bg-amber-50 rounded text-xs text-amber-800 border border-amber-100 flex items-start gap-1.5 leading-snug">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{errorMsg}</span>
              {currentUser?.status !== 'Approved' && currentUser?.role === 'Worker' && (
                <Link to="/onboarding" className="block text-blue-600 font-bold underline mt-1">
                  Upload Documents Now &rarr;
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-1">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(shift)}
              className="flex-1 px-3 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Details
            </button>
          )}

          {shift.status === 'Open' ? (
            <button
              onClick={handleAccept}
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Confirming...' : 'Accept Shift'}
            </button>
          ) : shift.status === 'Accepted' ? (
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-100/70 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">
              <CheckCircle className="h-4 w-4" />
              <span>Assigned to You</span>
            </div>
          ) : (
            <div className="flex-1 text-center py-2 bg-slate-100 text-slate-400 rounded-lg text-xs font-medium">
              Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
