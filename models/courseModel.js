const { DataTypes } = require('sequelize')

const sequelize = require('../database/connection')

const courseModel = sequelize.define("courses", {
    courseId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    images: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    details: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['pending', 'accepted', 'rejected']
    },
    authorEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'users',
            key: "email"
        }
    },
    courseOverview: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

sequelize
    .sync()
    .then(() => {
        console.log("courseModel synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing courseModel", error);
    });


module.exports = courseModel
