const { DataTypes } = require('sequelize')
const sequelize = require('../database/connection')


const courseParentCategory = sequelize.define("courseParentCategory", {
    courseParentCategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

sequelize
    .sync()
    .then(() => {
        console.log("courseParentCategory synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing courseParentCategory", error);
    });

module.exports = courseParentCategory