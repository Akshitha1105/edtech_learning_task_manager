import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../state/AuthContext';

const TaskForm = ({ onCreated }) => {
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (user?.role === "teacher") {
        try {
          const res = await apiClient.get("/auth/students-of-teacher");
          if (res.data.success) {
            setStudents(res.data.data);
          }
        } catch {
          // ignore
        }
      }
    };

    fetchStudents();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        title,
        description,
      };

      // Teacher must assign to student
      if (user?.role === "teacher") {
        payload.studentId = studentId;
      }

      if (dueDate) {
        payload.dueDate = dueDate;
      }

      const res = await apiClient.post('/tasks', payload);

      if (res.data.success) {
        onCreated(res.data.data);
        setTitle('');
        setDescription('');
        setDueDate('');
        setStudentId('');
      } else {
        setError(res.data.message || 'Failed to create task');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* TEACHER — Select student */}
      {user?.role === "teacher" && (
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-200">
            Assign to student
          </label>
          <select
            required
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Select a student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.email}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* TITLE */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-200">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Finish chapter 3 notes"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-200">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
          placeholder="Optional details about this task..."
        />
      </div>

      {/* DUE DATE */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-200">Due date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:hover:bg-emerald-500 transition-colors px-3 py-2 text-xs font-medium text-slate-900"
      >
        {loading ? 'Adding...' : 'Add task'}
      </button>
    </form>
  );
};

export default TaskForm;
