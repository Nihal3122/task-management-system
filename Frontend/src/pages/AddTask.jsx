import React, { useState } from "react";
import { createTask } from "../services/taskService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const initialFormData = {
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "PENDING",
  dueDate: "",
};

const AddTask = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Reset Form
  const handleReset = () => {
    setFormData(initialFormData);
    setError("");
    setSuccess("");
  };

  // Handle Create Task API
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    setLoading(true);

    try {
      const data = await createTask(formData);

      setSuccess(data.message);
      toast.success("Task created successfully!");
      navigate("/dashboard");
      setFormData(initialFormData);
    } catch (error) {
      console.error("Create Task Error:", error.response?.data || error);

      setError(error.response?.data?.message || "Failed to create task!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add New Task</h1>

        <p className="text-gray-500 mt-1">
          Create and organize your tasks efficiently.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your task..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Success Message */}
          {success && <p className="text-green-600 text-sm mt-5">{success}</p>}

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-5">{error}</p>}

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition font-medium shadow-sm"
            >
              {loading ? "Creating..." : "+ Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
