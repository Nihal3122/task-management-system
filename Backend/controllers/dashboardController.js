const { fn, col, literal } = require("sequelize");
const Task = require("../models/Task");

const getDashboardStats = async (req, res) => {
  try {
    const stats = await Task.findAll({
      attributes: [
        [fn("COUNT", col("id")), "totalTasks"],

        [
          fn(
            "SUM",
            literal("CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END"),
          ),
          "completedTasks",
        ],

        [
          fn("SUM", literal("CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END")),
          "pendingTasks",
        ],

        [
          fn(
            "SUM",
            literal("CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END"),
          ),
          "inProgressTasks",
        ],

        [
          fn("SUM", literal("CASE WHEN priority = 'HIGH' THEN 1 ELSE 0 END")),
          "highPriorityTasks",
        ],

        [
          fn("SUM", literal("CASE WHEN priority = 'MEDIUM' THEN 1 ELSE 0 END")),
          "mediumPriorityTasks",
        ],

        [
          fn("SUM", literal("CASE WHEN priority = 'LOW' THEN 1 ELSE 0 END")),
          "lowPriorityTasks",
        ],
      ],
      where: {
        userId: req.user.userId,
      },
      raw: true,
    });

    const result = stats[0];

    const totalTasks = Number(result.totalTasks || 0);
    const completedTasks = Number(result.completedTasks || 0);

    const completionPercentage =
      totalTasks === 0
        ? 0
        : Number(((completedTasks / totalTasks) * 100).toFixed(2));

    return res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks: Number(result.pendingTasks || 0),
      inProgressTasks: Number(result.inProgressTasks || 0),
      highPriorityTasks: Number(result.highPriorityTasks || 0),
      mediumPriorityTasks: Number(result.mediumPriorityTasks || 0),
      lowPriorityTasks: Number(result.lowPriorityTasks || 0),
      completionPercentage,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
};

module.exports = { getDashboardStats };
