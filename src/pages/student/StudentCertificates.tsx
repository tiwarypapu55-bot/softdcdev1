/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Download, 
  ExternalLink, 
  Search, 
  Filter, 
  CheckCircle2, 
  FileText,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { clsx } from 'clsx';

export const StudentCertificates = () => {
  const { certificates, students, businessProfile } = useApp();
  const student = students.find(s => s.id === 's1') || students[0];
  const myCerts = certificates.filter(c => c.studentId === student?.id);
  const [selectedCert, setSelectedCert] = React.useState<any>(null);

  const getDurationWords = (dur?: string) => {
    if (!dur) return 'Six';
    const num = parseInt(dur);
    if (isNaN(num)) {
      if (dur.toLowerCase().includes('six')) return 'Six';
      if (dur.toLowerCase().includes('three')) return 'Three';
      if (dur.toLowerCase().includes('twelve')) return 'Twelve';
      return dur;
    }
    const map: Record<number, string> = {
      1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six',
      7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten', 11: 'Eleven', 12: 'Twelve'
    };
    return map[num] || dur;
  };

  const getCertificateDates = (admissionDate?: string, duration?: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let fromDateObj = new Date();
    if (admissionDate) {
      const parsed = new Date(admissionDate);
      if (!isNaN(parsed.getTime())) {
        fromDateObj = parsed;
      }
    }
    const fromStr = `${months[fromDateObj.getMonth()]}-${fromDateObj.getFullYear()}`;
    
    // To date
    const durNum = parseInt(duration || '6') || 6;
    const toDateObj = new Date(fromDateObj.getTime());
    toDateObj.setMonth(toDateObj.getMonth() + durNum);
    const toStr = `${months[toDateObj.getMonth()]}-${toDateObj.getFullYear()}`;
    
    return { fromStr, toStr };
  };

  const certName = selectedCert?.studentName || student?.name || 'Rajat Sahu';
  const certFather = selectedCert?.fatherName || student?.fatherName || 'Ajay Kumar Sahu';
  const certCourse = selectedCert?.course || student?.course || 'Tally Prime Expert';
  const certCourseType = selectedCert?.courseType || 'Certificate';
  
  // Calculate duration words
  const certDuration = selectedCert?.duration || student?.courseDuration || '6 Months';
  const durationWords = (selectedCert && selectedCert.id === 'sample-pdf') ? 'Six' : getDurationWords(certDuration);
  
  // Dates
  const { fromStr, toStr } = getCertificateDates(student?.admissionDate, certDuration);
  const certFrom = selectedCert?.fromDate || fromStr;
  const certTo = selectedCert?.toDate || toStr;
  const certGrade = selectedCert?.grade || 'A';

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
           <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100 shadow-lg shadow-amber-500/10">
              <Award size={28} />
           </div>
           <div>
              <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic leading-none font-display">My Certificates</h1>
              <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mt-2">{myCerts.length} Verified Credentials Found</p>
           </div>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => {
               if (myCerts.length > 0) {
                 setSelectedCert(myCerts[0]);
               } else {
                 alert('No real certificate found. Try opening the Sample Certificate below.');
               }
             }}
             className="px-6 py-3 bg-[#141414] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-black/10"
           >
              <Printer size={14} />
              <span>Print Main</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {myCerts.map((cert) => (
          <motion.div 
            key={cert.id}
            whileHover={{ y: -5 }}
            className="bg-white border border-gray-100 shadow-2xl rounded-[3rem] p-10 group relative overflow-hidden flex flex-col"
          >
             {/* Certificate Watermark Background */}
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none group-hover:scale-110 group-hover:opacity-[0.05] transition-all">
                <Award size={200} />
             </div>

             <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="space-y-2">
                   <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-widest w-fit">
                      <ShieldCheck size={12} />
                      <span>Verified Record</span>
                   </div>
                   <h2 className="text-2xl font-black text-[#141414] uppercase tracking-tight leading-tight">{cert.course}</h2>
                </div>
                <div className="p-4 bg-white border border-gray-50 rounded-2xl shadow-xl transition-transform group-hover:rotate-3">
                   <QRCodeSVG value={`${window.location.origin}/verify/${cert.certificateNo}`} size={48} />
                </div>
             </div>

             <div className="space-y-6 flex-1 relative z-10">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-[#888888] uppercase tracking-widest">Certificate No</p>
                      <p className="text-xs font-black text-[#141414] truncate font-mono">{cert.certificateNo}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-[#888888] uppercase tracking-widest">Issue Date</p>
                      <p className="text-xs font-black text-[#141414] uppercase">{cert.issueDate}</p>
                   </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-[#888888] uppercase tracking-widest">Grade Achieved</span>
                      <span className="text-xs font-black text-blue-600 uppercase">Distinction</span>
                   </div>
                   <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[94%]"></div>
                   </div>
                </div>
             </div>

             <div className="mt-10 flex gap-4 relative z-10">
                <button 
                  onClick={() => setSelectedCert(cert)}
                  className="flex-1 py-4 bg-[#141414] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10"
                >
                   <Printer size={16} />
                   <span>Download / Print</span>
                </button>
                <button 
                  onClick={() => setSelectedCert(cert)}
                  className="p-4 bg-gray-50 text-[#888888] hover:text-[#141414] hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-200 shadow-xs"
                >
                   <ExternalLink size={20} />
                </button>
             </div>
          </motion.div>
        ))}

        {myCerts.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[3rem] text-[#888888]">
             <div className="p-6 bg-white rounded-full shadow-lg opacity-50">
                <Award size={40} />
             </div>
             <div>
                <p className="text-sm font-black uppercase tracking-widest">No Issued Credentials</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2 max-w-xs leading-relaxed">
                   Certificates are automatically issued upon course completion and performance verification.
                </p>
             </div>
             <div className="flex gap-4">
                <button 
                  onClick={() => {
                    const sampleCert = {
                      id: 'sample-pdf',
                      certificateNo: 'STG-2026-CERT-892',
                      studentId: 's1',
                      studentName: 'Rajat Sahu',
                      course: 'Computer Training & Tally Prime',
                      issueDate: '2026-10-20',
                      qrCodeData: `${window.location.origin}/verify/STG-2026-CERT-892`,
                      fatherName: 'Ajay Kumar Sahu',
                      courseType: 'Certificate',
                      duration: 'Six Months',
                      fromDate: 'Apr-2026',
                      toDate: 'Oct-2026',
                      grade: 'A'
                    };
                    setSelectedCert(sampleCert);
                  }}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#141414] shadow-md transition-all"
                >
                   View & Print Sample Certificate (Rajat Sahu)
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Verification Help Section */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group mt-12">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/30 blur-[100px] rounded-full group-hover:bg-blue-500/40 transition-all"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="max-w-xl space-y-6">
              <div className="flex items-center space-x-3 text-blue-400">
                 <ShieldCheck size={28} />
                 <h3 className="text-2xl font-black uppercase tracking-tight">Security & Verification</h3>
              </div>
              <p className="text-sm font-medium text-white/70 leading-relaxed uppercase tracking-wide">
                All certificates issued by SOFTDEV TALLY GURU contain unique cryptographic hashes and digital signatures. 
                Employers can instantly verify your credentials by scanning the QR code or visiting our official verification portal.
              </p>
              <div className="flex items-center gap-8 pt-4">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Global Standard</p>
                    <p className="text-xs font-black uppercase tracking-tight">ISO 27001 Certified</p>
                 </div>
                 <div className="w-px h-10 bg-white/10"></div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Industry Validity</p>
                    <p className="text-xs font-black uppercase tracking-tight">Lifetime Accreditation</p>
                 </div>
              </div>
           </div>
           <button className="px-10 py-5 bg-white text-blue-900 rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-2xl shadow-black/20 flex items-center gap-3">
              <ExternalLink size={18} />
              <span>Verify Tool</span>
           </button>
        </div>
      </div>

      {/* GORGEOUS CERTIFICATE DISPLAY / PRINT MODAL (MATCHES THE IMAGE DESIGN EXACTLY) */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:relative print:inset-auto">
          <div className="bg-white rounded-[2rem] max-w-4xl w-full p-8 space-y-6 print:p-0 print:rounded-none">
            
            {/* Modal Header Controls (Print Hidden) */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 print:hidden">
              <div className="flex items-center space-x-2 text-[#141414]">
                <Award className="text-blue-600" size={24} />
                <h3 className="text-sm font-black uppercase tracking-tight italic font-display">Official Certificate Viewer</h3>
              </div>
              <button 
                onClick={() => setSelectedCert(null)}
                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Certificate Box (Print Only / Screen Preview matching the physical layout exactly) */}
            <div className="overflow-x-auto py-2">
              <div className="print-only min-w-[850px] mx-auto border-[4px] border-amber-500/70 p-2 bg-white aspect-[1.414/1] relative flex flex-col justify-between shadow-2xl print:shadow-none print:border-[4px] print:border-amber-500/70 leading-normal select-none overflow-hidden">
                {/* Outer navy border inset */}
                <div className="absolute inset-2 border-[12px] border-[#112D55] pointer-events-none rounded-sm"></div>
                {/* Thin gold hairline inside border list */}
                <div className="absolute inset-[22px] border border-amber-400/40 pointer-events-none"></div>

                {/* Secure safety background pattern */}
                <div className="absolute inset-[24px] bg-[radial-gradient(#112d5503_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none"></div>
                
                {/* Centered Watermark Logo */}
                <div 
                  className="absolute inset-[24px] bg-center bg-no-repeat bg-contain opacity-[0.06] pointer-events-none"
                  style={{ 
                    backgroundImage: `url(${businessProfile.logoUrl || "https://firebasestorage.googleapis.com/v0/b/ais-dev-pzzj54zbvfrllp25htfrww.appspot.com/o/softdev_logo.png?alt=media&token=48c0b58e-7e9b-46a2-97b7-54324f331777"})`,
                    backgroundSize: '40%' 
                  }}
                />

                {/* Decorative Corner Ornaments */}
                <div className="absolute top-[28px] left-[28px] w-12 h-12 border-t-4 border-l-4 border-amber-500/60 rounded-tl-[4px] pointer-events-none"></div>
                <div className="absolute top-[28px] right-[28px] w-12 h-12 border-t-4 border-r-4 border-amber-500/60 rounded-tr-[4px] pointer-events-none"></div>
                <div className="absolute bottom-[28px] left-[28px] w-12 h-12 border-b-4 border-l-4 border-amber-500/60 rounded-bl-[4px] pointer-events-none"></div>
                <div className="absolute bottom-[28px] right-[28px] w-12 h-12 border-b-4 border-r-4 border-amber-500/60 rounded-br-[4px] pointer-events-none"></div>

                {/* Header Block exactly like the image logo and address */}
                <div className="text-center pt-8 px-8 space-y-2 relative z-10">
                  {/* Top Centered Brand Logo */}
                  <div className="flex justify-center items-center mb-2">
                    <div className="w-20 h-20 bg-white rounded-full p-1 shadow-md border-2 border-amber-500 flex items-center justify-center overflow-hidden">
                      <img 
                        src={businessProfile.logoUrl || "https://firebasestorage.googleapis.com/v0/b/ais-dev-pzzj54zbvfrllp25htfrww.appspot.com/o/softdev_logo.png?alt=media&token=48c0b58e-7e9b-46a2-97b7-54324f331777"} 
                        alt="Softdev GURU Logo" 
                        className="w-full h-full object-contain" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  <h1 className="text-3xl font-extrabold text-[#112D55] tracking-wide text-center uppercase leading-none font-sans drop-shadow-xs">
                    {businessProfile.name || 'SOFTDEV TALLY GURU'}
                  </h1>
                  <p className="text-[10px] font-bold text-gray-500 tracking-wider text-center uppercase max-w-xl mx-auto">
                    {businessProfile.address || 'Near Mahila Degree College, Companybagh Basti (Uttar Pradesh) India - 272001'}
                  </p>
                  
                  <div className="flex items-center justify-center gap-3 mt-1">
                    <span className="text-[9px] font-bold bg-[#112D55]/10 text-[#112D55] px-2.5 py-0.5 rounded font-mono">Reg. No: {businessProfile.regNo || 'G-58913 / 1442'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span className="text-[9px] font-bold bg-[#112D55]/10 text-[#112D55] px-2.5 py-0.5 rounded font-mono">An ISO 9001:2015 Approved Institute</span>
                  </div>

                  <div className="relative my-4 flex items-center justify-center">
                    <div className="h-[1.5px] bg-gradient-to-r from-transparent via-[#112D55]/50 to-transparent w-full absolute" />
                    <span className="relative bg-white px-5 py-0.5 text-[11px] font-extrabold text-amber-600 border border-amber-500/30 rounded-full uppercase tracking-[0.25em] shadow-xs">
                      COMPUTER TRAINING INSTITUTE CERTIFICATE
                    </span>
                  </div>
                </div>

                {/* Body Text structure exactly matching language and design */}
                <div className="py-2 px-12 text-center text-gray-800 relative z-10 leading-[2.6] text-[15px] max-w-3xl mx-auto font-medium">
                  <p className="text-center font-sans">
                    Certified that Shri/Smt &nbsp;
                    <span className="font-extrabold text-[#112D55] border-b-[1.5px] border-dotted border-black px-4 inline-block min-w-[200px] text-center text-[17px]">
                      {certName}
                    </span>
                    ,&nbsp; Son/Daughter of Shri/Smt &nbsp;
                    <span className="font-extrabold text-[#112D55] border-b-[1.5px] border-dotted border-black px-4 inline-block min-w-[200px] text-center text-[17px]">
                      {certFather}
                    </span>
                    ,&nbsp; has successfully completed the &nbsp;
                    <span className="font-extrabold text-[#112D55] border-b-[1.5px] border-dotted border-black px-4 inline-block min-w-[120px] text-center text-[17px]">
                      {certCourseType}
                    </span>
                    &nbsp; course in &nbsp;
                    <span className="font-extrabold text-amber-700 border-b-[1.5px] border-dotted border-black px-4 inline-block min-w-[300px] text-center text-[17px]">
                      {certCourse}
                    </span>
                    &nbsp; of &nbsp;
                    <span className="font-extrabold text-[#112D55] border-b-[1.5px] border-dotted border-black px-2 inline-block min-w-[80px] text-center text-[17px]">
                      {durationWords}
                    </span>
                    &nbsp; months duration from &nbsp;
                    <span className="font-extrabold text-[#112D55] border-b-[1.5px] border-dotted border-black px-4 inline-block min-w-[120px] text-center text-[17px]">
                      {certFrom}
                    </span>
                    &nbsp; to &nbsp;
                    <span className="font-extrabold text-[#112D55] border-b-[1.5px] border-dotted border-black px-4 inline-block min-w-[120px] text-center text-[17px]">
                      {certTo}
                    </span>
                    &nbsp; with grade &nbsp;
                    <span className="font-extrabold text-[#112D55] border-b-[1.5px] border-dotted border-black px-4 inline-block min-w-[60px] text-center text-[17px]">
                      {certGrade}
                    </span>
                    .
                  </p>
                </div>

                {/* Print Verification, Emblem Gold Seal & Signature lines */}
                <div className="flex justify-between items-end relative z-10 pb-8 px-12">
                  {/* Left QR Code Container */}
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div className="p-1.5 bg-white border border-gray-100 rounded-xl shadow-md">
                      <QRCodeSVG 
                        value={`${window.location.origin}/verify/${selectedCert.certificateNo}`} 
                        size={84} 
                      />
                    </div>
                    <span className="text-[8px] font-black tracking-widest text-[#112D55] uppercase">Verify Credential</span>
                  </div>

                  {/* Center Gold Stamp Seal */}
                  <div className="flex flex-col items-center justify-center relative translate-y-2">
                    <div className="w-20 h-20 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg relative border-4 border-double border-amber-100">
                      <div className="absolute inset-1 rounded-full border border-dashed border-white/50 flex flex-col items-center justify-center text-center">
                        <span className="text-[6px] font-black tracking-tight text-amber-950 uppercase leading-none">STG</span>
                        <span className="text-[5px] font-black tracking-widest text-white uppercase mt-0.5">SECURE</span>
                        <span className="text-[5px] font-bold text-amber-950/85 uppercase">VERIFIED</span>
                        <div className="flex justify-center gap-[2px] mt-0.5">
                          <span className="text-[6px] text-yellow-300">★</span>
                          <span className="text-[6px] text-yellow-300">★</span>
                          <span className="text-[6px] text-yellow-300">★</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Authorized Signatory with handwritten signature fallback */}
                  <div className="text-right space-y-1 relative min-w-[180px]">
                    <div className="h-10 flex flex-col justify-end items-end relative overflow-visible">
                      {businessProfile.signatureUrl ? (
                        <img 
                          src={businessProfile.signatureUrl} 
                          alt="Director Signature" 
                          className="h-10 object-contain mix-blend-multiply drop-shadow-xs z-10"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="font-serif italic text-blue-700 text-lg tracking-wide z-10 translate-y-1.5 rotate-[-5deg] select-none opacity-90 block">
                          {businessProfile.directorName || 'Director'}
                        </span>
                      )}
                      {/* Signature line alignment */}
                      <div className="w-36 h-[1.5px] bg-[#112D55]/50 mt-1" />
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none mr-2">Authorized Signatory</p>
                    <p className="text-xs font-black text-gray-800 uppercase tracking-widest leading-none mr-2">{businessProfile.name || 'SOFTDEV TALLY GURU'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Controls exactly matching layout of blue Print & WhatsApp buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-gray-100 print:hidden font-sans">
              <button
                onClick={() => window.print()}
                className="px-8 py-3.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-100 flex items-center gap-2"
              >
                <Printer size={14} />
                <span>Print</span>
              </button>
              
              <button
                onClick={() => {
                  const whatsappMsg = encodeURIComponent(
                    `*SOFTDEV TALLY GURU CERTIFICATE VERIFICATION*\n\n` +
                    `Student: ${certName}\n` +
                    `Course: ${certCourse}\n` +
                    `Certificate ID: ${selectedCert.certificateNo}\n` +
                    `Verification Link: ${window.location.origin}/verify/${selectedCert.certificateNo}`
                  );
                  window.open(`https://api.whatsapp.com/send?text=${whatsappMsg}`, '_blank');
                }}
                className="px-8 py-3.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#15803d] transition-all shadow-xl shadow-blue-100 flex items-center gap-2"
              >
                <span>WhatsApp</span>
              </button>
              
              <button
                onClick={() => setSelectedCert(null)}
                className="px-6 py-3.5 bg-gray-100 text-[#141414] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                <span>Close</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

