const User = require("./User");
const Task = require("./Task");

// User - Task relationship
User.hasMany(Task, {
  foreignKey: {
    name: "userId",
    field: "userId",
    allowNull: false,
  },
  as: "tasks",
  onDelete: "CASCADE",
});

// Task - User relationship
Task.belongsTo(User, {
  foreignKey: {
    name: "userId",
    field: "userId",
    allowNull: false,
  },
  as: "user",
});

module.exports = { User, Task };
