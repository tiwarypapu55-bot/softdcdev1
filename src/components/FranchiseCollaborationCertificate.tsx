import React, { useRef } from 'react';
import { Franchise } from '../types';
import { Award, Printer, ShieldCheck, Calendar, X, Download, HelpCircle, CheckCircle } from 'lucide-react';

interface CertificateProps {
  franchise: Franchise;
  onClose?: () => void;
}

export const FranchiseCollaborationCertificate: React.FC<CertificateProps> = ({ franchise, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* Dynamic font stylesheet injection for traditional classic aesthetic */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Great+Vibes&family=Montserrat:wght@400;600;800&family=Playfair+Display:ital,wght@0,600;0,800;1,500&display=swap');

        .cert-serif-title {
          font-family: 'Cinzel', serif;
        }
        .cert-script {
          font-family: 'Great Vibes', cursive;
        }
        .cert-accent {
          font-family: 'Playfair Display', serif;
        }
        .cert-sans {
          font-family: 'Montserrat', sans-serif;
        }

        @media print {
          /* Hide everything except the certificate ref content */
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            display: block !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .custom-print-border {
            border-width: 16px !important;
            border-color: #D97706 !important; /* Gold */
          }
        }
      `}</style>

      <div className="relative w-full max-w-5xl bg-zinc-900 rounded-[2rem] border border-amber-500/20 p-8 flex flex-col space-y-6 shadow-2xl print:hidden animate-in fade-in zoom-in-95 duration-300 max-h-[95vh]">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Award size={22} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-md font-bold text-white uppercase tracking-wider">Collaboration Certificate</h3>
              <p className="text-xs text-zinc-400">Official Franchise License for {franchise.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center space-x-2"
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Outer Frame Wrapper for Screen Preview Scroll */}
        <div className="overflow-auto flex-1 p-2 custom-scrollbar flex items-center justify-center">
          {/* Main Certificate Sheet */}
          <div
            id="print-area"
            ref={certificateRef}
            className="w-full max-w-[920px] aspect-[1.414/1] bg-white text-zinc-800 p-8 relative rounded-lg shadow-xl overflow-hidden custom-print-border border-[14px] border-amber-600"
            style={{ minWidth: '800px' }}
          >
            {/* Elegant Ornamental Background Grid & Watermark Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-amber-500/10 rounded-full flex items-center justify-center opacity-40 pointer-events-none">
              <Award size={180} className="text-amber-500/5 rotate-12" />
            </div>

            {/* Classical Double Border Line */}
            <div className="absolute inset-2 border-[2px] border-amber-700/60 pointer-events-none">
              {/* Corner Embellishments */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-700" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-700" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-700" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-700" />
            </div>

            {/* Certificate Header Block */}
            <div className="text-center space-y-2 mt-4 relative z-10">
              <h1 className="cert-serif-title text-2xl font-black tracking-widest text-amber-800 leading-none">
                SOFTDEV TALLY GURU
              </h1>
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-zinc-500 tracking-[0.25em] uppercase leading-none">
                  (A Complete Computer Education Institute)
                </span>
                <span className="text-[9px] font-black text-emerald-700 tracking-[0.15em] uppercase mt-1 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-100">
                  An Authorised Tally Education Partner
                </span>
              </div>
              <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-3" />
            </div>

            {/* Main Title Section */}
            <div className="text-center mt-6 space-y-1 relative z-10">
              <p className="text-[10px] font-black tracking-[0.4em] text-zinc-400 uppercase leading-none">
                This is to present the official
              </p>
              <h2 className="cert-serif-title text-xl font-bold tracking-[0.1em] text-zinc-900 uppercase">
                CERTIFICATE OF COLLABORATION
              </h2>
              <p className="text-[12px] font-medium text-zinc-500 italic">
                Awarded for educational excellence and partner synergy
              </p>
            </div>

            {/* Body Content */}
            <div className="text-center mt-6 space-y-4 relative z-10 px-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
                This is to certify that
              </p>

              {/* Dynamic Franchise Name Display */}
              <div className="space-y-1 py-1">
                <h3 className="cert-serif-title text-2xl font-black text-amber-700 uppercase tracking-wide leading-tight">
                  {franchise.name}
                </h3>
                <div className="w-56 h-[1px] bg-amber-200 mx-auto" />
              </div>

              {/* Status and Relationship */}
              <p className="text-[11px] text-zinc-700 max-w-xl mx-auto leading-relaxed cert-sans font-medium">
                is recognized as a valued, authorized branch of <strong className="text-amber-800 font-bold uppercase">SOFTDEV TALLY GURU</strong> under our collaborative computer literacy program. This franchise remains dedicated to spreading quality core tech skills under our certified framework.
              </p>

              {/* Leadership Block */}
              <div className="py-2.5">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Under the leadership of
                </p>
                <p className="cert-serif-title text-md font-bold text-amber-900 mt-1 uppercase tracking-wider">
                  {franchise.directorName || 'Ram Preet Prajapati'}
                </p>
              </div>

              {/* Dates & Validity Information Group */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2 border-t border-zinc-100 text-[10px]">
                <div className="text-center border-r border-[#F0F0F0] pr-2">
                  <p className="font-bold text-zinc-400 uppercase tracking-widest">Commenced On</p>
                  <p className="font-bold text-zinc-800 mt-0.5">{formatDate(franchise.validityFrom || '2026-03-04')}</p>
                </div>
                <div className="text-center pl-2">
                  <p className="font-bold text-zinc-400 uppercase tracking-widest">Valid Until</p>
                  <p className="font-bold text-emerald-700 mt-0.5">{formatDate(franchise.validityTo || '2027-03-04')}</p>
                </div>
              </div>
            </div>

            {/* Seal, Signature and Bottom Disclaimer Footer */}
            <div className="mt-8 flex items-end justify-between px-10 relative z-10">
              {/* Dynamic Secure Verification QR Seal */}
              <div className="flex items-center space-x-3 text-left">
                <div className="w-16 h-16 bg-white border border-amber-400 p-1 rounded-lg flex items-center justify-center shadow-inner relative group">
                  <div className="absolute inset-0 bg-amber-500/5 animate-pulse rounded-lg" />
                  {/* Procedural micro QR graphic for authentic validation */}
                  <div className="grid grid-cols-5 gap-0.5 w-12 h-12 text-zinc-900">
                    {[1,0,1,1,1, 1,1,0,0,1, 1,0,1,0,1, 0,1,1,1,0, 1,1,0,1,1].map((val, idx) => (
                      <div key={idx} className={`w-full h-full ${val === 1 ? 'bg-zinc-800' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
                <div className="text-[8px] space-y-0.5">
                  <p className="font-bold text-zinc-400 uppercase tracking-wider">Verification Seal</p>
                  <p className="font-black text-amber-700 uppercase tracking-tight">STG-{franchise.id || 'N/A'}</p>
                  <p className="text-[7px] text-zinc-400 leading-tight">Scan or Enter branch ID<br />on our official website</p>
                </div>
              </div>

              {/* Centre Official Gold Stamp */}
              <div className="relative w-20 h-20 -mb-2 flex items-center justify-center">
                {/* Gold Outer Jagged Round Style */}
                <div className="absolute inset-0 border-[3px] border-dashed border-amber-500 animate-spin-slow rounded-full opacity-60" />
                <div className="absolute inset-1.5 bg-amber-500 text-black rounded-full flex flex-col items-center justify-center text-center p-1 shadow-md border border-amber-600">
                  <ShieldCheck size={20} className="mb-0.5" />
                  <span className="text-[6px] font-black uppercase tracking-widest leading-none">OFFICIAL</span>
                  <span className="text-[5px] font-bold uppercase tracking-normal opacity-85 mt-0.5">SECURE SEAL</span>
                </div>
              </div>

              {/* Authorised Signature Lines */}
              <div className="text-center w-52 space-y-0 text-[10px]">
                <div className="cert-script text-lg text-amber-900 leading-none h-6 select-none">
                  Softdev Tally Guru Office
                </div>
                <div className="w-full h-[1px] bg-zinc-400 mb-1" />
                <p className="font-black text-zinc-900 uppercase">Director</p>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider leading-none">SOFTDEV TALLY GURU</p>
              </div>
            </div>

            {/* Bottom Fine Prints */}
            <div className="text-center mt-8 text-[7px] text-zinc-400 font-bold uppercase tracking-widest relative z-10">
              This certification is subject to renewal by the SOFTDEV TALLY GURU main office. License Status: Active.
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700/50 text-xs text-zinc-400 flex items-start space-x-3">
          <HelpCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-black text-amber-500 text-[10px] uppercase tracking-wider block">Printing Guidelines</span>
            <p className="leading-relaxed font-medium">To print this certificate of collaboration in perfect academy resolution, click the <strong className="text-white">Print / Save PDF</strong> button. In your browser's print dialog, set layout orientation to <strong className="text-white">Landscape</strong>, and verify that <strong className="text-white font-black">"Background Graphics" is checked</strong> under options. This ensures beautiful golden ribbons, seal details, and certification backgrounds are fully printed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
