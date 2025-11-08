import { PlusCircle, Brain } from "lucide-react";

export default function Header({ onAdd }) {
  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600 text-white grid place-items-center font-bold">TM</div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Ultimate Task Manager</h1>
            <p className="text-xs text-gray-500">Prioritize. Focus. Finish.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 transition"
          >
            <PlusCircle className="h-4 w-4" />
            New Task
          </button>
        </div>
      </div>
    </header>
  );
}
