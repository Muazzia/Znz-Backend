const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const postLikeModel = sequelize.define("likes", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "users",
      key: "email",
    },
    onDelete: "CASCADE"
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "posts",
      key: "postID"
    },
    onDelete: "CASCADE"
  }
});

sequelize
  .sync()
  .then(() => {
    console.log("likePostModel synchronized with the database(znz).");
  })
  .catch((error) => {
    console.error("Error synchronizing likePostModel", error);
  });

module.exports = postLikeModel;
