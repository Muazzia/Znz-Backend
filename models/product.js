const sequelize = require("../database/connection.js")
const { DataTypes } = require('sequelize')
const userModel = require('./userModel.js')

const productModel = sequelize.define('products', {
    productId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    images: {
        type: DataTypes.TEXT, // or DataTypes.JSON, depending on your preference
        allowNull: true,
        get() {
            const rawValue = this.getDataValue("images");
            return rawValue ? JSON.parse(rawValue) : null;
        },
        set(value) {
            this.setDataValue("images", value ? JSON.stringify(value) : null);
        },
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parentCategory: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "productparentcategories",
            key: 'productParentCategoryid'
        }
    },
    authorEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            key: 'email',
            model: userModel
        }
    }
})



module.exports = productModel