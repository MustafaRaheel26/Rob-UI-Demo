import React, { useState } from 'react';
import { useEZShift } from '../context/EZShiftContext';
import { Layout } from '../components/layout/Layout';
import { 
  FileCheck, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  ChevronRight,
  Clock, 
  FileText,
  UserCheck
} from 'lucide-react';
import { User } from '../types/user';

export default function OnboardingPage() {
  const { currentUser, uploadDocument } = useEZShift();
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  if (!currentUser) return null;

  const docList = [
    { key: 'hhaCertificate' as keyof User['documents'], label: 'HHA Certificate Documents', desc: 'Copy of valid New Jersey certified home health aide transcript.' },
    { key: 'cprCertification' as keyof User['documents'], label: 'CPR / BLS Card', desc: 'Valid American Heart Association (AHA) or Red Cross CPR certificate.' },
    { key: 'tbTestResult' as keyof User['documents'], label: 'TB Test clearance', desc: 'Negative PPD reading within 1 year or chest X-ray clearance.' },
    { key: 'governmentId' as keyof User['documents'], label: 'Government Photo ID', desc: 'Drivers license, state ID, passport or work authorization.' }
  ];

  const handleSimulatedUpload = (key: keyof User['documents'], label: string) => {
    setUploadingDoc(key);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            uploadDocument(key, `${key.toUpperCase()}_v2_signed.pdf`);
            setUploadingDoc(null);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const getStatusBadge = (status: User['documents'][keyof User['documents']]['status']) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-bold">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 fill-emerald-50" /> Verified
          </span>
        );
      case 'Uploaded':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-1 rounded-full font-bold">
            <Clock className="h-3.5 w-3.5 text-blue-500" /> Pending Verification
          </span>
        );
      case 'Not Uploaded':
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 border border-slate-200 text-xs px-2.5 py-1 rounded-full font-medium">
            Not Uploaded
          </span>
        );
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Onboarding Header Banner */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white font-extrabold text-xs px-2 py-0.5 rounded uppercase tracking-wider">
                Step 2: Onboarding Docs
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-bold">
                <AlertCircle className="h-3 w-3" /> Required for shifts
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">
              HHA Onboarding Checklist
            </h1>
            <p className="text-sm text-slate-500">
              Upload your compliance certifications to activate your shift scheduling credentials.
            </p>
          </div>

          {/* Graphical circular progress display resembling linear dashboard */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 self-stretch md:self-auto justify-between md:justify-start">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed</span>
              <span className="text-2xl font-black text-slate-900">{currentUser.completionPercentage}%</span>
            </div>
            
            <div className="w-32 bg-slate-200 rounded-full h-3 overflow-hidden border border-slate-100 shrink-0">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-550" 
                style={{ width: `${currentUser.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Global status message */}
        {currentUser.status === 'Pending Approval' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900 leading-relaxed">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">Status: Pending Administrative Review. </span>
              Your credential packet is currently being verified. Once completing all 100% of uploads, admin Rob can toggle your staffing account to <strong>Approved</strong>. Under approved status, you can immediately accept pay shifts in the Bergen Map list context.
            </div>
          </div>
        ) : currentUser.status === 'Approved' ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3 text-emerald-900 leading-relaxed animate-fade-in">
            <UserCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">Status: Profile Fully Verified! </span>
              Your certifications have been validated and approved. You are officially qualified to accept agency-staffed shifts. Head to your shift list or Map board selection!
            </div>
          </div>
        ) : null}

        {/* Documents Cards List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {docList.map((docDef) => {
            const document = currentUser.documents[docDef.key];
            const isUploading = uploadingDoc === docDef.key;

            return (
              <div 
                key={docDef.key} 
                className={`bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between transition-all hover:shadow-sm ${
                  isUploading ? 'border-blue-500 shadow-md transform ring-2 ring-blue-50' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{docDef.label}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{docDef.desc}</p>
                    </div>
                    <div>{getStatusBadge(document.status)}</div>
                  </div>

                  {document.status !== 'Not Uploaded' && (
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between text-xs text-slate-600 mb-4 font-mono truncate">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">{document.fileName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold shrink-0 font-sans ml-2">Synced</span>
                    </div>
                  )}
                </div>

                <div>
                  {isUploading ? (
                    <div className="space-y-2 py-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-medium animate-pulse">Uploading file...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all duration-150" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ) : document.status === 'Not Uploaded' ? (
                    <button
                      onClick={() => handleSimulatedUpload(docDef.key, docDef.label)}
                      className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 text-slate-500 hover:text-blue-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload PDF or Photo</span>
                    </button>
                  ) : document.status === 'Uploaded' ? (
                    <button
                      onClick={() => handleSimulatedUpload(docDef.key, docDef.label)}
                      className="w-full py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5 text-slate-400" />
                      <span>Replace Document</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 border border-emerald-100 text-emerald-850 rounded-lg text-xs font-semibold">
                      <FileCheck className="h-4 w-4 text-emerald-500" />
                      <span>Document Locked & Approved</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
