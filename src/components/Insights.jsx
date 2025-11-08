import React, { useEffect, useMemo, useState } from 'react';
import { Brain, Timer } from 'lucide-react';

export default function Insights({ tasks, onNudge }) {
  const [message, setMessage] = useState('');

  // Simple AI-ish insight based on overdue & critical tasks
  const tip = useMemo(() => {
    const now = new Date();
    const overdueCritical = tasks.filter(t => t.status !== 'done' && t.focus === 'critical' && t.due_date && new Date(t.due_date) < now);
    if (overdueCritical.length) return `You have ${overdueCritical.length} critical overdue task${overdueCritical.length>1?'s':''}. Tackle them first.`;
    const manyInProgress = tasks.filter(t => t.status === 'inprogress').length;
    if (manyInProgress > 3) return `You have ${manyInProgress} items in progress. Consider finishing a few before adding more.`;
    return 'Plan your next 2 hours: pick one high-focus item and one quick win.';
  }, [tasks]);

  useEffect(() => setMessage(tip), [tip]);

  // 48h in-progress notifier
  const longRunning = useMemo(() => {
    const now = Date.now();
    const twoDays = 48 * 60 * 60 * 1000;
    return tasks.filter(t => t.status === 'inprogress' && t.updated_at && (now - new Date(t.updated_at).getTime()) > twoDays);
  }, [tasks]);

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="h-5 w-5 text-indigo-600" />
        <h3 className="font-semibold text-gray-900">Insights</h3>
      </div>
      <p className="text-sm text-gray-700">{message}</p>

      {longRunning.length > 0 && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-2 text-amber-800">
            <Timer className="h-4 w-4" />
            <p className="font-medium">In-progress for 48h+</p>
          </div>
          <ul className="mt-2 list-disc pl-6 text-sm text-amber-900">
            {longRunning.map(t => (
              <li key={t._id || t.id} className="flex items-center justify-between gap-2">
                <span>{t.title}</span>
                <button onClick={() => onNudge(t)} className="text-amber-800 underline">Provide reason</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
