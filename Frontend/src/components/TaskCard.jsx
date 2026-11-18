import React from "react";

function TaskCard({ task, onEdit, onDelete }) {
  // Priority badge styles
  const priorityStyles = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-600",
  };

  // Status badge styles
  const statusStyles = {
    Completed: "bg-green-100 text-green-600",
    "In Progress": "bg-indigo-100 text-indigo-600",
    Pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <tr className="hover:bg-slate-50 transition">
      {/* Task Details */}
      <td className="px-6 py-5">
        <p className="font-medium text-slate-800">{task.title}</p>

        <p className="text-xs text-slate-500 mt-1">{task.description}</p>
      </td>

      {/* Priority */}
      <td className="px-6 py-5">
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            priorityStyles[task.priority] || "bg-slate-100 text-slate-600"
          }`}
        >
          {task.priority}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-5">
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            statusStyles[task.status] || "bg-slate-100 text-slate-600"
          }`}
        >
          {task.status}
        </span>
      </td>

      {/* Due Date */}
      <td className="px-6 py-5 text-sm text-slate-500">{task.date}</td>

      {/* Actions */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit?.(task)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete?.(task)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default TaskCard;
