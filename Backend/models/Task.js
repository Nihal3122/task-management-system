
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Task = sequelize.define("Task", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    priority: {
        type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
        defaultValue: "MEDIUM"
    },

    status: {
        type: DataTypes.ENUM(
            "PENDING",
            "IN_PROGRESS",
            "COMPLETED"
        ),
        defaultValue: "PENDING"
    },

    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "due_date"
    }
}, {
    tableName: "tasks",
    timestamps: true,
    underscored: false
});

module.exports = Task;
