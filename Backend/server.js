const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

require("dotenv").config();

const { connectDB, sequelize } = require("./config/database");

// Load models and relationships
require("./models");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/tasks/dashboard", dashboardRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Task Management API is running!",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Create tables if they don't exist
  await sequelize.sync();

  console.log("Database tables synchronized!");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
