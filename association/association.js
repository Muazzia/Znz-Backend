const userModel = require("../models/userModel");
const userDetailsModel = require("../models/userAdditionalInformation");
const postModel = require("../models/postModel");
const likePostModel = require("../models/likepostModel");
const storyModel = require('../models/storiesModel')
const storyViewModel = require('../models/storiesViewModel')

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
