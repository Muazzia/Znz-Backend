const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const userDetailsModel = require('./userAdditionalInformation');
const interest = require('./interestModel');

const userInterest = sequelize.define("userInterest", {
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: userDetailsModel,
            key: 'email'
        },
        onDelete: 'CASCADE',
        primaryKey: true
    },
    interestId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: interest,
            key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
    }
});


sequelize
    .sync()
    .then(() => {
        console.log("userInterest synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing userInterest", error);
    });

module.exports = userInterest;
