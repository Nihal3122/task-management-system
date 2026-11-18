import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import {
  getTasks,
  getDashboardStats,
  updateTask,
  deleteTask,
} from "../services/taskService";
import EditTaskModal from "../components/EditTaskModal";
import DeleteTaskModal from "../components/DeleteTaskModal";
import toast from "react-hot-toast";

function Dashboard() {
  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  // Task State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dashboardStats, setDashboardStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    completionPercentage: 0,
  });
  const [editingTask, setEditingTask] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  const pageSize = 5;

  // Fetch Tasks API
  useEffect(() => {
    let isMounted = true;

    const fetchTasks = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getTasks({
          page: currentPage,
          limit: pageSize,
          search: searchTerm.trim(),
          sortBy: "createdAt",
          direction: "DESC",
        });
        console.log("data", data);

        if (isMounted) {
          setTasks(data.tasks || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalTasks(data.pagination?.totalTasks || 0);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Fetch Tasks Error:", err.response?.data || err);
          setError(err.response?.data?.message);
          setTasks([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTasks();

    return () => {
      isMounted = false;
    };
  }, [currentPage, searchTerm]);

  // Handle Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Format Task Data for Existing TaskCard
  const formattedTasks = tasks.map((task) => ({
    ...task,

    priority:
      task.priority === "LOW"
        ? "Low"
        : task.priority === "MEDIUM"
          ? "Medium"
          : "High",

    status:
      task.status === "IN_PROGRESS"
        ? "In Progress"
        : task.status === "COMPLETED"
          ? "Completed"
          : "Pending",

    date: task.dueDate
      ? new Date(`${task.dueDate.split("T")[0]}T00:00:00`).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          },
        )
      : "No due date",
  }));

  // Pagination
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Fetch Dashboard Statistics
  useEffect(() => {
    let isMounted = true;

    const fetchDashboardStats = async () => {
      try {
        const data = await getDashboardStats();

        if (isMounted) {
          setDashboardStats(data);
        }
      } catch (error) {
        console.error(
          "Dashboard Statistics Error:",
          error.response?.data || error,
        );
      }
    };

    fetchDashboardStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateTask = async (taskData) => {
    try {
      setIsUpdating(true);

      const taskId = editingTask.id ?? editingTask._id;

      await updateTask(taskId, taskData);
      toast.success("Task updated successfully!");
      // Refresh tasks
      const data = await getTasks({
        page: currentPage,
        limit: pageSize,
        search: searchTerm.trim(),
        sortBy: "createdAt",
        direction: "DESC",
      });

      setTasks(data.tasks || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalTasks(data.pagination?.totalTasks || 0);

      // Refresh dashboard statistics
      const statsData = await getDashboardStats();
      setDashboardStats(statsData);

      // Close modal
      setEditingTask(null);
    } catch (error) {
      console.error("Update Task Error:", error.response?.data || error);

      alert(error.response?.data?.message || "Failed to update task!");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;

    try {
      setIsDeleting(true);

      const taskId = deletingTask.id ?? deletingTask._id;

      await deleteTask(taskId);

      toast.success("Task deleted successfully!");

      // Refresh dashboard statistics
      const statsData = await getDashboardStats();
      setDashboardStats(statsData);

      // Refresh current task list
      const data = await getTasks({
        page: currentPage,
        limit: pageSize,
        search: searchTerm.trim(),
        sortBy: "createdAt",
        direction: "DESC",
      });

      const updatedTasks = data.tasks || [];

      setTasks(updatedTasks);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalTasks(data.pagination?.totalTasks || 0);

      // If current page becomes empty, go to previous page
      if (updatedTasks.length === 0 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      setDeletingTask(null);
    } catch (error) {
      console.error("Delete Task Error:", error.response?.data || error);

      alert(error.response?.data?.message || "Failed to delete task!");
    } finally {
      setIsDeleting(false);
    }
  };

  const displayPage = totalPages > 0 ? currentPage : 1;

  return (
    <div>
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Overview</h2>

          <p className="text-sm text-slate-500 mt-1">
            Track and manage all your tasks in one place.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[
          {
            title: "Total Tasks",
            count: dashboardStats.totalTasks,
            color: "bg-indigo-100 text-indigo-600",
            icon: "📋",
          },
          {
            title: "Completed",
            count: dashboardStats.completedTasks,
            color: "bg-green-100 text-green-600",
            icon: "✅",
          },
          {
            title: "In Progress",
            count: dashboardStats.inProgressTasks,
            color: "bg-blue-100 text-blue-600",
            icon: "⏳",
          },
          {
            title: "Pending",
            count: dashboardStats.pendingTasks,
            color: "bg-yellow-100 text-yellow-600",
            icon: "📝",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{item.title}</p>

                <h3 className="text-3xl font-bold text-slate-800 mt-2">
                  {item.count ?? 0}
                </h3>
              </div>

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${item.color}`}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        {/* Table Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Recent Tasks
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Your latest activities
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full border border-slate-200 rounded-lg pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Task</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-indigo-600"
                  >
                    Loading tasks...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : formattedTasks.length > 0 ? (
                formattedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(task) => setEditingTask(task)}
                    onDelete={(task) => setDeletingTask(task)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <p className="text-slate-500 font-medium">
                      No tasks found!
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Try searching with another keyword.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Showing {tasks.length} of {totalTasks} tasks
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="text-sm text-slate-600">
              Page {displayPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={
                currentPage >= totalPages || loading || totalTasks === 0
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={handleUpdateTask}
          loading={isUpdating}
        />
      )}

      {deletingTask && (
        <DeleteTaskModal
          task={deletingTask}
          onClose={() => setDeletingTask(null)}
          onConfirm={handleDeleteTask}
          loading={isDeleting}
        />
      )}
    </div>
  );
}

export default Dashboard;
