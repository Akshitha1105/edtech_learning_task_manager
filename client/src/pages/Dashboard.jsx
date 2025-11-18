import React, { useEffect, useMemo, useState } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../state/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchTasks = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.get('/tasks');
      if (res.data.success) {
        setTasks(res.data.data || []);
      } else {
        setError(res.data.message || 'Failed to load tasks');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = (task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const handleTaskUpdated = (updated) => {
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  };

  const handleTaskDeleted = (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter((t) => t.progress === filter);
  }, [tasks, filter]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">
            Welcome, {user?.email}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Role:{' '}
            <span className="font-medium text-emerald-400 uppercase">
              {user?.role}
            </span>
          </p>
          {user?.role === 'student' && (
            <p className="text-xs text-slate-400 mt-1">
              Assigned teacher:{' '}
              <span className="font-medium text-slate-200">
                {user?.teacher?.email || user?.teacherId || 'Not linked'}
              </span>
            </p>
          )}
        </div>
        <button
          onClick={logout}
          className="self-start md:self-auto rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
        >
          Logout
        </button>
      </header>

      <section className="grid md:grid-cols-[1fr,1.4fr] gap-6 items-start">

  {/* TEACHER CAN CREATE TASKS */}
  {user?.role === "teacher" && (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl">
      <h2 className="text-base font-semibold text-slate-100 mb-3">
        Add new task
      </h2>
      <TaskForm onCreated={handleTaskCreated} />
    </div>
  )}

  {/* TASK LIST ALWAYS SHOWN */}
  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl">
    <div className="flex items-center justify-between gap-3 mb-4">
      <h2 className="text-base font-semibold text-slate-100">
        Your tasks
      </h2>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      >
        <option value="all">All</option>
        <option value="not-started">Not started</option>
        <option value="in-progress">In progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
    {error && (
      <div className="mb-3 text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">
        {error}
      </div>
    )}
    {loading ? (
      <p className="text-sm text-slate-400">Loading tasks...</p>
    ) : (
      <TaskList
        tasks={filteredTasks}
        onUpdated={handleTaskUpdated}
        onDeleted={handleTaskDeleted}
        refetch={fetchTasks}
      />
    )}
  </div>



        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-semibold text-slate-100">
              Your tasks
            </h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All</option>
              <option value="not-started">Not started</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {error && (
            <div className="mb-3 text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-slate-400">Loading tasks...</p>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onUpdated={handleTaskUpdated}
              onDeleted={handleTaskDeleted}
              refetch={fetchTasks}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
