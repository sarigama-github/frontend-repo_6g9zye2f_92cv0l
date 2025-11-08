import React from 'react';
import { Clock, CheckCircle2, XCircle, PauseCircle, AlertTriangle } from 'lucide-react';

const statusConfig = {
  inprogress: { label: 'In Progress', icon: Clock, color: 'bg-amber-50 border-amber-200' },
  postponed: { label: 'Postponed', icon: PauseCircle, color: 'bg-slate-50 border-slate-200' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-rose-50 border-rose-200' },
  done: { label: 'Done', icon: CheckCircle2, color: 'bg-emerald-50 border-emerald-200' },
};

function Column({ title, Icon, children, color }) {
  return (
    <div className={`rounded-xl border ${color} p-4 space-y-3`}> 
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-gray-700" />
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function TaskBoard({ tasks, onEdit, onQuickAction }) {
  const groups = tasks.reduce((acc, t) => {
    const key = t.status || 'inprogress';
    acc[key] = acc[key] || [];
    acc[key].push(t);
    return acc;
  }, {});

  const card = (t) => {
    const overdue = t.due_date && new Date(t.due_date) < new Date();
    return (
      <div key={t._id || t.id} className="rounded-lg border bg-white p-3 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-gray-900">{t.title}</h4>
            {t.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{t.description}</p>}
          </div>
          {overdue && t.status !== 'done' && (
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          )}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
          <span className="px-2 py-0.5 rounded bg-gray-100 capitalize">{t.focus}</span>
          {t.due_date && <span>Due {new Date(t.due_date).toLocaleDateString()}</span>}
        </div>
        <div className="mt-3 flex items-center gap-2">
          {t.status !== 'done' && (
            <button onClick={() => onQuickAction(t, 'done')} className="text-emerald-700 hover:underline">Mark done</button>
          )}
          {t.status !== 'postponed' && (
            <button onClick={() => onQuickAction(t, 'postponed')} className="text-slate-700 hover:underline">Postpone</button>
          )}
          {t.status !== 'cancelled' && (
            <button onClick={() => onQuickAction(t, 'cancelled')} className="text-rose-700 hover:underline">Cancel</button>
          )}
          <button onClick={() => onEdit(t)} className="text-indigo-700 hover:underline ml-auto">Edit</button>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(statusConfig).map(([key, cfg]) => (
        <Column key={key} title={cfg.label} Icon={cfg.icon} color={cfg.color}>
          {(groups[key] || []).length === 0 ? (
            <p className="text-sm text-gray-500">No tasks</p>
          ) : (
            (groups[key] || []).map(card)
          )}
        </Column>
      ))}
    </div>
  );
}
