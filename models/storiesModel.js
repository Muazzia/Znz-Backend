const { DataTypes } = require('sequelize')
const sequelize = require('.././database/connection')

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
    noOfViews: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
});


sequelize
    .sync()
    .then(() => {
        console.log("StoryModel synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing StoryModel", error);
    });


module.exports = storiesModel