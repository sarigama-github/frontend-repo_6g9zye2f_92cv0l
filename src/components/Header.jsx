import React from 'react';
import { Plus, Brain } from 'lucide-react';

export default function Header({ onAdd, aiTip }) {
  return (
    <header className="relative">
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Task Pilot</h1>
          {aiTip && (
            <div className="mt-2 inline-flex items-start gap-2 rounded-md bg-indigo-50 px-3 py-2 text-indigo-700">
              <Brain className="h-5 w-5 mt-0.5" />
              <p className="text-sm leading-snug">{aiTip}</p>
            </div>
          )}
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5" />
          New Task
        </button>
      </div>
    </header>
  );
}
