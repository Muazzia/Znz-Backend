const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const users = require("./userModel");

const postModel = sequelize.define(
  "post",
  {
    postID: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "email",
      },
      onDelete: "CASCADE",
    },
    postText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    images: {
      type: DataTypes.TEXT, // or DataTypes.JSON, depending on your preference
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("images");
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue("images", value ? JSON.stringify(value) : null);
      },
    },
  },
  {
    tableName: "posts",
    timestamps: true,
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("postModel synchronized with the database(znz).");
  })
  .catch((error) => {
    console.error("Error synchronizing postModel", error);
  });

module.exports = postModel;
