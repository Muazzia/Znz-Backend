const userModel = require("../models/userModel");
const userDetailsModel = require("../models/userAdditionalInformation");
const postModel = require("../models/postModel");
const storyModel = require('../models/storiesModel')
const storyViewModel = require('../models/storiesViewModel')
const courseModel = require('../models/courseModel')
const followerModel = require("../models/followerModel")
const productModel = require("../models/product");
const courseParentCategory = require("../models/courseParentCategory");
const courseSubCategory = require("../models/courseSubCategory");
const courseSubCategoryBridge = require("../models/courseSubCategoryBridge");
const productParentCategory = require("../models/productParentCategory");
const productSubCategory = require("../models/productSubCategory");
const productSubCategoryBridge = require("../models/productSubCategoryBridge");
const postinterestBridge = require("../models/postInterestBridge");
const interest = require("../models/interestModel");

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


// courses
// course to parentCategory
courseModel.belongsTo(courseParentCategory, { foreignKey: 'parentCategory', targetKey: "courseParentCategoryId" })

// course to subCategory with brige table
courseModel.belongsToMany(courseSubCategory, { through: courseSubCategoryBridge, as: 'subCategories', foreignKey: 'courseId' });
courseSubCategory.belongsToMany(courseModel, { through: courseSubCategoryBridge, as: 'courses', foreignKey: 'subCategoryId' });

// course sub category to course parent category
courseSubCategory.belongsTo(courseParentCategory, { foreignKey: "parentCategoryId", targetKey: "courseParentCategoryId" })


// products
// product to parentCategory
productModel.belongsTo(productParentCategory, { foreignKey: 'parentCategory', targetKey: "productParentCategoryId" })

// // product to subCategory with brige table
productModel.belongsToMany(productSubCategory, { through: productSubCategoryBridge, as: 'subCategories', foreignKey: 'productId' });
productSubCategory.belongsToMany(productModel, { through: productSubCategoryBridge, as: 'products', foreignKey: 'subCategoryId' });

// // product sub category to course parent category
productSubCategory.belongsTo(productParentCategory, { foreignKey: "parentCategoryId", targetKey: "productParentCategoryId" })


//interest post
postModel.belongsToMany(interest, { through: postinterestBridge, foreignKey: "postID" });
interest.belongsToMany(postModel, { through: postinterestBridge, foreignKey: "interestId" });

interest.belongsToMany(postModel, { through: postinterestBridge, foreignKey: "interestId" });
postModel.belongsToMany(interest, { through: postinterestBridge, foreignKey: "postID" });