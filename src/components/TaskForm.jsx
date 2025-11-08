import React, { useEffect, useState } from 'react';

const focusLevels = ['low', 'medium', 'high', 'critical'];
const statuses = ['inprogress', 'postponed', 'cancelled', 'done'];

export default function TaskForm({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    focus: 'medium',
    status: 'inprogress',
    due_date: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        focus: initialData.focus || 'medium',
        status: initialData.status || 'inprogress',
        due_date: initialData.due_date ? initialData.due_date.substring(0, 10) : ''
      });
    } else {
      setForm({ title: '', description: '', focus: 'medium', status: 'inprogress', due_date: '' });
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, due_date: form.due_date ? new Date(form.due_date).toISOString() : null });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initialData ? 'Edit Task' : 'New Task'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input name="title" value={form.title} onChange={handleChange} required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Focus</label>
              <select name="focus" value={form.focus} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2">
                {focusLevels.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2">
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input type="date" name="due_date" value={form.due_date} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"/>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-gray-700">Cancel</button>
            <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
