import React from 'react';
import TaskRow from './TaskRow';

const TaskList = ({ tasks, onUpdated, onDeleted }) => {
  if (!tasks.length) {
    return <p className="text-sm text-slate-400">No tasks yet.</p>;
  }

  return (
    <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
      {tasks.map((task) => (
        <TaskRow
          key={task._id}
          task={task}
          onUpdated={onUpdated}
          onDeleted={onDeleted}
        />
      ))}
    </div>
  );
};

export default TaskList;
