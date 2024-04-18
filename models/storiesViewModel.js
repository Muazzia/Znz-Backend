const { DataTypes } = require('sequelize')
const sequelize = require('.././database/connection');

const storyViewModel = sequelize.define('storyView', {
    storyId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
});




sequelize
    .sync()
    .then(() => {
        console.log("StoryViewModel synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing StoryViewModel", error);
    });


module.exports = storyViewModel