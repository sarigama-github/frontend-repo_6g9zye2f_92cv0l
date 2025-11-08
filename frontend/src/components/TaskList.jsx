import { useMemo } from "react";
import { CheckCircle2, Clock, XCircle, PauseCircle, AlertTriangle } from "lucide-react";

const statusMeta = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50", ring: "ring-yellow-200" },
  postponed: { label: "Postponed", icon: PauseCircle, color: "text-blue-700", bg: "bg-blue-50", ring: "ring-blue-200" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-rose-700", bg: "bg-rose-50", ring: "ring-rose-200" },
  done: { label: "Done", icon: CheckCircle2, color: "text-green-700", bg: "bg-green-50", ring: "ring-green-200" },
};

const focusColors = {
  low: "border-gray-200",
  medium: "border-blue-200",
  high: "border-amber-300",
  critical: "border-rose-300",
};

export default function TaskList({ tasks, onUpdate, onDelete }) {
  const grouped = useMemo(() => {
    const groups = { pending: [], postponed: [], cancelled: [], done: [] };
    for (const t of tasks) groups[t.status]?.push(t);
    return groups;
  }, [tasks]);

  const renderCard = (t) => {
    const meta = statusMeta[t.status];
    const Icon = meta.icon;
    return (
      <div key={t._id}
        className={`rounded-lg border ${focusColors[t.focus]} bg-white p-4 shadow-sm hover:shadow transition ring-1 ${meta.ring}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`${meta.bg} ${meta.color} inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium`}>
              <Icon className="h-4 w-4" /> {meta.label}
            </span>
            <span className="text-xs text-gray-500 capitalize">{t.focus} focus</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onUpdate(t._id, { status: "done" })} className="text-green-600 hover:underline text-sm">Mark done</button>
            <button onClick={() => onUpdate(t._id, { status: "postponed" })} className="text-blue-600 hover:underline text-sm">Postpone</button>
            <button onClick={() => onDelete(t._id)} className="text-rose-600 hover:underline text-sm">Delete</button>
          </div>
        </div>
        <h4 className="mt-2 font-semibold">{t.title}</h4>
        {t.description && <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{t.description}</p>}
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-3">
          {t.due_date && (
            <span className="inline-flex items-center gap-1"><AlertTriangle className="h-3 w-3"/> Due {new Date(t.due_date).toLocaleString()}</span>
          )}
          <span>Created {new Date(t.created_at).toLocaleString()}</span>
        </div>
      </div>
    );
  };

  const columns = ["pending", "postponed", "cancelled", "done"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map((col) => (
        <div key={col} className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{statusMeta[col].label}</h3>
          {grouped[col].length === 0 ? (
            <div className="text-sm text-gray-400 border rounded-md p-4">
              No {statusMeta[col].label.toLowerCase()} tasks
            </div>
          ) : (
            grouped[col].map(renderCard)
          )}
        </div>
      ))}
    </div>
  );
}
