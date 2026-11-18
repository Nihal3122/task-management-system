
const User = require("./User");
const Task = require("./Task");

User.hasMany(Task, {
    foreignKey: {
        name: "userId",
        field: "user_id",
        allowNull: false
    },
    as: "tasks",
    onDelete: "CASCADE"
});

Task.belongsTo(User, {
    foreignKey: {
        name: "userId",
        field: "user_id",
        allowNull: false
    },
    as: "user"
});

module.exports = { User, Task };
