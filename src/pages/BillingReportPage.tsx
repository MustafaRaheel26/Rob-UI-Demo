import React, { useState, useMemo } from 'react';
import { useEZShift } from '../context/EZShiftContext';
import { Layout } from '../components/layout/Layout';
import { 
  DollarSign, 
  FileText, 
  Download, 
  CheckCircle, 
  Filter, 
  FileSpreadsheet,
  AlertCircle,
  TrendingUp,
  Receipt,
  Coins
} from 'lucide-react';
import { BillingRecord } from '../types/billing';

export default function BillingReportPage() {
  const { billingRecords, markAsInvoiced, markAsPaid } = useEZShift();

  const [selectedAgency, setSelectedAgency] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Filter list
  const filteredRecords = useMemo(() => {
    return billingRecords.filter(rec => {
      const matchAgency = selectedAgency === 'All' || rec.agencyName === selectedAgency;
      const matchStatus = selectedStatus === 'All' || rec.status === selectedStatus;
      return matchAgency && matchStatus;
    });
  }, [billingRecords, selectedAgency, selectedStatus]);

  // Aggregate metrics
  const totals = useMemo(() => {
    return filteredRecords.reduce((acc, current) => {
      return {
        shifts: acc.shifts + 1,
        value: acc.value + current.shiftValue,
        fees: acc.fees + current.ezShiftFee
      };
    }, { shifts: 0, value: 0, fees: 0 });
  }, [filteredRecords]);

  // Simulating CSV Export
  const handleCSVExport = () => {
    setExportMessage("Generating Financial CSV Ledger...");
    setTimeout(() => {
      setExportMessage("Success! 'EZ-Shift_Financial_Ledger_2026.csv' downloaded successfully.");
      setTimeout(() => setExportMessage(null), 3000);
    }, 1200);
  };

  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Title Block */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-650" />
              <span>Agency Billing & Financial Reporting</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Audit gross shift volume, billable hours, and calculate 10% EZ-Shift platform service fees.
            </p>
          </div>

          <button
            onClick={handleCSVExport}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV Ledger</span>
          </button>
        </div>

        {/* CSV Toast Banner */}
        {exportMessage && (
          <div className="bg-blue-600 text-white p-3 rounded-xl border border-blue-700 text-xs flex items-center gap-2 shadow-lg animate-fade-in">
            <FileSpreadsheet className="h-4 w-4 text-blue-100" />
            <span className="font-semibold">{exportMessage}</span>
          </div>
        )}

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Total Shifts */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Facilitated Shifts</span>
              <span className="text-2xl font-black text-slate-900">{totals.shifts} Completed</span>
              <p className="text-[10px] text-slate-400">Filtered set count</p>
            </div>
            <div className="h-10 w-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center font-bold">
              <FileText className="h-5 w-5" />
            </div>
          </div>

          {/* Gross Shift value */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Worker Billing (Gross)</span>
              <span className="text-2xl font-black text-slate-900">${totals.value.toFixed(2)}</span>
              <p className="text-[10px] text-indigo-600 font-semibold flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> Average billing rate: $26.20/hr
              </p>
            </div>
            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

          {/* EZ Shift Fee Earned */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">EZ-Shift platform fees (10%)</span>
              <span className="text-2xl font-black text-emerald-600">${totals.fees.toFixed(2)}</span>
              <p className="text-[10px] text-slate-400">Total service commission</p>
            </div>
            <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold border border-emerald-100">
              <Coins className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Filters control row */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700">Filter Ledger:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Agency selection */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-semibold">Agency:</span>
              <select
                value={selectedAgency}
                onChange={(e) => setSelectedAgency(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-bold text-slate-700"
              >
                <option value="All">All Agencies</option>
                <option value="Anchor Home Care">Anchor Home Care</option>
                <option value="Serene Senior Care">Serene Senior Care</option>
                <option value="Valley Health Services">Valley Health Services</option>
                <option value="Loving Care Agency">Loving Care Agency</option>
                <option value="Golden Years Care">Golden Years Care</option>
              </select>
            </div>

            {/* Status selection */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-semibold">Invoicing Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-bold text-slate-700"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending invoice</option>
                <option value="Invoiced">Invoiced</option>
                <option value="Paid">Received payout</option>
              </select>
            </div>
          </div>
        </div>

        {/* Financial Table Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-500 border-collapse">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase border-b border-slate-150">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Agency</th>
                  <th className="p-4">HHA Name</th>
                  <th className="p-4">Hours</th>
                  <th className="p-4">Hourly Rate</th>
                  <th className="p-4">Shift pay</th>
                  <th className="p-4">EZ-Fee (10%)</th>
                  <th className="p-4">Invoicing state</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((rec) => {
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 font-mono text-slate-600 font-medium">{rec.shiftDate}</td>
                      <td className="p-4 font-bold text-slate-900">{rec.agencyName}</td>
                      <td className="p-4 font-semibold text-slate-750">{rec.workerName}</td>
                      <td className="p-4">{rec.hours} hrs</td>
                      <td className="p-4 font-mono font-medium">${rec.payRate}/hr</td>
                      <td className="p-4 font-bold text-slate-900">${rec.shiftValue.toFixed(2)}</td>
                      <td className="p-4 font-bold text-indigo-600">${rec.ezShiftFee.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded font-bold border text-[10px] ${
                          rec.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' :
                          rec.status === 'Invoiced' ? 'bg-blue-50 text-blue-700 border-blue-150' :
                          'bg-amber-50 text-amber-700 border-amber-150'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        {rec.status === 'Pending' ? (
                          <button
                            onClick={() => markAsInvoiced(rec.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-2 py-1 rounded transition-colors uppercase tracking-wider cursor-pointer"
                          >
                            Mark Invoiced
                          </button>
                        ) : rec.status === 'Invoiced' ? (
                          <button
                            onClick={() => markAsPaid(rec.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1 rounded transition-colors uppercase tracking-wider cursor-pointer"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium italic block pr-2">Cleared</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      No financial billing log transactions match selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
