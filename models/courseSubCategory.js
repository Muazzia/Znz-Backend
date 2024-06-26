const { DataTypes } = require('sequelize')
const sequelize = require('../database/connection')

const courseSubCategory = sequelize.define("courseSubCategory", {
    courseSubCategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parentCategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "courseparentcategories",
            key: "courseParentCategoryId"
        },
        onDelete: "CASCADE"
    }
})

sequelize
    .sync()
    .then(() => {
        console.log("courseSubCategory synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing courseSubCategory", error);
    });

module.exports = courseSubCategory