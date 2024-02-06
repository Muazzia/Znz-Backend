const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const userModel = require("./userModel");

const postLikeModel = sequelize.define("likes", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  liker_email: {
    type: DataTypes.STRING,
    allowNull: false,
    // references: {
    //   model: userModel,
    //   key: "email",
    // },
  },
  PostID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isLiked: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
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
