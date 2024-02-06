const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const userDetailsModel = sequelize.define(
  "userDetails",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "users",
        key: "email",
      },
      onDelete: "CASCADE",
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    interests: {
        // use JSON type to store an array
      type: DataTypes.JSON,
      allowNull: true,
    //   by default, an empty array
      defaultValue: [],
    },
    gender:{
        type: DataTypes.STRING,
        allowNull: false
    }
  },
  {
    tableName: "userDetails",
    timestamps: true,
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("userDetailsModel synchronized with the database(znz).");
  })
  .catch((error) => {
    console.error("Error synchronizing userDetailsModel", error);
  });

module.exports = userDetailsModel;
