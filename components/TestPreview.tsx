
import React, { useState } from 'react';
import { GeneratedTest } from '../types';
import { exportToDocx } from '../services/docxService';

interface Props {
  test: GeneratedTest;
}

const TestPreview: React.FC<Props> = ({ test }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'spec' | 'test' | 'answer'>('matrix');
  const [isExporting, setIsExporting] = useState(false);

  // Đảm bảo các mảng luôn tồn tại trước khi sử dụng
  const matrix = test.matrix || [];
  const specTable = test.specTable || [];
  const questions = test.questions || [];
  const mcqs = questions.filter(q => q.type === 'MCQ');
  const essays = questions.filter(q => q.type === 'ESSAY');

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      await exportToDocx(test);
    } catch (error) {
      console.error("Export error:", error);
      alert("Đã có lỗi xảy ra khi xuất file Word.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50 no-print flex-wrap">
        <button 
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-4 text-sm font-medium transition-all border-b-2 ${activeTab === 'matrix' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Ma Trận
        </button>
        <button 
          onClick={() => setActiveTab('spec')}
          className={`px-4 py-4 text-sm font-medium transition-all border-b-2 ${activeTab === 'spec' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Bản Đặc Tả
        </button>
        <button 
          onClick={() => setActiveTab('test')}
          className={`px-4 py-4 text-sm font-medium transition-all border-b-2 ${activeTab === 'test' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Đề Kiểm Tra
        </button>
        <button 
          onClick={() => setActiveTab('answer')}
          className={`px-4 py-4 text-sm font-medium transition-all border-b-2 ${activeTab === 'answer' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Đáp Án
        </button>
        <div className="flex-grow flex justify-end items-center px-4 gap-2 py-2">
           <button 
            onClick={handleExportWord}
            disabled={isExporting}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
           >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
             </svg>
             {isExporting ? 'Đang xuất...' : 'Xuất File Word'}
           </button>
           <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-all shadow-sm"
           >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.89l-2.1 2.1m2.1-2.11a3.375 3.375 0 004.773 4.773L11.997 16.5m-5.277-2.61l5.277-5.277m0 0a3.375 3.375 0 014.773 4.773L13.89 16.111m-5.277-5.277L5.47 14.365m0 0l-1.122 1.121M13.89 16.11l2.1 2.1m-2.1-2.1l5.277-5.277m0 0a3.375 3.375 0 00-4.773-4.773L11.997 16.5" />
             </svg>
             In File / PDF
           </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 font-serif leading-relaxed text-slate-900 print:p-0 overflow-auto max-h-[80vh]">
        
        {/* Document Header (Always visible in print) */}
        <div className="mb-8 text-center uppercase">
          <div className="flex justify-between items-start mb-6">
            <div className="text-center">
              <p className="font-bold text-xs sm:text-sm">{test.school}</p>
              <div className="w-full border-b border-black mt-1"></div>
            </div>
            <div className="text-center">
              <p className="font-bold text-[10px] sm:text-xs">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="font-bold text-[10px] sm:text-xs">Độc lập - Tự do - Hạnh phúc</p>
              <div className="w-1/2 border-b border-black mt-1 mx-auto"></div>
            </div>
          </div>
          <h2 className="text-lg sm:text-xl font-bold mb-2">
            {activeTab === 'matrix' ? 'MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ' : 
             activeTab === 'spec' ? 'BẢNG ĐẶC TẢ KĨ THUẬT ĐỀ KIỂM TRA' :
             activeTab === 'test' ? 'ĐỀ KIỂM TRA ĐỊNH KÌ' : 'ĐÁP ÁN - HƯỚNG DẪN CHẤM'}
          </h2>
          <p className="normal-case italic text-sm">Môn: {test.subject} - Khối: {test.grade} - Thời gian: {test.time} phút</p>
        </div>

        {activeTab === 'matrix' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black text-[10px] sm:text-xs">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-black p-1" rowSpan={3}>TT</th>
                  <th className="border border-black p-1" rowSpan={3}>Chủ đề</th>
                  <th className="border border-black p-1" rowSpan={3}>Nội dung kiến thức</th>
                  <th className="border border-black p-1" colSpan={6}>Mức độ đánh giá</th>
                  <th className="border border-black p-1" rowSpan={2} colSpan={2}>Tổng</th>
                  <th className="border border-black p-1" rowSpan={3}>Tỉ lệ (%)</th>
                </tr>
                <tr className="bg-slate-50">
                  <th className="border border-black p-1" colSpan={3}>TNKQ (Số câu)</th>
                  <th className="border border-black p-1" colSpan={3}>Tự luận (Số câu)</th>
                </tr>
                <tr className="bg-slate-50">
                  <th className="border border-black p-[2px]">Biết</th>
                  <th className="border border-black p-[2px]">Hiểu</th>
                  <th className="border border-black p-[2px]">VD</th>
                  <th className="border border-black p-[2px]">Biết</th>
                  <th className="border border-black p-[2px]">Hiểu</th>
                  <th className="border border-black p-[2px]">VD</th>
                  <th className="border border-black p-[2px]">Câu</th>
                  <th className="border border-black p-[2px]">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border border-black p-1">{row.tt}</td>
                    <td className="border border-black p-1 text-left font-bold">{row.topic}</td>
                    <td className="border border-black p-1 text-left">{row.content}</td>
                    <td className="border border-black p-1">{row.tnkq?.know || '0'}</td>
                    <td className="border border-black p-1">{row.tnkq?.understand || '0'}</td>
                    <td className="border border-black p-1">{row.tnkq?.apply || '0'}</td>
                    <td className="border border-black p-1">{row.essay?.know || '0'}</td>
                    <td className="border border-black p-1">{row.essay?.understand || '0'}</td>
                    <td className="border border-black p-1">{row.essay?.apply || '0'}</td>
                    <td className="border border-black p-1 font-bold">{row.totalQuestions}</td>
                    <td className="border border-black p-1 font-bold">{(row.totalPoints || 0).toFixed(1)}</td>
                    <td className="border border-black p-1">{row.totalPoints ? (row.totalPoints / 5 * 100).toFixed(0) : 0}%</td>
                  </tr>
                ))}
                <tr className="font-bold text-center bg-slate-100">
                  <td className="border border-black p-1" colSpan={3}>TỔNG CỘNG</td>
                  <td className="border border-black p-1">{matrix.reduce((acc, r) => acc + (r.tnkq?.know || 0), 0)}</td>
                  <td className="border border-black p-1">{matrix.reduce((acc, r) => acc + (r.tnkq?.understand || 0), 0)}</td>
                  <td className="border border-black p-1">{matrix.reduce((acc, r) => acc + (r.tnkq?.apply || 0), 0)}</td>
                  <td className="border border-black p-1">{matrix.reduce((acc, r) => acc + (r.essay?.know || 0), 0)}</td>
                  <td className="border border-black p-1">{matrix.reduce((acc, r) => acc + (r.essay?.understand || 0), 0)}</td>
                  <td className="border border-black p-1">{matrix.reduce((acc, r) => acc + (r.essay?.apply || 0), 0)}</td>
                  <td className="border border-black p-1">{questions.length}</td>
                  <td className="border border-black p-1">5.0</td>
                  <td className="border border-black p-1">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'spec' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black text-[10px] sm:text-xs">
              <thead>
                <tr className="bg-slate-50 text-center font-bold">
                  <th className="border border-black p-2">TT</th>
                  <th className="border border-black p-2">Chủ đề</th>
                  <th className="border border-black p-2">Đơn vị kiến thức</th>
                  <th className="border border-black p-2">Yêu cầu cần đạt (theo mức độ)</th>
                  <th className="border border-black p-2">Số câu</th>
                </tr>
              </thead>
              <tbody>
                {specTable.map((row, idx) => (
                  <tr key={idx}>
                    <td className="border border-black p-2 text-center">{row.tt}</td>
                    <td className="border border-black p-2 font-bold">{row.topic}</td>
                    <td className="border border-black p-2">{row.content}</td>
                    <td className="border border-black p-2">
                      <div className="whitespace-pre-line text-[10px] sm:text-[11px]">{row.learningOutcomes}</div>
                    </td>
                    <td className="border border-black p-2 text-center">
                       TNKQ: {matrix.find(m => m.tt === row.tt)?.totalQuestions || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'test' && (
          <div className="space-y-6 text-sm sm:text-base">
             <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="font-bold italic border-b border-black">Họ và tên: ............................................</div>
               <div className="font-bold italic border-b border-black">Lớp: ....................................................</div>
             </div>
             <h3 className="text-center font-bold uppercase mb-4">PHẦN I. TRẮC NGHIỆM KHÁCH QUAN (3,5 điểm)</h3>
             <p className="italic mb-4">Khoanh tròn vào chữ cái đứng trước câu trả lời đúng nhất.</p>
             <div className="space-y-4">
               {mcqs.map((q, idx) => (
                 <div key={q.id}>
                    <p className="font-bold">Câu {idx + 1} ({q.points} điểm): {q.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-1 ml-4">
                      {q.options?.map((opt, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="font-bold">{String.fromCharCode(65 + i)}.</span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                 </div>
               ))}
             </div>

             <h3 className="text-center font-bold uppercase mt-8 mb-4">PHẦN II. TỰ LUẬN (1,5 điểm)</h3>
             <div className="space-y-6">
               {essays.map((q, idx) => (
                 <div key={q.id}>
                    <p className="font-bold">Câu {idx + 1} ({q.points} điểm): {q.question}</p>
                    <div className="mt-2 space-y-4">
                       <div className="border-b border-black border-dashed h-4 w-full"></div>
                       <div className="border-b border-black border-dashed h-4 w-full"></div>
                       <div className="border-b border-black border-dashed h-4 w-full"></div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'answer' && (
          <div className="space-y-8 text-sm sm:text-base">
            <div>
              <h3 className="font-bold mb-4 uppercase">I. ĐÁP ÁN PHẦN TRẮC NGHIỆM</h3>
              <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-14 border-t border-l border-black">
                {mcqs.map((q, idx) => (
                  <div key={q.id} className="border-r border-b border-black p-1 text-center">
                    <div className="font-bold border-b border-black mb-1 text-[10px]">Câu {idx + 1}</div>
                    <div className="font-bold">{q.answer}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4 uppercase">II. HƯỚNG DẪN CHẤM TỰ LUẬN</h3>
              <table className="w-full border-collapse border border-black text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 font-bold">
                    <th className="border border-black p-2 w-12 text-center">Câu</th>
                    <th className="border border-black p-2">Nội dung cần đạt</th>
                    <th className="border border-black p-2 w-16 text-center">Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {essays.map((q, idx) => (
                    <tr key={q.id}>
                      <td className="border border-black p-2 text-center font-bold">{idx + 1}</td>
                      <td className="border border-black p-2">
                        <div className="whitespace-pre-line">{q.answer}</div>
                      </td>
                      <td className="border border-black p-2 text-center font-bold">{q.points}</td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-slate-50">
                    <td className="border border-black p-2 text-center" colSpan={2}>TỔNG CỘNG</td>
                    <td className="border border-black p-2 text-center">1.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer info for print */}
        <div className="mt-12 flex justify-end no-print">
           <div className="text-center w-64">
             <p className="italic text-xs">........., ngày ... tháng ... năm 20...</p>
             <p className="font-bold uppercase mt-1 text-sm">Người ra đề</p>
             <div className="mt-16 text-xs italic font-medium text-slate-400">(Ký và ghi rõ họ tên)</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TestPreview;
