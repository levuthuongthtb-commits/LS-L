
import React, { useState, useCallback } from 'react';
import { Subject, Grade, GeneratedTest } from './types';
import { generateTestWithAI } from './services/geminiService';
import TestPreview from './components/TestPreview';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [subject, setSubject] = useState<Subject>('Lịch sử');
  const [grade, setGrade] = useState<Grade>('6');
  const [school, setSchool] = useState('THCS Đông Trà');
  const [topics, setTopics] = useState('Thời kì cổ đại, các quốc gia cổ đại phương Đông');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTest, setGeneratedTest] = useState<GeneratedTest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateTestWithAI(subject, grade, school, topics);
      setGeneratedTest(result);
    } catch (err) {
      console.error(err);
      setError('Đã có lỗi xảy ra khi tạo đề. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-lg no-print">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
              Gemini EduTest THCS
            </h1>
            <p className="text-indigo-100 text-sm mt-1">Trình tạo đề thi chuẩn Công văn 7991 - Thang điểm 5</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Settings */}
          <div className="lg:col-span-1 no-print">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-8">
              <h2 className="text-lg font-semibold mb-4 text-slate-800">Cấu hình đề thi</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tên trường</label>
                  <input 
                    type="text" 
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Môn học</label>
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as Subject)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Lịch sử">Lịch sử</option>
                    <option value="Địa lí">Địa lí</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Khối lớp</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['6', '7', '8', '9'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGrade(g as Grade)}
                        className={`py-2 text-center rounded-lg border transition-all ${
                          grade === g 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung / Chương</label>
                  <textarea 
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                    rows={4}
                    placeholder="VD: Chương 1: Bản đồ, Chương 2: Trái đất..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang tạo...
                      </>
                    ) : 'Tạo Đề Ngay'}
                  </button>
                </div>

                {error && (
                  <p className="text-red-500 text-xs mt-2 italic text-center">{error}</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {isGenerating ? (
              <LoadingScreen />
            ) : generatedTest ? (
              <TestPreview test={generatedTest} />
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-indigo-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có đề thi nào</h3>
                <p className="text-slate-500 max-w-md mx-auto">Vui lòng chọn thông tin môn học, khối lớp và nội dung kiến thức ở thanh bên trái, sau đó nhấn nút "Tạo Đề Ngay" để bắt đầu.</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="mt-auto py-8 text-center text-slate-400 text-sm no-print">
        &copy; 2024 Gemini EduTest Pro • Công cụ hỗ trợ giáo viên chuyên nghiệp
      </footer>
    </div>
  );
};

export default App;
