const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const userModel = sequelize.define(
  "users",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      validate: {
        notNull: {
          msg: "Email is required.",
        },
        isEmail: {
          msg: "Invalid email format.",
        },
        customValidator(value) {
          if (!/@/.test(value)) {
            throw new Error("Email must contain @ symbol.");
          }

          const allowedDomains = [
            "gmail.com",
            "yahoo.com",
            "hotmail.com",
            "icloud.com",
            "outlook.com",
          ];
          const domain = value.split("@")[1];

          if (!allowedDomains.includes(domain)) {
            throw new Error("Invalid email domain!");
          }
        },
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "First name is required.",
        },
        len: {
          args: [3, 255],
          msg: "The firstName should be between 3 and 255 characters.",
        },
        validationForFirstName: function (value) {
          if (/[{};"'~!@#$%^&*()_+=123456789/*\-+]/.test(value)) {
            throw new Error(
              "Special characters or numeric values are not allowed in firstName."
            );
          }
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Last name is required.",
        },
        len: {
          args: [3, 255],
          msg: "The lastName should be between 3 and 255 characters.",
        },
        validationForLastName: function (value) {
          if (/[{};"'~!@#$%^&*()_+=123456789/*\-+]/.test(value)) {
            throw new Error(
              "Special characters or numeric values are not allowed in lastName."
            );
          }
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        len: {
          args: [6, 255],
          msg: "Password should be between 6 and 255 characters.",
        },
      },
    },
    googleUser: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    // Add other columns as needed...
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("userModel synchronized with the database(znz).");
  })
  .catch((error) => {
    console.error("Error synchronizing userModel", error);
  });

module.exports = userModel;
