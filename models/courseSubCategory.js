const { DataTypes } = require('sequelize')
const sequelize = require("../database/connection")

const subCategory = sequelize.define('subCategory', {
    subCategoryId: {
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
        console.log("SubCategory synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing SubCategory", error);
    });

module.exports = subCategory