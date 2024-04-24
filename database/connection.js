// database connection
const DB = process.env.databaseName
const { Sequelize, DataTypes } = require("sequelize");

// database name znz, username root , password null (empty), host localhost
const sequelize = new Sequelize(DB, process.env.databaseUserName, process.env.databasePassword, {
  host: process.env.databaseHost,
  dialect: process.env.databaseDialect,
  logging: false
});
// dialect: "mysql",

sequelize
  .authenticate()
  .then(() => {
    console.log("connected to znz=>");
  })
  .catch((error) => {
    console.error("something went wrong, DB not connected!");
  });

module.exports = sequelize;
