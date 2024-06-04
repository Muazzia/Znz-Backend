const { DataTypes } = require('sequelize')
const sequelize = require('../database/connection')


const productParentCategory = sequelize.define("productParentCategory", {
    productParentCategoryId: {
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
        console.log("productParentCategory synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing productParentCategory", error);
    });

module.exports = productParentCategory