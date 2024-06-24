const { DataTypes } = require('sequelize')
const sequelize = require('../database/connection')


const postInterestBridge = sequelize.define("postInterestBridge", {
    postInterestBridgeId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    postId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "posts",
            key: "postID"
        }
    },
    interestId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "interests",
            key: "Id"
        }
    }
})

sequelize
    .sync()
    .then(() => {
        console.log("postInterestBridge synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing postInterestBridge", error);
    });

module.exports = postInterestBridge