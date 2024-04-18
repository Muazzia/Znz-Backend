const userModel = require("../models/userModel");
const userDetailsModel = require("../models/userAdditionalInformation");
const postModel = require("../models/postModel");
const storyModel = require('../models/storiesModel')
const storyViewModel = require('../models/storiesViewModel')
const courseModel = require('../models/courseModel')
const followerModel = require("../models/followerModel")
const productModel = require("../models/product")
// const storyModel = require("../models/storiesModel")

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
  foreignKey: "email",
  onDelete: "CASCADE"
});
postModel.belongsTo(userModel, {
  foreignKey: "email",
  onDelete: "CASCADE"
});



//

storyViewModel.belongsTo(storyModel, { foreignKey: 'storyId', onDelete: 'CASCADE' });
// // Define association between StoryView and User
storyViewModel.belongsTo(userModel, { foreignKey: 'userEmail', onDelete: 'CASCADE' });

// // Define association between Story and StoryView (optional)
storyModel.hasMany(storyViewModel, { foreignKey: 'storyId' });


// courseModel association between userModel
courseModel.belongsTo(userModel, { foreignKey: 'authorEmail', targetKey: 'email' });


// follower model association with user
followerModel.belongsTo(userModel, { foreignKey: 'userEmail', targetKey: 'email' });
followerModel.belongsTo(userModel, { foreignKey: 'followingEmail', targetKey: 'email' });


// product model association with user
productModel.belongsTo(userModel, { foreignKey: 'authorEmail', targetKey: 'email' });

// story model association with user
storyModel.belongsTo(userModel, { foreignKey: 'userEmail', targetKey: 'email' });


