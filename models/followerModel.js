const { DataTypes } = require('sequelize')

const sequelize = require('../database/connection')

const followerModel = sequelize.define('followers', {
    followerId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    followingEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'users',
            key: "email"
        }
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: "users",
            key: "email"
        }
    }
})


sequelize
    .sync()
    .then(() => {
        console.log("FollowersModel synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing FollowersModel", error);
    });

module.exports = followerModel