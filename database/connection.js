// database connection
const DB = process.env.databaseName
const { Sequelize, DataTypes } = require("sequelize");

// database name znz, username root , password null (empty), host localhost
const sequelize = new Sequelize(DB, "root", process.env.DATABASE_PASSWORD, {
  host: "localhost",
  dialect: "mysql",
  // logging: false
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected to znz=>");
  })
  .catch((error) => {
    console.error("something went wrong, DB not connected!");
  });

module.exports = sequelize;
