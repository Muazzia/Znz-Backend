const userModel = require("../models/userModel");
const userDetailsModel = require("../models/userAdditionalInformation");
const postModel = require("../models/postModel");
const likePostModel = require("../models/likepostModel");

console.log("association called")

// Define association between users and userDetails
userDetailsModel.belongsTo(userModel, {
  foreignKey: "email",
  onDelete: "CASCADE",
});

userModel.hasOne(userDetailsModel, {
  foreignKey: "email",
  onDelete: "CASCADE",
});

// association between users and posts
userModel.hasMany(postModel, {
  foreignKey: "email"
});
postModel.belongsTo(userModel, {
  foreignKey: "email",
});
