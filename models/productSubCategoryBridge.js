const { DataTypes } = require('sequelize')
const sequelize = require('../database/connection')


const productSubCategoryBridge = sequelize.define("productSubCategoryBridge", {
    courseSubCategoryBridgeId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "products",
            key: "productId"
        }
    },
    subCategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "productSubCategories",
            key: "productSubCategoryId"
        }
    }
})

sequelize
    .sync()
    .then(() => {
        console.log("productSubCategoryBridge synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing productSubCategoryBridge", error);
    });

module.exports = productSubCategoryBridge