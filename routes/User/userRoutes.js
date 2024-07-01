const express = require("express");
const userRoutes = express.Router();

const { forgotPassword, setPassword, userDashboard, logout, additionalUserDetails, addProfilePic, getUserExtraDetails, changePassword, addCoverPic, addUserDetails, updateUserPersonalInfo, getUserData, updateAdditionalUserDetails } = require("../../controller/User/userController")
const { checkJWT } = require("../../middleware/authenticationMiddleware");
const checkPreviousToken = require("../../middleware/previousToken");
const { handleMulterUpload } = require("../../middleware/multer");

userRoutes.route("/get-user/:email").get(checkPreviousToken, checkJWT, getUserData)


userRoutes.route("/forgot-password").patch(forgotPassword);
userRoutes.route("/setnew-password").patch(checkPreviousToken, checkJWT, setPassword);
userRoutes.route('/change-password').patch(checkPreviousToken, checkJWT, changePassword)

userRoutes.route("/dashboard").get(checkJWT, checkPreviousToken, userDashboard)
userRoutes.route("/logout").post(checkPreviousToken, checkJWT, logout);

userRoutes.route("/add-details").post(checkPreviousToken, checkJWT, additionalUserDetails);
userRoutes.route('/update-details').put(checkPreviousToken, checkJWT, updateAdditionalUserDetails)
userRoutes.route('/user-details').patch(checkPreviousToken, checkJWT, addUserDetails)
userRoutes.route('/user-extradetails').get(checkPreviousToken, checkJWT, getUserExtraDetails)
userRoutes.route('/user-personal').put(checkPreviousToken, checkJWT, updateUserPersonalInfo)


userRoutes.route('/profilepic').patch(checkPreviousToken, checkJWT, handleMulterUpload("profilePic", true), addProfilePic)
userRoutes.route('/coverPic').patch(checkPreviousToken, checkJWT, handleMulterUpload("coverPic", true), addCoverPic)


module.exports = userRoutes