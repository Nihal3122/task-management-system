import api from "./api";

export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

// Get Tasks with Search and Pagination
export const getTasks = async (params = {}) => {
  const response = await api.get("/tasks", {
    params,
  });

  return response.data;
};

// Get Dashboard Statistics
export const getDashboardStats = async () => {
  const response = await api.get("/tasks/dashboard");
  return response.data;
};

// Update Task
export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

// Delete Task
export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};
