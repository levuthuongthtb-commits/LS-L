
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center animate-pulse">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Gemini đang biên soạn đề thi...</h3>
        <div className="space-y-3 max-w-lg w-full">
          <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-slate-100 rounded w-5/6 mx-auto"></div>
          <div className="h-4 bg-slate-100 rounded w-2/3 mx-auto"></div>
        </div>
        <p className="mt-8 text-sm text-slate-500 italic">
          Đang xây dựng Ma trận & Bản đặc tả theo chuẩn CV 7991...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
