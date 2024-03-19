const { DataTypes } = require('sequelize')
const sequelize = require('../database/connection')


const categoryModel = sequelize.define("category", {
    categoryId: {
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
        console.log("categoryModel synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing categoryModel", error);
    });

module.exports = categoryModel