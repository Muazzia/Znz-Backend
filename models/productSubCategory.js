const { DataTypes } = require('sequelize')
const sequelize = require('../database/connection')


const productSubCategory = sequelize.define("productSubCategory", {
    productSubCategoryId: {
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
            model: "productParentCategories",
            key: "productParentCategoryId"
        }
    }
})

sequelize
    .sync()
    .then(() => {
        console.log("productSubCategory synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing productSubCategory", error);
    });

module.exports = productSubCategory