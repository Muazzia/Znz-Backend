const { DataTypes } = require('sequelize')
const sequelize = require('../database/connection')


const interest = sequelize.define("interest", {
    id: {
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
        console.log("interest synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing interest", error);
    });

module.exports = interest