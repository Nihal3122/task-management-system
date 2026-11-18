import React from "react";

function DeleteTaskModal({ task, onClose, onConfirm, loading }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
          🗑️
        </div>

        {/* Content */}
        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold text-slate-800">Delete Task?</h2>

          <p className="mt-2 text-sm text-slate-500">
            Are you sure you want to delete
            <span className="font-semibold text-slate-800"> {task.title}</span>?
          </p>

          <p className="mt-2 text-xs text-red-500">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTaskModal;
