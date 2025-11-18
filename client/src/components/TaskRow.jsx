import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../state/AuthContext';

const PROGRESS_LABELS = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  completed: 'Completed',
};

const TaskRow = ({ task, onUpdated, onDeleted }) => {
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const canEdit = task.userId === user?.id || task.userId === user?._id;

  const handleProgressChange = async (e) => {
    const newProgress = e.target.value;
    if (!canEdit) return;
    setError('');
    setUpdating(true);
    try {
      const res = await apiClient.put(`/tasks/${task._id}`, {
        progress: newProgress,
      });
      if (res.data.success) {
        onUpdated(res.data.data);
      } else {
        setError(res.data.message || 'Failed to update task');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!canEdit) return;
    if (!window.confirm('Delete this task?')) return;

    setError('');
    setDeleting(true);
    try {
      const res = await apiClient.delete(`/tasks/${task._id}`);
      if (res.data.success) {
        onDeleted(task._id);
      } else {
        setError(res.data.message || 'Failed to delete task');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  const createdFor = task.userId === user?.id || task.userId === user?._id ? 'You' : 'Student';

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-xs flex flex-col gap-1.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-50">{task.title}</h3>
          {task.description && (
            <p className="text-[11px] text-slate-400 mt-0.5 whitespace-pre-line">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <select
            value={task.progress}
            onChange={handleProgressChange}
            disabled={!canEdit || updating}
            className="rounded-lg bg-slate-900 border border-slate-700 px-2 py-1 text-[11px] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {Object.entries(PROGRESS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {canEdit && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-[11px] text-red-300 hover:text-red-200"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-1.5">
        <p className="text-[10px] text-slate-500">
          Progress:{' '}
          <span className="text-slate-300">
            {PROGRESS_LABELS[task.progress] || task.progress}
          </span>
        </p>
        <p className="text-[10px] text-slate-500">
          Owner: <span className="text-slate-300">{createdFor}</span>
        </p>
      </div>

      {task.dueDate && (
        <p className="text-[10px] text-slate-500">
          Due:{' '}
          <span className="text-slate-300">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </p>
      )}

      {error && <p className="text-[10px] text-red-400 mt-1.5">{error}</p>}
    </div>
  );
};

export default TaskRow;
