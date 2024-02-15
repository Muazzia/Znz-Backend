const { DataTypes } = require('sequelize')
const sequelize = require('../database/connection')

const commentModel = sequelize.define('comments', {
    commentId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    commentText: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
    },
    postID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "posts",
            key: "postID"
        },
        onDelete: 'CASCADE'
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: "users",
            key: "email"
        },
        onDelete: "CASCADE"
    },

})
sequelize
    .sync()
    .then(() => {
        console.log("commentModel synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing commentModel", error);
    });

module.exports = commentModel
