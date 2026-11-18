const { Task } = require("../models");
const { Op } = require("sequelize");

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    console.log("priority : ", priority);

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    if (priority && !["LOW", "MEDIUM", "HIGH"].includes(priority)) {
      return res.status(400).json({
        message: "Invalid priority",
      });
    }

    if (status && !["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      priority,
      status,
      dueDate,
      userId: req.user.userId,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error.message);

    res.status(500).json({
      message: "Failed to create task",
    });
  }
};

// GET TASKS

const getTasks = async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      dueDate,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      direction = "DESC",
    } = req.query;

    const currentPage = Number(page);
    const pageSize = Number(limit);

    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(pageSize) ||
      currentPage < 1 ||
      pageSize < 1 ||
      pageSize > 100
    ) {
      return res.status(400).json({
        message: "Invalid page or limit.",
      });
    }

    const allowedStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];
    const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Invalid task priority",
      });
    }

    const allowedSortFields = [
      "createdAt",
      "dueDate",
      "title",
      "priority",
      "status",
    ];

    const sortDirection = direction.toUpperCase();

    if (
      !allowedSortFields.includes(sortBy) ||
      !["ASC", "DESC"].includes(sortDirection)
    ) {
      return res.status(400).json({
        message: "Invalid sorting parameters",
      });
    }

    // Fetch only logged-in user's tasks
    const where = {
      userId: req.user.userId,
    };

    // Search tasks
    if (search && search.trim()) {
      where[Op.or] = [
        {
          title: {
            [Op.like]: `%${search.trim()}%`,
          },
        },
        {
          description: {
            [Op.like]: `%${search.trim()}%`,
          },
        },
      ];
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (dueDate) where.dueDate = dueDate;

    const { count, rows } = await Task.findAndCountAll({
      where,
      order: [[sortBy, sortDirection]],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });

    return res.status(200).json({
      message: "Tasks fetched successfully",
      pagination: {
        totalTasks: count,
        currentPage,
        totalPages: Math.ceil(count / pageSize),
        pageSize,
      },
      tasks: rows,
    });
  } catch (error) {
    console.error("Get Tasks Error:", error);

    return res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};

// GET TASK BY ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      task,
    });
  } catch (error) {
    console.error("Get task error:", error.message);

    res.status(500).json({
      message: "Failed to fetch task",
    });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const { title, description, priority, status, dueDate } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        message: "Task title cannot be empty",
      });
    }

    if (
      priority !== undefined &&
      !["LOW", "MEDIUM", "HIGH"].includes(priority)
    ) {
      return res.status(400).json({
        message: "Invalid priority",
      });
    }

    if (
      status !== undefined &&
      !["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    // Update only allowed fields
    await task.update({
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description }),
      ...(priority !== undefined && { priority }),
      ...(status !== undefined && { status }),
      ...(dueDate !== undefined && { dueDate }),
    });

    await task.reload();

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error.message);

    res.status(500).json({
      message: "Failed to update task",
    });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await task.destroy();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error.message);

    res.status(500).json({
      message: "Failed to delete task",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
