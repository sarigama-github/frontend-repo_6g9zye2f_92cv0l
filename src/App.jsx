import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskBoard from './components/TaskBoard';
import Insights from './components/Insights';
import Spline from '@splinetool/react-spline';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND}/tasks`);
      if (!res.ok) throw new Error('Failed to load tasks');
      const data = await res.json();
      // Map pending->inprogress compatibility in case backend returns 'pending'
      const normalized = data.map(t => ({ ...t, status: t.status === 'pending' ? 'inprogress' : t.status }));
      setTasks(normalized);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSave = async (payload) => {
    try {
      const body = editing ? { ...editing, ...payload } : payload;
      const url = editing ? `${BACKEND}/tasks/${editing.id || editing._id}` : `${BACKEND}/tasks`;
      const method = editing ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Save failed');
      setOpenForm(false);
      setEditing(null);
      fetchTasks();
    } catch (e) {
      alert(e.message);
    }
  };

  // Require reason when moving to cancelled or postponed
  const promptReasonIfNeeded = async (targetStatus) => {
    if (['cancelled', 'postponed'].includes(targetStatus)) {
      const reason = window.prompt(`Provide a reason for marking this task as ${targetStatus}:`);
      if (!reason || !reason.trim()) return null;
      return reason.trim();
    }
    return '';
  };

  const updateStatus = async (task, status) => {
    try {
      let meta = {};
      const reason = await promptReasonIfNeeded(status);
      if (reason === null) return; // aborted
      if (reason) meta.reason = reason;
      const url = `${BACKEND}/tasks/${task.id || task._id}`;
      const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, ...meta }) });
      if (!res.ok) throw new Error('Update failed');
      fetchTasks();
    } catch (e) {
      alert(e.message);
    }
  };

  const deleteTask = async (task) => {
    if (!confirm('Delete this task?')) return;
    try {
      const url = `${BACKEND}/tasks/${task.id || task._id}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchTasks();
    } catch (e) {
      alert(e.message);
    }
  };

  const aiTip = useMemo(() => {
    const critical = tasks.filter(t => t.status !== 'done' && t.focus === 'critical');
    if (critical.length) return `Focus on ${critical.length} critical task${critical.length>1?'s':''} first.`;
    return '';
  }, [tasks]);

  const handleNudge = async (task) => {
    const reason = window.prompt('This has been in progress for 48h+. Provide a reason for delay:');
    if (!reason || !reason.trim()) return;
    try {
      const url = `${BACKEND}/tasks/${task.id || task._id}`;
      const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ delay_reason: reason.trim() }) });
      if (!res.ok) throw new Error('Failed to save reason');
      fetchTasks();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-indigo-50 to-white">
      <div className="absolute inset-x-0 top-0 h-64">
        <Spline scene="https://prod.spline.design/LU2mWMPbF3Qi1Qxh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-white/70 to-white" />
      </div>

      <div className="relative z-10 pt-40 pb-10">
        <Header onAdd={() => { setEditing(null); setOpenForm(true); }} aiTip={aiTip} />
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-700">{error}</div>}
          {loading ? (
            <p className="text-gray-600">Loading tasks...</p>
          ) : (
            <TaskBoard
              tasks={tasks}
              onEdit={(t) => { setEditing(t); setOpenForm(true); }}
              onQuickAction={(t, s) => updateStatus(t, s)}
              onDelete={deleteTask}
            />
          )}
          <Insights tasks={tasks} onNudge={handleNudge} />
        </div>
      </div>

      <TaskForm
        open={openForm}
        onClose={() => { setOpenForm(false); setEditing(null); }}
        onSave={handleSave}
        initialData={editing}
      />
    </div>
  );
}
