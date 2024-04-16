const { DataTypes } = require('sequelize')
const sequelize = require('.././database/connection');
const userModel = require('./userModel');
const StoryModel = require("./storiesModel")

const storyViewModel = sequelize.define('storyView', {
    // viewId: {
    //     type: DataTypes.UUID,
    //     allowNull: false,
    //     defaultValue: DataTypes.UUIDV4,
    //     primaryKey: true
    // },
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

// storiesModel.belongsTo(userModel, { foreignKey: 'userEmail', targetKey: 'email' });



sequelize
    .sync()
    .then(() => {
        console.log("StoryViewModel synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing StoryViewModel", error);
    });


module.exports = storyViewModel