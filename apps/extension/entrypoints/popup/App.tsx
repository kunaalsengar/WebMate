import React from 'react';

export const App: React.FC = () => {
  return (
    <div className="w-80 p-4 bg-white shadow-md rounded-md">
      <div className="flex items-center space-x-2 border-b pb-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          WM
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-900 leading-tight">WebMate</h1>
          <p className="text-xs text-slate-500">Browser Companion</p>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-3">
        <p className="text-xs font-medium text-blue-900">Phase 0: Project Foundation</p>
        <p className="text-xs text-blue-700 mt-1">
          Extension core structure is initialized. Content script injection and companion character UI are scheduled for Phase 1 and Phase 2.
        </p>
      </div>

      <div className="text-xs text-slate-600 space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-500">Manifest:</span>
          <span className="font-mono text-slate-700">v3</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Version:</span>
          <span className="font-mono text-slate-700">0.1.0</span>
        </div>
      </div>
    </div>
  );
};

export default App;
