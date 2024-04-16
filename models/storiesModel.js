const { DataTypes } = require('sequelize')
const sequelize = require('.././database/connection');
const userModel = require('./userModel');

const storiesModel = sequelize.define('stories', {
    storyId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'users',
            key: "email"
        },
        onDelete: 'CASCADE'
    },
    storyImage: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

storiesModel.belongsTo(userModel, { foreignKey: 'userEmail', targetKey: 'email' });



sequelize
    .sync()
    .then(() => {
        console.log("StoryModel synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing StoryModel", error);
    });


module.exports = storiesModel