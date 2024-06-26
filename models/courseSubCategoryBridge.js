const { DataTypes } = require('sequelize')
const sequelize = require('../database/connection')


const courseSubCategoryBridge = sequelize.define("courseSubCategoryBridge", {
    courseSubCategoryBridgeId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "courses",
            key: "courseId"
        },
        onDelete: "CASCADE"
    },
    subCategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "courseSubCategory",
            key: "courseSubCategoryId"
        },
        onDelete: "CASCADE"

    }
})

sequelize
    .sync()
    .then(() => {
        console.log("courseSubCategoryBridge synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing courseSubCategoryBridge", error);
    });

module.exports = courseSubCategoryBridge