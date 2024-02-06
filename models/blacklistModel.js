const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Token = sequelize.define("tokens", {
  tokenID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("blacklistModel synchronized with the database(znz).");
  })
  .catch((error) => {
    console.error("Error synchronizing blacklistModel", error);
});

module.exports = Token;
