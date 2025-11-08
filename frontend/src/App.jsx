import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import InsightsPanel from "./components/InsightsPanel";

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ q: "", status: "", focus: "" });
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const base = import.meta.env.VITE_BACKEND_URL;
      const params = new URLSearchParams();
      if (filters.q) params.set("q", filters.q);
      if (filters.status) params.set("status", filters.status);
      if (filters.focus) params.set("focus", filters.focus);
      const res = await fetch(`${base}/tasks?${params.toString()}`);
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [filters]);

  const handleCreate = (t) => {
    setTasks((prev) => [t, ...prev]);
  };

  const updateTask = async (id, updates) => {
    try {
      const base = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${base}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("update failed");
      const data = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch (e) {
      alert("Could not update task");
    }
  };

  const deleteTask = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      const base = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${base}/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (e) {
      alert("Could not delete task");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAdd={() => setShowForm(true)} />
      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="lg:col-span-3 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              placeholder="Search tasks..."
              className="flex-1 min-w-[200px] rounded-md border px-3 py-2"
            />
            <select value={filters.status} onChange={(e) => setFilters((f)=> ({...f, status: e.target.value}))} className="rounded-md border px-3 py-2">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="postponed">Postponed</option>
              <option value="cancelled">Cancelled</option>
              <option value="done">Done</option>
            </select>
            <select value={filters.focus} onChange={(e) => setFilters((f)=> ({...f, focus: e.target.value}))} className="rounded-md border px-3 py-2">
              <option value="">All Focus</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <button onClick={fetchTasks} className="rounded-md border px-3 py-2">Refresh</button>
          </div>

          {loading ? (
            <div className="text-gray-500">Loading tasks…</div>
          ) : (
            <TaskList tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} />
          )}
        </section>
        <aside className="lg:col-span-1">
          <InsightsPanel tasks={tasks} />
        </aside>
      </main>

      {showForm && (
        <TaskForm onCreate={handleCreate} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
